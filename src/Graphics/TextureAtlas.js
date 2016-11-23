@globalClass
export default class TextureAtlas extends Texture
{
	constructor(width, height)
	{
		super();
		this.tileWidth = width;
		this.tileHeight = height;
		this.imageUVs = [];
	}

	loadFromImage(image)
	{
		super.loadFromImage(image);
		//this.buildUVMap();
	}

	buildUVMap()
	{
		console.log("Building UVmap");
		this.imageUVs = [];
		
		var numTilesX = this.width / this.tileWidth;
		var numTilesY = this.height / this.tileHeight;
		
		console.log(numTilesX, numTilesY);
		var subImageIndex = 0;
		for(var x=0;x<numTilesX;++x)
		{
			for(var y=0;y<numTilesY;++y)
			{
				var xOffset = (x*this.tileWidth)/this.width;
				var yOffset = (y*this.tileHeight)/this.height;

				var U = ((x+1)*this.tileWidth)/this.width;
				var V = ((y+1)*this.tileHeight)/this.height;
				var uv = {x: xOffset, y: yOffset, u: U, v: V };
				//console.log(uv);
				this.imageUVs[subImageIndex] = uv;
				++subImageIndex;
			}	
		}
		console.log("Building UVmap Finished");
	}


	getUVs(subImageIndex)
	{
		return this.imageUVs[subImageIndex];
	}
}