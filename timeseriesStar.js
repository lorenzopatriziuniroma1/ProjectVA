//need thos variables in both graphs
// ArrOfMEANS = array with all the (time) means of scores in decreasing order
// d_means = dictionary with keys = name of university, value = mean
let ArrOfMEANS;let d_mean;  var arr_sorted=[];
var d_2016,d_2018,d_2019,d_2020;
var what_miss={};

//colors of timeseries and Starplot in decreasing order using divergent palette - max 5 universities at once!

const colors = ["#f22105",
      "#ff7eac",
      "#ffdbff",
      "#aed1ff",
      "#00cceb"];
const supplement_colors=[
        "#609732",
         "#BAE397",
         "#8ABD5F",
         "#3E7213",
         "#224C00" 
      ].reverse();

//calculate the mean per one university
function format_info(s){
  console.log(s);
  var ris="";
  function map_j_to_year(j){
    switch(j){
      case "0":
        return "2016";
      case "1":
        return "2018";
      case "2":
        return "2019";
      case "3":
          return "2020";
      default: 
         return "N/A"

    }
  }
  var a=s.split("/");
  for(var i=0;i<a.length;i++){
    if(a[i].includes("Overall")){
      ris+="Overall "
      ris+=map_j_to_year(a[i].split(" ")[1]);
      

    }
    else if(a[i].includes("NotPresent")){
      ris+="Not in Ranking ";
      ris+=map_j_to_year(a[i].split(" ")[1]);

    }
    else{

    }

    if(i<a.length-1){
      ris+=",";
    }
  }
  return ris;

}
function sortArrOfMeans(){
  var tmp=[];var k=0
  var maxX=-1;
  while(ArrOfMEANS.length>0){
    for(var i=0;i<ArrOfMEANS.length;i++){
      if(ArrOfMEANS[i]>maxX){
        maxX=ArrOfMEANS[i];
        k=i;
      }
    }
    tmp.push(maxX);
    maxX=-1;
    ArrOfMEANS.splice(k, 1)
  }
  ArrOfMEANS=tmp;
}

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

function preProcess(mat){
  let features = ["Academicscorerscore","Employerscore","FacultyStudentscore","CitationsPerFacultyscore","InternationalFacultyscore","InternationalStudentscore","OverallScore"];
  for(var i=0;i<mat.length;i++){
    for(var j=0;j<mat[i].length;j++){
      mat[i][j].Institution=mat[i][j].Institution.trim();
     features.forEach(f=>{
       if(mat[i][j][f]==="0"||mat[i][j][f]==="0.0"){
         mat[i][j][f]="-";
       }
     })
    }
  }
  return mat;
}


function format_number(s){
  console.log(s);
  if(s.includes("5.5")){
    return "N/A"
  }
  return parseFloat(s).toFixed(2).toString();

}

function format_etichetta(s){
  var r=s.toUpperCase().split(" ");

  var x="";
  for(var i=0;i<r.length;i++){
    if(r[i].includes("UNIVERS")){
      x+="UNI."
    }
    else if(r[i].includes("INSTITUTE")){
      x+="INST."
    }
    else if(r[i].includes("COLLEGE")){
      x+="COLL."
    }
    else{
      x+=r[i];
    }
    x+=" "
    if(i>3)break;
  }
  
  
  return x;
}

//from value to key
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}



//given a name, get the position in the ArrOfMEANS
function name_index(name){
  
  
  var val = d_mean[name];
 
  return (val===undefined||isNaN(val))?-1:ArrOfMEANS.indexOf(val);
}

function sort_name_by_med(names){
  var a =[];
  for(var i=0;i<ArrOfMEANS.length;i++){
    a.push(getKeyByValue(d_mean,ArrOfMEANS[i]));
  }

  return a;
}


