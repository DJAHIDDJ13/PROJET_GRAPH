var imageLoad = false, dataLoad = false;
// Loading the data
var rawFile = new XMLHttpRequest();
var data;
var sommets = [];
rawFile.overrideMimeType("application/json");
rawFile.open("GET", "dataFixed.json", true);
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
	for(var i=0; i<data.length; i++){
		ctx.fillStyle = "#000000";
		var dx = sommets[i].x;
		var dy = sommets[i].y;
		ctx.fillRect(x+zoom*dx, y+zoom*dy, zoom*5, zoom*5);
	}
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
		var lastSeenAt = {x:null, y:null};
		window.addEventListener("mousedown", function(e){
			msDown = true;
			lastSeenAt.x = e.clientX;
			lastSeenAt.y = e.clientY;
			console.log((e.clientX-x)*(1/zoom),(e.clientY-y)*(1/zoom));
		},false);
		window.addEventListener("mouseup", function(e){
			msDown = false;
		},false);
		elem.addEventListener("wheel", function(e){
			var exZoom = zoom;
			zoom = Math.min(1.2,Math.max(zoom - e.deltaY/100, 0.2));
			x = zoom/exZoom*(x-e.clientX)+e.clientX;
			y = zoom/exZoom*(y-e.clientY)+e.clientY;
			update();
		},false);
		elem.addEventListener("mousemove", function(e){
			if(msDown){
				x +=  e.clientX-lastSeenAt.x;
				y +=  e.clientY-lastSeenAt.y;
				
				update();
				lastSeenAt.x = e.clientX;
				lastSeenAt.y = e.clientY;
			}
		},false);
	}
}, false);

