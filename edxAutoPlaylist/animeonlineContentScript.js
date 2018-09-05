//loads next video
//if after question if video found answer from background is false, or message that video ended, go to next video
var videoFound = false;

function nextLecture()
{
	document.getElementsByClassName("next")[0].click();
}

var iframe = document.getElementsByTagName("iframe")[0];
if(iframe != null)
{
	iframe.style.width = (window.innerWidth - 100) + "px";
	iframe.style.height = (window.innerHeight) + "px";
	iframe.style.position = "fixed";
	iframe.style.left = "0";
	iframe.style.top = "0";
	iframe.style.zIndex = "1000";
	document.getElementsByClassName("anime_video_body_watch_items if")[0].remove();
	document.getElementsByClassName("logo")[0].remove();
}
else
	document.location.reload();

setTimeout(checkFoundVideo,10000);

function checkFoundVideo()
{
	if(!videoFound)
		document.location.reload();
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action == "passToTab")
		{
			if(request.command == "foundVideo")
			{
				videoFound = true;
			}
			else if(request.command == "videoEnded")
			{
				nextLecture();
			}
		}
	}
);





/*setTimeout(startVideo,10000);

function getVideoPlaying()
{
	if(document.getElementsByClassName("vjs-play-progress vjs-slider-bar").length == 0)
	{
		nextLecture();
	}
	else if(document.getElementsByClassName("vjs-play-progress vjs-slider-bar")[0].style.width == "100%")
	{
		nextLecture();
	}
	setTimeout(getVideoPlaying,2000);
}

function nextLecture()
{
	document.getElementsByClassName("next")[0].click();
}

function startVideo()
{
	if(document.getElementById("button_close") == null)
		document.location.reload();
	document.getElementById("button_close").click();
	setTimeout(function(){document.getElementsByClassName("vjs-fullscreen-control vjs-control vjs-button")[0].click();},500);
	setTimeout(getVideoPlaying,5000);
}*/