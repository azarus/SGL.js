import "./Light";
import "./ShadowHull";

@globalClass
export default class Lightmap extends Drawable
{
	lights = [];
	shadowHulls = [];
	blockColor = Color.Black;
	shadowColor = Color.Black;
	shadowHullBuffer = null;
	NormalBuffer = null;
	shadowBlockBuffer = null;

	constructor(width, height)
	{
		super(width, height);
		this.shader = new Shader();


		this.shader.create("precision mediump float;"+
		"uniform vec3 uColor;"+
		"void main(void){ gl_FragColor = vec4(uColor, 1);}", Shader.Pixel);

		this.shader.create("attribute vec2 aVertexPosition;"+
		"attribute vec2 aVertexNormal;"+
		"uniform mat3 uMatrix;"+
		"uniform vec2 uLightPosition;\n"+
		"#define SHADOW_RANGE 1500.0\n"+

		"void main(void) {"+
		// Calculate Shadow Casting Direction
		"vec2 Direction = normalize(aVertexPosition.xy - uLightPosition.xy);"+
		"vec2 Position = aVertexPosition;"+
		// Translate shadow casting vertices
		"if(dot(aVertexNormal, Direction) > 0.0) {"+
		"Position = Position + (Direction * SHADOW_RANGE);"+
		"}"+
		// And compute final position
		"gl_Position = vec4((uMatrix * vec3(Position, 1)).xy, 0, 1);}", Shader.Vertex);

		this.shader.compile();
	}


	addShadowHull(hull)
	{
		this.shadowHulls.push(hull);
	}

	removeShadowHull(hull)
	{
		this.shadowHulls.splice(this.shadowHulls.indexOf(hull), 1);
	}

	rebuild()
	{
		if(this.shadowHullBuffer)
			this.shadowHullBuffer.destroy();
		
		if(this.NormalBuffer)
			this.NormalBuffer.destroy();

		var BlockVertices = [];
		var Vertices = [];
		var Normals = [];

		for(var h = 0;h<this.shadowHulls.length;++h)
		{
			var vertices = this.shadowHulls[h].getVerticesAsVector();
			BlockVertices.push.apply(BlockVertices, this.shadowHulls[h].getVertices());
			
			// for(var v =0;v<this.shadowHulls[h].length;v+=2)
			// {
			// 	vertices.push(new Vector(this.shadowHulls[h][v], this.shadowHulls[h][v+1]));
			// 	BlockVertices.push.apply(BlockVertices, [this.shadowHulls[h][v], this.shadowHulls[h][v+1]]);
			// }
			
		
			for(var v = 0; v < vertices.length; v++)
			{
				var currentVertex = vertices[v];
                var nextVertex = vertices[(v + 1) % vertices.length]; 

                var previousVertex = vertices[(v - 1) % vertices.length]; 
                var edge = Vector.sub(nextVertex, currentVertex);
            
                var normal = {
                    x: edge.y,
                    y: -edge.x
                };

                // Tells to stop casting shadows or not
                var flipnormal = {
                    x: -edge.y,
                    y: edge.x
                };

                // Add Triangle Normals
                Normals.push.apply(Normals, [
	                	// Triangle 1
	                	flipnormal.x, flipnormal.y,
	                	flipnormal.x, flipnormal.y,
	                	normal.x, normal.y,

	                	// Triangle 2
	                	flipnormal.x, flipnormal.y,
	                	normal.x, normal.y,
	                	normal.x, normal.y
                ]);

                // Add Vertex Normals
 				Vertices.push.apply(Vertices, [
 					currentVertex.x, currentVertex.y,
 					nextVertex.x, nextVertex.y,
 					currentVertex.x, currentVertex.y,

					nextVertex.x, nextVertex.y,
 					currentVertex.x, currentVertex.y,
 					nextVertex.x, nextVertex.y,

 				]);
			}
		}
	
		this.shadowHullBuffer = new VertexBuffer(Vertices, 2);
		this.NormalBuffer = new VertexBuffer(Normals, 2);
		this.shadowBlockBuffer = new VertexBuffer(BlockVertices, 2);
		//this.shadowHullBuffer.type = gl.LINES;
	
	}

	addLight(light)
	{
		this.lights.push(light);
	}

	removeLight(light)
	{
		this.lights.splice(lights.indexOf(light), 1);
	}

	draw(renderTarget)
	{	
		if(this.shader.isCompiled)
		{
			gl.enable(gl.STENCIL_TEST);
			gl.depthMask(false);

			// Draw shadows for each light
			for(var light of this.lights)
			{
				gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
       			gl.stencilFunc(gl.ALWAYS, 1, 1);
				gl.colorMask(false, false, false, false);

				var matrix = this.getMatrix();

				this.shader.bind();
				this.shader.setBufferParameter("aVertexPosition", this.shadowHullBuffer);
				this.shader.setBufferParameter("aVertexNormal", this.NormalBuffer);
				this.shader.setMatrixParameter("uMatrix", Matrix.multiply(renderTarget.view.getMatrix(), matrix));
				this.shader.setParam3D("uColor", this.shadowColor.getParam3D());
				this.shader.setParam2D("uLightPosition", [light.position.x, light.position.y]);
				renderTarget.drawBuffer(this.shadowHullBuffer);

				gl.colorMask(true, true, true, true);
				gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
				gl.stencilFunc(gl.EQUAL, 0, 1);

			

				renderTarget.draw(light, BlendMode.One);

			
				gl.clear(gl.STENCIL_BUFFER_BIT); 
			}

			// Draw Blocks
			var matrix = this.getMatrix();

			this.shader.bind();
			this.shader.setBufferParameter("aVertexPosition", this.shadowBlockBuffer);
			this.shader.setMatrixParameter("uMatrix", Matrix.multiply(renderTarget.view.getMatrix(), matrix));
			this.shader.setParam3D("uColor", this.blockColor.getParam3D());
			//this.shadowBlockBuffer.type = gl.LINES;
			renderTarget.drawBuffer(this.shadowBlockBuffer);
	
		}else{
			//console.log("lightmap shader not compiled? :(");
		}
	}

};