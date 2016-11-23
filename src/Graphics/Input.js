@globalClass
export default class Input
{
	static Keyboard = [];
	static broadcastAction(type, key, state)
	{
		if(type == "keyboard")
		{
			Input.SetKeyState(key, state);
		}

		if(type == "wheel")
		{
			Input.broadcast("wheel", state);
		}
		//console.debug(key);
	}

	static SetKeyState(key, state)
	{
		Input.Keyboard[String.fromCharCode(key).toLowerCase()] = state;
	}

	static IsKeyDown(key)
	{
		return Input.Keyboard[key.toLowerCase()];
	}

	static EventListeners = [];
	static broadcast(event, param)
	{
		Input.EventListeners[event](param);
	}

	static on(event, callback)
	{
		Input.EventListeners[event] = callback;
	}

};

if (document.addEventListener)
{
    // IE9, Chrome, Safari, Opera
    document.addEventListener("mousewheel", MouseWheelHandler, false);
    // Firefox
    document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
}
// IE 6/7/8
else
{
    document.attachEvent("onmousewheel", MouseWheelHandler);
}

function MouseWheelHandler(e)
{
    // cross-browser wheel delta
    var e = window.event || e; // old IE support
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
  
    if(delta > 0)
    {
    	Input.broadcastAction("wheel", 0, true);
    }

    if(delta < 0)
    {
    	Input.broadcastAction("wheel", 0, false);
    }
    return false;
}

function OnMouseWheel(evt, delta)
{
	
}

function myFunction() {
    this.style.fontSize = "35px";
}

document.addEventListener("keydown", function(evt)
{
	Input.broadcastAction("keyboard", evt.keyCode, true);
}.bind(Input), false);

document.addEventListener("keyup", function(evt)
{
	Input.broadcastAction("keyboard", evt.keyCode, false);
}.bind(Input), false);