class TreeMapVis {
    constructor(parentElement, industryData) {
        this.parentElement = parentElement;
        this.industryData = industryData;
        this.selectedState = "Alabama";
        this.parent = null;
        this.isTooltipVisible = false;

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


        // Listen for the custom event and update selectedState
        document.addEventListener('StateSelected', (event) => {
            this.selectedState = this.initialToStateName[event.detail];
            this.wrangleData();
            this.processStateChange();
        });

        this.initVis();
        this.processStateChange();
    }

    initVis() {
        let vis = this;

        // Set SVG drawing area
        vis.margin = {top: 40, right: 20, bottom: 20, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width - vis.margin.left - vis.margin.right)
            .attr("height", vis.height - vis.margin.top - vis.margin.bottom)
            .append('g')

        // Add title
        vis.title = vis.svg.append('g')
            .attr('class', 'title bar-title')
            .append('text')
            .attr('transform', `translate(${vis.width / 2}, 10)`)
            .attr('text-anchor', 'middle')
            .attr("font-weight", "bold")
            .attr("font-size", 24);

        vis.treemapGroup = vis.svg.append('g')
            .attr('transform', `translate(${vis.margin.left}, 0`);

        // Initialize SVG tooltip
        vis.tooltip = vis.svg.append('g')
            .attr('class', "tooltip")
            .style("opacity", 0)
            .style("pointer-events", "all") // Enable pointer events for the tooltip
            .on("click", function() {
                // Toggle the tooltip visibility on click
                vis.isTooltipVisible = false;
                vis.tooltip.style("opacity", 0).style("pointer-events", "none");
            });

        // Append a rectangle for the background
        vis.tooltip.append('rect')
            .attr("width",  vis.width)
            .attr("height", vis.height)
            .style("fill", "#355e3b")
            .style("opacity", 0.8);

        // Append a text element to the tooltip for displaying information
        vis.tooltipText = vis.tooltip.append('text')
            .attr("class", "tooltip-text")
            .attr("x", vis.width / 2)
            .attr("y", vis.height / 2)
            .attr("text-anchor", "middle")
            // .attr("dy", "0.35em")
            .style("fill", "white")
            .attr("font-size", 16);

        // Add a label for the dropdown menu
        d3.select("#" + vis.parentElement)
            .append("label")
            .style("margin-right", "10px")
            .attr("id", "stateDropdownLabel")
            .attr("for", "stateDropdown")
            .text("View the industry dashboard for a different state: ");

        // Add a dropdown menu for state selection
        vis.stateDropdown = d3.select("#" + vis.parentElement)
            .append("select")
            .attr("id", "stateDropdown")
            .on("change", function () {
                vis.selectedState = this.value;
                vis.processStateChange();
            });

        // Add options to the dropdown menu
        vis.stateDropdown.selectAll("option")
            .data(vis.industryData.map(d => d.state))
            .enter().append("option")
            .attr("value", d => d)
            .text(d => d);

        // Call wrangle function
        vis.wrangleData();
    }

    // Common function to handle state change
    processStateChange() {
        let vis = this;
        console.log("Processing state change:", this.selectedState);
        vis.selectedStateData = vis.industryData.find(d => d.state === vis.selectedState);
        console.log("This is the matched industry data:", vis.selectedStateData);
        this.updateVis();
    }

