/*
 * A quine table is a 3-dimensional array, just containing that rows with the 
 * result '1'. First item is the row itselv with all literals. 2nd item 
 * describes the position of "don't care" literals. and a marker if a match was
 * found.
 * 
 * The quine Object holds all tables, even the previous ones which already
 * become deprecated when the next table is calculated.
 * 
 */

// needs functions.js!
if (!Object.N3OFUNCZ){
	alert("functions.js needs to be embedded first!");
}
// -

function quine(matrix){
	this.tables = new Array();
	this.literalCount=0;
	this.matrix=matrix;
	this.empty=true;
	this.firstTable();
}

quine.prototype.getTable = function(index){
	if (!index) index=0;
	if (index >= this.tables.length || index < 0)
		return false;
	return this.tables[index];
}

quine.prototype.firstTable = function(){
	var matrix = this.matrix.slice(0); // shallow copy to not affect this.matrix
	var tmp = new Array();
	var max = matrix.max();
	
	// prepare the array with all possible literal counts
	for (i=0; i<max.literalCount(); i++)
		tmp[i] = new Array();
	
	for (i in matrix){
		var num = matrix[i];
		if (num>>1<<1 != num){ // just add if the last literal is a '1'
			tmp[(num>>1).oneLiteralCount()].push(
				new Array(num,0,0)
			);
			this.empty = false;
		};
	}
	this.tables.push(tmp);
	this.literalCount=max.literalCount();
	return tmp;
}

// returns true if an optimisation was found
quine.prototype.compare = function(){
	// use last table in stack
	var table=this.tables[this.tables.length-1].slice(0);
	var tmp=new Array();
	
	for (i=0; i<this.literalCount+1; i++)
		tmp[i] = new Array();
		
	var count=0; // to count how many times we found an optimisation
	
	for (idx in table){
		if (idx<=table.length-1){
			// select tables to compare
			var ta=table[idx];
			var tb=table[Number(idx)+1];
			
			// iterate over all term combinations to compare
			for (taidx in ta){
				var maska= ta[taidx][1]>>1;
				var terma= (ta[taidx][0]>>1);
				// there's a need to just match if d'c matches 
				// solve: delete the literal where an d'c has to be -> number became
				// one literal shorter 
				
				for (tbidx in tb){
					var maskb=tb[tbidx][1]>>1;
					var termb= (tb[tbidx][0]>>1) & ( ~maskb ); // remove d'c '1'
					var differentOnes=(terma^termb).oneLiteralCount();
					var resultingOneCount=taidx; // everytime the resulting term haz same
																			// count of one literals as the first one 
					
					if (differentOnes == 1){
						count++; // increment match count
						var mask=(terma^termb) | maska | maskb;
						
						// mark as matched terms
						table[idx][taidx][2]=1;
						table[Number(idx)+1][tbidx][2]=1;
						
						tmp[resultingOneCount].push(new Array(
							terma,
							mask<<1,
							0
						));
					} 
				}
			}
		}
	}
	
	// now add unmatching terms
	for (idx in table){
		for (tidx in table[idx]){
			if (table[idx][tidx][2] == 0) { // not marked as match
				tmp[idx].push(table[idx][tidx].slice(0));
				// i use slicing for a swallow copy to be sure a latr modification
				// of the source table does not has an effect on now generated  
			}
		}
	} 
	
	if (! count == 0)
		this.tables.push(tmp);
	
	return (count>0);
}

// triggers callback(bool canceled), when rdy 
quine.prototype.solve = function(callback){
	var maxSteps=10;
	var count=0;
	var res;
	do{
		res = this.compare();
		count++;
	} while (count<maxSteps && res > 0);
	
	callback( res );
}
