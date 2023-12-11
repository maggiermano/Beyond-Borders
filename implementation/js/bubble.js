// Load data using promises

Promise.all([
  d3.csv("data/states.csv"),
  d3.json("data/housingPrice-median.json")
]).then(function(data) {
  var states = data[0];
  var housingPriceMedian = data[1];

  // Call the function with the loaded data
  createBubbleChart(null, states, housingPriceMedian);
}).catch(function(error) {
  console.error("Error loading data:", error);
});

function createBubbleChart(error, states, housingPriceMedian) {
  var costOfLivings = states.map(function(state) { return +state.CostOfLiving; });
  var costOfLivingExtent = d3.extent(costOfLivings),
      costOfLivingScaleX,
      costOfLivingScaleY;

  var housingPrices = new Set(states.map(function(state) {return state.HousingPriceCode; }));
  // Define your own three custom colors
  var customColors = ["#d95f02","#7570b3","#1b9e77"];

  // Create a color scale using the custom colors
  var housingPriceColorScale = d3.scaleOrdinal().range(customColors)
      .domain([...housingPrices]);

  var width = 1300,
      height = 650;
  var svg,
      circles,
      circleSize = { min: 10, max: 70 };
  var circleRadiusScale = d3.scaleSqrt()
      .domain(costOfLivingExtent)
      .range([circleSize.min, circleSize.max]);

  var forces,
      forceSimulation;

  createSVG();
  toggleHousingPriceKey(true);
  createCircles();
  createForces();
  createForceSimulation();
  addFillListener();
  addGroupingListeners();

// Add an event listener for the 'StateSelectedFullName' event
  document.addEventListener('StateSelectedFullName', function(event) {
    const selectedStateFullName = event.detail;

    // Update the color of the selected state bubble
    updateSelectedStateBubbleColor(selectedStateFullName);

    // Update the title based on the selected state
    const titleElement = document.getElementById('bubble-title');
    if (titleElement) {
      // Clear the existing content
      titleElement.innerHTML = '';

      const titleText = document.createElement('h2');
      titleText.textContent = `COST OF LIVING AND HOUSING PRICES IN ${selectedStateFullName.toUpperCase()}`;
      titleElement.appendChild(titleText);

      const paraText = document.createElement('p');
      paraText.textContent = `The size of the bubbles correlate to cost of living and the colors categorize them by housing prices. (${selectedStateFullName} is shaded in a lighter color!)`;
      titleElement.appendChild(paraText);
    }
  });

  function createSVG() {
    svg = d3.select("#bubble-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
  }

  function toggleHousingPriceKey(showHousingPriceKey) {
    var keyElementWidth = 260,
        keyElementHeight = 20;
    var onScreenYOffset = keyElementHeight*1.5,
        offScreenYOffset = 90;

    createHousingPriceKey();

    var housingPriceKey = d3.select(".housingPrice-key");

    if (showHousingPriceKey) {
      translateHousingPriceKey("translate(0," + (height - onScreenYOffset) + ")");
    } else {
      translateHousingPriceKey("translate(0," + (height + offScreenYOffset) + ")");
    }

    function createHousingPriceKey() {
      // Convert housingPrices set to array and define your custom order
      var housingPricesArray = Array.from(housingPrices);
      var customOrder = ["Low", "Medium", "High"];

      // Sort the array based on custom order
      housingPricesArray.sort((a, b) => customOrder.indexOf(a) - customOrder.indexOf(b));

      var keyWidth = keyElementWidth * housingPricesArray.length;
      var housingPriceKeyScale = d3
          .scaleBand()
          .domain(housingPricesArray)
          .range([(width - keyWidth) / 2, (width + keyWidth) / 2]);

      svg.append("g")
          .attr("class", "housingPrice-key")
          .attr("transform", "translate(0," + (height + offScreenYOffset) + ")")
          .selectAll("g")
          .data([...housingPrices])
          .enter()
          .append("g")
          .attr("class", "housingPrice-key-element");

      d3.selectAll("g.housingPrice-key-element")
          .append("rect")
          .attr("width", keyElementWidth)
          .attr("height", keyElementHeight)
          .attr("x", function(d) { return housingPriceKeyScale(d); })
          .attr("fill", function(d) { return housingPriceColorScale(d); });

      d3.selectAll("g.housingPrice-key-element")
          .append("text")
          .attr("text-anchor", "middle")
          .attr("x", function(d) { return housingPriceKeyScale(d) + keyElementWidth/2; })
          .text(function(d) { return housingPriceMedian[d]; });

      // The text BBox has non-zero values only after rendering
      d3.selectAll("g.housingPrice-key-element text")
          .attr("y", function(d) {
            var textHeight = this.getBBox().height;
            // The BBox.height property includes some extra height we need to remove
            var unneededTextHeight = 4;
            return ((keyElementHeight + textHeight) / 2) - unneededTextHeight;
          });
    }

    function translateHousingPriceKey(translation) {
      housingPriceKey
          .transition()
          .duration(500)
          .attr("transform", translation);
    }
  }

  function isChecked(elementID) {
    return d3.select(elementID).property("checked");
  }

  function createCircles() {
    var formatCostOfLiving = d3.format(",");
    circles = svg.selectAll("circle")
        .data(states)
        .enter()
        .append("circle")
        .attr("r", function(d) { return circleRadiusScale(d.CostOfLiving); })
        .style("stroke", "white")   // Set stroke color to white
        .style("stroke-width", 1.5)
        .on("mouseover", function(event, d) {
          handleMouseover(event, d);
        })
        .on("mouseout", handleMouseout);

    updateCircles();

    var tooltip = svg.append("g")
        .attr("id", "state-info")
        .style("opacity", 0)
        .style("pointer-events", "none");

    tooltip.append("rect")
        .attr("width", 170)
        .attr("height", 40)
        .attr("rx", 10)  // Rounded corners
        .style("fill", "#f0f0f0")
        .style("stroke", "#333")
        .attr("center", "middle")
        .style("stroke-width", 1);

    tooltip.append("text")
        .attr("x", 10)
        .attr("y", 25)
        .style("font-size", "14px")
        .style("fill", "#333");

    function handleMouseover(event, d) {
      var tooltip = d3.select("#state-info");

      tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);

      tooltip.select("text")
          .text(d.StateName + ": " + formatCostOfLiving(d.CostOfLiving));

      var tooltipWidth = tooltip.node().getBBox().width;
      var tooltipHeight = tooltip.node().getBBox().height;

      var xPosition = event.pageX - tooltipWidth / 2;
      var yPosition = event.pageY / 1.4;

      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    }

    function handleMouseout() {
      var tooltip = d3.select("#state-info");

      tooltip.transition()
          .duration(500)
          .style("opacity", 0);
    }
  }

  function updateCircles() {
    circles
        .attr("fill", function(d) {
          return housingPriceColorScale(d.HousingPriceCode);
        });
  }

  function createForces() {
    var forceStrength = 0.05;

    forces = {
      combine:        createCombineForces(),
      housingPrice:      createHousingPriceForces(),
      costOfLiving:     createCostOfLivingForces()
    };

    function createCombineForces() {
      return {
        x: d3.forceX(width / 2).strength(forceStrength),
        y: d3.forceY(height / 2).strength(forceStrength)
      };
    }

    function createHousingPriceForces() {
      return {
        x: d3.forceX(housingPriceForceX).strength(forceStrength),
        y: d3.forceY(housingPriceForceY).strength(forceStrength)
      };

      function housingPriceForceX(d) {
        if (d.HousingPriceCode === "Low") {
          return left(width);
        } else if (d.HousingPriceCode === "Medium") {
          return center(width);
        } else if (d.HousingPriceCode === "High") {
          return right(width);
        }
        return center(width);
      }

      function housingPriceForceY(d) {
        if (d.HousingPriceCode === "Low") {
          return top(height);
        } else if (d.HousingPriceCode === "Medium") {
          return bottom(height);
        } else if (d.HousingPriceCode === "High") {
          return top(height);
        }
        return center(height);
      }

      function left(dimension) { return dimension / 4; }
      function center(dimension) { return dimension / 2; }
      function right(dimension) { return dimension / 4 * 3; }
      function top(dimension) { return dimension / 4+1; }
      function bottom(dimension) { return dimension / 4 * 3-2; }
    }

    function createCostOfLivingForces() {
      var customOrder = ["Low", "Medium", "High"];
      var housingPriceMedianDomain = customOrder.map(function(housingPriceCode) {
        return housingPriceMedian[housingPriceCode];
      });
      var scaledCostOfLivingMargin = circleSize.max;

      costOfLivingScaleX = d3.scaleBand()
          .domain(housingPriceMedianDomain)
          .range([scaledCostOfLivingMargin, width - scaledCostOfLivingMargin*2]);
      costOfLivingScaleY = d3.scaleLog()
          .domain(costOfLivingExtent)
          .range([height - scaledCostOfLivingMargin, scaledCostOfLivingMargin*2]);

      var centerCirclesInScaleBandOffset = costOfLivingScaleX.bandwidth() / 2;
      return {
        x: d3.forceX(function(d) {
          return costOfLivingScaleX(housingPriceMedian[d.HousingPriceCode]) + centerCirclesInScaleBandOffset;
        }).strength(forceStrength),
        y: d3.forceY(function(d) {
          return costOfLivingScaleY(d.CostOfLiving);
        }).strength(forceStrength)
      };
    }
  }

  function createForceSimulation() {
    forceSimulation = d3.forceSimulation()
        .force("x", forces.combine.x)
        .force("y", forces.combine.y)
        .force("collide", d3.forceCollide(forceCollide));
    forceSimulation.nodes(states)
        .on("tick", function() {
          circles
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });
        });
  }

  function forceCollide(d) {
    return costOfLivingGrouping() ? 0 : circleRadiusScale(d.CostOfLiving) + 1;
  }

  function costOfLivingGrouping() {
    return isChecked("#costOfLiving");
  }

  function addFillListener() {
    d3.selectAll('input[name="fill"]')
        .on("change", function() {
          toggleHousingPriceKey(!costOfLivingGrouping());
          updateCircles();
        });
  }

  function addGroupingListeners() {
    addListener("#combine", forces.combine);
    addListener("#housingPrices", forces.housingPrice);
    addListener("#costOfLiving", forces.costOfLiving);

    function addListener(selector, forces) {
      d3.select(selector).on("click", function () {
        updateForces(forces);
        toggleHousingPriceKey(!costOfLivingGrouping());
        toggleCostOfLivingAxes(costOfLivingGrouping());
      });
    }

    function updateForces(forces) {
      forceSimulation
          .force("x", forces.x)
          .force("y", forces.y)
          .force("collide", d3.forceCollide(forceCollide))
          .alphaTarget(0.5)
          .restart();
    }

    function toggleCostOfLivingAxes(showAxes) {
      var onScreenXOffset = 40,
          offScreenXOffset = -40;
      var onScreenYOffset = 40,
          offScreenYOffset = 100;

      // Remove existing axes
      d3.selectAll(".x-axis, .y-axis").remove();

      // Call createAxes before selecting xAxis and yAxis
      createAxes();

      var xAxis = d3.select(".x-axis"),
          yAxis = d3.select(".y-axis");

      if (showAxes) {
        translateAxis(xAxis, "translate(0," + (height - onScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + onScreenXOffset + ",0)");
      } else {
        translateAxis(xAxis, "translate(0," + (height + offScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + offScreenXOffset + ",0)");
      }

      function createAxes() {
        // Check if axes already exist
        if (d3.select(".x-axis").empty() && d3.select(".y-axis").empty()) {
          var numberOfTicks = 15,
              tickValues = d3.range(85, 200, 10);

          var xAxis = d3.axisBottom(costOfLivingScaleX)
              .ticks(3, ".0s");

          svg.append("g")
              .attr("class", "x-axis")
              .attr("transform", "translate(0," + (height + offScreenYOffset) + ")")
              .call(xAxis)
              .selectAll(".tick text")
              .attr("font-size", "16px");

          var yAxis = d3.axisLeft(costOfLivingScaleY)
              .ticks(numberOfTicks)
              .tickValues(tickValues)
              .tickFormat(d3.format(".0f"))
              .tickSizeOuter(0);

          svg.append("g")
              .attr("class", "y-axis")
              .attr("transform", "translate(" + offScreenXOffset + ",0)")
              .call(yAxis);
        }
      }

      function translateAxis(axis, translation) {
        axis
            .transition()
            .duration(500)
            .attr("transform", translation);
      }
    }
  }

  function updateSelectedStateBubbleColor(selectedStateFullName) {
    circles
        .attr("fill", function(d) {
          // Check if it's the selected state
          if (d.StateName === selectedStateFullName) {
            // Set specific colors for high, medium, low categories
            if (d.HousingPriceCode === "High") {
              return "#90ee90";  // Light green for high category
            } else if (d.HousingPriceCode === "Medium") {
              return "#FFD580";   // Light blue for medium category
            } else if (d.HousingPriceCode === "Low") {
              return "#EDC8FF"; // Light orange for low category
            }
          } else {
            // Use the default color scale for other states
            return housingPriceColorScale(d.HousingPriceCode);
          }
        });
  }
}
