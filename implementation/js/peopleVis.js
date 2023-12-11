class PeopleVis {constructor(parentElement, ageData, raceData, dataType) {
    this.parentElement = parentElement;
    this.ageData = ageData;
    this.raceData = raceData;
    this.selectedDataType = dataType || "age";
    this.selectedState = "AL";

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

    this.initVis()

    // Listen for the custom event and update matchedState
    document.addEventListener('StateSelected', (event) => {
        this.selectedState = event.detail;
        this.selectedStateName = this.initialToStateName[this.selectedState].toUpperCase();
        this.wrangleData();
    });
}

    initVis() {
        let vis = this;

        // Set SVG drawing area
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - 8*vis.margin.top - vis.margin.bottom;


        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom-50)
            .append('g')
            .attr('transform', `translate (-40, ${vis.margin.top})`);

        // console.log("SVG has been drawn")

        // add title
        vis.title = vis.svg.append('g')
            .attr('class', 'title bar-title')
            .append('text')
            .attr('transform', `translate(${vis.width / 2}, 10)`)
            .attr('text-anchor', 'middle');

        // Add a legend
        vis.legend = vis.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width - 310}, ${vis.height/4})`); // Adjust the position of the legend

        // Add a label for the toggle button
        d3.select("#" + vis.parentElement)
            .append("label")
            .attr("id", "typeToggleLabel")
            .attr("for", "typeToggleButton")
            .text("Toggle between age and race data:")
            .style("margin-right", "10px")
            .style("margin-left", "365px")

        // Add a toggle button for data type
        vis.typeToggleButton = d3.select("#" + vis.parentElement)
            .append("input")
            .attr("type", "button")
            .attr("id", "typeToggleButton")
            .style("border-radius", "10px")
            .attr("value", `Switch to ${vis.selectedDataType === 'age' ? 'Race' : 'Age'} Data`)
            .on("click", function () {
                // Toggle between age and race data
                vis.selectedDataType = vis.selectedDataType === "age" ? "race" : "age";

                // Update button text
                d3.select(this).attr("value", `Switch to ${vis.selectedDataType === 'age' ? 'Race' : 'Age'} Data`);

                // Update the visualization
                vis.wrangleData();
            });

        // Add a label for the dropdown menu
        d3.select("#" + vis.parentElement)
            .append("label")
            .attr("id", "statePeopleChartLabel")
            .style("margin-right", "10px")
            .attr("for", "statePeopleChartDropdown") // Match the ID of the dropdown
            .text("View the age or race decomposition for different state: ");

        // Add a dropdown menu for states
        vis.stateDropdown = d3.select("#" + vis.parentElement)
            .append("select")
            .attr("id", "statePeopleChartDropdown")
            .on("change", function () {
                vis.selectedState = this.value;
                vis.wrangleData();
            });

        // Add options to the dropdown menu
        vis.stateDropdown.selectAll("option")
            .data([...new Set(vis.ageData.map(d => d.State))]) // Get unique state values
            .enter().append("option")
            .attr("value", d => d)
            .text(d => d);

        // Call wrangle function
        vis.wrangleData();
    }

    wrangleData() {
        let vis = this

        // console.log("selectedState in vis.wrangledata", vis.selectedState)

        // Find the data for the selected state
        // vis.selectedStateData = vis.filteredData.find(d => d.State === vis.selectedState);

        // Filter data based on selected state
        vis.selectedData = vis.selectedDataType === "age" ? vis.ageData : vis.raceData;

        // Check if selected data is defined
        if (vis.selectedData) {
            // Filter data based on selected state
            vis.filteredData = vis.selectedState === "all" ? vis.selectedData : vis.selectedData.filter((d) => d.State === vis.selectedState);

            // Call update function with filtered data
            vis.updateVis(vis.filteredData);
            vis.updateLegend();

        } else {
            console.error("Selected data is undefined");
        }
    }

    updateLegend() {
        let vis = this;

        // Remove existing legend
        vis.legend.selectAll("*").remove();

        // Add a title
        vis.legend.append('text')
            .attr('class', 'legend-title')
            .attr('x', 0)
            .attr('y', -20) // Adjust the vertical position as needed
            .style("font-weight", "bold")
            .text('CATEGORIES BY ')
            .append("tspan")
            .attr("dy", "1.5em") // Adjust the vertical spacing as needed
            .attr("x", 0)
            .text('POPULATION SIZE');

        // Create legend color squares
        vis.legend.selectAll('.legend-square')
            .data(vis.categories)
            .enter().append('rect')
            .attr('class', 'legend-square')
            .attr('x', 0)
            .attr('y', (d, i) => i * 40 + 28)
            .attr('width', 15)
            .attr('height', 15)
            .style('fill', d => vis.colorScale(d));

        // Create legend text
        vis.legend.selectAll('.legend-text')
            .data(vis.categories)
            .enter().append('text')
            .attr('class', 'legend-text')
            .attr('x', 20)
            .attr('y', (d, i) => i * 40 + 40)
            // .text(d => d)
            .text((d, i) => `${d} (${(vis.selectedStateData[d] * 100).toFixed(0)}%)`)
            .style('fill', 'black');  // Set the legend text color
    }


    updateVis() {
        let vis = this;
        document.querySelector('.header5text').innerText = `AGE AND RACE DECOMPOSITION OF ${vis.selectedStateName}`;

        // Define color scale
        if (vis.selectedDataType === "age") {
            vis.categories = ["Children 0-18", "Adults 19-25", "Adults 26-34", "Adults 35-54", "Adults 55-64", "65+"];
            vis.colorScale = d3.scaleOrdinal()
                .domain(vis.categories)
                .range(["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02"]);
        } else if (vis.selectedDataType === "race") {
            // Define your race categories and color scale here
            vis.categories = ["White", "Black", "Hispanic", "Asian", "American Indian", "Pacific Islander", "Multiple Races"];
            vis.colorScale = d3.scaleOrdinal()
                .domain(vis.categories)
                .range(["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#a6761d", "#e6ab02"]);
        }

        // Calculate the total number of people icons (assuming 100 in total)
        vis.totalPeopleIcons = 400;

        // Find the data for the selected state
        vis.selectedStateData = vis.filteredData.find(d => d.State === vis.selectedState);

        // Check if data for the selected state is found
        if (vis.selectedStateData) {
            vis.categories.sort((a, b) => {
                return +vis.selectedStateData[b] - +vis.selectedStateData[a];
            });

            vis.iconsPerCategory = vis.categories.map((Category) => {
                let percentage = parseFloat(vis.selectedStateData[Category]);
                return Math.round(percentage * vis.totalPeopleIcons);
            });

            // Update the title
            vis.title.text(`${vis.selectedDataType === 'age' ? 'AGE' : 'RACE'}`);

            // console.log("vis.iconsPerCategory", vis.iconsPerCategory);
            // console.log("vis.categories", vis.categories)

            // Generate people icons based on categories
            vis.icons = [];
            vis.categories.forEach((Category, i) => {
                for (let j = 0; j < vis.iconsPerCategory[i]; j++) {
                    vis.icons.push({category: Category});
                }
            });

            // Set up the grid dimensions
            vis.rows = 20;
            vis.columns = Math.ceil(vis.totalPeopleIcons / vis.rows);

            // Truncate the icons array if it exceeds 100
            vis.icons = vis.icons.slice(0, 400);

            // Remove existing icons
            vis.svg.selectAll(".person-icon").remove();

            // Append icons to the SVG with different colors in a grid layout
            vis.svg.selectAll(".person-icon")
                .data(vis.icons)
                .enter()
                .append("foreignObject")
                .attr("class", "person-icon")
                .attr("x", function (d, i) {
                    const col = i % vis.columns;
                    return col * 25 + 20*vis.margin.left; // Adjust the spacing here
                })
                .attr("y", function (d, i) {
                    const row = Math.floor(i / vis.columns);
                    return row * 25 + vis.margin.top ; // Adjust the spacing here
                })
                .attr("width", 20) // Adjust the width as needed
                .attr("height", 20) // Adjust the height as needed
                .style("font-size", "15px")
                .style("opacity", 0) // Start with opacity 0 (for fade-in effect)
                .html(function (d) {
                    return `<i class="fa-solid fa-user" style="color: ${vis.colorScale(
                        d.category
                    )}"></i>`;
                })
                .transition() // Add transition
                .duration(500) // Set transition duration in milliseconds
                .delay(function (d, i) {
                    return i * 5; // Adjust the delay between icons (in milliseconds)
                })
                .style("opacity", 1); // Fade in new icons;
        } else {
            console.error(`Data not found for state: ${vis.selectedState}`);
        }
    }
}
