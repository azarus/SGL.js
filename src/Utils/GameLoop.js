import Timer from "/Utils/Timer";

@globalClass
export default class GameLoop extends EventListener
{
	constructor(fps = 60, speed = 1)
	{
		super();
		
		this.on("init", function(){});
		this.on("start", function(){});
		this.on("stop", function(){});
		this.on("update", function(delta){});
		this.on("render", function(delta){});
		
		this._timeStep = (1000 / fps) * speed;
		this._prevTime = null;
		this._lagTime = 0;
		this.FPS = 0;
		this._frame = this.frame.bind(this);
		this._frameId = null;
		this.FPSCounter = 0;		
		this.fpsTimer = new Timer(this.fpsReset.bind(this));
	}
	
	fpsReset()
	{
		this.FPS = this.FPSCounter;
		this.FPSCounter = 0;
	}	
	
	getTime() {
		return performance && performance.now
		  ? performance.now()
		  : Date.now();
	}
	
	frame()
	{
		const curTime = this.getTime();
		const dt = Math.min(1000, curTime - this._prevTime);
		this._prevTime = curTime;
		this._lagTime += dt;

		while(this._lagTime > this._timeStep) {
		  this._lagTime -= this._timeStep;
		  this.broadcast('update', this._timeStep / 1000);
		}

		this.broadcast('render', dt / 1000);
		++this.FPSCounter;
		this._frameId = requestAnimationFrame(this._frame);
	}

	start() {
		if(this._prevTime === null) {
		  this.broadcast('init');
		}

		this.broadcast('start');
		this._prevTime = this.getTime();
		this.fpsTimer.setInterval(1);
		this.frame();
	}

	stop() {
		this.fpsTimer.stop()
		this.broadcast('stop');
		cancelAnimationFrame(this._frameId);
		this._frameId = null;
	}

	dispose()
	{
		this.stop();
		super.dispose();
	}
	
};