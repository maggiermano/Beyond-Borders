class ClimateMapVis {
    constructor(parentElement, climateData) {
        this.parentElement = parentElement;
        this.climateData = climateData;
        this.selectedState = "AL";
        this.initVis();

        console.log("climate data", this.climateData);

        this.initialToStateName = {
            'AL': 'Alabama',
            'AK': 'Alaska',
            'AZ': 'Arizona',
            'AR': 'Arkansas',
            'CA': 'California',
            'CO': 'Colorado',
            'CT': 'Connecticut',
            'DE': 'Delaware',
            'FL': 'Florida',
            'GA': 'Georgia',
            'HI': 'Hawaii',
            'ID': 'Idaho',
            'IL': 'Illinois',
            'IN': 'Indiana',
            'IA': 'Iowa',
            'KS': 'Kansas',
            'KY': 'Kentucky',
            'LA': 'Louisiana',
            'ME': 'Maine',
            'MD': 'Maryland',
            'MA': 'Massachusetts',
            'MI': 'Michigan',
            'MN': 'Minnesota',
            'MS': 'Mississippi',
            'MO': 'Missouri',
            'MT': 'Montana',
            'NE': 'Nebraska',
            'NV': 'Nevada',
            'NH': 'New Hampshire',
            'NJ': 'New Jersey',
            'NM': 'New Mexico',
            'NY': 'New York',
            'NC': 'North Carolina',
            'ND': 'North Dakota',
            'OH': 'Ohio',
            'OK': 'Oklahoma',
            'OR': 'Oregon',
            'PA': 'Pennsylvania',
            'RI': 'Rhode Island',
            'SC': 'South Carolina',
            'SD': 'South Dakota',
            'TN': 'Tennessee',
            'TX': 'Texas',
            'UT': 'Utah',
            'VT': 'Vermont',
            'VA': 'Virginia',
            'WA': 'Washington',
            'WV': 'West Virginia',
            'WI': 'Wisconsin',
            'WY': 'Wyoming'
        };

        // Listen for the custom event and update matchedState
        document.addEventListener('StateSelected', (event) => {
            this.selectedState = event.detail;
            this.selectedStateName = this.initialToStateName[this.selectedState].toUpperCase();
            this.wrangleData();
        });
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.svgheader = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", 50)
            .append('g')
            .attr('transform', `translate (0, 0)`);

        // vis.headerText = vis.svgheader.append("text")
        //     .attr("x", vis.margin.left)
        //     .attr("class", "climateHeaderText")
        //     .attr("y", vis.margin.top + 25)
        //     .text(`Weather dashboard for ${vis.selectedState}`);

        // Create an array of weather parameters
        vis.weatherParams = ['Rainfall', 'Temperature', 'Humidity', 'Snow'];

        // Create an array of SVGs
        vis.svgContainers = [];

        // Create separate SVGs for each weather parameter
        vis.weatherParams.forEach((param, index) => {

            vis.svgContainer = d3.select("#" + vis.parentElement).append("svg")
                .attr("width", vis.width / 4)
                .attr("height", 2*vis.height/3)
                .style("display", "inline-block")
                .style("vertical-align", "top")
                .append('g')
                .attr('transform', `translate(${vis.margin.left}, ${vis.margin.top})`);

            vis.svgContainer.append("rect")
                .attr("width", vis.width / 4 - vis.margin.left - vis.margin.right)
                .attr("height", (vis.height - vis.margin.top - vis.margin.bottom)/2)
                .attr("fill", "#d9d9d9")
                .attr("rx", 20)
                .attr("ry", 20);

            vis.svgContainer.append("text")
                .attr("x", (vis.width / 4 - vis.margin.left - vis.margin.right) / 2)
                .attr("class", "weatherText")
                .attr("y", 2 * vis.margin.top)
                .style("text-anchor", "middle")
                .text(`${param}`);

            vis.svgContainers.push(vis.svgContainer);
        });

        // Add a label for the dropdown menu
        d3.select("#" + vis.parentElement)
            .append("label")
            .attr("class", "climateDropdownLabel")
            .style("margin-right", "10px")
            .attr("for", "stateDropdown")
            .text("View the weather dashboard for a different state: ");

        // Add a dropdown menu for state selection
        vis.stateDropdown = d3.select("#" + vis.parentElement)
            .append("select")
            .attr("id", "stateDropdown")
            .on("change", function () {
                vis.selectedState = this.value;
                vis.wrangleData();
            });

        // Add options to the dropdown menu
        vis.stateDropdown.selectAll("option")
            .data(vis.climateData.map(d => d.State))
            .enter().append("option")
            .attr("value", d => d)
            .text(d => d);

        // // Add a switch for morning or afternoon humidity
        // d3.select("#" + vis.parentElement)
        //     .append("label")
        //     .style("margin-left", "10px")
        //     .html("Show Morning Humidity")
        //     .append("input")
        //     .attr("type", "checkbox")
        //     .attr("id", "switch")
        //     .attr("checked", true)
        //     .on("change", function () {
        //         vis.showMorningHumidity = this.checked;
        //         vis.wrangleData();
        //     });

        // Call wrangle function
        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        document.querySelector('.header7text').innerText = `WEATHER IN ${vis.selectedStateName}`;

        // Find the data for the selected state
        vis.selectedStateData = vis.climateData.find(d => d.State === vis.selectedState);

        console.log("selected state data", vis.selectedStateData);

        // Assuming you have access to the selected state variable (e.g., vis.selectedState)
        // selectedStateText = document.getElementById('selectedStateText');
        // selectedStateText.textContent = `Learn more about the weather in ${vis.selectedState}`;


        // If state data is found, update the visualization
        if (vis.selectedStateData) {
            // Update each SVG based on weather parameters
            vis.svgContainers.forEach((svgContainer, index) => {
                let param = ['Rainfall', 'Temperature', 'Humidity', 'Snow'][index];
                let value = vis.selectedStateData[param];

                // Clear existing content
                svgContainer.selectAll(".icon").remove();
                svgContainer.selectAll(".label").remove();
                svgContainer.selectAll(".droplet").remove();

                // Display weather icon based on the parameter value
                let icon, label;
                if (param === 'Temperature') {
                    if (value > 20) {
                        label = `High Temperature of ${value}°C`;
                    } else if (value > 10) {
                        label = `Moderate Temperature of ${value}°C`;
                    } else {
                        label = `Low Temperature of ${value}°C`;
                    }

                    // Change the color of the temperature SVG based on temperature range
                    let temperatureColor;
                    if (value > 20) {
                        temperatureColor = '#fec44f'; // High temperature color (red)
                        icon = '<i class="fa-solid fa-sun" style="color: #fe9929"></i>';


                    } else if (value > 10) {
                        temperatureColor = '#fee391'; // Moderate temperature color (orange)
                        icon = '<i class="fa-solid fa-sun" style="color: #fec44f"></i>';
                    } else {
                        temperatureColor = '#ffffd4'; // Low temperature color (green)
                        icon = '<i class="fa-solid fa-sun" style="color: #fee391"></i>';
                    }


                    // Update the temperature SVG color
                    svgContainer.select("rect")
                        .attr("fill", temperatureColor);

                    // icon = value >= 15 ? '<i class="fa-solid fa-sun" style="color: #f03b20"></i>' :
                    //     (value >= 5 ? '<i class="fa-solid fa-sun" style="color: #feb24c"></i>' :
                    //         '<i class="fa-solid fa-sun" style="color: #ffeda0"></i>');
                    //icon = '<i class="fa-solid fa-sun" style="color: #f03b20"></i>'

                    // label = `Average Temperature: ${value}°C`;
                } else if (param === 'Rainfall') {
                    // icon = value > 1000 ? '<i class="fas fa-cloud-showers-heavy" style="color: #406c94"></i>' :
                    //     (value > 500 ? '<i class="fas fa-cloud-showers-heavy" style="color: #406c94"></i>' :
                    //         '<i class="fas fa-cloud-showers-heavy" style="color: #406c94"></i>');

                    // Clear existing content in the rain SVG
                    svgContainer.selectAll(".raindrop").remove();

                    // Set the base delay for raindrop animation
                    let baseDelay = 200;

                    // Adjust the number of raindrops and delay based on precipitation levels
                    let numIcons;
                    if (value > 1000) {
                        numIcons = 2000;
                        label = `High Precipitation of  ${value} mm`
                        baseDelay = 50; // Decrease delay for heavy precipitation
                    } else if (value > 500) {
                        numIcons = 500;
                        label = `Moderate Precipitation of  ${value} mm`
                    } else {
                        numIcons = 50;
                        baseDelay = 800; // Increase delay for low precipitation
                        label = `Low Precipitation of  ${value} mm`
                    }
                    svgContainer.select("rect")
                        .attr("fill", '#ADD8E6');
                    // Display rainfall information using circles with randomized x positions
                    svgContainer.selectAll(".raindrop")
                        .data(d3.range(numIcons)) // Use d3.range to create an array of indices
                        .enter()
                        .append("circle")
                        .attr("class", "raindrop")
                        .attr("cx", function () {
                            return 10 + Math.random() * (vis.width / 5); // Random x position within a quarter of the SVG width
                        })
                        .attr("cy", 5) // Start from the top
                        .attr("r", 5) // Radius of the raindrop circle
                        .style("fill", "#406c94")
                        .style("opacity", 1) // Start with opacity 0 (for fade-in effect)
                        .transition() // Add transition
                        .duration(2000) // Set transition duration in milliseconds
                        .delay(function (d, i) {
                            return i * baseDelay; // Adjust the delay between raindrops (in milliseconds)
                        })
                        .attr("cy", vis.height/2 - 20) // Move the raindrop to the bottom
                        .style("opacity", 0) // Fade out the raindrop
                        .remove(); // Remove the raindrop element

                    // Display multiple cloud icons at the top with different x positions
                    const numClouds = 9; // Adjust the number of clouds as needed
                    const cloudSpacing = 30; // Adjust the spacing between clouds
                    for (let i = 0; i < numClouds; i++) {
                        svgContainer.append("foreignObject")
                            .attr("class", "icon")
                            .attr("x", (i * cloudSpacing)) // Adjust spacing between clouds
                            .attr("y", -20)
                            .attr("width", 40)
                            .attr("height", 40)
                            .html('<i class="fas fa-cloud" style="color: #C0C0C0"></i>')
                            .style("font-size", "30px")
                            .style("opacity", 1);
                    }

                    // label = `Average Rainfall: ${value} mm`;
                } else if (param === 'Humidity') {
                    svgContainer.select("rect")
                        .transition()  // Add transition
                        .duration(500)  // Set transition duration in milliseconds
                        .attr("fill", '#29ab87')
                        .attr("opacity", 0.5);

                    let dropletSize = Math.round(vis.selectedStateData.Humidity * 0.4); // Adjust the multiplier as needed

                    // Display droplets for humidity
                    svgContainer.selectAll(".droplet")
                        .data(d3.range(dropletSize)) // Use d3.range to create an array of indices
                        .enter()
                        .append("text")
                        .attr("class", "droplet")
                        .attr("x", function () {
                            return 10 + Math.random() * (vis.width / 5); // Random x position within a quarter of the SVG width
                        })
                        .attr("y", function () {
                            return 20 + Math.random() * (vis.height/2 - 3 * vis.margin.top - vis.margin.bottom); // Random y position within the SVG height
                        })
                        .attr("dy", ".35em")
                        .attr("text-anchor", "middle")
                        .style("font-family", "FontAwesome")
                        .style("fill", "#3e8eaf")
                        .style("opacity", 0.4)
                        .style("font-size", "20px")
                        .text("\uf043"); // Unicode for water droplet icon
                    // <i className="fa-light fa-droplet"></i>

                    label = `Humidity of ${value}%`;

                    // icon = '<i class="fas fa-tint" style="color: #3e8eaf"></i>';
                    // label = `Average Humidity: ${value}%`;
                } else if (param === 'Snow') {
                    console.log("snow value", value)
                    // Clear existing content in the snow SVG
                    svgContainer.selectAll(".snowflake").remove();

                    // Set the base delay for snowflake animation
                    let baseDelay = 200;

                    // Adjust the number of snowflakes and delay based on snowfall levels
                    let numIcons;
                    if (value > 100) {
                        numIcons = 1000;
                        label = `High Snowfall of ${value} inches`;
                        baseDelay = 50; // Decrease delay for heavy snowfall
                    } else if (value > 50) {
                        numIcons = 600;
                        label = `Moderate Snowfall of ${value} inches`;
                    } else if (value > 0){
                        numIcons = 200;
                        baseDelay = 800; // Increase delay for low snowfall
                        label = `Low Snowfall of ${value} inches`;
                    }
                    else{
                        numIcons = 0;
                        label = `No Snowfall`;
                    }
                    svgContainer.select("rect")
                        .attr("fill", '#F0FFFF');

                    // Display snowfall information using circles with randomized x positions
                    svgContainer.selectAll(".snowflake")
                        .data(d3.range(numIcons)) // Use d3.range to create an array of indices
                        .enter()
                        .append("text")
                        .attr("class", "snowflake")
                        .attr("x", function () {
                            return 10 + Math.random() * (vis.width / 5); // Random x position within a quarter of the SVG width
                        })
                        .attr("y", 5) // Start from the top
                        .attr("dy", ".35em")
                        .attr("text-anchor", "middle")
                        .style("font-family", "FontAwesome")
                        .style("font-size", "20px")
                        .style("opacity", 0) // Start with opacity 0 (for fade-in effect)
                        .text("\uf2dc") // Unicode for snowflake icon
                        .transition() // Add transition
                        .duration(2000) // Set transition duration in milliseconds
                        .delay(function (d, i) {
                            return i * baseDelay; // Adjust the delay between snowflakes (in milliseconds)
                        })
                        .attr("y", vis.height/2 - 40) // Move the snowflake to the bottom
                        .style("fill", "white")
                        .style("opacity", 1) // Fade out the snowflake
                        .remove(); // Remove the snowflake element

                    // label = `Average Snowfall: ${value} inches - ${snowLabel}`;

                    // label = `Average Air Quality: ${value}`;

                }

                // Append the weather icon to the SVG
                svgContainer.selectAll(".icon")
                    .data([icon])
                    .enter()
                    .append("foreignObject")
                    .attr("class", "icon")
                    // .attr("x", (vis.width / 4 - vis.margin.left - vis.margin.right) / 2)
                    // .attr("y", vis.height / 4)
                    // .attr("x", vis.width / 12 - vis.margin.right)
                    // .attr("y", vis.height / 6)
                    .attr("x", 0)
                    .attr("y", -20)
                    .attr("width", 100)
                    .attr("height", 150)

                    // .attr("anchor", "start")
                    .style("font-size", "100px")
                    .style("opacity", 0)
                    .html(function (d) {
                        return d;
                    })
                    .transition()
                    .duration(500)
                    .delay(function (d, i) {
                        return i * 20;
                    })
                    .style("opacity", 0.5);

                // Append the weather label to the SVG
                svgContainer.selectAll(".label")
                    .data([label])
                    .enter()
                    .append("text")
                    .attr("class", "label")
                    .attr("x", (vis.width / 4 - vis.margin.left - vis.margin.right) / 2)
                    .attr("y", vis.height/2 + vis.margin.bottom)
                    .style("text-anchor", "middle")
                    .text(function (d) {
                        return d;
                    })
                    .style("font-size", "16px")
                    .style("font-family", "Roboto, sans-serif")
                    .style("letter-spacing", "0.05em");
            });
        }
    }
}
