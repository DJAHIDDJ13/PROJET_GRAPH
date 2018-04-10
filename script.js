var imageLoad = false, dataLoad = false;
// Loading the data
var rawFile = new XMLHttpRequest();
var data;
var sommets = [];
rawFile.overrideMimeType("application/json");
rawFile.open("GET", "dataFixed2.json", true);
rawFile.onreadystatechange = function() {
	if(rawFile.readyState == 4 && rawFile.status =="200"){
		data = JSON.parse(rawFile.responseText);
		for(var i=0; i<data.length; i++){
			sommets.push({x:data[i][0], y:data[i][1]});
		}
		console.log(data);
		dataLoad = true;
	}
}
rawFile.send(null);
//Loading the image
var base_image = new Image();
base_image.src = "piste.png";
base_image.onload = function(){
	imageLoad = true;
}
var x=0, y=0;
var w=2362, h=1013;
var zoom = 1.0;
var elem, ctx;
function update() {
	ctx.fillStyle = "#F0F0F0";
	ctx.fillRect(0, 0, elem.clientWidth, elem.clientHeight);
	ctx.drawImage(base_image, x, y, w*zoom, h*zoom);
	for(var i=0; i<sommets.length; i++){
		ctx.fillStyle = "#000000";
		var dx = sommets[i].x;
		var dy = sommets[i].y;
		ctx.fillRect(x+zoom*dx-3, y+zoom*dy-3, zoom*6, zoom*6);
	}
}
function zoomByVal(z){
	var exZoom = zoom;
	zoom = Math.min(2,Math.max(zoom - z/100, 0.2));
	x = zoom/exZoom*(x-elem.width/2)+elem.width/2;
	y = zoom/exZoom*(y-elem.height/2)+elem.height/2;
	update();
}

function show(){
	console.log("[");
	for(var i=0; i<sommets.length; i++){
		if(i!=sommets.length-1){
			console.log("[",sommets[i].x,",",sommets[i].y,"],");
		} else {
			console.log("[",sommets[i].x,",",sommets[i].y,"]");
		}
	}
	console.log("]");
}
window.addEventListener('load', function(){
	if(imageLoad && dataLoad){
		elem = document.getElementById("gc");
		if(!elem || !elem.getContext)
			return;
		ctx = elem.getContext("2d");
		if(!ctx)
			return;
		ctx.drawImage(base_image, 0, 0, w, h);
		var msDown = false;
		var selected = -1;
		var lastSeenAt = {x:null, y:null};
		window.addEventListener("mousedown", function(e){
			msDown = true;
			lastSeenAt.x = e.clientX;
			lastSeenAt.y = e.clientY;
			for(var i=0; i<sommets.length; i++){
				var sommet = sommets[i];
				if(Math.sqrt(Math.pow(sommet.x-(e.clientX-x)*(1/zoom), 2) + Math.pow(sommet.y-(e.clientY-y)*(1/zoom),2)) < 5) {
					console.log("clicked on : ", sommet);
					selected = i;
					return;
				}
			}
			selected = -1;
			//console.log((e.clientX-x)*(1/zoom),(e.clientY-y)*(1/zoom));
		},false);
		window.addEventListener("mouseup", function(e){
			msDown = false;
		},false);
		elem.addEventListener("wheel", function(e){
			var exZoom = zoom;
			zoom = Math.min(2,Math.max(zoom - e.deltaY/100, 0.2));
			x = zoom/exZoom*(x-e.clientX)+e.clientX;
			y = zoom/exZoom*(y-e.clientY)+e.clientY;
			update();
		},false);
		elem.addEventListener("mousemove", function(e){
			if(msDown){
				if(selected != -1){
					sommets[selected].x = (e.clientX-x)*(1/zoom);
					sommets[selected].y = (e.clientY-y)*(1/zoom);
					lastSeenAt.x = e.clientX;
					lastSeenAt.y = e.clientY;
					update();
				} else {
					x +=  e.clientX-lastSeenAt.x;
					y +=  e.clientY-lastSeenAt.y;
					update();
					lastSeenAt.x = e.clientX;
					lastSeenAt.y = e.clientY;
				}
			}
		},false);
		elem.addEventListener("dblclick", function(e){
			for(var i=0; i<sommets.length; i++){
				var sommet = sommets[i];
				if(Math.sqrt(Math.pow(sommet.x-(e.clientX-x)*(1/zoom), 2) + Math.pow(sommet.y-(e.clientY-y)*(1/zoom),2)) < 6) {
					sommets.splice(i, 1);
					update();
					return;
				}
			}
			sommets.push({x:(e.clientX-x)*(1/zoom),y:(e.clientY-y)*(1/zoom)});
			update();
		}, false);
	}
}, false);