async function load_data(){
         
    let dat1 = await d3.csv("ProjectVA/pca_csv/pca_year_v2_2016.csv").then(function(rows){
            
                return rows
            }
       );
    let dat2 = await d3.csv("ProjectVA/pca_csv/pca_year_v2_2018.csv").then(function(rows){
            
        return rows
    }
    
);
let dat3 = await d3.csv("ProjectVA/pca_csv/pca_year_v2_2019.csv").then(function(rows){
            
    return rows
}
);
let dat4 = await d3.csv("ProjectVA/pca_csv/pca_year_v2_2020.csv").then(function(rows){
            
    return rows
}
);
    return [dat1,dat2,dat3,dat4]
}

function checkValidity(s){
  return s==="-"?false:true;
}


function checkCompleteness(row){
  //console.log("AAAA ",row)
  function checkPresence(row){
    
 
    //console.log(row["anno"])
    if(row["OverallScore"]!=="-"&& row["OverallScore"]!==""){
     
      return true;
      
    }

  
  return false;
  }
  

  return checkPresence(row);
}

function checkCompletenessOverall(data,names){
  var ris=[];
  var skipped=true;
  for(var j=0;j<4;j++){
    for(var n=0;n<names.length;n++){
      for(var i=0;i<data[j].length;i++){
        if(j==1 &&i===601){
          
        }
        if(names[n].toUpperCase()===data[j][i].Institution.toUpperCase()){
          skipped=false;
          if(checkCompleteness(data[j][i])===false ){
            
            if (!ris.includes(names[n].toUpperCase())){
              
              ris.push(names[n].toUpperCase());
            }
            if(what_miss[names[n]]!==undefined) what_miss[names[n]]+="Overall "+j+"/";
            else what_miss[names[n]]="Overall "+j+"/";
          
          }
          
        }
      }
      if(skipped){
        if(!ris.includes(names[n].toUpperCase())){
        ris.push(names[n].toUpperCase());
      }
      if(what_miss[names[n]]!==undefined&&!what_miss[names[n]].includes("Overall")&&!what_miss[names[n]].includes("NotPresent")){
        console.log(what_miss);
        what_miss[names[n]]="NotPresent "+j+"/";
      }else{
        what_miss[names[n]]+="NotPresent "+j+"/";
      }
          
      }
      skipped=true;
    }
    
  }
  console.log(what_miss)
  return ris;
  
}

function removeArr(r,n){
  var risultato=[];
  var c=true;
  for(var i=0;i<n.length;i++){
    for(var j=0;j<r.length;j++){
      if(r[j]===n[i]){
        c=false;
      }
    }
    if(c){
      risultato.push(n[i]);
      
    }
    c=true;
  }
  return risultato;
}

function format_Overall(stringScore){
  
  if(stringScore==='-'){
    return '-';
  }
  let r="1.0"
  if(stringScore.split("-").length==2){
    let f=parseFloat(stringScore.split("-")[0])
    f+=parseFloat(stringScore.split("-")[1])
    f=f/2
    r=""+f
  }
  else{
    r=stringScore;
  }
  return r+="/"
}

