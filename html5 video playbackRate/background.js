var tabValues = {};
var tabURLs = {};
/*tabValues[2] = 1;
delete tabValues[2];*/

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
	//get tabId
	var tabId = request.tabId;
	if(tabId==null)
		tabId = sender.tab.id;
	
    if(request.action == "getValue")
	{
		if(tabValues[tabId])
			sendResponse({value: tabValues[tabId]});
		else
			sendResponse({value: getValueFromURL(tabURLs[tabId])});
	}
	else if(request.action == "setValue")
	{
		tabValues[tabId] = request.value;
		chrome.tabs.sendMessage(tabId, {action: "setValue", value: request.value}, function(response) {});
	}
	else if(request.action == "sendURL")
	{
		tabURLs[tabId] = request.URL;
	}
 });
 
 function getValueFromURL(url)
 {
	 return null;
 }
		