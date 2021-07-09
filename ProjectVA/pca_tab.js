function colores_range(n,start,end) {
  var colores_g = palette_sequential_map
  var step=(end-start)/3;
  var i=0;
  if(n<start+step){i=0}
  if(start+step<=n && n<start+2*step){i=1}
  if(start+2*step<=n){i=2}
  return sequential_color_divergent_from_blue[i];
}


var myColorCircle = d3.scaleLinear().domain([1,10])
  .range(sequential_color_divergent_from_blue)


function handleMouseOn(d,i){
  div.transition()		
  .duration(200)		
  .style("opacity", .9);		
div	.html(i.Institution + "<br/> Rank =" +i["CurrentRank"])	
  .style("left", (d.pageX) + "px")		
  .style("top", (d.pageY - 28) + "px");

  var c=d3.select(this)
  c.attr("old",c.style("stroke")).style("stroke", "red").style("stroke-width","4.5px")
  c.moveToFront();
}
function handleMouseOut2(d,i){
  div.transition()		
  .duration(200)		
  .style("opacity", 0);		

  var c=d3.select(this)
  c.style("stroke", c.attr("old")).style("stroke-width","1px")
}

var pca_selected=[];
var dimensions;
var bru;
//set the dimensions and margins of the graph
var margin = {top: 10, right: 0, bottom: 120, left: 60},
    width2 =container_width*0.4,
    height2 = container_heigth *0.35 ;

// append the svg object to the body of the page
var svg = d3.select("#pca_scatter")
  .append("svg")
    .attr("width",  width2 + margin.left + margin.right )
    .attr("height", height2 + margin.top + margin.bottom )
  .append("g")
    .attr("transform",
          "translate(" + 30 + "," + margin.top + ")");
  var svg2 = d3.select("#pca_scatter")
          .append("svg")
            .attr("width", width2*1.27 + margin.left + margin.right)
            .attr("height", height2*1.2 + margin.top + margin.bottom+25)
          .append("g")
            .attr("transform",
                  "translate(" + 0+ "," + margin.top + ")");
        
//Read the data

d3.csv("ProjectVA/pca_csv/pca_year_v2_2020.csv").then( 
function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([-4, 7])
    .range([ 0, width2 ]);
  svg.append("g")
    .attr("transform", "translate(0," + height2*1.2 + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-3, 5])
    .range([ height2*1.2, 0]);
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
      .style("opacity", 0.9);
      
      svg.selectAll("circle").transition().duration(5000).attr("r",2);

      bru=d3.brush()                 // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [width2, height2*1.3] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on(" brush end", updateChart)
       // Each time the brush selection changes, trigger the 'updateChart' function
    
  // Add brushing
  svg
    .call(bru )


    svg
  // Function that is triggered when brushing is performed
  var start = new Date().getTime();

  function updateChart(event) {

    var end = new Date().getTime();
    if(end-start < 150 && event.type=="brush") return;
    start=new Date().getTime();
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

    if (pca_selected.length==0){
      svg2.selectAll(".myPath").on("mouseover",handleMouseOn).transition().duration(2000).style("opacity", 0.5).style("stroke",function(d){return  colores_range(d.OverallScore,0,100) });
      svg_map_pca.selectAll("circle").attr("r",5).transition().duration(2000).style("opacity", 1).style("stroke", "none")
    }else{
      // svg2.selectAll(".myPath").transition().duration(2000).style("opacity", 0.05).style("stroke", "#69b3a2")
   svg_map_pca.selectAll("circle").transition().duration(2000).style("opacity",0.5).style("stroke", "none")
      

   svg2.selectAll(".myPath").on("mouseover",(d,n)=>{return })
  .transition().duration(2000)
     .style("opacity", 0)

      svg2.selectAll(".myPath")
       .filter( function(d) {
        return pca_selected.some(function(el) { 
           return el.Institution.replace(/[^a-zA-Z]/g, "") == d.Institution.replace(/[^a-zA-Z]/g, "") })})
           .on("mouseover",handleMouseOn)
      .transition().duration(2000)
         .style("opacity", 1)
         .style("stroke", 
          function(d){
            if(color_multidim.get(d.Country) == undefined) return palette_sequential_map[3]; 
                return  colores_range(d.OverallScore,0,100) 
              }
          )
          .style("stroke-width","1.5px")
         ;
    
          svg_map_pca
          .selectAll("circle")
          .filter(function(d){
            return pca_selected.some(function(el) { 
              return el.Institution== d.Institution})})
              .moveToFront()
              .transition()
              .duration(2000)
              .attr("r",9)
              .style("opacity", 1)
              .style("stroke","black");
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

  

// For each dimension, I build a linear scale. I store all in a y object
    var y2 = {}
    for (i in dimensions) {
      name_d = dimensions[i]
      y2[name_d] = d3.scaleLinear()
        .domain( d3.extent(data, function(d) { return +d[name_d]; }) )
        .range([height2*1.4, 0])
    }
  
    // Build the X scale -> it find the best position for each Y axis
    var x2 = d3.scalePoint()
      .range([0, width2*1.3])
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
 .attr("id", function(d) { return d.Institution ;})
 .attr("class","myPath")
 .attr("d",  path)
 .style("fill", "none")
 .style("stroke", function (d) { return colores_range(d.OverallScore,0,100) })
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
    .attr("transform","translate(0,"+(height2*1.40+15)+") rotate(-20)")
      .style("text-anchor", "end")
      .text(function(d) { return d; })
      .style("font-size", "13px")
      .style("fill", "black");
})




