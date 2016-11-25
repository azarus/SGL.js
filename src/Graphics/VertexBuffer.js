@globalClass
export default class VertexBuffer extends BufferObject
{
	constructor(data, size, type, drawmode)
	{
		super(data, size, gl.ARRAY_BUFFER, type, drawmode);
 	}
};