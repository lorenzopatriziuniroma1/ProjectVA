//need thos variables in both graphs
// ArrOfMEANS = array with all the (time) means of scores in decreasing order
// d_means = dictionary with keys = name of university, value = mean
let ArrOfMEANS;let d_mean;
//colors of timeseries and Starplot in decreasing order using divergent palette - max 5 universities at once!

const colors = ["#f22105",
      "#ff7eac",
      "#ffdbff",
      "#aed1ff",
      "#00cceb"];


//calculate the mean per one university
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

//from value to key
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

//given a name, get the position in the ArrOfMEANS
function name_index(name){
  
  
  var val = d_mean[name];
 
  return ArrOfMEANS.indexOf(val);
}

function sort_name_by_med(names){
  var a =[];
  for(var i=0;i<ArrOfMEANS.length;i++){
    a.push(getKeyByValue(d_mean,ArrOfMEANS[i]));
  }
  console.log(a);
  return a;
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
    document.getElementById("show_data").remove();
    ArrOfMEANS=[]
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
    

    d_mean=mean_d(d,names);
    ArrOfMEANS.sort().reverse();
          
    d3.selectAll('#timeseries').remove(); 
    d3.selectAll('text #LegendLabel').remove(); 
    d3.selectAll('rect #LegendDot').remove(); 

var margin = {top: 50, right: 20, bottom: 60, left: 90},
    widthT = 600 - margin.left - margin.right,
    heightT = 500 - margin.top - margin.bottom;

    var svgT= d3.select("#data1")
    .append("svg")
    .attr("id","timeseries")
    .attr("width",800)
    .attr("height",500);
  
    var g = svgT.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var formatNumber = d3.format(".1f");

var x = d3.scaleTime()
    .domain([new Date(2015, 10, 1), new Date(2020, 1, 1)])
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

  
  let u=d[names[n]];
  let xCoords=[new Date(2015, 12, 1), new Date(2018, 1, 1),new Date(2019, 1, 1),new Date(2020, 1, 1)];
  let yCoords=[];
  let dataDone =[];
  for(let l =0;l<4;l++){
    dataDone.push( { date:xCoords[l],rating:parseFloat(u.split("/")[l])});
    yCoords.push(parseFloat(u.split("/")[l]));
    
  }
  
 
  console.log(position_wrt_selected)
  var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rating); })
  console.log(dataDone);

  let Index=3;

  svgT.append("path").attr("transform", "translate(" + margin.left + "," + margin.top + ")").datum(dataDone).attr("fill", "none")
  .attr("stroke", colors[position_wrt_selected])
  .attr("stroke-width", 5).attr("class","line").attr("d",line);

  svgT.append("g").selectAll("circle").data(yCoords).enter()
    .append("circle").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id",""+names[n])
	.attr("cx",function(d,i){
        var p;
        console.log(i)
        p=xCoords[i]
        
        return x(p);
        })
	.attr("cy",function(d,i){
        var p = yCoords[i];
        
        return y(p);
    })
    
	.attr("r","5")
	.attr("fill","black")	
  .on("mouseover",function(d,i){
    var na=d3.select(this).attr("id")
    d3.select(this).attr("fill", colors[name_index(na)])
    .attr("r", ""+5 * 2)
  if (d3.select(this).attr("cx")==x(new Date(2015, 12, 1))){
    Index=0;
    
  }
  else if(d3.select(this).attr("cx")==x(new Date(2018, 1, 1))){
    Index=1;
  }
  else if (d3.select(this).attr("cx")==x(new Date(2019, 1, 1))){
    Index=2
  }
  else if (d3.select(this).attr("cx")==x(new Date(2020, 1, 1))){
    Index=3
  }
  
  svgT.append("text").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id","over").attr("x",function(d){return x(xCoords[Index])+10}).attr("y",function(d){return y(i)+20})
   
 .text(function(d) {
   return i.toFixed(2)+"";  // Value of the text
 });
  }
  )
  .on("mouseout",function(d,i){
    
    d3.select(this).attr("fill", "black")
    .attr("r", ""+5 );
    svgT.select("#over").remove()
  })

  
}

    var arr_sorted=[];
    arr_sorted=sort_name_by_med(names);

    var size = 20
