# Simple Graphics Library for Javascript (SGL.js)

SGL.js is a  WebGL powered 2D graphics library for the javascript language. Its API is simple and easy to use and allows you to:
  - Render to a Canvas
  - Render to a Texture
  - Render Sprites
  - Render Sprite sheets
  - Render large Tilemaps (512x512 or larger)
  - Custom View and Camera Movement

It also features some other tools like:
  - Built in super fast 2D lighting engine (soft shadows are coming soon) 
  - Loading Assets for Web Based Games
  - Handling User Input
  - Switch between multiple Canvases and WebGL contexts


**Live Examples:**

**[Canvas](https://azarus.github.io/sgl.js/examples/canvas.html)**

**[Sprite](https://azarus.github.io/sgl.js/examples/sprite.html)**

**[Game Loop with moving sprite](https://azarus.github.io/sgl.js/examples/gameloop.html)**

**[Lighting Engine](https://azarus.github.io/sgl.js/examples/light.html)**

SGL is **Simple** and **Easy to use** if you need access to the low level rendering API. Everything was designed to be straightforward.
It is super easy to get up and running and have something rendered on the screen.

Example:
```javascript
// Initialization:

// Create a rendering context from a canvas
var canvas = document.getElementById("html5-canvas");
var renderCanvas = new RenderCanvas(canvas);

// Custom Camera (Align it to the canvas size)
var camera = new View(0, 0, canvas.width, canvas.height);
renderCanvas.setView(camera); // set the viewer to be the camera

// Load our image as a sprite (Creates a new Texture and Basic shaders in the background)
var sprite = new Sprite("assets/opengl_logo.png", 150, 150); // Make it 150x150px large
sprite.setPosition(10, 0); // You can set a position
sprite.setScale(2, 0.5); // You can scale it
sprite.setOrigin(-75, -50); // Set origin (Rotates around this point)
sprite.rotate(45.0);  // You can rotate it

// ...

// Render loop
renderCanvas.clear(Color.Black);
renderCanvas.draw(sprite);
window.requestAnimationFrame();
```

			
Texture Loading:
```javascript
var texture = new Texture("asset/texture.png"); // Load textures from url
var texture.setRepeated(true); // Make them repeated
var texture.setSmooth(true); // Smooth edges
var sprite = new Sprite(null, 100, 100);
sprite.setTexture(texture);
```

Render to Texture:
```javascript
var sprite = new Sprite("asset/texture.png", 100, 100); // Load a sprite from url
var renderTexture = new RenderTexture(512, 512); // Creaate a new render target texture (512x512px)
var renderSprite = new Sprite(null, 100, 100); // Create a new sprite that stores the rendered texture
renderSprite.setTexture(renderTexture.getTexture());

// Render loop
renderTexture.draw(sprite); // Draw the loaded image on the sprite

// Now do something with it the rendered sprite / texture
renderTarget.draw(renderSprite);
```

Buffers (Vertex Buffers, And IndexBuffers)
```javascript
var width = 100;
var height = 100;
var vertexBuffer = new VertexBuffer([
			0.0, 0.0,
			width, 0.0,
			width, height,
			0.0, 0.0,
			width, height,
			0.0, height,
], 2); // Number of elements (2d imensional array)

// Bind Shaders and uniforms here .. 
// Then execute the drawCall
renderTarget.drawBuffer(vertexBuffer);
```


Shaders (Creating, Loading, Compiling, Binding)
```javascript
 // Create Program
var shader = new Shader();
// Create and Link Shaders
shader.create( "void main(void) { gl_FragColor = vec4(1, 1, 1, 1); }", Shader.Pixel); 
shader.create( "attribute vec2 aVertexPosition;"+
                    "void main(void) { gl_Position = vec4(aVertexPosition.xy, 0, 1); }", Shader.Vertex); 

// Compile and check for errors
if(shader.compile())
{
    shader.bind(); // Bind it for rendering

    // Bind Buffers and Uniforms
    shader.setBufferParameter("aVertexPosition", vertexBuffer); // Vertex Buffer Example
    shader.setMatrixParameter("uMatrix", Matrix.identity()); // Matrix Example (mat3 only)
    shader.setTextureParameter("uTexture", texture);  // Texture or RenderTexture Example
    renderTarget.drawBuffer(vertexBuffer); // Then draw
}
```


			
Tile Maps:
```javascript
var textureAtlas = new TextureAtlas(32, 32); // Create a texture atlas that contains subImages with 32x32 pixel size
textureAtlas.loadFromFile("assets/textureatlas.png"); // Load texture atlas from file (You can also load it from json and other sources)
textureAtlas.setSmooth(true); // Make it smooth so it looks better :)
var tilemap = new TileMap(8, 8, 128, 128); // create a tilemap with 8x8 tile size and 128x128 number of tiles
tilemap.setTextureAtlas(textureAtlas); // Bind texture atlas to tilemap
tilemap.setPosition(50, 0); // A tilemap is also transformable

// Rebuild UV map
textureAtlas.buildUVMap();
tilemap.buildUVMap();

tilemap.updateTile(32, 55, 10); // updates tile positioned at 32x55 to the subImageIndex (10)

// Render loop
renderTarget.draw(tilemap);
```

Game Loop:
```javascript
var canvas = document.getElementById("game-canvas")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var renderCanvas;
var sprite;
var game = new GameLoop();
game.on("init", function()
{
	renderCanvas = new RenderCanvas(canvas);
	sprite = new Sprite("assets/sgl.png");
});
var x=0;
game.on("update", function(delta)
{
	++x;
	sprite.setPosition(Math.sin(x/100)*100, 0);
});
game.on("render", function(delta)
{
	renderCanvas.clear(Color.FromHex("#30b4cc"), 1);
	renderCanvas.draw(sprite);
});
game.start();
```

Sprite Sheets:
```javascript
// Create a new animated sprite
var animatedSprite = new AnimatedSprite(100, 100);

// Create a sprite sheet from texture with playspeed ()
var animation = new SpriteSheet(0.02, new Texture("assets/spritesheet.png"));

// Add frames (Automatically maps pixels to UV coordinates)
// If you need uvs you can use the addFrameUVs(x, y, u, v) function
animation.addFrame( 0, 0, 27, 50 );
animation.addFrame( 27, 0, 54, 50 );
animation.addFrame( 54, 0, 81, 50 );
animation.addFrame( 81, 0, 108, 50 );
animation.addFrame( 108, 0, 135, 50 );
animation.addFrame( 135, 0, 162, 50 );
animation.addFrame( 162, 0, 189, 50 );
animation.addFrame( 189, 0, 216, 50 );
animation.addFrame( 216, 0, 243, 50 );

// Set the speed for the animation
animation.setSpeed(10); // Update the image 10 times a second

// Set the animation to be the current one
animatedSprite.setAnimation(animation);

// Set the sprite to be animated
animatedSprite.play();

// Update the animation (with delta time in seconds)
spriteAnim.update(delta);

// Draw the animation
renderTarget.draw(animatedSprite);

// Stop the animation
animatedSprite.stop();

```

LightMap:
```javascript
// Initialization:

// Create a rendering context from a canvas
var canvas = document.getElementById("html5-canvas");
var renderCanvas = new RenderCanvas(canvas);

// Custom Camera (Align it to the canvas size)
var camera = new View(0, 0, canvas.width, canvas.height);
renderCanvas.setView(camera); // set the viewer to be the camera

// Create a new lightmap (512x512 size)
var lightMap = new LightMap(512, 512);

// Add a quad shadow hull that will block the light
lightmap.addShadowHull(ShadowHull.makeQuad(-16, -16, 32, 32)); // Centered in the middle
lightmap.rebuild(); // Rebuild the shadow hulls

// Create a Light with a custom sprite texture and assign color, radius and intensity
var light = new Light("assets/light.png", Color.Red, 128, 0.005);
lightmap.addLight(light); // And add it to the lightmap

// Set  the lights position
light.setPosition(0, 32);

// Draw the light map
renderCanvas.draw(light);

// ...

You can have many more lights, and many more shadow hulls, the system is gpu accelerated so everything is super fast. The amount of lights might affect performance becuase of the overdraw is costly.

```

### Todos

 - Write Tests
 - Rethink Code Generation
 - ES5 Support
 - Other Rendering Techniques
 - More tutorials

License
----

MIT


**Free Software, Hell Yeah!**
