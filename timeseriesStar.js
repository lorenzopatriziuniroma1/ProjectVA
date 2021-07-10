//need thos variables in both graphs
// ArrOfMEANS = array with all the (time) means of scores in decreasing order
// d_means = dictionary with keys = name of university, value = mean
let ArrOfMEANS;let d_mean;  var arr_sorted=[];
var d_2016,d_2018,d_2019,d_2020;
var what_miss={};let data_all_time;
let clicked_label=[], newRemove;
var sliders_val,sliders_list;let xCoords=[];
var c_initial;
const arr_scores=["Academic","Employer","FacultyStudent","CitationsPerFaculty","InternationalFaculty","InternationalStudent"]
const initial_per =[40,10,20,20,5,5];
var width_data=container_width;
var height_data= container_heigth;
var textScoreTotal;
var gSimple;
var margin2 = {top: 0, right:0, bottom:0, left:0}

var radius= width_data*0.25
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
  //console.log(s);
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
 // console.log(s);
  if(s.includes("5.5")){
    return "N/A"
  }
  return parseFloat(s).toFixed(2).toString();

}

function format_etichetta(s){
  var r=s.toUpperCase().split(" ");
  var c=""
  if(s.includes("(")){
    c= s.toUpperCase().substring(
      s.lastIndexOf("(") + 1, 
      s.lastIndexOf(")")
    
  );
  
  }
 
  var x="";
  for(var i=0;i<r.length;i++){
    r[i]=r[i].replace("(","").replace(")","")
    if(r[i].includes("UNIVERS")){
      x+="UNI."
    }
    else if(r[i].includes("TECHNOL")){
      x+="TECH."
    }
    else if(r[i].includes("NATION")){
      x+="NAT."
    }
    else if(r[i].includes("INSTITUTE")){
      x+="INST."
    }
    else if(r[i]=="DEGLI"||r[i]=="DI"||r[i]=="STUDI"){
      continue;
    }
    else if(r[i].includes("COLLEGE")){
      x+="COLL."
    }
    else if(r[i]=="OF"||r[i]=="DO"||r[i]=="LOS"||r[i]=="THE"||r[i]=="DE"||r[i]=="DI"||r[i]=="DEGLI"||r[i]=="DELLA"||r[i]=="LA"||r[i]=="LE"||r[i]=="LES"||r[i]=="-"||r[i]=="--"){
      continue;
    }
    else{
      x+=r[i];
    }
    x+=" "
    if(x.split(" ").length>3)break;
  }
  
  if(c==""){
    return x;
  }
  else{
    console.log(c,x);

     return x.length>c.length? c:x
  }
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
    
        what_miss[names[n]]="NotPresent "+j+"/";
      }else{
        what_miss[names[n]]+="NotPresent "+j+"/";
      }
          
      }
      skipped=true;
    }
    
  }
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
    d3.select("#BARsvg").style("visibility","hidden").attr("height", 0)
    what_miss={};
    if(selected_on_map.length===0){
      document.getElementById("data1").innerHTML="";
      document.getElementById("data2").innerHTML="";
      document.getElementById("data4").innerHTML="";
      document.getElementById("data5").innerHTML="";

      //document.getElementById("data3").innerHTML="";
      d3.select('#yearSel').remove()
      d3.select("#BARsvg").style("visibility","visible").attr("height", 550)
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
        var msg=r+" "+ format_info(what_miss[r])

        stamp+=r+" "+ format_info(what_miss[r])

        document.getElementById("toast_id").innerHTML=msg;

        var toast= document.getElementById("liveToast").cloneNode(true);
  
        toast.setAttribute('id',msg.replace(/[^a-zA-Z]/g, ""));
        document.getElementById("toastlist").appendChild(toast); 
          $('#'+msg.replace(/[^a-zA-Z]/g, "")).toast('show');

      })
  
    //  / d3.select("#data1").append("div").attr("id","missingData");


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
    .attr("width",width_data*0.45)
    .attr("height",height_data*0.6).attr("transform", "translate(" + 0 + "," +( height_data*0.05) + ")");

    d3.select("#title_timestarplot").style("visibility","visible");
    d3.select("#title_tool_overall").style("visibility","visible");

  
    var g = svgT.append("g").attr("transform", "translate(" +13 + "," + margin.top/2 + ")");

var formatNumber = d3.format(".1f");

var x = d3.scaleTime()
    .domain([new Date(2015, 11, 1), new Date(2020, 1, 1)])
    .range([0, width_data*0.4]);

var y = d3.scaleLinear()
    .domain([0, 100.0])
    .range([height_data*0.5, 0]);

var xAxis = d3.axisBottom(x)
    .ticks(d3.timeYear).tickFormat(d3.timeFormat("%Y"));

var yAxis = d3.axisRight(y)
    .tickSize(width_data*0.5)
    .tickFormat(function(d) {
      var s = formatNumber(d);
      return s
          
    });

g.append("g")
    .attr("transform", "translate(40," + height_data*0.5 + ")")
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



data_all_time=[];

