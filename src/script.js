var imagePiste;
var dataGraph;
var route;
var changed = false;
var leftShow = 0, topShow = 0, zoom = 1.0;
function preload() {
	imagePiste = loadImage("data/piste.png");
	dataGraph  = loadJSON("data/finalData.json");
}
var dep = 1;
var ar = 107;
var ariv = 200;
function setup() {
	createCanvas(windowWidth*0.8,windowHeight*0.8);
	background(51);
	console.log(dataGraph);
	route = dijkstra();
}

function draw() {
	fill(51);
	rect(0, 0, width, height);
	image(imagePiste, leftShow, topShow, imagePiste.width*zoom, imagePiste.height*zoom);
	
	for(var i=0; i<dataGraph.graph.length; i++) {
		push();
		noStroke();
		if(i == dep)
			fill(0,255,0);
		else if(i == ar)
			fill(255, 0, 0);
        else
			fill(0);
		var dx = dataGraph.graph[i].coord[0];
		var dy = dataGraph.graph[i].coord[1];
		rect(leftShow+zoom*dx-3, topShow+zoom*dy-3, zoom*6, zoom*6);
		pop();
	}
	if(changed){
		route = dijkstra();
		changed = false;
	}
	var cur = ar;
	while(route[cur] != -1){
		showArc(route[cur], cur);
		cur = route[cur];
	}
}
function dijkstra(){
	var costs = [];
	var pere = [];
	var visited = [];
	for(var i=0; i<dataGraph.graph.length; i++){
		costs.push(10000000);
		pere.push(-1);
	}
	costs[dep] = 0;
	
	while(visited.length < dataGraph.graph.length) {
		var u = 0;
		while(visited.includes(u))
			u++;
		for(var i=0; i<dataGraph.graph.length; i++){
			if(costs[u] > costs[i] && !visited.includes(i))
				u = i;
		}
		visited.push(u);
		for(var i=0; i<dataGraph.graph[u].voisins.length; i++){
			var v = dataGraph.graph[u].voisins[i].ar;
			if(!visited.includes(v)){
				var alt = costs[u] + dataGraph.graph[u].voisins[i].len;
				if(alt < costs[v]){
					costs[v] = alt;
					pere[v] = u;
				}
			}
		}
	}
	return pere;
}
function doubleClicked(){
	changed = true;
	for(var i=0; i<dataGraph.graph.length; i++){
		var sommet = dataGraph.graph[i];
		if(dist(sommet.coord[0], sommet.coord[1], (mouseX-leftShow)*(1/zoom), (mouseY-topShow)*(1/zoom)) < 6){
			changed = true;
			var ex = dep;
			dep = ar;
			ar = i;
			if(ar == dep)
				ar = ex;
			return;
		}
	}
}

function showArcs(arcs){
	for(var i=0; i<arcs.length-1; i++)
		showArc(arcs[i], arcs[i+1]);
}
function showArc(dp, ar){
	var ariv = -1;
	for(var i=0; i<dataGraph.graph[dp].voisins.length; i++){
		if(dataGraph.graph[dp].voisins[i].ar == ar){
			ariv = i;
		}
	}
	if(ariv == -1){
		console.log(-1);
		return;
	}
	var v = dataGraph.graph[dp].voisins[ariv];
	push();
	noFill();
	switch(v.couleur){
		case'R':stroke(255, 0, 0);break;
		case'V':stroke(0,255,0);break;
		case'B':stroke(0,0,255);break;
		case'N':stroke(0);break;
		default:stroke(255,255,0);
	}
	strokeWeight(3);
	beginShape();
	for(var k=0; k<v.coords.length; k++){
		vertex(leftShow+zoom*v.coords[k][0],topShow+zoom*v.coords[k][1]);
	}
	endShape();
	pop();
}
function windowResized(){
	resizeCanvas(windowWidth*0.8, windowHeight*0.8);
}
function mouseDragged() {
	leftShow += mouseX - pmouseX;
	topShow  += mouseY - pmouseY;
	leftShow = Math.min(0, Math.max(leftShow, width-imagePiste.width*zoom));
	topShow = Math.min(0, Math.max(topShow, height-imagePiste.height*zoom));
}

function mouseWheel(e) {
	var exZoom = zoom;
	zoom += -1*e.delta/30;
	zoom = Math.max(Math.max(width/imagePiste.width,height/imagePiste.height),Math.min(zoom, 1.8));
	leftShow = zoom/exZoom*(leftShow-width/2)+width/2;
	topShow  = zoom/exZoom*(topShow-height/2)+height/2;
	leftShow = Math.min(0, Math.max(leftShow, width-imagePiste.width*zoom));
	topShow  = Math.min(0, Math.max(topShow, height-imagePiste.height*zoom));
}

