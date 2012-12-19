// needs functions.js!
if (!Object.N3OFUNCZ) {
	alert("functions.js needs to be embedded first!");
}
// -

var S_OR = "+";
var S_AND = "•";
var S_NOT = "¬";
var aniindex = 0;
var scenes = {
	0 : {
		"#source" : {
			"display" : "block",
			"visibility" : "visible",
			"width" : "100%",
			"float" : "none"
		},
		"#target" : {
			"display" : "none",
			"visibility" : "hidden",
			"width" : "0",
			"float" : "none"
		},
		"#chart" : {
			"display" : "none",
			"visibility" : "hidden",
			"width" : "0",
			"float" : "none"
		},
		"#navTarget" : {
			"cursor":"default",
			"opacity": "0.25"
		},
		"#navChart" : {
			"cursor":"default",
			"opacity": "0.25"
		}
	},
	1 : {
		"#source" : {
			"display" : "block",
			"visibility" : "visible",
			"width" : "39%",
			"float" : "left"
		},
		"#target" : {
			"display" : "block",
			"visibility" : "visible",
			"width" : "59%",
			"float" : "right"
		},
		"#chart" : {
			"display" : "none",
			"visibility" : "hidden",
			"width" : "0",
			"float" : "none"
		},
		"#navTarget" : {
			"cursor":"pointer",
			"opacity": "1"
		},
		"#navChart" : {
			"cursor":"pointer",
			"opacity": "1"
		}
	},
	2 : {
		"#target" : {
			"display" : "block",
			"visibility" : "visible",
			"width" : "39%",
			"float" : "left"
		},
		"#chart" : {
			"display" : "block",
			"visibility" : "visible",
			"width" : "59%",
			"float" : "right"
		},
		"#source" : {
			"display" : "none",
			"visibility" : "hidden",
			"width" : "0",
			"float" : "none"
		},
		"#navTarget" : {
			"cursor":"pointer",
			"opacity": "1"
		},
		"#navChart" : {
			"cursor":"pointer",
			"opacity": "1"
		}
	}
};

/* ************************************************************************* */
var loadScene = function(index) {
	var scene = scenes[index];
	for (elementname in scene) {
		var element = scene[elementname];
		for (propertyname in element) {
			//aniindex++;
			switch (propertyname) {
				case  "width":
					$(elementname).width(element[propertyname]);
					break;
				case "visibility":
					if (element[propertyname] == "visible")
						$(elementname).show();
					else if (element[propertyname] == "hidden")
						$(elementname).hide();
					else
						$(elementname).css(propertyname, element[propertyname]);
					break;
				default:
					$(elementname).css(propertyname, element[propertyname]);
					break;
			}
		}
	}

	if ($("#target").height() > $("#source").height()) {
		$("#source").height($("#target").height());
	} else {
		$("#target").height($("#source").height());
	}
};

var init = function() {
	var hash=window.location.hash.substring(1);
	var inputs=3;
	var solved=false;

	if (hash != ""){
		inputs=Math.floor(Math.log2(hash.length));
	}

	// included from ui.js
	stable = new sourceTable($("#source"),inputs);
	loadScene(0);
	if (hash !=""){
		stable.tablefill(hash);
	}

	// events
	stable.newTable = function(arr) {
		loadScene(0);
		stable.changed(arr);
	};
	
	stable.fire = function() {
		var arr = stable.getMatrix();
		var q = new quine(arr);
		if (!q.empty) {
			q.solve(function() {
				loadScene(1);
				ttable = new targetTable("#target", q);
				ptable = new pITable("#chart", q);
				solved=true;
			});
		} else {
			alert('plz add at least one "1".')
		}
	};
	
	stable.changed = function(arr){
		var tmp="#";
		solved=false;
		for (e in arr){
			tmp += (arr[e]>>1<<1 == arr[e] ? "0" : "1");
		}
		window.location.hash=tmp;
	};
	
	// navigation
	$("#navInput").click(function(){
		loadScene(0);
	});
	
	$("#navTarget").click(function(){
		stable.fire();
	});
	
	$("#navChart").click(function(){
		if (solved)
			loadScene(2);
		else
			stable.fire();
	});
};

$(document).ready(init);
