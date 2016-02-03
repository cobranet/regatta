var game = function(){
    t = {
	is_place_possible: function(table,row,col,pos){
	    return 0;  
	}
    }
    
    return t;
}();
var tile = function() {
    var arr =
	[[0,0,0,0], 
	 [1,0,1,1],
	 [],
	 [1,1,0,1],
	 [],
	 [1,1,1,0],
	 [],
	 [0,1,1,1]];

    var t = {
	x: 10,
	last_what: 1,
	state: 0, // state 0 ... expect placement // state 1 expect rotate
	y: 25,
	size: 30,
	n: 8,
	lastpos: 2,
	table: [],
	colors: ["green","white"],
	create_table: function(){
	    for (var i = 0; i < t.n ; i++){
		t.table[i] = [];
		for (var k = 0; k < t.n; k++){
		    t.table[i][k] = {what:0,pos:-1};
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
	hint: function(){
	    if (t.state == 0 ){
		$("#hint").text("Place tile");
		return;
	    };
	    if (t.state == 1 ){
		$("#hint").text("Rotate tile and press done");
		return;
	    };

	    
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
	    a = t.position_penetrating(pos);
	    console.log(a);
	    if ( row == 0 && a[0] == 1) {
		console.log("In first row and penetrating north!");
		return false;
	    }
	    
	    if ( row == t.n-1 && a[2] == 1) {
		console.log("In last row and penetrating south!"); 
		return false;
	    }
	    if ( col == 0 && a[3] == 1) {
		console.log("In first column and penetrating west!");
		return false;
	    }
	    if ( col == t.n-1 && a[1] == 1) {
		console.log("In last column an penetrating east!");
		return false;
	    }
	    
	    if ( row != 0 && t.table[row-1][col].what != 0 ){
		north = t.table[row-1][col];
		if ( north.pos != 6 ) {
		    b = t.position_penetrating(north.pos);
		    if ( b[2] == 1 || a[0] == 1 ) {
			console.log("On my north is tile which is not at 6 position and I penetrating north!");
			return false;
		    }
		}
	    }
	    
	    if (row != t.n-1 && t.table[row+1][col].what != 0 ){
		south = t.table[row+1][col];
		if (south.pos != 2 ){
		    b = t.position_penetrating(south.pos);
		    if ( b[0] == 1 || a[2] == 1) {
			console.log("On my south is tile which is not at 2 position and I penetrating south!");
			return false;
		    }
		}
	    }

	    if (col != 0 && t.table[row][col-1].what != 0 ){
		west = t.table[row][col-1];
		if (west.pos != 4 ) {
		    b = t.position_penetrating(west.pos);
		    if ( b[1] == 1 || a[3] == 1) {
			console.log("On my west is tile which is not at 4 position and I penetrating west!");
			return false;
		    }
		}
	    }
	    if (col != t.n-1 && t.table[row][col+1].what != 0 ){
		east = t.table[row][col+1];
		if (east.pos != 0){
		    b = t.position_penetrating(east.pos);
		    if ( b[3] == 1 || a[1] == 1) {
			console.log("On my east is tile which is not at 0 position and I penetrating east!");
			return false;
		    }
		}
	    }
	    return true;
	},
	xy_colrow: function(e){
	    pos = {};
	    pos.x = (e.pageX - $('#tiles').offset().left-t.x) / t.size;
	    pos.y = (e.pageY - $('#tiles').offset().top-t.y) / t.size;
	    pos.col = Math.floor(pos.x);
	    pos.row = Math.floor(pos.y);
	    if (pos.col > 7 || pos.col < 0 || pos.row > 7 || pos.col > 7 ){
		return null;
	    }
	    var s= 0;
	    if ( pos.x - pos.col  > 0.5){
		s = 1;
	    } else {
		s = -1;
	    }
	    pos.s = s;
	    return pos;
	},
	bind_done: function(){
	    $("#done").click(function(){
		t.state = 0;
		t.done(false);
	    });
	},
	mouse_place: function(e){
	    var what = 0;
	    if(t.last_what == 1 ) { what = 2; } else { what = 1; }; 
	    pos = t.xy_colrow(e);
	    var col =pos.col;
	    var row = pos.row;
	    var s= pos.s;
	    var tt = t.table[pos.row][pos.col];
	    if (tt.what != 0){
		return;
	    }
	    for ( var whatpos = 0; whatpos <= 7; whatpos++){
		if(t.check_placement(row,col,whatpos)){
		    t.draw_tile(row,col,whatpos,what);
		    t.state = 1;
		    t.last_what = what;
		    t.done(true);
		    return;
		}
	    }
	    
	},
	mouse_down: function(e){
	    if (t.state == 1){
		t.mouse_rotate(e);
	    } else {
		t.mouse_place(e);
		t.hint();
	    }
	},
	done: function(show){
	    if (show) {
		$("#done").show("slow");
	    } else {
		$("#done").hide("slow");
		t.hint();
	    }
	},
	mouse_rotate: function(e){
	    
	    pos = t.xy_colrow(e);
	    var col =pos.col;
	    var row = pos.row;
	    var s= pos.s;
	    var tt = t.table[pos.row][pos.col];
	    if (tt.what == 0){
		return;
	    }
    	    var rotation =  tt.pos * 45;
	    if (t.check_placement(row,col,tt.pos) == false ) {
	     	return;
 	    }
	    var pos1 = t.rotate_pos(tt.pos,s);

	    if (t.check_placement(row,col,pos1) == false ) {
		return;
	    }
	    tt.pos = pos1;

	    var r = s * 45;
	    d3.select("#t" + row + col)
		.attr("transform", "rotate("+ (rotation+=r) +","+ (t.x +col*t.size+t.size/2) + ","+ (t.y + row*t.size+t.size/2) +")");		

	},
	bind_mouse: function(){
	    $( "#tiles" ).mousemove(function(e) {
		pos = t.xy_colrow(e);
		if ( t.lastpos != pos ){
		    t.lastpos = pos;
		} else {
		    return;
		}
		    
		if (t.lastpos === null) { return; }
		tt = t.table[t.lastpos.row][t.lastpos.col];
	    });
	},
	draw_tile: function(row,col,pos,c){
	    t.table[row][col] = {what: c+1,pos:pos,row:row,col:col} ;    
	    color = t.colors[c];
	    var rotation = 45;
	    k = d3.select("#tiles").append("path")
		.attr("d",t.create_path(t.x + col * t.size  ,
					t.y + row * t.size ,t.size))
		.attr("stroke","gold" )
	    	.attr("fill",color)
	        .attr("class","player"+ c )
		.attr("stroke-width",1)
	        .attr("id","t" + row + col)
		.attr("transform", "rotate(" + (pos*45) +"," +
		      (t.x + col * t.size + t.size/2) + "," +
		      (t.y + row * t.size + t.size/2) + ")" );
		
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


$( function(){
    tile.done(false);
    tile.create_table();
    tile.bind_mouse();
    tile.draw_grid();
    $('#tiles').mousedown(tile.mouse_down);
    tile.bind_done();
    tile.state = 0;
    tile.hint();
} );