async function display_data(selected_on_map){
    
    //document.getElementById("show_data").remove();
    what_miss={};
    if(selected_on_map.length===0){
      document.getElementById("data1").innerHTML="";
    return;
    }
    var names = [];var original_selection_names=[];
    for(var t=0;t<selected_on_map.length;t++){
        names.push(selected_on_map[t]['Institution'].toUpperCase().trim());
        original_selection_names.push(selected_on_map[t]['Institution'].toUpperCase().trim());
    }

    ArrOfMEANS=[]
    let dat = await load_data();
    dat=preProcess(dat);
    let remove=[] 

    //no data --> remove from names
    remove=checkCompletenessOverall(dat,names);
    
    names=removeArr(remove,names);
 
    
    for(let k=0;k<names.length;k++){
      ArrOfMEANS.push(0.);
    }
    var d={};
    names.forEach((e)=>{
      d[e]="";
    })
    
    
   

    for(let j=0;j<4;j++){
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
      for(let i=0;i<dat[j].length;i++){
        for(let k=0;k<names.length;k++){
          if(dat[j][i].Institution.toUpperCase()===names[k].toUpperCase()){
            
              
              (dat[j][i]["OverallScore"]===undefined)===true?d[names[k]]+=format_Overall(dat[j][i]["OverallScore"]):d[names[k]]+=format_Overall(dat[j][i]["OverallScore"]); // little bug with blank space in csv
            
            
          }
        }
      }
    }
    d3.select("#missingData").remove()
    d3.select("#errorData").remove()
    d3.selectAll('#timeseries').remove(); 
    
    d3.selectAll('text #LegendLabel').remove(); 
    d3.selectAll('rect #LegendDot').remove(); 
    
    if(names.length===0 && remove.length!==original_selection_names.length){
      var missing_info=format_info(what_miss[remove[0]]);
      d3.select("#data1").append("div").attr("id","errorData");
      document.getElementById("errorData").innerHTML="<h3 style='color:blue'> Missing info for timeseries! "+remove[0]+ 
      " "+missing_info+"</h3>";
      
     
    }
    else if(names.length<original_selection_names.length||remove.length===original_selection_names.length){
      
      
      var stamp="";
      remove.forEach(r=>{
        stamp+=r+" "+ format_info(what_miss[r])
      
      })
  
      d3.select("#data1").append("div").attr("id","missingData");
      document.getElementById("missingData").innerHTML="<h4 style='color:blue'> Some info missing : "+stamp+"</h4>";
      }
    
    d_mean=mean_d(d,names);
    sortArrOfMeans();
          
    

var margin = {top: 50, right: 20, bottom: 60, left: 90},
    widthT = 600 - margin.left - margin.right,
    heightT = 500 - margin.top - margin.bottom;

if(names.length===0){starPlot(); return;}

    var svgT= d3.select("#data1")
    .append("svg")
    .attr("id","timeseries")
    .attr("width",1000)
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
  
 
  
  var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rating); })
  

  let Index=3;

  svgT.append("path").attr("transform", "translate(" + margin.left + "," + margin.top + ")").datum(dataDone).attr("fill", "none")
  .attr("stroke", colors[position_wrt_selected])
  .attr("stroke-width", 5).attr("class","line").attr("d",line);

  svgT.append("g").selectAll("circle").data(yCoords).enter()
    .append("circle").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id",""+names[n])
	.attr("cx",function(d,i){
        var p;
        
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

    arr_sorted=[];
    arr_sorted=sort_name_by_med(names);
    console.log("X ", ArrOfMEANS);

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
    .text(function(d){ return format_etichetta(d) +" ("+d_mean[d].toFixed(2)+")"})
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


  starPlot();
/*
#
#
#
- - - - - - - - - - -  -  - - - - - - - - - STAR PLOT - - - - -  - - - - - - - - - - - - - - - - - -
#
#
#
*/


//AGGIUSTARE ETICHETTA


function starPlot(){
function make_graph_possible(arr){
  for(var i=0;i<arr.length;i++){
    if(i<arr.length-1 && (arr[i]==="-"||arr[i]==="")){
      arr[i]="5.5" // not avaliable value
    }
    if(i===arr.length-1){
    
      if(arr[i]==="-"){
      arr[i]="N/A";
      }
      else{
        arr[i]=arr[i].replace("/","");
      }
    }
  }
}

function angleToCoordinate(angle, value){
  let x = Math.cos(angle) * radialScale(value);
  let y = Math.sin(angle) * radialScale(value);
  return {"x": 300 + x, "y": 300 - y};
}

d3.select("#starplot").remove();
d3.select("#yearSel").remove();

var svgS= d3.select("#data1")
.append("svg")
.attr("id","starplot")
.attr("width",1000)
.attr("height",800);

//prepare data
var arr_of_stats =[]; //Academic scorer score,Employer score,Faculty Student score,CitationsPerFaculty score,InternationalFaculty score,InternationalStudent score,Overall Score 
for(let j=0;j<4;j++){  // years loop
  
  for(let i=0;i<dat[j].length;i++){  // single year loop
    
    for(let k=0;k<original_selection_names.length;k++){  //list of names loop
      arr_of_stats=[];
      if(dat[j][i].Institution.toUpperCase()===original_selection_names[k].toUpperCase()){
        arr_of_stats.push(dat[j][i]["Academicscorerscore"])
        arr_of_stats.push(dat[j][i]["Employerscore"]);
        arr_of_stats.push(dat[j][i]["FacultyStudentscore"]);
        arr_of_stats.push(dat[j][i]["CitationsPerFacultyscore"]);
        arr_of_stats.push(dat[j][i]["InternationalFacultyscore"]);
        arr_of_stats.push(dat[j][i]["InternationalStudentscore"]);

        
        (dat[j][i]["OverallScore"] ===undefined)===true?arr_of_stats.push(format_Overall(dat[j][i]["OverallScore"])):arr_of_stats.push(format_Overall(dat[j][i]["OverallScore"])); // little bug with blank space in csv
         
         make_graph_possible(arr_of_stats);
         switch(j){
          case 0:
            d_2016[original_selection_names[k].toUpperCase()]=arr_of_stats;
            break;
          case 1:
            d_2018[original_selection_names[k].toUpperCase()]=arr_of_stats;
            break;
          case 2:
            d_2019[original_selection_names[k].toUpperCase()]=arr_of_stats;
            break;
          case 3:
            d_2020[original_selection_names[k].toUpperCase()]=arr_of_stats;
            break;
          default:
            break;
        }
      }
      
    }
  }
}


console.log(d_2016,d_2018,d_2019,d_2020)

svgS.append("text")
  .attr("x", 275) 
  .attr("y", 0)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .text("Star Graph");
let features = ["Academicscorerscore","Employerscore","FacultyStudentscore","CitationsPerFacultyscore","InternationalFacultyscore","InternationalStudentscore","OverallScore"];

let radialScale = d3.scaleLinear()
    .domain([0,100])
    .range([0,250]);
let ticks = [5.5,20,40,60,80,100];

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
  .text(x=>{
    if(t.toString()==="5.5")return "N/A";
    else return t.toString();
  })
);




for (var i = 0; i < features.length-1; i++) {
  let ft_name = features[i];
  let angle = (Math.PI / 2) + (2 * Math.PI * i / (features.length-1));
 
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
let starting_Legend;
function updateStar(){
  arr_sorted=sort_name_by_med(names);
  d3.selectAll(".LegendDotS").remove();
d3.selectAll(".LegendLabelS").remove();
  d3.selectAll(".legendDotS").remove();
d3.selectAll(".legendLabelS").remove();
  svgS.selectAll("path.graphInStar").remove();
  svgS.selectAll("circle.circleInStar").remove();
  //default = show 2020
 

function getPathCoordinates(data_point){
  let coordinates = [];
  for (var i = 0; i < features.length-1; i++){
     
      let angle = (Math.PI / 2) + (2 * Math.PI * i / (features.length-1));
      coordinates.push(angleToCoordinate(angle, selected_year_data[data_point][i]));
  }

  return coordinates;
}




let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);
  let color; 

starting_Legend=-1;

for (var i = 0; i < names.length; i ++){
  let dN =names[i];
  
  name_index(dN)===-1?color="grey":color=colors[name_index(dN)];
  console.log(color)
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
  
    d3.select(this).attr("fill", colors[name_index(dN)])
    .attr("r", ""+5 * 2)
  var index=arr.indexOf(i);
  console.log(i)

  
svgS.append("rect").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id","overSR").attr("x", cx[index]-25) 
.attr("y", cy[index]-20)
.attr("width", format_etichetta(dN).length*7.5)
.attr("height", 12)
.attr("fill",colors[name_index(dN)])
.attr("opacity","0.5")



svgS.append("text").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id","overS").attr("x", cx[index]-25) 
.attr("y", cy[index]-10)
 
.text(function(d) {
 return format_etichetta(dN) +" - "+format_number(selected_year_data[dN][index])+"";  // Value of the text
})
})


.on("mouseout",function(d,i){
  
  d3.select(this).attr("fill", "black")
  .attr("r", ""+5 );
  svgS.select("#overS").remove()
  svgS.select("#overSR").remove()
})
console.log(arr_sorted);


      
  
  

}

svgS.selectAll("mydotsS")
  .data(arr_sorted)
  .enter()
  .append("rect")
  .attr("class","LegendDotS")
    .attr("x", 100)
    .attr("y", function(d,i){  return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size).attr("transform", "translate(" + (widthT+90) + "," + 0 + ")")
    .attr("height", size)
    .style("fill", function(d,i){ return colors[i]})

// Add one dot in the legend for each name.
svgS.selectAll("mylabelsS")
  .data(arr_sorted)
  .enter()
  .append("text").attr("class","LegendLabelS")
    .attr("x", 100 + size*1.2).attr("transform", "translate(" + (widthT+90) + "," + 0 + ")")
    .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d,i){ return colors[i]})
    .text(function(d,i){ return format_etichetta(arr_sorted[i])+" - ("+format_number(selected_year_data[arr_sorted[i]][6])+")"})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")



