@globalClass
export default class SpriteSheet
{
	animationFrames = [];
	currentFrameIndex = 0;
	texture = null;
	
	constructor(speed = 10, texture = null)
	{
		this.setSpeed(speed);
		this.setTexture(texture);
	}
	
	setSpeed(newSpeed = 10) // step image x times in a second
	{
		this.speed = 1 / newSpeed;
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
		var v = height / this.texture.height;
		this.addFrameUVs(sx, sy, u, v);
	}

	addFrameUVs(sx, sy, u, v)
	{
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