(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AnimatedSprite = globalClass(_class = function (_Sprite) {
	_inherits(AnimatedSprite, _Sprite);

	function AnimatedSprite(width, height) {
		_classCallCheck(this, AnimatedSprite);

		var _this = _possibleConstructorReturn(this, (AnimatedSprite.__proto__ || Object.getPrototypeOf(AnimatedSprite)).call(this, null, width, height));

		_this.currentAnimation = null;
		_this.isPlaying = false;
		_this.lastUpdateTime = null;
		return _this;
	}

	_createClass(AnimatedSprite, [{
		key: "setAnimation",
		value: function setAnimation(animation) {
			var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			// Set the current animation
			this.currentAnimation = animation;
			// Switch textures if required
			this.setTexture(animation.texture);

			// Reset the frame counter and update UVs
			if (reset) {
				animation.resetFrames();
			}
			var uvs = animation.getFrame();
			if (!uvs) return;
			this.updateUVs(uvs.x, uvs.y, uvs.u, uvs.v);
		}

		// Should be called in the update thread and delta time must be feeded

	}, {
		key: "update",
		value: function update(deltaSeconds) {
			if (this.currentAnimation && this.isPlaying) {
				if (this.lastUpdateTime >= this.currentAnimation.speed) {
					this.currentAnimation.stepFrame();
					var uvs = this.currentAnimation.getFrame();
					if (!uvs) return;
					this.updateUVs(uvs.x, uvs.y, uvs.u, uvs.v);
					this.lastUpdateTime = 0;
				} else {
					this.lastUpdateTime += deltaSeconds;
				}
			}
		}
	}, {
		key: "play",
		value: function play() {
			this.isPlaying = true;
		}
	}, {
		key: "stop",
		value: function stop() {
			this.isPlaying = false;
		}
	}]);

	return AnimatedSprite;
}(Sprite)) || _class;

exports.default = AnimatedSprite;
;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Asset = globalClass(_class = (_temp = _class2 = function () {
	function Asset() {
		_classCallCheck(this, Asset);
	}

	_createClass(Asset, null, [{
		key: "resolve",
		value: function resolve(path) {
			return rootPath + path;
		}
	}, {
		key: "load",
		value: function load(path, resolveCallback, params) {
			if (Asset.assets[path] != undefined) return Asset.assets[path];

			Asset.loadMultiple([path], resolveCallback);
			// function(content)
			// {
			// 	Asset.assets[path] = content;
			// 	resolveCallback(content);
			// });
		}
	}, {
		key: "loadMultiple",
		value: function loadMultiple(assetPaths, resolveCallback) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = assetPaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var asset = _step.value;

					var xmlhttp = null;
					if (window.XMLHttpRequest) {
						// code for IE7+, Firefox, Chrome, Opera, Safari
						xmlhttp = new XMLHttpRequest();
					} else {
						// code for IE6, IE5
						xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
					}
					xmlhttp.onreadystatechange = function () {
						if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
							assetPaths.splice(assetPaths.indexOf(asset), 1);
							if (assetPaths.length <= 0) {
								resolveCallback(xmlhttp.responseText);
							}
							// Requiring the same asset cuases problems, because it gets  deleted.. and no callback triggered
							//Asset.assets[asset] = xmlhttp.responseText;
						}
					};

					xmlhttp.open("GET", Asset.rootPath + asset, false);
					xmlhttp.send();
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}]);

	return Asset;
}(), _class2.rootPath = "assets/", _class2.assets = [], _temp)) || _class;

exports.default = Asset;
;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BlendMode = globalClass(_class = function () {
	function BlendMode(colorSourceFactor, colorDestinationFactor, colorBlendEquation, alphaSourceFactor, alphaDestinationFactor, alphaBlendEquation) {
		_classCallCheck(this, BlendMode);

		this.colorSourceFactor = colorSourceFactor;
		this.colorDestinationFactor = colorDestinationFactor;
		this.colorBlendEquation = colorBlendEquation;
		this.alphaSourceFactor = alphaSourceFactor;
		this.alphaDestinationFactor = alphaDestinationFactor;
		this.alphaBlendEquation = alphaBlendEquation;
	}

	_createClass(BlendMode, [{
		key: "bind",
		value: function bind() {
			//gl.enable(gl.DEPTH_TEST);
			gl.enable(gl.BLEND);
			gl.blendFuncSeparate(this.colorSourceFactor, this.colorDestinationFactor, this.alphaSourceFactor, this.alphaDestinationFactor);
			gl.blendEquationSeparate(this.colorBlendEquation, this.alphaBlendEquation);
		}
	}, {
		key: "disable",
		value: function disable() {
			gl.disable(gl.DEPTH_TEST);
		}
	}], [{
		key: "initGlobals",
		value: function initGlobals() {
			BlendMode.Alpha = new BlendMode(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD, gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD);
			BlendMode.Add = new BlendMode(gl.SRC_ALPHA, gl.ONE, gl.FUNC_ADD, gl.ONE, gl.ONE, gl.FUNC_ADD);
			BlendMode.One = new BlendMode(gl.ONE, gl.ONE, gl.ONE, gl.ONE, gl.ONE, gl.ONE);
			BlendMode.Multiply = new BlendMode(gl.DST_COLOR, gl.ZERO, gl.FUNC_ADD, gl.DST_COLOR, gl.ZERO, gl.FUNC_ADD);
			BlendMode.None = new BlendMode(gl.ONE, gl.ZERO, gl.FUNC_ADD, gl.ONE, gl.ZERO, gl.FUNC_ADD);
		}
	}]);

	return BlendMode;
}()) || _class;

exports.default = BlendMode;
;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Color = globalClass(_class = function () {
	function Color(r, g, b) {
		var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 255;

		_classCallCheck(this, Color);

		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	_createClass(Color, [{
		key: 'getParam3D',
		value: function getParam3D() {
			return [this.r, this.g, this.b];
		}
	}, {
		key: 'getParam4D',
		value: function getParam4D() {
			return [this.r, this.g, this.b, this.a];
		}
	}], [{
		key: 'FromHex',
		value: function FromHex(hex, opacity) {
			opacity = opacity || 1;
			hex = hex.replace('#', '');
			var r = parseInt(hex.substring(0, 2), 16);
			var g = parseInt(hex.substring(2, 4), 16);
			var b = parseInt(hex.substring(4, 6), 16);
			var a = opacity * 255;
			console.log(r, g, b, a);
			return new Color(r, g, b, a);
		}
	}]);

	return Color;
}()) || _class;

exports.default = Color;
;
//global.Color = Color;

Color.Black = new Color(0, 0, 0);
Color.White = new Color(255, 255, 255);
Color.Red = new Color(255, 0, 0);
Color.Green = new Color(0, 255, 0);
Color.Blue = new Color(0, 0, 255);
Color.Yellow = new Color(255, 255, 0);
Color.Magenta = new Color(255, 0, 255);
Color.Cyan = new Color(0, 255, 255);
Color.Transparent = new Color(0, 0, 0, 0);

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Drawable = globalClass(_class = function (_Transform) {
	_inherits(Drawable, _Transform);

	function Drawable(width, height) {
		_classCallCheck(this, Drawable);

		var _this = _possibleConstructorReturn(this, (Drawable.__proto__ || Object.getPrototypeOf(Drawable)).call(this));

		_this.width = width || 100;
		_this.height = height || 100;
		return _this;
	}

	_createClass(Drawable, [{
		key: "draw",
		value: function draw() {}
	}]);

	return Drawable;
}(Transform)) || _class;

exports.default = Drawable;
;

},{}],6:[function(require,module,exports){
(function (global){
"use strict";

require("./Input");

require("./Color");

require("./Math");

require("./Vector");

require("./Matrix");

require("./Texture");

require("./TextureAtlas");

require("./Transform");

require("./View");

require("./VertexBuffer");

require("./Shader");

require("./RenderTarget");

require("./RenderTexture");

require("./RenderCanvas");

require("./BlendMode");

require("./Drawable");

require("./Sprite");

require("./AnimatedSprite");

require("./SpriteSheet");

require("./TileMap");

require("./Lightmap/Lightmap");

require("./Asset");

// Define GL as global
global.gl = null;

// Input Handling


// Rendering API


// Drawables


// Lightmap (Experimental)


// ThirdParty

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AnimatedSprite":1,"./Asset":2,"./BlendMode":3,"./Color":4,"./Drawable":5,"./Input":7,"./Lightmap/Lightmap":9,"./Math":11,"./Matrix":12,"./RenderCanvas":13,"./RenderTarget":14,"./RenderTexture":15,"./Shader":16,"./Sprite":17,"./SpriteSheet":18,"./Texture":19,"./TextureAtlas":20,"./TileMap":21,"./Transform":22,"./Vector":23,"./VertexBuffer":24,"./View":25}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Input = globalClass(_class = (_temp = _class2 = function () {
	function Input() {
		_classCallCheck(this, Input);
	}

	_createClass(Input, null, [{
		key: "broadcastAction",
		value: function broadcastAction(type, key, state) {
			if (type == "keyboard") {
				Input.SetKeyState(key, state);
			}

			if (type == "wheel") {
				Input.broadcast("wheel", state);
			}
			//console.debug(key);
		}
	}, {
		key: "SetKeyState",
		value: function SetKeyState(key, state) {
			Input.Keyboard[String.fromCharCode(key).toLowerCase()] = state;
		}
	}, {
		key: "IsKeyDown",
		value: function IsKeyDown(key) {
			return Input.Keyboard[key.toLowerCase()];
		}
	}, {
		key: "broadcast",
		value: function broadcast(event, param) {
			Input.EventListeners[event](param);
		}
	}, {
		key: "on",
		value: function on(event, callback) {
			Input.EventListeners[event] = callback;
		}
	}]);

	return Input;
}(), _class2.Keyboard = [], _class2.EventListeners = [], _temp)) || _class;

exports.default = Input;
;

if (document.addEventListener) {
	// IE9, Chrome, Safari, Opera
	document.addEventListener("mousewheel", MouseWheelHandler, false);
	// Firefox
	document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
}
// IE 6/7/8
else {
		document.attachEvent("onmousewheel", MouseWheelHandler);
	}

function MouseWheelHandler(e) {
	// cross-browser wheel delta
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));

	if (delta > 0) {
		Input.broadcastAction("wheel", 0, true);
	}

	if (delta < 0) {
		Input.broadcastAction("wheel", 0, false);
	}
	return false;
}

