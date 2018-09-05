var videos = document.getElementsByTagName("video");

/*alert(videos.length);
for(var i = 0; i < videos.length; i++)
{
	alert("starting waiter");
	waitUntilLoaded(videos[i]);
}

function waitUntilLoaded(video)
{
	if(!video.paused)
	{
		alert("video playing");
		getValue();
	}
	else
	{
		alert("video not playing");
		setTimeout(function(){waitUntilLoaded(video);},1000);
	}
}*/

/*for(var i =0; i < videos.length; i++)
{
	videos[i].onload = function(){alert("loaded");};
	videos[i].addEventListener('load', function() {
		alert("loaded");
	}, false);
}*/

setTimeout(getValue,100);
setTimeout(getValue,10000);

function getValue()
{
	chrome.runtime.sendMessage({action: "getValue", tabId: null}, function(response) {
		if(response.value)
		{
			for(var i = 0; i < videos.length; i++)
			{
				videos[i].playbackRate = response.value;
			}
		}
	});
}

document.addEventListener("DOMNodeInserted",OnNodeInserted,false);

function OnNodeInserted(event)
{
	if(event.target.tagName == "VIDEO")
	{
		getValue();
	}
}


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action == "setValue")
		{
			for(var i = 0; i < videos.length; i++)
			{
				videos[i].playbackRate = request.value;
			}
		}
	}
);