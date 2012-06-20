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
	
	var root = document.createElement("div"); 
	var pad = [];
	
	var rollerParam = {};
	
	var copyParam = function () {
		var param = arguments;
		rollerParam = param[0][0];
	}
	
	var init = function () {
		root.className = "root";
		document.body.appendChild(root);
	}
	
	var UI = function () {
		//roller子类用于控制UI展现
	}
	UI.root = root;
	
	UI.addPage = function (params) {
		Current.newpad = document.createElement("div");
		Current.newpad.className = "pad";
		Current.newpad.innerHTML = params.innerHTML;
		console.log(rollerParam.width);
		switch ( rollerParam.fx ) {
			case "translate":
				Current.pad.position.left = pad.length * rollerParam.width;
				Current.newpad.style.left =  Current.pad.position.left + "px";
			case "fade":
				Current.pad.zIndex ++;
				//Current.pad.style.opacity = 1;
				Current.newpad.style.zIndex =  Current.pad.zIndex * -1;
				Current.newpad.style.opacity = 0;
		}	
		
		pad.push(Current.newpad);
		root.appendChild(Current.newpad);
		
		
	}
	UI.show = function () {
		
	}
	
	
	var forward = function () {
		//向前滚动
		this.UI.FX[ rollerParam.fx ] ("next");
	}
	var backward = function () {
		//向后滚动
		this.UI.FX[ rollerParam.fx ] ("back");
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
		translate : function (method) {
			var direction = {
				"next" : 1,
				"back" : -1
			}
			if( method == "back" ) {
				if ( Current.index <= 0 ) {
					Current.index = 0;
					return false;
				}
			}	
			
			Current.position.left -= direction[method] * rollerParam.width;
			Current.index += direction[method] ;
			
			
			function onTransitionEnd () {
				console.log("CI:" + Current.index + ",CPL:" + Current.position.left);
				if( method == "back" ) {
					pad.splice( (pad.length-1), (pad.length-1) );
					root.removeChild(root.childNodes[root.childNodes.length - 1]);
				}
				root.removeEventListener("webkitTransitionEnd",onTransitionEnd,false);
			}
			//root.style.left = Current.position.left + "px";
			root.style.webkitTransitionProperty = "-webkit-transform";
			root.style.webkitTransitionDuration = "0.5s";
			root.style.webkitTransitionTimingFunction = "cubic-bezier(1, 0, 0.58, 1.0).";
			root.style.webkitTransform = "translateX(" + Current.position.left + "px)";
			root.addEventListener("webkitTransitionEnd",onTransitionEnd,false);
		},
		fade : function (method) {
			var direction = {
				"next" : 1,
				"back" : -1
			}
			if( method == "back" ) {
				if ( Current.index <= 0 ) {
					Current.index = 0;
					return false;
				}
			}	
			
			//Current.zIndex -= direction[method] * rollerParam.width;
			Current.index += direction[method] ;
			
			pad[Current.index].style.webkitTransitionProperty = "opacity";
			pad[Current.index].style.webkitTransitionDuration = "2s";
			pad[Current.index].style.webkitTransitionTimingFunction = "cubic-bezier(1, 0, 0.58, 1.0).";
			pad[Current.index].style.opacity = "1";
			//root.addEventListener("webkitTransitionEnd",onTransitionEnd,false);
		}
	}
})();