function OnMouseWheel(evt, delta) {}

function myFunction() {
	this.style.fontSize = "35px";
}

document.addEventListener("keydown", function (evt) {
	Input.broadcastAction("keyboard", evt.keyCode, true);
}.bind(Input), false);

document.addEventListener("keyup", function (evt) {
	Input.broadcastAction("keyboard", evt.keyCode, false);
}.bind(Input), false);

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Light = globalClass(_class = function (_Drawable) {
	_inherits(Light, _Drawable);

	function Light() {
		var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Color.White;
		var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 128;
		var intensity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
		var lightTexture = arguments[3];

		_classCallCheck(this, Light);

		var _this = _possibleConstructorReturn(this, (Light.__proto__ || Object.getPrototypeOf(Light)).call(this, radius, radius));

		_this.shadowBuffer = null;
		_this.x = 0;
		_this.y = 0;

		_this.color = color;
		_this.setRadius(radius);
		_this.intensity = intensity;

		_this.shader = new Shader();
		_this.texture = null;
		if (lightTexture != undefined) {
			_this.texture = new Texture(lightTexture);
			_this.texture.setRepeated(true);
			_this.texture.setSmooth(true);
			//this.setOrigin(-this.width/2, -this.height/2);
		}

		_this.shader.create("precision mediump float;" + "varying vec2 vVertexCoords;" + "uniform vec4 uLightColor;" + "uniform float uLightIntensity;" + "uniform sampler2D uTexture;" + "void main(void) {gl_FragColor = uLightColor * (uLightIntensity * texture2D(uTexture, vVertexCoords).r);}", Shader.Pixel);

		_this.shader.create("attribute vec2 aVertexPosition;" + "attribute vec2 aVertexCoords;" + "uniform mat3 uMatrix;" + "varying vec2 vVertexCoords;" + "void main(void) { vVertexCoords = aVertexCoords; gl_Position = vec4((uMatrix * vec3(aVertexPosition, 1)).xy, 0, 1); }", Shader.Vertex);

		_this.shader.compile();

		_this.setUVs(0, 0, 1, 1);

		return _this;
	}

	_createClass(Light, [{
		key: "setLightTexture",
		value: function setLightTexture(texture) {
			this.texture = texture;
		}
	}, {
		key: "setRadius",
		value: function setRadius(radius) {
			this.radius = radius;
			this.width = radius;
			this.height = radius;
			if (this.vbo) this.vbo.destroy();

			this.vbo = new VertexBuffer([0.0, 0.0, radius, 0.0, radius, radius, 0.0, 0.0, radius, radius, 0.0, radius], 2);

			this.setOrigin(-radius / 2, -radius / 2);
		}
	}, {
		key: "setIntensity",
		value: function setIntensity(intensity) {
			this.intensity = intensity;
		}
	}, {
		key: "setUVs",
		value: function setUVs(x, y, u, v) {
			if (this.uvs) this.uvs.destroy();

			this.uvs = new VertexBuffer([x, y, u, y, u, v, x, y, u, v, x, v], 2);
		}
	}, {
		key: "draw",
		value: function draw(renderTarget) {

			if (this.shader.isCompiled) {

				var matrix = this.getMatrix();
				this.shader.bind();
				this.shader.setBufferParameter("aVertexPosition", this.vbo);
				this.shader.setBufferParameter("aVertexCoords", this.uvs);
				this.shader.setMatrixParameter("uMatrix", Matrix.multiply(renderTarget.view.getMatrix(), matrix));
				this.shader.setParam4D("uLightColor", this.color.getParam4D());
				this.shader.setParameter("uLightIntensity", this.intensity);
				this.shader.setParam2D("uLightPos", [this.x, this.y]);
				this.shader.setTextureParameter("uTexture", this.texture);
				renderTarget.drawBuffer(this.vbo);
			} else {
				console.log("Shader not compiled? :(");
			}

			// gl.disable(gl.BLEND);
			// gl.clear(gl.STENCIL_BUFFER_BIT); 

		}
	}]);

	return Light;
}(Drawable)) || _class;

exports.default = Light;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

require("./Light");

