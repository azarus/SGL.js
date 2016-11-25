@globalClass
export default class IndexBuffer extends BufferObject
{
	constructor(data, size, type, drawmode)
	{
		super(data, size, gl.ELEMENT_ARRAY_BUFFER, type, drawmode);
 	}
};