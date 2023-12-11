document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('StateSelectedFullName', function (full_event) {
        const selectedStateFullName = full_event.detail;

        // Fetch state data and update congrats section
        fetch('data/factSheet.json')
            .then(response => response.json())
            .then(jsonData => {
                const stateData = jsonData[0][selectedStateFullName];

                updateCongratsSection(stateData);
                updateFactsSection(stateData);
                updateMatchSection(stateData);
                updateCitySection(stateData);
            })
            .catch(error => console.error('Error fetching data:', error));
    });
});

function updateCongratsSection(stateData) {
    const backgroundContainer = document.getElementById('background-container-one');
    const messageContainer = document.getElementById('message-container');

    // Clear existing content
    backgroundContainer.style.backgroundImage = 'none';
    messageContainer.innerHTML = '';

    // Display background image with adjusted opacity
    if (backgroundContainer) {
        const imageUrl = stateData.images.find(image => image.category === 'State').url;

        backgroundContainer.style.backgroundImage = `url(${imageUrl})`;
        backgroundContainer.style.backgroundSize = 'cover';
        backgroundContainer.style.backgroundPosition = 'center';
        backgroundContainer.style.height = '100vh';
        backgroundContainer.style.opacity = 0.5; // Adjust opacity as needed
    }

    const swipeText = document.createElement('p');
    swipeText.textContent = `Swipe across to learn more about ${stateData.facts.Name} >>`;
    swipeText.style.marginBottom = "0";
    messageContainer.appendChild(swipeText);

    swipeText.style.color = '#5e3023';
    swipeText.style.fontSize = '16px';
}

// function updateFactsSection(stateData) {
//     const mapContainer = document.getElementById('map-image-container');
//     const textContainer = document.getElementById('text-container');
//     const imagesContainer = document.getElementById('images-container');
//
//     mapContainer.innerHTML = '';
//     textContainer.innerHTML = '';
//     imagesContainer.innerHTML = '';
//
//     // Display Map image on the left
//     const mapImage = stateData.images.find(image => image.category === 'Map');
//     if (mapImage) {
//         const mapImgElement = document.createElement('img');
//         mapImgElement.src = mapImage.url;
//         mapImgElement.alt = `${stateData.state} Map`;
//         mapImgElement.className = 'img-fluid mb-3 map-img';
//         mapContainer.appendChild(mapImgElement);
//     }
//
//     // Display text in the center
//     const textElement = document.createElement('div');
//     textElement.className = 'text-content';
//     textContainer.appendChild(textElement);
//
//     // Display congrats text with a 5s delay
//     createFactsText(`${stateData.facts.Name} is otherwise known as the "${stateData.facts.Nickname}"!`, textElement, 0);
//
//     // Display other text with 5s delay for each
//     createFactsText(`The population of ${stateData.facts.Name} is ${stateData.facts.Population} as of 2022.`, textElement, 5);
//     createFactsText(`The capital city is ${stateData.facts.CapitalCity}.`, textElement, 10);
//     createFactsText(`${stateData.facts.KnownFor}`, textElement, 15);
//     createFactsText(`Some top tourist attractions include: ${stateData.facts.TouristAttractions}`, textElement, 20);
//
//     // Display other images on the right
//     stateData.images
//         .filter(image => image.category === 'Flag' || image.category === 'Landmarks')
//         .forEach(image => {
//             const imgElement = document.createElement('img');
//             imgElement.src = image.url;
//             imgElement.alt = `${stateData.state} ${image.category}`;
//             imgElement.className = 'img-fluid';
//             imagesContainer.appendChild(imgElement);
//         });
//
// }