require("./SpriteLight");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Lightmap = globalClass(_class = function (_Drawable) {
	_inherits(Lightmap, _Drawable);

	// Verticies of actual shadow casters

	function Lightmap(width, height) {
		var shadowColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Color.Black;
		var shadowBlockColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Color.Black;

		_classCallCheck(this, Lightmap);

		var _this = _possibleConstructorReturn(this, (Lightmap.__proto__ || Object.getPrototypeOf(Lightmap)).call(this, width, height));

		_this.lights = [];
		_this.shadowBlocks = [];
		_this.shadowCasters = [];
		_this.debugShadowBlocks = true;
		_this.debugShadowCasters = false;
		_this.debugLights = true;
		_this.debugOnly = true;

		_this.shadowColor = shadowColor;
		_this.shadowBlockColor = shadowBlockColor;
		_this.shader = new Shader();

		// Load Shaders
		_this.shader.create("precision mediump float;" + "varying vec2 vVertexCoords;" + "uniform vec3 shadowColor;" + "void main(void) {gl_FragColor = vec4(shadowColor, 1);}", Shader.Pixel);

		_this.shader.create("attribute vec2 aVertexPosition;" + "uniform mat3 uMatrix;" + "void main(void) {gl_Position = vec4((uMatrix * vec3(aVertexPosition, 1)).xy, 0, 1); }", Shader.Vertex);

		_this.shader.compile();
		return _this;
	}

	// Light Blocking objects (They will be rendered as black)
	// Verticies of Shadow Caster Blocks


	_createClass(Lightmap, [{
		key: "rebuildLightMap",
		value: function rebuildLightMap() {
			console.log("Rebuilding light map");
			this.rebuildShadowCasters(); // Rebuild shadow casters from shadow blocks (no need to us this)
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.lights[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var light = _step.value;

					this.buildShadowMesh(light);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}, {
		key: "createShadowCasterBuffer",
		value: function createShadowCasterBuffer() {
			if (this.shadowCasterBuffer) this.shadowCasterBuffer.destroy();

			this.shadowBuffer = new VertexBuffer(this.shadowCasters, 3);
			// Shadow Caster buffers
		}
	}, {
		key: "createShadowBlockBuffer",
		value: function createShadowBlockBuffer() {
			// Shadow block buffer
		}
	}, {
		key: "createShadowBuffer",
		value: function createShadowBuffer() {
			for (var i = 0; i < this.shadowBlocks.length; i++) {
				for (var x = 0; x < this.shadowBlocks[i].length; ++x) {
					this.shadowVertices.push(this.shadowBlocks[i][x]);
				}
			}
			this.shadowBuffer = new VertexBuffer(this.shadowVertices, 2);
		}
	}, {
		key: "buildShadowMesh",
		value: function buildShadowMesh(light) {
			// Get vertices from shadowblocks
			var vertices = [];
			for (var i = 0; i < this.shadowBlocks.length; i++) {
				for (var x = 0; x < this.shadowBlocks[i].length; x += 2) {
					vertices.push(new Vector(this.shadowBlocks[i][x], this.shadowBlocks[i][x + 1]));
				}
			}

			var shadowVertices = [];
			// Performance hit end
			for (var v = 0; v < vertices.length; v++) {
				var currentVertex = vertices[v];
				var nextVertex = vertices[(v + 1) % vertices.length];
				var edge = Vector.sub(nextVertex, currentVertex);
				var normal = new Vector(edge.y, -edge.x);

				var lightLocation = new Vector(light.position.x, light.position.y);
				var lightToCurrent = Vector.sub(currentVertex, lightLocation);
				if (Vector.dot(normal, lightToCurrent) > 0) {
					var point1 = Vector.add(currentVertex, Vector.scale(100, Vector.sub(currentVertex, lightLocation)));
					var point2 = Vector.add(nextVertex, Vector.scale(100, Vector.sub(nextVertex, lightLocation)));

					// Manual vertToMatrix conversion. Because this is called thousands of times a function call slows it down.
					shadowVertices.push(
					// Triangle 1
					point1.x, point1.y, currentVertex.x, currentVertex.y, point2.x, point2.y,

					// Triangle 2
					currentVertex.x, currentVertex.y, point2.x, point2.y, nextVertex.x, nextVertex.y);
				}
			}

			if (light.shadowBuffer) light.shadowBuffer.destroy();

			light.shadowBuffer = new VertexBuffer(shadowVertices, 2);
		}
	}, {
		key: "addBlock",
		value: function addBlock(x, y, w, h) {
			this.shadowBlocks.push([x, y, w, y, w, h, x, y, w, h, x, h]);
			this.createShadowBuffer();
		}
	}, {
		key: "removeBlock",
		value: function removeBlock(x, y, w, h) {
			//this.shadowBlocks.splice(this.shadowBlocks.indexOf({x: x, y: y, w: w, h: h}), 1);
			this.createShadowBuffer();
		}
	}, {
		key: "addShadowCaster",
		value: function addShadowCaster() {}
	}, {
		key: "addLight",
		value: function addLight(light) {
			this.lights.push(light);
			this.rebuildLightMap(light);
		}
	}, {
		key: "removeLight",
		value: function removeLight(light) {
			this.lights.splice(lights.indexOf(light), 1);
			this.rebuildLightMap(light);
		}
	}, {
		key: "drawShadowCasters",
		value: function drawShadowCasters(renderTarget, light) {
			// Draw shadow casters
			if (this.shader.isCompiled && light.shadowBuffer != null) {
				//console.log("Rendering light map");
				var matrix = this.getMatrix();
				this.shader.bind();
				this.shader.setBufferParameter("aVertexPosition", light.shadowBuffer);
				this.shader.setMatrixParameter("uMatrix", Matrix.multiply(renderTarget.view.getMatrix(), matrix));
				if (this.debugLights) {
					this.shader.setParam3D("shadowColor", light.color.getParam3D());
				} else {}

				renderTarget.drawBuffer(light.shadowBuffer);
			}
		}
	}, {
		key: "drawShadowBlocks",
		value: function drawShadowBlocks(renderTarget) {
			// Draw shadow casting elements
			var matrix = this.getMatrix();
			this.shader.bind();
			this.shader.setBufferParameter("aVertexPosition", this.shadowBuffer);
			this.shader.setMatrixParameter("uMatrix", Matrix.multiply(renderTarget.view.getMatrix(), matrix));
			this.shader.setParam3D("shadowColor", this.shadowBlockColor.getParam3D());
			renderTarget.drawBuffer(this.shadowBuffer);
		}
	}, {
		key: "draw",
		value: function draw(renderTarget) {
			this.rebuildLightMap();

			if (this.debugShadowCasters) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = this.lights[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var light = _step2.value;

						this.drawShadowCasters(renderTarget, light);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}

			if (this.debugLights) {
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = this.lights[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var light = _step3.value;

						light.draw(renderTarget);
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}
			}

			if (this.debugShadowBlocks) {
				this.drawShadowBlocks(renderTarget);
			}

			if (this.debugOnly) {
				return;
			}

			// Enable Stencil buffers
			gl.clear(gl.STENCIL_BUFFER_BIT);
			gl.enable(gl.DEPTH_TEST);
			gl.enable(gl.STENCIL_TEST);
			gl.depthMask(false);

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this.lights[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var light = _step4.value;

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
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			gl.disable(gl.STENCIL_TEST);
			gl.disable(gl.DEPTH_TEST);

			this.drawShadowBlocks(renderTarget);
			// Draw Shadows
		}
	}]);

	return Lightmap;
}(Drawable)) || _class;

exports.default = Lightmap;
;

},{"./Light":8,"./SpriteLight":10}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SpriteLight = globalClass(_class = function (_Drawable) {
	_inherits(SpriteLight, _Drawable);

	function SpriteLight(source, width, height, x, y) {
		_classCallCheck(this, SpriteLight);

		var _this = _possibleConstructorReturn(this, (SpriteLight.__proto__ || Object.getPrototypeOf(SpriteLight)).call(this, width, height));

		_this.pos = [0, 0];
		_this.x = 35;
		_this.y = 40;

		_this.x = x;
		_this.y = y;
		_this.shader = new Shader();
		_this.texture = null;
		if (source != undefined) {
			_this.texture = new Texture(source);
			_this.texture.setRepeated(true);
			_this.texture.setSmooth(true);
			_this.setOrigin(-_this.width / 2, -_this.height / 2);
		}

		// Load Shaders
		Asset.load("light.glsl", function (content) {
			this.shader.create(content, Shader.Pixel);
			this.shader.compile();
		}.bind(_this));

		_this.shader.create("attribute vec2 aVertexPosition;" + "attribute vec2 aVertexCoords;" + "uniform mat3 uMatrix;" + "varying vec2 vVertexCoords;" + "void main(void) { vVertexCoords = aVertexCoords; gl_Position = vec4((uMatrix * vec3(aVertexPosition, 1)).xy, 0, 1); }", Shader.Vertex);

		_this.shader.compile();

		_this.initBuffers();

		return _this;
	}

	_createClass(SpriteLight, [{
		key: "initBuffers",
		value: function initBuffers() {
			// Create Vertex Buffers
			this.setSize(this.width, this.height);
			this.setUVs(0.0, 0.0, 1.0, 1.0);
		}
	}, {
		key: "setTexture",
		value: function setTexture(texture) {
			this.texture = texture;
			this.width = texture.width;
			this.height = texture.height;
			//this.setOrigin(-this.width/2, -this.height/2);
		}
	}, {
		key: "setSize",
		value: function setSize(width, height) {
			if (this.vbo) this.vbo.destroy();

			this.vbo = new VertexBuffer([0.0, 0.0, width, 0.0, width, height, 0.0, 0.0, width, height, 0.0, height], 2);
		}
	}, {
		key: "setUVs",
		value: function setUVs(x, y, u, v) {
			if (this.uvs) this.uvs.destroy();

			this.uvs = new VertexBuffer([x, y, u, y, u, v, x, y, u, v, x, v], 2);
		}
	}, {
		key: "updateUVs",
		value: function updateUVs(x, y, u, v) {
			// New UV data
			this.uvs.update([x, y, u, y, u, v, x, y, u, v, x, v], 0);
		}
	}, {
		key: "draw",
		value: function draw(renderTarget) {
			//console.log(this.shader.isCompiled);
			if (this.shader.isCompiled && this.texture != null) {

				var matrix = this.getMatrix();

				this.shader.bind();
				this.shader.setBufferParameter("aVertexPosition", this.vbo);
				//this.shader.setBufferParameter("aVertexColors", this.colors);
				this.shader.setBufferParameter("aVertexCoords", this.uvs);
				this.shader.setMatrixParameter("uMatrix", Matrix.multiply(renderTarget.view.getMatrix(), matrix));
				this.shader.setTextureParameter("uTexture", this.texture);
				//this.shader.setParam2D("uLightPos", [this.x/100, this.y/100]);
				this.shader.setParam2D("uLightPositions", [this.x / 100, this.y / 100, (this.x + 25) / 100, (this.y + 25) / 100]);
				//this.shader.setParam2D("t0", this.pos);
				renderTarget.drawBuffer(this.vbo);
			} else {
				console.log("Shader not compiled? :(");
			}
		}
	}]);

	return SpriteLight;
}(Drawable)) || _class;

exports.default = SpriteLight;

},{}],11:[function(require,module,exports){
"use strict";

// This class extends the math library in js (:C)
Math.radians = function (degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function (radians) {
  return radians * 180 / Math.PI;
};

Math.getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Matrix = globalClass(_class = function () {
	function Matrix() {
		_classCallCheck(this, Matrix);
	}

	_createClass(Matrix, null, [{
		key: "identity",
		value: function identity() {
			return [1, 0, 0, 0, 1, 0, 0, 0, 1];
		}
	}, {
		key: "projection",
		value: function projection(width, height) {
			return [2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1];
		}
	}, {
		key: "translation",
		value: function translation(x, y) {
			return [1, 0, 0, 0, 1, 0, x, y, 1];
		}
	}, {
		key: "rotation",
		value: function rotation(angle) {
			var angle = Math.radians(angle);
			var c = Math.cos(angle);
			var s = Math.sin(angle);
			return [c, -s, 0, s, c, 0, 0, 0, 1];
		}
	}, {
		key: "scaling",
		value: function scaling(x, y) {
			return [x, 0, 0, 0, y, 0, 0, 0, 1];
		}
	}, {
		key: "multiply",
		value: function multiply(a, b) {
			var a00 = a[0 * 3 + 0];
			var a01 = a[0 * 3 + 1];
			var a02 = a[0 * 3 + 2];
			var a10 = a[1 * 3 + 0];
			var a11 = a[1 * 3 + 1];
			var a12 = a[1 * 3 + 2];
			var a20 = a[2 * 3 + 0];
			var a21 = a[2 * 3 + 1];
			var a22 = a[2 * 3 + 2];
			var b00 = b[0 * 3 + 0];
			var b01 = b[0 * 3 + 1];
			var b02 = b[0 * 3 + 2];
			var b10 = b[1 * 3 + 0];
			var b11 = b[1 * 3 + 1];
			var b12 = b[1 * 3 + 2];
			var b20 = b[2 * 3 + 0];
			var b21 = b[2 * 3 + 1];
			var b22 = b[2 * 3 + 2];
			return [b00 * a00 + b01 * a10 + b02 * a20, b00 * a01 + b01 * a11 + b02 * a21, b00 * a02 + b01 * a12 + b02 * a22, b10 * a00 + b11 * a10 + b12 * a20, b10 * a01 + b11 * a11 + b12 * a21, b10 * a02 + b11 * a12 + b12 * a22, b20 * a00 + b21 * a10 + b22 * a20, b20 * a01 + b21 * a11 + b22 * a21, b20 * a02 + b21 * a12 + b22 * a22];
		}
	}, {
		key: "translate",
		value: function translate(m, tx, ty) {
			return Matrix.multiply(m, Matrix.translation(tx, ty));
		}
	}, {
		key: "rotate",
		value: function rotate(m, angle) {
			return Matrix.multiply(m, Matrix.rotation(angle));
		}
	}, {
		key: "scale",
		value: function scale(m, sx, sy) {
			return Matrix.multiply(m, Matrix.scaling(sx, sy));
		}
	}]);

	return Matrix;
}()) || _class;

exports.default = Matrix;
;

},{}],13:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RenderCanvas = globalClass(_class = function (_RenderTarget) {
	_inherits(RenderCanvas, _RenderTarget);

	function RenderCanvas(canvas) {
		_classCallCheck(this, RenderCanvas);

		var _this = _possibleConstructorReturn(this, (RenderCanvas.__proto__ || Object.getPrototypeOf(RenderCanvas)).call(this));

		var settings = {
			alpha: true,
			antialias: true,
			depth: true,
			stencil: true
		};

		// Try to grab the standard context. If it fails, fallback to experimental.
		_this.gl = canvas.getContext("webgl", settings) || canvas.getContext("experimental-webgl", settings);

		// If we don't have a GL context, give up now
		if (!_this.gl) {
			alert("Unable to initialize WebGL. Your browser may not support it.");
		}

		// set gl context current
		_this.bind();
		Shader.initGlobals();
		BlendMode.initGlobals();

		//gl.enable(gl.DEPTH_TEST);
		//gl.enable(gl.STENCIL_TEST);
		gl.frontFace(gl.CW);
		// Initialize canvas
		_this.init(canvas.clientWidth, canvas.clientHeight);

		return _this;
	}

	_createClass(RenderCanvas, [{
		key: "isContextCurrent",
		value: function isContextCurrent() {
			if (global.gl == this.gl) return true;
			return false;
		}
	}, {
		key: "bind",
		value: function bind() {
			global.gl = this.gl;
			// unbind any frame buffer, and render to back buffer
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: "unbind",
		value: function unbind() {
			global.gl = null;
		}
	}]);

	return RenderCanvas;
}(RenderTarget)) || _class;

exports.default = RenderCanvas;
;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RenderTarget = globalClass(_class = function () {
	function RenderTarget() {
		_classCallCheck(this, RenderTarget);
	}

	_createClass(RenderTarget, [{
		key: "init",
		value: function init(width, height) {
			this.view = null;
			this.defaultView = null;
			this.width = width;
			this.height = height;
			this.reset();
		}
	}, {
		key: "reset",
		value: function reset() {
			this.defaultView = new View(0, 0, this.width, this.height);
			this.defaultView.setViewport(0, 0, this.width, this.height);
			console.log("Creating default view");
			this.setView(this.defaultView);
		}
	}, {
		key: "clear",
		value: function clear(color) {
			this.bind();
			Texture.bind(0);
			gl.clearColor(color.r / 255.0, color.g / 255.0, color.b / 255.0, color.a / 255.0);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}
	}, {
		key: "setView",
		value: function setView(view) {
			this.view = view;
		}
	}, {
		key: "draw",
		value: function draw(drawable, blendmode) {
			if (blendmode != undefined) {
				blendmode.bind();
			} else {
				BlendMode.Alpha.bind();
			}
			drawable.draw(this);
		}
	}, {
		key: "applyViewport",
		value: function applyViewport() {
			var viewport = [0, 0, 1, 1];
			if (!this.view) {
				viewport = this.defaultView.getViewport();
			} else {
				viewport = this.view.getViewport();
			}

			//console.log(viewport);
			//gl.viewport(viewport[0], this.height - (viewport[1] + viewport[3]), viewport[2], viewport[3]);
			gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
		}
	}, {
		key: "drawBuffer",
		value: function drawBuffer(buffer) {
			this.bind();
			this.applyViewport();
			gl.drawArrays(buffer.type, 0, buffer.numItems);
		}
	}, {
		key: "bind",
		value: function bind() {
			// Nothing to do
		}
	}]);

	return RenderTarget;
}()) || _class;

exports.default = RenderTarget;
;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RenderTexture = globalClass(_class = function (_RenderTarget) {
	_inherits(RenderTexture, _RenderTarget);

	function RenderTexture(width, height) {
		_classCallCheck(this, RenderTexture);

		var _this = _possibleConstructorReturn(this, (RenderTexture.__proto__ || Object.getPrototypeOf(RenderTexture)).call(this));
		// Initializes Texture Buffer


		_this.init(width, height);
		_this.reset();

		// Create Frame Buffer
		_this.frameBuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, _this.frameBuffer);

		// Cached for external use.
		_this.frameBuffer.width = _this.width;
		_this.frameBuffer.height = _this.height;

		// Bind Texture Buffer
		_this.texture = new Texture();
		_this.texture.width = _this.width;
		_this.texture.height = _this.height;
		_this.texture.initParameters();
		gl.bindTexture(gl.TEXTURE_2D, _this.texture.texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

		// Assign Texture to Frame Buffer
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _this.width, _this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		// Create Render Buffer
		_this.renderBuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, _this.renderBuffer);

		// Assign Render Buffer to Frame Buffer
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _this.width, _this.height);

		// Assign Render Buffer to Texture
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, _this.texture.texture, 0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, _this.renderBuffer);

		// Clean Up
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		return _this;
	}

	_createClass(RenderTexture, [{
		key: "destroy",
		value: function destroy() {
			this.texture.destroy();
			gl.deleteFramebuffer(this.frameBuffer);
			gl.deleteRenderbuffer(this.renderBuffer);
		}
	}, {
		key: "bind",
		value: function bind() {
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
		}
	}, {
		key: "getTexture",
		value: function getTexture() {
			return this.texture;
		}
	}]);

	return RenderTexture;
}(RenderTarget)) || _class;

