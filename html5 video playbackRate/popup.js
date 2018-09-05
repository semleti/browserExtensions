document.getElementById("button0.25").onclick = function(){inputValue(0.25)};
document.getElementById("button0.5").onclick = function(){inputValue(0.5)};
document.getElementById("button1").onclick = function(){inputValue(1)};
document.getElementById("button1.5").onclick = function(){inputValue(1.5)};
document.getElementById("button2").onclick =  function(){inputValue(2)};
document.getElementById("set").onclick =  setInput;
document.getElementById("inputField").value = 1;

var input = document.getElementById("inputField");

chrome.tabs.query(
	{currentWindow: true, active : true},
	function(tabArray){
		//get tab id
		var tabId = tabArray[0].id;
	}
);

chrome.tabs.query(
	{currentWindow: true, active : true},
	function(tabArray){
		//get tab id
		var tabId = tabArray[0].id;
		chrome.runtime.sendMessage({action: "getValue", tabId: tabId}, function(response) {
			if(response.value)
				input.value = response.value;
		});
	}
);

function inputValue(value)
{
	input.value = value;
}

function setInput()
{
	chrome.tabs.query(
		{currentWindow: true, active : true},
		function(tabArray){
			//get tab id
			var tabId = tabArray[0].id;
			chrome.runtime.sendMessage({action: "setValue", tabId: tabId, value: input.value}, function(response) {});
		}
	);
}