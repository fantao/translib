var Animate = function (element,fxname,json) {
	//json.ease
	//json.duration;
	//json.delay;
	//json.timing;
	//json.fillmode;
	//json.keepstatus;
	var me = this;
	var originalClassName = element.className;
	
	me.element = element;
	me.args = arguments;
	me.originalClassName = originalClassName;
	me.keepstatus = json.keepstatus || false;
	me.fxname = fxname.toString();
	
	element.style.webkitAnimationDuration = json.duration || "1s";
	element.style.webkitAnimationTimingFunction =  json.ease || "ease";
	element.style.webkitAnimationDelay = json.delay || "";
	element.style.webkitAnimationFillMode = json.fillmode || "both";
	element.style.webkitBackfaceVisibility = "hidden";
	if (json.loop) { element.style.webkitAnimationIterationCount = json.loop; }
	
	if (json == true) {
		me.start.apply(me);
	}
	
}

Animate.prototype.start = function (keepstatus) {
	var me = this;
	var element = me.element;
	var args = me.args;
	var fxname = me.fxname;
	var oClassName = me.originalClassName
	console.log("fxname:"+me.fxname);
	//me.keepstatus = me.keepstatus || keepstatus;
	function clearClass(){
		element.className = "";
	}
	function init(){}
	
	function removeEvent(){
		event.target.removeEventListener('webkitAnimationStart', init, false);
		event.target.removeEventListener('webkitAnimationIteration', init, false);
		event.target.removeEventListener('webkitAnimationEnd', init, false);
		
		event.target.removeEventListener('webkitAnimationStart', me.onstart, false);
		event.target.removeEventListener('webkitAnimationIteration', me.onloop, false);
		event.target.removeEventListener('webkitAnimationEnd', me.onend, false);
		event.target.removeEventListener('webkitAnimationEnd', resetStatus, false);
		event.target.removeEventListener('webkitAnimationEnd', removeEvent, false);
		
		me.fxname = me.args[1];	
	}
	
	function resetStatus () {
		console.log("resetStatus");
		element.removeEventListener('webkitAnimationEnd', resetStatus, false);
		element.style.webkitAnimationName = "reset";
			
	}
	
	//These lines below are ordered
	element.addEventListener('webkitAnimationStart', init, false);
	
	element.addEventListener('webkitAnimationStart', me.onstart, false);
	element.addEventListener('webkitAnimationEnd', me.onend, false);
	element.addEventListener('webkitAnimationIteration', me.onloop, false);

	if (!keepstatus) {
		element.addEventListener('webkitAnimationEnd', resetStatus, false);
	}
	
	element.addEventListener('webkitAnimationEnd', removeEvent, false);

	element.style.webkitAnimationName = fxname;
}

Animate.prototype.back = function () {
	var me = this;
	me.fxname = me.args[2].backfx;
	me.start.apply(me,arguments);
}