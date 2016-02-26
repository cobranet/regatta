function create_table(n,size){
    g = [];
    for (var i = 0; i < n ; i++){
	g[i] = [];
	for (var k = 0; k < n; k++){
	    g[i][k] = null;
	}
    };
    g.count_active = function(who){
	var i,k;
	var count = 0;
	var at;
	for (i=0;i<n;i++){
	    for (k=0;k<n;k++){
		at = g[i][k];
		if (at != null) {
		    ;
		}
		if (at != null &&  at.color == who && at.is_active() == 1 ) {
		    count++;
		}
	    }
	}
	return count;
    }
    
    /* Every tile have four sides.. side can be 0 - empty or have convex side , 1 - full but not pentrating, 2 penetrating inside tile
       we put them in array ( North, East, South, West )
       We split checking in two functions ... by row and by column .. and join result in third
   */
    g.touch_by_row = function(row,col){
	var arr = [0,0];   // we asume that north and south position is empty
	var north,south;
	if ( row == 0 ) {
	    arr[0] = 1;
	} else {
	    if (row == n-1){
		arr[1] = 1;
	    } else {
		north = g[row-1][col];
		south = g[row+1][col];
		
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
			if ( north.position_penetrating()[0] == 1) {
			    arr[1] = 2;
			} else {
			    arr[1] = 1;
			}
		    }
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
	} else {
	    if (col == n-1){
		arr[0] = 1;
	    } else {
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
    },
    g.posible_placements=function(row,col){
	/* possible placement if there is 2 */
	var k;
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
	
	for (var i = 0; i < 4; i++){
	    if (touch[i] == 2 ) {
		for ( var k = 0; k < 8; k++){
		    if(on_two[i][k] == 0){
			posible[k] = 0;
		    }
		}
	    }
	    if (touch[i] == 1 ) {
		for ( k = 0; k < 8; k++){
		    if(on_one[i][k] == 0){
			posible[k] = 0;
		    }
		}
	    }
	}
	return posible;
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
