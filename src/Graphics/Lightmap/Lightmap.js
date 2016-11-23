import "./Light";
import "./SpriteLight";

@globalClass
export default class Lightmap extends Drawable
{
	lights = [];
	
	shadowBlocks = []; // Verticies of Shadow Caster Blocks
	shadowCasters = []; // Verticies of actual shadow casters

	debugShadowBlocks = true;
	debugShadowCasters = false;
	debugLights = true;
	debugOnly = true;

	constructor(width, height, shadowColor = Color.Black, shadowBlockColor = Color.Black)
	{
		super(width, height);
		this.shadowColor = shadowColor;
		this.shadowBlockColor = shadowBlockColor;
		this.shader = new Shader();

	
		// Load Shaders
		this.shader.create("precision mediump float;"+
		"varying vec2 vVertexCoords;"+
		"uniform vec3 shadowColor;"+
		"void main(void) {gl_FragColor = vec4(shadowColor, 1);}", Shader.Pixel);
		
		this.shader.create("attribute vec2 aVertexPosition;"+
		"uniform mat3 uMatrix;"+
		"void main(void) {gl_Position = vec4((uMatrix * vec3(aVertexPosition, 1)).xy, 0, 1); }", Shader.Vertex);

		this.shader.compile();
	}


	// Light Blocking objects (They will be rendered as black)
	rebuildLightMap()
	{
		console.log("Rebuilding light map");
		this.rebuildShadowCasters(); // Rebuild shadow casters from shadow blocks (no need to us this)
		for(var light of this.lights)
		{
			this.buildShadowMesh(light);
		}
	}
	
	createShadowCasterBuffer()
	{
		if(this.shadowCasterBuffer)
			this.shadowCasterBuffer.destroy();
		
		this.shadowBuffer = new VertexBuffer(this.shadowCasters, 3);
		// Shadow Caster buffers
	}
	
	createShadowBlockBuffer()
	{
		// Shadow block buffer
	}
	
	createShadowBuffer()
	{
		for(var i = 0; i < this.shadowBlocks.length; i++)
		{
			for(var x=0;x<this.shadowBlocks[i].length;++x)
			{
				this.shadowVertices.push(this.shadowBlocks[i][x]);
                   
			}
		}
		this.shadowBuffer = new VertexBuffer(this.shadowVertices, 2);
	}

	buildShadowMesh(light)
	{
		// Get vertices from shadowblocks
 		var vertices = [];
		for(var i = 0; i < this.shadowBlocks.length; i++)
		{
			for(var x=0;x<this.shadowBlocks[i].length;x+=2)
			{
				vertices.push(new Vector(this.shadowBlocks[i][x], this.shadowBlocks[i][x+1]));
			}
		}


		var shadowVertices = [];
        // Performance hit end
        for(var v = 0; v < vertices.length; v++)
        {
            var currentVertex = vertices[v];
            var nextVertex = vertices[(v + 1) % vertices.length]; 
            var edge = Vector.sub(nextVertex, currentVertex);
            var normal = new Vector(edge.y, -edge.x);

            var lightLocation = new Vector(light.position.x, light.position.y);
            var lightToCurrent = Vector.sub(currentVertex, lightLocation);
            if(Vector.dot(normal, lightToCurrent) > 0)
            {
                var point1 = Vector.add(currentVertex, Vector.scale(100, Vector.sub(currentVertex, lightLocation)));
                var point2 = Vector.add(nextVertex, Vector.scale(100, Vector.sub(nextVertex, lightLocation)));

                // Manual vertToMatrix conversion. Because this is called thousands of times a function call slows it down.
                shadowVertices.push(
                    // Triangle 1
                    point1.x, point1.y,
                    currentVertex.x, currentVertex.y,
                    point2.x, point2.y,

                    // Triangle 2
                    currentVertex.x, currentVertex.y,
                    point2.x, point2.y,
                    nextVertex.x, nextVertex.y
				);
            }
        }

        if(light.shadowBuffer)
			light.shadowBuffer.destroy();

        light.shadowBuffer = new VertexBuffer(shadowVertices, 2);
	}

	addBlock(x, y, w, h)
	{
		this.shadowBlocks.push([
			x, y,
			w, y,
			w, h,
			x, y,
			w, h,
			x, h,
        ]);
		this.createShadowBuffer();
	}

	removeBlock(x, y, w, h)
	{
		//this.shadowBlocks.splice(this.shadowBlocks.indexOf({x: x, y: y, w: w, h: h}), 1);
		this.createShadowBuffer();	
	}
	
	addShadowCaster()
	{
		
	}

	
	addLight(light)
	{
		this.lights.push(light);
		this.rebuildLightMap(light);
	}

	removeLight(light)
	{
		this.lights.splice(lights.indexOf(light), 1);
		this.rebuildLightMap(light);
	}

	drawShadowCasters(renderTarget, light)
	{
		// Draw shadow casters
			if(this.shader.isCompiled && light.shadowBuffer != null)
			{
				//console.log("Rendering light map");
				var matrix = this.getMatrix();
				this.shader.bind();
				this.shader.setBufferParameter("aVertexPosition", light.shadowBuffer);
				this.shader.setMatrixParameter("uMatrix", Matrix.multiply(renderTarget.view.getMatrix(), matrix));
				if(this.debugLights)
				{
						this.shader.setParam3D("shadowColor", light.color.getParam3D());
				}else{

				}
				

				renderTarget.drawBuffer(light.shadowBuffer);
			}
	}

	drawShadowBlocks(renderTarget)
	{
		// Draw shadow casting elements
		var matrix = this.getMatrix();
		this.shader.bind();
		this.shader.setBufferParameter("aVertexPosition", this.shadowBuffer);
		this.shader.setMatrixParameter("uMatrix", Matrix.multiply(renderTarget.view.getMatrix(), matrix));
		this.shader.setParam3D("shadowColor", this.shadowBlockColor.getParam3D());
		renderTarget.drawBuffer(this.shadowBuffer);
	}

	draw(renderTarget)
	{	
		this.rebuildLightMap();

		if(this.debugShadowCasters)
		{
			for(var light of this.lights)
			{
				this.drawShadowCasters(renderTarget, light);
			}
			
		}

		if(this.debugLights)
		{
			for(var light of this.lights)
			{
				light.draw(renderTarget);
			}
		}

		if(this.debugShadowBlocks)
		{
			this.drawShadowBlocks(renderTarget);
		}

		if(this.debugOnly)
		{
			return;
		}

		// Enable Stencil buffers
		gl.clear(gl.STENCIL_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.STENCIL_TEST);
		gl.depthMask(false);

		for(var light of this.lights)
		{
			// Render Blocks
			gl.colorMask(false, false, false, false);
			gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
			gl.stencilFunc(gl.ALWAYS, 1, 1);
			
			this.drawShadowCasters(renderTarget, light);
		
			// No Disable stencil and draw light
		    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
			gl.stencilFunc(gl.EQUAL, 0, 1);
			gl.colorMask(true, true, true, true);
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.ONE, gl.ONE); 

	
			light.draw(renderTarget);	

			gl.disable(gl.BLEND);
			gl.clear(gl.STENCIL_BUFFER_BIT); 
		
		}

		gl.disable(gl.STENCIL_TEST);
		gl.disable(gl.DEPTH_TEST);

		this.drawShadowBlocks(renderTarget);
		// Draw Shadows
	}

};