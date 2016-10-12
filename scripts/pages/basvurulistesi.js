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

    var oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.setRequestHeader("Accept", "application/json");
    oReq.setRequestHeader("Authorization", "Basic MTk2MDA0MTg2NzI6MjM3NTY3ODkw");
    oReq.open("GET", "https://osb-mwwebgate.ibb.gov.tr/External/IBBMobilBeyazmasaWebServisleri/IBBMobilAnonimBasvuruSorgula/ProxyService/IBBMobilAnonimBasvuruSorgulaRESTPS/IBBMobilServiceRequestQuery?contactId=1-QKBL1W&password=237567890&tckn=19600418672", true);
    /**
     * Creates action(s) that are run when the page is appeared
     * @param {EventArguments} e Returns some attributes about the specified functions
     * @this Pages.basvurulistesi
     */
    function basvurulistesi_onShow() {



        oReq.send();
    }

    var btnBack = new SMF.UI.TextButton({
        text: "back",
        onPressed: function(e) {
            Pages.back();
        },
        top: 0,
        left: 0,
        height: "10%",
        width: "100%"
    });
    basvurulistesi.add(btnBack);

    var rbBlist = new SMF.UI.RepeatBox({
        top: "10%",
        height: "90%",
        width: "100%",
        left: 0,
        onRowRender: rowRender
    });
    basvurulistesi.add(rbBlist);
    rbBlist.itemTemplate.height = "70dp";
    
    var lblBasvuruNo = new SMF.UI.Label({
        left: "8dp",
        height: "28dp",
        top: "8dp",
        width: "100%",
        touchEnabled: false
    });
    rbBlist.itemTemplate.add(lblBasvuruNo);
    lblBasvuruNo.fontColor = "blue";
    lblBasvuruNo.font.size = "10pt";
    
    var lblDescription = new SMF.UI.Label({
        left: "8dp",
        top: "36dp",
        height: "20dp",
        width: "98%",
        touchEnabled: false
    });
    rbBlist.itemTemplate.add(lblDescription);
    lblDescription.font.size = "6pt";


    var response;
    function reqListener() {
        response = JSON.parse(oReq.responseText);
        rbBlist.dataSource = response.listOfIbbMobilServiceRequestIo.ibbMobilServiceRequest;
        rbBlist.refresh();
    }
    
    function rowRender(e) {
        var dataItem = response.listOfIbbMobilServiceRequestIo.ibbMobilServiceRequest[e.rowIndex];
        lblBasvuruNo.text = dataItem.sRNumber;
        lblDescription.text = dataItem.description;
    }

})();