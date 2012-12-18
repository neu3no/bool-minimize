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
if (!Object.N3OFUNCZ) {
	alert("functions.js needs to be embedded first!");
}
// -

function quine(matrix) {
	this.tables = new Array();
	this.literalCount = 0;
	this.matrix = matrix;
	this.empty = true;
	this.firstTable();
}

quine.prototype.getTable = function(index) {
	if (!index)
		index = 0;
	if (index >= this.tables.length || index < 0)
		return false;
	return this.tables[index];
}

quine.prototype.firstTable = function() {
	var matrix = this.matrix.slice(0);
	// shallow copy to not affect this.matrix
	var tmp = new Array();
	var max = matrix.max();

	// prepare the array with all possible literal counts
	for ( i = 0; i < max.literalCount(); i++)
		tmp[i] = new Array();

	for (i in matrix) {
		var num = matrix[i];
		if (num >> 1 << 1 != num) {// just add if the last literal is a '1'
			tmp[(num >> 1).oneLiteralCount()].push(new Array(num >> 1, 0, false));
			this.empty = false;
		};
	}
	this.tables.push(tmp);
	this.literalCount = max.literalCount();
	return tmp;
}
/* compare two terms, each have to be an array of this struct:
 * 	[ term_as_int, mask_as_int ]
 * returns the resulting term, / mask if match, 'false' if nomatch
 */
quine.prototype.compareTerms = function(terma, termb) {
	var maska = terma[1], maskb = termb[1];
	var maskeda, maskedb, difference;

	// first check if both have the same positions of don't care literals
	if (maska == maskb) {
		maskeda = terma[0] & ~(maska);
		maskedb = termb[0] & ~(maska);

		//XOR both terms where the one literals on don't care positions are removed
		difference = maskeda ^ maskedb;

		//now count the number of different ones, if it is just one we have a match
		if (difference.oneLiteralCount() == 1) {
			return new Array(terma[0], // the first term can be assumed as the new one
			maska | difference, // the new mask is the old with additional the diff
			0	// set the marker to 0
			);
		}
	}
	return false;
};

// returns true if an optimisation was found
quine.prototype.compare = function() {
	// use last table in stack
	var table = this.tables[this.tables.length - 1].slice(0);
	var tmp = new Array();
	var have = new Array();
	// just to remember which terms alrdy added

	for ( i = 0; i < this.literalCount; i++)
		tmp[i] = new Array();

	var count = 0;
	// to count how many times we found an optimisation

	for (var idx = 0; idx < table.length - 1; idx++) {
		for (teAidx in table[idx]) {
			for (teBidx in table[idx + 1]) {
				var match = this.compareTerms(table[idx][teAidx], table[idx+1][teBidx]);

				// js cannot compare arrays so i needed to find a workaround
				// solution: append the mask to the term, so make it comparable
				var map = (match[0] << this.literalCount) + match[1];

				// if there's a match and this match is not equal to a previous one
				if (match) {
					// mark the two terms
					table[idx  ][teAidx][2] = true;
					table[idx+1][teBidx][2] = true;

					if (have.indexOf(map) == -1) {
						// append the match to the temp table
						// we can assume the weight of this match is equal to the first
						// index
						tmp[idx].push(match);

						// remember that this term is alrdy added to not duplicate add
						// push returns the current count so we now also know the match cnt
						count = have.push(map);
					}
				}
			}
		}
	}

	// now add unmatching terms
	for (idx in table) {
		for (tidx in table[idx]) {
			if (table[idx][tidx][2] == false) {// not marked as match
				//console.log("NOMATCH",idx,tidx)
				tmp[idx].push(table[idx][tidx].slice(0));
				// i use slicing for a swallow copy to be sure a latr modification
				// of the source table does not has an effect on it
			}
		}
	}

	if (!count == 0)
		this.tables.push(tmp);

	return (count > 0);
}


// triggers callback(bool canceled), when rdy
quine.prototype.solve = function(callback) {
	var maxSteps = 10;
	var count = 0;
	var res;
	do {
		res = this.compare();
		count++;
	} while (count<maxSteps && res);

	callback(res);
}
