@globalClass
export default class AnimationFrames
{
	animationFrames = [];
	currentFrameIndex = 0;
	texture = null;
	
	constructor(speed = 0.2, texture = null)
	{
		this.speed = speed;
		this.setTexture(texture);
	}
	
	setSpeed(newSpeed = 0.2) // step image in every x seconds
	{
		this.speed = newSpeed;
	}
	
	setTexture(texture)
	{
		this.texture = texture;
	}
	
	addFrame(x, y, width, height)
	{
		var sx = x / this.texture.width;
		var sy = y / this.texture.height;
		var u = width / this.texture.width;
		var v = height / this.texture.width;
		this.animationFrames.push({x: sx, y: sy, u: u, v: v});
	}
	
	getFrame()
	{
		return this.animationFrames[this.currentFrameIndex];
	}
	
	stepFrame()
	{
		this.currentFrameIndex++;
		if(this.currentFrameIndex >= this.animationFrames.length)
			this.currentFrameIndex = 0;
		// Steps to the next frame in the animation
	}
	
	resetFrames()
	{
		this.currentFrameIndex = 0;
	}
	
};