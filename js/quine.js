/*
 * Author
 * 	Christian Neubauer
 *  web: http://neu3no.de/ 	twitter: @neu3no  mail: the@neu3no.de
 *  	
 * Licence
 *  (cc-by-nc) 2012 
 * 	This work is licensed under the Creative Commons Attribution-NonCommercial 
 *  3.0 Unported License. To view a copy of this license, visit 
 *  http://creativecommons.org/licenses/by-nc/3.0/.
 * 
 * Project
 * 	website: http://neu3no.de/bool-minimize
 *  github : https://github.com/neu3no/bool-minimize
 * 
 */

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
	this.picharts = new Array();
	this.literalCount = 0;
	this.termcount = 0;
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

	this.termcount = count;
	// now add unmatching terms
	for (idx in table) {
		for (tidx in table[idx]) {
			if (table[idx][tidx][2] == false) {// not marked as match
				tmp[idx].push(table[idx][tidx].slice(0));
				// i use slicing for a swallow copy to be sure a latr modification
				// of the source table does not has an effect on it
				this.termcount++;
			}
		}
	}

	if (!count == 0)
		this.tables.push(tmp);

	return (count > 0);
}
// get all possible combinations of one literals allowed by number and mask
// returns an array of numbers which represent the binary solutions
quine.prototype.pILine = function(number, mask) {
	var res = [];
	// see function,js
	var mpowp = mask.twoPowPartition();

	// we need to count up binary to get all possible comb.
	for ( i = 0; i < Math.pow(2, mpowp.length); i++) {
		var num = 0 + i;
		var pos = 0;
		var idx = 0;
		// check the digets if there's a '1' on last pos.
		while (num > 0) {
			if (num % 2 > 0) {// if there is one, add it to the solution
				idx += mpowp[pos];
			}
			pos++;
			num >>= 1;
		}
		res.push(number | idx);
		// number OR idx returns the complete result
	}
	return res;
};

// generate a prime implicant chart of the last table
quine.prototype.pIChart = function() {
	var res = {
		'mint' : new Array(),
		'rows' : {},
		'cols' : {}
	};
	// use last table in stack
	var table = this.tables[this.tables.length - 1].slice(0);

	for (tidx in table) {
		var part = table[tidx].slice(0);

		while (part.length > 0) {
			var item = part.shift();
			var number = item[0];
			var mask = item[1];
			var pILine = this.pILine(number, mask);

			res.mint = res.mint.concat(pILine).unique();

			// assign the implicants to the terms
			res.rows[new Array(number, mask)] = pILine;

			// assign the terms to the implicants
			for (m in pILine) {
				if (res.cols[pILine[m]] == undefined)
					res.cols[pILine[m]] = new Array();
				res.cols[pILine[m]].push(new Array(number, mask));
			}
		}
	}
	this.picharts.push(res);
	return res;
}

quine.prototype.pIChartRowDominance = function() {
	var chart = {
		'mint' : new Array(),
		'rows' : {},
		'cols' : {}
	};
	var srcchart = this.picharts[this.picharts.length - 1];
	var matches = 0;

	chart.mint = srcchart.mint.slice(0);
	for (i in srcchart.rows) {
		chart.rows[i] = srcchart.rows[i].slice(0);
	}
	for (i in srcchart.cols) {
		chart.cols[i] = srcchart.cols[i].slice(0);
	}

	for (ri in chart.rows) {
		// at first: remove empty lines
		if (chart.rows[ri].length == 0) {
			delete chart.rows[ri];
			matches++;
		}
		// then remove all lines which are includes in others
		for (rib in chart.rows) {
			if (rib != ri && chart.rows[ri] != undefined && chart.rows[rib] != undefined) {
				if (chart.rows[ri].containsEachArray(chart.rows[rib])) {
					delete chart.rows[rib];
					matches++;

					// just ... make cols clean
					for (coli in chart.cols) {
						var cols = chart.cols[coli].slice(0);
						chart.cols[coli] = new Array();
						for (ai in cols) {
							var col = cols[ai];
							if (rib != col) {
								chart.cols[coli].push(col);
							}
						}
					}

				}

			}

		}

	}

	if (matches > 0) {
		this.picharts.push(chart);
		//console.log(this.picharts);
		return true;
	}
	return false;
}

