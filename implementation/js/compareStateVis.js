
class CompareStateVis{
    constructor(parentElement, dataMap) {
        this.parentElement = parentElement;
        this.dataMap = dataMap;
        this.originalDataMap = JSON.parse(JSON.stringify(dataMap));
        //this.matchedState = globalSelectedState;
        //this.matchedState = window.globalSelectedState;
        this.matchedState = 'NY';

        //Defining margins, width and height for the svg canvas
        this.margin = {top: 40, right: 20, bottom: 60, left: 60};
        this.width = 1050 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;

        this.selectedCriteria = 'Crime Reported';

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

        this.dataDivided = false;

        // Listen for the custom event and update matchedState
        document.addEventListener('StateSelected', (event) => {
            this.matchedState = event.detail;
            this.updateChartTitle();
            this.wrangleData();
        });

        this.initVis();
        this.updateChartTitle();
    }


    resetVisualization() {
        let vis = this;

        // Reset the selected state
        vis.selectedState = null;

        // Reset the color of all bars to default
        vis.svg.selectAll(".bar").attr("fill", "#A9A9A9");
    }

    calculateRanking(state) {
        let vis = this;
        // Find the index of the state in the ascending order
        let ascendingIndex = vis.displayData.findIndex(d => d.State === state);
        // Calculate and return the descending ranking
        return 50 - ascendingIndex + 1;
    }

    setData(dataMap) {
        this.originalDataMap = JSON.parse(JSON.stringify(dataMap));
        this.dataMap = dataMap;
        this.wrangleData();
    }

    updateTooltipContent() {
        let vis = this;

        const stateName = vis.initialToStateName[vis.matchedState];

        let actualRanking = vis.calculateRanking(vis.matchedState);
        let selectedRanking = vis.selectedState ? vis.calculateRanking(vis.selectedState) : null;

        let message ="";

        if (!selectedRanking){
            message = `${stateName} ranks as ${actualRanking}/50 highest in ${vis.selectedCriteria}.`
        } else if (selectedRanking === actualRanking) {
            message = `Correct! ${stateName} ranks as ${actualRanking}/50 highest in ${vis.selectedCriteria}.`;
        }else{
            message = `${stateName} actually ranks ${actualRanking}/50 highest in ${vis.selectedCriteria}.`
        }


        vis.tooltip
            .style("opacity", 1)
            .html(message);
    }

    initVis() {
        let vis  = this;

        const stateName = vis.initialToStateName[vis.matchedState].toUpperCase();
        console.log("This is the matched state:", stateName);

        //Create SVG area, append it to the parent element and adjust for margins
        vis.svg = d3.select(vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .style("background-color", "transparent")
            .append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);

        // Add title to the SVG
        vis.svg.append("text")
            .attr("class", "chart-title")
            .attr("x", vis.width / 2)
            .attr("y", -10) // Adjust the position according to your needs
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("text-decoration", "underline")
            .text(`RANKING ${stateName} BASED ON ${vis.selectedCriteria}:`);


        //Define the x and y scales
        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .paddingInner(0.05);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        //Define x and y axes
        vis.xAxis = d3.axisBottom(vis.x);
        vis.yAxis = d3.axisLeft(vis.y);

        //Append x-axis to the svg but don't call .call(vis.xAxis) until data is loaded
        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", `translate(0,${vis.height})`);

        //Append y-axis to the svg
        vis.svg.append("g")
            .attr("class", "y-axis axis");

        //Initialize tooltip
        vis.tooltip = d3.select("#rankingTooltip").append("div")
            .attr("class", "tooltip")
            .attr("width", 200)
            .style("opacity", 0)
            .style("position", "absolute")
            .style("left", "65%")
            .style("top", "100%")
            .style("transform", "translatedX(-50%)")
            .style("background", "#fff")
            .style("padding", "5px")
            .style("border", "1px solid #ccc")
            .style("border-radius", "5px");

        d3.select("#revealRankingBtn").on("click", function() {
            vis.revealActualRanking();
        });
    }

    updateYAxisLabel() {
        let vis = this;

        //Remove the existing label if one already exists
        vis.svg.select(".y-axis-label").remove();

        let labelText = vis.selectedCriteria;
        if ((vis.selectedCriteria === 'Crime Reported' || vis.selectedCriteria === 'Average Income')){
            labelText += " (x1000)";
        }

        //Add new label
        vis.svg.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - vis.margin.left)
            .attr("x", 0 - (vis.height/2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "large")
            .style("padding-left", "10px")
            .text(labelText);
    }

