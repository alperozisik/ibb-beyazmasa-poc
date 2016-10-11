# Smartface Helper JS Libraries for Akbank API Portal Services

## What is it?

Smartface supports most of the JS libraries out there which doesn't require DOM by design.
In general we're putting main vendors' libraries under their seperate folders.

Akbank lib is created by Smartface itself on behalf of Akbank.

## What is Akbank OpenBanking?

Akbank has opened some of it's banking services to public usage with simple apikey authentication. 

You can find detailed info on Akbank's open banking initiative on https://apiportal.akbank.com/

## What APIs does Akbank Provide?

Akbank Apiportal provides these APIs:

* CREDIT INTEREST RATES
* CREDIT PAYMENT PLAN
* EXCHANGE RATES SERVICE
* FIND ATM SERVICE
* FIND BRANCH SERVICE
* FUND PRICES SERVICE
* STOCK VALUES

You can call these APIs directly from your apps via straight REST calls, or with the help of our SMF.Akbank for the iOS and Android platforms.

## Which parts implemented in SMF.Akbank JS lib?

In this version we've implemented these functions;

* `SMF.Akbank.ExchangeRatesService`
* `SMF.Akbank.StockValuesService`

## How to use?

You need to include `libs/Akbank/akbank.js` in order to consume Akbank APIs. Don't forget to create your Akbank application on Akbank Api Portal and get `apikey`


```javascript
include("libs/Akbank/akbank.js");

function Application_OnStart(e) {

	// Creating a new Akbank Exchange Rate Service instance 
	smfAkbankExchangeRatesService = new SMF.Akbank.ExchangeRatesService(apiKeyAkbank);
	
	// Get USD rates
    smfAkbankExchangeRatesService.getExchangeRates('001');
    
    console.log('smfAkbankExchangeRatesService.Currency.sellPrice ' + smfAkbankExchangeRatesService.Currency.sellPrice);
    console.log('smfAkbankExchangeRatesService.Currency.buyPrice ' + smfAkbankExchangeRatesService.Currency.buyPrice);
    console.log('smfAkbankExchangeRatesService.Currency.currencyCode ' + smfAkbankExchangeRatesService.Currency.currencyCode);

	
	// Creating a new Akbank Stock Value Service instance 
	smfAkbankStockValuesService = new SMF.Akbank.StockValuesService(apiKeyAkbank)
	
	// Get stock value for AKBNK
	smfAkbankStockValuesService.getStockValue('AKBNK');

	console.log('smfAkbankStockValuesService.Stock.last ' + smfAkbankStockValuesService.Stock.last);
	console.log('smfAkbankStockValuesService.Stock.bestSell ' + smfAkbankStockValuesService.Stock.bestSell);

}
```