exports.default = RenderTexture;

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Shader = globalClass(_class = function () {
	function Shader() {
		_classCallCheck(this, Shader);

		this.isCompiled = false;
		this.program = gl.createProgram();
	}

	_createClass(Shader, [{
		key: "create",
		value: function create(source, type) {
			var shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

				var info = gl.getShaderInfoLog(shader);
				console.warn(info);
				return info;
			}

			gl.attachShader(this.program, shader);
			return true;
		}
	}, {
		key: "compile",
		value: function compile() {
			gl.linkProgram(this.program);
			var info = gl.getProgramInfoLog(this.program);
			if (!info) {
				this.isCompiled = true;
				return true;
			}
			console.warn(info, this.isCompiled);
			return info;
		}
	}, {
		key: "bind",
		value: function bind() {
			if (this != Shader.CurrentShader) {
				gl.useProgram(this.program);
				Shader.CurrentShader = this;
			}
		}
	}, {
		key: "unbind",
		value: function unbind() {
			gl.useProgram(null);
		}
	}, {
		key: "setBufferParameter",
		value: function setBufferParameter(param, buffer) {
			if (!buffer) {
				console.log("Invalid buffer");
				return;
			}

			this.bind();
			var Attribute = gl.getAttribLocation(this.program, param);
			gl.enableVertexAttribArray(Attribute);

			buffer.bind();
			gl.vertexAttribPointer(Attribute, buffer.itemSize, gl.FLOAT, false, 0, 0);
		}
	}, {
		key: "setParam4D",
		value: function setParam4D(param, array) {
			this.bind();
			var Attribute = gl.getUniformLocation(this.program, param);
			gl.uniform4fv(Attribute, new Float32Array(array));
		}
	}, {
		key: "setParam3D",
		value: function setParam3D(param, Vector) {
			this.bind();
			var Attribute = gl.getUniformLocation(this.program, param);
			gl.uniform3fv(Attribute, new Float32Array(Vector));
		}
	}, {
		key: "setParam2D",
		value: function setParam2D(param, Vector) {
			this.bind();
			var Attribute = gl.getUniformLocation(this.program, param);
			gl.uniform2fv(Attribute, new Float32Array(Vector));
		}
	}, {
		key: "setParam2DArray",
		value: function setParam2DArray(param, Vector) {
			this.bind();
			var Attribute = gl.getUniformLocation(this.program, param);
			gl.uniform2fv(Attribute, Vector);
		}
	}, {
		key: "setParameter",
		value: function setParameter(param, Vector) {
			this.bind();
			var Attribute = gl.getUniformLocation(this.program, param);
			gl.uniform1f(Attribute, Vector);
		}
	}, {
		key: "setTextureParameter",
		value: function setTextureParameter(param, texture, index) {
			this.bind();
			var Attribute = gl.getUniformLocation(this.program, param);
			if (texture == undefined || texture == 0) {
				gl.uniform1i(Attribute, null);
				return;
			}

			gl.activeTexture(gl.TEXTURE0 + (index || 0));
			texture.bind();
			gl.uniform1i(Attribute, index || 0);
		}
	}, {
		key: "setMatrixParameter",
		value: function setMatrixParameter(param, matrix) {
			this.bind();
			var Attribute = gl.getUniformLocation(this.program, param);
			gl.uniformMatrix3fv(Attribute, false, matrix);
		}
	}], [{
		key: "initGlobals",
		value: function initGlobals() {
			Shader.Vertex = gl.VERTEX_SHADER;
			Shader.Pixel = gl.FRAGMENT_SHADER;
		}
	}]);

	return Shader;
}()) || _class;

