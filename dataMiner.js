var elemEclai = document.getElementById("eclaireur");
observer = new MutationObserver(function(muts){ 
	muts.forEach(function(mut){ 
		if(mut.type === "attributes"){ 
			if(mut.attributeName == "style"){ 
				console.log(mut.target.style.top, mut.target.style.left);
			}
		}
	});
});
observer.observe(elemEclai, {attributes:true});
