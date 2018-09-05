let next = document.getElementsByClassName("navigation-links-module__link right")[0];

setTimeout(() => {
	let video = document.getElementsByTagName("video")[0];
	video.addEventListener('ended',goToNext,false);
},10000);


function goToNext(e) {
	// What you want to do after the event
	next.click();
}