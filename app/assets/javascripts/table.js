/*global d3, $ */
function create_table(n,size){
    var g = [];
    var possitions = [];
    var k,i;
    for (i = 0; i < n ; i++){
	g[i] = [];
	for (k = 0; k < n; k++){
	    g[i][k] = null;
	}
    }
    possitions[0] = { penetrating: [1,1,1,0],
		      active: false};
    possitions[1] = { penetrating: [2,1,2,2],
		     active: true };
    possitions[2] = { penetrating: [0,1,1,1],
		     active: false };
    possitions[3] = { penetrating: [2,2,1,2],
		     active: true };
    possitions[4] = { penetrating: [1,0,1,1],
		     active: false };
    possitions[5] = { penetrating: [2,2,2,1],
		     active: true};
    possitions[6] = { penetrating: [1,1,0,1],
		      active: false };
    possitions[7] = { penetrating: [1,2,2,2],
		      active: true};
		    
    
    g.touch_by=function(row,col){
	var touch = [0,0,0,0]; // N E S W
	if (row === 0) {
	    touch[0] = 1;
	} else {
	    if(g[row-1][col] != null){
		touch[0] = possitions[g[row-1][col].angle].penetrating[2];
	    }
		
	}

	if (row === n - 1 ) {
	    touch[2] = 1;
	} else {
	    if(g[row+1][col] != null){
		touch[2] = possitions[g[row+1][col].angle].penetrating[0];
	    } 
	}
	    
	if (col === 0) {
	    touch[3] = 1;
	} else {
	    if(g[row][col-1] != null){
		touch[3] = possitions[g[row][col-1].angle].penetrating[1];
	    }
	}

	if (col === n - 1) {
	    touch[1] = 1;
	} else {
	    if(g[row][col+1] != null){
		touch[1] = possitions[g[row][col+1].angle].penetrating[3];
	    }
	}
	return touch;
    };
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