for(let n=0;n< names.length;n++){
  //to be used for the color...
  var position_wrt_selected=ArrOfMEANS.indexOf(d_mean[names[n]]);

  
  let u=d[names[n]];
  xCoords=[new Date(2015, 12, 31), new Date(2018, 1, 1),new Date(2019, 1, 1),new Date(2020, 1, 1)];
  let yCoords=[];
  let dataDone =[];
  for(let l =0;l<4;l++){
    dataDone.push( { date:xCoords[l],rating:parseFloat(u.split("/")[l])});
    yCoords.push(parseFloat(u.split("/")[l]));
    data_all_time.push(dataDone);
  }
  
 
  
  var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rating); })
  

  let Index=3;

  svgT.append("path").attr("transform", "translate(" +40 + "," + margin.top/2  + ")").datum(dataDone).attr("fill", "none")
  .attr("stroke", colors[position_wrt_selected])
  .attr("stroke-width", 5).attr("class","line").attr("d",line)
  .on("mouseover",function(d,h){
    console.log(names[n],d_mean[names[n]]);
    d3.select(this).attr("stroke", "yellow");


  var redTxt=svgT.append("text").attr("transform", "translate(40," + margin.top/2+ ")").attr("id","overline").attr("x", width_data*0.3) 
.attr("y",y(d_mean[names[n]])+30)
.text(function(d) {
  return format_etichetta(names[n]) +" - Overall mean: "+parseFloat(d_mean[names[n]]).toFixed(2);  // Value of the text
 })   
.attr("cc",function() {
  
 return this.getBBox().width;
})

svgT.append("rect").attr("transform", "translate(" +40 + "," + margin.top/2 + ")").attr("id","overSline").attr("x", width_data*0.3) 
.attr("y", y(d_mean[names[n]])+10)
.attr("width",redTxt.attr("cc"))
.attr("height", 22.5)
.attr("fill",colors[ArrOfMEANS.indexOf(d_mean[names[n]])]).style("opacity","0.25")

  }).on("mouseout",function(d,h){
    d3.select(this).attr("stroke", d3.rgb(colors[ArrOfMEANS.indexOf(d_mean[names[n]])]));
    svgT.select("#overSline").remove();
    svgT.select("#overline").remove();
  });


  svgT.append("g").selectAll("circle").data(yCoords).enter()
    .append("circle").attr("transform", "translate(" +40 + "," + margin.top/2 + ")").attr("id",""+names[n])
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
  if (d3.select(this).attr("cx")==x(new Date(2015, 12, 31))){
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
  
  var ret=svgT.append("text").attr("transform", "translate(" + 0 + "," + margin.top + ")").attr("id","overC").attr("x",function(d){return x(xCoords[Index])+12}).attr("y",function(d){return y(i)+25})
  .attr("cc",
  function(){
    console.log(this);
    return this.getBBox().width
  })
 .text(function(d) {
   return i.toFixed(2)+"";  })
  
  .attr("cc",function() {
  
    return this.getBBox().width+5;
   });

   svgT.append("rect").attr("transform", "translate(" +0 + "," + margin.top + ")").attr("id","overSC").attr("x", function(d){return x(xCoords[Index])+10}) 
   .attr("y", function(d){return y(i)+10})
   .attr("width",ret.attr("cc"))
   .attr("height", 22)
   .attr("fill",colors[ArrOfMEANS.indexOf(d_mean[names[n]])]).style("opacity","0.25")

  })
  .on("mouseout",function(d,i){
    
    d3.select(this).attr("fill", "black")
    .attr("r", ""+5 );
    svgT.select("#overC").remove()
    svgT.select("#overSC").remove()
  });

//   svgS.insert("rect","text").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")").attr("id","overSR").attr("x", cx[index]-25) 
// .attr("y", cy[index]-20)
// .attr("width", redTxt.attr("cc"))
// .attr("height", 12)
// .attr("fill",colors[name_index(dN)])
// .attr("opacity","0.5")



}
if(names.length>1){

 
  let YYY=[0,0,0,0];
  for(var q =0;q<names.length*4;q+=4){
    for(w in YYY){
      YYY[w]+=data_all_time[q][w].rating
    }
  }
  var dataline=[]
  for(yy in YYY ){
    YYY[yy]/=names.length;
    dataline.push( { date:xCoords[yy],rating:YYY[yy]});
  }
  console.log("DATAd",data_all_time,dataline);
  var line = d3.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.rating); })


let Index=3;

svgT.append("path").attr("transform", "translate(" +40 + "," + margin.top/2 + ")").datum(dataline).attr("fill", "none")
.attr("stroke", "#686868") .style("stroke-dasharray", ("10, 5"))
.attr("stroke-width", 5).attr("class","line").attr("d",line)
.on("mouseover",function(d,h){
  
  d3.select(this).attr("stroke", "yellow");

  var m= 0;
var redTxt=svgT.append("text").attr("transform", "translate(40," + margin.top/2 + ")").attr("id","overline").attr("x", width_data*0.3) 
.attr("y",function(){
  
  YYY.forEach(t=>{
    m+=t
  })
  return y(m/4) +35
})
.text(function(d) {
return  "GENERAL Overall mean: "+parseFloat(m/4).toFixed(2);  // Value of the text
})   
.attr("cc",function() {

return this.getBBox().width;
})

svgT.append("rect").attr("transform", "translate(" +40 + "," + margin.top/2 + ")").attr("id","overSline").attr("x", width_data*0.3) 
.attr("y", y(m/4)+20)
.attr("width",redTxt.attr("cc"))
.attr("height", 20)
.attr("fill","#686868").style("opacity","0.25")

}).on("mouseout",function(d,h){
  d3.select(this).attr("stroke", "#686868");
  svgT.select("#overSline").remove();
  svgT.select("#overline").remove();
});


