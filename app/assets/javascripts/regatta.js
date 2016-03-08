function Regatta(n){
    var _table  = [];
    var i,k;
    var regatta = {
	table: _table 
    };
    for (i=0; i<n;i++){
	_table[i] = [];
	for(k=0; k < n; k++){
	    _table[i][k] = null;
	}
    }
    return regatta;
}


