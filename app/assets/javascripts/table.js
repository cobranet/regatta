function create_table(n,size){
    g = [];
    for (var i = 0; i < n ; i++){
	g[i] = [];
	for (var k = 0; k < n; k++){
	    g[i][k] = null;
	}
    };
    g.draw_grid = function(){
	    for(var i=0; i < 8; i++){
		for(var k=0; k < 8; k++){
		d3.select("#tiles").append("path")
			.attr("d",this.create_grid_path(i*size,k*size,size))
		    .attr("stroke","black")
		    .attr("fill","lightgrey")
		    .attr("stroke-width",1);
		}
	    }
    };
    g.create_grid_path = function(x,y,size){
	    d = "M " + x + " " + y + "  " + 
	    "L "  + x + " " + (y+size) + " " +
	    "L "  + (x +size) + " " + (y+size) + " " +
		"L " +(x+size) + " " + y + " " +
		"L " + x + " " +  y;
	    return d;
    };
    return g;
}