svgT.append("g").selectAll("circle").data(YYY)
.enter()
  .append("circle").attr("transform", "translate(" +40 + "," + margin.top/2 + ")").attr("id","AVGt")
.attr("cx",function(d,i){
      var p;
      
      p=xCoords[i]
      
      return x(p);
      })
.attr("cy",function(d,i){
      var p = YYY[i];
      
      return y(p);
  })
  
.attr("r","5")
.attr("fill","black")	
.on("mouseover",function(d,i){
  var na=d3.select(this).attr("id")
  d3.select(this).attr("fill", colors[name_index(na)])
  .attr("r", ""+5 * 2)
if (d3.select(this).attr("cx")==x(new Date(2015, 12, 31))){
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

var ret=svgT.append("text").attr("transform", "translate(" + 0 + "," + margin.top/2 + ")").attr("id","overC").attr("x",function(d){return x(xCoords[Index])+12}).attr("y",function(d){return y(i)+25})
.attr("cc",
function(){
  console.log(this);
  return this.getBBox().width
})
.text(function(d) {
 return i.toFixed(2)+"";  })

.attr("cc",function() {

  return this.getBBox().width+5;
 });

 svgT.append("rect").attr("transform", "translate(" +0 + "," + margin.top/2 + ")").attr("id","overSC").attr("x", function(d){return x(xCoords[Index])+10}) 
 .attr("y", function(d){return y(i)+10})
 .attr("width",ret.attr("cc"))
 .attr("height", 22)
 .attr("fill","#686868").style("opacity","0.3")

})
.on("mouseout",function(d,i){
  
  d3.select(this).attr("fill", "black")
  .attr("r", ""+5 );
  svgT.select("#overC").remove()
  svgT.select("#overSC").remove()
});

}
    arr_sorted=[];
    arr_sorted=sort_name_by_med(names);


    
    

//     var size = 20
// svgT.selectAll("mydots")
//   .data(arr_sorted)
//   .enter()
//   .append("rect")
//   .attr("class","LegendDot")
//     .attr("x", 100)
//     .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
//     .attr("width", size).attr("transform", "translate(" + (widthT +20)+ "," + -10 + ")")
//     .attr("height", size)
//     .style("fill", function(d){ return colors[name_index(d)]})

// Add one dot in the legend for each name.
// svgT.selectAll("mylabels")
//   .data(arr_sorted)
//   .enter()
//   .append("text").attr("class","LegendLabel")
//     .attr("x", 100 + size*1.2).attr("transform", "translate(" + (widthT+20) + "," + -10 + ")")
//     .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
//     .style("fill", function(d){ return colors[name_index(d)]})
//     .text(function(d){ return format_etichetta(d) +" ("+d_mean[d].toFixed(2)+")"})
//     .attr("text-anchor", "left")
//     .style("alignment-baseline", "middle")

//   svgT.append("text")
//     .attr("class", "x label")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//     .attr("text-anchor", "center")
//     .attr("x", widthT/2)
//     .attr("y", heightT +50)
//     .text("Years");
//     svgT.append("text")
//     .attr("transform", "translate(" + margin.left + "," + 1 + ")")
//     .attr("class", "y label")
//     .attr("text-anchor", "end")
//     .attr("y", 6)
//     .attr("dy", ".75em")
//     .attr("x", 30)
//     .text("Rating");

  clicked_label=[];
  c_initial=true;
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


function arr_diff (a1, a2) {

  var a = [], diff = [];

  for (var i = 0; i < a1.length; i++) {
      a[a1[i]] = true;
  }

  for (var i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
          delete a[a2[i]];
      } else {
          a[a2[i]] = true;
      }
  }

  for (var k in a) {
      diff.push(k);
  }

  return diff;
}

