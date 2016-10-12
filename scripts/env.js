/* globals */
(function() {
var envrionmentVariables = {
  test: {
      login: "abc"
  }  ,
  production: {
      login: "xyz"
  }
};

global.serviceInfo = {
    login: "https://" + Application.currentReleaseChannel + ".api.ibb.gov.tr/login"
}
})();