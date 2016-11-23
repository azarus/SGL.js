@globalClass
export default class Asset
{
	static rootPath = "assets/";
	static assets = [];
	
	static resolve(path)
	{
		return rootPath + path;
	}

	static load(path, resolveCallback, params)
	{
		if(Asset.assets[path] != undefined)
			return Asset.assets[path];

		Asset.loadMultiple([path], resolveCallback);
		// function(content)
		// {
		// 	Asset.assets[path] = content;
		// 	resolveCallback(content);
		// });
	}

	static loadMultiple(assetPaths, resolveCallback)
	{
		for(var asset of assetPaths)
		{
			var xmlhttp = null;
			if (window.XMLHttpRequest)
			{// code for IE7+, Firefox, Chrome, Opera, Safari
			    xmlhttp = new XMLHttpRequest();
			}
			else
			{// code for IE6, IE5
			    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlhttp.onreadystatechange=function()
			{
			    if (xmlhttp.readyState==4 && xmlhttp.status==200)
			    {
			    	assetPaths.splice(assetPaths.indexOf(asset), 1);
			    	if(assetPaths.length <= 0)
					{
						resolveCallback(xmlhttp.responseText);
			    	}
			    	// Requiring the same asset cuases problems, because it gets  deleted.. and no callback triggered
			    	//Asset.assets[asset] = xmlhttp.responseText;
			    }
			}

			xmlhttp.open("GET", Asset.rootPath + asset, false );
			xmlhttp.send();   
		}
	}
};