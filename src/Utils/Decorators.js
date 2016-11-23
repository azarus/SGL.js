/** CLASS DECORATORS **/
global.globalClass = function(target, prop, descriptor)
{
	global[target.name] = target;
	window[target.name] = target;
//
}