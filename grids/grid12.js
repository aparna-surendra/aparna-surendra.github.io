//Code indebted to: https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739
function gridData5() {
	var data = new Array();
	var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
	var ypos = 1;
	var width = 50;
	var height = 50;
	var click = 0;
	// iterate for rows	
	for (var row = 0; row < 4; row++) {
		data.push( new Array() );
		// iterate for cells/columns inside rows
		for (var column = 0; column < 4; column++) {
		if ((column == row)){
			data[row].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				click: click,
				text: "#3090C7",
				row: row,
				column: column
			})}
		else if ((column == 3) & (row == 0)) {
			data[row].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				click: click,
				text: "#3090C7",
				row: row,
				column: column
			})}
		else {
			data[row].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				click: click,
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
function build_grid5(gridData, grid){
var blue_counter = 3;
var yellow_counter = 1; 
var total_counter = blue_counter - yellow_counter; 
var x_start = 101; 
var y_start = 1; 
var total_clicks = 0;

console.log(gridData);

var row = grid.selectAll(".row")
	.data(gridData)
	.enter().append("g")
	.attr("class", "row");

grid.append("text")
			.attr("class", "text_remove")
	    	.attr("x", 215)
	    	.attr("y", 100)
	    	.text(function(d,i){return  "BLUE COUNTER [+1]: " + blue_counter;})

grid.append("text")
			.attr("class", "text_remove")
	    	.attr("x", 215)
	    	.attr("y", 112)
	    	.text(function(d,i){return  "ORANGE COUNTER [-1]: " + yellow_counter;})

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
	//.attr("class", function(d){
    //	if ((d.row == 0) & (d.column ==2)){
   // 	color(d3.select(this).attr("class", "selected1").transition(), "#686868")
   // 	return "selected1"}
   // 	else {return "active"}
  //  })
	.attr("font-family", "sans-serif")
    .attr("font-size", "20px")
	.style("stroke", "#222")
	.style("fill", function (d){
		if (d.row== d.column & d.row != 0){
			return d.text
		}
		if (d.row == 0 & d.column ==2 ){
			return d.text
		}
		else {return "#D3D3D3"}})
	.on("mouseover", function(d) {   
        d3.select(this).style("opacity", .6)  
        })                  
    .on("mouseout", function(d) {       
        d3.select(this).style("opacity", 1);   
    });

		
for (var square = 0; square < 16; square++) {
	grid.append("text")
		.text(square)
		.attr("x",  ((square%4 * 50)+ 20))
		.attr("y",Math.floor(square/4)*50 +30)
		.style("font-color","red")
		.style("font-weight", "bold")

}
}

var grid5 = d3.select("#grid5")
	.append("svg")
	.attr("width","500px")
	.attr("height","220px");

grid5.append("text")
	.text("Policy #2: State 2 -> 5 -> 10 -> 15")
	.attr("x", 0)
	.attr("y", 215)
	.style("font-weight", "bold")
	.style("font-size", "12px")


var gridData5 = gridData5();	
build_grid5(gridData5, grid5);