function starPlot(){
  var newRemove;
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

function showOnlyClicked(institutions){
  updateStar([])
  
  var to_be_hidden=[...institutions]
  
  for(var j=0;j<clicked_label.length;j++){
    for(var i =0;i<institutions.length;i++){
     if(clicked_label[j].includes(institutions[i])){
       to_be_hidden.splice(to_be_hidden.indexOf(institutions[i]),1)
       break;
     }

    }
    
  }
  
    svgS.selectAll("path").filter(function(d,i){
     
      var I_D=d3.select(this).attr("id")
      for(var j=0;j<to_be_hidden.length;j++){
        if(I_D.includes(to_be_hidden[j])) return true;
      }
      return false;
    }).remove()

    svgS.selectAll(".circleInStar").filter(function(d,i){
      
      var I_D=d3.select(this).attr("id")
      for(var j=0;j<to_be_hidden.length;j++){
        if(I_D.includes(to_be_hidden[j])) return true;
      }
      return false;
    }).remove()
  
  
}

function angleToCoordinate(angle, value){
  let x = Math.cos(angle) * radialScale(value);
  let y = Math.sin(angle) * radialScale(value);
  return {"x": 300 + x, "y": 300 - y};
}

d3.select("#starplot").remove();
d3.select("#littlelegend").remove();
d3.select("#yearSel").remove();



d3.select("#yourSelection").style("visibility", "visible")
var svgLeggends=d3.select("#legends").append("svg").attr("width",width_data/2).attr("id","littlelegend").attr("transform","translate("+(width_data*0.32)+","+"-15) scale(0.8)")


var svgS= d3.select("#data2")
.append("svg")
.attr("id","starplot")
.attr("width",width_data*0.5)
.attr("height",height_data*0.7)                                                //  <------------------  --------        ----------------TODO Regola zoom
// .call(d3.zoom().scaleExtent([0.3,105]).on("zoom", function(event) {
//   //console.log(d3.event.transform)

//     svgS.attr("transform",event.transform)
//   }))
  .append("g").attr("transform", "translate("+(width_data*0.2-margin.left)+","+(height_data*0.2-margin.top)+") scale(0.6)");

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


//console.log(d_2016,d_2018,d_2019,d_2020)

// svgS.append("text")
//   .attr("x", 275) 
//   .attr("y", 0)
//   .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
//   .text("Star Graph");
let features = ["Academicscorerscore","Employerscore","FacultyStudentscore","CitationsPerFacultyscore","InternationalFacultyscore","InternationalStudentscore","OverallScore"];
let features_adjusted = ["Academic score","Employer score","FacultyStudent score","CitationsPerFaculty score","InternationalFaculty score","InternationalStudent score","OverallScore"];

let radialScale = d3.scaleLinear()
    .domain([0,100])
    .range([0,radius]);
let ticks = [5.5,20,40,60,80,100];

ticks.forEach(t =>
  svgS.append("circle").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
  .attr("cx", 300)
  .attr("cy", 300)
  .attr("fill", "none")
  .attr("stroke", "gray")
  .attr("r", radialScale(t))
);
ticks.forEach(t =>
  svgS.append("text").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
  .attr("x", 305)
  .attr("y", 300 - radialScale(t))
  .text(x=>{
    if(t.toString()==="5.5")return "N/A";
    else return t.toString();
  })
);




for (var i = 0; i < features.length-1; i++) {
  let ft_name = features_adjusted[i];
  let angle = (Math.PI / 2) + (2 * Math.PI * i / (features.length-1));
 
  let line_coordinate = angleToCoordinate(angle, 100);
  let label_coordinate = angleToCoordinate(angle, 107);

  //draw axis line
  svgS.append("line").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
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
  
  svgS.append("text").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
  .attr("x", label_coordinate.x) 
  .attr("y", label_coordinate.y)
  .text(ft_name);
}


let selected_year_data=d_2020;
let starting_Legend;
function updateStar(hide){
  newRemove=[]
  arr_sorted=sort_name_by_med(names);
  arr_sorted=arr_diff(arr_sorted,hide)
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
  
  let coordinates = getPathCoordinates(dN);

  //draw the path element
  svgS.append("path").attr("id","Path"+names[i]).attr("class","graphInStar").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
  .datum(coordinates)
  .attr("d",line)
  .attr("stroke-width", 3).attr("pointer-events", "none")
  .attr("stroke", color)
  .attr("fill", color)
  .attr("stroke-opacity", 1)
  .attr("opacity", 0.5)
  

  
  let angleCircle ;
  let arr = [...features];
  let cx =[];
  let cy=[];
  arr.pop();
  
  svgS.append("g").selectAll("circle").data(arr).enter()
  
  .append("circle").attr("class","circleInStar")
  .attr("id","Circles"+names[i])
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
  
.attr("r","5").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
.attr("fill","black")
.on("mouseover",function(d,i){
  
    d3.select(this).attr("fill", colors[name_index(dN)])
    .attr("r", ""+5 * 2)
  var index=arr.indexOf(i);


  




var redTxt=svgS.append("text").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")").attr("id","overS").attr("x", cx[index]-25) 
.attr("y", cy[index]-10)
.text(function(d) {
  return format_etichetta(dN) +" - "+format_number(selected_year_data[dN][index])+"";  // Value of the text
 })   
.attr("cc",function() {
  
 return this.getBBox().width;
})
   




svgS.insert("rect","text").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")").attr("id","overSR").attr("x", cx[index]-25) 
.attr("y", cy[index]-20)
.attr("width", redTxt.attr("cc"))
.attr("height", 12)
.attr("fill",colors[name_index(dN)])
.attr("opacity","0.5")


})


