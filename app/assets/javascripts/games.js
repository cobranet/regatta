var tile = function(n,size) {
    var arr =
	[[], 
	 [1,0,1,1],
	 [],
	 [1,1,0,1],
	 [],
	 [1,1,1,0],
	 [],
	 [0,1,1,1]];
    var t = {
	n: n,
	size: size,
	selected: null,
	select: function(which_tile){
	    this.selected = which_tile;
	    which_tile.activate();
	},
	debug: function(obj,string){
	    s = "<h3>debuger</h3>";
	    s = s + "<p>" + JSON.stringify(t.states) + "</p>";
	    if ( t.selected ) {
		s = s + "<p>" + JSON.stringify(t.selected) + "</p>";
	    }
	    if (obj) {
		s = s + "<p>" + JSON.stringify(obj) + "</p";
	    }
	    if (string) {
		s = s + "<p>" + string + "</p";
	    }
	    $("#debuger").html(s); 
	},
	deselect: function(which_tile){
	    this.selected = null;
	    which_tile.deactivate();
	},
	table: create_table(8,size),
	tiles: tiles("#tiles",30,["white","black"]),
 	states: states('#hint','#done'),
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
	can_be_activate: function(row,col,angle){
	    return true; // Fix that
	    if (t.check_placement(row,col,t.rotate_pos(angle,1)) == true) {
		return true;
	    }
	    if (t.check_placement(row,col,t.rotate_pos(angle,-1)) == true) {
		return true;
	    }
	    return false;
	},
	kick: function(row,col,s,from_where){ 
	    if (t.table[row][col] != null){
		var a = t.table[row][col].position_penetrating();
		if (a[from_where] == 1) {
		    t.table[row][col].rotate(s);
		}
	    }
	},
	// returning blocking tiles as array of 0,1 in following order (North, East, South , West ) or ( row -1 , col + 1, row + 1, col -1 )
	check_placement: function(row,col,pos){
	    if (t.table.posible_placements(row,col)[pos] == 1){
		return true;
	    } else {
		return false;
	    }
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
		t.selected.deactivate();
		t.states.change(0);
		return;
	    }
	    if (st == 2 ) {
		t.states.change(3);
		return;
	    }
	    if (st == 4 ) {
		t.selected.deactivate();
		t.states.change(0);
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
	mouse_place: function(e){
	    var what = t.states.on_move;
	    pos = t.xy_colrow(e);
	    for ( var angle = 0; angle <= 7; angle++){
		if(t.check_placement(pos.row,pos.col,angle)){
		    t1 = t.tiles.create(pos.row,pos.col,angle,what);
		    t1.place();
		    t.table[pos.row][pos.col] = t1;
		    t.states.change(1);
		    t.select(t1);
		    return;
		}
	    }
	    
	},
	can_slide: function(where,pos,s){
	    tt = t.table[where.row][where.col];
	    if ( tt != null ){
		return false;
	    }
	    if ( s == 'E' && where.col  == 7 ) {
		return true; // this is ok .. 
	    }

	    if ( s == 'S' && where.row  == 7 ) {
		return true; // this is ok .. 
	    }

	    if ( s == 'W' && where.col  == 0 ) {
		return true; // this is ok .. 
	    }

	    if ( s == 'N' && where.col  == 7 ) {
		return true; // this is ok .. 
	    }
	    
	    // col is not 7 and not 0 
	    if (s == 'E' ) {
		tt1 = t.table[where.row][where.col + 1];
	    } else if ( s == 'W') {
		tt1 = t.table[where.row][where.col - 1];
	    } else if ( s == 'S' ) {
		tt1 = t.table[where.row+1][where.col];
	    } else if ( s == 'N' ) {
		tt1 = t.table[where.row-1][where.col];
	    }
	    
	    if (tt1 ==  null ){
		return true; /// ok 
	    }
	    t.debug("Angle in can_slide " + tt1.angle);
	    arr = t.position_penetrating(tt1.angle);
	    if (pos == 0 && s == 'E' && arr[3] == 0 ){
		return true; 
	    }
	    return false; /// if not true .. then is false
	    
	},
	slide_east: function (from,to){
	    var k = 1;
	    while(from.col + k <= to.col){
		if ( t.can_slide({row: from.row,col: from.col + k} ,from.angle,'E')){
		    ;
		} else {
		    alert("can't slide");
		    return;
		}
		k++;
	    }
	    t.table[from.row][from.col] = null;
	    t.table[to.row][to.col] = from;
	    var k = 1;
	    while(from.col + k <= to.col){
		from.move_east(k);
		t.kick(to.row + 1 , from.col + k,1,0);
		t.kick(to.row-1, from.col + k, -1,2);
		k++;
	    }
	    from.col = to.col;
	    from.row = to.row
	    from.redraw();
	    
	},
	slide_north: function (from,to){
	    var k = 1;
	    while(from.row - k >= to.row){

		if ( t.can_slide({row: from.row - k ,col: from.col} ,from.angle,'N')  ){
		    ;
		} else {
		    alert("can't slide");
		    return;
		}
		k++;
	    }
	    t.table[from.row][from.col] = null;
	    t.table[to.row][to.col] = from;
	    var k = 1;
	    while(from.row - k >= to.row){
		from.move_north(k);
		t.kick(from.row - k  , from.col + 1,1);
		t.kick(from.row - k  , from.col - 1,3);
		k++;
	    }
	    from.col = to.col;
	    from.row = to.row
	    from.redraw();
	    
	},
	slide_south: function (from,to){
	    var k = 1;
	    while(from.row + k <= to.row){

		if ( t.can_slide({row: from.row + k ,col: from.col} ,from.angle,'S')){
		    ;
		} else {
		    alert("can't slide");
		    return;
		}
		k++;
	    }
	    t.table[from.row][from.col] = null;
	    t.table[to.row][to.col] = from;
	    var k = 1;
	    while(from.row + k <= to.row){
		from.move_south(k);
		t.kick(from.row + k  , from.col + 1,-1,3);
		t.kick(from.row + k  , from.col - 1,1,1);
		k++;
	    }
	    from.col = to.col;
	    from.row = to.row
	    from.redraw();
	    
	},
	slide_west: function (from,to){
	    var k = 1;
	    while(from.col - k >= to.col){
		if ( t.can_slide({row: from.row,col: from.col - k} ,from.angle,'W')){
		    ;
		} else {
		    alert("can't slide");
		    return;
		}
		k++;
	    }
	    t.table[from.row][from.col] = null;
	    t.table[to.row][to.col] = from;
	    
	    var k = 1;
	    while(from.col - k >= to.col){
		from.move_west(k);
		t.kick(to.row + 1 , from.col - k,-1,0);
		t.kick(to.row - 1 , from.col - k,1,2);
		k++;
	    }
	    from.col = to.col;
	    from.row = to.row
	    from.redraw();
	    
	},
	slide_to:function(from,to){
 	    tt = t.table[from.row][from.col];
	    var angle = tt.angle;
	    if(tt.is_active() == true ){
		t.debug("Cant slide if active");
		return; 
            }
	    if ( from.row != to.row && from.col != to.col) {
		return; //cant slide diagonaly
	    }
	    
	    if (from.row == to.row  && from.col < to.col ) { // slide east 
		t.slide_east(from,to);
	    }
	    if (from.row == to.row  && from.col > to.col ) { // slide west
		t.slide_west(from,to);
	    } 

	    if (from.col == to.col  && from.row < to.row ) { // slide south
		t.slide_south(from,to);
	    } 

	    if (from.col == to.col  && from.row > to.row ) { // slide north
		t.slide_north(from,to);
	    }
	    if ( t.can_be_activate(from.row,from.col,angle)){
		t.states.change(4);
	    } else {
		t.states.change(5);
	    }
	},
	mouse_down: function(e){
	    t.debug();
	    mouse = t.xy_colrow(e);
	    t.debug(mouse);
	    if (mouse == null){
		return;
	    }
	    t.debug("Posible placements " + t.table.posible_placements(mouse.row,mouse.col));
	    tile_at_click = t.table[mouse.row][mouse.col];
	    var st = t.states.state;

	    if (tile_at_click != null ) {
		/* STATE 1 */
		t.debug(mouse.s);
		if ( st == 1 && tile_at_click.id == t.selected.id  ){
		    var old_angle = tile.angle;
		    var new_angle = tile_at_click.rotate_pos(tile.angle,mouse.s);
		    t.debug("Old angle" + old_angle +  "New Angle" + new_angle);
		    var steps = 1;
		    while(old_angle != new_angle && steps < 9 ) {
			if (t.check_placement(tile_at_click.row,tile_at_click.col,new_angle) == false ) {
			    new_angle = tile_at_click.rotate_pos(new_angle,mouse.s);
			    steps = steps + 1;
			} else  {
			    for( var s = 0; s < steps; s++) {
				tile_at_click.rotate(mouse.s);
			    }
			    return;
			}
		    }
		}
		/* STATE 0 */
		if ( st == 0 && tile_at_click.color == t.states.on_move && t.can_be_activate(tile_at_click.row,tile_at_click.col,tile_at_click.angle) ) {
		    t.states.change(2);
		    t.select(tile_at_click);
		    var new_angle = tile_at_click.rotate_pos(tile.angle,mouse.s);
		    if (t.check_placement(tile_at_click.row,tile_at_click.col,new_angle) == false ) {
			return;
		    }
		    tile_at_click.rotate(mouse.s);
		    return;
		}
		/* STATE 2 */
		if ( st == 2 && tile_at_click.id  == t.selected.id ) {
		    var new_angle = tile_at_click.rotate_pos(tile.angle,mouse.s);
		    if (t.check_placement(tile_at_click.row,tile_at_click.col,new_angle) == false ) {
			return;
		    }
		    tile_at_click.rotate(mouse.s);
		    return;
		}
		/* STATE 4 */
		if ( st == 4 && tile_at_click.id  == t.selected.id ) {
	    	    t.debug(tile_at_click);
		    t.debug(mouse.s);
		    t.debug("State " + st);
		    var new_angle = tile_at_click.rotate_pos(tile_at_click.angle,mouse.s);
		    t.debug("New angle" + new_angle);
		    if (t.check_placement(tile_at_click.row,tile_at_click.col,new_angle) == false ) {
			return;
		    }
	
		    tile_at_click.rotate(mouse.s);
		    return;
		}

		
	    } else {
	    
		if ( st == 0  ) {
		    t.mouse_place(e);
		    return;
		}
	    
		if (st == 0 && tile_at_click != null && tile_at_click == t.states.on_move && tile_at_click.is_active()  ){
		    t.slide(mouse);
		}
	    
		if (st == 3 && tile_at_click == null ){
		    t.slide_to(t.selected,mouse);
		}
	    }
	}
    };
    return t;
};


$( function(){
    tile = tile(8,30);
    tile.table.draw_grid();
    $('#tiles').mousedown(tile.mouse_down);
    tile.bind_done();
    tile.states.hint();
    tile.states.done(false);
    $("#tiles").attr("width",tile.size * tile.n);
    $("#tiles").attr("height",tile.size * tile.n);
} );
