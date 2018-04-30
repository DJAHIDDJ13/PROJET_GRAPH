var imagePiste, imageDep, imageAr;
var dataGraph;
var leftShow = 0, topShow = 0, zoom = 1.0;
function preload() {
	imagePiste = loadImage("data/piste.png");
	imageDep = loadImage("data/point-depart.svg");
	imageAr = loadImage("data/point-arrivee.svg");
	dataGraph  = loadJSON("data/data.json");
}
var showVertex;
var result;
var route;
var dep, ar;
var selecting = -1;
function setup() {
	var c = createCanvas(windowWidth,windowHeight*0.6).mouseWheel(mouseWheelC).class('can');
	background(51);
	sel = document.getElementById('sel');
	result = createDiv().class('div1');
	result.html("cliquer sur 'Selectionner depart et arrivée' pour commencer", false);
	showVertex = document.getElementById('check');
	route = dijkstra(dataGraph.graph, dep);
	show();
}

function mousePressed(){
	if(selecting>0){
		var tmp = -1;
		for(var i=0; i<dataGraph.graph.length; i++){
			var sommet = dataGraph.graph[i];
			if(dist(sommet.coord[0], sommet.coord[1], (mouseX-leftShow)*(1/zoom), (mouseY-topShow)*(1/zoom)) < 8){
				tmp = i;
			}
		}
		if(tmp != -1){
			if(selecting === 1){
				dep = tmp;
				route = dijkstra(dataGraph.graph, dep);
				selecting ++;
				show();
				result.html("Cliquer sur le point d'arrivée", false);
				return;
			}
			else{
				if(dep === tmp){
					result.html("<p style='color:red'>Le depart doit etre different de l'arrivée!</p>", false);
					return;
				}
				ar = tmp;
				selecting = 0;
				show();
				return;
			}
		}
	}
}
function show(){
	fill(51);
	rect(0, 0, width, height);
	image(imagePiste, leftShow, topShow, imagePiste.width*zoom, imagePiste.height*zoom);
	if(!selecting){
		writeRoute(route, dep, ar);
		showRoute(route, ar);
		if(showVertex.checked){
			for(var i=0; i<dataGraph.graph.length; i++) {
				push();
				noStroke();
				var dx = dataGraph.graph[i].coord[0];
				var dy = dataGraph.graph[i].coord[1];
				if(i == dep){
					image(imageDep, leftShow+zoom*dx-5*zoom, topShow+zoom*dy-16*zoom, imageDep.width/50*zoom, imageDep.height/50*zoom);
				} else if(i == ar) {
					image(imageAr, leftShow+zoom*dx-5*zoom, topShow+zoom*dy-16*zoom, imageAr.width/50*zoom, imageAr.height/50*zoom);
				} else {
					fill(0);
					rect(leftShow+zoom*dx-3, topShow+zoom*dy-3, zoom*6, zoom*6);
				}
				pop();
			}
		}
	} else if(selecting != -1){
		for(var i=0; i<dataGraph.graph.length; i++) {
			var dx = dataGraph.graph[i].coord[0];
			var dy = dataGraph.graph[i].coord[1];
			image(selecting===1?imageDep:imageAr, leftShow+zoom*dx-5*zoom, topShow+zoom*dy-16*zoom, imageDep.width/50*zoom, imageDep.height/50*zoom);
		}
	}
}


function showRoute(route, ar){
	var cur = ar;
	while(route[cur] != -1){
		showArc(route[cur], cur);
		cur = route[cur];
	}
}
function getTime(mins){
	var tmp = int(mins/60);
	return (tmp?(tmp.toString()+"h "):'')+((mins%60)?((mins%60).toString()+"m"):""); 
}
function writeRoute(route, dep, ar){
	if(selecting != -1){
		if(route[ar] === -1){
			result.html("No route found", false);
		} else {
			var cur = ar;
			result.html("", false);
			var sum = 0;
			var strings = []
			while(route[cur] != -1){
				strings.push('<p class="name">'+dataGraph.graph[route[cur]].voisins[cur].nom+'</p><p class="time">'+int(calculateArcCost(dataGraph.graph[route[cur]].voisins[cur])).toString()+'min</p>');
				sum += int(calculateArcCost(dataGraph.graph[route[cur]].voisins[cur]))
				cur = route[cur];
			}
			for(var i=strings.length-1; i>=0; i--){
				result.html(strings[i]+"<hr>", true);
			}
			result.html("<b>Temps total : "+getTime(sum)+"</b>", true);
		}
	}
}

function showArc(dp, ar){
	var v = dataGraph.graph[dp].voisins[ar];
	push();
	noFill();
	switch(v.couleur){
		case'R':stroke(255, 0, 0);break;
		case'V':stroke(0,255,0);break;
		case'B':stroke(0,0,255);break;
		case'N':stroke(0);break;
		case'TELESKI':stroke(255,255,0);break;
		case'TELESIEGE':stroke(0,255,255);break;
		case'OEUF':stroke(255,0,255);break;
		case'TELECABINE':stroke(255,255,255);break;
	}
	strokeWeight(3);
	beginShape();
	for(var k=0; k<v.coords.length; k++){
		vertex(leftShow+zoom*v.coords[k][0],topShow+zoom*v.coords[k][1]);
	}
	endShape();
	pop();
}

function startSelecting(){
	selecting=1;
	show();
	result.html("cliquer sur le point de depart", false);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight*0.6);
	show();
}


