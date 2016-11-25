@globalClass
export default class ShadowHull
{
	vertices = [];
	constructor(vertices)
	{

		this.vertices = vertices;
	}

	getVertices()
	{
		return this.vertices;
	}

	getVerticesAsVector()
	{
		var vertices = [];
		for(var v =0;v<this.vertices.length;v+=2)
		{
			vertices.push(new Vector(this.vertices[v], this.vertices[v+1]));
		}
		return vertices;
	}

	static makeQuad(x, y, w, h)
	{
		return new ShadowHull([
			x, y,
			x+w, y,
			x+w, y+h,
			x, y,
			x+w, y+h,
			x, y+h
		]);
	}

	static makeCircle(x, y, radius=32, resolution = 12)
	{
		var points = [];

		for (var a = 0.0; a < 360.0; a += (360.0 / resolution))
		{
			var heading = a * Math.radians(1);
			points.push(new Vector(Math.cos(heading) * radius, Math.sin(heading) * radius));
		}

		var vertices = [];
		
		for(var i =0;i<points.length;++i)
		{
			var currentVertex = points[i];
			var nextVertex = points[(i + 1) % points.length]; 

			vertices.push.apply(vertices, [
				x+currentVertex.x, y+currentVertex.y,
				x+nextVertex.x, y+nextVertex.y,
				x, y,
			]);
		}
		
		return new ShadowHull(vertices);
	}


}