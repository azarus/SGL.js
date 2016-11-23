@globalClass
export default class Texture
{
	constructor(source)
	{
		this.width = 0;
		this.height = 0;
		this.source = null;
		this.loaded = false;
		this.isRepeated = false;
		this.isSmooth = false;
		this.hasMipmap = false;
		this.texture = gl.createTexture();

		if(source == undefined)
			return;

		this.loadFromFile(source);
	}

	loadFromFile(source)
	{
		this.texture.image = new Image();
		this.texture.image.onload = function() {
			this.loadFromImage(this.texture.image);
		}.bind(this);
		this.texture.image.src = source;
		this.source = source;
	}

	destroy()
	{
		gl.deleteTexture(this.texture);
	}

	loadFromImage(image)
	{
		this.width = image.width;
		this.height = image.height;
		this.loaded = true;

		console.log("Loaded image: "+ image.src, "Size: "+ this.width+"x"+this.height+"px");

		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		this.initParameters();
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.flush();
	}

	initParameters()
	{
		this.setSmooth(this.isSmooth);
		if(this.isSmooth)
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}else{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		}
		this.setRepeated(false);
		
	}

	static NumberIsPowerOfTwo(n)
	{  
		if (typeof n !== 'number')   
		  return 'Not a number';   

		return n && (n & (n - 1)) === 0;  
	}  

	// Returns an image (Usefull for debuggning purpose)
	getImage()
	{
		if(!this.loaded)
			return false;

		// Create a framebuffer backed by the texture
		var framebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

		// Read the contents of the framebuffer
		var data = new Uint8Array(this.width * this.height * 4);
		gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, data);

		gl.deleteFramebuffer(framebuffer);

		// Create a 2D canvas to store the result 
		var canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		var context = canvas.getContext('2d');

		// Copy the pixels to a 2D canvas
		var imageData = context.createImageData(this.width, this.height);
		imageData.data.set(data);
		context.putImageData(imageData, 0, 0);

		var img = new Image();
		img.src = canvas.toDataURL();
		return img;
	}

	update(image, x, y, width, height)
	{
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, image);
	}

	copy(x, y, sx, sy, width, height)
	{
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, x, y, sx, sy, width, height);
	}

	setRepeated(repeated)
	{
		this.isRepeated = repeated;
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		
		if(this.isRepeated)
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		}else{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
	}

	setSmooth(smooth)
	{
		this.isSmooth = smooth;
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		if(this.isSmooth)
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		}else{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		}

		if(this.hasMipmap)
		{
			if(this.isSmooth)
			{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			}else{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
			}
		}else{
			if(this.isSmooth)
			{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			}else{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			}
		}
	}

	generateMipmap()
	{
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.generateMipmap(gl.TEXTURE_2D);
		this.hasMipmap = true;
		this.setSmooth(this.isSmooth);
		
	}

	invalidateMipmap()
	{
		this.hasMipmap = false;
		this.setSmooth(this.isSmooth);
	}

	bind()
	{
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
	}

	unbind()
	{
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

};