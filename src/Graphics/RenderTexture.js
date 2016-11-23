@globalClass
export default class RenderTexture extends RenderTarget
{
	constructor(width, height)
	{
		// Initializes Texture Buffer
		super();
		
		this.init(width, height);
		this.reset();

		
		// Create Frame Buffer
		this.frameBuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

		// Cached for external use.
		this.frameBuffer.width = this.width;
		this.frameBuffer.height = this.height;
		
		// Bind Texture Buffer
		this.texture = new Texture();
		this.texture.width = this.width;
		this.texture.height = this.height;
		this.texture.initParameters();
		gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 
		// Assign Texture to Frame Buffer
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		
		// Create Render Buffer
		this.renderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);

        // Assign Render Buffer to Frame Buffer
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);

        // Assign Render Buffer to Texture
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);

        // Clean Up
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	}

	destroy()
	{
		this.texture.destroy();
		gl.deleteFramebuffer(this.frameBuffer);
		gl.deleteRenderbuffer(this.renderBuffer);
	}

	bind()
	{
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
	}

	getTexture()
	{
		return this.texture;
	}
}