
// ---------

// class PeopleVis {
//     constructor(parentElement, ageData, raceData) {
//         this.parentElement = parentElement;
//         this.ageData = ageData;
//         this.raceData = raceData;
//         this.selectedState = "NY";
//         this.initVis();
//     }
//
//     initVis() {
//         let vis = this;
//
//         // Set SVG drawing area
//         vis.margin = { top: 20, right: 20, bottom: 20, left: 40 };
//         vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
//         vis.height = 500;
//
//         // init drawing area
//         vis.svg = d3.select("#" + vis.parentElement).append("svg")
//             .attr("width", vis.width + vis.margin.left + vis.margin.right)
//             .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
//             .append('g')
//             .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);
//
//         console.log("SVG has been drawn");
//
//         // add title
//         vis.title = vis.svg.append('g')
//             .attr('class', 'title bar-title')
//             .append('text')
//             .attr('transform', `translate(${vis.width / 2}, 10)`)
//             .attr('text-anchor', 'middle')
//             .attr("font-weight", "bold");
//
//         // Call wrangle function
//         vis.wrangleData();
//     }
//
//     wrangleData() {
//         let vis = this;
//
//         // Filter data based on selected state
//         vis.filteredAgeData = vis.ageData.filter((d) => d.State === vis.selectedState);
//         vis.filteredRaceData = vis.raceData.filter((d) => d.State === vis.selectedState);
//
//         // Combine age and race data
//         let combinedData = vis.combineData(vis.filteredAgeData, vis.filteredRaceData);
//
//         // Call update function with combined data
//         vis.updateVis(combinedData);
//     }
//
//     combineData(ageData, raceData) {
//         // Combine age and race data using a common identifier (e.g., State)
//         // Modify this function based on your actual data structure
//         // For example, you might use a library like lodash to merge data by a common key
//         return ageData.map(ageItem => {
//             const raceItem = raceData.find(race => race.State === ageItem.State);
//             return raceItem ? { ...ageItem, ...raceItem } : null;
//         }).filter(combinedItem => combinedItem !== null);
//     }
//     updateVis(data) {
//         let vis = this;
//
//         // Define categories and color scale
//         // Define categories and color scale
//         let categories, colorScale;
//         if (vis.selectedDataType === "age") {
//             categories = ["Children 0-18", "Adults 19-25", "Adults 26-34", "Adults 35-54", "Adults 55-64", "65+"];
//             colorScale = d3.scaleOrdinal()
//                 .domain(categories)
//                 .range(["#1f78b4", "#33a02c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"]);
//         } else if (vis.selectedDataType === "race") {
//             categories = ["White", "Black", "Hispanic", "Asian", "American_Indian", "Native_Hawaiian_Pacific_Islander", "Multiple_Races"];
//             colorScale = d3.scaleOrdinal()
//                 .domain(categories)
//                 .range(["#1f78b4", "#33a02c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#b15928"]);
//         }
//
//
//         // Calculate the total number of people icons (assuming 100 in total)
//         vis.totalPeopleIcons = 400;
//
//         // Find the data for the selected state
//         let selectedStateData = data[0]; // Assuming the data array has only one element for the selected state
//
//         // Check if data for the selected state is found
//         if (selectedStateData) {
//             let iconsPerCategory = categories.map((category) => {
//                 let percentage = parseFloat(selectedStateData[category]);
//                 return Math.round(percentage * vis.totalPeopleIcons);
//             });
//
//             // Update the title
//             vis.title.text(`${dataType === 'age' ? 'Age' : 'Race'} Breakdown - ${vis.selectedState}`);
//
//             console.log(`${dataType} icons per category`, iconsPerCategory);
//
//             // Generate people icons based on categories
//             let icons = [];
//             categories.forEach((category, i) => {
//                 for (let j = 0; j < iconsPerCategory[i]; j++) {
//                     icons.push({ category: category });
//                 }
//             });
//
//             // Set up the grid dimensions
//             let rows = 20;
//             let columns = Math.ceil(vis.totalPeopleIcons / rows);
//
//             // Remove existing icons
//             vis.svg.selectAll(`.${dataType}-person-icon`).remove();
//
//             // Append icons to the SVG with different colors in a grid layout
//             vis.svg.selectAll(`.${dataType}-person-icon`)
//                 .data(icons)
//                 .enter()
//                 .append("foreignObject")
//                 .attr("class", `${dataType}-person-icon`)
//                 .attr("x", function (d, i) {
//                     return (i % columns) * 32 + 10; // Adjust spacing and icon size
//                 })
//                 .attr("y", function (d, i) {
//                     return Math.floor(i / columns) * 32 + 10; // Adjust spacing and icon size
//                 })
//                 .attr("width", 30) // Adjust the width as needed
//                 .attr("height", 30) // Adjust the height as needed
//                 .html(function (d) {
//                     return `<i class="fa-solid fa-user" style="color: ${colorScale(d.category)}"></i>`;
//                 });
//         } else {
//             console.error(`Data not found for state: ${vis.selectedState}`);
//         }
//     }
// }