.on("mouseout",function(d,i){
  
  d3.select(this).attr("fill", "black")
  .attr("r", ""+5 );
  svgS.select("#overS").remove()
  svgS.select("#overSR").remove()
})



      
  
  

}

size=20

svgLeggends.selectAll("mydotsS")
  .data(arr_sorted)
  .enter()
  
  
  .append("rect")
  .attr("id",function(d,i){return "Lab"+arr_sorted[i]})
  .attr("class","LegendDotS")
  
    .attr("x", 10)
    .attr("y", function(d,i){  return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size).attr("transform", "translate(" + (0+10) + "," + 0 + ")")
    .attr("height", size)
    .attr("fill", function(d,i){ 
      var b = clicked_label.includes("Lab"+arr_sorted[i])
      return b==true?"#F8D210":colors[i]
    }).on("click",function(d,i){
      if((names.length==1 && newRemove.length==0) || (names.length==0 && newRemove.length==1 ) )return;
      //higlight at most 2 graphs
      if(clicked_label.includes(d3.select(this).attr("id"))){
        var insx = clicked_label.indexOf(d3.select(this).attr("id"))
        clicked_label.splice(insx,1);
        if(clicked_label.length==0){
          return starPlot(); //reload as before
        }
        else{
          return showOnlyClicked(names.concat(newRemove));
        }
      }
      else{
        if(clicked_label.length<2){
          
          clicked_label.push(d3.select(this).attr("id"));
          
          return showOnlyClicked(names.concat(newRemove));
  
        }
        else{
          tmp = [clicked_label[1],d3.select(this).attr("id")];
          clicked_label=tmp;
          return showOnlyClicked(names.concat(newRemove));
        }
      }
      
    })
    

// Add one dot in the legend for each name.
svgLeggends.selectAll("mylabelsS")
  .data(arr_sorted)
  .enter()
  .append("text").attr("class","LegendLabelS")
    .attr("x", 20 + size*1.65).attr("transform", "translate(" + (0+0) + "," + 0 + ")")
    .attr("y", function(d,i){ return 10 + i*(size+5) + (size*0.9)}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d,i){ return colors[i]})
    .text(function(d,i){ return format_etichetta(arr_sorted[i])+" - ("+format_number(selected_year_data[arr_sorted[i]][6])+")"})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")




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
  svgS.append("path").attr("class","graphInStar").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
  .datum(coordinates)
  .attr("d",line)
  .attr("stroke-width", 3).attr("pointer-events", "none")
  .attr("stroke", color)
  .attr("fill", color)
  .attr("stroke-opacity", 1)
  .attr("opacity", 0.5)
  .attr("id", "Path"+newRemove[i])

  
  let angleCircle ;
  let arr = [...features];
  let cx =[];
  let cy=[];
  arr.pop();
  
  svgS.append("g").selectAll("circle").data(arr).enter()
  
  .append("circle").attr("class","circleInStar")
  .attr("id","Circles"+newRemove[i])
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
  
