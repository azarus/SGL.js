@globalClass
export default class Light extends Drawable
{
	shadowBuffer = null;
	x = 0;
	y = 0;
	constructor(color = Color.White, radius = 128, intensity = 1, lightTexture)
	{
		super(radius, radius);
		this.color = color;
		this.setRadius(radius);
		this.intensity = intensity;


		this.shader = new Shader();
		this.texture = null;
		if(lightTexture != undefined)
		{
			this.texture = new Texture(lightTexture);
			this.texture.setRepeated(true);
			this.texture.setSmooth(true);
			//this.setOrigin(-this.width/2, -this.height/2);
		}
		

		this.shader.create("precision mediump float;"+
		"varying vec2 vVertexCoords;"+
		"uniform vec4 uLightColor;"+
		"uniform float uLightIntensity;"+
		"uniform sampler2D uTexture;"+
		"void main(void) {gl_FragColor = uLightColor * (uLightIntensity * texture2D(uTexture, vVertexCoords).r);}", Shader.Pixel);
	



		this.shader.create("attribute vec2 aVertexPosition;"+
		"attribute vec2 aVertexCoords;"+
		"uniform mat3 uMatrix;"+
		"varying vec2 vVertexCoords;"+
		"void main(void) { vVertexCoords = aVertexCoords; gl_Position = vec4((uMatrix * vec3(aVertexPosition, 1)).xy, 0, 1); }", Shader.Vertex);

		this.shader.compile();

		this.setUVs(0, 0, 1, 1);
		
	}

	setLightTexture( texture )
	{
		this.texture = texture;
	}

	setRadius(radius)
	{
		this.radius = radius;
		this.width = radius;
		this.height = radius;
		if(this.vbo)
			this.vbo.destroy();

		this.vbo = new VertexBuffer([
			0.0, 0.0,
			radius, 0.0,
			radius, radius,
			0.0, 0.0,
			radius, radius,
			0.0, radius,
        ], 2);

        this.setOrigin(-radius/2,-radius/2);
	}

	setIntensity(intensity)
	{
		this.intensity = intensity;
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


	draw(renderTarget)
	{

		if(this.shader.isCompiled)
		{
		
			var matrix = this.getMatrix();
			this.shader.bind();
			this.shader.setBufferParameter("aVertexPosition", this.vbo);
			this.shader.setBufferParameter("aVertexCoords", this.uvs);
			this.shader.setMatrixParameter("uMatrix", Matrix.multiply(renderTarget.view.getMatrix(), matrix));
			this.shader.setParam4D("uLightColor", this.color.getParam4D());
			this.shader.setParameter("uLightIntensity", this.intensity);
			this.shader.setParam2D("uLightPos", [this.x, this.y]);
			this.shader.setTextureParameter("uTexture", this.texture);
			renderTarget.drawBuffer(this.vbo);
	
		}else{
			console.log("Shader not compiled? :(");
		}

		// gl.disable(gl.BLEND);
		// gl.clear(gl.STENCIL_BUFFER_BIT); 

		
	}
}