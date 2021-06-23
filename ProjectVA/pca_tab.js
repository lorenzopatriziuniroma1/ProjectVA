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

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width2 = 460 - margin.left - margin.right,
    height2 = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg3 = d3.select("#pca_scatter")
  .append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
    .attr("id", "pca_scatter_svg")
    .style("fill","red")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

function colores_range(n,start,end) {
            var colores_g = ["blue", "yellow", "red"]
            var step=(end-start)/3;
            var i=0;
            if(n<start+step){i=0}
            if(start+step<=n && n<start+2*step){i=1}
            if(start+2*step<=n){i=2}
            return colores_g[i];
          }
var myColor = d3.scaleLinear().domain([0,100])
.range(["blue", "red"])
//Read the data
d3.csv("ProjectVA/pca_csv/pca_year2020.csv").then (function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([-4, 7])
    .range([ 0, width2 ]);
  svg3.append("g")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-3, 5])
    .range([ height2, 0]);
  svg3.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  svg3.append('g')
  .attr("id","plot")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.pca_1); } )
      .attr("cy", function (d) { return y(d.pca_2); } )
      .attr("r", 2)
      .attr("name","circle")
      .on("mouseover", handleMouseOn)
      .on("mouseout", handleMouseOut2)
      .style("fill", function(d){return colores_range(d.OverallScore,0,100)})
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
    d3.csv("ProjectVA/pca_csv/pca_year"+selectValue+".csv").then (function(data) {

      
        // Add dots
        svg3.selectAll("circle").transition().duration(2000)
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
svg3.selectAll("circle").data(data).transition().duration(2000)
.attr("cx", function (d) { return x(d.pca_1); } )
.attr("cy", function (d) { return y(d.pca_2); } )
    .attr("r", 2)
    .style("fill", function(d){return colores_range(d.OverallScore,0,100)})
      })
};


