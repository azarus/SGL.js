export default class Timer
{
	constructor(callbackFn)
	{
		this.callbackFn = callbackFn;	
	}
	
	setInterval(seconds)
	{
		this.stop();
		this.timer = setInterval(this.callbackFn, seconds * 1000);
	}
	
	setTimeout(seconds)
	{
		this.stop();
		this.timer = setTimeout(this.callbackFn, seconds * 1000);
	}
	
	static delay(seconds, fn)
	{
		setTimeout(fn, seconds * 1000);
	}
	
	stop()
	{
		clearInterval(this.timer);
		clearTimeout(this.timer);
	}
};