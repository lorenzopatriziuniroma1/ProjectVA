const width = 800;
const height = 500;
const svg1 = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);
 
var g = svg1.append("g");
const projection = d3.geoMercator()
    .translate([width / 2, height / 2]) // translate to center of screen
    .scale([100]); // scale things down so see entire US
 
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

      // Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity
     // console.log(i);
     const index = selected.indexOf(i);
     if (index <= -1) {
         d3.select(this).style("fill","orange");
     }
      /*g.append("text")
      .attr("id", "t" + i.Institution )
      .attr("transform", this.attributes.transform.value)//"translate(" + projection([d.Longitude,d.Latitude]) + ")")
      .text(i.Institution)*/

      div.transition()		
      .duration(200)		
      .style("opacity", .9);		
  div	.html(i.Institution + "<br/> Rank =" +i["CurrentRank"])	
      .style("left", (d.pageX) + "px")		
      .style("top", (d.pageY - 28) + "px");
      }

function handleMouseOut(d, i) {  // Add interactivity
    //console.log(i);
    const index = selected.indexOf(i);
    if (index <= -1) {
        d3.select(this).style("fill","red");
    }
        // Select text by id and then remove
       // document.getElementById( "t" + i.Institution ).remove();  // Remove text location
        div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        }
function handleClick(d, i) { // Add interactivity 
    console.log(i);
    const index = selected.indexOf(i);
    if (index > -1) {
      selected.splice(index, 1);
      d3.select(this).style("fill","red");
    }else{
        if(selected.length<5){
            selected.push(i);
            d3.select(this).style("fill","blue");    
        }
    }
    console.log(selected);
}
const path = d3.geoPath().projection(projection);
 //https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json
d3.json("https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json").then(function(uState) {



d3.csv("ProjectVA/pca_csv/pca_year2020.csv").then(function(csv) {
  data = csv;
  
  g.selectAll("circle")
.data(data)
.enter()
.append("circle")
.on("mouseover", handleMouseOver)
.on("mouseout", handleMouseOut)
.on("click", handleClick) 
.attr("r",5).style("fill","red").attr("d",path)
.attr("transform", function(d) {return "translate(" + projection([d.Longitude,d.Latitude]) + ")"+" scale(1.0)";})
.attr("id",function(d){return d.Institution});
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
.on('zoom', function(event) {
  //console.log(d3.event.transform)
   if(event.transform.x*event.transform.k>600){
      event.transform.x=old.x;
    }
    if(event.transform.x/event.transform.k<-600){
      event.transform.x=old.x;
    }
    if(event.transform.y*event.transform.k>400){
      event.transform.y=old.y;
    }
    if(event.transform.y/event.transform.k<-300){
      event.transform.y=old.y;
    }
    old=event.transform
   g.attr("transform",event.transform);


g.selectAll("circle")
   //.attr("d", path.projection(projection))
   .attr("transform", function(d) {
    return "translate(" + projection([parseFloat(d["Longitude"]),parseFloat(d["Latitude"])]) + ")"+" scale("+1/event.transform.k+")";
   });
  // g.selectAll("circle").style("opacity",function(d){ console.log(d["CurrentRank"]>3); return (d["CurrentRank"]<3) ?  10 :  0;})

//g.selectAll("path")  
  // .attr("d", path.projection(projection)); 
  div.transition()		
  .duration(500)		
  .style("opacity", 10);
  div.transition()		
  .duration(500)		
  .style("opacity", 0);
  
});

svg1.call(zoom);

var data;

function changeMin(e){
  g.selectAll("circle").attr("visibility",function(d){  return (d["OverallScore"]>e.value) ?  "visibility" :  "hidden"; });
}

function changeMax(e){
  g.selectAll("circle").attr("visibility",function(d){  return (d["OverallScore"]<e.value) ?  "visibility" :  "hidden";})
}
    //svg1.selectAll("circle")
     // .attr("transform", function(d) {
        //console.log(parseFloat(d["Latitude"])+d3.event.transform.y);
        //console.log(d["Longitude"]);
    //    var x=projection([parseFloat(d["Longitude"]),parseFloat(d["Latitude"])])
    //    return "translate(" + (x[0]+d3.event.transform.y)+","+(x[1]+d3.event.transform.x) + ")"+" scale("+1/d3.event.transform.k+")";})
   // svg1.selectAll('path')
   //  .attr('transform', d3.event.transform);
