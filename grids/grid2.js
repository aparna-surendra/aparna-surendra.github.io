//Code indebted to: https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739
function gridData() {
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
				row: row,
				column: column
			})}
		if (column > 8){
			data[row].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				click: click,
				activate:0,
				text: "orange",
				row: row,
				column: column
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

function build_grid(gridData, grid){
var blue_counter = 1;
var yellow_counter = 0; 
var x_start = 1; 
var y_start = 1; 
var total_counter = blue_counter + yellow_counter; 

console.log(gridData);

var row = grid.selectAll(".row")
	.data(gridData)
	.enter().append("g")
	.attr("class", "row");

grid.append("text")
			.attr("class", "text_remove")
	    	.attr("x", 215)
	    	.attr("y", 100)
	    	.text(function(d,i){return  "BLUE COUNTER: " + blue_counter;})

grid.append("text")
			.attr("class", "text_remove")
	    	.attr("x", 215)
	    	.attr("y", 112)
	    	.text(function(d,i){return  "ORANGE COUNTER: " + yellow_counter;})

grid.append("text")
	  			.attr("class", "text_remove")
		    	.attr("x", 215)
		    	.attr("y", 130)
		    	.text(function(d,i){return  "TOTAL POINTS: " + total_counter;})
		    	.style("font-weight", "bold")
		    	.style("font-size", "12px")
		    	.style("fill", function (d) {if (total_counter >=0) {return "blue"} else {return "red"}});

var column = row.selectAll(".square")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class","square")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
	.style("fill", "#D3D3D3")
	.attr("class", "active")
	.attr("class", function(d){
    	if ((d.row == 0) & (d.column ==0)){
    	color(d3.select(this).attr("class", "selected").transition(), "#686868"); return "selected"}
    	else {return "active"}
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
       console.log(d.x)
       console.log(d.y)
       if (((d.x) >= x_start-10 & d.x <=x_start+10) & ((d.y) >= y_start-10 & (d.y) <= y_start+10)){
	       //if ((d.click)%2 == 0) { d3.select(this).style("fill", "white");}
	       	// text(function (d) { return d.name; }).style("font-color","#2C93E8"); }
		   if ((d.text) ==  "#3090C7") { d3.select(this).style("fill",d.text); if (d3.select(this).classed("active")) {blue_counter ++;}}
		   if ((d.text) == "orange") {d3.select(this).style("fill","orange"); if (d3.select(this).classed("active")) {yellow_counter ++;}}
		   d3.select(this).classed("active", false)
		   d3.selectAll(".selected").style("fill", function(d) {return d.text;})
		   d3.selectAll(".selected").classed("selected", false)
           color(d3.select(this).attr("class", "selected").transition(), "#686868")
		   x_start = d.x;
		   y_start = d.y;
		   total_counter = blue_counter - yellow_counter;	
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

	   //if ((d.click)%4 == 2 ) { d3.select(this).style("fill","#F56C4E"); }
	   //if ((d.click)%4 == 3 ) { d3.select(this).style("fill","#838690"); }
    }}
 
    );
}
var grid = d3.select("#grid")
	.append("svg")
	.attr("width","500px")
	.attr("height","220px");


grid.append("circle")
	.attr("cx", 265)
	.attr("cy", 150)
	.attr("r", 7)
	.attr("fill", "#D2B48C")
	.attr("font-color", "white")
	.attr("stroke", "black")
	.on('click', function(){
		grid.selectAll(".row").remove();
		grid.selectAll(".text_remove").remove()
		build_grid(gridData, grid);
	})

grid.append("text")
	.text("RESET")
	.attr("x", 215)
	.attr("y", 155)
	.style("font-weight", "bold")


var gridData = gridData();	
build_grid(gridData, grid);