exports.default = Shader;
;

Shader.Vertex = 35633;
Shader.Pixel = 35632;
Shader.CurrentShader = null;

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sprite = globalClass(_class = function (_Drawable) {
	_inherits(Sprite, _Drawable);

	function Sprite(source, width, height) {
		_classCallCheck(this, Sprite);

		var _this = _possibleConstructorReturn(this, (Sprite.__proto__ || Object.getPrototypeOf(Sprite)).call(this, width, height));

		_this.shader = new Shader();
		_this.texture = null;
		if (source != undefined) {
			_this.texture = new Texture(source);
			_this.texture.setRepeated(true);
			_this.texture.setSmooth(true);
			_this.setOrigin(-_this.width / 2, -_this.height / 2);
		}

		// Load Shaders
		_this.shader.create("precision mediump float;" + "varying vec2 vVertexCoords;" + "uniform sampler2D uTexture;" + "void main(void) {gl_FragColor = texture2D(uTexture, vVertexCoords);}", Shader.Pixel);
		_this.shader.create("attribute vec2 aVertexPosition;" + "attribute vec2 aVertexCoords;" + "uniform mat3 uMatrix;" + "varying vec2 vVertexCoords;" + "void main(void) { vVertexCoords = aVertexCoords; gl_Position = vec4((uMatrix * vec3(aVertexPosition, 1)).xy, 0, 1); }", Shader.Vertex);

		_this.shader.compile();

		_this.initBuffers();

		return _this;
	}

	_createClass(Sprite, [{
		key: "initBuffers",
		value: function initBuffers() {
			// Create Vertex Buffers
			this.setSize(this.width, this.height);
			this.setUVs(0.0, 0.0, 1.0, 1.0);
		}
	}, {
		key: "setTexture",
		value: function setTexture(texture) {
			this.texture = texture;
			this.width = texture.width;
			this.height = texture.height;
			//this.setOrigin(-this.width/2, -this.height/2);
		}
	}, {
		key: "setSize",
		value: function setSize(width, height) {
			if (this.vbo) this.vbo.destroy();

			this.vbo = new VertexBuffer([0.0, 0.0, width, 0.0, width, height, 0.0, 0.0, width, height, 0.0, height], 2);
		}
	}, {
		key: "setUVs",
		value: function setUVs(x, y, u, v) {
			if (this.uvs) this.uvs.destroy();

			this.uvs = new VertexBuffer([x, y, u, y, u, v, x, y, u, v, x, v], 2);
		}
	}, {
		key: "updateUVs",
		value: function updateUVs(x, y, u, v) {
			// New UV data
			this.uvs.update([x, y, u, y, u, v, x, y, u, v, x, v], 0);
		}
	}, {
		key: "draw",
		value: function draw(renderTarget) {
			//console.log(this.shader.isCompiled);
			if (this.shader.isCompiled && this.texture != null) {

				var matrix = this.getMatrix();

				this.shader.bind();
				this.shader.setBufferParameter("aVertexPosition", this.vbo);
				//this.shader.setBufferParameter("aVertexColors", this.colors);
				this.shader.setBufferParameter("aVertexCoords", this.uvs);
				this.shader.setMatrixParameter("uMatrix", Matrix.multiply(renderTarget.view.getMatrix(), matrix));
				this.shader.setTextureParameter("uTexture", this.texture);
				renderTarget.drawBuffer(this.vbo);
			} else {
				console.log("Shader not compiled? :(");
			}
		}
	}]);

	return Sprite;
}(Drawable)) || _class;

