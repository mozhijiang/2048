var log = console.log.bind(console);
var $ = document.querySelectorAll.bind(document);
var on = function(elem,type,fn){
	elem.addEventListener(type,fn);
}