svgT.selectAll("mydots")
  .data(arr_sorted)
  .enter()
  .append("rect")
  .attr("class","LegendDot")
    .attr("x", 100)
    .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size).attr("transform", "translate(" + (widthT +20)+ "," + -10 + ")")
    .attr("height", size)
    .style("fill", function(d){ return colors[name_index(d)]})

// Add one dot in the legend for each name.
svgT.selectAll("mylabels")
  .data(arr_sorted)
  .enter()
  .append("text").attr("class","LegendLabel")
    .attr("x", 100 + size*1.2).attr("transform", "translate(" + (widthT+20) + "," + -10 + ")")
    .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return colors[name_index(d)]})
    .text(function(d){ return d +" ("+d_mean[d].toFixed(2)+")"})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

  svgT.append("text")
    .attr("class", "x label")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("text-anchor", "center")
    .attr("x", widthT/2)
    .attr("y", heightT +50)
    .text("Years");
    svgT.append("text")
    .attr("transform", "translate(" + margin.left + "," + 1 + ")")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("x", 30)
    .text("Rating");

/*
#
#
#
- - - - - - - - - - -  -  - - - - - - - - - STAR PLOT - - - - -  - - - - - - - - - - - - - - - - - -
#
#
#
*/
function angleToCoordinate(angle, value){
  let x = Math.cos(angle) * radialScale(value);
  let y = Math.sin(angle) * radialScale(value);
  return {"x": 300 + x, "y": 300 - y};
}

d3.select("#starplot").remove();

var svgS= d3.select("#data1")
.append("svg")
.attr("id","starplot")
.attr("width",800)
.attr("height",600);
var d_2016,d_2018,d_2019,d_2020;
//prepare data
var arr_of_stats =[]; //Academic scorer score,Employer score,Faculty Student score,CitationsPerFaculty score,InternationalFaculty score,InternationalStudent score,Overall Score 
for(let j=0;j<4;j++){  // years loop
  switch(j){
    case 0:
      d_2016={}
      break;
    case 1:
      d_2018={}
      break;
    case 2:
      d_2019={}
      break;
    case 3:
      d_2020={}
      break;
    default:
      break;
  }
  for(let i=0;i<dat[j].length;i++){  // single year loop
    
    for(let k=0;k<names.length;k++){  //list of names loop
      arr_of_stats=[];
      if(dat[j][i].Institution.toUpperCase()===names[k].toUpperCase()){
        arr_of_stats.push(dat[j][i]["Academic score"]);
        arr_of_stats.push(dat[j][i]["Employer score"]);
        arr_of_stats.push(dat[j][i]["Faculty Student score"]);
        arr_of_stats.push(dat[j][i]["CitationsPerFaculty score"]);
        arr_of_stats.push(dat[j][i]["InternationalFaculty score"]);
        arr_of_stats.push(dat[j][i]["InternationalStudent score"]);

        
         isNaN(dat[j][i]["Overall Score "])==true?arr_of_stats.push(dat[j][i]["Overall Score"]):arr_of_stats.push(dat[j][i]["Overall Score "]); // little bug with blank space in csv
         switch(j){
          case 0:
            d_2016[names[k].toUpperCase()]=arr_of_stats;
            break;
          case 1:
            d_2018[names[k].toUpperCase()]=arr_of_stats;
            break;
          case 2:
            d_2019[names[k].toUpperCase()]=arr_of_stats;
            break;
          case 3:
            d_2020[names[k].toUpperCase()]=arr_of_stats;
            break;
          default:
            break;
        }
      }
      
    }
  }
}




svgS.append("text")
  .attr("x", 275) 
  .attr("y", 0)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .text("Star Graph");
let features = ["Academic score","Employer score","Faculty Student score","CitationsPerFaculty score","InternationalFaculty score","InternationalStudent score","Overall Score"];

let radialScale = d3.scaleLinear()
    .domain([0,100])
    .range([0,250]);
let ticks = [20,40,60,80,100];

ticks.forEach(t =>
  svgS.append("circle").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("cx", 300)
  .attr("cy", 300)
  .attr("fill", "none")
  .attr("stroke", "gray")
  .attr("r", radialScale(t))
);
ticks.forEach(t =>
  svgS.append("text").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("x", 305)
  .attr("y", 300 - radialScale(t))
  .text(t.toString())
);

