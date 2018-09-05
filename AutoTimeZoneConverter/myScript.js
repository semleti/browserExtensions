Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

var REtimeZone = buildRETimeZone();
var REamPm = /((?:0?[0-9])|(?:1[0-2]))(?::([0-5][0-9]))?[ ]?((?:AM)|(?:PM)) /i;
var TIMEZONESDIFF = {};

function buildRETimeZone()
{
    return new RegExp("([0-2][0-9]):([0-5][0-9]) ?(CEST)","i");
}

setTimeout(function(){walking(document);},1000);

function walking(elt)
{
    var n, walk=document.createTreeWalker(elt,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode())
    {
		var conv = convertNode(n.nodeValue);
		if(conv != n.nodeValue)
            n.nodeValue = conv;
    }
}

function convertNode(initialString)
{
    var finalString = initialString;
    while((match = REamPm.exec(finalString)) !== null)
    {
        console.log("amPm found: " + match[0]);
        finalString = finalString.substr(0,match.index) + convertTimeAmPm(match[1], match[2], match[3]) + finalString.substr(match.index + match[0].length);
    }
    //be carefull that origin != destination
    while((match = REtimeZone.exec(finalString)) !== null)
    {
        console.log("found: " + match[0]);
        finalString = finalString.substr(0,match.index) + convertTimeZone(match[1], match[2], match[3],"DESTINATION") + finalString.substr(match.index + match[0].length);
    }
    return finalString;
}

//minutes is optional
function convertTimeAmPm(hours, minutes, amPm)
{
    if(minutes == null)
        minutes = 0;
    else
        minutes = parseInt(minutes);
    hours = parseInt(hours);
    if(amPm.toLowerCase() === "pm")
        hours += 12;
    return formatTime(hours, minutes);
}

function convertTimeZone(hours, minutes, origin, destination)
{
    origin = origin.toLowerCase();
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    minutes += getTimeOffset(origin, destination);
    hours += (Math.floor(minutes/60));
    hours = hours.mod(24);
    minutes = minutes.mod(60);
    return formatTime(hours, minutes) + " " + destination;
}

function formatTime(hours, minutes)
{
    if(minutes >= 10)
        return hours + ":" + minutes;
    else
        return hours + ":0" + minutes;
}

//gets 
function getTimeOffset(origin, destination)
{
    return -90;
}

document.addEventListener('DOMNodeInserted', nodeInsert);

function nodeInsert(){
    walking(event.srcElement);
};

TIMEZONESDIFF["A"] = 60;