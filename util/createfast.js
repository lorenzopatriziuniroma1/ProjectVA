function create_legend(svg){



    var legend = svg  .append('svg')
    .attr("width",170)
    .attr("height",90)  
    .attr("transform", "translate(" + (width-width*0.1)  + "," + (height-height*0.4 ) + ")")
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
    legend.append("text").attr("x",0+20).attr("y", 10).text("High #University").style("font-size", "15px").attr("alignment-baseline","middle")
 
    legend.append("rect")
    .attr("x",0).attr("y",10+20-10)    
    .attr("width", size)
    .attr("height", size)
    .style("fill", palette_sequential_map[1])
    legend.append("text").attr("x", 0+20).attr("y", 10+20).text("Middle #University").style("font-size", "15px").attr("alignment-baseline","middle")
    
    legend.append("rect")
    .attr("x",0).attr("y",10-10+40)    
    .attr("width", size)
    .attr("height", size)
    .style("fill", palette_sequential_map[2])
    legend.append("text").attr("x", 0+20).attr("y", 10+40).text("Low #University").style("font-size", "15px").attr("alignment-baseline","middle")
   
    legend.append("rect")
    .attr("x",0).attr("y",10-10+60)    
    .attr("width", size)
    .attr("height", size)
    .style("fill", palette_sequential_map[3])
    legend.append("text").attr("x", 0+20).attr("y", 10+60).text("0 Univesity").style("font-size", "15px").attr("alignment-baseline","middle")
       }
       