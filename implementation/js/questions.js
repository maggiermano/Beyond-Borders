document.addEventListener('DOMContentLoaded', function () {
    // Load GeoJSON data for US states
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(function (geoData) {
        // Load CSV data
        Papa.parse('data/mapData.csv', {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const statesData = results.data;

                // Display questions and buttons
                displayQuestions(statesData, geoData);

                // Create the map visualization
                mapVis = new MapVis('map-container', geoData, statesData);
            }
        });
    });
});

const stateNameToInitial = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
};

function displayQuestions(statesData) {
    const questionsContainer = document.getElementById('questions-container');

    const questions = [
        { key: 'politicalAffiliation', text: 'Do you prefer a red or blue state?' },
        { key: 'racialDiversity', text: 'How important is racial diversity to you?' },
        { key: 'hotOrCold', text: 'Do you prefer a warm or cool climate?' },
        { key: 'abortion', text: 'Do you care if abortion is legal?' }
        // Add more questions here
    ];

    // Calculate the number of questions per row and columns
    const questionsPerRow = 4;
    const columns = 4;

    // Iterate over questions and create rows and columns
    for (let i = 0; i < questions.length; i += questionsPerRow) {
        const questionRow = document.createElement('div');
        questionRow.className = 'row';

        // Create columns for the current row
        for (let j = i; j < i + questionsPerRow && j < questions.length; j++) {
            const colDiv = document.createElement('div');
            colDiv.className = `col-md-${Math.floor(12 / columns)}`; // Bootstrap classes for columns

            const questionDiv = createQuestionDiv(questions[j], statesData);
            colDiv.appendChild(questionDiv);

            questionRow.appendChild(colDiv);
        }

        // Add the row to the container
        questionsContainer.appendChild(questionRow);
    }

    const submitButton = createSubmitButton(statesData);
    // questionsContainer.appendChild(submitButton);
}

function createQuestionDiv(question, statesData) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'mb-3';

    const questionText = document.createElement('p');
    questionText.innerText = question.text;

    const buttons = createButtons(question.key, statesData);
    questionDiv.appendChild(questionText);
    buttons.forEach(btn => questionDiv.appendChild(btn));

    return questionDiv;
}

function createButtons(questionKey, statesData) {
    const buttonLabels = getButtonLabels(questionKey);

    return buttonLabels.map((label, index) => {
        const button = document.createElement('button');
        button.className = 'btn btn-secondary btn-block mb-2'; // Added btn-block for full-width buttons
        button.innerHTML = '<i class="bi bi-check"></i>'; // Bootstrap checkmark icon
        button.innerHTML += ` ${label}`;

        button.addEventListener('click', () => {
            const isSelected = button.classList.contains('btn-selected');

            const buttons = document.querySelectorAll(`button[data-question="${questionKey}"]`);
            buttons.forEach(btn => btn.classList.remove('btn-selected'));

            if (!isSelected) {
                button.classList.add('btn-selected');
                button.setAttribute('data-answer', index);
            } else {
                button.removeAttribute('data-answer');
            }

            // Collect selected answers for all questions
            const selectedAnswers = {
                politicalAffiliation: document.querySelector('button[data-question="politicalAffiliation"].btn-selected').getAttribute('data-answer'),
                racialDiversity: document.querySelector('button[data-question="racialDiversity"].btn-selected').getAttribute('data-answer'),
                hotOrCold: document.querySelector('button[data-question="hotOrCold"].btn-selected').getAttribute('data-answer'),
                abortion: document.querySelector('button[data-question="abortion"].btn-selected').getAttribute('data-answer')
            };

            // Enable or disable submit button based on whether all questions are answered
            const submitButton = document.getElementById('submit-button');
            submitButton.disabled = !(selectedAnswers.politicalAffiliation && selectedAnswers.racialDiversity && selectedAnswers.hotOrCold && selectedAnswers.abortion);

            // Change the color of the submit button based on the number of answered questions
            const answeredQuestions = Object.values(selectedAnswers).filter(answer => answer !== null).length;
            if (answeredQuestions === 4) {
                submitButton.classList.remove('btn-secondary');
                submitButton.classList.add('btn-success');
            } else {
                submitButton.classList.remove('btn-success');
                submitButton.classList.add('btn-secondary');
            }

            // Update the existing filteredStates
            mapVis.filteredStates = filterStatesAndDisplayResult(selectedAnswers, statesData);

            // Update the map
            mapVis.updateMap();
        });

        button.setAttribute('data-question', questionKey);

        return button;
    });
}


function getButtonLabels(questionKey) {
    switch (questionKey) {
        case 'politicalAffiliation':
            return ['Red', 'Blue'];
        case 'racialDiversity':
            return ['Very Important', 'Not So Important'];
        case 'hotOrCold':
            return ['Warm', 'Cool'];
        case 'abortion':
            return ['Yes', 'No'];
        default:
            return [];
    }
}

