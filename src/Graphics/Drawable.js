@globalClass
export default class Drawable extends Transform
{
	constructor(width, height)
	{
		super();
		
		this.width = width || 100;
		this.height = height || 100;
	}

	draw()
	{
	}
};