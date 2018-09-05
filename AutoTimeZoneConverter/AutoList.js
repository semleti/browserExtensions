var AutoLists = document.getElementsByClassName("AutoList");
var AutoListsObject = [];
for(var i =0; i < AutoLists.length; i++)
{
    var elt = new AutoList(AutoLists[i]);
	AutoListsObject.push(elt);
}

function AutoList(element) {

    this.Constructor = function (element) {
        //used to attribute new unique ids, not persistent
        this.eltsCount = 0;

        this.mainElt = element;
        //needs a thead
        this.head = element.tHead;
        if (this.head == null)
            this.head = element.createTHead();
        //if tfoot present, won't add default control buttons
        this.foot = element.tFoot;
        //needs a tbody
        this.body = element.tBodies[0];

        this.elts = [];

        //default confirmation message
        this.removeAllMsg = "Are you sure you want to remove all elements?";

        //if there is no foot, create default one
        if (this.foot == null) {
            this.foot = document.createElement("tfoot");
            this.mainElt.appendChild(this.foot);

            var tr = document.createElement("tr");
            this.foot.appendChild(tr);

            var td = document.createElement("td");
            tr.appendChild(td);

            var buttonAdd = document.createElement("input");
            var buttonRemoveAll = document.createElement("input");
            var buttonLoadDefaults = document.createElement("input");

            td.appendChild(buttonAdd);
            td.appendChild(buttonRemoveAll);
            td.appendChild(buttonLoadDefaults);

            buttonAdd.type = "button";
            buttonAdd.value = "Add";
            buttonAdd.id = this.mainElt.id + "ButtonAdd";

            buttonRemoveAll.type = "button";
            buttonRemoveAll.value = "RemoveAll";
            buttonRemoveAll.id = this.mainElt.id + "ButtonRemoveAll";

            buttonLoadDefaults.type = "button";
            buttonLoadDefaults.value = "Load Defaults";
            buttonLoadDefaults.id = this.mainElt.id + "ButtonLoadDefaults";
        }

        //link functions to foot buttons
		try{
        var temp = this;
        document.getElementById(this.mainElt.id + "ButtonAdd").onclick = function () { temp.Add(); };
        document.getElementById(this.mainElt.id + "ButtonRemoveAll").onclick = function () { temp.RemoveAllChildren(); };
        document.getElementById(this.mainElt.id + "ButtonLoadDefaults").onclick = function () { temp.LoadDefaults(); };
		}catch(e){}

        //get template for new elements
        this.template = this.body.getElementsByTagName("tr")[0].cloneNode(true);
        this.body.getElementsByTagName("tr")[0].remove();
        if (this.template.id == "")
            this.template.id = this.mainElt.id + "Element";

        //if the template doesn't have a remove button, add a default one
        if (this.template.getElementsByClassName("ButtonRemove").length == 0) {
            var td = document.createElement("td");
            var btn = document.createElement("button");
            btn.className = "ButtonRemove";
            btn.type = "button";
            btn.innerHTML = "✗";
            btn.style.color = "red";
            btn.id = this.mainElt.id + "RemoveElt";

            td.appendChild(btn);
            this.template.appendChild(td);
        }

        //creates a searchfield for all AutoListInputs in the template
        var tr = document.createElement("tr");
        this.head.appendChild(tr);
        var inputs = this.template.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++)
        {
            var th = document.createElement("th");
            tr.appendChild(th);
            th.style.width = "172px";

            var input = document.createElement("input");
            th.appendChild(input);

            
            var className = inputs[i].className;
            if (className == "")
                className = inputs[i].className = "AutoListInputDefaultClass" + i;
            input.type = "search";
            input.dataset.search = className;
            input.id = inputs[i].id + "Search";
            input.placeholder = "Search " + className;
            input.style.width = "140px";

            var div = document.createElement("div");
            th.appendChild(div);
            div.style.display = "inline";

            var up = document.createElement("button");
            div.appendChild(up);
            up.type = "button";
            up.style.height = "10px";
            up.style.width = "20px";
            up.style.position = "relative";
            up.style.top = "2px";
            up.tempClassName = className;
            up.onclick = function () { temp.Sort(this.tempClassName, 1) };

            var upDiv = document.createElement("div");
            up.appendChild(upDiv);
            upDiv.style.position = "relative";
            upDiv.style.top = "-7px";
            upDiv.style.left = "-3px";
            upDiv.innerHTML = "▴";

            var down = document.createElement("button");
            div.appendChild(down);
            down.type = "button",
            down.style.height = "10px";
            down.style.width = "20px";
            down.style.position = "absolute";
            down.style.transform = "translate(-100%, calc(100% + 3px))";
            down.tempClassName = className;
            down.onclick = function () { temp.Sort(this.tempClassName, -1) };

            var downDiv = document.createElement("div");
            down.appendChild(downDiv);
            downDiv.style.position = "relative";
            downDiv.style.top = "-6px";
            downDiv.style.left = "-3px";
            downDiv.innerHTML = "▾";
			
			return this;
        }

        //set a reference on the DOM element for easier access from external scripts
        this.mainElt.AutoListReference = temp;

        var searchFields = this.head.getElementsByTagName("input");
        for(var i = 0; i < searchFields.length; i++)
        {
            if(searchFields[i].type == "search")
            {
                searchFields[i].addEventListener("input", function () { temp.Search(this); });
            }
        }
    }


    this.Constructor(element);

    
    //adds a new element based on the template
    this.Add = function()
    {
        this.eltsCount++;
        var newElt = this.template.cloneNode(true);
        newElt.searchStatusCount = 0;
        newElt.id = newElt.id + this.eltsCount;
        var temp = this;
        newElt.getElementsByClassName("ButtonRemove")[0].onclick = function () { temp.Remove(newElt); };
        this.body.appendChild(newElt);
        this.elts.push(newElt);
        return newElt;
    } 

    //removes all elements after asking for confirmation
    this.RemoveAllChildren = function(confirmationNeeded = true) {
        if (!(confirmationNeeded && confirm(this.removeAllMsg)))
            return;
        while (this.body.firstChild) {
            this.body.firstChild.remove();
        }
        this.eltsCount = 0;
    };

    //has to be implemented/ load from save?
    this.LoadDefaults = function () {
        alert("load defaults : TODO");
    };

    //serializes an element by storing the value of all elements of class AutoListInput
    //can be overwritten for more specifi saving
    this.Serialize = function () {
        var data = {};
        var subTrs = this.mainElt.tBodies[0].getElementsByTagName("tr");
        for (var i = 0; i < subTrs.length; i++)
        {
            var subEltsData = {}
            var subElts = subTrs[i].getElementsByTagName("input");
            for (var j = 0; j < subElts.length; j++) {
                subEltsData[subElts[j].className] = subElts[j].value;
            }
            data[""+i] = subEltsData;
        }
        
        return JSON.stringify(data);
    }.bind(this);

    //given a string adds a new element and sets all its values
    //can be overwritten for more specific loading
    this.Deserialize = function (dataString) {
        this.RemoveAllChildren(false);
        var data = JSON.parse(dataString);
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            var subData = data[keys[i]];
            var elt = this.Add();
            var subKeys = Object.keys(subData);
            for (var j = 0; j < subKeys.length; j++) {
                elt.getElementsByClassName(subKeys[j])[0].value = subData[subKeys[j]];
            }
        }
    }.bind(this);


    this.mainElt.Serialize = this.Serialize;
    this.mainElt.Deserialize = this.Deserialize;

    //removes an element
    this.Remove = function (elt) {
        this.elts.splice(this.elts.indexOf(elt), 1);
        elt.remove();
    };

    //searches the elements and hides the ones not matching the regex
    this.Search = function (search) {
        var reg = new RegExp(search.value);
        for (var i = 0; i < this.elts.length; i++) {
            var field = this.elts[i].getElementsByClassName(search.dataset.search)[0];
            var isAMatch = reg.test(field.value);

            //maybe move this to Add()
            if (field.searchStatus == null) {
                field.searchStatus = true;
            }

            if (field.searchStatus != isAMatch) {
                field.searchStatus = isAMatch;
                if (isAMatch) {
                    this.elts[i].searchStatusCount--;
                }
                else {
                    this.elts[i].searchStatusCount++;
                }
            }
            this.elts[i].hidden = this.elts[i].searchStatusCount != 0;
        }
    };

    this.Sort = function (className, normalORreverse) {
        this.elts.sort(function (a, b) {
            console.log(className);
            var avalue = a.getElementsByClassName(className)[0].value;
            var bvalue = b.getElementsByClassName(className)[0].value;
            //return avalue.localCompare(bvalue) * normalORreverse;
            console.log(avalue + " > " + bvalue + " : " + (avalue > bvalue ? 1 : -1) * normalORreverse);
            return (avalue > bvalue ? 1 : -1) * normalORreverse;
        });

        for(var i = 0; i < this.elts.length; i++)
        {
            this.body.appendChild(this.elts[i]);
        }
    };
}