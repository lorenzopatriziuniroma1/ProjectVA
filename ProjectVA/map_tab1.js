var sliderRange;var scale1on85=false;var rand1,rand2;var old2;
var width =container_width*0.99
var height = container_heigth *0.3;
var width_alla =container_width*0.99
var height = container_heigth *0.3;
var bounds; var magi = 0; var lineaMaginot;
var margin = {top: 100, right: 30, bottom: 80, left: 60}
d3.select("#youarSelection2").style("display",function(){return "none"});
function map_singleX(attr){
  
  if(attr==="XL"||attr==="FC"||attr=="5"||attr=="5.0"||attr=="VH"||attr==="A"){
    
    return "A"
  }
  else if(attr==="L"||attr==="CO"||attr=="4"||attr=="4.0"||attr=="HI"||attr==="B"){
    
    return "B"
  }
  else if(attr==="M"||attr==="FO"||attr=="3"||attr=="3.0"||attr=="MD"||attr==="C"){
    
    return "C"
  }
  else if(attr==="S"||attr==="SP"||attr=="2"||attr=="2.0"|attr=="LO"||attr==="D"){
    
    return "D"
  }
  else{
    
    return "E"
  }
   
  }

var myColorCircle1 = d3.scaleLinear().domain([1,10])
  .range(sequential_color_divergent_from_blue)

var linear = d3.scaleLinear()
  .domain([0,10])
  .range(sequential_color_divergent_from_blue);

var symbolGenerator = d3.symbol()
  .type(d3.symbolStar)
  .size(140);

var pathData = symbolGenerator();
var svg1 = d3.selectAll("#map")
  .append("svg")
    .attr("width", width/2) 
    .attr("height", height )
    .style("background",background)
    .style("margin-bottom","10px")

var g = svg1.append("g");


var color_circle = d3.scaleOrdinal()
    .range(sequential_color_divergent_from_blue2);


const projection = d3.geoMercator()
    .translate([width / 4, height / 2+50]) // translate to center of screen
    .scale([200]); // scale things down so see entire US
 
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
  div	.html(i.Institution + "<br/> Rank =" +i["CurrentRank"]+"<br/>")	
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

    if(selected.length==0){ //non va BOH
      d3.select("#yourSelection").style("visibility","hidden")
      d3.select("#littlelegend").remove()
      d3.select("#perc_txt").remove()
      d3.select("#button_newoverall").remove();
      d3.select("#selectmapyea2").style("display",function(){return "block"});
      d3.select("#title_timestarplot").style("visibility","hidden");
      d3.select("#title_tool_overall").style("visibility","hidden");
      d3.select("#youarSelection2").style("display",function(){return "none"});
      document.getElementById("mybuttonnav").style.visibility="hidden"
    }
    else{
      d3.select("#selectmapyea2").style("display",function(){return "none"});
      d3.select("#youarSelection2").style("display",function(){return "block"});
      document.getElementById("mybuttonnav").style.visibility="visible"
    }
}
const path = d3.geoPath().projection(projection);


 var stats;
d3.json("https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json").then(function(uState) {


  d3.csv("ProjectVA/pca_csv/pca_year_v2_2020.csv").then(function(csv) {
    data = csv;
    

     bounds = path.bounds( uState)
    myColorCircle1 = d3.scaleLinear().domain([0,100])
  .range(sequential_color_divergent_from_blue2)

  createHorizontalLegend(svg1,myColorCircle1,"legend_map1")


    var color= d3.rollup(data, v =>{return v.length }, d => d.Country)

    g.selectAll('path')
    .data(uState.features)
    .enter()
    .append('path')
    .attr("d", path)
    .attr("class","country")
    .style("fill",function(d){
      var cou_name=d.properties.name;
    if(cou_name=="Korea"){ //COUNTRIES WITH DIFFERENT NAMES HERE 
      cou_name="South Korea"
    }
  if(color.get(cou_name) == undefined) return palette_sequential_map[3]; 
      return colores_range2(color.get(cou_name),0,50)
    })
    .style("stroke",stroke_color)
    .style("stroke-width",".3px")


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
  .style("fill",function(d){return myColorCircle1(d.OverallScore) })
  .attr("d",pathData)
  .attr("transform", function(d) {return "translate(" + projection([d.Longitude,d.Latitude]) + ")"+" scale(1.0)";})
  //.attr("transform", function(d) {console.log("ZOOMER");var rand= Math.random()*300/100*(Math.random() < 0.5 ? -1 : 1); return "translate(" + (projection([(d.Longitude+rand),(d.Latitude+rand)])) + ")"+" scale(1.0)";})
  .attr("id",function(d){return d.Institution})
  .attr("class","University star")
  .attr("co",function(d){return myColorCircle1(d.OverallScore) })
  .attr("rand",function(d){return Math.random()*15/100*(Math.random() < 0.5 ? -1 : 1)})
  .attr("rand2",function(d){return Math.random()*20/100*(Math.random() < 0.5 ? -1 : 1)})
  .attr("Usize",function(d){
    return map_singleX(d.Size)
  })
  .attr("Ures",function(d){
    return map_singleX(d.Research)
  })
  .attr("Uage",function(d){
    return map_singleX(d.Age)
  })
  .attr("Ufocus",function(d){
    return map_singleX(d.Focus)
  })
  .attr("Ustatus",function(d){
    return map_singleX(d.Status)
  }).style("stroke",stroke_color)
  .style("stroke-width","1px")
  ;


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
  .attr("r",5).style("fill",function(d){return myColorCircle1(d.OverallScore) })
  .attr("transform", function(d) {return "translate(" + projection([d.Longitude,d.Latitude]) + ")"+" scale(1.0)";})

  
  .attr("id",function(d){return d.Institution})
  .attr("class","University cityCircle")
  .attr("co",function(d){return myColorCircle1(d.OverallScore) })
  .attr("rand",function(d){return Math.random()*15/100*(Math.random() < 0.5 ? -1 : 1)})
  .attr("rand2",function(d){return Math.random()*20/100*(Math.random() < 0.5 ? -1 : 1)})
  .attr("Usize",function(d){
    return map_singleX(d.Size)
  })
  .attr("Ures",function(d){
    return map_singleX(d.Research)
  })
  .attr("Uage",function(d){
    return map_singleX(d.Age)
  })
  .attr("Ufocus",function(d){
    return map_singleX(d.Focus)
  })
  .attr("Ustatus",function(d){
    return map_singleX(d.Status)
  }).style("stroke",stroke_color)
  .style("stroke-width","1px");


  d3.selectAll(".star").moveToFront()

  createBarGraph(data)



  var width=bounds[1][0]-bounds[0][0]
  var height=bounds[1][1]-bounds[0][1]






  var zoom = d3.zoom()
.scaleExtent([0.5, 85])
.translateExtent([[-width+width/2, -height+height/2], [width+width/2, height+height/2]])
.on('zoom', function(event) {

   g.attr("transform",event.transform);


var scale=1/(event.transform.k)

if(scale<0.05){ 
  scale=0.05
}
var uni=g.selectAll(".University")
   uni.attr("transform", function(d,i) {
    var rand=0,
    rand2=0;

    if(1/event.transform.k<=1/83){ 

      rand=parseFloat(uni._groups[0][i].getAttribute("rand"))
      rand2=parseFloat(uni._groups[0][i].getAttribute("rand2"))
 
    }
    return "translate(" + projection([parseFloat(d["Longitude"])+rand,parseFloat(d["Latitude"])+rand2]) + ")"+" scale("+scale+")";
   });

  div.transition()		
  .duration(500)		
  .style("opacity", 10);
  div.transition()		
  .duration(500)		
  .style("opacity", 0);
});

svg1.call(zoom);


  });






})



function colores_range2(n,start,end) {
  var colores_g =palette_sequential_map;
  var step=(end-start)/3;
  var i=0;
  if(n<start+step){i=2}
  if(start+step<=n && n<start+2*step){i=1}
  if(start+2*step<=n){i=0}
  return colores_g[i];
}


var old;


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

create_legend(svg1,width_alla/2,undefined)

  // Range
 
   sliderRange = d3
  .sliderBottom()
  .min(0)
  .max(100)
  .width(width*0.3)
  .ticks(5)
  .step(1)
  .default([0, 100])
  .fill('#2196f3')
  .handle(
    d3
      .symbol()
      .type(d3.symbolCircle)
      .size(200)()
  )
  .on('onchange', val => {
    d3.select('#value-range').text("University Overall: "+ val.join('-'));
 
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

d3.select('#value-range').text("University Overall: "+
  sliderRange
    .value()
    .join('-')
);


function createBarGraph(year_datax){
  document.getElementById("data3").innerHTML=""
  
  //console.log(year_data)
  function map_usage(year_datay){
    //var supp=[{"categorie":"Size","values":[0,0,0,0,0]},{"categorie":"Focus","values":[0,0,0,0,0]},{"categorie":"Research","values":[0,0,0,0,0]},{"categorie":"Age","values":[0,0,0,0,0]},{"categorie":"Status","values":[0,0,0,0,0]}];
    var supp = {"Size":[0,0,0,0,0],"Focus":[0,0,0,0,0],"Research":[0,0,0,0,0],"Age":[0,0,0,0,0],"Status":[0,0,0,0,0]}
    function map_single(kind,attr){
      if(kind=="Status"){
        switch(attr){
          case "A":
            supp["Status"][0]+=1
            return "A"
            
          case "B":
            supp["Status"][1]+=1
            return "B"
           
          case "C":
            supp["Status"][2]+=1
            return "C"
          default:
            supp["Status"][4]+=1
            return "E"
          
        }
      }

      if(attr==="XL"||attr==="FC"||attr=="5"||attr=="5.0"||attr=="VH"){
        supp[kind][0]+=1
        return "A"
      }
      else if(attr==="L"||attr==="CO"||attr=="4"||attr=="4.0"||attr=="HI"){
        supp[kind][1]+=1
        return "B"
      }
      else if(attr==="M"||attr==="FO"||attr=="3"||attr=="3.0"||attr=="MD"){
        supp[kind][2]+=1
        return "C"
      }
      else if(attr==="S"||attr==="SP"||attr=="2"||attr=="2.0"|attr=="LO"){
        supp[kind][3]+=1
        return "D"
      }
      else{
        supp[kind][4]+=1
        return "E"
      }
    }
    var res = new Object();
    
    for(var i=0;i<year_datay.length;i++){
      
        res[year_datay[i].Institution]={"Size":map_single("Size",year_datay[i].Size),"Focus":map_single("Focus",year_datay[i].Focus),"Research":map_single("Research",year_datay[i].Research),"Age":map_single("Age",year_datay[i].Age),"Status":map_single("Status",year_datay[i].Status)}
        
    
    }
    return [res,supp];
  }
  function generate_J(d,dN){
    var r=[];
    var t={},small_t={};
    var arr=[]
    var rates = ["A","B","C","D","E"];
    for(var i=0;i< Object.keys(dN).length;i++){
      t["categorie"]=Object.keys(dN)[i];
      for(var j=0;j<dN["Size"].length;j++){
        small_t["value"]=dN[Object.keys(dN)[i]][j]
        small_t["rate"]=rates[j];
        small_t["class"]=Object.keys(dN)[i];
        arr.push(small_t);
        small_t={}
      }
      t["values"]=arr;
      r.push(t);
      t={};
      arr=[];
    }
    return r;
  }
  //Size, Focus, Reasearch, Age, Status

  var marginBAR = {top: 20, right: 20, bottom: height*0.3, left: 40},
    widthBAR = width*0.7 - marginBAR.left - marginBAR.right,
    heightBAR = container_heigth*0.5 - marginBAR.top - marginBAR.bottom;

var x0 = d3.scaleBand()

    .range([0, widthBAR-20]).round([.1]).paddingInner([0.15])

var x1 = d3.scaleBand();

var y = d3.scaleLinear()
    .range([heightBAR, 0]);

var xAxis = d3.axisBottom(x0)
    
    .tickSize(0)
    
var yAxis = d3.axisLeft(y)
    

var array_google=["#dd4477", "#994499", "#22aa99", "#e67300", "#6633cc",]
var color = d3.scaleOrdinal().range(array_google)
    // .range(["#f22105",
    // "#ff7eac",
    // "#ffdbff",
    // "#aed1ff",
    // "#00cceb"]);



var svgB = d3.select('#data3').append("svg").attr("id","BARsvg")
    .attr("width", widthBAR + marginBAR.left*15 + marginBAR.right)
    .attr("height", heightBAR + marginBAR.top + marginBAR.bottom)
  .append("g")
    .attr("transform", "translate(" + marginBAR.left + "," + 20 + ") scale("+1+")");
  

  var Call=map_usage(year_datax);
  var d_year_numeric=Call[1];var d_year = Call[0];

  var categoriesNames = ["Size", "Focus", "Research", "Age", "Status"]
  var rateNames = ["A","B","C","D","E"];

  x0.domain(categoriesNames);
  x1.domain(rateNames).range([0, x0.bandwidth()]);
  y.domain([0, 1060]);

  svgB.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + heightBAR + ")")
      .call(xAxis);

  svgB.append("g")
      .attr("class", "y axis")
      .style('opacity','1')
      .call(yAxis)
  .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style('font-weight','bold')
      .text("Value");

      function addMaginot(y_coord){
         svgB.append('line').attr("id","lineaMaginot")
         .style("stroke", "#605D63")
         .style("stroke-dasharray", ("10, 5"))
         
         .attr("x1", 0)
         .attr("y1", y_coord)
         .attr("x2",  widthBAR-10 )
         .attr("y2", y_coord);  
         
         
       
         svgB.append('text').style("stroke","black").attr("id","scritta_maginot")
         .attr("transform", "translate("+((widthBAR/2).toFixed(1))+","+(y_coord-15)+")").text("# Universities in ranking = "+Object.keys(d_year).length)
         return y(Object.keys(d_year).length)
       }

      if(magi!=0){ //old one is back
        addMaginot(magi)
        svgB.select('#lineaMaginot').transition().duration(500).delay(600).attr("y1", y(Object.keys(d_year).length)).attr("y2", y(Object.keys(d_year).length));
        svgB.select('#scritta_maginot').transition().duration(500).delay(600).attr("transform", "translate("+((widthBAR/2).toFixed(1))+","+(y(Object.keys(d_year).length)-15)+")")
        
        magi = y(Object.keys(d_year).length);
      }
      
      else{
        magi = addMaginot(y(Object.keys(d_year).length))
   
      }

  //svgB.select('.y').transition().duration(0).delay(0)
  
  var supp_data=generate_J(d_year,d_year_numeric);
  var slice = svgB.selectAll(".slice")
      .data(supp_data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform",function(d) { 
        //console.log("DDDD",d)
        return "translate(" + x0(d.categorie) + ",0)"; });

        var xText,yText,Idx;
  slice.selectAll("rect")
      .data(function(d) { return d.values; })
  .enter().append("rect")
      .attr("width", x1.bandwidth())
      .attr("x", function(d) { return x1(d.rate); })
      .style("fill", function(d) { return color(d.rate) })
      .attr("y", function(d) { return y(0); })
      .attr("height", function(d) { return heightBAR - y(0); })
     .on("mouseover", function(d,h) {
          d3.select(this).style("fill", d3.rgb(color(h.rate)).darker(2));

        
          yText=d3.select(this).attr("y")
          Idx=Object.keys(d_year_numeric).indexOf(h.class);
          svgB.append("text").style("fill",color(h.rate))//.attr("transform", "translate(" + 1.18*(x0.bandwidth()*Idx )+ ","+ -5 + ")").attr("id","robaText").attr("x",x1(h.rate)+Idx*2).attr("y",yText).text(h.value);
          .attr("id","robaText").attr("transform",function(){ return  "translate(" + x0(h.class) + ",-5)" }).attr("x",function(){
           return  x1(h.rate) + 4;
          }).attr("y",d3.select(this).attr("y")).text(h.value);
          d3.selectAll(".cityCircle").filter(function(){
            //console.log("UN FILTER",d3.select(this))
            switch(h.class){
             
              case "Size":
                return d3.select(this).attr("Usize")===h.rate;
                
              case "Age":
                return d3.select(this).attr("Ures")===h.rate;
                
              case "Research":
                return d3.select(this).attr("Uage")===h.rate;
               
              case "Focus":
                return d3.select(this).attr("Ufocus")===h.rate;
                
              case "Status":
                return d3.select(this).attr("Ustatus")===h.rate;
                
              default:
                return false;
            }
            
          })
          .style("fill","white")
          d3.selectAll(".star").filter(function(){
            switch(h.class){
             
              case "Size":
                return d3.select(this).attr("Usize")===h.rate;
                
              case "Age":
                return d3.select(this).attr("Ures")===h.rate;
                
              case "Research":
                return d3.select(this).attr("Uage")===h.rate;
               
              case "Focus":
                return d3.select(this).attr("Ufocus")===h.rate;
                
              case "Status":
                return d3.select(this).attr("Ustatus")===h.rate;
                
              default:
                return false;
            }
            
          })
          .style("fill","white")
      })
      .on("mouseout", function(d,h) {
        
          d3.select(this).style("fill", color(h.rate));
          d3.select("#robaText").remove();
          d3.selectAll(".cityCircle").filter(function(){
            switch(h.class){
             
              case "Size":
                return d3.select(this).attr("Usize")===h.rate;
                
              case "Age":
                return d3.select(this).attr("Ures")===h.rate;
                
              case "Research":
                return d3.select(this).attr("Uage")===h.rate;
               
              case "Focus":
                return d3.select(this).attr("Ufocus")===h.rate;
                
              case "Status":
                return d3.select(this).attr("Ustatus")===h.rate;
                
              default:
                return false;
            }
            
          })
          .style("fill",function(d){return myColorCircle1(d.OverallScore) })
          d3.selectAll(".star").filter(function(){
           
            switch(h.class){
             
              case "Size":
                return d3.select(this).attr("Usize")===h.rate;
                
              case "Age":
                return d3.select(this).attr("Ures")===h.rate;
                
              case "Research":
                return d3.select(this).attr("Uage")===h.rate;
               
              case "Focus":
                return d3.select(this).attr("Ufocus")===h.rate;
                
              case "Status":
                return d3.select(this).attr("Ustatus")===h.rate;
                
              default:
                return false;
            }
            
          })
          .style("fill",function(d){return myColorCircle1(d.OverallScore) })
      });

  slice.selectAll("rect")
      .transition()
      .delay(function (d) {return Math.random()*1000;})
      .duration(1000)
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return heightBAR - y(d.value); });

      
     // categoriesNames=["Size","Focus","Res.","Age","Status"]
      var rowsX = [{"Size":"XL","Focus":"Full Comprehensive","Research":"Very High","Age":"Historic","Status":"A"},{"Size":"L","Focus":"Comprehensive","Research":"High","Age":"Mature","Status":"B"},{"Size":"M","Focus":"Focused","Research":"Medium","Age":"Established","Status":"C"},{"Size":"S","Focus":"Specialist","Research":"Low","Age":"Young","Status":"-"},{"Size":"N/A","Focus":"N/A","Research":"N/A","Age":"New","Status":"N/A"}];
  var legend = svgB.selectAll(".legend")
      .data(supp_data[0].values.map(function(d) { return d.rate; }))
  .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d,i) { return "translate(0," + i * 29 + ")"; })
      .style("opacity","0");

   
     
  legend.append("rect")
      .attr("x", widthBAR - 18)
      .attr("y", 60)
      .attr("width", 22)
      .attr("height", 22)
      .style("fill", function(d) { return color(d); });
 

  legend.transition().duration(100).style("opacity","1");
  
  function tabulate(data, columns) {
    var table = svgB.append('foreignObject').attr("width",500).attr("height",500).attr("id","legendTable").attr("transform", function(d,i) { return "translate("+widthBAR+"," +30 + ")"; }).append("xhtml:table")
    var thead = table.append('thead')
    var	tbody = table.append('tbody');
    var jj=0;
    // append the header row
    thead.append('tr')
      .selectAll('th')
      .data(columns).enter()
      .append('th')
        .text(function (column) { return column; });
  
    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr');
  
    // create a cell in each row for each column
    var cells = rows.selectAll('td')
      .data(function (row) {
        return columns.map(function (column) {
          return {column: column, value: row[column]};
        });
      })
      .enter()
      .append('td')
        .text(function (d) { return d.value; }).style("color",function(h,u){
          if(u==4){return color(jj++)}
          return color(jj)
        });
  
    return table;
  }

  tabulate(rowsX,categoriesNames)

}


function  updateLittleMap(year){
  d3.csv("ProjectVA/pca_csv/pca_year_v2_"+year+".csv").then(function(data) {




    
    myColorCircle1 = d3.scaleLinear().domain([0,d3.max(data, function(d) { return d.OverallScore; })-10])
  .range(sequential_color_divergent_from_blue2)

    var transfomr=svg1.select(".star").attr("transform").split("scale")[1]
    sliderRange.value([0, 100])
    changeMinMax(0,100);

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
.attr("r",5)
.style("fill",function(d){return myColorCircle1(d.OverallScore) })
.attr("transform", function(d) {return "translate(" + projection([d.Longitude,d.Latitude]) + ")"+" scale"+transfomr;})
.attr("id",function(d){return d.Institution})
.attr("class","University cityCircle")
.attr("co",function(d){return myColorCircle1(d.OverallScore) })
.attr("rand",function(d){return Math.random()*15/100*(Math.random() < 0.5 ? -1 : 1)})
.attr("rand2",function(d){return Math.random()*20/100*(Math.random() < 0.5 ? -1 : 1)})
.attr("Usize",function(d){
  return map_singleX(d.Size)
})
.attr("Ures",function(d){
  return map_singleX(d.Research)
})
.attr("Uage",function(d){
  return map_singleX(d.Age)
})
.attr("Ufocus",function(d){
  return map_singleX(d.Focus)
})
.attr("Ustatus",function(d){
  return map_singleX(d.Status)
}).style("stroke",stroke_color)
.style("stroke-width","1px");

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
.style("fill",function(d){return myColorCircle1(d.OverallScore) })
.attr("d",pathData)
.attr("transform", function(d) {return "translate(" + projection([d.Longitude,d.Latitude]) + ")"+" scale"+transfomr;})
.attr("id",function(d){return d.Institution})
.attr("class","University star")
.attr("co",function(d){return myColorCircle1(d.OverallScore) })
.attr("rand",function(d){return Math.random()*15/100*(Math.random() < 0.5 ? -1 : 1)})
.attr("rand2",function(d){return Math.random()*20/100*(Math.random() < 0.5 ? -1 : 1)})
.attr("Usize",function(d){
  return map_singleX(d.Size)
})
.attr("Ures",function(d){
  return map_singleX(d.Research)
})
.attr("Uage",function(d){
  return map_singleX(d.Age)
})
.attr("Ufocus",function(d){
  return map_singleX(d.Focus)
})
.attr("Ustatus",function(d){
  return map_singleX(d.Status)
}).style("stroke",stroke_color)
.style("stroke-width","1px");

for(var i=0; i<selected.length ; i++){
  d3.select("circle[id='"+selected[i].Institution+"']").style("fill","red")
  d3.select("path[id='"+selected[i].Institution+"']").style("fill","red")

}



var color= d3.rollup(data, v =>{return v.length }, d => d.Country)

g.selectAll('.country')
.style("fill",function(d){
  var cou_name=d.properties.name;
if(cou_name=="Korea"){ //COUNTRIES WITH DIFFERENT NAMES HERE 
  cou_name="South Korea"
}
if(color.get(cou_name) == undefined) return palette_sequential_map[3]; 
  return colores_range2(color.get(cou_name),0,50)
})
createBarGraph(data)

})


}



var allGroup2 = ["2016", "2018", "2019", "2020"].reverse()

// Initialize the button
var dropdownButton2 = d3.select("#selectmapyea")
  .append('select').attr("id","selectmapyea2").attr('class','justify-content-center form-select text-center btn-outline-primary')

// add the options to the button
dropdownButton2 // Add a button
  .selectAll('myOptions') 
   .data(allGroup2)
  .enter()
  .append('option')
  .style("background-color","white")
  .style("color","#0d6efd")
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button

  dropdownButton2.on("change", function(d) {

    // recover the option that has been chosen
   var year =d3.select(this).property("value")

     updateLittleMap(year)


  
  })



  
  var show_selected= true;

  $(document).keydown(function(e){
    if (e.keyCode==90 && e.ctrlKey){
        var circle=svg1.selectAll(".University")
        if(show_selected){
        circle.filter((d,i)=>{ return RGBToHex(circle._groups[0][i].style.fill)!=palette_divergent_map[0];}).transition().duration(1000).style("opacity",0)
        .on("end",(d,i)=> {

          if( RGBToHex(circle._groups[0][i].style.fill)!=palette_divergent_map[0]){
            circle._groups[0][i].style.display="none"
          }
        })
//.style("display",function(){return "none"})
        }else{
          circle.transition().duration(1000).style("opacity",1).style("display",function(){return "block"})
        }
        show_selected=!show_selected
      }
    });


    svg1.append("text").attr("x","1%").attr("y","98%").text("press CTRL-Z to highlight the selected universities")