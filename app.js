var express = require("express");
var fs = require("fs");
var app = express();
app.maxConnections = 200;
app.use(express.static('build'));
app.use("/assets", express.static('assets'));
app.use(express.static('examples'));
app.use(express.static('build'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require("babelify");

var builder = browserify({
  verbose: true,
  cache: {},
  packageCache: {},
  plugin: [watchify]
});
builder.transform(babelify);
builder.require('src/main.js', { entry: true });
builder.on('update', compileBundle);


function compileBundle() {
  
	console.log("Recompiling Bundle");
	builder.bundle()  
	.on("error", function (err) {
		console.log("Error: " + err.message);
	})
	.on('end', function()
	{
		console.log("Complete");
	})
	.pipe(fs.createWriteStream("build/sgl.js"))

}

compileBundle();

  