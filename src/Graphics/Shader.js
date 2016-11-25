@globalClass
export default class Shader
{
	constructor()
	{
		this.isCompiled = false;
		this.program = gl.createProgram();
	}

	static initGlobals()
	{
		Shader.Vertex = gl.VERTEX_SHADER;
		Shader.Pixel = gl.FRAGMENT_SHADER;
	}

	create(source, type)
	{
		var shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
		{

			var info = gl.getShaderInfoLog(shader);
			console.warn(info);
			return info;
		}

		gl.attachShader(this.program, shader);
		return true;
	}

	compile()
	{
		gl.linkProgram(this.program);
		var info = gl.getProgramInfoLog(this.program);
		if(!info)
		{
			this.isCompiled = true;
			return true;
		}
		console.warn(info, this.isCompiled);
		return info;
	}

	bind()
	{
		if(this != Shader.CurrentShader)
		{
			gl.useProgram(this.program);
			Shader.CurrentShader = this;
		}
	}

	unbind()
	{
		gl.useProgram(null);
	}

	setBufferParameter(param, buffer)
	{
		if(!buffer)
		{
			console.log("Invalid buffer");
			return;
		}

		this.bind();
		var Attribute = gl.getAttribLocation(this.program, param);
		gl.enableVertexAttribArray(Attribute);
		buffer.bind();
		gl.vertexAttribPointer(Attribute, buffer.itemSize, gl.FLOAT, false, 0, 0);
	}

	setParam4D(param, array)
	{
		this.bind();
		var Attribute = gl.getUniformLocation(this.program, param);
		gl.uniform4fv(Attribute, new Float32Array(array));
	}

	setParam3D(param, Vector)
	{
		this.bind();
		var Attribute = gl.getUniformLocation(this.program, param);
		gl.uniform3fv(Attribute, new Float32Array(Vector));
	}

	setParam2D(param, Vector)
	{
		this.bind();
		var Attribute = gl.getUniformLocation(this.program, param);
		gl.uniform2fv(Attribute, new Float32Array(Vector));
	}

	setParam2DArray(param, Vector)
	{
		this.bind();
		var Attribute = gl.getUniformLocation(this.program, param);
		gl.uniform2fv(Attribute, Vector);
	}

	setParameter(param, Vector)
	{
		this.bind();
		var Attribute = gl.getUniformLocation(this.program, param);
		gl.uniform1f(Attribute, Vector);
	}

	setTextureParameter(param, texture, index)
	{
		this.bind();
		var Attribute = gl.getUniformLocation(this.program, param);
		if(texture == undefined || texture == 0)
		{
			gl.uniform1i(Attribute, null);
			return;
		}

		gl.activeTexture(gl.TEXTURE0 + (index || 0));
		texture.bind();
		gl.uniform1i(Attribute, index || 0);
	
	}

	setMatrixParameter(param, matrix)
	{
		this.bind();
		var Attribute = gl.getUniformLocation(this.program, param);
		gl.uniformMatrix3fv(Attribute, false, matrix);
	}
};

Shader.Vertex = 35633;
Shader.Pixel = 35632;
Shader.CurrentShader = null;