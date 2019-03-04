//Code indebted to: https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739
function gridData() {
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
		if (column == row){
			data[row].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				click: click,
				activate:0,
				text: "blue",
				square_n: (row+1)*2 + (column+1),
				value_n: 0
			})}
		if (column != row){
			data[row].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				click: click,
				activate:0,
				text: "orange",
				square_n: (row+1)*2 + (column+1),
				value_n: 0
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
var blue_counter = 4;
var yellow_counter = 0; 
var total_counter = blue_counter + yellow_counter; 
var x_start = -49; 
var y_start = -49; 

console.log(gridData);

var row = grid.selectAll(".row")
	.data(gridData)
	.enter().append("g")
	.attr("class", "row");


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
	.style("stroke", "#222")
	.style("fill","#D3D3D3" )
	.style("fill", "#D3D3D3")
	.on("mouseover", function(d) {   
        d3.select(this).style("opacity", .6)  
        })                  
    .on("mouseout", function(d) {       
        d3.select(this).style("opacity", 1);   
    });
for (var square = 0; square < 16; square++) {
	grid.append("text")
		.text(function (d) { if(square == 0| square == 5) {return "1" } if(square == 10) {return "3.25" }  if(square == 1|square == 9|square == 14) {return "- 0.5" } if (square == 15) {return "-47.5"} else {return "0"}})
		.attr("x",  ((square%4 * 50)+ 20))
		.attr("y",Math.floor(square/4)*50 +30)
		.style("font-color","red")
		.style("font-weight", "bold")

}
}

var grid4 = d3.select("#grid14")
	.append("svg")
	.attr("width","500px")
	.attr("height","220px");

grid4.append("text")
	.text("After 2 training episodes (r_s15 = -100)")
	.attr("x", 5)
	.attr("y", 215)
	.style("font-weight", "bold")
	.style("font-size", "12px")


var gridData = gridData();	
build_grid(gridData, grid4);

