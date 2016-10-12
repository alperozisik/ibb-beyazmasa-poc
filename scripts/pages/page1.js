/* globals */

(function() {
	var btnClickCount = 0;

	var page1 = Pages.page1 = new SMF.UI.Page({
		//use ctrl + space to show autocomplete within curly brackets in constructors
		name: "page1",
		fillColor: "#EEEEEE",
		onKeyPress: page1_onKeyPress,
		onShow: page1_onShow
	});

	var btn = new SMF.UI.TextButton({
		name: "btn",
		text: "Click me!",
		onPressed: page1_btn_onPressed,
		left: "15%",
		top: "70%",
		width: "70%",
		height: "10%",
		fillColor: "red"
	});
	(Device.deviceOS === "Android") && (btn.effects.ripple.enabled = true);

	page1.add(btn);

	var lbl = new SMF.UI.Label({
		name: "lbl",
		text: "",
		left: "15%",
		top: "45%",
		width: "70%",
		height: "15%",
		multipleLine: true,
		textAlignment: "center"
	});

	page1.add(lbl);

	var img = new SMF.UI.Image({
		name: "img",
		image: "smartface.png",
		left: "15%",
		top: "20%",
		width: "70%",
		height: "10%",
		imageFillType: SMF.UI.ImageFillType.ASPECTFIT
	});

	page1.add(img);

	/**
	 * Creates action(s) that are run when the user press the key of the devices.
	 * @param {KeyCodeEventArguments} e Uses to for key code argument. It returns e.keyCode parameter.
	 * @this Pages.Page1
	 */
	function page1_onKeyPress(e) {
		if (e.keyCode === 4) {
			Application.exit();
		}
	}

	/**
	 * Creates action(s) that are run when the object is pressed from device's screen.
	 * @param {EventArguments} e Returns some attributes about the specified functions
	 * @this Page1.TextButton1
	 */
	function page1_btn_onPressed(e) {
		var myLabelText = "";
		var myButtonText = "";

		btnClickCount += 1;

		switch (true) {
			case btnClickCount == 1:
				myLabelText = "Well Done! \nYou've clicked the button!";
				myButtonText = "Click me again!";
				break;
			case btnClickCount > 1 && btnClickCount < 10:
				myLabelText = "Whoa!\nThat click was " + numberSuffix(btnClickCount) + " time!";
				myButtonText = "Click again?";
				break;
			case btnClickCount >= 10 && btnClickCount < 15:
				myLabelText = "Feel tired?\nYou can rest your finger now :)";
				myButtonText = "I'm not tired!";
				break;
			default:
				myLabelText = "Isn't it good?\nEvery clicks count, you've clicked " + numberSuffix(btnClickCount) + " time!";
				myButtonText = "Click again?";
				break;
		}

		lbl.text = myLabelText;
		btn.text = myButtonText;
	}

	/**
	 *Adds appropriate suffix to given number.
	 */
	function numberSuffix(number) {

		var suffix = "th";

		//Lets deal with small numbers
		var smallNumber = number % 100;

		if (smallNumber < 11 || smallNumber > 13) {
			switch (smallNumber % 10) {
				case 1:
					suffix = 'st';
					break;
				case 2:
					suffix = 'nd';
					break;
				case 3:
					suffix = 'rd';
					break;
			}
		}
		return number + suffix;
	}


	var waitingDialog = new SMF.UI.Rectangle({
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		visible: false,
		fillColor: SMF.UI.Color.BLACK,
		alpha: "0.6%"
	});

	page1.add(waitingDialog);

	var waitingIndicator = new SMF.UI.ActivityIndicator({
		visible: false
	});

	page1.add(waitingIndicator);

	//page onShow event is used to implementing remote app update codes
	/**
	 * Creates action(s) that are run when the page is appeared
	 * @param {EventArguments} e Returns some attributes about the specified functions
	 * @this Pages.Page1
	 */
	function page1_onShow() {
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
								//make Dialog objects visible to inform user about the update.
								waitingDialog.visible = true;
								waitingIndicator.visible = true;
								//After three seconds, application will be restart.
								setTimeout(function() {
									//After that the app will be restarted automatically to apply the new updates
									Application.restart();
								}, 3000);

							}
						});
					}
				});
			}
		});
	}
})();
