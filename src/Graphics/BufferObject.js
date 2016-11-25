@globalClass
export default class BufferObject
{
	constructor(data, size, buffertype, type, drawmode)
	{
		this.buffer = gl.createBuffer();
		this.type = type || gl.TRIANGLES;
		this.buffertype = buffertype;
		this.drawmode = drawmode || gl.STATIC_DRAW;
		this.numItems = 0;
		this.itemSize = 0;

		if(data != undefined)
		{
			this.create(data, size)
		}
 	}

 	create(data, size, type)
 	{
		this.data(data, size);
		this.type = type || gl.TRIANGLES;
		
 	}

 	destroy()
 	{
 		gl.deleteBuffer(this.buffer);
 	}

	update(data, offset)
	{
		gl.bindBuffer(this.buffertype, this.buffer);
		gl.bufferSubData(this.buffertype, offset, new Float32Array(data));
	}
	
	data(data, size)
	{
		gl.bindBuffer(this.buffertype, this.buffer);
		gl.bufferData(this.buffertype, new Float32Array(data), this.drawmode);
		this.numItems = data.length / size;
		this.itemSize = size;
	}

	bind()
	{
		gl.bindBuffer(this.buffertype, this.buffer);
	
	}

	unbind()
	{
		gl.bindBuffer(this.buffertype, null);	
	}
};