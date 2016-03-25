var vplayer = (function(){
    var moves = [];
    var from_where = function(where) {
	    var col = where.charCodeAt(0) - 65;
	    var row = where.substring(1,200);
	    return { col: col, row: row};
    };
    var commands = {
	
	place: function(who,where,pos){
	    var w = from_where(where); 
	    this.place(w.row,w.col,pos,who);
	},
	unplace: function(who,where,pos){
	    var w = from_where(where);
	    this.remove(w.row,w.col,who,pos);
	    
	},
	rotate: function(where,angle_from,angle_to,s){
	    var w = from_where(where);
	    var piece = this.table[w.row][w.col];
	    piece.angle = Number(angle_from);
	    var brojac = 0; 
	    while(piece.angle != Number(angle_to) && brojac < 8  ){
		console.log(piece.angle);
		piece.rotate(s);
		console.log(piece.angle);
		brojac++;
	    }
	},
	unrotate: function(where,angle_from,angle_to,s){
	    var w = from_where(where);
	    var piece = this.table[w.row][w.col];
	    piece.angle = Number(angle_to);
	    var brojac = 0;
	    while(piece.angle != Number(angle_from) && brojac < 8 ){
		console.log(piece.angle);
		piece.rotate(-s);
		console.log(piece.angle);
		brojac++;
	    }
	}
	    
    };
    var that = {};
    that.undo_one = function(games,what){
	var arr = what.split(" ");
	var command = arr[0];
	arr.shift();
	moves.push(what);
	commands['un'+command].apply(games,arr);
    };

    that.undo = function(games,what){
	var arr = what.split(";");
	var i;
	for (i=arr.length; i>0; i--){
	    that.undo(games,arr[i]);
	}
    };
    
    that.execute = function(games,what){
	var arr = what.split(";");
	var i;
	for(i = 0; i< arr.length;i++){
	    that.execute_one(games,arr[i]);
	}
    };
    that.execute_one = function(games,what) {
	var arr = what.split(" ");
	var command = arr[0];
	arr.shift();
	moves.push(what);
	console.log(what);
	commands[command].apply(games,arr);
    };
    return that;
}());
