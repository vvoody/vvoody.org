(function(){
var oDiv=document.getElementById('tags');
if (!oDiv) return;
var $window = $(window);
var radius = 130; // 标签云半径，如果标签过多的话，适当增大它的值
var dtr = Math.PI/180;
var d=300;

var mcList = [];
var sizeList = [];
var active = false;
var lasta = 1;
var lastb = 1;
var distr = true;
var tspeed=10;
var size=260; // 一般设为radius的2倍左右

var mouseX=0;
var mouseY=0;

var howElliptical=1;

var aA=null;
var aTmp=[];
var offsetWidth = null;
var offsetHeight = null;
var length = 0;

var colors = ['#8431cf', '#1332df', '#f00122', '#8c4211', '#de3f90', '#666', '#05d30d', '#e957ea', '#007aad', '#f00'];
colors.sort(function (){return Math.random()-0.5;});
var color_length = colors.length;

$(function ()
{
	var i=0;
	var oTag=null;

	$(oDiv).addClass('tag-cloud');

	aA=oDiv.getElementsByTagName('a');
	length = aA.length;

	for(i=0;i<length;i++)
	{
		oTag={};
		var aa = aA[i];
		aa.style.color = colors[i % color_length];

		oTag.offsetWidth=aa.offsetWidth/2;
		oTag.offsetHeight=aa.offsetHeight/2;

		mcList.push(oTag);
		aTmp.push(aa);
		sizeList.push(parseInt(aa.style.fontSize));
	}

	sineCosine( 0,0,0 );

	positionAll();

	offsetWidth = oDiv.offsetWidth/2;
	offsetHeight = oDiv.offsetHeight/2;
	var offsetLeft = oDiv.offsetLeft+offsetWidth;
	var offsetTop = oDiv.offsetTop+offsetHeight;

	var t=new Date();
	for (i = 0; i < 5; ++i) {
		update();
	}
	t = new Date() - t;
	if (t > 90) { // 机器性能太差就不做这个特效
		var lis = oDiv.getElementsByTagName('li');

		for(i=0;i<length;i++) {
			$(aA[i]).css("opacity", 1).appendTo(lis[i]);
		}
	} else {
		oDiv.onmouseover=function ()
		{
			active=true;
		};

		oDiv.onmouseout=function ()
		{
			active=false;
		};

		oDiv.onmousemove=function (ev)
		{
			var oEvent=window.event || ev;

			mouseX=oEvent.clientX-(offsetLeft-$window.scrollLeft());
			mouseY=oEvent.clientY-(offsetTop-$window.scrollTop());

			mouseX/=5;
			mouseY/=5;
		};
		t = Math.min(t, 15);
		tspeed = t / 3;
		setInterval(update,t);
	}
});

function update()
{
	var a;
	var b;

	if(active)
	{
		a = (-Math.min( Math.max( -mouseY, -size ), size ) / radius ) * tspeed;
		b = (Math.min( Math.max( -mouseX, -size ), size ) / radius ) * tspeed;
	}
	else
	{
		a = lasta * 0.98;
		b = lastb * 0.98;
	}

	lasta=a;
	lastb=b;

	if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01)
	{
		return;
	}

	var c=0;
	sineCosine(a,b,c);
	for(var j=0;j<length;j++)
	{
		var m = mcList[j];
		var rx1=m.cx;
		var ry1=m.cy*ca+m.cz*(-sa);
		var rz1=m.cy*sa+m.cz*ca;

		var rx2=rx1*cb+rz1*sb;
		var ry2=ry1;
		var rz2=rx1*(-sb)+rz1*cb;

		var rx3=rx2*cc+ry2*(-sc);
		var ry3=rx2*sc+ry2*cc;
		var rz3=rz2;

		m.cx=rx3;
		m.cy=ry3;
		m.cz=rz3;

		var per=d/(d+rz3);

		m.x=(howElliptical*rx3*per)-(howElliptical*2);
		m.y=ry3*per;
		m.scale=per;
		m.alpha=per;

		m.alpha=(m.alpha-0.6)*(10/6);
	}

	doPosition();
	depthSort();
}

function depthSort()
{
	var i=0;

	aTmp.sort
	(
		function (vItem1, vItem2)
		{
			vItem2.cz-vItem1.cz;
		}
	);

	for(i=0;i<length;i++)
	{
		aTmp[i].style.zIndex=i;
	}
}

function positionAll()
{
	var phi=0;
	var theta=0;
	var max=length;
	var i=0;

	var oFragment=document.createDocumentFragment();

	aTmp.sort
	(
		function ()
		{
			return Math.random()-0.5;
		}
	);

	for(i=0;i<length;i++)
	{
		oFragment.appendChild(aTmp[i]);
	}

	oDiv.appendChild(oFragment);

	for( var i=1; i<max+1; i++){
		if( distr )
		{
			phi = Math.acos(-1+(2*i-1)/max);
			theta = Math.sqrt(max*Math.PI)*phi;
		}
		else
		{
			phi = Math.random()*(Math.PI);
			theta = Math.random()*(2*Math.PI);
		}
		var aa = aA[i-1];
		var m = mcList[i-1];

		m.cx = radius * Math.cos(theta)*Math.sin(phi);
		m.cy = radius * Math.sin(theta)*Math.sin(phi);
		m.cz = radius * Math.cos(phi);

		aa.style.left=m.cx+offsetWidth-m.offsetWidth+'px';
		aa.style.top=m.cy+offsetHeight-m.offsetHeight+'px';
	}
}

function doPosition()
{
	var l=oDiv.offsetWidth/2;
	var t=oDiv.offsetHeight/2;
	for(var i=0;i<length;i++)
	{
		var aa = aA[i];
		var m = mcList[i];
		aa.style.left=m.cx+l-m.offsetWidth+'px';
		aa.style.top=m.cy+t-m.offsetHeight+'px';
		aa.style.fontSize=sizeList[i]+4*m.scale+'px';
		aa.style.opacity=m.alpha * 0.6 + 0.2;
	}
}

function sineCosine( a, b, c)
{
	sa = Math.sin(a * dtr);
	ca = Math.cos(a * dtr);
	sb = Math.sin(b * dtr);
	cb = Math.cos(b * dtr);
	sc = Math.sin(c * dtr);
	cc = Math.cos(c * dtr);
}
})();