var years = ["2020", "2019", "2018","2016"];

var select = d3.select('#pca_year')
  .append('select')
  	.attr('class','justify-content-center form-select text-center')
    .attr('id',"pca_select")
    .on('change',onchange);

var options = select
    .selectAll('option')
      .data(years).enter()
      .append('option')
      .attr("class"," text-center")
          .text(function (d) { return d; });

function onchange() {
    selectValue = d3.select('#pca_select').property('value')
    // Add X axis
    var x = d3.scaleLinear()
    .domain([-4, 7])
    .range([ 0, width2 ]);
  
  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-3, 5])
    .range([ height2*1.3, 0]);
   pca_selected=[];

    d3.csv("ProjectVA/pca_csv/pca_year_v2_"+selectValue+".csv").then (function(data) {

      myColorCircle = d3.scaleLinear().domain([0,d3.max(data, function(d) { return d.OverallScore; })-20])
      .range(sequential_color_divergent_from_blue)
    
      var circles=svg.selectAll("circle").data(data)
      circles.exit().remove()
      circles.enter().append("circle")


      circles.transition().duration(2000) 
      .attr("cx", function (d) { return x(d.pca_1); } )
      .attr("cy", function (d) { return y(d.pca_2); } )

      .style("fill", function (d) { return colores_range(d.OverallScore,0,100) } )
      .style("opacity", 0.5);






    // For each dimension, I build a linear scale. I store all in a y object
    var y2 = {}
    for (i in dimensions) {
      name_d = dimensions[i]
      y2[name_d] = d3.scaleLinear()
        .domain( d3.extent(data, function(d) { return +d[name_d]; }) )
        .range([height2*1.4, 0])
    }
  
    // Build the X scale -> it find the best position for each Y axis
    var x2 = d3.scalePoint()
      .range([0, width2*1.3])
      .padding(1)
      .domain(dimensions);
      // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
    return d3.line()(dimensions.map(function(p) { return [x2(p), y2[p](d[p])]; }));
};

 // bind data
 var appending = svg2.selectAll('.myPath').data(data)

         // remove old elements
         appending.exit().remove();
         appending.enter().append("path")

     // add new elements
     appending
     .transition()
     .duration(5000)
     .attr("id", function(d) { return d.Institution ;})
     .attr("class","myPath")
     .attr("d",  path)
     .style("fill", "none")
     .style("stroke",function (d) { return colores_range(d.OverallScore,0,100) })
     .style("opacity", 0.5)
     
     appending
     .on("mouseover", handleMouseOn)
    .on("mouseout", handleMouseOut2);








        var color= d3.rollup(data, v =>{return v.length }, d => d.Country)

        g_map_pca.selectAll('path')
        .style("fill",function(d){
        if(color.get(d.properties.name) == undefined) return palette_sequential_map[3]; 
          return colores_range2(color.get(d.properties.name),0,50)
        })


        var circle = g_map_pca.selectAll("circle").data(data)


        circle.exit().remove()
          
        circle.enter().append("circle")
        .attr("r",5) 
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .style("fill",function(d){return myColorCircle(d.OverallScore) })
        .attr("transform", function(d) {return "translate(" + projection_map_pca([d.Longitude,d.Latitude]) + ")"+" scale(1.0)";})
        .attr("id",function(d){return d.Institution})
        .attr("co",function(d){return myColorCircle(d.OverallScore)} );
        

     
      })


      div.transition()		
      .duration(200)		
      .style("opacity", .9);		
      div.transition()		
      .duration(200)		
      .style("opacity", 0);		
};