    changeCriteria(selectedCriteria) {
        let vis = this;

        // Reset the color of all bars to default (e.g., "#A9A9A9") before changing criteria
        vis.svg.selectAll(".bar").attr("fill", "#A9A9A9");

        // Reset the selected state
        vis.selectedState = null;

        vis.svg.select(".x-axis").selectAll("text").style("opacity", 0);
        vis.selectedCriteria = selectedCriteria;
        vis.dataDivided = false;
        vis.updateChartTitle();
        vis.updateYAxisLabel();
        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        let data = JSON.parse(JSON.stringify(vis.originalDataMap[vis.selectedCriteria]));

        if (!data) {
            console.error('Selected data is not defined for', vis.selectedCriteria);
            return;
        }

        vis.displayData = data.sort((a, b) => a[vis.selectedCriteria] - b[vis.selectedCriteria]);
        if (vis.selectedCriteria === 'Crime Reported' || vis.selectedCriteria === 'Average Income'){
            vis.displayData.forEach(d => d[vis.selectedCriteria] /= 1000);
            vis.dataDivided = true;
        }
        vis.updateVis();
        vis.updateYAxisLabel();
    }

    updateChartTitle() {
        let vis = this;

        const stateName = vis.initialToStateName[vis.matchedState].toUpperCase();
        // Select the chart title using its class and update its text content
        vis.svg.select(".chart-title")
            .text(`RANKING ${stateName} BASED ON ${vis.selectedCriteria.toUpperCase()}:`);
    }

    updateVis() {
        let vis = this;

        const stateName = vis.initialToStateName[vis.matchedState];

        // document.querySelector('.instructionText').innerText = `Compare ${stateName} to the other States`;
        //
        // document.querySelector('.compareBarTitle').innerText = `Click a Bar to Guess the Ranking of ${stateName} Based on a Criteria from the Dropdown`;

        if (!vis.displayData) {
            console.log("Data not ready");
            return;  // Data not ready or not set
        }

        console.log('Data in updateVis:', vis.displayData);

        //Update the domains of the x and y scales with the new data
        vis.x.domain(vis.displayData.map(d => d.State));
        vis.y.domain([0, d3.max(vis.displayData, d => d[vis.selectedCriteria])]);

        //Bind the data to the bars
        let bars = vis.svg.selectAll(".bar")
            .data(vis.displayData, d => d.State);

        // Enter new bars
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => vis.x(d.State))
            .attr("width", vis.x.bandwidth())
            .attr("y", vis.height)
            .attr("height", 0)
            .attr("fill", "#A9A9A9")
            .on("click", function(event, d) {
                // Remove previous selection
                d3.selectAll('.bar').attr('fill', '#A9A9A9');
                // Highlight the clicked bar
                d3.select(this).attr("fill", "blue");
                vis.selectedState = d.State;
            })
            .transition()
            .duration(800)
            .attr("y", d => vis.y(d[vis.selectedCriteria]))
            .attr("height", d => vis.height - vis.y(d[vis.selectedCriteria]));

        // Update existing bars
        bars.transition()
            .duration(800)
            .attr("x", d => vis.x(d.State))
            .attr("width", vis.x.bandwidth())
            .attr("y", d => vis.y(d[vis.selectedCriteria]))
            .attr("height", d => vis.height - vis.y(d[vis.selectedCriteria]));

        bars.exit().remove();

        //Update the y-axis
        vis.svg.select(".y-axis").call(vis.yAxis);

    }

    revealActualRanking() {
        let vis = this;

        //Reveal the state names on the x-axis
        vis.svg.select(".x-axis").call(vis.xAxis).selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)")
            .style("opacity", 1);

        // Update the colors of the bars
        vis.svg.selectAll(".bar")
            .transition()
            .duration(800)
            .attr("fill", d => {
                if (d.State === vis.matchedState) {
                    return "#355e3b";
                } else if (d.State === vis.selectedState) {
                    return "red";
                } else {
                    return "#A9A9A9";
                }
            });

        vis.updateTooltipContent();
    }

}

var compareStateVis = new CompareStateVis('parentElementId', dataMap);