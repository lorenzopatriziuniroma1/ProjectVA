function colores_range(n,start,end) {
  var colores_g = ["blue", "black", "red"]
  var step=(end-start)/3;
  var i=0;
  if(n<start+step){i=0}
  if(start+step<=n && n<start+2*step){i=1}
  if(start+2*step<=n){i=2}
  return colores_g[i];
}

function handleMouseOn(d,i){
  div.transition()		
  .duration(200)		
  .style("opacity", .9);		
div	.html(i.Institution + "<br/> Rank =" +i["CurrentRank"])	
  .style("left", (d.pageX) + "px")		
  .style("top", (d.pageY - 28) + "px");

  d3.select(this).style("stroke", "red")
}
function handleMouseOut2(d,i){
  div.transition()		
  .duration(200)		
  .style("opacity", 0);		

  d3.select(this).style("stroke", "#69b3a2")
}

var pca_selected=[];
var dimensions;
var bru;
//set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 80, left: 60},
    width2 = 460 - margin.left - margin.right,
    height2 = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#pca_scatter")
  .append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
  var svg2 = d3.select("#pca_scatter")
          .append("svg")
            .attr("width", width2 + margin.left + margin.right)
            .attr("height", height2 + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
        
//Read the data
d3.csv("ProjectVA/pca_csv/pca_year2020.csv").then( 
function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([-4, 7])
    .range([ 0, width2 ]);
  svg.append("g")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-3, 5])
    .range([ height2, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));


  // Add dots
  var myCircle = svg.append('g')
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.pca_1); } )
      .attr("cy", function (d) { return y(d.pca_2); } )
      .attr("r", 8)
      .style("fill", function (d) { return colores_range(d.OverallScore,0,100) } )
      .style("opacity", 0.5);
      
      svg.selectAll("circle").transition().duration(5000).attr("r",2);

      bru=d3.brush()                 // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [width2,height2] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
    
  // Add brushing
  svg
    .call(bru )

  // Function that is triggered when brushing is performed
  function updateChart(event) {
    extent = event.selection
    svg2.selectAll(".myPath").style("opacity", 0.1).style("stroke", "#69b3a2")
    myCircle.classed("selected", 
    function(d){
      var ret=isBrushed(extent, x(d.pca_1), y(d.pca_2)); 
      const index = pca_selected.indexOf(d);
      if(ret){
        if (index <= -1) {
          pca_selected.push(d);
  
         // svg2.select( "#"+d.Institution.replace(/[^a-zA-Z]/g, "")).style("stroke", "black").style("opacity", 1)
        }
      }else{
        
        if (index > -1) {
          pca_selected.splice(index, 1);
          //svg2.select("#"+d.Institution.replace(/[^a-zA-Z]/g, "")).style("stroke", "#69b3a2")
        }
      }
      return ret; } );
    if (pca_selected.length==0){
      svg2.selectAll(".myPath").style("opacity", 0.5).style("stroke", "#69b3a2")
    }else{
      svg2.selectAll(".myPath").filter( function(d) {
        return pca_selected.some(function(el) { 
          return el.Institution.replace(/[^a-zA-Z]/g, "") == d.Institution.replace(/[^a-zA-Z]/g, "") })}).style("opacity", 1).style("stroke", "black");
    
    }
  }

  // A function that return TRUE or FALSE according if a dot is in the selection or not
  function isBrushed(brush_coords, cx, cy) {
       var x0 = brush_coords[0][0],
           x1 = brush_coords[1][0],
           y0 = brush_coords[0][1],
           y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
  }
// Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
 dimensions = Object.keys(data[0]).filter(function(d) { return ['CurrentRank', 'LastRank','Age','Academicscorerscore', 
'Employerscore','FacultyStudentscore', 'CitationsPerFacultyscore', 'InternationalFacultyscore', 'InternationalStudentscore', 'OverallScore'].includes(d); })

  
  console.log(dimensions);

