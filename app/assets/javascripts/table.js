/*global d3, $ */
function create_table(n,size){
    var g = [];
    var k,i;
    for (i = 0; i < n ; i++){
	g[i] = [];
	for (k = 0; k < n; k++){
	    g[i][k] = null;
	}
    }
    g.count_active = function(who){
	var count = 0;
	var at;
	for (i=0;i<n;i++){
	    for (k=0;k<n;k++){
		at = g[i][k];
		if (at != null &&  at.color == who && at.is_active() == 1 ) {
		    count++;
		}
	    }
	}
	return count;
    };
    g.can_slide = function(row,col,pos,s){
	    var tt = g[row][col];
	    var touch;
	    if ( tt != null ){
		return false;
	    }
	    touch = g.touch_by(row,col); 
	    
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
    };
    g.is_slideable = function(row,col,pos){
	var all = g.possible_rotations(row,col,pos);
	all.forEach(function(ele){
	    if (row != 0 ) {
		if ( g.can_slide(row-1,col,ele,'N')){
		    return true;
		}
	    }
	    if (row != n-1){
		if (g.can_slide(row+1,col,ele,'S')){
		    return true;
		}
	    }
	    if (col != 0 ) {
		if (g.can_slide(row,col-1,ele,'W')){
		    return true;
		}
	    }
	    if (col != n-1) {
		if (g.can_clide(row,col+1,ele,'E')){
		    return true;
		}
	    }
	});
	return true;
    };
    g.possible_rotations = function(row,col,pos){
	var  all = g.posible_placements(row,col);
	var curpos = pos+1;
	var possible = [0,0,0,0,0,0,0,0];
	var stop = false;
	while(stop === false &&  curpos != pos  ) {
	    if (all[curpos] === 1){
		possible[curpos] = 1;
	    } else {
		stop = true;
	    }
	    curpos++;
	}
	curpos = pos - 1;
	while (stop == false && curpos != pos ){
	    if (all[curpos] === 1 ) {
		possible[curpos] = 1;
	    } else {
		stop = true;
	    }
	    curpos--;
	}
	return possible;
    };
    /* Every tile have four sides.. side can be 0 - empty or have convex side , 1 - full but not pentrating, 2 penetrating inside tile
       we put them in array ( North, East, South, West )
       We split checking in two functions ... by row and by column .. and join result in third
    */
    g.touch_by_row = function(row,col){
	var arr = [0,0];   // we asume that north and south position is empty
	var north,south;
	if ( row == 0 ) {
	    arr[0] = 1;
	    north  = null;
	} else {
	    north = g[row-1][col];
	}
	if (row == n-1){
	    arr[1] = 1;
 	    south = null;
	} else {
	    south = g[row+1][col];
	}
	if (north != null){
	    if (north.angle != 6 ) {
		if ( north.position_penetrating()[2] == 1) {
		    arr[0] = 2;
		} else {
		    arr[0] = 1;
		}
		
	    }
	}
	if (south != null){
	    if (south.angle != 2 ) {
		if ( south.position_penetrating()[0] == 1) {
		    arr[1] = 2;
		} else {
		    arr[1] = 1;
		}
	    }
	}
	return arr;
    };
    g.touch_by_col = function(row,col){
	var arr = [0,0];   // we asume that east and west position is empty
	var east,west;
	if ( col == 0 ) {
	    arr[1] = 1;
	}
	if (col == n-1){
		arr[0] = 1;
	}
	east = g[row][col+1];
	west = g[row][col-1];
	if (east != null){
	    if (east.angle != 0 ) {
		if ( east.position_penetrating()[3] == 1) {
		    arr[0] = 2;
		} else {
		    arr[0] = 1;
		}
		
	    }
	}
	if (west != null){
	    if (west.angle != 4 ) {
		if ( west.position_penetrating()[1] == 1) {
		    arr[1] = 2;
		} else {
		    arr[1] = 1;
		}
	    }
	}
	return arr;
    };
    g.touch_by = function(row,col){
	var arr = [];
	var a = g.touch_by_row(row,col);
	var b = g.touch_by_col(row,col);
	arr[0] = a[0];
	arr[1] = b[0];
	arr[2] = a[1];
	arr[3] = b[1];
	return arr;
    };
    g.posible_placements=function(row,col){
	var ii,kk;
	/* possible placement if there is 2 */
	var on_two = [ [0,0,1,0, 0,0,0,0],
		       [0,0,0,0, 1,0,0,0],
		       [0,0,0,0, 0,0,1,0],
		       [1,0,0,0, 0,0,0,0]];
	/* possible placment if there is 1 */
	var on_one = [ [1,0,1,0, 1,0,1,1],
	               [1,1,1,0, 1,0,1,0],
		       [1,0,1,1, 1,0,1,0],
		       [1,0,1,0, 1,1,1,0]];
	var touch = g.touch_by(row,col);
	console.log("touch");
	console.log(touch);
	var posible = [1,1,1,1,1,1,1,1];
	// ii is actualy N , E, S, W
	for (ii = 0; ii < 4; ii++){
	    if (touch[ii] == 2 ) {
		for ( kk = 0; kk < 8; kk++){
		    if(on_two[ii][kk] == 0){
			posible[kk] = 0;
		    }
		}
	    }
	    if (touch[ii] == 1 ) {
		for ( kk = 0; kk < 8; kk++){
		    if(on_one[ii][kk] == 0){
			posible[kk] = 0;
		    }
		}
	    }
	}
	console.log(posible);
	return posible;
    };
	    
    g.draw_grid = function(){
	    for(i=0; i < 8; i++){
		for(k=0; k < 8; k++){
		d3.select("#tiles").append("path")
			.attr("d",this.create_grid_path(i*size,k*size,size))
		    .attr("stroke","black")
		    .attr("fill","lightgrey")
		    .attr("stroke-width",1);
		}
	    }
    };
    g.create_grid_path = function(x,y,size){
	    var d = "M " + x + " " + y + "  " + 
	    "L "  + x + " " + (y+size) + " " +
	    "L "  + (x +size) + " " + (y+size) + " " +
		"L " +(x+size) + " " + y + " " +
		"L " + x + " " +  y;
	    return d;
    };
    return g;
}
