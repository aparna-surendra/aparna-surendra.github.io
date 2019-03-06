//Code indebted to: https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739
function gridData2() {
	var data = new Array();
	var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
	var ypos = 1;
	var width = 10;
	var height = 10;
	var click = 0;
	// iterate for rows	
	for (var row = 0; row < 20; row++) {
		data.push( new Array() );
		// iterate for cells/columns inside rows
		for (var column = 0; column < 20; column++) {
		if (column <= 8){
			data[row].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				click: click,
				activate:0,
				text: "#3090C7",
				column: column,
				row: row
			})}
		else if ((row > 4) & (row < 17) & (column < 16) & (column > 10)){
			data[row].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				click: click,
				activate:0,
				text: "blue",
				column: column,
				row: row
			})}
		else {
			data[row].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				click: click,
				activate:0,
				text: "orange",
				column: column,
				row: row
			})}
		;
			// increment the x position. I.e. move it over by 50 (width variable)
			xpos += width;
		}
		// reset the x position after a row is complete
		xpos = 1;
		// increment the y position for the next row. Move it down 50 (height variable)
		ypos += height;	
	}
	return data;
}

function color(transition, fill) {
  transition
      .style("fill", fill)
}

function build_grid2(gridData, grid){
var blue_counter = 180;
var yellow_counter = 120; 
var x_start = 91; 
var y_start = 11; 
var total_counter = blue_counter - yellow_counter;	
var total_moves = blue_counter + yellow_counter;	

console.log(gridData);

var row = grid.selectAll(".row")
	.data(gridData)
	.enter().append("g")
	.attr("class", "row");

grid.append("text")
			.attr("class", "text_remove")
	    	.attr("x", 215)
	    	.attr("y", 100)
	    	.text(function(d,i){return  "BLUE [+1] COUNTER: " + blue_counter;})

grid.append("text")
			.attr("class", "text_remove")
	    	.attr("x", 215)
	    	.attr("y", 112)
	    	.text(function(d,i){return  "ORANGE [-1] COUNTER: " + yellow_counter;})

 grid.append("text")
	  		.attr("class", "text_remove")
		    .attr("x", 215)
		    .attr("y", 130)
		    .text(function(d,i){return  "TOTAL POINTS: " + total_counter;})
		    .style("font-weight", "bold")
			.style("font-size", "12px")
		    .style("fill", function (d) {if (total_counter >=0) {return "blue"} else {return "red"}});


grid.append("text")
	  			.attr("class", "text_remove")
		    	.attr("x", 215)
		    	.attr("y", 145)
		    	.text(function(d,i){return  "TOTAL MOVES: " + total_moves;})
		    	.style("font-weight", "bold")
		    	.style("font-size", "12px")
		    	.style("fill", "black");

var column = row.selectAll(".square")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class","square")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
	.attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("font-color", "red")
    .attr("fill", "red")
   // .attr("class", function(d){
   // 	if ((d.row == 1) & (d.column ==9)){
   // 	color(d3.select(this).attr("class", "selected1").transition(), "#686868")
   // 	return "selected1"}
  //  })
	//.style("fill", "#D3D3D3")
	.style("fill", function (d){
		if ((d.row) <= 2 | d.column <= 10 | d.column >16 | (d.row == 3 & d.column <=12)) {
			d.activate ++
			return d.text
		} 
		else {
			return "#D3D3D3"
		}
	})
	.style("stroke", "#222")
	.on("mouseover", function(d) {   
        d3.select(this).style("opacity", .6)  
        })                  
    .on("mouseout", function(d) {       
        d3.select(this).style("opacity", 1);   
    })
	.on('click', function(d) {
       d.click ++;
       if (((d.x) >= x_start-10 & d.x <=x_start+10) & ((d.y) >= y_start-10 & (d.y) <= y_start+10) & total_moves <300){
	       //if ((d.click)%2 == 0) { d3.select(this).style("fill", "white");}
	       	// text(function (d) { return d.name; }).style("font-color","#2C93E8"); }
		   if ((d.text) == "#3090C7") { d3.select(this).style("fill",d.text); if ((d.activate)== 0) {blue_counter ++;}}
		   if ((d.text) == "orange") {d3.select(this).style("fill","orange"); if ((d.activate)== 0) {yellow_counter ++;}}
		   if (d.activate == 0){d.activate ++;}
		  // d3.selectAll(".selected1").style("fill", function(d) {return d.text;})
		  // d3.selectAll(".selected1").classed("selected1", false)
          // color(d3.select(this).attr("class", "selected1").transition(), "#686868")
		   x_start = d.x;
		   y_start = d.y;
		   total_counter = blue_counter - yellow_counter;	
		   total_moves = blue_counter + yellow_counter; 
		   grid.selectAll(".text_remove").remove()
		   grid.append("text")
		   		.attr("class", "text_remove")
		    	.attr("x", 215)
		    	.attr("y",100)
		    	.text(function(d,i){return  "BLUE [+1] COUNTER: " + blue_counter;})
	       grid.append("text")
	       		.attr("class", "text_remove")
		    	.attr("x", 215)
		    	.attr("y", 112)
		    	.text(function(d,i){return  "ORANGE [-1] COUNTER: " + yellow_counter;})
	       grid.append("text")
	  			.attr("class", "text_remove")
		    	.attr("x", 215)
		    	.attr("y", 130)
		    	.text(function(d,i){return  "TOTAL POINTS: " + total_counter;})
		    	.style("font-weight", "bold")
		    	.style("font-size", "12px")
		    	.style("fill", function (d) {if (total_counter >=0) {return "blue"} else {return "red"}});
		   grid.append("text")
	  			.attr("class", "text_remove")
		    	.attr("x", 215)
		    	.attr("y", 142)
		    	.text(function(d,i){return  "TOTAL MOVES: " + total_moves;})
		    	.style("font-weight", "bold")
		    	.style("font-size", "12px")
		    	.style("fill", "black");

	   //if ((d.click)%4 == 2 ) { d3.select(this).style("fill","#F56C4E"); }
	   //if ((d.click)%4 == 3 ) { d3.select(this).style("fill","#838690"); }
    }}
 
    );


}
var grid2 = d3.select("#grid2")
	.append("svg")
	.attr("width","500px")
	.attr("height","220px");

grid2.append("text")
	.text("Game 1")
	.attr("x", 80)
	.attr("y", 215)
	.style("font-weight", "bold")

//grid2.append("circle")
//	.attr("cx", 265)
//	.attr("cy", 170)
//	.attr("r", 7)
//	.attr("fill", "#D2B48C")
//	.attr("font-color", "white")
//	.attr("stroke", "black")
//	.on('click', function(){
//		grid2.selectAll(".row").remove();
//		grid2.selectAll(".text_remove").remove()
//		build_grid2(gridData2, grid2);
//	})

//grid2.append("text")
//	.text("RESET")
//	.attr("x", 215)
//	.attr("y", 175)
//	.style("font-weight", "bold")
//	.style("font-size", "12px")


var gridData2 = gridData2();	
build_grid2(gridData2, grid2);

