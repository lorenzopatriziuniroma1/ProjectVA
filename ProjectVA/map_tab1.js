var width =container_width
var height = container_heigth*0.4;

var margin = {top: 100, right: 30, bottom: 80, left: 60}


var symbolGenerator = d3.symbol()
  .type(d3.symbolStar)
  .size(80);

var pathData = symbolGenerator();
var svg1 = d3.selectAll("#map")
  .append("svg")
    .attr("width", width) 
    .attr("height", height )
    .style("background","#b3ccff")
    .style("margin-bottom","10px")

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
     const index =findWithAttr(selected,"Institution",i.Institution);
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
  div	.html(i.Institution + "<br/> Rank =" +i["CurrentRank"]+"<br/> year= " +i.anno)	
      .style("left", (d.pageX) + "px")		
      .style("top", (d.pageY - 28) + "px");
      }

function handleMouseOut(d, i) {  // Add interactivity
    //console.log(i);
    const index = findWithAttr(selected,"Institution",i.Institution);;
    if (index <= -1) {
        d3.select(this).style("fill",  d3.select(this).attr("co"));
    }
        // Select text by id and then remove
       // document.getElementById( "t" + i.Institution ).remove();  // Remove text location
        div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        }
function handleClick(d, i) { // Add interactivity 
    var  index =findWithAttr(selected,"Institution",i.Institution);

    if (index > -1) {
    
      selected.splice(index, 1);
      d3.select(this).style("fill",  d3.select(this).attr("co"));
      display_data(selected)  
    }else{
        if(selected.length<5){
            selected.push(i);
            d3.select(this).style("fill",palette_divergent_map[0]);
              
            display_data(selected)  
        }
    }
    console.log(selected)
}
const path = d3.geoPath().projection(projection);


 var stats;
