var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data.csv").then(function(Data) {
  console.log(Data)

    Data.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
      data.abbr = data.abbr;
    });


    var xLinearScale = d3.scaleLinear()
      .domain([30, d3.max(Data, d => d.age)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([8, d3.max(Data, d => d.smokes)])
      .range([height, 0]);


    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

//circle
    var circlesGroup = chartGroup.selectAll("circle")
    .data(Data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "10")
    .attr("fill", "#98ceeb")
    // .attr("opacity", ".5");

    //circle text
    var text = chartGroup.selectAll()
    .data(Data)
    .enter()
    .append("text")
    .attr("dx", d => xLinearScale(d.age))
    .attr("dy", d => yLinearScale(d.smokes))
    .text(d => (d.abbr))
    .attr("fill", "white")
    .attr("font-size", 8)
    .style("text-anchor", "middle");

    //y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokes (%)")
      .attr("font-weight", 900)
      .attr("font-size", 20);

      //x axis 
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Age(Median)")
      .attr("font-weight", 900)
      .attr("font-size", 20);
  }).catch(function(error) {
    console.log(error);
  });

  //tooltip
  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.state}<br>Age (%): ${d.age}<br>Smokes(%): ${d.smokes}`);
  });

chartGroup.call(toolTip);

//click
chartGroup.on("click", function(data) {
  toolTip.show(data, this);
})
  // onmouseout event
  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });

