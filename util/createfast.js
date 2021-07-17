function create_legend(svg ,w,h){
console.log(w)
if(w == undefined){
  w=container_width
}
if(h == undefined){
h=height
}

    var legend = svg  .append('svg')
    .attr("width",200)
    .attr("height",90)  
    .attr("id","leggendinapiccolina")
    .attr("transform", "translate(" + w*0.8 + "," +(h-90-20) + ")")
   ;
 
   legend.append("rect")
   .attr("x",5)
   .attr("y",5)
     .attr("width", "90%")
     .attr("height", "90%")
     .attr("fill", "white")
     .style("stroke","black")
     .style("stroke-width","3px")
     .style( "stroke-linecap","round")
     .style("opacity","0.8")
     .attr("rx", 5)
     .attr("ry", 5);
   
   legend=legend.append("g")
   .attr("transform", "translate(" + 10 + "," + 10+ ")")
   size=13;
    // Handmade legend
    legend.append("rect")
    .attr("x",0).attr("y",10-10)    
    .attr("width", size)
    .attr("height", size)
    .style("fill", palette_sequential_map[0])
    legend.append("text").attr("x",0+20).attr("y", 10).text(parseInt(2*50/3)+"<#Universities").style("font-size", "15px").attr("alignment-baseline","middle")
 
    legend.append("rect")
    .attr("x",0).attr("y",10+20-10)    
    .attr("width", size)
    .attr("height", size)
    .style("fill", palette_sequential_map[1])
    legend.append("text").attr("x", 0+20).attr("y", 10+20).text(+parseInt(50/3) +"< #Universities <"+parseInt(2*50/3)).style("font-size", "15px").attr("alignment-baseline","middle")
    
    legend.append("rect")
    .attr("x",0).attr("y",10-10+40)    
    .attr("width", size)
    .attr("height", size)
    .style("fill", palette_sequential_map[2])
    legend.append("text").attr("x", 0+20).attr("y", 10+40).text(" #Universities<"+parseInt(50/3)).style("font-size", "15px").attr("alignment-baseline","middle")
   
    legend.append("rect")
    .attr("x",0).attr("y",10-10+60)    
    .attr("width", size)
    .attr("height", size)
    .style("fill", palette_sequential_map[3])
    legend.append("text").attr("x", 0+20).attr("y", 10+60).text("0 Univesity").style("font-size", "15px").attr("alignment-baseline","middle")
       }



       function create_legen_pca(svg ,w,h){

        if(w == undefined){
          w=container_width
        }
        if(h == undefined){
        h=container_heigth
        }
        
            var legend = svg  .append('svg')
            .attr("width",210)
            .attr("height",75)  
            .attr("id","leggendinapiccolina2")
            .attr("transform", "translate(" + w*0.275 + "," +(0) + ")");
         
           legend.append("rect")
           .attr("x",5)
           .attr("y",5)
             .attr("width", "90%")
             .attr("height", "90%")
             .attr("fill", "white")
             .style("stroke","black")
             .style("stroke-width","3px")
             .style( "stroke-linecap","round")
             .style("opacity","0.8")
             .attr("rx", 5)
             .attr("ry", 5);
           
           legend=legend.append("g")
           .attr("transform", "translate(" + 10 + "," + 10+ ")")
           size=13;
            // Handmade legend
            legend.append("circle")
            .attr("cx",0+5).attr("cy",+5)    
            .attr("r",5)
            .style("fill", sequential_color_divergent_from_blue[0])
            legend.append("text").attr("x",0+20).attr("y", 10).text(parseInt(2*1024/3)+"< Rank").style("font-size", "15px").attr("alignment-baseline","middle")
         
            legend.append("circle")
            .attr("cx",0+5).attr("cy",10+20-10+5)    
            .attr("r",5)
            .style("fill", sequential_color_divergent_from_blue[1])
            legend.append("text").attr("x", 0+20).attr("y", 10+20).text(+parseInt(1024/3) +"< Rank <"+parseInt(2*1024/3)).style("font-size", "15px").attr("alignment-baseline","middle")
            
            legend.append("circle")
            .attr("cx",0+5).attr("cy",10-10+40+5)    
            .attr("r",5)
            .style("fill", sequential_color_divergent_from_blue[2])
            legend.append("text").attr("x", 0+20).attr("y", 10+40).text("Rank<"+parseInt(1024/3)).style("font-size", "15px").attr("alignment-baseline","middle")
          
               }
        
        
function createHorizontalLegend(ghgh,kk,classDefined){

  ghgh.append("g")
  .attr("class", "legendLinear")
  .attr("id",classDefined)
  .attr("transform", "translate(20,20)");

var legendLinear = d3.legendColor()
  .shapeWidth(50)
  .orient('horizontal')
  .title("Overall Score")
  .titleWidth(100)

  .scale(kk);

  ghgh.select("#"+classDefined).append("rect")
  .attr("x",-5)
  .attr("y",-17)
    .attr("width", 270+"px")
    .attr("height",  75+"px")
    .attr("fill", "white")
    .style("stroke","black")
    .style("stroke-width","3px")
    .style( "stroke-linecap","round")
    .style("opacity","0.8")
    .attr("rx", 5)
    .attr("ry", 5);


  ghgh.select("#"+classDefined).call(legendLinear);



}
       



function RGBToHex(rgb) {
  // Choose correct separator
  let sep = rgb.indexOf(",") > -1 ? "," : " ";
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.substr(4).split(")")[0].split(sep);

  let r = (+rgb[0]).toString(16),
      g = (+rgb[1]).toString(16),
      b = (+rgb[2]).toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}