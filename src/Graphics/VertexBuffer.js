@globalClass
export default class VertexBuffer
{
	constructor(data, size, type, drawmode)
	{
		this.buffer = gl.createBuffer();
		this.type = type || gl.TRIANGLES;
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
 		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), this.drawmode);
		this.type = type || gl.TRIANGLES;
		this.numItems = data.length / size;
		this.itemSize = size;
 	}

 	destroy()
 	{
 		gl.deleteBuffer(this.buffer);
 	}

	update(data, offset)
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, offset, new Float32Array(data));
	}

	bind()
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	
	}

	unbind()
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, null);	
	}
};