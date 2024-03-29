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
* unspecific user interface objects which need to be dynamicaly created
* ***************************************************************************
* sourceTable := basic table for the user to pass the values of the desired
* 								bool function. It floods automagically the input rows with
* 								'1' and '0' in a well known pattern.
*
*/

// needs functions.js!
if (!Object.N3OFUNCZ) {
	alert("functions.js needs to be embedded first!");
}
// -

function pITable(parent, quinetable) {
	this.parent = parent;
	this.quineTable = quinetable;
	this.currentchart = 0;
	this.labels = {
		0 : "plain chart",
		1 : "columns optimized",
		2 : "rows optimized"
	};
	pitable = this;
	// at first check if a prime implicant table exists, if yes remove
	$("#pitable").remove();

	this.table = $("<table/>");

	// create objects for the main table elements
	this.caption = $("<caption/>");
	this.thead = $("<thead/>");
	this.tbody = $("<tbody/>");

	// add ids / classes / attributes
	$(this.table).attr("id", "pitable");
	$(this.thead).addClass("dark");

	// buttons ...
	this.spanCurrent = $("<span/>");
	this.buttonPrevious = $("<button/>");
	this.buttonNext = $("<button/>");

	// form caption
	$(this.buttonPrevious).html("&lt;");
	$(this.buttonNext).html("&gt;");

	$(this.caption)
		.append(this.buttonPrevious)
		.append(this.spanCurrent)
		.append(this.buttonNext);

	// append the elements to the html structure
	$(this.table)
		.append(this.caption)
		.append(this.thead)
		.append(this.tbody);

	// events
	$(this.buttonNext).click(this.nextChart);
	$(this.buttonPrevious).click(this.previousChart);

	$(this.parent).append(this.table);
	this.fillChart(this.currentchart);
	return this;
}

pITable.prototype.nextChart = function() {
	pitable.fillChart(pitable.currentchart + 1);
};

pITable.prototype.previousChart = function() {
	pitable.fillChart(pitable.currentchart - 1);
};

pITable.prototype.fillChart = function(chartNum) {
	pichart = this.quineTable.getPIChart(chartNum);

	if (!pichart)
		return false;
	else {
		this.cols = pichart.mint.length;

		var text = this.labels[chartNum > 0 ? ((chartNum - 1) % 2) + 1 : 0];
		$(this.spanCurrent).text(text);
		this.currentchart = chartNum;

		var trh = $("<tr/>");
		trh
		.append("<td/>");

		for (coli in pichart.cols) {
			var tool = decToBin(coli, this.quineTable.literalCount - 1) + "b";
			var txt = coli;
			trh
		.append($("<th/>").text(txt).attr("title", tool));
		}

		$(this.tbody).html("");
		for (rowi in pichart.rows) {
			var tr = $("<tr/>");
			var row = pichart.rows[rowi];

			// meanwhile an array was used as index javascript converted that array
			// automagicaly to a string with a ',' as seperator, nice eh?
			rowi = rowi.split(",");
			tr.append(
				$("<th/>").text(
					maskedDecToBin(rowi[0], rowi[1], this.quineTable.literalCount - 1)
				).addClass("dark")
			);

			for (coli in pichart.cols) {
				var col = pichart.cols[coli];
				var text = (row.indexOf(Number(coli)) >= 0 ? "X" : " "
				);
				tr.append($("<td/>").text(text));
			}
			this.tbody
		.append(tr);
		}
		$(this.thead).html("");
		$(this.thead)
		.append(trh);
	}
};

function targetTable(parent, quinetable) {
	this.quineTable = quinetable;
	this.currentTableNum = 0;
	ttable = this;
	// at first check if a target table exists, if yes remove
	$("#targettable").remove();

	this.parent = parent;
	this.table = $("<table/>");
	this.cols = quinetable.literalCount;

	// create objects for the main table elements
	this.caption = $("<caption/>");
	this.thead = $("<thead/>");
	this.tbody = $("<tbody/>");

	// table selection
	this.spanCurrent = $("<span/>");
	this.buttonPrevious = $("<button/>");
	this.buttonNext = $("<button/>");

	// form caption
	$(this.buttonPrevious).html("&lt;");
	$(this.buttonNext).html("&gt;");

	$(this.caption)
		.append(this.buttonPrevious)
		.append(this.spanCurrent)
		.append(this.buttonNext);

	// append the elements to the html structure
	$(this.table)
		.append(this.caption)
		.append(this.thead)
		.append(this.tbody);

	// events
	$(this.buttonNext).click(this.nextTable);
	$(this.buttonPrevious).click(this.previousTable);

	// add ids / classes / attributes
	$(this.table).attr("id", "targettable");
	$(this.thead).addClass("dark");

	for ( j = 0; j < this.cols - 1; j++)
		this.thead
		.append("<th>x" + (j + 1) + "</th>");

	this.fillTable(0);
	// append the whole table to the parent givin by new();
	$(this.parent)
		.append(this.table);
	return this;
}

targetTable.prototype.fillTable = function(tableNum) {

	var matrix = this.quineTable.getTable(tableNum);

	if (!matrix)
		return false;
	// for a non existing index it returns false
	else {
		$(this.spanCurrent).text(tableNum + 1);
		$(this.tbody).html("");
		// clear the tbody

		// fill the body
		for (tidx in matrix) {
			var trh = $("<tr/>");
			trh
		.append("<th class='dark' colspan='" + this.cols + 2 + "'></th>");
			this.tbody
		.append(trh);
			var tmpm = matrix[tidx];

			for (vidx in tmpm) {
				var tr = $("<tr/>");
				var bin = maskedDecToBin(
						tmpm[vidx][0], tmpm[vidx][1], 
							this.quineTable.literalCount - 1
						);
				for ( j = 0; j < this.cols - 1; j++)
					tr.append("<td>" + bin[j] + "</td>");
				this.tbody.append(tr);
			}
		}
		$(this.parent).css('min-width', $(this.table).width());
		this.currentTable = tableNum;
	}
}

