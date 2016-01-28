var tile = function() {
    var t = {
	x: 10,
	y: 25,
	size: 30,
	n: 8,
	// M 10 25 C 20 45 20 55 10 65 L 50 65 C 50 30 50 30 10 25
	create_path: function(x,y,size){
	    d = "M " + x + " " + y + " " +
		"C " + (x+size/3) + " " + (y+2*size/3) + " " +
		      (x+size/3) + " " + (y+size-size/3)  + " " +
	       	x + " " + (y+size) + " " + 
	    "L " + (x + size) + " " + (y+size) + " " +
		"C " + (x+size) + " " + (y + size/10) + " " +
		       (x+size) + " " + (y + size/10) + " " +
		x + " " + y;
	    return d;
	},
	create_grid_path: function(x,y,size){
	    d = "M " + x + " " + y + "  " + 
	    "L "  + x + " " + (y+size) + " " +
	    "L "  + (x +size) + " " + (y+size) + " " +
		"L " +(x+size) + " " + y + " " +
		"L " + x + " " +  y;
	    return d;
	},
	rotate_tile: function(row,col){
	    pos = 3;
	    d3.select('#t'+row + col).transition()
		.duration(1500)
		.attr("transform", "rotate(45,100,155)");
	},
	draw_tile: function(row,col,pos,color){
	    var rotation = 45;
	    k = d3.select("#tiles").append("path")
		.attr("d",t.create_path(t.x + row * t.size  ,
					t.y + col * t.size ,t.size))
		.attr("stroke",color)
		.attr("fill",color)
		.attr("stroke-width",1)
	        .attr("id","t" + row + col)
		.attr("transform", "rotate(" + (pos*45) +"," +
		      (t.x + row * t.size + t.size/2) + "," +
		      (t.y + col * t.size + t.size/2) + ")" )
		.on("mousedown", function(){
		    d3.select(this)
			.attr("transform", "rotate("+ (rotation+=45) +","+ (t.x +row*t.size+t.size/2) + ","+ (t.y + col*t.size+t.size/2) +")")});
	    return k;  
	    
	},
	draw_grid: function(){

	    for(var i=0; i < 8; i++){
		for(var k=0; k < 8; k++){
		d3.select("#tiles").append("path")
			.attr("d",t.create_grid_path(i*t.size+t.x,t.y+k*t.size,t.size))
		    .attr("stroke","black")
		    .attr("fill","lightgrey")
		    .attr("stroke-width",1);
		}
	    }
	    
	}
    };
    return t;
}();

$( function(){ tile.draw_grid();
	       tile.draw_tile(5,6,1,"black");
	       tile.draw_tile(3,4,0,"red");
	       tile.draw_tile(5,7,2,"green");
	       tile.draw_tile(3,3,3,"green");
	     } );
