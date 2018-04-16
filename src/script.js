var imagePiste;
var dataGraph;
var leftShow = 0, topShow = 0, zoom = 1.0;
var dep, ar;
var arret = [];
var arcs = [];
var input;
var show = false;
function preload(){
	imagePiste = loadImage("piste.png");
	dataGraph  = loadJSON("dataF3.json");
	arcs = loadJSON("arcs.json");
}
function setup(){
	var c = createCanvas(windowWidth*0.8,windowHeight*0.8);
	input = createInput('');
	arcs = arcs.arrets;
	background(51);
}
function draw(){
	fill(51);
	rect(0, 0, width, height);
	image(imagePiste, leftShow, topShow, imagePiste.width*zoom, imagePiste.height*zoom);
	for(var i=0; i<dataGraph.sommets.length; i++){
		if(ar==i)
			fill(255,0,0);
		else if(dep == i)
			fill(0,255,0);
		else
			fill(0);
		var dx = dataGraph.sommets[i][0];
		var dy = dataGraph.sommets[i][1];
		rect(leftShow+zoom*dx-3, topShow+zoom*dy-3, zoom*6, zoom*6);
	}
	noFill();
	if(show)
		for(var i=0; i<arcs.length; i++){
			stroke(255,0,0);
			beginShape();
			for(var j=0; j<arcs[i].coords.length; j++){
				vertex(arcs[i].coords[j][0]*zoom+leftShow, topShow+zoom*arcs[i].coords[j][1]);
			}
			endShape();
		}
	beginShape();
	for(var i=0; i<arret.length; i++)
		vertex(arret[i][0]*zoom+leftShow , zoom*arret[i][1]+topShow);
	endShape();
}
function keyPressed() {
	if(keyCode == ESCAPE)
		arret.pop();
	if(keyCode == ENTER){
		var tmp = {};
		tmp.nom = input.value();
		tmp.coords = arret;
		tmp.dep = dep;
		tmp.ar = ar;
		arcs.push(tmp);
		arret = [];
	}
	console.log(keyCode);
	if(keyCode == 32)
		show = !show;
}
function mousePressed() {
	if(ar && dep && mouseButton == "center"){
		arret.push([(mouseX-leftShow)/zoom, (mouseY-topShow)/zoom]);
	}
}
function doubleClicked(){
	for(var i=0; i<dataGraph.sommets.length; i++){
		if(Math.sqrt(Math.pow(dataGraph.sommets[i][0]-(mouseX-leftShow)*(1/zoom), 2) + Math.pow(dataGraph.sommets[i][1]-(mouseY-topShow)*(1/zoom),2)) < 5){
			if(i != ar){
				dep = ar;
				ar = i;
				return;
			}
		}
	}
}
function mouseDragged(){
	leftShow += mouseX - pmouseX;
	topShow  += mouseY - pmouseY;
	leftShow = Math.min(0, Math.max(leftShow, width-imagePiste.width*zoom));
	topShow = Math.min(0, Math.max(topShow, height-imagePiste.height*zoom));
}
function mouseWheel(e){
	var exZoom = zoom;
	zoom += -1*e.delta/30;
	zoom = Math.max(Math.max(width/imagePiste.width,height/imagePiste.height),Math.min(zoom, 1.8));
	leftShow = zoom/exZoom*(leftShow-width/2)+width/2;
	topShow  = zoom/exZoom*(topShow-height/2)+height/2;
	leftShow = Math.min(0, Math.max(leftShow, width-imagePiste.width*zoom));
	topShow = Math.min(0, Math.max(topShow, height-imagePiste.height*zoom));
}
//~ function widowResize(){
	//~ resizeCanvas(windowWidth*0.8)
//~ }
//~ elem.addEventListener("wheel", function(e){
	//~ var exZoom = zoom;
	//~ zoom = Math.min(2,Math.max(zoom - e.deltaY/100, 0.2));
	//~ x = zoom/exZoom*(x-e.clientX)+e.clientX;
	//~ y = zoom/exZoom*(y-e.clientY)+e.clientY;
	//~ update();
//~ },false);
//~ var imageLoad = false, dataLoad = false;
//~ // Loading the data
//~ var rawFile = new XMLHttpRequest();
//~ var data;
//~ var sommets = [];
//~ rawFile.overrideMimeType("application/json");
//~ rawFile.open("GET", "dataF3.json", true);
//~ rawFile.onreadystatechange = function() {
	//~ if(rawFile.readyState == 4 && rawFile.status =="200"){
		//~ data = JSON.parse(rawFile.responseText);
		//~ for(var i=0; i<data.length; i++){
			//~ sommets.push({x:data[i][0], y:data[i][1]});
		//~ }
		//~ console.log(data);
		//~ dataLoad = true;
	//~ }