.attr("r","5").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
.attr("fill","black")
.on("mouseover",function(d,i){
  
     d3.select(this).attr("fill", supplement_colors[P]);
    
    d3.select(this).attr("r", ""+5 * 2)
  var index=arr.indexOf(i);




  var redTxt=svgS.append("text").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")").attr("id","overS").attr("x", cx[index]-25) 
.attr("y", cy[index]-10)
.text(function(d) {
  return format_etichetta(dN) +" - "+format_number(selected_year_data[dN][index])+"";  // Value of the text
 })   
.attr("cc",function() {
  console.log(this)
  console.log("porcosdiao")
 return this.getBBox().width;
})
   
console.log("Green= "+redTxt.attr("cc"))

var rectlabel=svgS.insert("rect","text").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")").attr("id","overSR").attr("x", cx[index]-25) 
.attr("y", cy[index]-25)
.attr("width",redTxt.attr("cc"))
.attr("height", 24)
.attr("fill","#BCE1DE")


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
svgLeggends.selectAll("mydotsS")
  .data(newRemove)
  .enter()
  .append("rect")
  .attr("class","legendDotS")
  .attr("id",function(d,i){return "Lab"+newRemove[i]})

  .attr("x", width_data*0.2+10)
  .attr("y", function(d,i){  
    return 10+ i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
  .attr("width", size).attr("transform", "translate(" + (0+10) + "," + 0 + ")")
  .attr("height", size)
    
    .style("fill", function(d,i){ 
      var b = clicked_label.includes("Lab"+newRemove[i])
      return b==true?"#F8D210":supplement_colors[i]
    }).on("click",function(d,i){
      if((names.length==1 && newRemove.length==0) || (names.length==0 && newRemove.length==1 ) )return;
      //higlight at most 2 graphs
      if(clicked_label.includes(d3.select(this).attr("id"))){
        var insx = clicked_label.indexOf(d3.select(this).attr("id"))
        clicked_label.splice(insx,1);
        if(clicked_label.length==0){
          return starPlot(); //reload as before
        }
        else{
          return showOnlyClicked(names.concat(newRemove));
        }
      }
      else{
        if(clicked_label.length<2){
          clicked_label.push(d3.select(this).attr("id"));
          
          return showOnlyClicked(names.concat(newRemove));
  
        }
        else{
          tmp = [clicked_label[1],d3.select(this).attr("id")];
          clicked_label=tmp;
          return showOnlyClicked(names.concat(newRemove));
        }
      }
      
    })
    
// Add one dot in the legend for each name.

svgLeggends.selectAll("mylabelsS")
  .data(newRemove)
  .enter()
  .append("text").attr("class","legendLabelS")

  .attr("x", width_data*0.2+20 + size*1.65).attr("transform", "translate(" + (0+0) + "," + 0 + ")")
  .attr("y", function(d,i){ return 10 + i*(size+5) + (size*0.9)})
    .style("fill", function(d,i){ return supplement_colors[i]})
    .text(function(d,i){ return format_etichetta(newRemove[i])+" ("+format_number(selected_year_data[newRemove[i]][6])+")"})
    .style("alignment-baseline", "middle")

    


    //console.log(names,newRemove, selected_year_data);
    function bargraph(overalls){
      d3.select("#BARsvg2").remove()
      function map_usage_unidata(){
        var r = [];
        for(u in unis){
          var t={};var vl=[];
          t["categorie"]=format_etichetta(unis[u]);
          vl.push({"value":overalls[unis[u]][0],"rate":"new","cat":format_etichetta(unis[u]),"type":"A"})
          vl.push({"value":overalls[unis[u]][1],"rate":"old","cat":format_etichetta(unis[u]),"type":"A"})
          t["values"]=vl;
          r.push(t)
        }
        for(u in newRemove){
          var t={};var vl=[];
          t["categorie"]=format_etichetta(newRemove[u]);
          vl.push({"value":overalls[newRemove[u]][0],"rate":"new","cat":format_etichetta(newRemove[u]),"type":"B"})
          vl.push({"value":overalls[newRemove[u]][1],"rate":"old","cat":format_etichetta(newRemove[u]),"type":"B"})
          t["values"]=vl;
          r.push(t)
        }
        return r;
      }
      function check_55(arr_x){
        const thresh=4;
        var s=0;
        for(i in arr_x){
          if(parseFloat(arr_x[i])==5.5){
            s++;
          }
          if(s>thresh){
            return true; // too many missing data!
          }
          if(s>0){ // some Val missing

          }
        }
        return false;
      }

      var unis = sort_name_by_med(Object.keys(overalls))
      console.log(unis)
        //Size, Focus, Reasearch, Age, Status
      
      var marginBAR = {top: 20, right: 20, bottom: 30, left: 40},
          widthBAR = 350+(50*unis.length) - marginBAR.left - marginBAR.right,
          heightBAR = 500 - marginBAR.top - marginBAR.bottom;
      
      var x0 = d3.scaleBand()
      
          .range([0, widthBAR-20]).round([.1]).paddingInner([0.60]).paddingOuter([0.3])
      
      var x1 = d3.scaleBand();
      
      var y = d3.scaleLinear()
          .range([heightBAR, 0]);
      
      var xAxis = d3.axisBottom(x0)
          
          .tickSize(0)
          
      var yAxis = d3.axisLeft(y)
          
      
      const colorOri = 
          ["#f22105",
          "#ff7eac",
          "#ffdbff",
          "#aed1ff",
          "#00cceb"]
      const supplement_colorNew=["#8f0678",
        "#af749f",
        "#c6c6c6",
        "#dcd78a",
        "#e8e83c"]
      const colorNew = ["#de8f40",
          "#eebf97",
          "#f1f1f1",
          "#bfb7da",
          "#8d80c2"]
      
      var svgB2 = d3.select('#data5').append("svg").attr("id","BARsvg2")
          .attr("width", width_data*0.6)
          .attr("height", heightBAR+100 + marginBAR.top + marginBAR.bottom)
        .append("g")
          .attr("transform", "translate(" + marginBAR.left + "," + (marginBAR.top+100) + ")");
      
        var CallS=map_usage_unidata(overalls);
       console.log(CallS)
      
        var categoriesNames =[];
        unis.forEach(u=>{
          categoriesNames.push(format_etichetta(u))
        })
        var new2Remove=[];
        var deleteIncomplete=[];
        newRemove.forEach(u=>{
          console.log(selected_year_data[u],overalls)
          if(selected_year_data[u][6]=="N/A"|| check_55(selected_year_data[u])){
            deleteIncomplete.push(format_etichetta(u))
            
          }
          else{
          categoriesNames.push(format_etichetta(u));
          new2Remove.push(format_etichetta(u));
          }
        })
        var rateNames = ["new","old"];
      
        x0.domain(categoriesNames);
        x1.domain(rateNames).range([0, x0.bandwidth()]);
        y.domain([0, 100]);
      
        svgB2.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + heightBAR + ")")
            .call(xAxis);
      
        svgB2.append("g")
            .attr("class", "y axis")
            .style('opacity','0')
            .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight','bold')
            .text("Value");
      
        svgB2.select('.y').transition().duration(500).delay(1300).style('opacity','1');
        var supp_data=[];var C=0,D=0,co=false;
        for(delx in CallS){
          for(dely in deleteIncomplete){
            if(CallS[delx].categorie==deleteIncomplete[dely]){
              co=true
            }
          }
          if(co){
            co=false;
            // deleteIncomplete[dely] has no overall or not enough parameters.
            continue;
          }
          supp_data.push(CallS[delx])
        }
        console.log("S",supp_data)
        var this_rect="";
        var slice = svgB2.selectAll(".slice")
            .data(supp_data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform",function(d) {
              
              //console.log("DDDD",d)
              return "translate(" + x0(d.categorie) + ",0)"; });
      
           
        slice.selectAll("rect")
            .data(function(d) { return d.values; })
        .enter().append("rect").attr("id","RECT_"+d.cat)
            .attr("width", x1.bandwidth())
            .attr("x", function(d) { return x1(d.rate); })
            .style("fill", function(d,i) { 
              if(d.type=="A"){
                
              return i==0? colorNew[C]:colorOri[C++] 
              }
              else{
                return i==0? supplement_colorNew[D]:supplement_colors[D++]
                }
            })
            .attr("y", function(d) { return y(0); })
            .attr("height", function(d) { return heightBAR - y(0); })
            .on("mouseover",function(d,h){
               
                
                d3.select(this).style("fill", function(){
                  if(h.type=="A"){
                    var selectedU=categoriesNames.indexOf(h.cat);
                    return h.rate=="new"?d3.rgb(colorNew[selectedU]).darker(2):d3.rgb(colorOri[selectedU]).darker(2)
                  }
                  else{
                    var selectedU=new2Remove.indexOf(h.cat);
                    return h.rate=="new"?d3.rgb(supplement_colorNew[selectedU]).darker(2):d3.rgb(supplement_colors[selectedU]).darker(2)
                  }
                });

                //TO FIX
                
                svgB2.append("text").style("fill",function(){
                  if(h.type=="A"){
                    var selectedU=categoriesNames.indexOf(h.cat);
                    return h.rate=="new"?d3.rgb(colorNew[selectedU]):d3.rgb(colorOri[selectedU])
                  }
                  else{
                    var selectedU=new2Remove.indexOf(h.cat);
                    return h.rate=="new"?d3.rgb(supplement_colorNew[selectedU]):d3.rgb(supplement_colors[selectedU])
                  }
                }).attr("id","robaTextX").attr("transform",function(){ return  "translate(" + x0(h.cat) + ",-5)" }).attr("x",d3.select(this).attr("x")).attr("y",d3.select(this).attr("y")).text(h.value);
      
            })
            .on("mouseout",function(d,h){
              d3.select(this).style("fill", function(){
              if(h.type=="A"){
                var selectedU=categoriesNames.indexOf(h.cat);
                return h.rate=="new"?d3.rgb(colorNew[selectedU]):d3.rgb(colorOri[selectedU])
              }
              else{
                var selectedU=new2Remove.indexOf(h.cat);
                return h.rate=="new"?d3.rgb(supplement_colorNew[selectedU]):d3.rgb(supplement_colors[selectedU])
              }
            })
              
              svgB2.select("#robaTextX").remove()
            })
          
        slice.selectAll("rect")
            .transition()
            .delay(function (d) {return Math.random()*1000;})
            .duration(1000)
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return heightBAR - y(d.value); });
      
 
        svgB2.append("text").attr("transform", "translate(" + (widthBAR+95) + "," + 48 + ")").text("NEW")
        svgB2.append("text").attr("transform", "translate(" + (widthBAR+140) + "," + 48 + ")").text("ORI")
        svgB2.selectAll("legendSlidebar")
        .data(supp_data)
        .enter()
        .append("rect")
        .attr("class","legendSlideBarX")
       
        .attr("x", 100)
        .attr("y", function(d,i){ 
                              return 45+ i*(30+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", 30)
        .attr("height", 30).attr("transform", "translate(" + (widthBAR) + "," + 20 + ")")
        .style("fill", function(d,i){ 
          console.log("AAA",d)
             if(d.values[0].type=="A")
                return  colorNew[i]
              else return  supplement_colorNew[i-unis.length]
    })
    svgB2.selectAll("legendSlidebar2")
        .data(supp_data)
        .enter()
        .append("rect")
        .attr("class","legendSlideBarX")
       
        .attr("x", 100)
        .attr("y", function(d,i){ 
                          return 45+ i*(30+5)     }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", 30)
        .attr("height", 30).attr("transform", "translate(" + (widthBAR+40) + "," + 20 + ")")
        .style("fill", function(d,i){ 
          if(d.values[0].type=="A")
             return  colorOri[i]
          else return supplement_colors[i-unis.length]
    })


    svgB2.selectAll("labelSLideBar2")
  .data(supp_data)
  .enter()
  .append("text").attr("class","legendLabelS")
    .attr("x", 100 + 30*1.2)
    .attr("y", function(d,i){return 50+ i*(30+5)+ (20)})
                            // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", "black")
    .text(function(d){ return d["categorie"]})
    .attr("text-anchor", "left").attr("transform", "translate(" + (widthBAR+70) + "," + 20 + ")")
    .style("alignment-baseline", "middle")
            
      c_initial=false
    }



    function createAnalytic(initial){
      function compute_overall(name_arr,vals){
        var res={}
        name_arr.forEach(n=>{
          var sco = selected_year_data[n];
          var new_ove=0,old_ove;
          for(s in sco){
            if(s==6)old_ove=sco[s];
            else{
              new_ove+=parseFloat(sco[s]).toFixed(1)*(vals[s]/100);
            }
          }
          res[n]=[new_ove.toFixed(2).toString(),old_ove];
        })
        return res;
      }
      if(initial){
        document.getElementById("data4").innerHTML=""
        document.getElementById("data5").innerHTML=""
     sliders_list =[]
     sliders_val=[...initial_per]
    
     function updateText(){

var res=0;
      for(var kk=0;kk<sliders_val.length;kk++){
        res+=sliders_val[kk]
      }
      textScoreTotal.text("Total="+res)

      if(res!=100){
        d3.select("#button_newoverall").attr("disabled","")
      }else{
        d3.select("#button_newoverall").attr("disabled",null)
      }
     }

      function createSlider(i,def){
      var data = [0, 20, 40, 60, 80, 100];

    
        var sliderSimple = d3
          .sliderBottom()
          .min(d3.min(data))
          .max(d3.max(data))
          .width(400)
          .tickFormat(d3.format('d'))
          .ticks(5)
          .step(5)
          .default(def)
          .fill('#2196f3')
          .on('onchange', val => {
            d3.select('p#value-simple').text(d3.format('d')(Math.round(val)));
            sliders_val[i]=Math.round(val);
            updateText();
          })
        ;
 

        if(i==0){
        gSimple= d3
        .select('#data4')
        .append('svg').attr('transform', 'translate(0,'+30+')').attr("id","SVGSLID")
        
        .attr('width', width_data*0.38)
        .attr('height',100*6+50)

        .append('g').attr("id","slider_"+i)
        .attr('transform', 'translate(40,'+30+')')
        }
        else{
          gSimple= d3
          .select('#SVGSLID')
          .append('g').attr("id","slider_"+i)
          .attr('transform', 'translate(40,'+105*i+')')
        }
        
  
        gSimple.call(sliderSimple);
  
        d3.select('p#value-simple').text(d3.format('.2%')(sliderSimple.value()));
        d3.select("#slider_"+i).append("text").attr('transform', 'translate(40,'+-10+')').text(arr_scores[i])
        sliders_list.push(sliderSimple);
    
      }
    
      for(e in arr_scores ){
        createSlider(e,initial_per[e]);
      }


 
      d3.select("#button_newoverall").remove()

      if(textScoreTotal != undefined){
        textScoreTotal.remove()
      }
      
      textScoreTotal=d3.select("#link").append("p").attr("id","perc_txt").text("Total=100").style("margin-left","3%")
      d3.select("#link").append("input").attr("class","btn btn-sm btn-primary")
        .attr("type", "button").attr("id","button_newoverall").style("position","relative").style("left","3%").style("top","0")
        .attr("name", "Compare Overall")
        .attr("value", "Compare Overall").on("click",function(){
      var sum=0;
      for(e in sliders_val){
        sum+=Math.round(sliders_val[e]);
      }
      
      if(sum!=100){
        //error
        var missing_="Percentage must sum to 100!";
        d3.select("#data4").append("div").attr("id","errorData4");
        document.getElementById("errorData4").innerHTML="<h3 style='color:blue'> "+missing_+"( Your %: "+sum+")</h3>";

      }
      else{
        if(document.getElementById("errorData4")!=null) document.getElementById("errorData4").innerHTML="";
        if(sliders_val.toString()===initial_per.toString()){
          var missing_="Change percentage to show differences!";
          d3.select("#data4").append("div").attr("id","errorData4");
          document.getElementById("errorData4").innerHTML="<h3 style='color:blue'> "+missing_+"</h3>";
          
        }
        else{
          var overalls = compute_overall(names.concat(newRemove),sliders_val);
          bargraph(overalls);
        }
      }

    })

  }
  else{//changing year = changing graph
    for(s in sliders_list){
      sliders_list[s].default(sliders_val[s]);
    }

   
    var overalls = compute_overall(names.concat(newRemove),sliders_val);
          bargraph(overalls);

  }
}


 if(c_initial){
   
  createAnalytic(true) 
 }
 else{
   createAnalytic(false);
 }
}





/*
#
#
SELECT YEAR BUTTON FOR STARPLOT
*/
var allGroup = ["2016", "2018", "2019", "2020"].reverse()

// Initialize the button
var dropdownButton = d3.select("#data3")
  .append('select').attr("id","yearSel").attr('class','justify-content-center form-select text-center')

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
    //console.log("EY",names,newRemove)
    if(clicked_label.length==0){
      updateStar([])
    }
    else{
    showOnlyClicked(names.concat(newRemove))
    }
    //clicked_label=[]
    //updateStar([])
  })


  updateStar([])
  
}
  
}