for (var i = 0; i < features.length-1; i++) {
  let ft_name = features[i];
  let angle = (Math.PI / 2) + (2 * Math.PI * i / (features.length-1));
  console.log(angle);
  let line_coordinate = angleToCoordinate(angle, 100);
  let label_coordinate = angleToCoordinate(angle, 107);

  //draw axis line
  svgS.append("line").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("x1", 300)
  .attr("y1", 300)
  .attr("x2", line_coordinate.x)
  .attr("y2", line_coordinate.y)
  .attr("stroke","black");

  //draw axis label
  
  if(  i<4){
    label_coordinate.x-=50
    if(i==2){
      label_coordinate.x-=50
    }

  }
  
  svgS.append("text").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("x", label_coordinate.x) 
  .attr("y", label_coordinate.y)
  .text(ft_name);
}


let selected_year_data=d_2020;

function updateStar(){
  svgS.selectAll("path.graphInStar").remove();
  svgS.selectAll("circle.circleInStar").remove();
  //default = show 2020
 

function getPathCoordinates(data_point){
  let coordinates = [];
  for (var i = 0; i < features.length-1; i++){
     
      let angle = (Math.PI / 2) + (2 * Math.PI * i / (features.length-1));
      coordinates.push(angleToCoordinate(angle, selected_year_data[data_point][i]));
  }
  console.log(data_point,coordinates)
  return coordinates;
}




let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);


for (var i = 0; i < names.length; i ++){
  let dN =names[i];
  let color = colors[name_index(dN)];
  let coordinates = getPathCoordinates(dN);

  //draw the path element
  svgS.append("path").attr("class","graphInStar").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .datum(coordinates)
  .attr("d",line)
  .attr("stroke-width", 3).attr("pointer-events", "none")
  .attr("stroke", color)
  .attr("fill", color)
  .attr("stroke-opacity", 1)
  .attr("opacity", 0.5);

  
  let angleCircle ;
  let arr = [...features];
  let cx =[];
  let cy=[];
  arr.pop();
  
  svgS.append("g").selectAll("circle").data(arr).enter()
  
  .append("circle").attr("class","circleInStar")
.attr("cx",function(d,i){
      var p;

      angleCircle =(Math.PI / 2) + (2 * Math.PI * i / (arr.length));
      p=selected_year_data[dN][i]
     
      cx.push((angleToCoordinate(angleCircle,p)).x);
      return cx[i];
      })
.attr("cy",function(d,i){
      var p;
      
      angleCircle =(Math.PI / 2) + (2 * Math.PI * i / (arr.length));
      p=selected_year_data[dN][i]
      cy.push((angleToCoordinate(angleCircle,p)).y)
  
      
      return cy[i];
  })
  
.attr("r","5").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
.attr("fill","black")
.on("mouseover",function(d,i){
  
    d3.select(this).attr("fill", color)
    .attr("r", ""+5 * 2)
  var index=arr.indexOf(i);


  
svgS.append("rect").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id","overSR").attr("x", cx[index]-25) 
.attr("y", cy[index]-20)
.attr("width", 25)
.attr("height", 12)
.attr("fill","white")



svgS.append("text").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id","overS").attr("x", cx[index]-25) 
.attr("y", cy[index]-10)
 
.text(function(d) {
 return selected_year_data[dN][index]+"";  // Value of the text
})
})


.on("mouseout",function(d,i){
  
  d3.select(this).attr("fill", "black")
  .attr("r", ""+5 );
  svgS.select("#overS").remove()
  svgS.select("#overSR").remove()
})






}
}




/*
#
#
SELECT YEAR BUTTON FOR STARPLOT
*/
var allGroup = ["2016", "2018", "2019", "2020"].reverse()

// Initialize the button
var dropdownButton = d3.select("#data1")
  .append('select').attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// add the options to the button
dropdownButton // Add a button
  .selectAll('myOptions') 
 	.data(allGroup)
  .enter()
	.append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button





// When the button is changed, run the updateChart function
dropdownButton.on("change", function(d) {

    // recover the option that has been chosen
   switch(d3.select(this).property("value")){
      case "2016":
        selected_year_data=d_2016;
       break;
      case "2018":
        selected_year_data=d_2018;
        break; 
      case "2019":
        selected_year_data=d_2019;
       break;
      case "2020":
        selected_year_data=d_2020;
       break;
      default:
         break;
   }

    // run the updateChart function with this selected option
    updateStar()
  })

  updateStar()
  
}