// ---------
//
// class PeopleVis {
//     constructor(parentElement, ageData, raceData) {
//         this.parentElement = parentElement;
//         this.ageData = ageData;
//         this.raceData = raceData;
//         this.selectedState = "NY";
//         this.initVis();
//     }
//
//     initVis() {
//         let vis = this;
//
//         // Set SVG drawing area
//         vis.margin = {top: 20, right: 20, bottom: 20, left: 40};
//         vis.width = 300;
//         vis.height = 300;
//
//         // Set SVG drawing area for age chart
//         vis.ageSvg = d3.select("#" + vis.parentElement).append("svg")
//             .attr("width", vis.width + vis.margin.left + vis.margin.right)
//             .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
//             .append('g')
//             .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);
//
//         // Set SVG drawing area for race chart
//         vis.raceSvg = d3.select("#" + vis.parentElement).append("svg")
//             .attr("width", vis.width + vis.margin.left + vis.margin.right)
//             .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
//             .append('g')
//             .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top + vis.height + vis.margin.bottom})`);
//
//         console.log("SVG has been drawn");
//
//         // add title for age chart
//         vis.ageTitle = vis.ageSvg.append('g')
//             .attr('class', 'title bar-title')
//             .append('text')
//             .attr('transform', `translate(${vis.width / 2}, 10)`)
//             .attr('text-anchor', 'middle')
//             .attr("font-weight", "bold");
//
//         // add title for race chart
//         vis.raceTitle = vis.raceSvg.append('g')
//             .attr('class', 'title bar-title')
//             .append('text')
//             .attr('transform', `translate(${vis.width / 2}, 10)`)
//             .attr('text-anchor', 'middle')
//             .attr("font-weight", "bold");
//
//         // Call wrangle function
//         vis.wrangleData();
//     }
//
//     wrangleData() {
//         let vis = this;
//
//         // Filter data based on selected state
//         vis.filteredAgeData = vis.ageData.filter((d) => d.State === vis.selectedState);
//         vis.filteredRaceData = vis.raceData.filter((d) => d.State === vis.selectedState);
//
//         // Combine age and race data
//         let combinedData = vis.combineData(vis.filteredAgeData, vis.filteredRaceData);
//
//         // Call update function with combined data
//         vis.updateVis(combinedData);
//     }
//
//     combineData(ageData, raceData) {
//         // Combine age and race data using a common identifier (e.g., State)
//         // Modify this function based on your actual data structure
//         // For example, you might use a library like lodash to merge data by a common key
//         return ageData.map(ageItem => {
//             const raceItem = raceData.find(race => race.State === ageItem.State);
//             return raceItem ? { ...ageItem, ...raceItem } : null;
//         }).filter(combinedItem => combinedItem !== null);
//     }
//
//     updateVis(data) {
//         let vis = this;
//
//         // Define categories and color scale
//         let categories, colorScale;
//         // Assuming you have a way to determine the selected data type (age or race)
//         let dataType = vis.selectedDataType;
//
//         if (dataType === "age") {
//             categories = ["Children 0-18", "Adults 19-25", "Adults 26-34", "Adults 35-54", "Adults 55-64", "65+"];
//             colorScale = d3.scaleOrdinal()
//                 .domain(categories)
//                 .range(["#1f78b4", "#33a02c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"]);
//
//             // Remove existing icons for age chart
//             vis.ageSvg.selectAll(".age-person-icon").remove();
//
//             // Append icons to the SVG for age chart
//             vis.ageSvg.selectAll(".age-person-icon")
//                 .data(icons)
//                 .enter()
//                 .append("foreignObject")
//                 .attr("class", "age-person-icon")
//             // ... (Other attributes and styling)
//         } else if (dataType === "race") {
//             categories = ["White", "Black", "Hispanic", "Asian", "American_Indian", "Native_Hawaiian_Pacific_Islander", "Multiple_Races"];
//             colorScale = d3.scaleOrdinal()
//                 .domain(categories)
//                 .range(["#1f78b4", "#33a02c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#b15928"]);
//
//             // Remove existing icons for race chart
//             vis.raceSvg.selectAll(".race-person-icon").remove();
//
//             // Append icons to the SVG for race chart
//             vis.raceSvg.selectAll(".race-person-icon")
//                 .data(icons)
//                 .enter()
//                 .append("foreignObject")
//                 .attr("class", "race-person-icon")
//             // ... (Other attributes and styling)
//         }
//
//         // Update the title for age chart
//         vis.ageTitle.text(`Age Breakdown - ${vis.selectedState}`);
//
//         // Update the title for race chart
//         vis.raceTitle.text(`Race Breakdown - ${vis.selectedState}`);
//     }
// }


// ---MAIN.JS
    // myAgeVis = new PeopleVis("vis-container", dataArray[0], dataArray[1], "age");

//     myAgeVis = new PeopleVis("ageChartContainer", dataArray[0], dataArray[1], "age");
//
// myRaceVis = new PeopleVis("raceChartContainer", dataArray[0], dataArray[1], "race");
// // myRaceVis = new PeopleVis("vis-container", dataArray[0], dataArray[1], "race");

// -- HTML
// <div id="ageChartContainer"></div>
// <div id="raceChartContainer"></div>