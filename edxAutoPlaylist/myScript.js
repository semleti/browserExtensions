var video;
var FREQ = 1000;
//if found video, send message to background
//if video ended, send message to background

setTimeout(stuff,6000);

function stuff()
{
	if(document.getElementById("button_close") == null)
		return;
	chrome.runtime.sendMessage({action: "passToTab", command: "foundVideo", tabId: null}, function(response) {});
	
	document.getElementById("button_close").click();
	setTimeout(function(){document.getElementsByClassName("vjs-fullscreen-control vjs-control vjs-button")[0].click();},500);
	setTimeout(checkVideoEnded,2000);
	video = document.getElementsByTagName("video")[0];
	/*document.addEventListener("click", function(){
		video.webkitRequestFullScreen();
	});*/
}

function checkVideoEnded()
{
	if(video.ended)
		chrome.runtime.sendMessage({action: "passToTab", command: "videoEnded", tabId: null}, function(response) {});
	setTimeout(checkVideoEnded,FREQ);
}