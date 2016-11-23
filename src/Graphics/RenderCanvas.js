@globalClass
export default class RenderCanvas extends RenderTarget
{
	constructor(canvas)
	{
		super();

		var settings = { 
			alpha: true, 
			antialias: true, 
			depth: true, 
			stencil: true 
		};
		
		// Try to grab the standard context. If it fails, fallback to experimental.
		this.gl = canvas.getContext("webgl", settings) || canvas.getContext("experimental-webgl", settings);
		
		
		// If we don't have a GL context, give up now
		if (!this.gl)
		{
			alert("Unable to initialize WebGL. Your browser may not support it.");
		}
		
	

		// set gl context current
		this.bind();
		Shader.initGlobals();
		BlendMode.initGlobals();

		//gl.enable(gl.DEPTH_TEST);
    	//gl.enable(gl.STENCIL_TEST);
    	gl.frontFace(gl.CW);
		// Initialize canvas
		this.init(canvas.clientWidth, canvas.clientHeight);
		
	}

	isContextCurrent()
	{
		if(global.gl == this.gl)
			return true;
		return false;
	}

	bind()
	{
		global.gl = this.gl;
		// unbind any frame buffer, and render to back buffer
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		
	}

	unbind()
	{
		global.gl = null;
	}
	
};