var newRemove=[];
for (var i = 0; i < remove.length; i ++){
  
  if(selected_year_data[remove[i]]===undefined)continue;
  newRemove.push(remove[i]);
}
for (var i = 0; i < newRemove.length; i ++){
  let dN =newRemove[i];
  
  name_index(dN)===-1?color=supplement_colors[i]:color=colors[name_index(dN)];
  let P=i;
 
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
  
     d3.select(this).attr("fill", supplement_colors[P]);
    
    d3.select(this).attr("r", ""+5 * 2)
  var index=arr.indexOf(i);


  
svgS.append("rect").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id","overSR").attr("x", cx[index]-50) 
.attr("y", cy[index]-60)
.attr("width", format_etichetta(dN).length*7.5)
.attr("height", 24)
.attr("fill","#BCE1DE")



svgS.append("text").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id","overS").attr("x", cx[index]-50) 
.attr("y", cy[index]-45)
 
.text(function(d) {
 return format_etichetta(dN)+" - "+format_number(selected_year_data[dN][index])+"";  // Value of the text
})
})


.on("mouseout",function(d,i){
  
  d3.select(this).attr("fill", "black")
  .attr("r", ""+5 );
  svgS.select("#overS").remove()
  svgS.select("#overSR").remove()
});

size=20;



    

}

