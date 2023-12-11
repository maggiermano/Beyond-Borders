/* * * * * * * * * * * * * *
*        HeatMapVis         *
* * * * * * * * * * * * * */

class HeatMapVis {
    constructor(parentElement, geoData, statesData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.statesData = statesData;

        this.initVis();
    }

    initVis() {
        const vis = this;

        // margin, width, height
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // Create SVG container
        vis.svg = d3.select(`#${vis.parentElement}`).append('svg')
            .attr('width', '100%')
            .attr('height', vis.height + vis.margin.top + vis.margin.bottom + 300)
            .append('g')
            .attr('transform', `translate(${vis.margin.left}, 20)`);

        // Create a projection
        vis.projection = d3.geoAlbersUsa()
            .translate([vis.width / 2, vis.height / 2])
            .scale(vis.width * 0.7);

        // Define a geo generator and pass the projection to it
        vis.path = d3.geoPath().projection(vis.projection);

        // Convert TopoJSON data to GeoJSON structure
        vis.usa = topojson.feature(vis.geoData, vis.geoData.objects.states).features;

        // Draw states
        vis.states = vis.svg.selectAll('.state')
            .data(vis.usa)
            .enter().append('path')
            .attr('class', 'state')
            .attr('d', vis.path)
            .attr('id', d => d.properties.abbr)
            .attr('stroke', 'white')
            .attr('stroke-width', 0.5)
            .style('fill', 'lightgray');

        // Append tooltip
        vis.tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .attr('id', 'heatmap-tooltip');

        vis.createLegend();
    }

    createLegend() {
        const vis = this;

        // Define legend dimensions and color scale
        const legendWidth = 200;
        const legendHeight = 20;
        const legendColorScale = d3.scaleSequential(d3.interpolateOranges) // Use an appropriate color scale
            .domain([0, 1]); // Adjust domain based on your data

        // Create legend group
        const legend = vis.svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${vis.width - legendWidth}, ${vis.height + vis.margin.top + 10})`);

        // Create a gradient for the legend
        const defs = legend.append("defs");
        const linearGradient = defs.append("linearGradient")
            .attr("id", "legendGradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        // Add gradient stops
        linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", legendColorScale(0));

        linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", legendColorScale(1));

        // Create a rectangle to display the gradient
        legend.append("rect")
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("fill", "url(#legendGradient)");

        // Add text labels
        legend.append("text")
            .attr("x", 0)
            .attr("y", legendHeight + 20)
            .text("Low")
            .attr("class", "legend-text"); // Adjust text based on your data

        legend.append("text")
            .attr("x", legendWidth)
            .attr("y", legendHeight + 20)
            .style("text-anchor", "end")
            .attr("class", "legend-text")
            .text("High"); // Adjust text based on your data
    }

    updateVis(attribute) {
        let vis = this;

        // Update the current attribute
        vis.currentAttribute = attribute;

        // Define color scale based on the selected attribute
        vis.mapColor = d3.scaleSequential()
            .interpolator(d3.interpolateOranges) // Change the color scale as needed
            .domain(d3.extent(vis.statesData, d => +d[attribute]));

        // Update the map based on the filtered states
        vis.svg.selectAll('.state')
            .style('fill', function (d) {
                const stateName = d.properties && d.properties.name;
                const stateData = vis.statesData.find(state => state.state === stateName);

                if (stateName && stateData) {
                    return vis.mapColor(+stateData[attribute]);
                } else {
                    return 'lightgray';
                }
            })
            .on('mouseover', function (event, d) {
                const stateName = d.properties && d.properties.name;
                const stateData = vis.statesData.find(state => state.state === stateName);

                if (stateName && stateData) {
                    vis.tooltip
                        .style('opacity', 1)
                        .style('left', event.pageX + 10 + 'px')
                        .style('top', event.pageY + 10 + 'px')
                        .html(`<div style=" background: whitesmoke; border-radius: 5px"><p>${stateName}: ${stateData[attribute]}</p></div>`);
                }
            })
            .on('mouseout', function () {
                vis.tooltip
                    .style('opacity', 0)
                    .style('left', 0)
                    .style('top', 0)
                    .html('');
            });
    }
}