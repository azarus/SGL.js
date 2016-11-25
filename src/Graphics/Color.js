@globalClass
export default class Color
{
	constructor(r, g, b, a = 255)
	{
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	static fromHex(hex, opacity)
	{
		opacity = opacity || 1;
    	hex = hex.replace('#','');
    	var r = parseInt(hex.substring(0,2), 16);
    	var g = parseInt(hex.substring(2,4), 16);
    	var b = parseInt(hex.substring(4,6), 16);
    	var a = opacity * 255;
    	console.log(r, g, b, a);
	    return new Color(r, g, b, a);
	}
	
	static random(min, max, opacity=0)
	{
		var r = Math.getRandomInt(min, max);
		var g = Math.getRandomInt(min, max);
		var b = Math.getRandomInt(min, max);
		var a = Math.getRandomInt(min, max);
		return new Color(r, g, b, a + opacity);
	}

	getParam3D()
	{
		return [this.r, this.g, this.b];
	}

	getParam4D()
	{
		return [this.r, this.g, this.b, this.a];
	}


};
//global.Color = Color;

Color.Black = new Color(0, 0, 0);
Color.White = new Color(255, 255, 255);
Color.Red = new Color(255, 0, 0);
Color.Green= new Color(0, 255, 0);
Color.Blue = new Color(0, 0, 255);
Color.Yellow = new Color(255, 255, 0);
Color.Magenta = new Color(255, 0, 255);
Color.Cyan = new Color(0, 255, 255);
Color.Transparent = new Color(0, 0, 0, 0);
