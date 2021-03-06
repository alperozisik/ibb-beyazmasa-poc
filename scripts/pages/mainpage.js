/* globals */
(function() {
    var mainpage = Pages.mainpage = new SMF.UI.Page({
        name: "mainpage",
        onKeyPress: mainpage_onKeyPress,
        onShow: mainpage_onShow
    });

    /**
     * Creates action(s) that are run when the user press the key of the devices.
     * @param {KeyCodeEventArguments} e Uses to for key code argument. It returns e.keyCode parameter.
     * @this Pages.mainpage
     */
    function mainpage_onKeyPress(e) {
        if (e.keyCode === 4) {
            Application.exit();
        }
    }

    /**
     * Creates action(s) that are run when the page is appeared
     * @param {EventArguments} e Returns some attributes about the specified functions
     * @this Pages.mainpage
     */
    function mainpage_onShow() {
        //type your here code
    }

    var cntMain = new SMF.UI.Container({
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        borderWidth: 0,
        layoutType: SMF.UI.LayoutType.LINEAR,
        orientation: SMF.UI.Orientation.VERTICAL,
        verticalGap: 0,
        horizontalGap: 0
    });
    mainpage.add(cntMain);


    var imgPickConfig = require("../util/imgpick");

    var imgSlider = new SMF.UI.Image({
        image: imgPickConfig.slider,
        top: 0,
        left: 0,
        width: "100%",
        imageFillType: SMF.UI.ImageFillType.STRETCH
    });
    cntMain.add(imgSlider);
    imgSlider.height = imgSlider.width;


    // var cntForButtons = new SMF.UI.Container({
    //     top: imgSlider.top + imgSlider.height,
    //     left: 0,
    //     width: "100%",
    //     borderWidth: 0
    // });
    // cntForButtons.height = Device.screenHeight - cntForButtons.height;

    var myButtonTemplate = {
        fillColor: "blue",
        textColor: "#DDDDDD",
        width: "80%",
        height: "80%",
        left: "10%",
        top: "10%",
        pressedFillColor: "red"
    };

    var myButtonContainerTemplate = {
        width: "100%",
        height: "15%",
        borderWidth: 0
    };


    var cntBYeniBaşvuru = new SMF.UI.Container(myButtonContainerTemplate);
    cntMain.add(cntBYeniBaşvuru);


    var cntBBaşvuruListesi = new SMF.UI.Container(myButtonContainerTemplate);
    cntMain.add(cntBBaşvuruListesi);

    var btnYeniBasvuru = new SMF.UI.TextButton(myButtonTemplate);
    cntBYeniBaşvuru.add(btnYeniBasvuru);
    btnYeniBasvuru.text = "Yeni Başvuru";
    var btnBasvuruListesi = new SMF.UI.TextButton(myButtonTemplate);
    cntBBaşvuruListesi.add(btnBasvuruListesi);
    btnBasvuruListesi.text = "Başvuru Listesi";
    btnBasvuruListesi.onPressed = function(e) {
      Pages.basvurulistesi.show(SMF.UI.MotionEase.PLAIN, SMF.UI.TransitionEffect.RIGHTTOLEFT, 
      SMF.UI.TransitionEffectType.PUSH, false, false, 300);  
    };
    if (Device.deviceOS === "Android") {
        btnYeniBasvuru.effects.ripple.enabled =
            btnBasvuruListesi.effects.ripple.enabled = true;
    }

})();