quine.prototype.pIChartColumnDominance = function() {
	var chart = {
		'mint' : new Array(),
		'rows' : {},
		'cols' : {}
	};
	var srcchart = this.picharts[this.picharts.length - 1];
	var orderedcols = {};
	var min = this.termcount;
	var max = 0;
	var deleted = new Array();
	var matches = 0;

	chart.mint = srcchart.mint.slice(0);
	for (i in srcchart.rows) {
		chart.rows[i] = srcchart.rows[i].slice(0);
	}
	for (i in srcchart.cols) {
		chart.cols[i] = srcchart.cols[i].slice(0);
	}

	// order by count of "X" in column
	for (coli in chart.cols) {
		var idx = chart.cols[coli].length;
		if (orderedcols[idx] == undefined)
			orderedcols[idx] = new Array();
		orderedcols[idx].push(coli);
	}

	// get lowest
	for (i in orderedcols) {
		if (Number(i) < min)
			min = Number(i);
		if (Number(i) > max)
			max = Number(i);
	}

	// compare each col with lidx X's and lidx+1 X's
	for ( lidx = min; lidx < this.termcount; lidx++) {
		if (orderedcols[lidx] == undefined)
			continue;
		for ( a = 0; a < orderedcols[lidx].length; a++) {
			var ai = orderedcols[lidx][a];
			for ( b = a + 1; b < orderedcols[lidx].length; b++) {
				var bi = orderedcols[lidx][b];
				if (
						chart.cols[bi] != undefined && // we may have removed that alrdy
						chart.cols[ai] != undefined && 
						chart.cols[bi].containsEachArray(chart.cols[ai]) && 
						chart.cols[ai].containsEachArray(chart.cols[bi])) {
					// matched, so remove this column
					delete chart.cols[bi];
					matches = deleted.push(Number(bi));
				}
			}
		}

		for ( hidx = lidx + 1; hidx < this.termcount + 1; hidx++) {

			// skip if one is undefined
			if (orderedcols[lidx] == undefined || orderedcols[hidx] == undefined)
				continue;

			for (leii in orderedcols[lidx]) {
				var lei = orderedcols[lidx][leii];
				// the low element index
				for (heii in orderedcols[hidx]) {
					var hei = orderedcols[hidx][heii];
					// the heigh element index

					// now have a look if all terms of the lower index element are
					// contained in the high index element
					if (chart.cols[hei] != undefined && // we may have removed that alrdy
					chart.cols[hei].containsEachArray(chart.cols[lei])) {
						// matched, so remove this column
						delete chart.cols[hei];
						matches = deleted.push(Number(hei));
					}
				}
			}
		}
	}

	// clean the rows, remove the deleted indexes

	for (ri in chart.rows) {
		var trow = chart.rows[ri].slice(0);
		chart.rows[ri] = new Array();

		for (vi in trow) {
			if (deleted.indexOf(trow[vi]) == -1) {
				chart.rows[ri].push(Number(trow[vi]));
			}
		}
	}

	if (matches > 0) {
		this.picharts.push(chart);
		return true;
	}
	return false;
};

quine.prototype.getPIChart = function(index) {
	if (!index)
		index = 0;
	if (index >= this.picharts.length || index < 0)
		return false;
	return this.picharts[index];
};

quine.prototype.getPITerms = function(){
	var chart=this.picharts[this.picharts.length - 1];
	var res = new Array();
	for (ci in chart.cols){
		for (ai in chart.cols[ci]){
			res.push(chart.cols[ci][ai]);
		}
	}
	return res;
}

// triggers callback(bool canceled), when rdy
quine.prototype.solve = function(callback) {
	var maxSteps = 10;
	var count = 0;
	var res;

	// Step 1: find prime implicants
	do {
		res = this.compare();
		count++;
	} while (count<maxSteps && res);

	// generate prime implicant chart
	this.pIChart();

	count = 0;
	do {
		// dominance test 1
		res = this.pIChartColumnDominance();

		// dominance test 2
		res = res || this.pIChartRowDominance();
		count++;
	} while (count < maxSteps && res);

	callback(res);
}
