/* globals */
//TODO: include this file in onStart in pages/index.js Use the code below:
//include("pages/basvurulistesi.js");
(function() {
    var basvurulistesi = Pages.basvurulistesi = new SMF.UI.Page({
        name: "basvurulistesi",
        onKeyPress: basvurulistesi_onKeyPress,
        onShow: basvurulistesi_onShow
    });

    /**
     * Creates action(s) that are run when the user press the key of the devices.
     * @param {KeyCodeEventArguments} e Uses to for key code argument. It returns e.keyCode parameter.
     * @this Pages.basvurulistesi
     */
    function basvurulistesi_onKeyPress(e) {
        if (e.keyCode === 4) {
            Pages.back();
        }
    }

    /**
     * Creates action(s) that are run when the page is appeared
     * @param {EventArguments} e Returns some attributes about the specified functions
     * @this Pages.basvurulistesi
     */
    function basvurulistesi_onShow() {
        function reqListener() {
            alert(oReq.responseText);
        }

        var oReq = new XMLHttpRequest();
        oReq.onload  = reqListener;
        oReq.setRequestHeader("Accept", "application/json");
        oReq.setRequestHeader("Authorization", "Basic MTk2MDA0MTg2NzI6MjM3NTY3ODkw");
        oReq.setRequestHeader("Content-Type", "application/json");
        oReq.open("GET", "https://osb-mwwebgate.ibb.gov.tr/External/IBBMobilBeyazmasaWebServisleri/IBBMobilAnonimBasvuruSorgula/ProxyService/IBBMobilAnonimBasvuruSorgulaRESTPS/IBBMobilServiceRequestQuery?contactId=1-QKBL1W&password=237567890&tckn=19600418672");
        oReq.send();
    }
    
    var btnBack = new SMF.UI.TextButton({
        text:"back",
        onPressed: function(e) {
            Pages.back();
        }
    });
    basvurulistesi.add(btnBack);


})();