function updateFactsSection(stateData) {
    const mapContainer = document.getElementById('map-image-container');
    const textContainer = document.getElementById('text-container');
    const imagesContainer = document.getElementById('images-container');

    mapContainer.innerHTML = '';
    textContainer.innerHTML = '';
    imagesContainer.innerHTML = '';

    // Display Map image on the left
    const mapImage = stateData.images.find(image => image.category === 'Map');
    if (mapImage) {
        const mapImgElement = document.createElement('img');
        mapImgElement.src = mapImage.url;
        mapImgElement.alt = `${stateData.state} Map`;
        mapImgElement.className = 'img-fluid mb-3 map-img';
        mapContainer.appendChild(mapImgElement);
    }

    // Display text in the center
    const textTitle = document.createElement('h1');
    textTitle.className = 'text-title';
    textContainer.appendChild(textTitle);

    const textElement = document.createElement('p');
    textElement.className = 'text-content';
    textContainer.appendChild(textElement);


    // Display congrats text with a 2s delay
    // Display other text with 2s delay for each
    createFactsText(`DISCOVER ${stateData.facts.Name.toUpperCase()}!`, textTitle, 0, 'discover-text');
    createFactsText(`${stateData.facts.Name} is otherwise known as the "${stateData.facts.Nickname}".`, textElement, 2);
    createFactsText(`The population of ${stateData.facts.Name} is ${stateData.facts.Population} as of 2022.`, textElement, 4);
    createFactsText(`The capital city is ${stateData.facts.CapitalCity}.`, textElement, 6);
    createFactsText(`${stateData.facts.KnownFor}!`, textElement, 8);
    createFactsText(`The top tourist attractions include ${stateData.facts.TouristAttractions}.`, textElement, 10);

    textElement.style.color = '#5e3023';
    textElement.style.fontFamily = "Roboto, sans-serif !important";
    textElement.style.fontSize = '16px';
    textElement.style.letterSpacing = '0.1em';
    textElement.style.lineHeight = "32px";
    textElement.style.textAlign = 'left';
    textTitle.style.color = '#5e3023';
    textTitle.style.fontWeight = '700'
    textTitle.style.fontFamily = "Roboto, sans-serif !important";
    textTitle.style.fontSize = '35px'
    textTitle.style.letterSpacing = '0.2em';
    textElement.style.lineHeight = "32px";
    textElement.style.textAlign = 'left';

    /*// Display other images on the right side by side
    const imagesFlexContainer = document.createElement('div');
    imagesFlexContainer.className = 'images-flex-container';

    stateData.images
        .filter(image => image.category === 'Flag' || image.category === 'Landmarks')
        .forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = image.url;
            imgElement.alt = `${stateData.state} ${image.category}`;
            imgElement.className = 'img-fluid';
            imgElement.style.marginRight = '10px';
            imgElement.style.maxWidth = '300px'; // Adjust this value to control the maximum width
            imgElement.style.marginRight = '5px';
            imagesFlexContainer.appendChild(imgElement);
        });

    imagesContainer.appendChild(imagesFlexContainer);*/
}

function createFactsText(textContent, container, delay) {
    const textElement = document.createElement('p');
    textElement.textContent = textContent;
    textElement.style.transition = 'opacity 1s ease';
    textElement.style.opacity = 0;

    setTimeout(() => {
        textElement.style.opacity = 1;
    }, delay * 1000);

    container.appendChild(textElement);
}

function updateMatchSection(stateData) {
    const backgroundContainer = document.getElementById('background-container-three');
    const matchContainer = document.getElementById('match-container');

    backgroundContainer.style.backgroundImage = 'none';
    matchContainer.innerHTML = '';

    // Position matchContainer at the bottom
    matchContainer.style.position = 'fixed';
    matchContainer.style.top = '0';
    // matchContainer.style.left = '0';
    // matchContainer.style.width = '100%';

    // Display background image
    if (backgroundContainer) {
        backgroundContainer.style.backgroundImage = `url(${stateData.images.find(image => image.category === 'Nature').url})`;
        backgroundContainer.style.backgroundSize = 'cover';
        backgroundContainer.style.backgroundPosition = 'center';
        backgroundContainer.style.height = '100vh';
    }

    // Display facts
    const whyText = document.createElement('p');
    whyText.textContent = `Why ${stateData.facts.Name} is the state for you!`;
    matchContainer.appendChild(whyText);

    whyText.style.color = '#5e3023';
    whyText.style.fontSize = '20px';
    whyText.style.textTransform = 'uppercase';
    whyText.style.fontWeight = 'bold';
    whyText.style.fontFamily = "Roboto sans-serif !important";
    whyText.style.letterSpacing = '0.1em';
    whyText.style.lineHeight = "32px !important";
    whyText.style.textAlign = 'left';  // Set text alignment to left


    const abortionText = document.createElement('p');
    abortionText.textContent = `Abortion in ${stateData.facts.Name} is ${stateData.facts.AbortionPolicy}.`;
    matchContainer.appendChild(abortionText);

    abortionText.style.color = '#5e3023';
    abortionText.style.fontFamily = "Roboto sans-serif !important";
    abortionText.style.fontSize = '16px';
    abortionText.style.letterSpacing = '0.1em';
    abortionText.style.lineHeight = "32px !important";
    abortionText.style.textAlign = 'left';

    const climateText = document.createElement('p');
    climateText.textContent = `${stateData.facts.Name} has a ${stateData.facts.Climate} climate with an average temperature of ${stateData.facts.AverageTemperature}°C.`;
    matchContainer.appendChild(climateText);

    climateText.style.color = '#5e3023';
    climateText.style.fontFamily = "Roboto sans-serif !important";
    climateText.style.fontSize = '16px';
    climateText.style.letterSpacing = '0.1em';
    climateText.style.lineHeight = "32px !important";
    climateText.style.textAlign = 'left';

    if (stateData.facts.Politics === "red") {
        const politicsText = document.createElement('p');
        politicsText.textContent = `${stateData.facts.Name} is more conservative, often politically categorized as a red state.`;
        matchContainer.appendChild(politicsText);
        politicsText.style.color = '#5e3023';
        politicsText.style.fontFamily = "Roboto sans-serif !important";
        politicsText.style.fontSize = '16px';
        politicsText.style.letterSpacing = '0.1em';
        politicsText.style.lineHeight = "32px !important";
        politicsText.style.textAlign = 'left';
    } else {
        const politicsText = document.createElement('p');
        politicsText.textContent = `${stateData.facts.Name} is more liberal, often politically categorized as a blue state.`;
        matchContainer.appendChild(politicsText);
        politicsText.style.color = '#5e3023';
        politicsText.style.fontFamily = "Roboto sans-serif !important";
        politicsText.style.fontSize = '16px';
        politicsText.style.letterSpacing = '0.1em';
        politicsText.style.lineHeight = "32px !important";
        politicsText.style.textAlign = 'left';
    }


}

