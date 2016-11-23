var _console = {};
_console.log = console.log;
class Console
{
	static print()
	{
		var args = Array.prototype.slice.call(arguments);
		args.unshift('[INFO]:');
		_console.log.apply(console, args);
	}
	
	static log()
	{
		var args = Array.prototype.slice.call(arguments);
		args.unshift('[LOG]:');
		_console.log.apply(console, args);	
	}
}
//console.log = Console.log;
//console.print = Console.print;
global.Console = Console;