// For each dimension, I build a linear scale. I store all in a y object
    var y2 = {}
    for (i in dimensions) {
      name_d = dimensions[i]
      y2[name_d] = d3.scaleLinear()
        .domain( d3.extent(data, function(d) { return +d[name_d]; }) )
        .range([height2, 0])
    }
  
    // Build the X scale -> it find the best position for each Y axis
    var x2 = d3.scalePoint()
      .range([0, width2])
      .padding(1)
      .domain(dimensions);
      // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
    return d3.line()(dimensions.map(function(p) { return [x2(p), y2[p](d[p])]; }));
};
 // Draw the lines
svg2
 .selectAll("myPath")
 .data(data)
 .enter().append("path")
 .attr("id", function(d) { return d.Institution.replace(/[^a-zA-Z]/g, "") ;})
 .attr("class","myPath")
 .attr("d",  path)
 .style("fill", "none")
 .style("stroke", "#69b3a2")
 .style("opacity", 0.5)
 .on("mouseover", handleMouseOn)
.on("mouseout", handleMouseOut2);

  // Draw the axis:
  svg2.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(" + x2(d) + ")"; })
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y2[d])); })
    // Add axis title
    .append("text")
    .attr("transform","translate(0,"+(height2+15)+") rotate(45)")
      .style("text-anchor", "start")
      .text(function(d) { return d; })
      
      .style("fill", "black");
})




var years = ["2020", "2019", "2018","2016"];

var select = d3.select('#pca_scatter')
  .append('select')
  	.attr('class','select')
    .attr('id',"pca_select")
    .on('change',onchange);

var options = select
    .selectAll('option')
      .data(years).enter()
      .append('option')
          .text(function (d) { return d; });

function onchange() {
    selectValue = d3.select('#pca_select').property('value')
   pca_selected=[];
    d3.csv("ProjectVA/pca_csv/pca_year"+selectValue+".csv").then (function(data) {

      
        // Add dots
        svg.selectAll("circle").transition().duration(2000)
            .attr("cx", 0 )
            .attr("cy", 0 )
            .attr("r", 2).remove();
    // Add X axis
  var x = d3.scaleLinear()
  .domain([-4, 7])
  .range([ 0, width2 ]);

// Add Y axis
var y = d3.scaleLinear()
  .domain([-3, 5])
  .range([ height2, 0]);


// Add dots
svg.selectAll("circle").data(data).transition().duration(2000)
.attr("cx", function (d) { return x(d.pca_1); } )
.attr("cy", function (d) { return y(d.pca_2); } )
    .attr("r", 2)
    .style("fill", function(d){return colores_range(d.OverallScore,0,100)})

    svg.selectAll("circle").exit().remove



    // For each dimension, I build a linear scale. I store all in a y object
    var y2 = {}
    for (i in dimensions) {
      name_d = dimensions[i]
      y2[name_d] = d3.scaleLinear()
        .domain( d3.extent(data, function(d) { return +d[name_d]; }) )
        .range([height2, 0])
    }
  
    // Build the X scale -> it find the best position for each Y axis
    var x2 = d3.scalePoint()
      .range([0, width2])
      .padding(1)
      .domain(dimensions);
      // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
    return d3.line()(dimensions.map(function(p) { return [x2(p), y2[p](d[p])]; }));
};

console.log(data)
 // bind data
 var appending = svg2.selectAll('.myPath').data(data)

     // add new elements
     appending
     .transition()
     .duration(5000)
     .attr("id", function(d) {console.log("ciao"); return d.Institution.replace(/[^a-zA-Z]/g, "") ;})
     .attr("class","myPath")
     .attr("d",  path)
     .style("fill", "none")
     .style("stroke", "#69b3a2")
     .style("opacity", 0.5)
     
     appending
     .on("mouseover", handleMouseOn)
    .on("mouseout", handleMouseOut2);


        // remove old elements
        appending.exit().remove();

      })

};