starting_Legend=arr_sorted.length;
svgS.selectAll("mydotsS")
  .data(newRemove)
  .enter()
  .append("rect")
  .attr("class","legendDotS")
    .attr("x", 100)
    .attr("y", function(d,i){ if(starting_Legend>=0)return  100+i*(size+5)
                              else return 100+ i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size).attr("transform", "translate(" + (widthT+90) + "," + (++starting_Legend)*20 + ")")
    .style("fill", function(d,i){ return supplement_colors[i]})
    
// Add one dot in the legend for each name.

svgS.selectAll("mylabelsS")
  .data(newRemove)
  .enter()
  .append("text").attr("class","legendLabelS")
    .attr("x", 100 + size*1.2)
    .attr("y", function(d,i){if(starting_Legend>=0) return 100+(i)*(size+5) + (size/2)
                            else return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d,i){ return supplement_colors[i]})
    .text(function(d,i){ return format_etichetta(newRemove[i])+" ("+format_number(selected_year_data[newRemove[i]][6])+")"})
    .attr("text-anchor", "left").attr("transform", "translate(" + (widthT+90) + "," + (starting_Legend)*20+ ")")
    .style("alignment-baseline", "middle")


}





/*
#
#
SELECT YEAR BUTTON FOR STARPLOT
*/
var allGroup = ["2016", "2018", "2019", "2020"].reverse()

// Initialize the button
var dropdownButton = d3.select("#data1")
  .append('select').attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id","yearSel")

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
  
}
