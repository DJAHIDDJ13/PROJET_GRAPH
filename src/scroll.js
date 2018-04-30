function mouseDragged() {
	leftShow += mouseX - pmouseX;
	topShow  += mouseY - pmouseY;
	leftShow = Math.min(0, Math.max(leftShow, width-imagePiste.width*zoom));
	topShow = Math.min(0, Math.max(topShow, height-imagePiste.height*zoom));
	show();
}

function zoomBy(val, followMouse){
	var exZoom = zoom;
	zoom += -1*val;
	zoom = Math.max(Math.max(width/imagePiste.width,height/imagePiste.height),Math.min(zoom, 1.8));
	leftShow = zoom/exZoom*(leftShow-(followMouse?mouseX:(width/2)))+(followMouse?mouseX:(width/2));
	topShow  = zoom/exZoom*(topShow-(followMouse?mouseY:(height/2)))+(followMouse?mouseY:(height/2));
	leftShow = Math.min(0, Math.max(leftShow, width-imagePiste.width*zoom));
	topShow  = Math.min(0, Math.max(topShow, height-imagePiste.height*zoom));
	show();
}
function mouseWheelC(e) {
	zoomBy(e.deltaY/30, true);
}
