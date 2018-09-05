chrome.contextMenus.create({
  title: "AutoTimeConverter", 
  contexts:["selection"],
  type: "separator"
});

chrome.contextMenus.create({
  title: "Convert Time to etc", 
  contexts:["selection"], 
  onclick: convertTime
});

chrome.contextMenus.create({
  title: "Convert Time to utc", 
  contexts:["selection"], 
  onclick: convertTime
});

function convertTime()
{
    alert("converting time - TO DO");
}