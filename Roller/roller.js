/**
 * Model of roller . It's purely js model without DOM
 * @author fantao
 */
var Roller = function () {
	var me = this;
	me.copyParam.call(me,arguments);
	me.init.apply(me,arguments);
};
( function () {
	var Current = {
		index : 0,
		position : {
			top : 0,
			left : 0
		},
		zIndex : 0,
		pad : {
			position : {
				top : 0,
				left : 0
			},
			newpad : {
				
			}
		}
		
	};
	var currentIndex = 0;
	var from = 0;
	var to = 0;
	
	var rollerParam = {};
	var root = document.createElement("div");
	var cache  = document.createElement("div");
	var pad = [];
	
	
	
	var copyParam = function () {
		var param = arguments;
		rollerParam = param[0][0];
	}
	
	var init = function () {
		var base = rollerParam.base || document.body;
		cache = rollerParam.cache || cache;
		root.className = "root";
		base.appendChild(root);
	}
	
	var UI = function () {
		//roller子类用于控制UI展现
	}
	UI.root = root;
	
	UI.addPage = function (params) {
		//添加一个新页面 但并不展示到screenbox
		var newpad = {};
		//newpad = document.createElement("div");
		//newpad.className = "pad";
		var nothing = 1;
		
		if (params.innerHTML){
			newpad.innerHTML = params.innerHTML;
			nothing = 0;
		}
		if (params.Id){
			newpad  = document.getElementById(params.Id);
			nothing = 0;
		}
		if (params.element){
			newpad  = params.element;
			nothing = 0;
		}
		
		if(nothing == 1) {
			return false;
		}
		
		newpad.style.position = "absolute";
		newpad.style.top = "0";
		newpad.style.left =   ( pad.length ) * rollerParam.width + "px";
		newpad.style.width = rollerParam.width + "px";
		newpad.style.zIndex = pad.length * (-1);
		//newpad.style.opacity = "0";
		
		pad.push(newpad);
		root.appendChild(newpad);	
	}
	UI.show = function () {
		
	}
	
	
	var forward = function () {
		//向前滚动
		if (Current.index < (pad.length - 1) ){
			console.log("Current.index" + Current.index + ",pad.length:" + (pad.length ));
			this.UI.FX[ rollerParam.fx ] (1);
		}else{
			//alert("outrange!" + Current.index + "," + (pad.length));
		}
	}
	var backward = function () {
		//向后滚动
		console.log("Current.index:" + Current.index + ",pad.length:" + (pad.length));
		if ( Current.index <= 0 ) {
					Current.index = 0;
					return false;
		}
		this.UI.FX[ rollerParam.fx ] (-1);
		
	}
	var proto = Roller.prototype;
	proto.UI = UI;
	proto.forward = forward;
	proto.next = forward;
	proto.backward = backward;
	proto.back = backward;
	proto.init = init;
	proto.copyParam = copyParam;
	
	proto.rollto = function (num){
		//roller的显示方法，用来滚动到某幅画面
	};
	
	
	UI.FX = {
		translate : function (direction) {
			console.log("fx CI before:"+Current.index);
			Current.index += direction ;
			console.log("fx CI after:"+Current.index);
			Current.position.left -= direction * rollerParam.width;
			
			function onTransitionEnd () {
				
				if( direction == -1 && pad.length >= 2 ) {
					pad.splice( (pad.length-1), (pad.length-1) );
					//root.removeChild(root.childNodes[root.childNodes.length - 1]);
					cache.appendChild(root.childNodes[root.childNodes.length - 1]);
				}
				root.removeEventListener("webkitTransitionEnd",onTransitionEnd,false);
			}
			root.style.webkitTransitionProperty = "-webkit-transform";
			root.style.webkitTransitionDuration = "0.5s";
			root.style.webkitTransitionTimingFunction = "cubic-bezier(0, 0.42, 0.0, 1)";
			root.style.webkitTransform = "translateX(" + Current.position.left + "px)";
			root.addEventListener("webkitTransitionEnd",onTransitionEnd,false);
		},
		fade : function (direction) {
			//Current.zIndex -= direction[method] * rollerParam.width;
			var i = Current.index;
			var d = direction;
			var current = pad[ i ];
			var next = pad[ i + d];
			
			var time = "0.5s";

			
			next.style.opacity = 0;
			next.style.left = 0;
			next.style.zIndex = 0;//将目标pad移到上层
			current.style.zIndex = -1;//将当前pad移到下一层

			function onTransitionEnd () {
				//console.log(pad);
				if( direction == -1 ) {
					pad.splice( (pad.length-1), (pad.length-1) );
					//root.removeChild(root.childNodes[root.childNodes.length - 1]);
					cache.appendChild(root.childNodes[root.childNodes.length - 1]);
				}
				next.removeEventListener("webkitTransitionEnd",onTransitionEnd,false);
			}
		
			current.style.webkitBackfaceVisibility = "hidden";
			current.style.webkitTransitionProperty = "opacity";
			current.style.webkitTransitionDuration = time;
			current.style.webkitTransitionTimingFunction = "cubic-bezier(1, 0, 0.58, 1.0).";
			
	
			next.style.webkitBackfaceVisibility = "hidden";
			next.style.webkitTransitionProperty = "opacity";
			next.style.webkitTransitionDuration = time;
			next.style.webkitTransitionTimingFunction = "cubic-bezier(1, 0, 0.58, 1.0).";
			next.addEventListener("webkitTransitionEnd",onTransitionEnd,false);

			current.style.opacity = "0";
			setTimeout(function(){
				next.style.opacity = "1";
			},10);
			//root.addEventListener("webkitTransitionEnd",onTransitionEnd,false);
			Current.index += direction ;
		},
		transcale : function (direction) {
			var i = Current.index;
			var d = direction;
			var current = pad[ i ];
			var next = pad[ i + d];
			
			console.log("fx CI before:"+Current.index);
			Current.index += direction ;
			console.log("fx CI after:"+Current.index);
			Current.position.left -= direction * rollerParam.width;
			
			var animateNext = new Animate (next, "scaleIn",{
	 			duration:"0.5s",
	 			ease:"cubic-bezier(1.0, 0.58, 0, 0)",
	 			delay:"0.2s",
	 			fillmode:"both",
	 			loop:"1"    
	 			//set loop to "infinite" for non-stop repeat
	 			//"1" for once by default
	 		});
	 		var animateCurrent = new Animate (current, "scaleOut",{
	 			duration:"0.5s",
	 			ease:"cubic-bezier(1.0, 0.58, 0, 0)",
	 			delay:"0.2s",
	 			fillmode:"both",
	 			loop:"1"    
	 			//set loop to "infinite" for non-stop repeat
	 			//"1" for once by default
	 		});
		 		animateCurrent.onstart = function (){
		 		//this function is not required
		 		//	event.target.innerHTML = "Start";
		 		};
		 		animateCurrent.onend = function (){
		 		//this function is not required
		 		//	event.target.innerHTML = "End";
		 		};
		 		animateCurrent.onloop = function (){
		 		//this function is not required
		 		//	event.target.innerHTML = "loop";
		 		};
			
			function onTransitionEnd () {
				
				if( direction == -1 && pad.length >= 2 ) {
					pad.splice( (pad.length-1), (pad.length-1) );
					//root.removeChild(root.childNodes[root.childNodes.length - 1]);
					cache.appendChild(root.childNodes[root.childNodes.length - 1]);
				}
				root.removeEventListener("webkitTransitionEnd",onTransitionEnd,false);
			}
			root.style.webkitTransitionProperty = "-webkit-transform";
			root.style.webkitTransitionDuration = "0.5s";
			root.style.webkitTransitionTimingFunction = "cubic-bezier(1.0, 0.58, 0, 0)";
			root.style.webkitTransform = "translateX(" + Current.position.left + "px)";
			root.addEventListener("webkitTransitionEnd",onTransitionEnd,false);
			
			
			animateCurrent.start();
			animateNext.start();
		},
		transkew : function (direction) {
			var i = Current.index;
			var d = direction;
			var current = pad[ i ];
			var next = pad[ i + d];
			
			console.log("fx CI before:"+Current.index);
			Current.index += direction ;
			console.log("fx CI after:"+Current.index);
			Current.position.left -= direction * rollerParam.width;
			
			var animateNext = new Animate (next, "scaleIn",{
	 			duration:"1s",
	 			ease:"ease-in",
	 			delay:"0.2s",
	 			fillmode:"both",
	 			loop:"1"    
	 			//set loop to "infinite" for non-stop repeat
	 			//"1" for once by default
	 		});
	 		var animateCurrent = new Animate (current, "scaleOut",{
	 			duration:"1s",
	 			ease:"ease-in",
	 			delay:"0.2s",
	 			fillmode:"both",
	 			loop:"1"    
	 			//set loop to "infinite" for non-stop repeat
	 			//"1" for once by default
	 		}); 
	 		var animateCurrent1 = new Animate (current, "flipOutY",{
	 			duration:"1s",
	 			ease:"ease-in",
	 			delay:"0.2s",
	 			fillmode:"both",
	 			loop:"1"    
	 			//set loop to "infinite" for non-stop repeat
	 			//"1" for once by default
	 		});
	 		var animateNext1 = new Animate (next, "flipInYN",{
	 			duration:"1s",
	 			ease:"ease-in",
	 			delay:"0.2s",
	 			fillmode:"both",
	 			loop:"1"    
	 			//set loop to "infinite" for non-stop repeat
	 			//"1" for once by default
	 		});
		 		animateCurrent.onstart = function (){
		 		//this function is not required
		 		//	event.target.innerHTML = "Start";
		 		};
		 		animateCurrent.onend = function (){
		 		//this function is not required
		 		//	event.target.innerHTML = "End";
		 		};
		 		animateCurrent.onloop = function (){
		 		//this function is not required
		 		//	event.target.innerHTML = "loop";
		 		};	
	 					
			function onTransitionEnd () {
				
				if( direction == -1 && pad.length >= 2 ) {
					pad.splice( (pad.length-1), (pad.length-1) );
					//root.removeChild(root.childNodes[root.childNodes.length - 1]);
					cache.appendChild(root.childNodes[root.childNodes.length - 1]);
				}
				root.removeEventListener("webkitTransitionEnd",onTransitionEnd,false);
			}
			root.style.webkitTransitionProperty = "-webkit-transform";
			root.style.webkitTransitionDuration = "1s";
			root.style.webkitTransitionTimingFunction = "cubic-bezier(1.0, 0.58, 0, 0)";
			root.style.webkitTransform = "translateX(" + Current.position.left + "px)";
			root.addEventListener("webkitTransitionEnd",onTransitionEnd,false);
			
			
			animateCurrent.start();
			animateCurrent1.start();
			animateNext.start();
			animateNext1.start();
		}
	}
})();


