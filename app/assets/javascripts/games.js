/*global $,create_table,tiles,states,alert */
var tile = function(n,size) {
    var t = {
	n: n,
	size: size,
	selected: null,
	to_string: function(){
	    var i,k;
	    var s = [];
	    for( i=0 ; i<n; i++){
		s[i] = [];
		for ( k=0; k<n; k++){
		    if (t.table[i][k] === null) {
		      s[i][k] = 0; 
		    } else {
			s[i][k] = { color: t.table[i][k].color,
				    angle: t.table[i][k].angle};
		    }
		}
	    }
	    return JSON.stringify(s);
	},
	select: function(which_tile){
	    this.selected = which_tile;
	    which_tile.activate();
	},
	set_score: function(){
	    $("#score").text("White " + t.table.count_active(0) + " " + "Black " + t.table.count_active(1));
	},
	debug: function(obj,string){
	    var s = "<h3>debuger</h3>";
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
	tiles: tiles("#tiles",size,["white","black"]),
 	states: states('#hint','#done','#new_move',"#activate","#pick","#do_nothing"),
	rotate_pos: function(pos,smer){
		    var p = pos + smer;
		    if (p>7) {
			return 0;
		    }
		    if (p < 0){
			return 7;
		    }
		    return p;
	},
	can_be_activate: function(row,col,angle){
	    
	    if (t.check_placement(row,col,t.rotate_pos(angle,1)) == true) {
		return true;
	    }
	    if (t.check_placement(row,col,t.rotate_pos(angle,-1)) == true) {
		return true;
	    }
	    return false;
	},
	kick: function(row,col,s,from_where){
	    if (row < 0 || row > n - 1 || col < 0 || col > n - 1) {
		return;
	    }
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
	    }
	    return false;
	},
	xy_colrow: function(e){
	    var pos = {};
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
	key_down: function(e){
	    var code = e.keyCode || e.which;
	    if(code == 13) {
		t.done_action();
	    }
	},
	done_action: function() {
	    var st = t.states.get_state();
	    if (st == "ROT_AFTER_PLACE" || st == "AFTER_SLIDE_INACTIVE"  ) {
		t.selected.deactivate();
		t.states.change('PLACE_OR_ROTATE');
		t.set_score();
		return;
	    }
	    if (st == "ROT_ACTIVE" ) {
		t.states.change('WHERE_TO_SLIDE');
		t.set_score();
		return;
	    }
	    if (st == "AFTER_SLIDE_ACTIVE" ) {
		t.selected.deactivate();
		t.states.change('PLACE_OR_ROTATE');
		t.set_score();
		return;
	    }
	},
	new_move_action: function(){
	    t.done_action();
	},
	activate_action: function(){
	    t.states.change('AT_NEW_CHOOSE_TO_ACTIVATE');
	},
	pick_action: function(){
	    alert("chose piece to pick");
	},
	bind_buttons: function(){
	    $("#done").click(t.done_action);
	    $("#new_move").click(t.new_move_action);
	    $("#pick").click(t.pick_action);
	    $("#activate").click(t.activate_action);
	},
	mouse_place: function(e){
	    var what = t.states.on_move;
	    var angle;
	    var t1;
	    var pos = t.xy_colrow(e);
	    for ( angle = 0; angle <= 7; angle++){
		if(t.check_placement(pos.row,pos.col,angle) && t.can_be_activate(pos.row,pos.col,angle)){
		    t1 = t.tiles.create(pos.row,pos.col,angle,what);
		    t1.place();
		    t.table[pos.row][pos.col] = t1;
		    t.states.change("ROT_AFTER_PLACE");
		    t.states.buttons(1,t1.is_active());
		    t.select(t1);
		    return;
		}
	    }
	    
	},
	can_slide: function(where,pos,s){
	    var tt = t.table[where.row][where.col];
	    var touch;
	    if ( tt != null ){
		return false;
	    }
	    touch = t.table.touch_by(where.row,where.col); 
	    
	    if ( (s == 'E' && touch[1] != 2) ) {
		return true;
	    }

	    if ( s == 'E' && pos == 4 ) {
		return true;
	    }

	    if ( (s == 'N' && touch[0] != 2) ) {
		return true;
	    }

	    if ( s == 'N' && pos == 2 ) {
		return true;
	    }

	    if ( (s == 'S' && touch[2] != 2) ) {
		return true;
	    }

	    if ( s == 'S' && pos == 6 ) {
		return true;
	    }
	    if ( (s == 'W' && touch[3] != 2) ) {
		return true;
	    }

	    if ( s == 'W' && pos == 0 ) {
		return true;
	    }

	    
	    return false; /// if not true .. then is false
	},
	slide_east: function (from,to){
	    var k = 1;
	    while(from.col + k <= to.col){
		if (  !t.can_slide({row: from.row,col: from.col + k} ,from.angle,'E')){
		    return;
		}
		k++;
	    }
	    t.table[from.row][from.col] = null;
	    t.table[to.row][to.col] = from;
	    k = 1;
	    while(from.col + k <= to.col){
		from.move_east(k);
		t.kick(to.row + 1 , from.col + k,1,0);
		t.kick(to.row-1, from.col + k, -1,2);
		k++;
	    }
	    from.col = to.col;
	    from.row = to.row;
	    from.redraw();
	    
	},
	slide_north: function (from,to){
	    var k = 1;
	    while(from.row - k >= to.row){

		if ( !t.can_slide({row: from.row - k ,col: from.col} ,from.angle,'N')  ){
		    return;
		}
		k++;
	    }
	    t.table[from.row][from.col] = null;
	    t.table[to.row][to.col] = from;
	    k = 1;
	    while(from.row - k >= to.row){
		from.move_north(k);
		t.kick(from.row - k  , from.col + 1,1,3);
		t.kick(from.row - k  , from.col - 1,-1,1);
		k++;
	    }
	    from.col = to.col;
	    from.row = to.row;
	    from.redraw();
	    
	},
	slide_south: function (from,to){
	    var k = 1;
	    while(from.row + k <= to.row){
		if (!t.can_slide({row: from.row + k ,col: from.col} ,from.angle,'S')){
		    return;

		}
		k++;
	    }
	    t.table[from.row][from.col] = null;
	    t.table[to.row][to.col] = from;
	    k = 1;
	    while(from.row + k <= to.row){
		from.move_south(k);
		t.kick(from.row + k  , from.col + 1,-1,3);
		t.kick(from.row + k  , from.col - 1,1,1);
		k++;
	    }
	    from.col = to.col;
	    from.row = to.row;
	    from.redraw();
	    
	},
	slide_west: function (from,to){
	    var k = 1;
	    while(from.col - k >= to.col){
		if ( !t.can_slide({row: from.row,col: from.col - k} ,from.angle,'W')){
		    return;
		}
		k++;
	    }
	    t.table[from.row][from.col] = null;
	    t.table[to.row][to.col] = from;
	    
	    k = 1;
	    while(from.col - k >= to.col){
		from.move_west(k);
		t.kick(to.row + 1 , from.col - k,-1,0);
		t.kick(to.row - 1 , from.col - k,1,2);
		k++;
	    }
	    from.col = to.col;
	    from.row = to.row;
	    from.redraw();
	    
	},
	slide_to:function(from,to){
 	    var tt = t.table[from.row][from.col];
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
		t.states.change("AFTER_SLIDE_ACTIVE");
	    } else {
		t.states.change("AFTER_SLIDE_INACTIVE");
	    }
	},
	click_at_2: function(tile,side){
	    var new_angle = tile.rotate_pos(tile.angle,side);
	    if (t.check_placement(tile.row,tile.col,new_angle) === false ) {
		    return;
		}
	    tile.rotate(side);
	    t.states.buttons(2,tile.is_active());
	    return;
	    
	},
	click_at_4: function(tile,side){
	    var new_angle = tile.rotate_pos(tile.angle,side);

	    if (t.check_placement(tile.row,tile.col,new_angle) == false ) {
		return;
	    }
	    tile.rotate(side);
	    t.states.buttons(4,tile.is_active());
	    return;
	},
	click_at_1: function(tile,side ){
	    var old_angle,new_angle,s;
	    old_angle = tile.angle;
	    new_angle = tile.rotate_pos(tile.angle,side);
	    t.debug("Old angle" + old_angle +  "New Angle" + new_angle);
	    var steps = 1;
	    while(old_angle != new_angle && steps < 9 ) {
		if (t.check_placement(tile.row,tile.col,new_angle) == false ) {
		    new_angle = tile.rotate_pos(new_angle,side);
		    steps = steps + 1;
		} else  {
		    for( s = 0; s < steps; s++) {
			tile.rotate(side);
			t.states.buttons(1,tile.is_active());
		    }
		    return;
		}
	    }
	},
	click_on_tile: function(tile_at_click,side){
	    var new_angle;
	    var st = t.states.get_state();
	    console.log(st);
	    if ( st === "ROT_AFTER_PLACE" && tile_at_click.id === t.selected.id  ) {
		t.click_at_1(tile_at_click,side); 
	    } 
	    if (st === "AT_NEW_CHOOSE_TO_ACTIVATE" && tile_at_click.color == t.states.on_move && tile_at_click.is_active() === false ) {
		t.states.change("ROTATE_AFTER_ACTIVATE");
		t.select(tile_at_click);
	    }
		
	    if ( st == "PLACE_OR_ROTATE" && tile_at_click.color == t.states.on_move && tile_at_click.is_active() === true ) {
		t.states.change("ROT_ACTIVE");
		t.select(tile_at_click);
		new_angle = tile_at_click.rotate_pos(tile.angle,side);
		if (t.check_placement(tile_at_click.row,tile_at_click.col,new_angle) == false ) {
		    return;
		}
		tile_at_click.rotate(side);
		return;
	    }
	    if ( (st == "ROT_ACTIVE" || st == 'ROTATE_AFTER_ACTIVATE'  ) && tile_at_click.id  == t.selected.id ) {
		    t.click_at_2(tile_at_click,side);
		}
	    if ( st == "AFTER_SLIDE_ACTIVE" && tile_at_click.id  == t.selected.id ) {
		t.click_at_4(tile_at_click,side);
	    }
	    
	},
	mouse_down: function(e){
	    t.debug("White " + t.table.count_active(0) + " Black " + t.table.count_active(1) );
	    
	    var mouse = t.xy_colrow(e);
	    if (mouse == null){
		return;
	    }
	    var tile_at_click = t.table[mouse.row][mouse.col];
	    var st = t.states.get_state();
	    if (tile_at_click != null ) {
		t.click_on_tile(tile_at_click,mouse.s);
	    }  else {
		if ( st == 'PLACE_OR_ROTATE') {
		    t.mouse_place(e);
		    return;
		}
		if (st == 0 && tile_at_click != null && tile_at_click == t.states.on_move && tile_at_click.is_active()  ){
		    t.slide(mouse);
		}
		if (st == 'ROT_ACTIVE') {
		    t.slide_to(t.selected,mouse);
		    
		}
		if (st == 'WHERE_TO_SLIDE' && tile_at_click == null ){
		    t.slide_to(t.selected,mouse);
		}

	    }
	}
    };
    return t;
};


$( function(){
    tile = tile(8,40);
    tile.table.draw_grid();
    $('#tiles').mousedown(tile.mouse_down);
    $('body').keydown(function(e){
	tile.key_down(e);
    });
    tile.bind_buttons();
    tile.states.hint();
    tile.states.buttons("PLACE_OR_ROTATE",false);
    $("#tiles").attr("width",tile.size * tile.n + 3);
    $("#tiles").attr("height",tile.size * tile.n + 3);

} );
