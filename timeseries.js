let ArrOfMEANS=[];
function mean_d(d,names){
  mean={};

  for(let i=0;i<names.length;i++){
    let r = 0.0;
    let arr=d[names[i]].split("/");
    arr.pop()
    for(var j=0;j<4;j++){
      
      r+=parseFloat(arr[j]);
    }
    mean[names[i]]=r/4
    ArrOfMEANS[i]=r/4;  
    
  }

  return mean;
}




async function load_data(){
         
    let dat1 = await d3.csv("ProjectVA/Ranking-2016-Coords-clean.csv").then(function(rows){
            
                return rows
            }
       );
    let dat2 = await d3.csv("ProjectVA/Ranking-2018-Coords-clean.csv").then(function(rows){
            
        return rows
    }
    
);
let dat3 = await d3.csv("ProjectVA/Ranking-2019-Coords-clean.csv").then(function(rows){
            
    return rows
}
);
let dat4 = await d3.csv("ProjectVA/Ranking-2020-Coords-clean.csv").then(function(rows){
            
    return rows
}
);
    return [dat1,dat2,dat3,dat4]
}

async function display_data(){

    let dat = await load_data();
    
    // names will be replaced by an array that will contain all the selected university from the map (set names as parameter of display data function)
    var items =["DUKE UNIVERSITY","THE UNIVERSITY OF TOKYO","UNIVERSITY OF TORONTO","UNIVERSITY OF BRISTOL"]
    var name1 = items[Math.floor(Math.random()*items.length)];
    var name2 = items[Math.floor(Math.random()*items.length)];
    while(name1==name2){
      name2 = items[Math.floor(Math.random()*items.length)];
    }

    var names = [name1,name2];
    for(let k=0;k<names.length;k++){
      ArrOfMEANS.push(0.);
    }
    var d={};
    names.forEach((e)=>{
      d[e]="";
    })
    for(let j=0;j<4;j++){
      for(let i=0;i<dat[j].length;i++){
        for(let k=0;k<names.length;k++){
          if(dat[j][i].Institution.toUpperCase()===names[k].toUpperCase()){
             isNaN(dat[j][i]["Overall Score "])==true?d[names[k]]+=dat[j][i]["Overall Score"]+"/":d[names[k]]+=dat[j][i]["Overall Score "]+"/"; // little bug with blank space in csv
          
          }
        }
      }
    }
    

    var d_mean=mean_d(d,names);
    ArrOfMEANS.sort();
          
    d3.selectAll('#timeseries').remove(); 

var margin = {top: 50, right: 20, bottom: 60, left: 90},
    widthT = 600 - margin.left - margin.right,
    heightT = 400 - margin.top - margin.bottom;

    var svgT= d3.select("#data1")
    .append("svg")
    .attr("id","timeseries")
    .attr("width",600)
    .attr("height",400);
  
    var g = svgT.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var formatNumber = d3.format(".1f");

var x = d3.scaleTime()
    .domain([new Date(2015, 9, 1), new Date(2020, 1, 1)])
    .range([33, widthT]);

var y = d3.scaleLinear()
    .domain([0, 100.0])
    .range([heightT, 0]);

var xAxis = d3.axisBottom(x)
    .ticks(d3.timeYear).tickFormat(d3.timeFormat("%Y"));

var yAxis = d3.axisRight(y)
    .tickSize(widthT)
    .tickFormat(function(d) {
      var s = formatNumber(d);
      return s
          
    });

g.append("g")
    .attr("transform", "translate(0," + heightT + ")")
    .call(customXAxis);

g.append("g")
    .call(customYAxis);

function customXAxis(g) {
  g.call(xAxis);
  g.select(".domain").remove();
}

function customYAxis(g) {
  g.call(yAxis);
  g.select(".domain").remove();
  g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
  g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
}


for(let n=0;n< names.length;n++){
  //to be used for the color...
  var position_wrt_selected=ArrOfMEANS.indexOf(d_mean[names[n]]);
  console.log(position_wrt_selected);

  let u=d[names[n]];
  let xCoords=[new Date(2016, 1, 1), new Date(2018, 1, 1),new Date(2019, 1, 1),new Date(2020, 1, 1)];
  let dataDone =[];
  for(let l =0;l<4;l++){
    dataDone.push( { date:xCoords[l],rating:parseFloat(u.split("/")[l])});
  }
  
 
  //console.log(yCoords);
  var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rating); })
  console.log(dataDone);
  svgT.append("path").attr("transform", "translate(" + margin.left + "," + margin.top + ")").datum(dataDone).attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 5).attr("class","line").attr("d",line);
  
}

}