    wrangleData() {
        let vis = this;
        // vis.updateTitle();
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        document.querySelector('.header6text').innerText = `INDUSTRIES IN ${vis.selectedState.toUpperCase()}`;

        // Clear existing treemap
        vis.treemapGroup.selectAll("*").remove();

        // Find the selected state data
        vis.selectedStateData = vis.industryData.find(d => d.state === vis.selectedState);

        // Check if state data is found
        if (vis.selectedStateData) {
            // Create a hierarchy from the industry data
            vis.root = d3.hierarchy({ children: vis.selectedStateData.industries }).sum(d => d.revenue);

            // Create a treemap layout
            vis.treemap = d3.treemap().size([vis.width - vis.margin.left - vis.margin.right, vis.height - vis.margin.top - vis.margin.bottom]);

            // Compute the treemap layout
            vis.treemap(vis.root);

            // Bind data to the cells
            vis.cells = vis.treemapGroup.selectAll(".cell").data(vis.root.leaves(), d => d.data.industry);

            // Enter and update the rectangles
            const enterCells = vis.cells.enter().append("rect")
                .attr("class", "cell")
                .attr("x", d => d.x0)
                .attr("y", d => d.y0)
                .attr("width", 0)
                .attr("height", 0)
                .attr("fill", "#92aa83ff")
                .attr("stroke", "white")
                .on("click", function (event, d) {
                    // Check if the tooltip is currently visible
                    if (vis.isTooltipVisible) {
                        vis.tooltip.transition()
                            .duration(1200)
                            .style("opacity", 0)
                            .on("end", function() {
                                d3.select(this).style("pointer-events", "none");
                                vis.isTooltipVisible = false;
                            });
                    } else {
                        vis.tooltipText.selectAll("*").remove();

                        // Get the state's top companies
                        let stateTopCompanies = vis.selectedStateData.topCompanies;
                        console.log("These are the companies:", stateTopCompanies);

                        // Append first line of text - Industry
                        vis.tooltipText.append("tspan")
                            .attr("class", "industry-tooltip-text")
                            .attr("x", vis.width / 2)
                            .attr("y", 5*vis.margin.top)
                            .text(`INDUSTRY: ${d.data.industry.toUpperCase()}`)
                            .attr("text-anchor", "middle")
                            .attr("font-size", 26);

                        // Append second line of text - Revenue
                        let revenueText = vis.tooltipText.append("tspan")
                            .attr("x", vis.width / 2)
                            .attr("dy", "2em")
                            .text(`Revenue: $${d.data.revenue} Billion`)
                            .attr("text-anchor", "middle");

                        // Append third line of text
                        vis.tooltipText.append("tspan")
                            .attr("x", vis.width / 2)
                            .attr("dy", "2em")
                            .text(`Rank: ${d.data.rank} out of 50 similar industries across the U.S.`)
                            .attr("text-anchor", "middle");

                        // Append header for top employers
                        vis.tooltipText.append("tspan")
                            .attr("class", "industry-tooltip-text")
                            .attr("x", vis.width / 2)
                            .attr("dy", "4em")
                            .text("TOP STATE EMPLOYERS")
                            .attr("text-anchor", "middle")
                            .attr("font-size", 20);

                        // Starting position for the top employers list
                        let dy = 2;

                        // Append each top employer as a separate tspan
                        stateTopCompanies.forEach((company, index) => {
                            vis.tooltipText.append("tspan")
                                .attr("x", vis.width / 2)
                                .attr("dy", `${dy}em`)
                                .text(`${index + 1}. ${company.company}, ${company.Employees} Employees`)
                                .attr("text-anchor", "middle");
                            // dy += 1; // Increment dy for each new line
                        });

                        // Transition for making the tooltip visible
                        vis.tooltip.transition()
                            .duration(1200)
                            .style("opacity", 1)
                            .on("start", function() {
                                d3.select(this).style("pointer-events", "auto");
                                vis.isTooltipVisible = true;
                            });
                    }
                })
                .on("mouseover", function (event, d) {
                    // Highlight the cell on mouseover
                    d3.select(this)
                        .attr('fill', '#355e3b')
                        // .style("opacity", 0.8)
                        .attr("stroke-width", "3px");
                })
                .on("mouseout", function (event, d) {
                    // Remove highlighting on mouseout
                    d3.select(this)
                        .attr('stroke', 'white')
                        .attr('fill', '#92aa83ff')
                        .attr("stroke-width", "1px");
                });

            enterCells.transition()
                .duration(900)
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d => d.y1 - d.y0);

            vis.cells.transition()
                .duration(900)
                .attr("x", d => d.x0)
                .attr("y", d => d.y0)
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d => d.y1 - d.y0)
                .on("click", function (event, d) {
                    // Check if the tooltip is currently visible
                    if (vis.isTooltipVisible) {
                        vis.tooltip.transition()
                            .duration(1000)
                            .style("opacity", 0)
                            .on("end", function() {
                                d3.select(this).style("pointer-events", "none");
                                vis.isTooltipVisible = false;
                            });
                    } else {
                        vis.tooltipText.selectAll("*").remove();

                        // Get the state's top companies
                        let stateTopCompanies = vis.selectedStateData.topCompanies;
                        console.log("These are the companies:", stateTopCompanies);

                        // Append first line of text - Industry
                        vis.tooltipText.append("tspan")
                            .attr("x", 0.8 * vis.width / 2)
                            .attr("y", 0.8 * vis.height / 2 - 10)
                            .text(`Industry: ${d.data.industry}`)
                            .attr("text-anchor", "middle");

                        // Append second line of text - Revenue
                        let revenueText = vis.tooltipText.append("tspan")
                            .attr("x", 0.8 * vis.width / 2)
                            .attr("dy", "1.2em")
                            .text(`Revenue: $${d.data.revenue} Billion`)
                            .attr("text-anchor", "middle");

                        // Append header for top employers
                        vis.tooltipText.append("tspan")
                            .attr("x", 0.8 * vis.width / 2)
                            .attr("dy", "2.4em")
                            .text("Top State Employers:")
                            .attr("text-anchor", "middle");

                        // Starting position for the top employers list
                        let dy = 2;

                        // Append each top employer as a separate tspan
                        stateTopCompanies.forEach((company, index) => {
                            vis.tooltipText.append("tspan")
                                .attr("x", 0.8 * vis.width / 2)
                                .attr("dy", `${dy}em`)
                                .text(`${index + 1}. ${company.company}, ${company.Employees} Employees`)
                                .attr("text-anchor", "middle");
                            dy += 1.2; // Increment dy for each new line
                        });

                        // Transition for making the tooltip visible
                        vis.tooltip.transition()
                            .duration(1000)
                            .style("opacity", 1)
                            .on("start", function() {
                                d3.select(this).style("pointer-events", "auto");
                                vis.isTooltipVisible = true;
                            });
                    }
                })
                .on("mouseover", function (event, d) {
                    // Highlight the cell on mouseover
                    d3.select(this)
                        .attr('fill', 'black')
                        // .style("opacity", 0.8)
                        .attr("stroke-width", "3px");
                })
                .on("mouseout", function (event, d) {
                    // Remove highlighting on mouseout
                    d3.select(this)
                        .attr('stroke', 'white')
                        .attr('fill', '#3c673a')
                        .attr("stroke-width", "1px");
                });

