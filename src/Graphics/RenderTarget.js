@globalClass
export default class RenderTarget
{
	init(width, height)
	{
		this.view = null;
		this.defaultView = null;
		this.width = width;
		this.height = height;
		this.reset();
	}

	reset()
	{
		this.defaultView = new View(0, 0, this.width, this.height);
		this.defaultView.setViewport(0, 0, this.width, this.height);
		console.log("Creating default view");
		this.setView(this.defaultView);
	}

	clear(color)
	{
		this.bind();
		Texture.bind(0);
		gl.clearColor(color.r / 255.0, color.g / 255.0, color.b / 255.0, color.a / 255.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

	setView(view)
	{
		this.view = view;
	}

	draw(drawable, blendmode)
	{
		if(blendmode != undefined)
		{
			blendmode.bind();
		}else{
			BlendMode.Alpha.bind();
		}
		drawable.draw(this);
	}

	applyViewport()
	{
		var viewport = [0, 0, 1, 1];
		if(!this.view)
		{
			viewport = this.defaultView.getViewport();
		}else{
			viewport = this.view.getViewport();
		}

	
		//console.log(viewport);
		//gl.viewport(viewport[0], this.height - (viewport[1] + viewport[3]), viewport[2], viewport[3]);
		gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
	}

	drawBuffer(buffer)
	{
		this.bind();
		this.applyViewport();
		gl.drawArrays(buffer.type, 0, buffer.numItems);
	}
	
	drawElements(buffer)
	{
		this.bind();
		this.applyViewport();
		gl.drawElements(buffer.type, buffer.numItems, gl.UNSIGNED_SHORT, buffer.buffer);
	}

	bind()
	{
		// Nothing to do
	}
};