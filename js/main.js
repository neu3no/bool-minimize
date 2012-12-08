// needs functions.js!
if (!Object.N3OFUNCZ){
	alert("functions.js needs to be embedded first!");
}
// -

var S_OR  = "+";
var S_AND = "•";
var S_NOT = "¬";
var aniindex=0;
var scenes = {
	0:{
		"#source" :{
			"display":"block",
			"visibility":"visible",
			"width":"100%",
			"float": "none"
		},
		"#target" :{
			"display":"none",
			"visibility":"hidden",
			"width":"0",
			"float": "none"
		}
	},
	1:{
		"#source" :{
			"display":"block",
			"visibility":"visible",
			"width":"39%",
			"float": "left"
		},
		"#target" :{
			"display":"block",
			"visibility":"visible",
			"width":"59%",
			"float": "right"
		}
	}
};

/* ************************************************************************* */
var loadScene = function(index){
	var scene=scenes[index];
	for (elementname in scene){
		var element = scene[elementname];
		for (propertyname in element){
			//aniindex++;
			switch (propertyname){
				case  "width":
					$(elementname).width(element[propertyname]);
					break;
				case "visibility":
					if (element[propertyname] == "visible")
						$(elementname).show();
					else if (element[propertyname] == "hidden")
						$(elementname).hide();
					else 
						$(elementname).css(propertyname,element[propertyname]);
					break;
				default:
					$(elementname).css(propertyname,element[propertyname]);
					break;
			}
		}
	}
	
	if ($("#target").height()>$("#source").height()) {
		$("#source").height($("#target").height()); 
	} else {
		$("#target").height($("#source").height());
	}
};

var init = function(){
	// included from ui.js
	stable=new sourceTable($("#source"));
	loadScene(0);

	stable.newTable = function(){
		loadScene(0);
	};
	
	stable.fire = function(){
		var arr=stable.getMatrix();
		var q = new quine(arr);
		q.firstTable();
		if (!q.empty){
			loadScene(1);
			
			ttable = new targetTable("#target", q);
			q.compare();
		}else{
			alert('plz add at least one "1".')
		}
	};
};

$(document).ready(init); 