//~ }
//~ rawFile.send(null);
//~ //Loading the image
//~ var base_image = new Image();
//~ base_image.src = "piste.png";
//~ base_image.onload = function(){
	//~ imageLoad = true;
//~ }
//~ var x=0, y=0;
//~ var w=2362, h=1013;
//~ var zoom = 1.0;
//~ var elem, ctx;
//~ function update() {
	//~ ctx.fillStyle = "#F0F0F0";
	//~ ctx.fillRect(0, 0, elem.clientWidth, elem.clientHeight);
	//~ ctx.drawImage(base_image, x, y, w*zoom, h*zoom);
	//~ for(var i=0; i<sommets.length; i++){
		//~ ctx.fillStyle = "#000000";
		//~ var dx = sommets[i].x;
		//~ var dy = sommets[i].y;
		//~ ctx.fillRect(x+zoom*dx-3, y+zoom*dy-3, zoom*6, zoom*6);
	//~ }
//~ }
//~ function zoomByVal(z){
	//~ var exZoom = zoom;
	//~ zoom = Math.min(2,Math.max(zoom - z/100, 0.2));
	//~ x = zoom/exZoom*(x-elem.width/2)+elem.width/2;
	//~ y = zoom/exZoom*(y-elem.height/2)+elem.height/2;
	//~ update();
//~ }

//~ function show(){
	//~ console.log("[");
	//~ for(var i=0; i<sommets.length; i++){
		//~ if(i!=sommets.length-1){
			//~ console.log("[",sommets[i].x,",",sommets[i].y,"],");
		//~ } else {
			//~ console.log("[",sommets[i].x,",",sommets[i].y,"]");
		//~ }
	//~ }
	//~ console.log("]");
//~ }
//~ window.addEventListener('load', function(){
	//~ if(imageLoad && dataLoad){
		//~ elem = document.getElementById("gc");
		//~ if(!elem || !elem.getContext)
			//~ return;
		//~ ctx = elem.getContext("2d");
		//~ if(!ctx)
			//~ return;
		//~ ctx.drawImage(base_image, 0, 0, w, h);
		//~ var msDown = false;
		//~ var selected = -1;
		//~ var lastSeenAt = {x:null, y:null};
		//~ window.addEventListener("mousedown", function(e){
			//~ msDown = true;
			//~ lastSeenAt.x = e.clientX;
			//~ lastSeenAt.y = e.clientY;
			//~ for(var i=0; i<sommets.length; i++){
				//~ var sommet = sommets[i];
				//~ if(Math.sqrt(Math.pow(sommet.x-(e.clientX-x)*(1/zoom), 2) + Math.pow(sommet.y-(e.clientY-y)*(1/zoom),2)) < 5) {
					//~ console.log("clicked on : ", sommet);
					//~ selected = i;
					//~ return;
				//~ }
			//~ }
			//~ selected = -1;
			//~ //console.log((e.clientX-x)*(1/zoom),(e.clientY-y)*(1/zoom));
		//~ },false);
		//~ window.addEventListener("mouseup", function(e){
			//~ msDown = false;
		//~ },false);
		//~ elem.addEventListener("wheel", function(e){
			//~ var exZoom = zoom;
			//~ zoom = Math.min(2,Math.max(zoom - e.deltaY/100, 0.2));
			//~ x = zoom/exZoom*(x-e.clientX)+e.clientX;
			//~ y = zoom/exZoom*(y-e.clientY)+e.clientY;
			//~ update();
		//~ },false);
		//~ elem.addEventListener("mousemove", function(e){
			//~ if(msDown){
				//~ if(selected != -1){
					//~ sommets[selected].x = (e.clientX-x)*(1/zoom);
					//~ sommets[selected].y = (e.clientY-y)*(1/zoom);
					//~ lastSeenAt.x = e.clientX;
					//~ lastSeenAt.y = e.clientY;
					//~ update();
				//~ } else {
					//~ x +=  e.clientX-lastSeenAt.x;
					//~ y +=  e.clientY-lastSeenAt.y;
					//~ update();
					//~ lastSeenAt.x = e.clientX;
					//~ lastSeenAt.y = e.clientY;
				//~ }
			//~ }
		//~ },false);
		//~ elem.addEventListener("dblclick", function(e){
			//~ for(var i=0; i<sommets.length; i++){
				//~ var sommet = sommets[i];
				//~ if(Math.sqrt(Math.pow(sommet.x-(e.clientX-x)*(1/zoom), 2) + Math.pow(sommet.y-(e.clientY-y)*(1/zoom),2)) < 6) {
					//~ sommets.splice(i, 1);
					//~ update();
					//~ return;
				//~ }
			//~ }
			//~ sommets.push({x:(e.clientX-x)*(1/zoom),y:(e.clientY-y)*(1/zoom)});
			//~ update();
		//~ }, false);
	//~ }
//~ }, false);

