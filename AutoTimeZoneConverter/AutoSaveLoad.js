var button = document.createElement("button");
button.onclick = function () { AutoSaveLoad.Save(); };
button.innerHTML = "Save All";
document.body.appendChild(button);

var button = document.createElement("button");
button.onclick = function () { AutoSaveLoad.Load(); };
button.innerHTML = "Load All";
document.body.appendChild(button);

//is meant to be static/singleton
function AutoSaveLoad() {}
AutoSaveLoad.Load = function () {
    console.log("loading");
    var AutoSaveLoads = document.getElementsByClassName("AutoSaveLoad");
    var temp = this;
    for (var i = 0; i < AutoSaveLoads.length; i++) {
        this.getDataById(AutoSaveLoads[i].id,
            function (pid, data) {
                temp.setDataToElement(document.getElementById(pid), data);
            });
    }
}

AutoSaveLoad.Save = function ()
{
    alert("gonna save");
    var AutoSaveLoads = document.getElementsByClassName("AutoSaveLoad");
    for (var i = 0; i < AutoSaveLoads.length; i++) {
        var data = this.getDataFromElement(AutoSaveLoads[i]);
        alert(data);
        this.saveDataForId(AutoSaveLoads[i].id, data);
    }
}

AutoSaveLoad.getDataById = function (id, callback) {
    chrome.storage.sync.get(id, function (data) {
        callback(id, data);
    });
}

AutoSaveLoad.saveDataForId = function (id, data) {
    var dataToSend = {};
    dataToSend[id] = data;
    console.log(dataToSend);
    chrome.storage.sync.set(dataToSend, function () {
        // Notify that we saved.
        alert('Settings saved');
    });
}

AutoSaveLoad.getDataFromElement = function (elt)
{
    if (elt.Serialize != null)
        return elt.Serialize();
    else if (elt.tagName == "input")
        return elt.value;
    else
        console.log("invalid elt to get data: " + elt);
}

AutoSaveLoad.setDataToElement = function(elt, data)
{
    if (elt.Deserialize != null) {
        elt.Deserialize(data[elt.id]);
    }
    else if (elt.tagName == "input")
        elt.value = data;
    else
        console.log("invalid elt to set data: " + elt);
}
