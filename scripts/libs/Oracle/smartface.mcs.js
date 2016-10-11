/* globals mcs mcs_config Analytics AnalyticsEvent Deferred*/
// Based on MCS Jquery plugin at http://www.ateam-oracle.com/hybrid-mobile-apps-using-the-mobile-cloud-service-javascript-sdk-with-oracle-jet/

include("libs/Oracle/mcs.js");
include("libs/Oracle/oracle_mobile_cloud_config.js");
include("libs/utils/deferred.js");

// namespace pattern
(function() {
    function namespace(ns_string) {
        var parts = ns_string.split('.'),
            parent = global,
            i;

        for (i = 0; i < parts.length; i += 1) {
            // create a property if it doesn't exist
            if (typeof parent[parts[i]] === "undefined") {
                parent[parts[i]] = {};
            }

            parent = parent[parts[i]];
        }
        return parent;
    }

    namespace("SMF.Oracle");
})();


/**
 * Creates a new Oracle MCS mobile backend layer.
 */

SMF.Oracle.MobileCloudService = function MobileCloudService(backendName) {
    var self = this;

    self.mobileBackend;
    self.authAnonymous;
    self.authenticate;
    self.isOracleMCSAuthenticated = false;
    self.getCollection;

    /**
     * inits mcs mobile backend
     */
    function init() {

        // setting platform properties
        console.log('setting platform values');
        mcs.MobileBackendManager.platform.model = Device.brandModel;
        mcs.MobileBackendManager.platform.manufacturer = Device.brandName;
        mcs.MobileBackendManager.platform.osName = Device.deviceOS;
        mcs.MobileBackendManager.platform.osVersion = Device.deviceOSVersion;
        // mcs.MobileBackendManager.platform.osBuild = '<unknown>';
        mcs.MobileBackendManager.platform.carrier = Device.carrierName;

        console.log('setting mcs_config');
        // setting mcs config
        mcs.MobileBackendManager.setConfig(mcs_config);

        // Setting MCS backend name
        console.log('setting mobileBackend:' + backendName);
        self.mobileBackend = mcs.MobileBackendManager.getMobileBackend(backendName);

        //Smartface supports OAuth so we're setting our auth type to OAuth.
        console.log('setting setAuthenticationType to oAuth');
        self.mobileBackend.setAuthenticationType(mcs.AuthenticationTypeOAuth);

        console.log('creating new Analytics object');
        self.Analytics = new Analytics(self.mobileBackend);
    }

    //Handles the success and failure callbacks defined here
    //Not using anonymous login for this example but including here. 
    self.authAnonymous = function() {
        console.log("Authenticating anonymously");
        self.mobileBackend.Authorization.authenticateAnonymous(
            function(response, data) {
                console.log("Success authenticating against mobile backend");
                self.isOracleMCSAuthenticated = true;
            },
            function(statusCode, data) {
                console.log("Failure authenticating against mobile backend");
                self.isOracleMCSAuthenticated = false;
            }
        );
    };

    //This handles success and failure callbacks using parameters (unlike the authAnonymous example)
    self.authenticate = function(username, password, successCallback, failureCallback) {
        self.mobileBackend.Authorization.authenticate(username, password, successCallback, failureCallback);
    };

    //this handles success and failure callbacks using parameters
    self.logout = function(successCallback, failureCallback) {
        self.mobileBackend.Authorization.logout();
    };

    self.isAuthorized = function() {
        return self.mobileBackend.Authorization.IsAuthorized;
    };


    // This creates add an event to MCS Analytics queue, Dont forget to flush it!
    self.logAnalytics = function(name) {
        var event = new AnalyticsEvent(name);
        self.Analytics.logEvent(event);
        console.log('logged event ' + name);
    };

    // Sends all collected event logs to the server
    self.flushAnalytics = function() {
        if (self.isOracleMCSAuthenticated) {
            var onAnalyticsSuccess = function(e) {
                console.log('onAnalyticsSuccess');
            };

            var onAnalyticsError = function(e) {
                console.log('onAnalyticsError: ' + JSON.stringify(e));
            };

            self.Analytics.flush(onAnalyticsSuccess, onAnalyticsError);
        }
        else {
            console.log('You should authenticate first.');
            console.log('self.isAuthorized : ' + self.isAuthorized());
            console.log('self.isOracleMCSAuthenticated : ' + self.isOracleMCSAuthenticated);
        }
    };

    // get storage collections
    // getCollection taken from official documentation example at site https://docs.oracle.com/cloud/latest/mobilecs_gs/MCSUA/GUID-7DF6C234-8DFE-4143-B138-FA4EB1EC9958.htm#MCSUA-GUID-7A62C080-C2C4-4014-9590-382152E33B24
    // modified to use custom deferred function instead of $q as shown in documentaion
    self.getCollection = function(collectionName) {
        var deferred = Deferred();

        //return a storage collection with the name assigned to the collection_id variable.
        self.mobileBackend.Storage.getCollection(collectionName, null, onGetCollectionSuccess, onGetCollectionFailed);

        return deferred.promise();

        function onGetCollectionSuccess(status, collection) {
            deferred.resolve(collection);
        }

        function onGetCollectionFailed(statusCode, headers, data) {
            if (statusCode == 404) {
                console.log('Storage collection not found, it may not be associated with the backend. Please check your MCS Storage settings.');
            }
            else {
                console.log("Failed to download storage collection: " + collectionName + ", statusCode: " + statusCode);
            }
            deferred.reject(statusCode);
        }
    };


    // postObject taken from official documentation example at site https://docs.oracle.com/cloud/latest/mobilecs_gs/MCSUA/GUID-7DF6C234-8DFE-4143-B138-FA4EB1EC9958.htm#MCSUA-GUID-7A62C080-C2C4-4014-9590-382152E33B24
    // modified to use custom deferred function instead of $q as shown in documentation
    self.postObject = function(collection, obj) {
        var deferred = Deferred();

        //post an object to the collection
        collection.postObject(obj, onPostObjectSuccess, onPostObjectFailed);

        return deferred.promise();

        function onPostObjectSuccess(status, object) {
            console.log("Posted storage object, id: " + object.id);
            deferred.resolve(object.id);
        }

        function onPostObjectFailed(statusCode, headers, data) {
            console.log("Failed to post storage object: " + statusCode);
            deferred.reject(statusCode);
        }
    };

    init();
    return self;
};
