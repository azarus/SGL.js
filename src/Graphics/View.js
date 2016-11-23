@globalClass
export default class View
{
	constructor(x, y, width, height, rotation, zoom)
	{
		this.reset();
		this.setPosition(x, y);
		this.setSize(width, height);
		this.rotate(rotation || 0);
		this.zoom(zoom || 1);
		this.setViewport(0, 0, width, height);
	}
	
	reset()
	{
		this.requiresUpdate = true;
		this.matrix = Matrix.identity();
		this.x = 0;
		this.y = 0;
		this.width = 0
		this.height = 0;
		this.origin = {x: 0, y: 0};
		this.angle = 0;
		this.zoomfactor = 1;
	}
	
	setPosition(x, y)
	{
		this.x = x 
		this.y = y;
		this.requiresUpdate = true;
	}
	
	move(xoffset, yoffset)
	{
		this.x += xoffset || 0;
		this.y += yoffset || 0;
		this.requiresUpdate = true;
	}

	setSize(width, height)
	{
		this.width = width || this.width;
		this.height = height || this.height;
		this.origin.x = width/2;
		this.origin.y = height/2;
		this.requiresUpdate = true;
	}
	
	setRotation(angle)
	{
		this.angle = angle || this.angle;
		this.requiresUpdate = true;
	}

	rotate(angle)
	{
		this.angle += angle;
		this.requiresUpdate = true;
	}
	
	setZoom(factor)
	{
		this.zoomfactor = factor;
		if(this.zoomfactor < 0)
			this.zoomfactor = 0;
		this.requiresUpdate = true;
	}

	zoom(factor)
	{
		this.zoomfactor += factor;
		if(this.zoomfactor < 0)
			this.zoomfactor = 0;
		this.requiresUpdate = true;
	}

	setViewport(x, y, width, height)
	{
		this.viewPort = [x, y, width, height];
	}

	getViewport()
	{
		return this.viewPort;//[this.x, this.y, this.width, this.height];
	}

	getMatrix()
	{
		if(this.requiresUpdate)
		{
			var matrix = Matrix.projection(this.width, this.height);

			// Compute Matrices
			var translationMatrix = Matrix.translation(this.x, this.y);
			var rotationMatrix = Matrix.rotation(this.angle);
			var originMatrix = Matrix.translation(this.width/2, this.height/2);
			//console.log(this.origin);
			var scaleMatrix = Matrix.scaling(this.zoomfactor, this.zoomfactor);

			// Multiply
			matrix = Matrix.multiply(matrix, translationMatrix);
			matrix = Matrix.multiply(matrix, originMatrix);
			matrix = Matrix.multiply(matrix, rotationMatrix);
			matrix = Matrix.multiply(matrix, scaleMatrix);
			

			this.matrix = matrix;
			this.requiresUpdate = false;
		}
		return this.matrix;
	}
}