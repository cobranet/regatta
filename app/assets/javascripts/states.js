var states = function (hint_id,done_id) {
    states = [0,1,2,3];
    done_state = [false,true,false,false]
    states_desc = [ "Expect placing tile or rotate your tile",
		    "You are in rotate after place do as long as you want",
		    "You are in rotate of existing tile which was in active position",
		    "You are to choose where to slide"]
    
    var s = {
	hint_id: hint_id,
	done_id: done_id,
	state: 0,
	hint: function(){
	    $(hint_id).text(states_desc[this.state]);
	},
	check: function(to){
	    if ( to == 1 && this.state == 0 ) {
		return true;
	    };
	    if ( to == 0 && this.state == 1 ) {
		return true;
	    };
	    if ( to == 2 && this.state == 0 ) {
		return true;
	    };

	    if ( to == 3 && this.state == 2 ) {
		return true;
	    };
	    
	    alert("Invalid new state");
	    return false;
	},
	change: function(to) {
	    if ( this.check(to)) {
		this.state = to;
		this.done(states[to]);
		this.hint();
	    }
	},
	done: function(show){
	    if (show) {
		$(done_id).show("slow");
	    } else {
		$(done_id).hide("slow");
	    }
	},

    };
    return s;
};
    
