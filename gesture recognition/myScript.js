var canvas;
var ctx;

canvas = document.createElement("canvas");
canvas.setAttribute("id","potato");
canvas.setAttribute("width","1000");
canvas.setAttribute("height","500");
canvas.setAttribute("style","border:1px solid #000000;");
document.body.appendChild(canvas);
ctx=canvas.getContext("2d");
/*ctx.canvas.width  = window.innerWidth;
 ctx.canvas.height = window.innerHeight;*/
	
ctx.beginPath();
ctx.lineWidth = "4";
ctx.strokeStyle = "#FFA000";
ctx.rect(100, 50, 100, 100)
ctx.stroke();
console.log("drawn");


ctx.strokeStyle = "red";
ctx.lineWidth = "20";
ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(1500,900);
ctx.stroke();

var NOISE = 0.008;
var MINSIZE = 3;

canvas.onclick = function(){
	if(recording){
		convertPosesToVects();
		cleanUpRecording();
		//drawPoses();
		
		getBoundingBox();
		drawVects({x:-minX,y:100-minY});
		smoothVect(NOISE,0);
		smoothVect(NOISE,MINSIZE);
		drawVects({x:500-minX,y:100-minY})
	};
	recording = !recording;
	firstMouse=true;
	};

function cleanUpRecording()
{
	canvas.width = canvas.width;
}

function drawPoses()
{
	ctx.strokeStyle = "green";
	ctx.lineWidth = "10";
	ctx.moveTo(poses[0].x,poses[0].y);
	for(var i = 0; i < poses.length; i++)
	{
		ctx.lineTo(poses[i].x,poses[i].y);
	}
	ctx.stroke();
	poses = [];
}

function drawVects(startPos)
{
	//ctx.strokeStyle = "yellow";
	ctx.lineWidth = "10";
	/*ctx.beginPath();
	ctx.moveTo(startPos.x,startPos.y);*/
	var prevPos = {x:startPos.x,y:startPos.y};
	for(var i = 0; i < vects.length; i++)
	{
		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "rgb(0,0,255)";
		ctx.rect(prevPos.x-2,prevPos.y-2,4,4);
		ctx.stroke();
		if(i>0)
		{
			if(dotProduct(vects[i-1],vects[i])<0.75 && (magnitude(vects[i-1]) > 10  || magnitude(vects[i]) > 10))
			{
				ctx.beginPath();
				ctx.lineWidth = "2";
				ctx.strokeStyle = "rgb(255,0,0)";
				ctx.rect(prevPos.x-5,prevPos.y-5,10,10);
				ctx.stroke();
			}
		}
		
		ctx.beginPath();
		ctx.moveTo(prevPos.x,prevPos.y);
		ctx.strokeStyle = "rgb(0,255,0)";	
		ctx.lineWidth = 5;
		ctx.lineTo((prevPos.x += vects[i].x)*1,(prevPos.y += vects[i].y)*1);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.moveTo(prevPos.x,prevPos.y);	
		ctx.lineWidth = 1;
		ctx.strokeStyle = "yellow";
		ctx.lineTo(0,0);
		ctx.stroke();
	}
	//ctx.stroke();
	poses = [];
}


function totalLength()
{
	var total = 0;
	for(var i =0; i < vects.length; i++)
	{
		total += Math.sqrt(vects[i].x*vects[i].x + vects[i].y*vects[i].y);
	}
	return total;
}


function dotProduct(A,B)
{
	A = normalize(A);
	B = normalize(B);
	
	return A.x * B.x + A.y * B.y;
}

function normalize(vect)
{
	var magn = magnitude(vect);
	return {x:vect.x / magn,y:vect.y / magn};
}

function convertPosesToVects()
{
	vects = [];
	for(var i = 0; i < poses.length - 1; i++)
	{
		vects.push({x:poses[i+1].x - poses[i].x,
			y:poses[i+1].y - poses[i].y,
			t:poses[i+1].t - poses[i].t})
	}
	//console.log("total length: " + totalLength());
}

var minX, minY, maxX, maxY;
function getBoundingBox()
{
	minX = maxX = poses[0].x;
	minY = maxY = poses[0].y;
	for(var i = 1; i < poses.length; i++)
	{
		minX = Math.min(poses[i].x, minX);
		minY = Math.min(poses[i].y, minY);
		maxX = Math.max(poses[i].x, maxX);
		maxY = Math.max(poses[i].y, maxY);
	}
	minX -= poses[0].x;
	minY -= poses[0].y;
	maxX -= poses[0].x;
	maxY -= poses[0].y;
}

function magnitude(vect)
{
	return Math.sqrt(vect.x*vect.x + vect.y*vect.y);
}

function smoothVect(noise,minsize)
{
	//console.log("begin vects size: " + vects.length);
	var gestureLength = totalLength();
	//console.log("gestureLength: " + gestureLength);
	for(var i = 1; i < vects.length -1; i++)
	{
		//if going different directions
		if(dotProduct(vects[i-1],vects[i])<0.9)
		{
			//if two consecutive vects add up to a vect going same direction as previous vect
			if(dotProduct(vects[i-1],vectorSum(vects[i],vects[i+1]))>=0.8)
			{
				vects[i] = vectorSum(vects[i],vects[i+1]);
				vects.splice(i+1,1);
				i--;
				continue;
			}
		}
		//if going same direction
		if(dotProduct(vects[i-1],vects[i])>0.99)
		{		
			vects[i-1] = vectorSum(vects[i-1],vects[i]);
			vects.splice(i,1);
			i--;
			continue;
		}
		//if going same direction and is the noise
		if(dotProduct(vects[i-1],vects[i])>0.9 && (magnitude(vects[i])/gestureLength) < noise)
		{		
			vects[i-1] = vectorSum(vects[i-1],vects[i]);
			vects.splice(i,1);
			i--;
			continue;
		}
		//if magn too small
		if(magnitude(vects[i])<minsize)
		{
			vects[i-1] = vectorSum(vects[i-1],vects[i]);
			vects.splice(i,1);
			i--;
			continue;
		}
		//console.log("magn: " + magnitude(vects[i]) + "  length: " + gestureLength + " div: " + (magnitude(vects[i])/gestureLength));
			
	}
	console.log("end vects size: " + vects.length);
}

function vectorSum(A,B)
{
	return {x: A.x + B.x ,y: A.y + B.y};
}

document.onmousemove = mouse;

var firstMouse = true;
var recording = false;


function mouse(ev)
{
	if(recording)
	{
	drawMouseCanvas(ev);
	recordMouse(ev);
	}
}
var date = new Date();
var poses = [];
var vects = [];
function recordMouse(ev)
{
	poses.push({x:ev.clientX,y:ev.clientY,t:date.getTime()});
	//console.log({x:ev.clientX,y:ev.clientY,t:date.getTime()});
}

function drawMouseCanvas(ev)
{
	if(!(ev.clientX < 1000 && ev.clientY < 500))
	{
		firstMouse = true;
		return;
	}
	if(firstMouse)
	{
		firstMouse = false;
		ctx.beginPath();
		ctx.moveTo(ev.clientX,ev.clientY);
	}
	ctx.strokeStyle = "red";
	ctx.lineWidth = "10";
	ctx.lineTo(ev.clientX,ev.clientY);
	ctx.stroke();
}

