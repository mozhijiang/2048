var transitionHook = (function(){

	function getEvent(){
		var t;
		var el = document.createElement('div');
		var events = {
			 "transition"      : "transitionend",
		     "OTransition"     : "oTransitionEnd",
		     "MozTransition"   : "transitionend",
		     "WebkitTransition": "webkitTransitionEnd"
		}
		for (t in events){
			if (el.style[t] !== undefined){
				return events[t];
			}
		}

	}

	var eventName = getEvent();

	return {
		bind : function(elem,callback){
			elem.addEventListener(eventName,callback);
		}
	}

})();