exports.default = Sprite;

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SpriteSheet = globalClass(_class = function () {
	function SpriteSheet() {
		var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
		var texture = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		_classCallCheck(this, SpriteSheet);

		this.animationFrames = [];
		this.currentFrameIndex = 0;
		this.texture = null;

		this.setSpeed(speed);
		this.setTexture(texture);
	}

	_createClass(SpriteSheet, [{
		key: "setSpeed",
		value: function setSpeed() // step image x times in a second
		{
			var newSpeed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

			this.speed = 1 / newSpeed;
		}
	}, {
		key: "setTexture",
		value: function setTexture(texture) {
			this.texture = texture;
		}
	}, {
		key: "addFrame",
		value: function addFrame(x, y, width, height) {
			var sx = x / this.texture.width;
			var sy = y / this.texture.height;
			var u = width / this.texture.width;
			var v = height / this.texture.height;
			this.addFrameUVs(sx, sy, u, v);
		}
	}, {
		key: "addFrameUVs",
		value: function addFrameUVs(sx, sy, u, v) {
			this.animationFrames.push({ x: sx, y: sy, u: u, v: v });
		}
	}, {
		key: "getFrame",
		value: function getFrame() {
			return this.animationFrames[this.currentFrameIndex];
		}
	}, {
		key: "stepFrame",
		value: function stepFrame() {
			this.currentFrameIndex++;
			if (this.currentFrameIndex >= this.animationFrames.length) this.currentFrameIndex = 0;
			// Steps to the next frame in the animation
		}
	}, {
		key: "resetFrames",
		value: function resetFrames() {
			this.currentFrameIndex = 0;
		}
	}]);

	return SpriteSheet;
}()) || _class;

exports.default = SpriteSheet;
;

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Texture = globalClass(_class = function () {
	function Texture(source) {
		_classCallCheck(this, Texture);

		this.width = 0;
		this.height = 0;
		this.source = null;
		this.loaded = false;
		this.isRepeated = false;
		this.isSmooth = false;
		this.hasMipmap = false;
		this.texture = gl.createTexture();

		if (source == undefined) return;

		this.loadFromFile(source);
	}

	_createClass(Texture, [{
		key: "loadFromFile",
		value: function loadFromFile(source) {
			this.texture.image = new Image();
			this.texture.image.onload = function () {
				this.loadFromImage(this.texture.image);
			}.bind(this);
			this.texture.image.src = source;
			this.source = source;
		}
	}, {
		key: "destroy",
		value: function destroy() {
			gl.deleteTexture(this.texture);
		}
	}, {
		key: "loadFromImage",
		value: function loadFromImage(image) {
			this.width = image.width;
			this.height = image.height;
			this.loaded = true;

			console.log("Loaded image: " + image.src, "Size: " + this.width + "x" + this.height + "px");

			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
			this.initParameters();
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.flush();
		}
	}, {
		key: "initParameters",
		value: function initParameters() {
			this.setSmooth(this.isSmooth);
			if (this.isSmooth) {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			} else {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			}
			this.setRepeated(false);
		}
	}, {
		key: "getImage",


		// Returns an image (Usefull for debuggning purpose)
		value: function getImage() {
			if (!this.loaded) return false;

			// Create a framebuffer backed by the texture
			var framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

			// Read the contents of the framebuffer
			var data = new Uint8Array(this.width * this.height * 4);
			gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, data);

			gl.deleteFramebuffer(framebuffer);

			// Create a 2D canvas to store the result 
			var canvas = document.createElement('canvas');
			canvas.width = this.width;
			canvas.height = this.height;
			var context = canvas.getContext('2d');

			// Copy the pixels to a 2D canvas
			var imageData = context.createImageData(this.width, this.height);
			imageData.data.set(data);
			context.putImageData(imageData, 0, 0);

			var img = new Image();
			img.src = canvas.toDataURL();
			return img;
		}
	}, {
		key: "update",
		value: function update(image, x, y, width, height) {
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, image);
		}
	}, {
		key: "copy",
		value: function copy(x, y, sx, sy, width, height) {
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, x, y, sx, sy, width, height);
		}
	}, {
		key: "setRepeated",
		value: function setRepeated(repeated) {
			this.isRepeated = repeated;
			gl.bindTexture(gl.TEXTURE_2D, this.texture);

			if (this.isRepeated) {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			} else {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			}
		}
	}, {
		key: "setSmooth",
		value: function setSmooth(smooth) {
			this.isSmooth = smooth;
			gl.bindTexture(gl.TEXTURE_2D, this.texture);

			if (this.isSmooth) {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			} else {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			}

			if (this.hasMipmap) {
				if (this.isSmooth) {
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
				} else {
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
				}
			} else {
				if (this.isSmooth) {
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				} else {
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				}
			}
		}
	}, {
		key: "generateMipmap",
		value: function generateMipmap() {
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.generateMipmap(gl.TEXTURE_2D);
			this.hasMipmap = true;
			this.setSmooth(this.isSmooth);
		}
	}, {
		key: "invalidateMipmap",
		value: function invalidateMipmap() {
			this.hasMipmap = false;
			this.setSmooth(this.isSmooth);
		}
	}, {
		key: "bind",
		value: function bind() {
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
		}
	}, {
		key: "unbind",
		value: function unbind() {
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}], [{
		key: "NumberIsPowerOfTwo",
		value: function NumberIsPowerOfTwo(n) {
			if (typeof n !== 'number') return 'Not a number';

			return n && (n & n - 1) === 0;
		}
	}]);

	return Texture;
}()) || _class;

exports.default = Texture;
;

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextureAtlas = globalClass(_class = function (_Texture) {
	_inherits(TextureAtlas, _Texture);

	function TextureAtlas(width, height) {
		_classCallCheck(this, TextureAtlas);

		var _this = _possibleConstructorReturn(this, (TextureAtlas.__proto__ || Object.getPrototypeOf(TextureAtlas)).call(this));

		_this.tileWidth = width;
		_this.tileHeight = height;
		_this.imageUVs = [];
		return _this;
	}

	_createClass(TextureAtlas, [{
		key: "loadFromImage",
		value: function loadFromImage(image) {
			_get(TextureAtlas.prototype.__proto__ || Object.getPrototypeOf(TextureAtlas.prototype), "loadFromImage", this).call(this, image);
			//this.buildUVMap();
		}
	}, {
		key: "buildUVMap",
		value: function buildUVMap() {
			console.log("Building UVmap");
			this.imageUVs = [];

			var numTilesX = this.width / this.tileWidth;
			var numTilesY = this.height / this.tileHeight;

			console.log(numTilesX, numTilesY);
			var subImageIndex = 0;
			for (var x = 0; x < numTilesX; ++x) {
				for (var y = 0; y < numTilesY; ++y) {
					var xOffset = x * this.tileWidth / this.width;
					var yOffset = y * this.tileHeight / this.height;

					var U = (x + 1) * this.tileWidth / this.width;
					var V = (y + 1) * this.tileHeight / this.height;
					var uv = { x: xOffset, y: yOffset, u: U, v: V };
					//console.log(uv);
					this.imageUVs[subImageIndex] = uv;
					++subImageIndex;
				}
			}
			console.log("Building UVmap Finished");
		}
	}, {
		key: "getUVs",
		value: function getUVs(subImageIndex) {
			return this.imageUVs[subImageIndex];
		}
	}]);

	return TextureAtlas;
}(Texture)) || _class;

