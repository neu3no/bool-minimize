// some extensions for javascript needed 

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
    					var num = 0+this;
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
					var number = 0+this;
					var ret=0;
					while(number>0){
						var c=number>>1<<1;	// shift one bit right and back, cuts the last binary digit
					 	ret=ret+number-c;
					 	number=number>>1;	// now go on without the last digit 
					}
					return ret;
				}
});

// i just not wanted to add such a weird function to object prototype ....

function decToBin(number){
	var a="";
	while (number>0){
		var c=number>>1<<1;	// shift one bit right and back, cuts the last binary digit
	  a=(number-c).toString()+a; // prepand the difference between the masked
	  													 // and unmasked number as digit 
	 	number=number>>1;	// now go on without the last digit 
	}
	return a;
}

// we need logarithm to the base 2 sometimes but 'Math.log' calculates to the 
// base e. but by definition any logarithm can be represented by any other 
// like that  log_base = log_n(x) / log_n(base)
Math.log2 = function(number){
	return Math.log(number)/Math.log(2);
};

