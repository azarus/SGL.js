@globalClass
export default class EventListener
{
	__eventListeners = {};
	on(name, callback)
	{
		if(!(name in this.__eventListeners))
		{
			this.__eventListeners[name] = [];
		}
		this.__eventListeners[name].push(callback);
	}

	off(name, callback)
	{
		if(!(name in this.__eventListeners))
		{
			return;
		}
		  var stack = this.__eventListeners[name];
		  for(var i = 0, l = stack.length; i < l; i++)
		  {
		    if(stack[i] === callback)
		    {
		      stack.splice(i, 1);
		      return this.off(name, callback);
		    }
		  }
	}

	broadcast(name)
	{
		if(!(name in this.__eventListeners))
		{
			return;
		}
		var stack = this.__eventListeners[name];
		for(var i = 0, l = stack.length; i < l; i++)
		{
			
			if(!stack[i])
				continue;

			var args = Array.prototype.slice.call(arguments);
			args.splice(0, 1);
			stack[i].apply(this, args);
		}
	}
};