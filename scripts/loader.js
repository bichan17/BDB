var app = {}; //global var

//wait until main document is loaded
window.addEventListener("load",function(){
	//start dynamic loading
	Modernizr.load([{
		//load all libraries and scripts
		load: ["scripts/jquery-2.1.0.min.js","scripts/jquery-bbq-min.js","scripts/jquery-ui-1.10.4.custom.min.js","scripts/anim.js","scripts/main.js"],

		//called when all files have finished loading and executing
		complete: function(){
			console.log("all files loaded!");
			//run init
			app.main.init();

		}
	}
	]); //end Modernizr.load
}); //end addEventListener