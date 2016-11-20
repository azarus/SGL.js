# Simple Graphics Library for Javascript (SGL.js)

SGL.js is a HTML5 based, mobile-friendly WebGL powered 2D graphics library for the javascript language. It features a simple and easy to use API for:
  - Rendering to a Canvas
  - Rendering to a Texture
  - Rendering large Tilemaps
  - Custom View and Camera Movement

It also enables you:
  - Loading Assets for Web Based Games
  - Handling User Input

SGL is **Simple** and **Easy to use** if you need access to the low lever rendering API. Everything was designed to be straightforward.

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
renderCanvas.clear();
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

Bufers (Vertex Buffers, And IndexBuffers)
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
renderTarget.drawBuffer(vertexBuffer);
```
