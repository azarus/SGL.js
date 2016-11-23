@globalClass
export default class SpriteLight extends Drawable
{
	pos = [0, 0];

	x = 35;
	y = 40;

	constructor(source, width, height, x, y)
	{
		super(width, height);
		this.x = x;
		this.y = y;
		this.shader = new Shader();
		this.texture = null;
		if(source != undefined)
		{
			this.texture = new Texture(source);
			this.texture.setRepeated(true);
			this.texture.setSmooth(true);
			this.setOrigin(-this.width/2, -this.height/2);
		}
		
		
		// Load Shaders
		Asset.load("light.glsl", function(content)
		{
			this.shader.create(content, Shader.Pixel);
			this.shader.compile();
		}.bind(this));

		this.shader.create("attribute vec2 aVertexPosition;"+
		"attribute vec2 aVertexCoords;"+
		"uniform mat3 uMatrix;"+
		"varying vec2 vVertexCoords;"+
		"void main(void) { vVertexCoords = aVertexCoords; gl_Position = vec4((uMatrix * vec3(aVertexPosition, 1)).xy, 0, 1); }", Shader.Vertex);

		this.shader.compile();	
		
		this.initBuffers();
		
	}

	initBuffers()
	{
		// Create Vertex Buffers
		this.setSize(this.width, this.height);
		this.setUVs(0.0, 0.0, 1.0, 1.0);
	}

	setTexture( texture )
	{
		this.texture = texture;
		this.width = texture.width;
		this.height = texture.height;
		//this.setOrigin(-this.width/2, -this.height/2);
	}

	setSize(width, height)
	{
		if(this.vbo)
			this.vbo.destroy();

		this.vbo = new VertexBuffer([
			0.0, 0.0,
			width, 0.0,
			width, height,
			0.0, 0.0,
			width, height,
			0.0, height,

		
        ], 2);
	}

	setUVs(x, y, u, v)
	{
		if(this.uvs)
			this.uvs.destroy();

		this.uvs = new VertexBuffer([
            x, y,
			u, y,
			u, v,
			x, y,
			u, v,
			x, v
        ], 2);
	}

	updateUVs(x, y, u ,v)
	{
		// New UV data
		this.uvs.update([
            x, y,
			u, y,
			u, v,
			x, y,
			u, v,
			x, v
        ], 0);
	}
	

	draw(renderTarget)
	{
		//console.log(this.shader.isCompiled);
		if(this.shader.isCompiled && this.texture != null)
		{

			var matrix = this.getMatrix();

			this.shader.bind();
			this.shader.setBufferParameter("aVertexPosition", this.vbo);
			//this.shader.setBufferParameter("aVertexColors", this.colors);
			this.shader.setBufferParameter("aVertexCoords", this.uvs);
			this.shader.setMatrixParameter("uMatrix", Matrix.multiply(renderTarget.view.getMatrix(), matrix));
			this.shader.setTextureParameter("uTexture", this.texture);
			//this.shader.setParam2D("uLightPos", [this.x/100, this.y/100]);
			this.shader.setParam2D("uLightPositions", [
				this.x/100, this.y/100, (this.x+25)/100, (this.y+25)/100
				]);
			//this.shader.setParam2D("t0", this.pos);
			renderTarget.drawBuffer(this.vbo);
	
		}else{
			console.log("Shader not compiled? :(");
		}

		
	}
}