exports.default = TextureAtlas;

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileMap = globalClass(_class = function (_Drawable) {
	_inherits(TileMap, _Drawable);

	function TileMap(tileWidth, tileHeight, mapWidth, mapHeight) {
		_classCallCheck(this, TileMap);

		var _this = _possibleConstructorReturn(this, (TileMap.__proto__ || Object.getPrototypeOf(TileMap)).call(this, mapWidth * tileWidth, mapHeight * tileHeight));

		_this.shader = new Shader();

		_this.shader.create("precision mediump float;" + "varying vec2 vVertexCoords;" + "uniform sampler2D uTexture;" + "void main(void) {gl_FragColor = texture2D(uTexture, vVertexCoords);}", Shader.Pixel);

		_this.shader.create("attribute vec2 aVertexPosition;" + "attribute vec2 aTileUvs;" + "uniform mat3 uMatrix;" + "uniform vec2 uResolution;" + "varying vec2 vVertexCoords;" + "void main(void) { vVertexCoords = aTileUvs; gl_Position = vec4((uMatrix * vec3(aVertexPosition, 1)).xy, 0, 1); }", Shader.Vertex);

		_this.shader.compile();

		_this.mapWidth = mapWidth;
		_this.mapHeight = mapHeight;
		_this.tileWidth = tileWidth;
		_this.tileHeight = tileHeight;

		//this.test(this.width, this.height);
		//this.test2(0.0, 0.0, 1.0, 1.0);

		_this.buildTileMesh();
		_this.buildUVMap();

		return _this;
	}

	_createClass(TileMap, [{
		key: "setTextureAtlas",
		value: function setTextureAtlas(textureAtlas) {
			this.textureAtlas = textureAtlas;
			//this.buildUVMap();
		}
	}, {
		key: "setSize",
		value: function setSize(width, height, tileWidth, tileHeight) {
			this.mapWidth = width;
			this.mapHeight = height;
			this.tileWidth = tileWidth;
			this.tileHeight = tileHeight;
			//this.buildTileMesh();
		}
	}, {
		key: "buildTileMesh",
		value: function buildTileMesh() {
			if (this.vbo) this.vbo.destroy();

			// Generate Tile Map Mesh
			var vboBuffer = [];
			for (var x = 0; x < this.mapWidth; ++x) {
				for (var y = 0; y < this.mapHeight; ++y) {
					vboBuffer.push.apply(vboBuffer, Tile.MakeMesh(this.tileWidth, this.tileHeight, x, y, 1));
				}
			}
			console.log(vboBuffer);
			this.vbo = new VertexBuffer(vboBuffer, 2);
		}
	}, {
		key: "buildUVMap",
		value: function buildUVMap() {
			if (this.uvs) this.uvs.destroy();

			console.log("Re building uvmap for mesh");
			var uvBuffer = [];
			for (var x = 0; x < this.mapWidth; ++x) {
				for (var y = 0; y < this.mapHeight; ++y) {
					if (this.textureAtlas != null) {
						var uv = this.textureAtlas.getUVs(Math.floor(Math.random() * (100 - 10) + 10));
					}
					if (uv != undefined) {
						uvBuffer.push.apply(uvBuffer, Tile.MakeUV(uv.x, uv.y, uv.u, uv.v));
					} else {
						uvBuffer.push.apply(uvBuffer, Tile.MakeUV(0, 0, 0.1, 0.1));
					}
				}
			}
			console.log(uvBuffer);
			this.uvs = new VertexBuffer(uvBuffer, 2);
		}
	}, {
		key: "updateTile",
		value: function updateTile(x, y, image) {
			var uv = this.textureAtlas.getUVs(image);
			console.log(this.textureAtlas);
			if (!uv) return false;

			this.uvs.update(Tile.MakeUV(uv.x, uv.y, uv.u, uv.v), x * y * 12);
		}
	}, {
		key: "draw",
		value: function draw(renderTarget) {
			if (this.shader.isCompiled && this.textureAtlas != null) {

				var matrix = this.getMatrix();

				this.shader.bind();
				this.shader.setBufferParameter("aVertexPosition", this.vbo);
				this.shader.setBufferParameter("aTileUvs", this.uvs);
				this.shader.setMatrixParameter("uMatrix", Matrix.multiply(renderTarget.view.getMatrix(), matrix));
				this.shader.setTextureParameter("uTextureAtlas", this.textureAtlas);
				renderTarget.drawBuffer(this.vbo);
				console.log("Drawing");
			} else {
				console.log("Shader not compiled? :(");
			}
		}
	}]);

	return TileMap;
}(Drawable)) || _class;

exports.default = TileMap;
;

var Tile = globalClass(_class2 = function () {
	function Tile() {
		_classCallCheck(this, Tile);
	}

	_createClass(Tile, null, [{
		key: "MakeMesh",
		value: function MakeMesh(width, height, x, y, alpha) {
			return [width * x, height * y, //alpha,
			width * (x + 1), height * y, //alpha,
			width * (x + 1), height * (y + 1), //alpha,
			width * x, height * y, //alpha,
			width * (x + 1), height * (y + 1), //alpha,
			width * x, height * (y + 1)];
		}
	}, {
		key: "MakeUV",
		value: function MakeUV(x, y, u, v) {
			return [x, y, u, y, u, v, x, y, u, v, x, v];
		}
	}]);

	return Tile;
}()) || _class2;

;

Tile.None = -1;

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Transform = globalClass(_class = function () {
	function Transform(x, y, scalex, scaley, angle, originx, originy) {
		_classCallCheck(this, Transform);

		this.reset();

		this.setPosition(x || 0, y || 0);
		this.setScale(scalex || 1, scaley || 1);
		this.setRotation(angle || 0);
		this.setOrigin(originx || 0, originy || 0);
	}

	_createClass(Transform, [{
		key: "reset",
		value: function reset() {
			this.position = { x: 0, y: 0 };
			this.scale = { x: 1, y: 1 };
			this.origin = { x: 0, y: 0 };
			this.angle = 0;
		}
	}, {
		key: "setPosition",
		value: function setPosition(x, y) {
			this.position.x = x; // || this.position.x;
			this.position.y = y; // || this.position.y;
		}
	}, {
		key: "move",
		value: function move(x, y) {
			this.position.x += x || 0;
			this.position.y += y || 0;
		}
	}, {
		key: "setScale",
		value: function setScale(x, y) {
			this.scale.x = x;
			this.scale.y = y;
		}
	}, {
		key: "setRotation",
		value: function setRotation(angle) {
			this.angle = angle;
		}
	}, {
		key: "rotate",
		value: function rotate(angle) {
			this.angle += angle;
		}
	}, {
		key: "setOrigin",
		value: function setOrigin(x, y) {
			this.origin.x = x;
			this.origin.y = y;
		}
	}, {
		key: "getMatrix",
		value: function getMatrix() {
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
	}]);

	return Transform;
}()) || _class;

exports.default = Transform;
;

},{}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vector = globalClass(_class = function () {
    function Vector(x, y) {
        _classCallCheck(this, Vector);

        this.x = 0;
        this.y = 0;

        this.x = x;
        this.y = y;
    }

    _createClass(Vector, null, [{
        key: "sub",
        value: function sub(vector1, vector2) {
            return {
                x: vector1.x - vector2.x,
                y: vector1.y - vector2.y
            };
        }
    }, {
        key: "add",
        value: function add(vector1, vector2) {
            return {
                x: vector1.x + vector2.x,
                y: vector1.y + vector2.y
            };
        }
    }, {
        key: "dot",
        value: function dot(vector1, vector2) {
            return vector1.x * vector2.x + vector1.y * vector2.y;
        }
    }, {
        key: "equal",
        value: function equal(vector1, vector2) {
            if (vector1.x == vector2.x && vector1.y == vector2.y) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: "scale",
        value: function scale(_scale, vector) {
            return {
                x: vector.x * _scale,
                y: vector.y * _scale
            };
        }
    }]);

    return Vector;
}()) || _class;

exports.default = Vector;
;

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VertexBuffer = globalClass(_class = function () {
	function VertexBuffer(data, size, type, drawmode) {
		_classCallCheck(this, VertexBuffer);

		this.buffer = gl.createBuffer();
		this.type = type || gl.TRIANGLES;
		this.drawmode = drawmode || gl.STATIC_DRAW;
		this.numItems = 0;
		this.itemSize = 0;

		if (data != undefined) {
			this.create(data, size);
		}
	}

	_createClass(VertexBuffer, [{
		key: "create",
		value: function create(data, size, type) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), this.drawmode);
			this.type = type || gl.TRIANGLES;
			this.numItems = data.length / size;
			this.itemSize = size;
		}
	}, {
		key: "destroy",
		value: function destroy() {
			gl.deleteBuffer(this.buffer);
		}
	}, {
		key: "update",
		value: function update(data, offset) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			gl.bufferSubData(gl.ARRAY_BUFFER, offset, new Float32Array(data));
		}
	}, {
		key: "bind",
		value: function bind() {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		}
	}, {
		key: "unbind",
		value: function unbind() {
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}
	}]);

	return VertexBuffer;
}()) || _class;

