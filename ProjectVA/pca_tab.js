function colores_range(n,start,end) {
  var colores_g = ["blue", "yellow", "red"]
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
}
function handleMouseOut2(d,i){
  div.transition()		
  .duration(200)		
  .style("opacity", 0);		
}

var pca_selected=[];

var bru;
//set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
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

//Read the data
d3.csv("ProjectVA/standard/Ranking-2020-Coords-clean.csv").then( 
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
      .style("opacity", 0.5)

      bru=d3.brush()                 // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [width2,height2] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
    
  // Add brushing
  svg
    .call(bru )

  // Function that is triggered when brushing is performed
  function updateChart(event) {
    extent = event.selection
    myCircle.classed("selected", 
    function(d){
      var ret=isBrushed(extent, x(d.pca_1), y(d.pca_2)); 
      const index = pca_selected.indexOf(d);
      if(ret){
        if (index <= -1) {
          pca_selected.push(d);
        }
      }else{
        
        if (index > -1) {
          pca_selected.splice(index, 1);
        }
      }
      return ret; } );
    console.log(pca_selected);
  }

  // A function that return TRUE or FALSE according if a dot is in the selection or not
  function isBrushed(brush_coords, cx, cy) {
       var x0 = brush_coords[0][0],
           x1 = brush_coords[1][0],
           y0 = brush_coords[0][1],
           y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
  }

})


var years = ["2020", "2019", "2018","2016"];

var select = d3.select('#pca_scatter')
  .append('select')
  	.attr('class','select')
    .on('change',onchange);

var options = select
    .selectAll('option')
      .data(years).enter()
      .append('option')
          .text(function (d) { return d; });

function onchange() {
    selectValue = d3.select('select').property('value')
   pca_selected=[];
    d3.csv("ProjectVA/pca_csv/pca_year"+selectValue+".csv").then (function(data) {

      
        // Add dots
        svg.selectAll("circle").transition().duration(2000)
            .attr("cx", 0 )
            .attr("cy", 0 )
            .attr("r", 2)
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
      })
};