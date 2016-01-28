var game = function(){
    t = {
	is_place_possible: function(table,row,col,pos){
	    return 0;  
	}
    }
    
    return t;
}();
var tile = function() {
    var arr = []
    arr[0] = [0,0,0,0]; 
    arr[1] = [1,0,1,1];
    arr[2] = [];
    arr[3] = [1,1,0,1];
    arr[4] = [];
    arr[5] = [1,1,1,0];
    arr[6] = [];
    arr[7] = [0,1,1,1];

    var t = {
	x: 10,
	y: 25,
	size: 30,
	n: 8,
	table: [],
	colors: ["green","red"],
	create_table: function(){
	    for (var i = 0; i < t.n ; i++){
		t.table[i] = [];
		for (var k = 0; k < t.n; k++){
		    t.table[i][k] = {what:0,pos:-1,smer: 1};
		}
	    }
	},
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
	// smer 1  clockwise .. -1 anticlock wise
	rotate_pos: function(pos,smer){
	    p = pos + smer;
	    if (p>7) {
		return 0;
	    }
	    if (p < 0){
		return 7;
	    }
	    return p;
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
	// returning blocking tiles as array of 0,1 in following order (North, East, South , West ) or ( row -1 , col + 1, row + 1, col -1 )
	position_penetrating: function(pos) {
	    return arr[pos];
	},
	check_placement: function(row,col,pos){
   	    alert(t.table[row][col].what);
	    a = t.position_penetrating(pos);
	    
	    if ( row == 0 && a[0] == 1) return false;
	    if ( row == t.n-1 && a[2] == 1) return false;
	    if ( col == 0 && a[3] == 1) return false;
	    if ( col == t.n-1 && a[1] == 1) return false;
	    
	    if ( row != 0 && t.table[row-1][col].what != 0 ){
		b = t.position_penetrating(t.table[row-1][col]);
		if ( b[2] == 1 || a[0] == 1) return false;
	    }
	    
	    if (row != t.n-1 && t.table[row+1][col].what != 0 ){
		b = t.position_penetrating(t.table[row+1][col]);
		if ( b[0] == 1 || a[2] == 1) return false;
	    }

	    if (col != 0 && t.table[row][col-1].what != 0 ){

		b = t.position_penetrating(t.table[row][col-1]);
		if ( b[1] == 1 || a[3] == 1) return false;
	    }
	    if (col != t.n-1 && t.table[row][col+1].what != 0 ){
		b = t.position_penetrating(t.table[row][col+1]);
		if ( b[3] == 1 || a[1] == 1) return false;
	    }
	    return true;
	},
	draw_tile: function(row,col,pos,c){

	    t.table[row][col] = {what: c+1,pos:pos,smer:1} ;    
	    color = t.colors[c];
	    var rotation = 45;
	    k = d3.select("#tiles").append("path")
		.attr("d",t.create_path(t.x + col * t.size  ,
					t.y + row * t.size ,t.size))
		.attr("stroke","gold" )
	    //		.attr("fill",color)
	        .attr("class","player"+c)
		.attr("stroke-width",1)
	        .attr("id","t" + row + col)
		.attr("transform", "rotate(" + (pos*45) +"," +
		      (t.x + col * t.size + t.size/2) + "," +
		      (t.y + row * t.size + t.size/2) + ")" )
		.on("mousedown", function(){
		    s = t.table[row][col].smer;
		    // pos1 = t.rotate_pos(pos,s);
		    // if (t.check_placement(row,col,pos1) == false ) {
		    // 	s = -s;
		    // 	t.table[row][col].smer = s;
		    // }
		    r = s * 45; 
		    d3.select(this)
			.attr("transform", "rotate("+ (rotation+=r) +","+ (t.x +col*t.size+t.size/2) + ","+ (t.y + row*t.size+t.size/2) +")")});
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

$( function(){ 	       tile.create_table();
		       tile.draw_grid();
		       tile.draw_tile(1,1,0,1);
		       tile.draw_tile(1,2,1,1);
		       tile.draw_tile(1,3,2,1);
		       tile.draw_tile(1,4,3,1);
      		       tile.draw_tile(1,6,4,0);
          	       tile.draw_tile(1,7,5,0);
               	       tile.draw_tile(3,1,6,0);
                       tile.draw_tile(3,2,7,0);

 				      
	     } );