exports.default = VertexBuffer;
;

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = globalClass(_class = function () {
	function View(x, y, width, height, rotation, zoom) {
		_classCallCheck(this, View);

		this.reset();
		this.setPosition(x, y);
		this.setSize(width, height);
		this.rotate(rotation || 0);
		this.zoom(zoom || 1);
		this.setViewport(0, 0, width, height);
	}

	_createClass(View, [{
		key: "reset",
		value: function reset() {
			this.requiresUpdate = true;
			this.matrix = Matrix.identity();
			this.x = 0;
			this.y = 0;
			this.width = 0;
			this.height = 0;
			this.origin = { x: 0, y: 0 };
			this.angle = 0;
			this.zoomfactor = 1;
		}
	}, {
		key: "setPosition",
		value: function setPosition(x, y) {
			this.x = x;
			this.y = y;
			this.requiresUpdate = true;
		}
	}, {
		key: "move",
		value: function move(xoffset, yoffset) {
			this.x += xoffset || 0;
			this.y += yoffset || 0;
			this.requiresUpdate = true;
		}
	}, {
		key: "setSize",
		value: function setSize(width, height) {
			this.width = width || this.width;
			this.height = height || this.height;
			this.origin.x = width / 2;
			this.origin.y = height / 2;
			this.requiresUpdate = true;
		}
	}, {
		key: "setRotation",
		value: function setRotation(angle) {
			this.angle = angle || this.angle;
			this.requiresUpdate = true;
		}
	}, {
		key: "rotate",
		value: function rotate(angle) {
			this.angle += angle;
			this.requiresUpdate = true;
		}
	}, {
		key: "setZoom",
		value: function setZoom(factor) {
			this.zoomfactor = factor;
			if (this.zoomfactor < 0) this.zoomfactor = 0;
			this.requiresUpdate = true;
		}
	}, {
		key: "zoom",
		value: function zoom(factor) {
			this.zoomfactor += factor;
			if (this.zoomfactor < 0) this.zoomfactor = 0;
			this.requiresUpdate = true;
		}
	}, {
		key: "setViewport",
		value: function setViewport(x, y, width, height) {
			this.viewPort = [x, y, width, height];
		}
	}, {
		key: "getViewport",
		value: function getViewport() {
			return this.viewPort; //[this.x, this.y, this.width, this.height];
		}
	}, {
		key: "getMatrix",
		value: function getMatrix() {
			if (this.requiresUpdate) {
				var matrix = Matrix.projection(this.width, this.height);

				// Compute Matrices
				var translationMatrix = Matrix.translation(this.x, this.y);
				var rotationMatrix = Matrix.rotation(this.angle);
				var originMatrix = Matrix.translation(this.width / 2, this.height / 2);
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
	}]);

	return View;
}()) || _class;

exports.default = View;

},{}],26:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _console = {};
_console.log = console.log;

var Console = function () {
	function Console() {
		_classCallCheck(this, Console);
	}

	_createClass(Console, null, [{
		key: 'print',
		value: function print() {
			var args = Array.prototype.slice.call(arguments);
			args.unshift('[INFO]:');
			_console.log.apply(console, args);
		}
	}, {
		key: 'log',
		value: function log() {
			var args = Array.prototype.slice.call(arguments);
			args.unshift('[LOG]:');
			_console.log.apply(console, args);
		}
	}]);

	return Console;
}();
//console.log = Console.log;
//console.print = Console.print;


global.Console = Console;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],27:[function(require,module,exports){
(function (global){
"use strict";

/** CLASS DECORATORS **/
global.globalClass = function (target, prop, descriptor) {
	global[target.name] = target;
	window[target.name] = target;
	//
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventListener = globalClass(_class = function () {
	function EventListener() {
		_classCallCheck(this, EventListener);

		this.__eventListeners = {};
	}

	_createClass(EventListener, [{
		key: "on",
		value: function on(name, callback) {
			if (!(name in this.__eventListeners)) {
				this.__eventListeners[name] = [];
			}
			this.__eventListeners[name].push(callback);
		}
	}, {
		key: "off",
		value: function off(name, callback) {
			if (!(name in this.__eventListeners)) {
				return;
			}
			var stack = this.__eventListeners[name];
			for (var i = 0, l = stack.length; i < l; i++) {
				if (stack[i] === callback) {
					stack.splice(i, 1);
					return this.off(name, callback);
				}
			}
		}
	}, {
		key: "broadcast",
		value: function broadcast(name) {
			if (!(name in this.__eventListeners)) {
				return;
			}
			var stack = this.__eventListeners[name];
			for (var i = 0, l = stack.length; i < l; i++) {

				if (!stack[i]) continue;

				var args = Array.prototype.slice.call(arguments);
				args.splice(0, 1);
				stack[i].apply(this, args);
			}
		}
	}]);

	return EventListener;
}()) || _class;

exports.default = EventListener;
;

},{}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class;

var _Timer = require("f:\\Coding\\github/src/Utils/Timer");

var _Timer2 = _interopRequireDefault(_Timer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameLoop = globalClass(_class = function (_EventListener) {
	_inherits(GameLoop, _EventListener);

	function GameLoop() {
		var fps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 60;
		var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

		_classCallCheck(this, GameLoop);

		var _this = _possibleConstructorReturn(this, (GameLoop.__proto__ || Object.getPrototypeOf(GameLoop)).call(this));

		_this.on("init", function () {});
		_this.on("start", function () {});
		_this.on("stop", function () {});
		_this.on("update", function (delta) {});
		_this.on("render", function (delta) {});

		_this._timeStep = 1000 / fps * speed;
		_this._prevTime = null;
		_this._lagTime = 0;
		_this.FPS = 0;
		_this._frame = _this.frame.bind(_this);
		_this._frameId = null;
		_this.FPSCounter = 0;
		_this.fpsTimer = new _Timer2.default(_this.fpsReset.bind(_this));
		return _this;
	}

	_createClass(GameLoop, [{
		key: "fpsReset",
		value: function fpsReset() {
			this.FPS = this.FPSCounter;
			this.FPSCounter = 0;
		}
	}, {
		key: "getTime",
		value: function getTime() {
			return performance && performance.now ? performance.now() : Date.now();
		}
	}, {
		key: "frame",
		value: function frame() {
			var curTime = this.getTime();
			var dt = Math.min(1000, curTime - this._prevTime);
			this._prevTime = curTime;
			this._lagTime += dt;

			while (this._lagTime > this._timeStep) {
				this._lagTime -= this._timeStep;
				this.broadcast('update', this._timeStep / 1000);
			}

			this.broadcast('render', dt / 1000);
			++this.FPSCounter;
			this._frameId = requestAnimationFrame(this._frame);
		}
	}, {
		key: "start",
		value: function start() {
			if (this._prevTime === null) {
				this.broadcast('init');
			}

			this.broadcast('start');
			this._prevTime = this.getTime();
			this.fpsTimer.setInterval(1);
			this.frame();
		}
	}, {
		key: "stop",
		value: function stop() {
			this.fpsTimer.stop();
			this.broadcast('stop');
			cancelAnimationFrame(this._frameId);
			this._frameId = null;
		}
	}, {
		key: "dispose",
		value: function dispose() {
			this.stop();
			_get(GameLoop.prototype.__proto__ || Object.getPrototypeOf(GameLoop.prototype), "dispose", this).call(this);
		}
	}]);

	return GameLoop;
}(EventListener)) || _class;

exports.default = GameLoop;
;

},{"f:\\Coding\\github/src/Utils/Timer":30}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Timer = function () {
	function Timer(callbackFn) {
		_classCallCheck(this, Timer);

		this.callbackFn = callbackFn;
	}

	_createClass(Timer, [{
		key: "setInterval",
		value: function (_setInterval) {
			function setInterval(_x) {
				return _setInterval.apply(this, arguments);
			}

			setInterval.toString = function () {
				return _setInterval.toString();
			};

			return setInterval;
		}(function (seconds) {
			this.stop();
			this.timer = setInterval(this.callbackFn, seconds * 1000);
		})
	}, {
		key: "setTimeout",
		value: function (_setTimeout) {
			function setTimeout(_x2) {
				return _setTimeout.apply(this, arguments);
			}

			setTimeout.toString = function () {
				return _setTimeout.toString();
			};

			return setTimeout;
		}(function (seconds) {
			this.stop();
			this.timer = setTimeout(this.callbackFn, seconds * 1000);
		})
	}, {
		key: "stop",
		value: function stop() {
			clearInterval(this.timer);
			clearTimeout(this.timer);
		}
	}], [{
		key: "delay",
		value: function delay(seconds, fn) {
			setTimeout(fn, seconds * 1000);
		}
	}]);

	return Timer;
}();

exports.default = Timer;
;

},{}],31:[function(require,module,exports){
"use strict";

require("f:\\Coding\\github/src/Utils/Console");

require("f:\\Coding\\github/src/Utils/Decorators");

require("f:\\Coding\\github/src/Utils/EventListener");

require("f:\\Coding\\github/src/Utils/GameLoop");

require("f:\\Coding\\github/src/Graphics/Graphics");

},{"f:\\Coding\\github/src/Graphics/Graphics":6,"f:\\Coding\\github/src/Utils/Console":26,"f:\\Coding\\github/src/Utils/Decorators":27,"f:\\Coding\\github/src/Utils/EventListener":28,"f:\\Coding\\github/src/Utils/GameLoop":29}]},{},[31]);
