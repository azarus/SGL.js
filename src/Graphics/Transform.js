@globalClass
export default class Transform
{
	constructor(x, y, scalex, scaley, angle, originx, originy)
	{
		this.reset();

		this.setPosition(x || 0, y || 0);
		this.setScale(scalex || 1, scaley || 1);
		this.setRotation(angle || 0);
		this.setOrigin(originx || 0, originy || 0);
	}

	reset()
	{
		this.position = {x: 0, y:0};
		this.scale = {x: 1, y: 1};
		this.origin = {x: 0, y: 0};
		this.angle = 0;
	}

	setPosition(x, y)
	{
		this.position.x = x;// || this.position.x;
		this.position.y = y;// || this.position.y;
	}

	move(x, y)
	{
		this.position.x += x || 0;
		this.position.y += y || 0;
	}

	setScale(x, y)
	{
		this.scale.x = x;
		this.scale.y = y;
	}

	setRotation(angle)
	{
		this.angle = angle;
	}

	rotate(angle)
	{
		this.angle += angle;
	}

	setOrigin(x, y)
	{
		this.origin.x = x;
		this.origin.y = y;
	}

	getMatrix()
	{
		// Compute Matrices
		var translationMatrix = Matrix.translation(this.position.x, this.position.y);
		var rotationMatrix = Matrix.rotation(this.angle);
		var originMatrix = Matrix.translation(this.origin.x, this.origin.y);
		var scaleMatrix = Matrix.scaling(this.scale.x, this.scale.y);

		// Multiply
		var matrix = Matrix.identity();
		matrix = Matrix.multiply(matrix, translationMatrix);
		matrix = Matrix.multiply(matrix, rotationMatrix);
		
		matrix = Matrix.multiply(matrix, scaleMatrix);
		matrix = Matrix.multiply(matrix, originMatrix);

		return matrix;
	}
};