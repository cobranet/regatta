/* regatta Tile on table
   Need to know every thing about self 
*/
var tiles = function(parent_id,size){
    var colors = ["black","white"];
    var ids = 0;
    tt = {
	myclass: "tiles",
	parent_id: parent_id,
	create: function(row,col,angle,color){
	    ids ++;
	    tile = {
		row: row, // 0 - 7
		col: col,  // 
		color: color, // -- 0 or 1
		angle: angle, // -- 0 - 7
		id: ids,
		active: 0,
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
		    d3.select('#t' + this.id).remove();
		    this.draw();
		},
		rotate:function(s){
		    var audio = new Audio('rotate.wav');
		    audio.play();
		    var r = s*45;
		    var rotation = this.angle * 45;
		    this.angle = this.rotate_pos(this.angle,s);
		    d3.select("#t" + this.id).transition().delay(300)
			.attr("transform",
			      "rotate("+ (rotation+=r) +","+
			      (this.col*size+size/2) + ","+
			      (this.row*size+size/2) +")");
		    this.redraw();

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