/*
//reading in CSV which contains data
d3.csv("roads_built.csv", function(error, data) {
  data.forEach(function(d) {
    //console.log(d.date_time)
    d.date = parseDate.parse(d.date_time);
	console.log(d.date);
    d.total_km = +d.total_km;
    console.log(d.total_km);
  });

  //using imported data to define extent of x and y domains
 

// Draw the y Grid lines
	svg.append("g")            
		.attr("class", "grid")
		.call(make_y_axis()
			.tickSize(-width, 0, 0)
			.tickFormat("")
		)
  
  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

//taken from http://bl.ocks.org/mbostock/3887118
//and http://www.d3noob.org/2013/01/change-line-chart-into-scatter-plot.html
//creating a group(g) and will append a circle and 2 lines inside each group
var g = svg.selectAll()
        .data(data).enter().append("g");

   //The markers on the line
	 g.append("circle")
         //circle radius is increased
        .attr("r", 4.5)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.total_km); });
   
   //The horizontal dashed line that appears when a circle marker is moused over
	 g.append("line")
        .attr("class", "x")
        .attr("id", "dashedLine")
        .style("stroke", "steelblue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0)
        .attr("x1", function(d) { return x(d.date); })
        .attr("y1", function(d) { return y(d.total_km); })
		    //d3.min gets the min date from the date x-axis scale
		    .attr("x2", function(d) { return x(d3.min(x)); })
        .attr("y2", function(d) { return y(d.total_km); });

  //The vertical dashed line that appears when a circle marker is moused over
	g.append("line")
        .attr("class", "y")
        .attr("id", "dashedLine")
        .style("stroke", "steelblue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0)
        .attr("x1", function(d) { return x(d.date); })
        .attr("y1", function(d) { return y(d.total_km); })
		    .attr("x2", function(d) { return x(d.date); })
        .attr("y2", height);
    
   //circles are selected again to add the mouseover functions
 	 g.selectAll("circle")
			.on("mouseover", function(d) {		
            div.transition()		
               .duration(200)		
               .style("opacity", .9);	
            div.html(formatCount(d.total_km) + " km" + "<br/>" + formatTime(d.date))	
               .style("left", (d3.event.pageX - 20) + "px")
      		     .style("top", (d3.event.pageY + 6) + "px");
	          //selects the horizontal dashed line in the group
			      d3.select(this.nextElementSibling).transition()		
                .duration(200)		
                .style("opacity", .9);
            //selects the vertical dashed line in the group
			      d3.select(this.nextElementSibling.nextElementSibling).transition()		
                .duration(200)		
                .style("opacity", .9);	
            })	
				
      .on("mouseout", function(d) {		
            div.transition()		
               .duration(500)		
               .style("opacity", 0);

			      d3.select(this.nextElementSibling).transition()		
                .duration(500)		
                .style("opacity", 0);

			      d3.select(this.nextElementSibling.nextElementSibling).transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
	    .selectAll(".tick text")
      .call(wrap, 35);

svg.append("g")
    .attr("class","xMinorAxis")
    .attr("transform", "translate(0," + height + ")")
    .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
    .call(xMinorAxis)
    .selectAll("text").remove();

//http://www.d3noob.org/2012/12/adding-axis-labels-to-d3js-graph.html
svg.append("text")      // text label for the x-axis
        .attr("x", width / 2 )
        .attr("y",  height + margin.bottom)
        .style("text-anchor", "middle")
        .text("Date");

svg.append("text")      // text label for the y-axis
        .attr("y",30 - margin.left)
        .attr("x",50 - (height / 2))
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .style("font-size", "16px")
        .text("road length (km)");

//http://www.d3noob.org/2013/01/adding-title-to-your-d3js-graph.html
svg.append("text")      // text label for chart Title
        .attr("x", width / 2 )
        .attr("y", 0 - (margin.top/2))
        .style("text-anchor", "middle")
		.style("font-size", "16px") 
        .style("text-decoration", "underline") 
        .text("Pandora Road Construction");


svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    //text label for the y-axis inside chart
    /*
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-size", "16px") 
      .style("background-color","red")
      .text("road length (km)");
  

//http://bl.ocks.org/mbostock/7555321
//This code wraps label text if it has too much text
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

});

*/

