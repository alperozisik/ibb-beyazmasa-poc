/* globals lang, initRequire*/
include('i18n/i18n.js');
Application.onStart = Application_OnStart;
Application.onUnhandledError = Application_OnError;

/**
 * Triggered when application is started.
 * @param {EventArguments} e Returns some attributes about the specified functions
 * @this Application
 */
function Application_OnStart(e) {
	 include("libs/Smartface/require.js");
	 initRequire("pages/index.js");
	//include("pages/index.js");

	Pages.mainpage.show();


	//Checks if there is a valid update. If yes returns result object.    
	Application.checkUpdate(function(err, result) {
		if (err) {
			//Checking for update is failed
			alert("check update error: " + err);
		}
		else {
			//There is a valid update. We can show the meta info to inform our app user.
			alert(JSON.stringify(result.meta));
			//There is an update waiting to be downloaded. Let's download it.
			result.download(function(err, result) {
				if (err) {
					//Download failed
					alert("download error: " + err);
				}
				else {

					//All files are received, we'll trigger an update.
					result.updateAll(function(err) {
						if (err) {
							//Updating the app with downloaded files failed
							alert("update all error: " + err);
						}
						else {

							//After that the app will be restarted automatically to apply the new updates
							Application.restart();
						}
					});
				}
			});
		}
	});
}

function Application_OnError(e) {
	switch (e.type) {
		case "Server Error":
		case "Size Overflow":
			alert(lang.networkError);
			break;
		default:
			//change the following code for desired generic error messsage
			alert({
				title: lang.applicationError,
				message: e.message + "\n\n*" + e.sourceURL + "\n*" + e.line + "\n*" + e.stack
			});
			break;
	}
}
