@globalClass
export default class BlendMode
{
	constructor(colorSourceFactor, colorDestinationFactor, colorBlendEquation,
		alphaSourceFactor, alphaDestinationFactor, alphaBlendEquation)
	{
		this.colorSourceFactor = colorSourceFactor;
		this.colorDestinationFactor = colorDestinationFactor;
		this.colorBlendEquation = colorBlendEquation;
		this.alphaSourceFactor = alphaSourceFactor;
		this.alphaDestinationFactor = alphaDestinationFactor;
		this.alphaBlendEquation = alphaBlendEquation
	}

	bind()
	{
		//gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendFuncSeparate(this.colorSourceFactor, this.colorDestinationFactor, this.alphaSourceFactor, this.alphaDestinationFactor);
		gl.blendEquationSeparate(this.colorBlendEquation, this.alphaBlendEquation);
	}

	disable()
	{
		gl.disable(gl.DEPTH_TEST);
	}

	static initGlobals()
	{
		BlendMode.Alpha = new BlendMode(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD, gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD);
		BlendMode.Add = new BlendMode(gl.SRC_ALPHA, gl.ONE, gl.FUNC_ADD, gl.ONE, gl.ONE, gl.FUNC_ADD);
		BlendMode.One = new BlendMode(gl.ONE, gl.ONE, gl.ONE, gl.ONE, gl.ONE, gl.ONE);
		BlendMode.Multiply = new BlendMode(gl.DST_COLOR, gl.ZERO, gl.FUNC_ADD, gl.DST_COLOR, gl.ZERO, gl.FUNC_ADD);
		BlendMode.None = new BlendMode(gl.ONE, gl.ZERO, gl.FUNC_ADD, gl.ONE, gl.ZERO, gl.FUNC_ADD);
	}
};
