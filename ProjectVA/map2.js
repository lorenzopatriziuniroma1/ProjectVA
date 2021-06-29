
var svg3 = d3.select(".row");
var width3 = svg3.node().getBoundingClientRect().width;
var height3 = svg3.node().getBoundingClientRect().height/2;
var country_selected=[];
var dimension
var margin = {top: 80, right: 30, bottom: 20, left: 60}

svg3 = d3.select("#map2")
  .append("svg")
    .attr("width", width3 + margin.left + margin.right)
    .attr("height", height3 + margin.top + margin.bottom)
    .style("background","#b3ccff")

  
    var tooltip2 = d3.select("#map2")
    .append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0)
    .attr("margin",margin);

var svg4 = d3.select("#map2").append("svg")
.attr("width", width3 + margin.left + margin.right)
.attr("height", height3 + margin.top + margin.bottom)
.attr("transform",
"translate(" + margin.left + "," + (margin.top) + ")");

var  projection2 = d3.geoMercator()
    .translate([width3/2 , height3/2 ]) // translate to center of screen
    .scale([200]); // scale things down so see entire US
    

var path2 = d3.geoPath().projection(projection2);

var g2 = svg3.append("g");

var selectPercentage=d3.select("div #selectpercentage")
.append('select')
.attr('class','select')
.attr('id',"map_percentage")
.on('change',updateChart2);

var percentage=[]
for(var i=0 ; i<10;i++ ){
  percentage.push(""+(100-10*(i)));
}


var options2 = selectPercentage
.selectAll('option')
  .data(percentage).enter()
  .append('option')
      .text(function (d) {return d; });

var selectedPercentage=100;

function compareUniversity(a,b){
  return a.OverallScore < b.OverallScore;
}



d3.json("https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json").then(function(uState) {

    d3.csv("ProjectVA/pca_csv/pca_year_group_2020.csv").then(function(csv) {
       // stats=csv;
      
      });

    d3.csv("ProjectVA/pca_csv/pca_year_v2_2020.csv").then(
      function(data){
        



        var color= d3.rollup(data, v =>{return v.length }, d => d.Country)

        g2.selectAll('path')
        .data(uState.features)
        .enter()
        .append('path')
        .attr("d", path2)
        .style("fill",function(d){
          if(color.get(d.properties.name) == undefined) return "grey"; 
          return colores_range2(color.get(d.properties.name),0,50)
        })
        .attr("name", function(d) {  return d.properties.name})
        .style("stroke","#b3ccff")
        .style("stroke-width",".1px")
        .on("mouseover", handleMouseOver3)
        .on("mouseout", handleMouseOut3)
        .on("mousemove",handleMouseMove)
        .on("click",handleMouseClick3)




        
              // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
 dimensions = Object.keys(data[0]).filter(function(d) { return ['CurrentRank', 'LastRank','Age','Academicscorerscore', 
 'Employerscore','FacultyStudentscore', 'CitationsPerFacultyscore', 'InternationalFacultyscore', 'InternationalStudentscore', 'OverallScore'].includes(d); })
 
 
 // For each dimension, I build a linear scale. I store all in a y object
     var y2 = {}
     for (i in dimensions) {
       name_d = dimensions[i]
       y2[name_d] = d3.scaleLinear()
         .domain( d3.extent(data, function(d) { return +d[name_d]; }) )
         .range([height3, 0])
     }
   
     // Build the X scale -> it find the best position for each Y axis
     var x2 = d3.scalePoint()
       .range([0, width3])
       .padding(1)
       .domain(dimensions);
       // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
   function path(d) {
     return d3.line()(dimensions.map(function(p) { return [x2(p), y2[p](d[p])]; }));
 };


 svg4.selectAll("myAxis")
 // For each dimension of the dataset I add a 'g' element:
 .data(dimensions).enter()
 .append("g")
 // I translate this element to its right position on the x axis
 .attr("transform", function(d) { return "translate(" + x2(d) + ",10)"; })
 // And I build the axis with the call function
 .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y2[d])); })
 // Add axis title
 .append("text")
 .attr("transform","translate(0,"+(height3+15)+") rotate(45)")
   .style("text-anchor", "start")
   .text(function(d) { return d; })
   
   .style("fill", "black");
      }
    )
});


var zoom = d3.zoom()
.scaleExtent([1, 85])
.on('zoom', function(event) {
  //console.log(d3.event.transform)
   if(event.transform.x*event.transform.k>width3*0.8){
      event.transform.x=old.x;
    }
    if(event.transform.x/event.transform.k<-width3*0.8){
      event.transform.x=old.x;
    }
    if(event.transform.y*event.transform.k>height3*0.8){
      event.transform.y=old.y;
    }
    if(event.transform.y/event.transform.k<-height3*0.8){
      event.transform.y=old.y;
    }
    old=event.transform
   g2.attr("transform",event.transform);

   div.transition()		
   .duration(500)		
   .style("opacity", 10);
   div.transition()		
   .duration(500)		
   .style("opacity", 0);
});


   svg3.call(zoom);

   function handleMouseOver3(d, i) {  // Add interactivity
   tooltip2.html( " Country ="+i.properties.name )	
   .style("left", (d.pageX) + "px")		
   .style("top", (d.pageY - 28) + "px")
   .transition()
   .duration(200)		
   .style("opacity", .9);
     }

