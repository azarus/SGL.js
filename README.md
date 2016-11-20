# Simple Graphics Library for Javascript (SGL.js)

SGL.js is a  WebGL powered 2D graphics library for the javascript language. Its API is simple and easy to use and allows you to:
  - Render to a Canvas
  - Render to a Texture
  - Render Sprites
  - Render large Tilemaps
  - Custom View and Camera Movement

It also features some other tools like:
  - Loading Assets for Web Based Games
  - Handling User Input
  - Switch between multiple Canvas and WebGL contexts


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

Sprite Sheets:
```javascript
var spriteSheet = new SpriteSheet("assets/spritesheet.png");
// Todo...
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
