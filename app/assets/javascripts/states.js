/*global $, alert */
var states = function (hint_id,done_id,new_move_id) {
    var done_state = [false,true, true, false,true, true];
    var new_move =   [false,false,false,false,false,true];
    var states_desc = [ "Expect placing tile or rotate your tile",
		    "You are in rotate after place do as long as you want but must",
		    "You are in rotate of existing tile which was in active position and you are now in inactive postition",
		    "You are to choose where to slide",
		    "You finished slide... Rotate in active stance then press done",
		    "You finished slide at inactive position .. You can make another move! or press done",
		    "You are in rotate of existing tile which was in active position and you are now in inactive postition",
		    "You lose..",
		    "You win!",
		  ];
    
    var s = {
	hint_id: hint_id,
	done_id: done_id,
	new_move_id: new_move_id,
	state: 0,
	on_move: 1,
	next_player: function(){
	    if (this.on_move === 1 ) {
		this.on_move = 0;
		return;
	    }
	    this.on_move = 1;
	},
	hint: function(){
	    var desc = states_desc[this.state];
	    desc = desc + " on move is " + this.on_move;
	    $(hint_id).text(desc);
	},
	check: function(to){
	    if ( to === 1 && this.state === 0 ) {
		return true;
	    }
	    if ( to === 0 && this.state === 1 ) {
		return true;
	    }
	    if ( to === 2 && this.state === 0 ) {
		return true;
	    }

	    if ( to === 3 && this.state === 2 ) {
		return true;
	    }

	    if ( to === 4 && this.state === 3 ) {
		return true;
	    }

	    if ( to === 0 && this.state === 4 ) {
		return true;
	    }

	    if ( to === 5 && this.state === 4 ) {
		return true;
	    }
	    if ( to === 6 && this.state === 2 ){
		return true;
	    }
	    if ( to === 4 && this.state === 2 ){
		return true;
	    }
	    if ( to === 5 && this.state === 3 ){
		return true;
	    }
	    if ( to === 0 && this.state === 5 ){
		return true;
	    }
	    
	    
	    
	    alert("Invalid new state : " +  to + " old state was " + this.state );
	    return false;
	},
	change: function(to) {
	    if ( this.check(to) === false ) {
		alert("No change to " + to );
		return;
	    }
	    if (this.state === 1 && to === 0 ) {
		this.next_player();
	    } 
	    if (this.state === 4 && to === 0) {
		this.next_player();
	    }
	    if ( this.state === 5 && to === 0 ){
		this.next_player();
	    }
	    this.state = to;
	    this.buttons(to);
	    this.hint();
	},
	buttons: function(to){
	    if (done_state[to]) {
		$(done_id).show("slow");
	    } else {
		$(done_id).hide("slow");
	    }
	    if (new_move[to]) {
		$(new_move_id).show("slow");
	    } else {
		$(new_move_id).hide("slow");
	    }
	    
	},

    };
    return s;
};
    