function handleMouseOut3(d, i) {  // Add interactivity
    tooltip2
    .transition()
    .duration(200)		
    .style("opacity", 0)
       }

function handleMouseMove(d,i){
    tooltip2.html( " Country ="+i.properties.name )	
    .style("left", (d.pageX) + "px")		
    .style("top", (d.pageY - 50) + "px")
}

function handleMouseClick3(d,i){ 
  var t=d3.select(d.target)

  if(t.style("fill")=="red"){
    t
    .style("fill",t.attr("old"))
    .style("stroke","#b3ccff")
    .style("stroke-width",".1px")


    var index = country_selected.indexOf(i.properties.name);
    if (index > -1) {
      country_selected.splice(index, 1);
    }
    updateChart2();
    return;
  }
  t
  .attr("old",t.style("fill"))
  .style("fill","red")
  .style("stroke","black")
  .style("stroke-width",".3px")

  country_selected.push(i.properties.name);
  updateChart2();
}

function updateChart2(){
  d3.selectAll(".myPathCountry").remove();
  selectedPercentage = d3.select('#map_percentage').property('value')
  d3.csv("ProjectVA/pca_csv/pca_year_v2_2020.csv").then(function(data2) {

    var color= d3.rollup(data2, v =>{return v.length }, d => d.Country)

//    ['CurrentRank', 'LastRank','Age','Academicscorerscore',  'Employerscore','FacultyStudentscore', 'CitationsPerFacultyscore', 'InternationalFacultyscore', 'InternationalStudentscore', 'OverallScore']
   var c= d3.rollup(data2, v =>{ 
    var l=v.length;
    var p=parseInt(l*selectedPercentage/100);
    v.sort(compareUniversity)
    console.log(p)
    v= v.slice(0,p+1);
    console.log(v)
     return { "CurrentRank": d3.sum(v, d => d.CurrentRank)/v.length,
      'LastRank': d3.sum(v, d => d.LastRank)/v.length,
      'Age': d3.sum(v, d => d.Age)/v.length,
      'Academicscorerscore': d3.sum(v, d => d.Academicscorerscore)/v.length,  
      'Employerscore': d3.sum(v, d => d.Employerscore)/v.length,
      'FacultyStudentscore': d3.sum(v, d => d.FacultyStudentscore)/v.length, 
      'CitationsPerFacultyscore':  d3.sum(v, d => d.CitationsPerFacultyscore)/v.length, 
      'InternationalFacultyscore': d3.sum(v, d => d.InternationalFacultyscore)/v.length, 
      'InternationalStudentscore': d3.sum(v, d => d.InternationalStudentscore)/v.length, 
      'OverallScore': d3.sum(v, d => d.OverallScore)/v.length,
      'Country': v[0].Country
    };
    }, d => d.Country);



// For each dimension, I build a linear scale. I store all in a y object
var y2 = {}
for (i in dimensions) {
  name_d = dimensions[i]
  y2[name_d] = d3.scaleLinear()
    .domain( d3.extent(data, function(d) { return +d[name_d]; }) )
    .range([height3, 0])
}

function show(d, i){
  console.log(d);
  console.log(i);

  tooltip2.html( " Country ="+i.Country )	
  .style("left", (d.pageX) + "px")		
   .style("top", (d.pageY - 28) + "px")
   .transition()
   .duration(200)		
   .style("opacity", .9);
}

function unshow(d, i){

  tooltip2
   .transition()
   .duration(200)		
   .style("opacity", 0);
}
// Build the X scale -> it find the best position for each Y axis
var x2 = d3.scalePoint()
  .range([0, width3])
  .padding(1)
  .domain(dimensions);
  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
function path(d) {
return d3.line()(dimensions.map(function(p) { return [x2(p), y2[p](d[p])]; }));
} 
    svg4
 .selectAll("myPath")
 .data(c.values())
 .enter().append("path")
 .filter(function(d) {return  country_selected.indexOf(d.Country)>-1;})
 //.attr("id", function(d) { return d.Institution.replace(/[^a-zA-Z]/g, "") ;})
 .attr("class","myPathCountry")
 .attr("d",  path)
 .style("fill", "none")
 .style("stroke",function(d){
  if(color.get(d.Country) == undefined) return "grey"; 
  return colores_range2(color.get(d.Country),0,50)
})
 .style("stroke-width", "3")
 .style("opacity", 1)
 .on("mouseover",show)
 .on("mouseout",unshow)
  })
     
 };

 var legend = svg3.append('g')
 .attr("transform", "translate(" + (width3-width3*0.2)  + "," + (height3-height3*0.2 ) + ")")
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
 
 
 

 