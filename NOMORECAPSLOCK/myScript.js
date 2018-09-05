routine(document.body);

function routine(elt)
{
	walking(elt);
	
	/*
	
	var as = document.getElementsByTagName("a");
	for(var i = 0; i < as.length; i++)
	{
		as[i].title = deCAPSLOCKify(as[i].title);
		if(as[i].childNodes.length == 1 && as[i].childNodes[0].tagName == undefined)
			as[i].text = deCAPSLOCKify(as[i].text);
	}

	var ps = document.getElementsByTagName("p");
	for(var i = 0; i < ps.length; i++)
	{
		for(var j =0; j < ps[i].childNodes.length; j++)
		{
			if(ps[i].childNodes[j].tagName == undefined)
			{
				ps[i].childNodes[j].nodeValue = deCAPSLOCKify(ps[i].childNodes[j].nodeValue);
			}
		}
		if(ps[i].childNodes.length == 1 && ps[i].childNodes[0].tagName == undefined)
			ps[i].innerHTML = deCAPSLOCKify(ps[i].innerHTML);
	}*/
	//setTimeout(routine,1000);
}

function walking(elt)
{
	var n, walk=document.createTreeWalker(elt,NodeFilter.SHOW_TEXT,{ acceptNode: function(node) { 
		if(node.nodeType == Node.TEXT_NODE)
			return NodeFilter.FILTER_ACCEPT; 
		else
			return NodeFilter.FILTER_REJECT;
		} 
	},false);
	
	while(n=walk.nextNode())
	{
		var decaps = deCAPSLOCKify(n.nodeValue);
		if(n.nodeValue !== decaps)
			n.nodeValue = decaps;
	}
}

function deCAPSLOCKify(initialString)
{
	var lowerString = initialString.toLowerCase();
	var finalString = "";
	for(var i = initialString.length - 1; i >= 1; i--)
	{
		if(initialString.charAt(i-1) == lowerString.charAt(i-1))
			finalString = initialString.charAt(i) + finalString;
		else
			finalString = lowerString.charAt(i) + finalString;
	}
	finalString = initialString.charAt(0) + finalString;
	return finalString;
}

document.addEventListener('DOMNodeInserted', nodeInsert);

function nodeInsert(){
    routine(event.srcElement);
};