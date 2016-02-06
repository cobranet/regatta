/* regatta Tile on table
   Need to know every thing about self 
*/
var tiles = function(parent_id,size){
    var colors = ["green","white"];
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
		rotate:function(s){
		    var audio = new Audio('rotate.wav');
		    audio.play();
		    var r = s*45;
		    var rotation = tile.angle * 45;
		    tile.angle = tile.rotate_pos(tile.angle,s);
		    console.log(tile);
		    d3.select("#t" + ids).transition().delay(300)
			.attr("transform",
			      "rotate("+ (rotation+=r) +","+
			      (tile.col*size+size/2) + ","+
			      (tile.row*size+size/2) +")");		

		},
		draw: function(){
		    d3.select(parent_id).append("path")
			.attr("d",tile.create_path( tile.col * size  ,
						 tile.row * size ,size))
			.attr("stroke","gold" )
	    		.attr("fill",colors[color])
			.attr("class","player"+ color )
			.attr("stroke-width",1)
			.attr("id","t"+ ids)
			.attr("transform", "rotate(" + (tile.angle*45) +"," +
			      ( tile.col * size + size/2) + "," +
			      ( tile.row * size + size/2) + ")" );
	
		}
	    };
	    return tile;
	}		
    };
    return tt;
};