function createSubmitButton(statesData) {
    const submitButton = document.getElementById('submit-button');
    // submitButton.id = 'submit-button';
    submitButton.className = 'btn btn-success mt-3';
    submitButton.innerText = 'Click Here For Your Matching';
    submitButton.disabled = true;

    submitButton.addEventListener('click', () => {
        const selectedAnswers = {};

        const selectedButtons = document.querySelectorAll('.btn-selected');
        selectedButtons.forEach(btn => {
            const questionKey = btn.getAttribute('data-question');
            const answer = btn.getAttribute('data-answer');
            selectedAnswers[questionKey] = answer;
        });

        if (window.compareStateVis) {
            window.compareStateVis.resetVisualization();
        }

        const filteredStates = filterStatesAndDisplayResult(selectedAnswers, statesData);

        displayResult(filteredStates);
    });

    return submitButton;
}

function filterStatesAndDisplayResult(selectedAnswers, statesData) {
    // Start with all states
    let filteredStates = [...statesData];

    // Filter states based on political affiliation
    const politicalAffiliationValues = ['Red', 'Blue'];
    const selectedPoliticalAffiliation = politicalAffiliationValues[selectedAnswers['politicalAffiliation']];
    if (selectedPoliticalAffiliation !== null) {
        filteredStates = filteredStates.filter(state => state['politicalAffiliation'] === selectedPoliticalAffiliation);
    }

    // Filter states based on racial diversity
    const racialDiversityValues = ['Very Important', 'Not so important'];
    const selectedRacialDiversity = racialDiversityValues[selectedAnswers['racialDiversity']];
    if (selectedRacialDiversity !== null) {
        filteredStates = filteredStates.filter(state => state['racialDiversity'] === selectedRacialDiversity);
    }

    // Filter states based on climate preference
    const climateValues = ['Hot', 'Cold'];
    const selectedClimate = climateValues[selectedAnswers['hotOrCold']];
    if (selectedClimate !== null) {
        filteredStates = filteredStates.filter(state => state['hotOrCold'] === selectedClimate);
    }

    // Filter states based on abortion stance
    const abortionValues = ['Yes', 'No'];
    const selectedAbortion = abortionValues[selectedAnswers['abortion']];
    if (selectedAbortion !== null) {
        filteredStates = filteredStates.filter(state => (selectedAbortion === 'Yes' ? state['abortion'] === 'Yes' : true));
    }

    return filteredStates;
}

function displayResult(filteredStates) {
    if (filteredStates.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredStates.length);
        const selectedState = filteredStates[randomIndex];

        if (filteredStates.length > 1) {
            displayCongratsMessagePlural(selectedState.state);
        }
        else {
            displayCongratsMessageSingle(selectedState.state);
        }

        const full_event = new CustomEvent('StateSelectedFullName', { detail: selectedState.state });
        document.dispatchEvent(full_event);

        // Get the state initial from the mapping
        const stateInitial = stateNameToInitial[selectedState.state];
        if (stateInitial) {
            // Dispatch a custom event with the selected state initial
            const event = new CustomEvent('StateSelected', { detail: stateInitial });
            document.dispatchEvent(event);
        } else {
            console.error('State initial not found for', selectedState.state);
        }

    } else {
        console.error('No matching State');
    }
}

// Function to display congrats message in the next Bootstrap container
function displayCongratsMessageSingle(selectedState) {
    const congratsContainer = document.getElementById('congrats-container');
    congratsContainer.innerHTML = '';

    const congratsHeading = document.createElement('h1');
    congratsHeading.className = 'text-center congrats-heading';
    congratsHeading.innerText = `CONGRATULATIONS!`;

    const congratsHeadingTwo = document.createElement('h3');
    congratsHeadingTwo.className = 'text-center congrats-heading-two';
    congratsHeadingTwo.innerText = `YOU GOT MATCHED TO ${selectedState.toUpperCase()}`;

    const congratsParagraph = document.createElement('p')
    congratsParagraph.className = 'text-center congrats-paragraph';
    congratsParagraph.innerText = `${selectedState} is the only state you are compatible with based on your preferences.`;

    congratsContainer.appendChild(congratsHeading);
    congratsContainer.appendChild(congratsHeadingTwo);
    congratsContainer.appendChild(congratsParagraph);
}

function displayCongratsMessagePlural(selectedState) {
    const congratsContainer = document.getElementById('congrats-container');
    congratsContainer.innerHTML = '';

    const congratsHeading = document.createElement('p');
    congratsHeading.className = 'text-center congrats-heading';
    congratsHeading.innerText = `CONGRATULATIONS`;

    const congratsHeadingTwo = document.createElement('h3');
    congratsHeadingTwo.className = 'text-center congrats-heading-two';
    congratsHeadingTwo.innerText = `YOU GOT MATCHED TO ${selectedState.toUpperCase()}!`;

    const congratsParagraph = document.createElement('p')
    congratsParagraph.className = 'text-center congrats-paragraph';
    congratsParagraph.innerText = `${selectedState} is one of states you are compatible with based on your preferences.`;

    congratsContainer.appendChild(congratsHeading);
    congratsContainer.appendChild(congratsHeadingTwo);
    congratsContainer.appendChild(congratsParagraph);
}