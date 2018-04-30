function calculateArcCost(v){
	switch(v.couleur){
		case"TELESKI": return 1*v.len/10;
		case"TELESIEGE": return 0.9*v.len/10;
		case"OEUF": return 0.75*v.len/10;
		case"TELECABINE": return 0.5*v.len/10;
	}
	if(sel.value === 'Expert'){
		switch(v.couleur){
			case"V": return 1*v.len/10;
			case"B": return 1.1*v.len/10;
			case"R": return 1.2*v.len/10;
			case"N": return 1.3*v.len/10;
		}
	} else {
		switch(v.couleur){
			case"V": return 1.05*v.len/10;
			case"B": return 1.4*v.len/10;
			case"R": return 2.2*v.len/10;
			case"N": return 3*v.len/10;
		}		
	}
}

function dijkstra(graph, dep){
	var costs = [];
	var pere = [];
	var visited = [];
	for(var i=0; i<graph.length; i++){
		costs.push(Number.POSITIVE_INFINITY);
		pere.push(-1);
	}
	costs[dep] = 0;
	while(visited.length < graph.length) {
		var u = 0;
		while(visited.includes(u))
			u++;
		for(var i=0; i<graph.length; i++){
			if(costs[u] > costs[i] && !visited.includes(i))
				u = i;
		}
		visited.push(u);
		for(let v of Object.keys(graph[u].voisins)){
			v = int(v);
			if(!visited.includes(v)){
				var arcCost = calculateArcCost(graph[u].voisins[v]);
				var alt = costs[u] + arcCost
				if(alt < costs[v]){
					costs[v] = alt;
					pere[v] = u;
				}
			}
		}
	}
	return pere;
}
