var FREQU = 1000;

setTimeout(routine,FREQU);

function routine()
{
	var adds = [];
	adds = document.getElementsByClassName("js-action-profile-promoted");
	for(var i =0; i < adds.length; i++)
	{
		deleteAdd(adds[i]);
	}
	
	setTimeout(routine,FREQU);
}

function deleteAdd(uiStreamSponsoredLink)
{
	//var parent = getNthParent(uiStreamSponsoredLink,14);
	//only 11, else it gets buggy
	var parent = getNthParent(uiStreamSponsoredLink,4);
	if(parent)
		parent.remove();
}

function getNthParent(element, n)
{
	if(!element)
		return;
	if(n >= 2)
		return getNthParent(element.parentElement, n-1);
	else
		return element.parentElement;
}