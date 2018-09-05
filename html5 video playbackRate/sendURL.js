function getHost(url)
{
	var parser = document.createElement('a');
	parser.href = url;
	var host = parser.host;
	parser.delete;
	return host;
}

var HOST = getHost(window.location);

chrome.runtime.sendMessage({action: "sendURL", tabId: null, URL: HOST}, function(response) {});