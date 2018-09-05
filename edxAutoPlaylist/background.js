
chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
	//get tabId
	var tabId = request.tabId;
	if(tabId==null)
		tabId = sender.tab.id;
	
    if(request.action == "requestVideoState")
	{
		chrome.tabs.sendMessage(tabId, {action: "requestVideoState"}, function(response) {
			chrome.tabs.sendMessage(tabId, {action: "setState", state: response.state}, function(response2) {});
		});
	}
	else if(request.action == "setState")
	{
		chrome.tabs.sendMessage(tabId, {action: "setState", state: response.state}, function(response) {});
	}
	else if(request.action == "videoEnded")
	{
		chrome.tabs.sendMessage(tabId, {action: "nextLecture"}, function(response) {});
	}
	else if(request.action == "passToTab")
	{
		chrome.tabs.sendMessage(tabId, {action: "passToTab", command: request.command}, function(response) {});
	}
});