            vis.cells.exit()
                .transition()
                .duration(900)
                .style("opacity", 0)
                .remove();

            // Update labels for each cell
            vis.labels = vis.treemapGroup.selectAll(".label")
                .data(vis.root.leaves());

            vis.labels.enter().append("text")
                .attr("class", "label")
                .merge(vis.labels)
                .attr("x", d => (d.x0 + d.x1) / 2)
                .attr("y", d => (d.y0 + d.y1) / 2)
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .text(d => d.data.industry)
                .each(function(d) {
                    let text = d3.select(this),
                        width = d.x1 - d.x0 - 10; // Adjust based on cell padding
                    wrapText(text, width);
                })
                .style("fill", "white");

            // Remove any labels that are no longer needed
            vis.labels.exit().remove();
        }
    }
}

function wrapText(selection, width) {
    selection.each(function() {
        let text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

        let lineNum = 0;
        while (words.length > 0) {
            word = words.pop();
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width && line.length > 1) {
                line.pop(); // remove the word that overflowed
                tspan.text(line.join(" ")); // set the text without the overflowed word
                words.push(word); // put the word back in the stack for the next line
                line = []; // start a new line

                // Increase the line number and calculate new y position
                lineNum++;
                let newY = parseFloat(y) + lineNum * lineHeight * parseFloat(text.style("font-size"));
                tspan = text.append("tspan").attr("x", x).attr("y", newY).attr("dy", dy + "em");
            } else if (tspan.node().getComputedTextLength() > width) {
                // Word is too long and needs to be split
                let splitPoint = word.length;
                while (splitPoint > 0 && tspan.node().getComputedTextLength() > width) {
                    splitPoint--;
                    tspan.text(word.substring(0, splitPoint));
                }

                let remainingWord = word.substring(splitPoint);
                words.push(remainingWord); // push the remaining part of the word to be processed in the next line
                line = []; // start a new line

                // Increase the line number and calculate new y position
                lineNum++;
                let newY = parseFloat(y) + lineNum * lineHeight * parseFloat(text.style("font-size"));
                tspan = text.append("tspan").attr("x", x).attr("y", newY).attr("dy", dy + "em");
            }
        }
    });
}
