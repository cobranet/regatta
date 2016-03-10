/*global $,d3,Audio */
/* regatta Tile on table
   Need to know every thing about self 
*/
var tiles = function(parent_id,size,all_colors){
    var colors = all_colors;
    var ids = 0;
    var audios = {
	rotate: new Audio('/rotate.wav'),
	place: new Audio('/place.wav')
    },
    tt = {
	parent_id: parent_id,
	create: function(row,col,angle,color){
	    ids ++;
	    var tile = {
		row: row, // 0 - 7
		col: col,  // 
		color: color, // -- 0 or 1
		angle: angle, // -- 0 - 7
		id: ids,
		active: 0,
		is_active: function(){
		    if (this.angle % 2  == 0 ) {
			return false;
		    }
		    return true;
		},
		create_path: function(x,y,size){
		    var d = "M " + x + " " + y + " " +
			"C " + (x+size/3) + " " + (y+2*size/3) + " " +
			(x+size/3) + " " + (y+size-size/3)  + " " +
	       		x + " " + (y+size) + " " + 
			"L " + (x + size) + " " + (y+size) + " " +
			"C " + (x+size) + " " + (y + size/10) + " " +
			(x+size) + " " + (y + size/10) + " " +
			x + " " + y;
		    return d;
		},
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
		position_penetrating: function() {
		    var arr =   [[0,0,0,0], 
				 [1,0,1,1],
				 [0,0,0,0],
				 [1,1,0,1],
				 [0,0,0,0],
				 [1,1,1,0],
				 [0,0,0,0],
				 [0,1,1,1]];
		    return arr[this.angle];

		},
		activate: function(){
		    this.active = 1;
		    this.redraw();
		},
		deactivate: function(){
		    this.active = 0;
		    this.redraw();
		},
		move_east: function(k){
		    d3.select("#t" + this.id).transition().delay(200).
			attr("transform", "translate(" + size*k + ",0)" );
		},
		move_west: function(k){
		    d3.select("#t" + this.id).transition().delay(200).
			attr("transform", "translate(" +  (-size*k) + ",0)" );
		},
		move_south: function(k){
		    d3.select("#t" + this.id).transition().delay(200).
			attr("transform", "translate(0," +  (size*k) + ")" );
		},
		move_north: function(k) {
		    d3.select("#t" + this.id).transition().delay(200).
			attr("transform", "translate(0," +  (-size*k) + ")" );
		    
		},
		redraw: function(){
		    this.remove();
		    this.draw();
		},
		rotate:function(s){
		    audios.rotate.play();
		    var r = s*45;
		    var rotation = this.angle * 45;
		    this.angle = this.rotate_pos(this.angle,s);
		    rotation = rotation + r;
		    d3.select("#t" + this.id).transition().delay(300)
			.attr("transform",
			      "rotate("+ rotation +","+
			      (this.col*size+size/2) + ","+
			      (this.row*size+size/2) +")");
		    this.redraw();

		},
		place: function(){
		    audios.place.play();
		    this.draw();
		},
		remove: function(){
		    d3.select('#t' + this.id).remove();
		},
		draw: function(){
		    d3.select(parent_id).append("path")
			.attr("d",this.create_path( this.col * size  ,
						 this.row * size ,size))
	    		.attr("fill",colors[color])
			.attr("class","player"+ color + " active" + this.active  )
			.attr("stroke-width",1)
			.attr("id","t"+ this.id)
			.attr("transform", "rotate(" + (this.angle*45) +"," +
			      ( this.col * size + size/2) + "," +
			      ( this.row * size + size/2) + ")" );
	
		}
	    };
	    return tile;
	}		
    };
    return tt;
};
