// some extensions for javascript needed 

// Properties
Object.defineProperty(Object.prototype, 'N3OFUNCZ', {
		enumerable: false, 
		value: true
});

Object.defineProperty(Array.prototype, 'max',{
	enumeable: false,
	value:	function(){
						if (this.length>0){
							var tmp;
							tmp = this[0];
							for (idx in this){
								if (this[idx]>tmp)
									tmp=this[idx];
							}
							return tmp;
						}
						return -1;
					}
});

Object.defineProperty(Number.prototype, "literalCount", {
    enumerable: false,
    value:	function() {
    					var num = 0+this; // shallow copy to avoid to get a clone
  						var tmp=0;
							while (num>0){
								num=num>>1;
								tmp++;
							}
							return tmp;
						}
});
Object.defineProperty(Number.prototype, "oneLiteralCount", {
	enumerable: false,
	value: function(){
					var number = 0+this; // shallow copy to avoid to get a clone
					var ret=0;
					while(number>0){
						var c=number>>1<<1;	// shift one bit right and back->cut last digit
					 	ret=ret+number-c; // (number-c) results to one if there was a one
					 	number>>=1;	// now go on without the last digit 
					}
					return ret;
				}
});

// decomposition of the number in powers of two 
Object.defineProperty(Number.prototype, "twoPowPartition",{
	enumerable: false,
	value: function(){
		var res = new Array();
		var pow = 1;
		var num = 0+this; // shallow copy to avoid to get a clone
		while (num > 0){
			// shift right and left again to remove last literal, if the number was 
			// odd the result differs from num, so there was a literal.
			if (num >> 1 << 1 != num) {
				res.push(pow);
			}
			pow<<=1; // the next power of two
			num>>=1; // divide by two
		}
		return res;
	}
});

Object.defineProperty(Object.prototype, "firstIndex", {
		enumerable: false,
		value: function(){
			var res;
			for (res in this){
				break;
			}
			return res;
		}
});
// Functions
// Array Remove - By John Resig (MIT Licensed)
Object.defineProperty(Array.prototype, "remove", {
		enumerable: false,
		value:function(from, to) {
		  var rest = this.slice((to || from) + 1 || this.length);
		  this.length = from < 0 ? this.length + from : from;
		  return this.push.apply(this, rest);
	  }
});

Object.defineProperty(Array.prototype, "removeValue", {
		enumerable: false,
		value:function(val) {
			var idx=this.indexOf(val);
			return (idx>-1 ? this.remove(idx) : this);
	  }
});


// not my idea, copied from http://stackoverflow.com/questions/6315180/javascript-search-array-of-arrays
Object.defineProperty(Array.prototype, "containsArray", {
		enumerable: false,
		value: function(val) {
	    var hash = {};
	    for(var i=0; i<this.length; i++) {
	        hash[this[i]] = i;
	    }
	    return hash.hasOwnProperty(val);
   	}
});

// extends containsArray
Object.defineProperty(Array.prototype, "containsEachArray", {
		enumerable: false,
		value: function(val) {
	    var res=true;
	    for (idx in val){
	    	var arr=val[idx];
	    	res&=this.containsArray(arr);
	    }
	    return res;
   	}
});

// return an uniqued copy of the current array
Object.defineProperty(Array.prototype, "unique", {
	enumerable : false,
	value: function(){
		var ret=[];
		var src=this.slice(0); // shallow copy
		while (src.length > 0){
			var popped = src.shift(); // like pop but poppes the first element 
			// indexOf returns -1 if the object cannot be found
			if (ret.indexOf(popped) < 0 ) {
				ret.push(popped);
			}
		}
		return ret;
	}
});

// i just not wanted to add such an ugly function to object prototype ....
function decToBin(number,minlen){
	var a="";
	while (number>0){
		var c=number>>1<<1;	// shift one bit right and back, cuts the last binary digit
	  a=(number-c).toString()+a; // prepand the difference between the masked
	  													 // and unmasked number as digit 
	 	number=number>>1;	// now go on without the last digit 
	}
	while (a.length<minlen) a = "0" + a;
	return a;
}

function maskedDecToBin(number, mask, minlen){
	var bin = decToBin(number,minlen);
	var msk = decToBin(mask  ,minlen);
	var res = "";
	
	for (i=0; i<bin.length; i++){
		if (msk[i]=="1"){
			res += "-";
		} else {
			res += bin[i];
		}
	}
	while (res.length<minlen) res = "0" + res;
	return res;
}

// we need logarithm to the base 2 sometimes but 'Math.log' calculates to the 
// base e. but by definition any logarithm can be represented by any other 
// like that  log_base = log_n(x) / log_n(base)
Math.log2 = function(number){
	return Math.log(number)/Math.log(2);
};


