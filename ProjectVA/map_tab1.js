var width = 800;
var height = 500;
var svg1 = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background","#b3ccff")
 
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
         d3.select(this).style("fill",palette_divergent_map[1]);
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
        d3.select(this).style("fill",palette_divergent_map[2]);
    }
        // Select text by id and then remove
       // document.getElementById( "t" + i.Institution ).remove();  // Remove text location
        div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        }
function handleClick(d, i) { // Add interactivity 
    const index = selected.indexOf(i);
    if (index > -1) {
      selected.splice(index, 1);
      d3.select(this).style("fill",palette_divergent_map[2]);
      display_data(selected)  
    }else{
        if(selected.length<5){
            selected.push(i);
            d3.select(this).style("fill",palette_divergent_map[0]);
              
            display_data(selected)  
        }
    }
   
}
const path = d3.geoPath().projection(projection);
 //https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json

 var stats;
d3.json("https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json").then(function(uState) {


  d3.csv("ProjectVA/pca_csv/pca_year_group_2020.csv").then(function(csv) {
    stats=csv;
    g.selectAll('path')
    .data(uState.features)
    .enter()
    .append('path')
    .attr("d", path)
    .style("fill",function(d){
      let c=csv.filter(function(row) {
      return row['Country'] == d.properties.name;
  })
  if(c[0] == undefined) return "grey"; 
      return colores_range2(c[0]["CurrentRank_count"],0,50)
    })
    .style("stroke","#b3ccff")
    .style("stroke-width",".1px")
      
         
  });
  d3.csv("ProjectVA/pca_csv/pca_year2020.csv").then(function(csv) {
    data = csv;
    
    g.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut)
  .on("click", handleClick) 
  .attr("r",5).style("fill",palette_divergent_map[2]).attr("d",path)
  .attr("transform", function(d) {return "translate(" + projection([d.Longitude,d.Latitude]) + ")"+" scale(1.0)";})
  .attr("id",function(d){return d.Institution});
  });

})



function colores_range2(n,start,end) {
  var colores_g =palette_sequential_map;
  var step=(end-start)/3;
  var i=0;
  if(n<start+step){i=0}
  if(start+step<=n && n<start+2*step){i=1}
  if(start+2*step<=n){i=2}
  return colores_g[i];
}


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

  g.selectAll("circle").attr("visibility",function(d){  return (d["OverallScore"]>e) ?  "visibility" :  "hidden"; });
}

function changeMax(e){

  g.selectAll("circle").attr("visibility",function(d){  return (d["OverallScore"]<e) ?  "visibility" :  "hidden"; });
}
    //svg1.selectAll("circle")
     // .attr("transform", function(d) {
        //console.log(parseFloat(d["Latitude"])+d3.event.transform.y);
        //console.log(d["Longitude"]);
    //    var x=projection([parseFloat(d["Longitude"]),parseFloat(d["Latitude"])])
    //    return "translate(" + (x[0]+d3.event.transform.y)+","+(x[1]+d3.event.transform.x) + ")"+" scale("+1/d3.event.transform.k+")";})
   // svg1.selectAll('path')
   //  .attr('transform', d3.event.transform);


   var legend = svg1.append('g')
  .attr("transform", "translate(" + (width-width*0.4)  + "," + (height-height*0.4 ) + ")")
  .append('svg')
  .style("background","#b3ccff");

  size=13;
   // Handmade legend
   legend.append("rect")
   .attr("x",180).attr("y",130-10)    
   .attr("width", size)
   .attr("height", size)
   .style("fill", palette_sequential_map[2])
   legend.append("text").attr("x", 200).attr("y", 130).text("High #University").style("font-size", "15px").attr("alignment-baseline","middle")

   legend.append("rect")
   .attr("x",180).attr("y",150-10)    
   .attr("width", size)
   .attr("height", size)
   .style("fill", palette_sequential_map[1])
   legend.append("text").attr("x", 200).attr("y", 150).text("Middle #University").style("font-size", "15px").attr("alignment-baseline","middle")
   
   legend.append("rect")
   .attr("x",180).attr("y",170-10)    
   .attr("width", size)
   .attr("height", size)
   .style("fill", palette_sequential_map[0])
   legend.append("text").attr("x", 200).attr("y", 170).text("Low #University").style("font-size", "15px").attr("alignment-baseline","middle")
  
   legend.append("rect")
   .attr("x",180).attr("y",190-10)    
   .attr("width", size)
   .attr("height", size)
   .style("fill", "gray")
   legend.append("text").attr("x", 200).attr("y", 190).text("0 Univesity").style("font-size", "15px").attr("alignment-baseline","middle")

  // Range
 
  var sliderRange = d3
  .sliderBottom()
  .min(0)
  .max(100)
  .width(300)
  .ticks(5)
  .step(1)
  .default([0, 100])
  .fill('#2196f3')
  .on('onchange', val => {
    d3.select('p#value-range').text(val.join('-'));
 
    changeMin(val[0]);
    changeMax(val[1]);
    console.log(val);
  });

  var gRange = d3
  .select('div#slider-range')
  .append('svg')
  .attr('width', 500)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)');

gRange.call(sliderRange);

d3.select('p#value-range').text(
  sliderRange
    .value()
    .join('-')
);