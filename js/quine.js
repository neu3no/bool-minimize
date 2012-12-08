/*
 * A quine table is a 2-dimensional array, just containing that rows with the 
 * result '1'. First item is the row itselv with all literals. 2nd item 
 * describes the position of "don't care" literals.
 * The 1st-level array gathers the terms with the literal count equal to it's 
 * index.
 * If no row results to '1' and has %idx% one literals, this index points
 * to an empty array.  
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
}

quine.prototype.firstTable = function(){
	var matrix = this.matrix.slice(0);
	var tmp = new Array();
	var max = matrix.max();
	
	// prepare the array with all possible literal counts
	for (i=0; i<max.literalCount(); i++)
		tmp[i] = new Array();
	
	for (i in matrix){
		var num = matrix[i];
		if (num>>1<<1 != num){ // just add if the last literal is a '1'
			tmp[(num>>1).oneLiteralCount()].push(
				new Array(num,0)
			);
			this.empty = false;
		};
	}
	this.tables.push(tmp);
	this.literalCount=max.literalCount();
	return tmp;
}

quine.prototype.compare = function(){
	var table=this.tables[this.tables.length-1].slice(0);
	var indexes=new Array();
	var tmp=new Array();
	
	for (idx in table){
		if (idx<=table.length-1){
			try {
				var ta=table[idx];
				var tb=table[Number(idx)+1];
				
				for (taidx in ta){
					for (tbidx in tb){
						if ((ta[taidx][0]-tb[tbidx][0]).oneLiteralCount() == 1){
							indexes.push(taidx); 	// mark this index
							indexes.push(tbidx);  // and this index
							tmp.push(new Array(
									ta[taidx],											/* first term, does just not 
																									   matter if first or second
																									   term is used */
									(ta[taidx][0]-tb[tbidx][0]))		// don't care mask
							);
						}
					}
				}
			} catch (e){
				console.log(e);
			}
		}
	}
}