//----------------------------------------------------------------mapppppaaaaaa----------------------------------------------------


var width2_map=container_width;
var svg_map_pca = d3.select("#map3")
  .append("svg")
    .attr("width", width2_map)
    .attr("height", container_heigth*0.4)
    .style("background",background)

    var g_map_pca = svg_map_pca.append("g");


    const projection_map_pca = d3.geoMercator()
    .translate([width2_map / 2, container_heigth*0.4 / 2+50]) // translate to center of screen
    .scale([200]); // scale things down so see entire US
 

    var tooltip3 = d3.select("#map3")
    .append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0)
    .attr("margin",margin);





    const path_map_pca = d3.geoPath().projection(projection_map_pca);


 var stats;
 var color_multidim;
d3.json("https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json").then(function(uState) {


  d3.csv("ProjectVA/pca_csv/pca_year_v2_2020.csv").then(function(csv) {
 var data=csv

  myColorCircle = d3.scaleLinear().domain([0,d3.max(csv, function(d) { return d.OverallScore; })])
  .range(sequential_color_divergent_from_blue)

    var color= d3.rollup(data, v =>{return v.length }, d => d.Country)
    color_multidim=color
    g_map_pca.selectAll('path')
    .data(uState.features)
    .enter()
    .append('path')
    .attr("d", path_map_pca)
    .style("fill",function(d){
  if(color.get(d.properties.name) == undefined) return palette_sequential_map[3]; 
      return colores_range2(color.get(d.properties.name),0,50)
    })
    .style("stroke",stroke_color)
    .style("stroke-width",".3px")


  g_map_pca.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut)
  .attr("r",5)
  .style("fill", function(d){return myColorCircle(d.OverallScore) })
  .attr("transform", function(d) {return "translate(" + projection_map_pca([d.Longitude,d.Latitude]) + ")"+" scale(1.0)";})
  .attr("id",function(d){return d.Institution})
  .attr("id", function(d) { return d.Institution ;})
  .attr("co",function(d){return myColorCircle(d.OverallScore) });

  });




  var old;
var zoom = d3.zoom()
.scaleExtent([1, 85])
.on('zoom', function(event) {
  if(event.transform.x*event.transform.k>(width2*2+width2*0.2)*0.8){
    event.transform.x=old.x;
  }
  if(event.transform.x/event.transform.k<-(width2*2+width2*0.2)*0.8){
    event.transform.x=old.x;
  }
  if(event.transform.y*event.transform.k>(height2*2+height2*0.2)*0.8){
    event.transform.y=old.y;
  }
  if(event.transform.y/event.transform.k<-(height2*2+height2*0.2)*0.8){
    event.transform.y=old.y;
  }
    old=event.transform
   g_map_pca.attr("transform",event.transform);

   g_map_pca.selectAll("circle")
   //.attr("d", path.projection(projection))
   .attr("transform", function(d) {
    return "translate(" + projection_map_pca([parseFloat(d["Longitude"]),parseFloat(d["Latitude"])]) + ")"+" scale("+1/event.transform.k+")";
   });

//g.selectAll("path")  
  // .attr("d", path.projection(projection)); 
  div.transition()		
  .duration(500)		
  .style("opacity", 10);
  div.transition()		
  .duration(500)		
  .style("opacity", 0);
  
});

svg_map_pca.call(zoom);



})



create_legend(svg_map_pca)