d3.json("https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json").then(function(uState) {


  d3.csv("ProjectVA/pca_csv/pca_year_v2_2020.csv").then(function(csv) {
    data = csv;
    
    var color= d3.rollup(data, v =>{return v.length }, d => d.Country)

    g.selectAll('path')
    .data(uState.features)
    .enter()
    .append('path')
    .attr("d", path)
    .attr("class","country")
    .style("fill",function(d){
  if(color.get(d.properties.name) == undefined) return "grey"; 
      return colores_range2(color.get(d.properties.name),0,50)
    })
    .style("stroke","#b3ccff")
    .style("stroke-width",".1px")


    g.selectAll("circle")
  .data(data)
  .enter()
  .filter(d=>{
    return d.CurrentRank<=10;
  })
  .append("path")
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut)
  .on("click", handleClick) 
  .attr("r",5)
  .style("fill","pink")
  .attr("d",pathData)
  .attr("transform", function(d) {return "translate(" + projection([d.Longitude,d.Latitude]) + ")"+" scale(1.0)";})
  .attr("id",function(d){return d.Institution})
  .attr("class","University star")
  .attr("co","pink");


  g.selectAll("circle")
  .data(data)
  .enter()
  .filter(d=>{
    return d.CurrentRank>10;
  })
  .append("circle")
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut)
  .on("click", handleClick) 
  .attr("r",5).style("fill",palette_divergent_map[2])
  .attr("transform", function(d) {return "translate(" + projection([d.Longitude,d.Latitude]) + ")"+" scale(1.0)";})
  .attr("id",function(d){return d.Institution})
  .attr("class","University cityCircle")
  .attr("co",palette_divergent_map[2]);


  d3.selectAll(".star").moveToFront()

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
  if(event.transform.x*event.transform.k>width*0.8){
    event.transform.x=old.x;
  }
  if(event.transform.x/event.transform.k<-width*0.8){
    event.transform.x=old.x;
  }
  if(event.transform.y*event.transform.k>height*0.8){
    event.transform.y=old.y;
  }
  if(event.transform.y/event.transform.k<-height*0.8){
    event.transform.y=old.y;
  }
    old=event.transform
   g.attr("transform",event.transform);

g.selectAll(".University")
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
g.selectAll("circle").attr("visibility",function(d){ return (d["OverallScore"]>e) ?  "visibility" :  "hidden"; });
}

function changeMax(e){

  g.selectAll("circle").attr("visibility",function(d){  return (d["OverallScore"]<e) ?  "visibility" :  "hidden"; });
}


function changeMinMax(min,max){
  g.selectAll(".University").attr("visibility",function(d){  return (d["OverallScore"]<=max && d["OverallScore"]>=min) ?  "visibility" :  "hidden"; });
}

   var legend = svg1.append('g')
  .attr("transform", "translate(" + (width-width*0.4)  + "," + (height-height*0.4 ) + ")")
  .append('svg')
  .style("background","#b3ccff");

  size=13;
   // Handmade legend
   legend.append("rect")
   .attr("x",width*0.24).attr("y",height*0.22-10)    
   .attr("width", size)
   .attr("height", size)
   .style("fill", palette_sequential_map[2])
   legend.append("text").attr("x", width*0.24+20).attr("y", height*0.22).text("High #University").style("font-size", "15px").attr("alignment-baseline","middle")

   legend.append("rect")
   .attr("x",width*0.24).attr("y",height*0.22+20-10)    
   .attr("width", size)
   .attr("height", size)
   .style("fill", palette_sequential_map[1])
   legend.append("text").attr("x", width*0.24+20).attr("y", height*0.22+20).text("Middle #University").style("font-size", "15px").attr("alignment-baseline","middle")
   
   legend.append("rect")
   .attr("x",width*0.24).attr("y",height*0.22-10+40)    
   .attr("width", size)
   .attr("height", size)
   .style("fill", palette_sequential_map[0])
   legend.append("text").attr("x", width*0.24+20).attr("y", height*0.22+40).text("Low #University").style("font-size", "15px").attr("alignment-baseline","middle")
  
   legend.append("rect")
   .attr("x",width*0.24).attr("y",height*0.22-10+60)    
   .attr("width", size)
   .attr("height", size)
   .style("fill", "gray")
   legend.append("text").attr("x", width*0.24+20).attr("y", height*0.22+60).text("0 Univesity").style("font-size", "15px").attr("alignment-baseline","middle")

  // Range
 
  var sliderRange = d3
  .sliderBottom()
  .min(0)
  .max(100)
  .width(width*0.3)
  .ticks(5)
  .step(1)
  .default([0, 100])
  .fill('#2196f3')
  .on('onchange', val => {
    d3.select('#value-range').text(val.join('-'));
 
changeMinMax(val[0],val[1]);

  });

  var gRange = d3
  .select('div#slider-range')
  .append('svg')
  .attr('width', width*0.4)
  .attr('height', 70)
  .append('g')
  .attr('transform', 'translate(30,30)');

gRange.call(sliderRange);

d3.select('#value-range').text(
  sliderRange
    .value()
    .join('-')
);


function  updateLittleMap(year){
  d3.csv("ProjectVA/pca_csv/pca_year_v2_"+year+".csv").then(function(data) {

    var transfomr=svg1.select(".star").attr("transform").split("scale")[1]



var circle = g.selectAll(".cityCircle").data([])

circle.exit().remove()


g.selectAll(".cityCircle")
.data(data)
.enter()
.filter(d=>{
  return d.CurrentRank>10;
})
.append("circle")
.on("mouseover", handleMouseOver)
.on("mouseout", handleMouseOut)
.on("click", handleClick) 
.attr("r",5).style("fill",palette_divergent_map[2])
.attr("transform", function(d) {return "translate(" + projection([d.Longitude,d.Latitude]) + ")"+" scale"+transfomr;})
.attr("id",function(d){return d.Institution})
.attr("class","University cityCircle")
.attr("co",palette_divergent_map[2]);

//circle.enter().attr("r",0).transition().duration(2000).attr("r",5)

g.selectAll(".star").data([]).exit().remove()


g.selectAll(".star")
.data(data)
.enter()
.filter(d=>{
  return d.CurrentRank<=10;
})
.append("path")
.on("mouseover", handleMouseOver)
.on("mouseout", handleMouseOut)
.on("click", handleClick) 
.style("fill","pink")
.attr("d",pathData)
.attr("transform", function(d) {return "translate(" + projection([d.Longitude,d.Latitude]) + ")"+" scale"+transfomr;})
.attr("id",function(d){return d.Institution})
.attr("class","University star")
.attr("co","pink")

for(var i=0; i<selected.length ; i++){
  d3.select("circle[id='"+selected[i].Institution+"']").style("fill","red")
  d3.select("path[id='"+selected[i].Institution+"']").style("fill","red")

}



var color= d3.rollup(data, v =>{return v.length }, d => d.Country)

g.selectAll('.country')
.style("fill",function(d){
if(color.get(d.properties.name) == undefined) return "grey"; 
  return colores_range2(color.get(d.properties.name),0,50)
})


})


}



var allGroup2 = ["2016", "2018", "2019", "2020"].reverse()

// Initialize the button
var dropdownButton2 = d3.select("#selectmapyea")
  .append('select').attr("id","selectmapyea2").attr('class','justify-content-center form-select text-center')

// add the options to the button
dropdownButton2 // Add a button
  .selectAll('myOptions') 
   .data(allGroup2)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button

  dropdownButton2.on("change", function(d) {

    // recover the option that has been chosen
   var year =d3.select(this).property("value")
   updateLittleMap(year)
  })