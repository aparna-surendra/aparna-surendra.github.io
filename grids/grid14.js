//Code indebted to: https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739
function gridData3() {
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
				column: column,
				square_n: (row*4 + column)

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
				column: column,
				square_n: (row*4 + column)

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
				column: column,
				square_n: (row*4 + column)

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
function build_grid3(gridData, grid, table){
var blue_counter = 0;
var yellow_counter = 1; 
var total_counter = blue_counter - yellow_counter; 
var x_start = 101; 
var y_start = 1; 
var total_clicks = 0;
var state_list =[];
var cumulative_disc_reward = 0; 

console.log(gridData);
console.log(discount_factor);
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
		    .attr("y", 125)
		    .text(function(d,i){return  "CUMULATIVE REWARD: " + total_counter;})
		    .style("font-weight", "bold")

var thead = table.append('thead'); 
var tbody = table.append('tbody');

var table_columns = ["time_step", "original_state", "new_state", "reward", "discount_value", "discounted_reward"];
var prev_state = "off-grid"

thead.append('tr')
	 .selectAll('th')
	 .data(table_columns)
	 .enter()
	 .append('th')
	 .text(function(table_columns) { return table_columns; });

var column = row.selectAll(".square")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class","square")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
	.attr("class", "active")
    .attr("class", function(d){
    	if ((d.row == 0) & (d.column ==2)){
    	color(d3.select(this).attr("class", "selected").transition(), "#686868")
    	return "selected"}
    	else {return "active"}
    })
	.attr("font-family", "sans-serif")
    .attr("font-size", "20px")
	.style("stroke", "#222")
	.style("fill","#D3D3D3" )
	.on("mouseover", function(d) {   
        d3.select(this).style("opacity", .6)  
        })                  
    .on("mouseout", function(d) {       
        d3.select(this).style("opacity", 1);   
    })
    .on('click', function(d) {
       d.click ++;
       if (((d.x) >= x_start-50 & d.x <=x_start+50) & ((d.y) >= y_start-50 & (d.y) <= y_start+50)){
	       //if ((d.text) == "#3090C7") { d3.select(this).style("fill",d.text); if ((d.activate)== 0) {blue_counter ++;}}
	       if ((d.text) == "#3090C7") { d3.select(this).style("fill",d.text); if (d3.select(this).classed("active")) {blue_counter ++;}}
		   if ((d.text) == "orange") {d3.select(this).style("fill","orange"); if (d3.select(this).classed("active")) {yellow_counter ++;}}
		   d3.select(this).classed("active", false)
		   d3.selectAll(".selected").style("fill", function(d) {return d.text;})
		   d3.selectAll(".selected").classed("selected", false)
           //d3.select(this).attr("class", "selected").style("fill", "#606060");
          color(d3.select(this).attr("class", "selected").transition(400), "#686868")
		   x_start = d.x;
		   y_start = d.y;
		   var prev_counter = total_counter; 
		   total_counter = blue_counter - yellow_counter;
		   console.log(discount_factor)
		   console.log(total_clicks)
		   var discount_value = Math.pow(discount_factor, total_clicks);
		   var time_string = total_clicks.toString();
		   console.log(time_string)
		   cumulative_disc_reward = cumulative_disc_reward + discount_value*(total_counter - prev_counter)
		   state_list.push({time_step: total_clicks, original_state: prev_state, new_state: d.square_n, reward: total_counter - prev_counter, discount_value: "\u03B3" +"^"+ time_string+" = "+discount_value, discounted_reward: discount_value*(total_counter - prev_counter) });
		   prev_state = d.square_n;
		   total_clicks ++; 
		   grid.selectAll(".text_remove").remove()
		   grid.append("text")
		   		.attr("class", "text_remove")
		    	.attr("x", 215)
		    	.attr("y",100)
		    	.text(function(d,i){return  "BLUE COUNTER: " + blue_counter;})
	       grid.append("text")
	       		.attr("class", "text_remove")
		    	.attr("x", 215)
		    	.attr("y", 112)
		    	.text(function(d,i){return  "ORANGE COUNTER: " + yellow_counter;})
	       grid.append("text")
	  			.attr("class", "text_remove")
		    	.attr("x", 215)
		    	.attr("y", 125)
		    	.text(function(d,i){return  "CUMULATIVE REWARD: " + total_counter;})
		    	.style("font-weight", "bold")
	
	  	   grid.append("text")
	  			.attr("class", "text_remove")
		    	.attr("x", 215)
		    	.attr("y", 137)
		    	.text(function(d,i){return  "CUMULATIVE DISCOUNTED REWARD: " + cumulative_disc_reward;})
		    	.style("font-weight", "bold")

            var table_rows = tbody.selectAll("tr")
								   .data(state_list).enter()
								   .append('tr')

		    var table_cells = table_rows.selectAll("td")
				        			.data(function(row) {
				            		return table_columns.map(function(column) {
				                	return {column: column, value: row[column]};
				            			});
				        			})
							        .enter()
							        .append("td")
							        .text(function(d) { return d.value; });
	  
	 }
}
 
    )		    
    ;

		
for (var square = 0; square < 16; square++) {
	grid.append("text")
		.text(square)
		.attr("x",  ((square%4 * 50)+ 20))
		.attr("y",Math.floor(square/4)*50 +30)
		.style("font-color","red")
		.style("font-weight", "bold")

}
}


var discount_factor = 0.5; 

var grid3 = d3.select("#grid3")
	.append("svg")
	.attr("width","600px")
	.attr("height","205px");

grid3.append("circle")
	.attr("cx", 270)
	.attr("cy", 165)
	.attr("r", 7)
	.attr("fill", "#D2B48C")
	.attr("font-color", "white")
	.attr("stroke", "black")
	.on('click', function(){
		//grid3.selectAll(".row").data()
		grid3.selectAll(".row").remove();
		grid3.selectAll(".text_remove").remove();
		table.selectAll("tr").remove();
		build_grid3(gridData3, grid3, table);
	})

var table = d3.selectAll("#table").append("table").attr("x", 100).attr("y", 10)

grid3.append("text")
	.text("RESET")
	.attr("x", 215 )
	.attr("y", 170)
	.style("font-size", "12px")
	.style("font-weight", "bold")

d3.select("#nRadius").on("input", function() {
  d3.select("#nRadius-value").text(this.value);
  d3.select(this).property("value", this.value);
  discount_factor = +this.value;
  grid3.selectAll(".row").remove();
  grid3.selectAll(".text_remove").remove();
  table.selectAll("tr").remove();
  build_grid3(gridData3, grid3, table);
});

var gridData3 = gridData3();	
build_grid3(gridData3, grid3, table);

