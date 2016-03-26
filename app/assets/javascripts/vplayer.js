var vplayer = (function(){
    var moves = [];
    var from_where = function(where) {
	var col = where.charCodeAt(0) - 65;
	var row = where.substring(1,200);
	return { col: Number(col), row: Number(row)};
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
		piece.rotate(s);
		brojac++;
	    }
	},
	unrotate: function(where,angle_from,angle_to,s){
	    var w = from_where(where);
	    var piece = this.table[w.row][w.col];
	    piece.angle = Number(angle_to);
	    var brojac = 0;
	    while(piece.angle != Number(angle_from) && brojac < 8 ){
		piece.rotate(-s);
		brojac++;
	    }
	},
	deselect: function(where){
	    var w = from_where(where);
	    this.table[w.row][w.col].deactivate();
	},
	undeselect: function(where){
	    var w = from_where(where);
	    this.table[w.row][w.col].activate();
	},
	move: function(from,to){
	    console.log('in move');
	    var f = from_where(from);
	    var t = from_where(to);
	    this.slide_to(this.table[f.row][f.col],t);
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
	    that.undo_one(games,arr[i-1]);
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
	console.log(commands);
	commands[command].apply(games,arr);
    };
    return that;
}());
