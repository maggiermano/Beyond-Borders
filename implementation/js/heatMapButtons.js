document.addEventListener('DOMContentLoaded', function () {
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(function (geoData) {
        Papa.parse('data/heatMapData.csv', {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const statesData = results.data;

                // Title for the page
                const titleContainer = document.getElementById('heatmap-title');
                const title = document.createElement('h1');
                title.innerText = 'US MAP CHOROPLETH';
                title.style.fontWeight = '700';
                title.style.fontSize = '40px';
                title.style.padding = '10px';

                titleContainer.appendChild(title);

                // Labels for the buttons
                const buttonLabels = [
                    'Healthcare Costs',
                    'Average Temperature',
                    'Air Quality Index',
                    'Happiness Score',
                    'Gun Death Rate',
                    'Crime Rate',
                    'Violent Crime Rate',
                    'Non-Violent Crime Rate',
                    'Minimum Standard Wage',
                    'Average Income Per Capita'
                ];

                const attributeLabels = [
                    'healthcare_costs',
                    'average_temperature',
                    'air_quality_index',
                    'happiness_score',
                    'gun_death_rate',
                    'crime_rate',
                    'violent_crime_rate',
                    'non_violent_crime_rate',
                    'minimum_standard_wage',
                    'average_income'
                ];

                // Create buttons dynamically
                const buttonsContainer = document.getElementById('heatmap-buttons');
                const heatMapVis = new HeatMapVis('heatmap-container', geoData, statesData);

                buttonLabels.forEach((label, index) => {
                    const button = createButton(label, attributeLabels[index], statesData, heatMapVis);
                    buttonsContainer.appendChild(button);
                });
            }
        });
    });
});

function createButton(label, attribute, statesData, heatMapVis) {
    const button = document.createElement('button');
    button.className = 'btn btn-secondary mb-2 mx-2';
    button.innerText = label;

    button.addEventListener('click', () => {
        heatMapVis.updateVis(attribute, statesData);
    });

    return button;
}