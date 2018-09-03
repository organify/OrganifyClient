
var txService = require('../services/txDataAsyncService.js')
var locomotive = require('locomotive')
  , Controller = locomotive.Controller;
var Web3 = require('web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
var fs = require('fs');

var rawAbi = fs.readFileSync('./abi.txt', 'utf8');
var abi = JSON.parse(rawAbi);
var web3 = new Web3(
  new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/682195f0b13a4811998ba46dfcb2e1d4')
);
var pagesController = new Controller();
var userSession = {};
var publicKeys = [];
//{ethereumpublickey: {signin: true, publicKeyA: {name: apple, privaeKey: privateKeyA}}}
var contract = web3.eth.contract(abi);
var instance = contract.at("0x8d1086dc3395c556ba10c2b17d213c308c33fce2");


function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}
pagesController.main = function () {
  //let txIds = await bigChainDb.getTxIds(publicKey);
  //this.txDataList = await getTxData(txIds);
  this.title = "Organify";
  this.render();
}
pagesController.subscription = function () {
  //let txIds = await bigChainDb.getTxIds(publicKey);
  //this.txDataList = await getTxData(txIds);
  this.title = "Organify-Subscription";
  this.render();
}
pagesController.form = function () {
  //let txIds = await bigChainDb.getTxIds(publicKey);
  this.title = "Apple";
  this.render();
}
pagesController.submitItem = function () {
  var item = {
    product: {
      name: this.request.body.name || userSession[publicKeys[0]][this.request.body.publicKey]["name"],
      imgUrl: ""
    },
    event: this.request.body.data
  };
  var keyObject = {
    publicKey: this.request.body.publicKey,
    privateKey: userSession[publicKeys[0]][this.request.body.publicKey]["privateKey"]
  };
  txService.saveData(item, keyObject);
  //var session = this.request.session.publicKey;
  this.res.end("true");
  return true;
}
pagesController.submitConfirm = function () {
  var requestObj = this.request.body;
  var current = this;
  var item = {
    product: {
      name: requestObj.name,
      imgUrl: ""
    },
    event: requestObj.data
  };
  var keyObject = {
  };
  instance.getItem.call(publicKeys[0], function (err, result) {

    var productNames = result[0].substring(1).split(';');
    var itemPublicKeys = result[1].substring(1).split(';');
    var itemPrivateKeys = result[2].substring(1).split(';');
    debugger;
    for (var i = 0; i < productNames.length; i++) {
      if (itemPublicKeys[i] == requestObj.publicKey) {
        item.product.name = productNames[i];
        keyObject.publicKey = itemPublicKeys[i];
        keyObject.privateKey = itemPrivateKeys[i];
      }
    }

    txService.saveData(item, keyObject);
    current.res.end("true");
    return true;
  });
}
pagesController.signIn = function () {
  var data = this.request.body;
  if (!data.publicKey)
    return false;
  userSession[data.publicKey] = { signin: true };
  if (publicKeys.length == 0)
    publicKeys.push(data.publicKey);
  else
    publicKeys[0] = data.publicKey;
  //this.request.session.publicKey = data.publicKey;
  this.res.end("true");
  return true;
}
pagesController.myItems = function () {
  var current = this;
  this.items = []
  instance.getItem.call(publicKeys[0], function (err, result) {
    var productNames = result[0].substring(1).split(';');
    var itemPublicKeys = result[1].substring(1).split(';');
    var itemPrivateKeys = result[2].substring(1).split(';');
    for (var i = 0; i < productNames.length; i++) {
      userSession[publicKeys[0]][itemPublicKeys[i]] = { privateKey: itemPrivateKeys[i], name: productNames[i] }
      current.items.push({ name: productNames[i], publicKey: itemPublicKeys[i], privateKey: itemPrivateKeys[i] });
    }
    current.render();
  });
}
pagesController.product = function () {
  var publicKey = this.param("publicKey");
  this.title = 'Organify';
  var resultList = {total: 0, list: []};
  var txIds = txService.getTxIds(publicKey)
    .then((response) => {
      resultList.total = response.length -1;
      return txService.getTxData(response, resultList);
    })
    .then((response) => {
      var items = resultList.list;
      this.txDataList = items;
      this.name = items[0].product.name;
      var transfer = items[0].event.receipient;
      if (transfer && publicKeys[0] == transfer) {
        items[0].event.transfer = true;
      }
      return;
    })
    .finally(() => {
      this.render();
    });
}
module.exports = pagesController;
