/*globals SMF*/
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

    namespace("SMF.Akbank");
})();

/**
 * Consumes Akbank API Exchange Rates service
 * @param apiKey {String} the apikey.
 */
SMF.Akbank.ExchangeRatesService = function ExchangeRatesService(apiKey) {
    if(!(this instanceof ExchangeRatesService))
        return new ExchangeRatesService(apiKey);
    
    var self = this;

    self.err;
    self.getExchangeRates;

    self.Currency = {
        "sellPrice": 0,
        "buyPrice": 0,
        "usdCrossRate": 1,
        "parity": "D",
        "currencyCode": "001",
        "banknoteBuying": 0,
        "currencyCodeAlpha": "USD",
        "banknoteSelling": 0,
        "unit": "B"
    };


    // Getting Exchange rate for now()
    self.getExchangeRates = function(currencyCode) {

        //creating new XHR to get token
        var xhrGetExchangeRates = new XMLHttpRequest();
        xhrGetExchangeRates.ignoreSSLErrors = true;

        xhrGetExchangeRates.onload = onGetExchangeRatesSuccess; //call it on success
        xhrGetExchangeRates.onError = onGetExchangeRatesError; //call it on error
        xhrGetExchangeRates.timeout = 30;

        var url = 'https://apigate.akbank.com/api/mock/exchangeRatesApi';
        if (currencyCode) {
            url += "/" + currencyCode;
        }
        console.log(url);

        //adding auth header to the request
        xhrGetExchangeRates.setRequestHeader('apikey', apiKey);
        xhrGetExchangeRates.open("GET", url);
        xhrGetExchangeRates.send();
    };

    //if there is an error during syndication, we'll raise an alert
    function onGetExchangeRatesError(e) {
        console.log(JSON.prune(e));
    }

    //parsing the XHR result.
    function onGetExchangeRatesSuccess(e) {

        //getting response text and parsing it
        var parsedResponse = JSON.parse(this.responseText);

        if (parsedResponse.resultCode === "00") {
            self.Currency = parsedResponse.data;
        }
        else {
            self.err = parsedResponse.resultMessage;
        }

        console.log(JSON.prune(parsedResponse));
        console.log('sellPrice ' + self.sellPrice);
        console.log('buyPrice ' + self.buyPrice);
    }

    return self;
};


/**
 * Consumes Akbank API Stock Value service
 * @param apiKey {String} the apikey.
 */
SMF.Akbank.StockValuesService = function StockValuesService(apiKey) {
    if(!(this instanceof StockValuesService))
        return new StockValuesService(apiKey);
    
    var self = this;

    self.err;
    self.stockValues;

    self.Stock = {
        "average1": 0,
        "average2": 0,
        "last": 0,
        "previousClose": 0,
        "change": 0,
        "bestBuy": 0,
        "bestSell": 0,
        "volume1": 0,
        "amount1": 0,
        "volume2": 0,
        "amount2": 0,
        "hour": 0,
        "max": 0,
        "groupSymbol": "",
        "stockStatus": "",
        "symbol": "",
        "name": ""
    };

    // Gets stock value of a symbol
    self.getStockValue = function(stockSymbol) {

        //creating new XHR to get token
        var xhrGet = new XMLHttpRequest();
        xhrGet.ignoreSSLErrors = true;

        xhrGet.onload = onGetSuccess; //call it on success
        xhrGet.onError = onGetError; //call it on error
        xhrGet.timeout = 30;

        var url = 'https://apigate.akbank.com/api/mock/stockValues?symbol=' + stockSymbol;
        console.log(url);

        //adding auth header to the request
        xhrGet.setRequestHeader('apikey', apiKey);
        xhrGet.open("GET", url);
        xhrGet.send();
    };

    //if there is an error during syndication, we'll raise an alert
    function onGetError(e) {
        console.log(JSON.prune(e));
    }

    //parsing the XHR result.
    function onGetSuccess(e) {

        //getting response text and parsing it
        var parsedResponse = JSON.parse(this.responseText);

        if (parsedResponse.returnCode === "API-00000") {
            self.Stock = parsedResponse.data;
        }
        else {
            self.err = parsedResponse.resultMessage;
        }

        console.log(JSON.prune(parsedResponse));
    }
    
    return self;
};