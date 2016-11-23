@globalClass
export default class TileMap extends Drawable
{
	constructor(tileWidth, tileHeight, mapWidth, mapHeight)
	{
		super(mapWidth*tileWidth, mapHeight*tileHeight);

		this.shader = new Shader();

		this.shader.create("precision mediump float;"+
		"varying vec2 vVertexCoords;"+
		"uniform sampler2D uTexture;"+
		"void main(void) {gl_FragColor = texture2D(uTexture, vVertexCoords);}", Shader.Pixel);

		this.shader.create("attribute vec2 aVertexPosition;"+
		"attribute vec2 aTileUvs;"+
		"uniform mat3 uMatrix;"+
		"uniform vec2 uResolution;"+
		"varying vec2 vVertexCoords;"+
		"void main(void) { vVertexCoords = aTileUvs; gl_Position = vec4((uMatrix * vec3(aVertexPosition, 1)).xy, 0, 1); }", Shader.Vertex);

		this.shader.compile();	

		this.mapWidth = mapWidth;
		this.mapHeight = mapHeight;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;

		//this.test(this.width, this.height);
		//this.test2(0.0, 0.0, 1.0, 1.0);

		this.buildTileMesh();
		this.buildUVMap();
		
	}
	
	setTextureAtlas( textureAtlas )
	{
		this.textureAtlas = textureAtlas;
		//this.buildUVMap();
	}

	setSize(width, height, tileWidth, tileHeight)
	{
		this.mapWidth = width;
		this.mapHeight = height;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		//this.buildTileMesh();

	}

	buildTileMesh()
	{
		if(this.vbo)
			this.vbo.destroy();

		// Generate Tile Map Mesh
		var vboBuffer = [];
		for(var x=0; x<this.mapWidth; ++x)
		{
			for(var y=0; y<this.mapHeight; ++y)
			{
				vboBuffer.push.apply(vboBuffer, Tile.MakeMesh(this.tileWidth, this.tileHeight, x, y, 1));
			}	
		}
		console.log(vboBuffer);
		this.vbo = new VertexBuffer(vboBuffer, 2);


	}

	buildUVMap()
	{
		if(this.uvs)
			this.uvs.destroy();

		console.log("Re building uvmap for mesh");
		var uvBuffer = [];
		for(var x=0; x<this.mapWidth; ++x)
		{
			for(var y=0; y<this.mapHeight; ++y)
			{
				if(this.textureAtlas != null)
				{
					var uv = this.textureAtlas.getUVs(Math.floor(Math.random() * (100 - 10) + 10));
				}
				if(uv != undefined)
				{
					uvBuffer.push.apply(uvBuffer, Tile.MakeUV(uv.x, uv.y, uv.u, uv.v));
				}else{
					uvBuffer.push.apply(uvBuffer, Tile.MakeUV(0, 0, 0.1, 0.1));
				}
				
			}
		}
		console.log(uvBuffer);
		this.uvs = new VertexBuffer(uvBuffer, 2);
	}

	updateTile(x, y, image)
	{
		var uv = this.textureAtlas.getUVs(image);
		console.log(this.textureAtlas);
		if(!uv)
			return false;

		this.uvs.update(Tile.MakeUV(uv.x, uv.y, uv.u, uv.v), x*y*12);
	}

	draw(renderTarget)
	{
		if(this.shader.isCompiled && this.textureAtlas != null)
		{

			var matrix = this.getMatrix();

			this.shader.bind();
			this.shader.setBufferParameter("aVertexPosition", this.vbo);
			this.shader.setBufferParameter("aTileUvs", this.uvs);
			this.shader.setMatrixParameter("uMatrix", Matrix.multiply(renderTarget.view.getMatrix(), matrix));
			this.shader.setTextureParameter("uTextureAtlas", this.textureAtlas);
			renderTarget.drawBuffer(this.vbo);
			console.log("Drawing");
	
		}else{
			console.log("Shader not compiled? :(");
		}

		
	}
};


@globalClass
class Tile
{
	static MakeMesh(width, height, x, y, alpha)
	{
		return [
			(width * x), 		(height * y),			//alpha,
			(width * (x + 1)), 	(height * y),			//alpha,
			(width * (x + 1)), 	(height * (y + 1)),		//alpha,
			(width * x), 		(height * y),			//alpha,
			(width * (x + 1)), 	(height * (y + 1)),		//alpha,
			(width * x), 		(height * (y + 1)),		//alpha,
        ];
	}

	static MakeUV(x, y, u, v)
	{
		return [
            x, y,
			u, y,
			u, v,
			x, y,
			u, v,
			x, v
        ];
	}
};

Tile.None = -1;
