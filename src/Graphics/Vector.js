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
};