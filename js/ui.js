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

	$(this.caption).append(this.buttonPrevious).append(this.spanCurrent).append(this.buttonNext);

	// append the elements to the html structure
	$(this.table).append(this.caption).append(this.thead).append(this.tbody);

	// events
	$(this.buttonNext).click(this.nextTable);
	$(this.buttonPrevious).click(this.previousTable);

	// add ids / classes / attributes
	$(this.table).attr("id", "targettable");
	$(this.thead).addClass("dark");

	for ( j = 0; j < this.cols - 1; j++)
		this.thead.append("<th>x" + (j + 1) + "</th>");

	this.fillTable(0);
	// append the whole table to the parent givin by new();
	$(this.parent).append(this.table);
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
			trh.append("<th class='dark' colspan='" + this.cols + 2 + "'></th>");
			this.tbody.append(trh);
			var tmpm = matrix[tidx];

			for (vidx in tmpm) {
				var tr = $("<tr/>");
				var bin = maskedDecToBin(
						tmpm[vidx][0]>>1, 
						tmpm[vidx][1]>>1, 
						this.quineTable.literalCount-1
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

function sourceTable(parent) {
	this.table = $("<table/>");
	this.inputCount = 2;
	this.parent = parent;
	this.values = [];
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
	this.buttonFire = $("<button/>");

	// add ids / classes / attributes
	$(this.table).attr("id", "sourcetable");
	$(this.thead).addClass("dark");

	// form the caption
	$(this.buttonInputAdd).text("+");
	$(this.buttonInputRemove).text("-");
	$(this.buttonFire).text("go");
	$(this.caption).append(this.spanInputCount).append(this.buttonInputRemove).append(this.buttonInputAdd).append(this.buttonFire);

	// append the elements to the html structure
	$(this.table).append(this.caption).append(this.thead).append(this.tbody);

	// bind events
	$(this.buttonInputAdd).click(this.addInput);
	$(this.buttonInputRemove).click(this.removeInput);
	$(this.buttonFire).click(function() {
		stable.fire();
	});

	// append the whole table to the parent givin by new();
	$(this.parent).append(this.table);

	// initially fill the table
	this.tablefill();

	return this;
};

sourceTable.prototype.tablefill = function() {
	var cols = this.inputCount;
	var rows = Math.pow(2, cols);
	this.values = new Array(rows);
	// reset the head and body
	this.tbody.empty();
	this.thead.empty();

	// fill the head
	for ( j = 0; j < cols; j++)
		this.thead.append("<th>x" + (j + 1) + "</th>");
	this.thead.append("<th>y</th>");

	// fill the body
	for ( i = 0; i < rows; i++) {
		var tr = $("<tr/>");
		var bin = decToBin(i);
		while (bin.length < cols)
		bin = "0" + bin;

		for ( j = 0; j < cols; j++)
			tr.append("<td>" + bin[j] + "</td>");

		// the y-value wich should be edited by the user
		var val = Math.round(Math.random());
		var input = $("<input maxlength='1' type='text' value='" + val + "'/>");
		input.attr("rel", i);
		input.change(this.checkYVal);

		tr.append($("<td class='yval'></td>").append(input));
		this.tbody.append(tr);
		this.values[i] = (i << 1) + val;
	}

	$(this.spanInputCount).text("inputs: " + this.inputCount);
	$(this.parent).css('min-width', $(this.table).width());
	this.newTable();
};

sourceTable.prototype.checkYVal = function() {
	var index = Number($(this).attr('rel'));

	if ($(this).val() >= 1) {
		$(this).val(1);
	} else {
		$(this).val(0);
	}

	stable.values[index] = (index << 1) + Number($(this).val());
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

