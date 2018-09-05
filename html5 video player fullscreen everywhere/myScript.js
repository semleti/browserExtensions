//console.log("hi from html5");

function getHost(url)
{
	var parser = document.createElement('a');
	parser.href = url;
	var host = parser.host;
	parser.delete;
	return host;
}


var HOST = getHost(window.location);


function routine()
{
	handleDoc(document);
	setTimeout(routine,500);
}

function handleDoc(doc)
{
	var frames = doc.getElementsByTagName("iframe");
	for (var i = 0; i < frames.length; ++i)
	{
		var iframe = frames[i];
		if(HOST != getHost(iframe.getAttribute("src")))
			return;
		iframe.setAttribute("allowfullscreen","true");
		var j;
		var frameception = iframe.contentDocument.getElementsByTagName("iframe");
		for(j = 0; j < frameception.length; ++j)
		{
			if(frameception[j].getAttribute("allowfullscreen") == "true" || frameception[j].getAttribute("src") == null)
				continue;
			frameception[j].setAttribute("allowfullscreen","true");
			frameception[j].setAttribute("src",frameception[j].getAttribute("src"));
		}
	}
}

window.onload = routine;
document.addEventListener("DOMNodeInserted",OnNodeInserted,false);

function OnNodeInserted(event)
{
	//console.log("node inserted");
}