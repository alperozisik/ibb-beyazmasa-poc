/* globals mcs */
var mcs_config = {
  "logLevel": mcs.logLevelInfo,
  "mobileBackends": {
    "YOUR_BACKEND_NAME": {
      "default": true,
      "baseUrl": "YOUR_BACKEND_BASE_URL",
      "applicationKey": "YOUR_BACKEND_APPLICATION_KEY",
      "authorization": {
        "basicAuth": {
          "backendId": "YOUR_BACKEND_ID",
          "anonymousToken": "YOUR_BACKEND_ANONYMOUS_TOKEN"
        },
        "oAuth": {
          "clientId": "YOUR_CLIENT_ID",
          "clientSecret": "YOUR_ClIENT_SECRET",
          "tokenEndpoint": "YOUR_TOKEN_ENDPOINT"
        },
        "facebookAuth":{
          "facebookAppId": "YOUR_FACEBOOK_APP_ID",
          "backendId": "YOUR_BACKEND_ID",
          "anonymousToken": "YOUR_BACKEND_ANONYMOUS_TOKEN"
        },
        "ssoAuth":{
          "clientId": "YOUR_CLIENT_ID",
          "clientSecret": "YOUR_ClIENT_SECRET",
          "tokenEndpoint": "YOUR_TOKEN_ENDPOINT"
        }
      }
    }
  }
};
