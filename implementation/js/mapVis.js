class MapVis {
    constructor(parentElement, geoData, statesData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.statesData = statesData;
        this.filteredStates = [];

        this.initVis();
    }

    initVis() {
        let vis = this;

        // margin, width, height
        vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        vis.width =
            document.getElementById(vis.parentElement).getBoundingClientRect()
                .width - vis.margin.left - vis.margin.right;
        vis.height =
            document.getElementById(vis.parentElement).getBoundingClientRect()
                .height - vis.margin.top - vis.margin.bottom;

        // Calculate the scale based on the window height
        vis.zoom = vis.width * 0.7;

        // Init drawing area
        vis.svg = d3
            .select("#" + vis.parentElement)
            .append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        // Add title
        vis.svg
            .append("g")
            .attr("class", "title")
            .attr("id", "map-title")
            .attr("transform", `translate(${vis.width / 2}, ${vis.margin.top})`) // Adjust the padding here
            .append("text")
            .text("MAP OF THE UNITED STATES") // Change the title here
            .style("fill", "#92aa83ff")
            .attr("text-anchor", "middle");

        vis.svg
            .append("g")
            .attr("class", "title")
            .attr("transform", `translate(${vis.width / 2}, ${2*vis.margin.top})`) // Adjust the padding here
            .append("text")
            .text("(Hover to get the state name)") // Change the title here
            .style("fill", "#92aa83ff")
            .attr("text-anchor", "middle");

        // Create a projection
        vis.projection = d3.geoAlbersUsa()
            .translate([vis.width / 2, vis.height / 2])
            .scale(vis.zoom);

        // Define a geo generator and pass the projection to it
        vis.path = d3.geoPath()
            .projection(vis.projection);

        // Convert TopoJSON data to GeoJSON structure
        vis.usa = topojson.feature(vis.geoData, vis.geoData.objects.states).features;

        // Draw states
        vis.states = vis.svg
            .selectAll(".state")
            .data(vis.usa)
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("d", vis.path)
            .attr("id", (d) => d.properties.abbr)
            .attr("transform", `translate(0, ${vis.margin.top})`)
            .attr("stroke", "white")
            .attr("stroke-width", 0.5)
            .attr("fill", "green");

        // Append tooltip
        vis.tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .attr("id", "pieTooltip");

        // Define color scale
        vis.mapColor = d3.scaleLinear()
            .range(["#e8f7f8", "#064749"]);

        // Display filtered states on the map
        vis.updateMap();
    }

    updateMap() {
        let vis = this;

        // Create an object to store whether each state is filtered
        const filteredStateMap = {};
        vis.filteredStates.forEach((state) => {
            filteredStateMap[state.state] = true;
        });

        // Update the map based on the filtered states
        vis.svg
            .selectAll(".state")
            .style("fill", function (d) {
                const stateName = d.properties && d.properties.name;

                if (stateName && filteredStateMap[stateName]) {
                    return "#92AA83";
                } else {
                    return "lightgray";
                }
            })
            .on("mouseover", function (event, d) {
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px")
                    .html(
                        `<div style="background: whitesmoke; border-radius: 5px;"><p>${d.properties.name}</p></div>`
                    );
            })
            .on("mouseout", function () {
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html("");
            });
    }
}
