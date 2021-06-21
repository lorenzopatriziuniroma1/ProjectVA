const width = 800;
const height = 500;
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
 
var g = svg.append("g");
const projection = d3.geoMercator()
    .translate([width / 2, height / 2]) // translate to center of screen
    .scale([100]); // scale things down so see entire US
 


      // Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity
      console.log(this.attributes.transform.value);
      d3.select(this).style("fill","orange");
      g.append("text")
      .attr("id", "t" + d.x + "-" + d.y + "-" + i)
      .attr("transform", this.attributes.transform.value)//"translate(" + projection([d.Longitude,d.Latitude]) + ")")
      .text(d.Institution)
      }

function handleMouseOut(d, i) {  // Add interactivity
        d3.select(this).style("fill","red");
        // Select text by id and then remove
        d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
        }
function handleClick(d, i) { // Add interactivity 
    
}
const path = d3.geoPath().projection(projection);
 
d3.json("GeoMap/custom.geo.json", function(error, uState) {
if (error) throw error;

d3.csv("ProjectVA\\Ranking-2019-Coords-clean.csv",
function(csv) {
  data = csv;
  g.selectAll("circle")
.data(data)
.enter()
.append("circle")
.on("mouseover", handleMouseOver)
.on("mouseout", handleMouseOut)
.on("click", handleClick) 
.attr("r",5).style("fill","red").attr("d",path)
.attr("transform", function(d) {return "translate(" + projection([d.Longitude,d.Latitude]) + ")"+" scale(1.0)";});
});

    g.selectAll('path')
        .data(uState.features)
        .enter()
        .append('path')
        .attr("d", path)
    
       
});
var old;
var zoom = d3.zoom()
.scaleExtent([1, 85])
.on('zoom', function() {
  //console.log(d3.event.transform)
   if(d3.event.transform.x*d3.event.transform.k>600){
      d3.event.transform.x=old.x;
    }
    if(d3.event.transform.x/d3.event.transform.k<-600){
      d3.event.transform.x=old.x;
    }
    if(d3.event.transform.y*d3.event.transform.k>400){
      d3.event.transform.y=old.y;
    }
    if(d3.event.transform.y/d3.event.transform.k<-300){
      d3.event.transform.y=old.y;
    }
    old=d3.event.transform
   g.attr("transform",old);
g.selectAll("circle")
   .attr("d", path.projection(projection))
   .attr("transform", function(d) {
    return "translate(" + projection([parseFloat(d["Longitude"]),parseFloat(d["Latitude"])]) + ")"+" scale("+1/d3.event.transform.k+")";
   });

g.selectAll("path")  
   .attr("d", path.projection(projection)); 
});

svg.call(zoom);

var data;

    //svg.selectAll("circle")
     // .attr("transform", function(d) {
        //console.log(parseFloat(d["Latitude"])+d3.event.transform.y);
        //console.log(d["Longitude"]);
    //    var x=projection([parseFloat(d["Longitude"]),parseFloat(d["Latitude"])])
    //    return "translate(" + (x[0]+d3.event.transform.y)+","+(x[1]+d3.event.transform.x) + ")"+" scale("+1/d3.event.transform.k+")";})
   // svg.selectAll('path')
   //  .attr('transform', d3.event.transform);
