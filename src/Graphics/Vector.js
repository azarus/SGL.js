@globalClass
export default class Vector
{
	x = 0;
	y = 0;

	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

    static sub(vector1, vector2)
    {
        return {
            x: vector1.x - vector2.x,
            y: vector1.y - vector2.y
        };
    }
  
    static add(vector1, vector2)
    {
        return {
            x: vector1.x + vector2.x,
            y: vector1.y + vector2.y
        };
    }

    static dot(vector1, vector2)
    {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }
   
    static equal(vector1, vector2)
    {
        if(vector1.x == vector2.x && vector1.y == vector2.y) {
            return true;
        } else {
            return false;
        }
    }
  
    static scale(scale, vector)
    {
        return {
            x : vector.x * scale,
            y : vector.y * scale
        };
    }
	
	static lengthSq(vector)
	{
		return vector.x * vector.x + vector.y * vector.y;
	}
	
	static length(vector)
	{
		return Math.sqrt(Vector.lengthSq(vector));
	}
	
	static normalize(vector)
	{
		var length = Vector.length(vector);
		if(length === 0)
		{
			return {
				x: 1,
				y: 0
			};
		} else {
			return Vector.divide(vector, {x: length, y: length});
		}	
	}
	
	static divide(a, b)
	{
		return {
			x: a.x / b.x,
			y: a.y / b.y
		};
	}
	
	static multiply(a, b)
	{
		return {
			x: a.x * b.x,
			y: a.y * b.y
		};
	}
	
};