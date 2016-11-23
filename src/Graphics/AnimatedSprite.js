@globalClass
export default class AnimatedSprite extends Sprite
{
	currentAnimation = null;
	isPlaying = false;
	lastUpdateTime = null;
	constructor(width, height)
	{
		super(null, width, height);
	}
	
	setAnimation(animation, reset = false)
	{
		// Set the current animation
		this.currentAnimation = animation;
		// Switch textures if required
		this.setTexture(animation.texture);
		
		// Reset the frame counter and update UVs
		if(reset)
		{
			animation.resetFrames();
		}
		var uvs = animation.getFrame();
		if(!uvs)
			return;
		this.updateUVs(uvs.x, uvs.y, uvs.u, uvs.v);
	}
	
	// Should be called in the update thread and delta time must be feeded
	update(deltaSeconds)
	{
		if(this.currentAnimation && this.isPlaying)
		{
			if(this.lastUpdateTime >= this.currentAnimation.speed)
			{
				this.currentAnimation.stepFrame();
				var uvs = this.currentAnimation.getFrame();
				if(!uvs)
					return;
				this.updateUVs(uvs.x, uvs.y, uvs.u, uvs.v);
				this.lastUpdateTime = 0;
			}else{
				this.lastUpdateTime += deltaSeconds;
			}
		}
	}
	
	play()
	{
		this.isPlaying = true;
	}
	
	stop()
	{
		this.isPlaying = false;
	}
};