function updateCitySection(stateData) {
    const backgroundContainer = document.getElementById('background-container-four');
    const cityContainer = document.getElementById('city-container');

    cityContainer.style.position = 'fixed';
    cityContainer.style.top = '0';
    // cityContainer.style.left = '50%';
    // cityContainer.style.transform = 'translateX(-50%)';
    // cityContainer.style.bottom = '0';

    backgroundContainer.style.backgroundImage = 'none';
    cityContainer.innerHTML = '';

    // Display background image
    if (backgroundContainer) {
        backgroundContainer.style.backgroundImage = `url(${stateData.images.find(image => image.category === 'Cities').url})`;
        backgroundContainer.style.backgroundSize = 'cover';
        backgroundContainer.style.backgroundPosition = 'center';
        backgroundContainer.style.height = '100vh';
    }

    // Display facts
    const whyText = document.createElement('p');
    whyText.textContent = `Even More Information About ${stateData.facts.Name}!`;
    cityContainer.appendChild(whyText);

    whyText.style.color = '#5e3023';
    whyText.style.fontSize = '20px';
    whyText.style.textTransform = 'uppercase';
    whyText.style.fontWeight = 'bold';
    whyText.style.fontFamily = "Roboto sans-serif !important";
    whyText.style.letterSpacing = '0.1em';
    whyText.style.lineHeight = "32px !important";
    whyText.style.textAlign = 'left';  // Set text alignment to left

    const housingText = document.createElement('p');
    housingText.textContent = `The average housing price in ${stateData.facts.Name} is $${stateData.facts.AverageHousingPrices}, start saving up now!`;
    cityContainer.appendChild(housingText);

    housingText.style.color = '#5e3023';
    housingText.style.fontFamily = "Roboto sans-serif !important";
    housingText.style.fontSize = '16px';
    housingText.style.letterSpacing = '0.1em';
    housingText.style.lineHeight = "32px !important";
    housingText.style.textAlign = 'left';

    const incomeText = document.createElement('p');
    incomeText.textContent = `The average income is $${stateData.facts.AverageIncome} with a ${stateData.facts.MaximumStateIncomeTax}% maximum income tax.`;
    cityContainer.appendChild(incomeText);

    incomeText.style.color = '#5e3023';
    incomeText.style.fontFamily = "Roboto sans-serif !important";
    incomeText.style.fontSize = '16px';
    incomeText.style.letterSpacing = '0.1em';
    incomeText.style.lineHeight = "32px !important";
    incomeText.style.textAlign = 'left';

    const wageText = document.createElement('p');
    wageText.textContent = `Minimum wage is set at $${stateData.facts.MinimumWage}/hr with ${stateData.facts.TopPerformingIndustries.toLowerCase()} as the leading industries.`;
    cityContainer.appendChild(wageText);

    wageText.style.color = '#5e3023';
    wageText.style.fontFamily = "Roboto sans-serif !important";
    wageText.style.fontSize = '16px';
    wageText.style.letterSpacing = '0.1em';
    wageText.style.lineHeight = "32px !important";
    wageText.style.textAlign = 'left';
}