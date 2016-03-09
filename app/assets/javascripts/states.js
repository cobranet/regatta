/*global $, alert */
var states = function (hint_id,done_id,new_move_id,activate_id,pick_id,do_nothing_id) {
    var state_ids = ["PLACE_OR_ROTATE", // 0
                     "ROT_AFTER_PLACE",  // 1
                     "ROT_ACTIVE",  // 2
                     "WHERE_TO_SLIDE", // 3
                     "AFTER_SLIDE_ACTIVE", // 4
                     "AFTER_SLIDE_INACTIVE", // 5
                     "AT_NEW_CHOOSE_TO_ACTIVATE", // 6
		     "ROTATE_AFTER_ACTIVATE", // 7 
		    ];
                       
    var all = [ { id: "PLACE_OR_ROTATE",
		  done_inactive: false,
		  done_active: false,
		  new_move: false,
		  desc: "Expect placing tile or rotate your tile" },
		{ id: "ROT_AFTER_PLACE",
		  done_inactive: false,
		  done_active: true,
		  new_move: false,
		  desc: "You are in rotate after place do as long as you want but must end in active" },
		{ id: "ROT_ACTIVE",
		  done_inactive: true,
		  done_active: false,
		  new_move: false,
		  desc: "You are in rotate of existing tile which was in active position and you must end in inactive position" },
		{ id: "WHERE_TO_SLIDE",
		  done_inactive: false,
		  done_active: false,
		  new_move: false,
		  desc: "You are to choose where to slide"},
		{ id: "AFTER_SLIDE_ACTIVE",
		  done_inactive: false,
		  done_active: true,
		  new_move: false,
		  desc: "You finished slide... Rotate in active stance then press done"},
		{ id: "AFTER_SLIDE_INACTIVE",
		  done_inactive: false,
		  done_active: false,
		  new_move: true,
		  desc: "You finished slide at inactive position .. You can make another move! or press done"},
		{ id: "AT_NEW_CHOOSE_TO_ACTIVATE",
		  done_inactive: false,
		  done_active: true,
		  new_move: false,
		  desc: "Choose piece to activate"},
		{ id: "ROTATE_AFTER_ACTIVATE",
		  done_inactive: true,
		  done_active: false,
		  new_move: false,
		  desc: "Roatate and finish at active state."}

	      ];
                
    

    
    var s = {
	hint_id: hint_id,
	done_id: done_id,
	new_move_id: new_move_id,
	pick_id: pick_id,
	activate_id: activate_id,
	do_nothing_id: do_nothing_id,
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
	    var desc = all[this.state].desc;
	    desc = desc + " on move is " + this.on_move;
	    $(hint_id).text(desc);
	},
	get_state: function(){
	    return all[this.state].id;
	},
	change: function(to,is_active) {
	    var to_ind;
	    if (typeof to === 'string' ) {
		to_ind = state_ids.indexOf(to);
	    } else {
		to_ind = to;
	    }

	    if (all[to_ind].id === 'PLACE_OR_ROTATE' && all[this.state].new_move === false  ){
		this.next_player();
	    }
	    this.state = to_ind;
	    this.buttons(to,is_active);
	    this.hint();
	},
	buttons: function(to,is_active){
	    var to_ind;
	    if (typeof to === 'string' ) {
		to_ind = state_ids.indexOf(to);
	    } else {
		to_ind = to;
	    }
	    if (is_active === false ) {
		if (all[to_ind].done_inactive) {
		    $(done_id).show();
		} else {
		    $(done_id).hide();
		}
	    } else {
		if (all[to_ind].done_active ) {
		    $(done_id).show();
		} else {
		    $(done_id).hide();
		}
	    }
	    if (all[to_ind].new_move) {
		$(new_move_id).show();
		$(pick_id).show();
		$(activate_id).show();
		$(do_nothing_id).show();
	    } else {
		$(new_move_id).hide();
		$(pick_id).hide();
		$(activate_id).hide();
		$(do_nothing_id).hide();
	    }
	    
	},

    };
    return s;
};
    
