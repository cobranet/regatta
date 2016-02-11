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
	on_move: 1,
	n: 8,
	size: 30,
	selected: null,
	table: [],
	tiles: tiles("#tiles",30),
	states: states('#hint','#done'),
	create_table: function(){
	    for (var i = 0; i < t.n ; i++){
		t.table[i] = [];
		for (var k = 0; k < t.n; k++){
		    t.table[i][k] = null;
		}
	    }
	},
	create_grid_path: function(x,y,size){
	    d = "M " + x + " " + y + "  " + 
	    "L "  + x + " " + (y+size) + " " +
	    "L "  + (x +size) + " " + (y+size) + " " +
		"L " +(x+size) + " " + y + " " +
		"L " + x + " " +  y;
	    return d;
	},
	kick_east_down: function(row,col){
	    if (t.table[row][col].what != 0){
		tt = t.table[row][col];
		var arr = t.position_penetrating(tt.pos);
		if (arr[0] == 1){
		    t.rotate_tile({row:row,col:col},1);
		}
	    }
	},
	// returning blocking tiles as array of 0,1 in following order (North, East, South , West ) or ( row -1 , col + 1, row + 1, col -1 )
	position_penetrating: function(pos) {
	    return arr[pos];
	},
	check_placement: function(row,col,pos){
	    a = t.position_penetrating(pos);
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
	    
	    if ( row != 0 && t.table[row-1][col] != null ){
		north = t.table[row-1][col];
		if ( north.angle != 6 ) {
		    b = t.position_penetrating(north.angle);
		    if ( b[2] == 1 || a[0] == 1 ) {
			console.log("On my north is tile which is not at 6 position and I penetrating north!");
			return false;
		    }
		}
	    }
	    
	    if (row != t.n-1 && t.table[row+1][col] != null ){
		south = t.table[row+1][col];
		if (south.angle != 2 ){
		    b = t.position_penetrating(south.angle);
		    if ( b[0] == 1 || a[2] == 1) {
			console.log("On my south is tile which is not at 2 position and I penetrating south!");
			return false;
		    }
		}
	    }

	    if (col != 0 && t.table[row][col-1] != null ){
		west = t.table[row][col-1];
		if (west.angle != 4 ) {
		    b = t.position_penetrating(west.angle);
		    if ( b[1] == 1 || a[3] == 1) {
			console.log("On my west is tile which is not at 4 position and I penetrating west!");
			return false;
		    }
		}
	    }
	    if (col != t.n-1 && t.table[row][col+1] != null ){
		east = t.table[row][col+1];
		if (east.angle != 0){
		    b = t.position_penetrating(east.angle);
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
	    pos.x = (e.pageX - $('#tiles').offset().left) / t.size;
	    pos.y = (e.pageY - $('#tiles').offset().top) / t.size;
	    pos.col = Math.floor(pos.x);
	    pos.row = Math.floor(pos.y);
	    if (pos.col > 7 || pos.col < 0 || pos.row > 7 || pos.row < 0 ){
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
	done_action: function() {
	    var st = t.states.state;
	    if (st == 1 || st == 5  ) {
		st = 0;
		t.selected = null;
		t.states.change(0);
		t.next_player();
		return;
	    }
	    if (st == 2 ) {
		st = 3;
		t.states.change(3);
		return;
	    }
	    
	    
	},
	bind_done: function(){
	    $("#done").click(t.done_action);
	},
	slide: function(pos){
	    t.slide_from = pos;
	    t.state = 2;
	    t.states.hint();
	    t.done(true);
	},
	next_player: function(){
	    if (t.on_move == 1 ) {
		t.on_move = 0;
		return;
	    }
	    t.on_move = 1;
	},
	mouse_place: function(e){
	    var what = t.on_move;
	    pos = t.xy_colrow(e);
	    for ( var angle = 0; angle <= 7; angle++){
		if(t.check_placement(pos.row,pos.col,angle)){
		    t1 = t.tiles.create(pos.row,pos.col,angle,what);
		    t1.draw();
		    t.table[pos.row][pos.col] = t1;
		    t.states.change(1);
		    t.selected = t1;
		    return;
		}
	    }
	    
	},
	can_slide: function(where,pos,s){
	    s = 'E'; // East
	    tt = t.table[where.row][where.col];
	    t.position_penetrating(tt.pos);
	    // if occupated can't slide
	    
	    if ( tt.what != 0 ){
		return false;
	    }
	    if (pos == 0 && s == 'E' && where.col  == 7 ) {
		return true; // this is ok .. 
	    }
	    // col is not 7
	    tt1 = t.table[where.row][where.col + 1];
	    if (tt1.what == 0 ){
		return true; /// ok 
	    }
	    arr = position_penetrating(tt1.pos);
	    if (poss == 0 && s == 'E' && arr[3] == 0 ){
		return true; 
	    }
	    return false; /// if not true .. then is false
	    
	},
	is_active: function(pos){
	    if ( pos % 2  == 0 ){
		return false;
	    }
	    return true;
	},
	slide_east: function (from,to){
	    tt = t.table[from.row][from.col];
	    var k = 1;
	    while(from.col + k <= to.col){
		if ( t.can_slide({row: from.row,col: from.col + k} ,tt.pos,'E')){
		    ;
		} else {
		    alert("can't slide");
		    return;
		}
		k++;
	    }
	    t.table[from.row][from.col].what = 0;
	    t.table[to.row][to.col] = tt;
	    $("#t" + from.row + from.col).attr("id","t"+to.row + to.col);
	    
	    var k = 1;
	    while(from.col + k <= to.col){
		d3.select("#t" + to.row + to.col).attr("transform", "translate(" + t.size*k + ",0)" );
		t.kick_east_down(to.row + 1 , from.col + k);
		
		k++;
	    }

	},
	slide_to:function(from,to){
	    alert(from);
	    alert ("slide from (" + from.row + "," + from.col   + ") to (" + to.row + "," + to.col + ")" );
	    tt = t.table[from.row][from.col];
	    if(t.is_active(tt.pos)){
		return; // must bi in inactive position
            }
	    if (tt.pos == 0 && from.col < to.col ) { // slide east 
		if (to.row != from.row ){
		    return;
		} else {
		    t.slide_east(from,to);
		}
		
	    }},
	mouse_down: function(e){
	    mouse = t.xy_colrow(e);
	    if (mouse == null){
		return;
	    }
	    tile_at_click = t.table[mouse.row][mouse.col];
	    var st = t.states.state;

	    if (tile_at_click != null ) {
		/* STATE 1 */
		if ( st == 1 && tile_at_click.id == t.selected.id  ){
		    var new_angle = tile_at_click.rotate_pos(tile.angle,pos.s);
		    if (t.check_placement(tile_at_click.row,tile_at_click.col,new_angle) == false ) {
			return;
		    }
		    tile_at_click.rotate(pos.s);
		    return;
		}
		/* STATE 0 */
		if ( st == 0 && tile_at_click.color == t.on_move ) {
		    t.states.change(2);
		    t.selected = tile_at_click;
		    var new_angle = tile_at_click.rotate_pos(tile.angle,pos.s);
		    if (t.check_placement(tile_at_click.row,tile_at_click.col,new_angle) == false ) {
			return;
		    }
		    tile_at_click.rotate(pos.s);
		    return;
		}
		/* STATE 2 */
		if ( st == 2 && tile_at_click.id  == t.selected.id ) {
		    var new_angle = tile_at_click.rotate_pos(tile.angle,pos.s);
		    if (t.check_placement(tile_at_click.row,tile_at_click.col,new_angle) == false ) {
			return;
		    }
		    tile_at_click.rotate(pos.s);
		    return;
		}
	    }
	    
	    if ((st == 0 || st == 1) && tile_at_click == null ) {
		t.mouse_place(e);
		return;
	    }
	    
	    if (st == 0 && tile_at_click != null && tile_at_click == t.on_move && t.is_active(tile_at_click.pos) ){
		t.slide(mouse);
	    }
	    
	    if (st == 3 && tile_at_click == null ){
		t.slide_to(t.selected,mouse);
	    }
	    
	},
	draw_grid: function(){
	    for(var i=0; i < 8; i++){
		for(var k=0; k < 8; k++){
		d3.select("#tiles").append("path")
			.attr("d",t.create_grid_path(i*t.size,k*t.size,t.size))
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
    tile.create_table();
    tile.draw_grid();
    $('#tiles').mousedown(tile.mouse_down);
    tile.bind_done();
    tile.states.hint();
    tile.states.done(false);
} );
