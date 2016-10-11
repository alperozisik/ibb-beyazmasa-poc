/* globals */
(function() {
    var lastRequestPermissionCode = 2000;
    var permissionRequestMap = {};
    global.checkPermission = function checkPermission(permissions, rationaleDisplay, callback) {
        if (Device.deviceOS === "iOS") { //hardcoded logic for iOS to pass
            callback(null);
        }

        if (!(permissions instanceof Array)) permissions = [permissions];
        if (!callback) {
            callback = rationaleDisplay;
            rationaleDisplay = null;
        }

        var i, p, rationalsToShow = [];
        for (i = permissions.length - 1; i > -1; i--) {
            p = permissions[i];
            if (typeof p !== "string") {
                throw Error(String(p) + " is not a valid permission");
            }
            p = permissions[i] = p.toUpperCase();
            if (Application.checkPermission(p)) {
                permissions.splice(i, 1);
            }
            if (Application.shouldShowRequestPermissionRationale(p)) {
                rationalsToShow.push(p);
            }
        }
        if (permissions.length === 0) {
            callback(null); //all granted
            return;
        }

        if (rationalsToShow.length > 0) {
            if (rationaleDisplay) {
                rationaleDisplay(rationalsToShow, rationalDisplayCallback);
            }
            else {
                global.checkPermission.rationaleDisplay(rationalsToShow, rationalDisplayCallback);
            }
        }
        else
            rationalDisplayCallback(null);

        function rationalDisplayCallback(err) {
            if (err) {
                callback(err);
            }
            else {
                continueRequestPermissions();
            }
        }

        function continueRequestPermissions() {

            var requestPermissionCode = lastRequestPermissionCode++;
            permissionRequestMap[requestPermissionCode] = {
                requestPermissionCode: requestPermissionCode,
                result: function(e) {
                    var allPassed = true,
                        i, result = {},
                        keys = Object.keys(e.results);
                    //Using keys for bypassing AND-2351
                    for (i = 0; i < keys.length; i++) {
                        allPassed = allPassed && e.results[i];
                        result[e.requestedPermissions[i]] = e.results[i];
                    }
                    callback(
                        allPassed ? null : "there are failed permissions",
                        result
                    );
                }
            };
            var checkPermissionArguments = [requestPermissionCode].concat(permissions);
            Application.requestPermissions.apply(Application, checkPermissionArguments);
        }

    };

    global.checkPermission.rationaleDisplay = function rationaleDisplay(permissions, callback) {
        alert({
            title: "Permissions required",
            message: "In order to application to work properly following permissions are to be granted:\n" +
                permissions.join(",\n"),
            firstButtonText: "OK",
            secondButtonText: "Cancel",
            onFirstButtonPressed: function() {
                callback(null);
            },
            onSecondButtonPressed: function() {
                callback("user cancelled permission rationale displayed");
            }
        });
    };

    Application.onRequestPermissionsResult = function onRequestPermissionsResult(e) {
        permissionRequestMap[e.requestCode].result(e);
    };

    global.applyPermission = function applyPermission(fn, thisObject, args, reason, done) {
        if (typeof reason === "function" && typeof done === "undefined") {
            done = reason;
            reason = undefined;
        }
        if (!fn.permissions) {
            fn.apply(thisObject, args)
            done && done(null);
        }
        else {
            global.checkPermission(fn.permissions, reason, function(err) {
                if (!err)
                    fn.apply(thisObject, args);
                done(err);
            });
        }
    };


    function applyPermissionToFunction(fn, thisObject, options) {
        var reason = options.reason,
            done = options.done;
        reason && delete options.reason;
        done && delete options.done;
        global.applyPermission(fn, thisObject, [options], reason, done);
    }


    global.sendSMS = function sendSMS(options) {
        if (options.sendInBackground.sendInBackground) {
            return SMF.Net.sendSMS(options);
        }
        applyPermissionToFunction(SMF.Net.sendSMS, SMF.Net, options);
    };

    global.startCamera = function startCamera(options) {
        applyPermissionToFunction(SMF.Multimedia.startCamera, SMF.Multimedia, options);
    };

    global.pickFromGallery = function pickFromGallery(options) {
        applyPermissionToFunction(SMF.Multimedia.pickFromGallery, SMF.Multimedia, options);
    };

    global.getGalleryItems = function getGalleryItems(options) {
        applyPermissionToFunction(SMF.Multimedia.getGalleryItems, SMF.Multimedia, options);
    };

    global.saveToGallery = function saveToGallery(options) {
        applyPermissionToFunction(SMF.Multimedia.saveToGallery, SMF.Multimedia, options);
    };

    global.addContact = function addContact(options) {
        applyPermissionToFunction(Device.Contacts.addContact, Device.Contacts, options);
    };

    global.pickContact = function pickContact(options) {
        applyPermissionToFunction(Device.Contacts.pick, Device.Contacts, options);
    };

    global.getAllContacts = function getAllContacts(options) {
        applyPermissionToFunction(Device.Contacts.getAll, Device.Contacts, options);
    };

    global.setGPSStatus = function setGPSStatus(options) {
        applyPermissionToFunction(Device.setGPSStatus, Device, options);
    };

    global.onSMSReceived = function onSMSReceived(event, options) {
        var reason = options.reason,
            done = options.done;
        reason && delete options.reason;
        done && delete options.done;
        var permissions = ["RECEIVE_SMS", "READ_SMS"];
        global.checkPermission(permissions, reason, function(err) {
            if (!err)
                Application.onSMSReceived = event;
            done(err);
        });

    };

    if (Device.deviceOS === "Android") {
        SMF.Multimedia.startCamera.permissions = ["CAMERA"];
        SMF.Multimedia.permissions = ["READ_EXTERNAL_STORAGE"];
        SMF.Multimedia.permissions = ["READ_EXTERNAL_STORAGE"];
        SMF.Multimedia.saveToGallery.permissions = ["WRITE_EXTERNAL_STORAGE"];
        SMF.Net.sendSMS.permissions = ["SEND_SMS"];
        Device.Contacts.addContact.permissions = ["WRITE_CONTACTS"];
        Device.Contacts.getAll.permissions = ["READ_CONTACTS"];
        Device.share.permissions = ["WRITE_EXTERNAL_STORAGE"];
        Device.setGPSStatus.permissions = ["ACCESS_FINE_LOCATION"];
        Device.Contacts.pick.permissions = ["READ_CONTACTS"];
    }


})();
