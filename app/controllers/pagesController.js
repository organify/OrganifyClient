
var txService = require('../services/txDataAsyncService.js')
var locomotive = require('locomotive')
  , Controller = locomotive.Controller;
var ethereumService = require('../services/ethereumService.js')


var pagesController = new Controller();
var userSession = {};
var allProducts = [];
var publicKeys = [];



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
  this.allProducts = allProducts;
  this.render();
}
pagesController.admin = function () {
  //let txIds = await bigChainDb.getTxIds(publicKey);
  //this.txDataList = await getTxData(txIds);
  this.title = "Organify-Admin";
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
  var current = this;
  var item = {
    product: {
      name: this.request.body.name || userSession[publicKeys[0]][this.request.body.publicKey]["name"],
      imgUrl: ""
    },
    timeStamp: new Date().toLocaleString(),
    event: this.request.body.data
  };
  var keyObject = {
    publicKey: this.request.body.publicKey,
    privateKey: userSession[publicKeys[0]][this.request.body.publicKey]["privateKey"]
  };
  txService.saveData(item, keyObject).finally(() => 
  current.res.end("true"));
  //var session = this.request.session.publicKey;
  
}
pagesController.submitConfirm = function () {
  var requestObj = this.request.body;
  var item = {
    product: {
      name: requestObj.name,
      imgUrl: ""
    },
    timeStamp: new Date().toLocaleString(),
    event: requestObj.data
  };
  var keyObject = {
    publicKey: "",
    privateKey: ""
  };
  for (var i = 0; i < allProducts.length; i++) {
    if (allProducts[i].publicKey == requestObj.publicKey) {
      item.product.name = allProducts[i].name;
      keyObject.publicKey = allProducts[i].publicKey;
      keyObject.privateKey = allProducts[i].privateKey;
    }
  }
  txService.saveData(item, keyObject).finally(() => 
  current.res.end("true"));
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
  ethereumService.instance.getItem.call(publicKeys[0], function (err, result) {
    var productNames = result[0].substring(1).split(';');
    var itemPublicKeys = result[1].substring(1).split(';');
    var itemPrivateKeys = result[2].substring(1).split(';');
    for (var i = 0; i < productNames.length; i++) {
      userSession[publicKeys[0]][itemPublicKeys[i]] = { privateKey: itemPrivateKeys[i], name: productNames[i] };
      var currentProduct = {
        name: productNames[i], publicKey: itemPublicKeys[i], owner: publicKeys[0],
        privateKey: itemPrivateKeys[i]
      };
      addProduct(currentProduct);
      current.items.push(currentProduct);
    }
    current.render();
  });
}
function addProduct(product) {
  var modified = false;
  for (var i = 0; i < allProducts.length; i++) {
    if (allProducts[i].name == product.name && allProducts[i].publicKey == product.publicKey) {
      allProducts[i].owner = product.owner;
      modified = true;
      break;
    }
  }
  if (!modified) {
    allProducts.push(product);
  }
}
pagesController.product = function () {
  var publicKey = this.param("publicKey");
  this.title = 'Organify';
  var resultList = { total: 0, list: [] };
  var txIds = txService.getTxIds(publicKey)
    .then((response) => {
      resultList.total = response.length - 1;
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