targetTable.prototype.nextTable = function() {
	ttable.fillTable(ttable.currentTable + 1);
};

targetTable.prototype.previousTable = function() {
	ttable.fillTable(ttable.currentTable - 1);
};

// SOURCE TABLE

function sourceTable(parent, inputs) {
	this.table = $("<table/>");
	this.inputCount = ( inputs ? inputs : 3 );
	this.parent = parent;
	this.values = [];
	this.fillMode = 'rand';
	var stable = this;
	// workaround for the scope of events, which replace 'this'

	// create objects for the main table elements
	this.caption = $("<caption/>");
	this.thead = $("<thead/>");
	this.tbody = $("<tbody/>");

	// create objects for the caption elements
	this.spanInputCount = $("<span/>");
	this.buttonInputAdd = $("<button/>");
	this.buttonInputRemove = $("<button/>");
	this.buttonYZero = $("<button/>").addClass('modebtn');
	this.buttonYOne = $("<button/>").addClass('modebtn');
	this.buttonYRand = $("<button/>").addClass('modebtn').addClass("active");
	this.buttonFire = $("<button/>");

	// add ids / classes / attributes
	$(this.table).attr("id", "sourcetable");
	$(this.thead).addClass("dark");

	// form the caption
	$(this.buttonInputAdd).text("+");
	$(this.buttonInputRemove).text("-");
	$(this.buttonYZero).text("0");
	$(this.buttonYOne).text("1");
	$(this.buttonYRand).text("r");
	$(this.buttonFire).text("go");

	$(this.caption)
		.append(this.buttonInputRemove)
		.append(this.spanInputCount)
		.append(this.buttonInputAdd)
		.append("<span>|</span>")
		.append(this.buttonYZero)
		.append(this.buttonYOne)
		.append(this.buttonYRand)
		.append("<span>|</span>")
		.append(this.buttonFire);

	// append the elements to the html structure
	$(this.table)
		.append(this.caption)
		.append(this.thead)
		.append(this.tbody);

	// bind events
	$(this.buttonInputAdd).click(this.addInput);
	$(this.buttonInputRemove).click(this.removeInput);
	$(this.buttonFire).click(function() {
		stable.fire();
	});

	$(this.buttonYZero).click(function() {
		stable.fillMode = 'zero';
		stable.tablefill();
		$(".modebtn").removeClass('active');
		$(this).addClass('active');
	});
	$(this.buttonYOne).click(function() {
		stable.fillMode = 'one';
		stable.tablefill();
		$(".modebtn").removeClass('active');
		$(this).addClass('active');
	});
	$(this.buttonYRand).click(function() {
		stable.fillMode = 'rand';
		stable.tablefill();
		$(".modebtn").removeClass('active');
		$(this).addClass('active');
	});

	// append the whole table to the parent givin by new();
	$(this.parent).append(this.table);

	// initially fill the table
	this.tablefill();

	return this;
};

// preload should be an array of literals or a string
sourceTable.prototype.tablefill = function(preload) {
	var cols = this.inputCount;
	var rows = Math.pow(2, cols);
	this.values = new Array(rows);
	// reset the head and body
	this.tbody.empty();
	this.thead.empty();

	// fill the head
	for ( j = 0; j < cols; j++)
		this.thead
		.append("<th>x" + (j + 1) + "</th>");
	this.thead
		.append("<th>y</th>");

	// fill the body
	for ( i = 0; i < rows; i++) {
		var tr = $("<tr/>");
		var bin = decToBin(i);
		var val;
		while (bin.length < cols)
		bin = "0" + bin;

		for ( j = 0; j < cols; j++)
			tr
		.append("<td>" + bin[j] + "</td>");

		// the y-value wich should be edited by the user
		if (preload && preload.length >= rows) {
			val = Number(preload[i]);
		} else {
			switch (this.fillMode) {
				case "rand":
					val = Math.round(Math.random());
					break;
				case "one":
					val = 1;
					break;
				case "zero":
					val = 0;
					break;
				default:
					alert("wrong fill mode");
			}
		}
		var input = $("<input maxlength='1' type='text' value='" + val + "'/>");
		input.attr("rel", i);
		input.change(this.checkYVal);

		tr
		.append($("<td class='yval'></td>")
		.append(input));
		this.tbody
		.append(tr);
		this.values[i] = (i << 1) + val;
	}

	$(this.spanInputCount).text(this.inputCount);
	$(this.parent).css('min-width', $(this.table).width());
	this.newTable(this.values);
};

sourceTable.prototype.checkYVal = function(elem) {

	if (!elem.attr)
		elem = this;
	var index = Number($(elem).attr('rel'));

	if ($(elem).val() >= 1) {
		$(elem).val(1);
	} else {
		$(elem).val(0);
	}

	stable.values[index] = (index << 1) + Number($(elem).val());
	stable.changed(stable.values);
};

sourceTable.prototype.addInput = function() {
	if (stable.inputCount < 8) {
		stable.inputCount++;
		stable.tablefill();
	}
};

sourceTable.prototype.removeInput = function() {
	if (stable.inputCount > 2) {
		stable.inputCount--;
		stable.tablefill();
	}
};

sourceTable.prototype.getMatrix = function() {
	return this.values;
};

// Placeholder for events, override from outside

sourceTable.prototype.changed = function(arr) {
};

sourceTable.prototype.newTable = function() {
};

sourceTable.prototype.fire = function() {
};

