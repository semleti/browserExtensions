//loads next video
//if after question if video found answer from background is false, or message that video ended, go to next video

/*console.log("edx auto playlist");

var videoState = false;

setTimeout(requestVideoState,10000);

function nextLecture()
{
	document.getElementsByClassName("sequence-nav-button button-next")[0].click();
	lectureLoading();
}

function lectureLoading()
{
	setTimeout(requestVideoState,10000);
}

function requestVideoState()
{
	chrome.runtime.sendMessage({action: "requestVideoState", tabId: null}, function(response) {});
	setTimeout(videoStateCommunicated,5000);
	setTimeout(requestVideoState,10000);
}

function videoStateCommunicated()
{
	if(!videoState)
	{
		nextLecture();
	}
	videoState = false;
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action == "setState")
		{
			console.log("setState " + request.state);
			if(request.state)
				videoState = true;
		}
		else if(request.action == "nextLecture")
		{
			console.log("nextLecture");
			nextLecture();
		}
	}
);*/

setTimeout(getVideoPlaying,2000);
setTimeout(startVideo,2000);

function getVideoPlaying()
{
	if(document.getElementsByClassName("ui-slider-range ui-widget-header ui-slider-range-min").length == 0)
	{
		nextLecture();
	}
	else if(document.getElementsByClassName("ui-slider-range ui-widget-header ui-slider-range-min")[0].style.width == "100%")
	{
		nextLecture();
	}
	setTimeout(getVideoPlaying,2000);
}

function nextLecture()
{
	document.getElementsByClassName("sequence-nav-button button-next")[0].click();
	setTimeout(startVideo,2000);
}

function startVideo()
{
	if(document.getElementsByClassName("control video_control play").length > 0)
	{
		document.getElementsByClassName("control video_control play")[0].click();
		document.getElementsByClassName("icon fa fa-arrows-alt")[0].click();
	}
}