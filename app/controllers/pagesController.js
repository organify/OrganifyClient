var txService = require('../services/txDataAsyncService.js')
var locomotive = require('locomotive'),
  Controller = locomotive.Controller;
var ethereumService = require('../services/ethereumService.js')
var sessionService = require('../services/sessionService.js')

var pagesController = new Controller();
var userSession = {};
var allProducts = [];
var publicKeys = ["0x8929d658b2647f09a318ebd756f49f299f82c7d9"];



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
pagesController.frontPage = function () {
  //let txIds = await bigChainDb.getTxIds(publicKey);
  //this.txDataList = await getTxData(txIds);
  this.title = "Front-Page";
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
  if (!sessionService.auth(this.req)){
    this.res.send("You don't have permission to access this page, please login", 401);
    return;
  }

  var publicKey = this.param("publicKey");

  if(!publicKey){
    this.res.send("Invalid request", 403);
  }

  var item = findItem(publicKey);
  this.item = item;
  this.render();
}

pagesController.submitItem = function () {
  if (!sessionService.auth(this.req)){
    this.res.send("You don't have permission to access this page, please login", 401);
    return;
  }

  var current = this;
  var requestObj = this.request.body;
  var item = {
    product: {
      name: "",
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
  //var session = this.request.session.publicKey;

}


pagesController.signIn = function () {
  var data = this.req.body;
  var userName = data.userName;
  var password = data.password;
  var loginSuccess = sessionService.login(this.req, userName, password);
  if (loginSuccess) {
    userSession[publicKeys[0]] = {
      signin: true
    };
    var callBack = function(cur){
      var firstActiveItem = findFirstActiveItem();
      cur.res.send({status: 200, data: firstActiveItem.publicKey});;
    }
    getItems(this, callBack);
    
  } else
    this.res.end("404");
}

pagesController.signOut = function () {
  var logoutSuccess = sessionService.logout(this.req);
  if (logoutSuccess) {
    this.res.end("200");
  } else
    this.res.end("404");
}


pagesController.myItems = function () {
  if (!sessionService.auth(this.req)){
    this.res.send("You don't have permission to access this page, please login", 401);
    return;
  }
  if(allProducts.length > 0){
    this.items = allProducts;
    this.render();
    return;
  }
    
  var current = this;
  var callBack = function(cur){
    cur.render();
  }
  getItems(current, callBack);
}
var getItems = function(current, callBack){
  current.items = [];
  ethereumService.instance.getItem.call(publicKeys[0], function (err, result) {
    var productNames = result[0].substring(1).split(';');
    var itemPublicKeys = result[1].substring(1).split(';');
    var itemPrivateKeys = result[2].substring(1).split(';');
    var itemIsActive = result[3].substring(1).split(';');
    for (var i = 0; i < productNames.length; i++) {
      userSession[publicKeys[0]][itemPublicKeys[i]] = {
        privateKey: itemPrivateKeys[i],
        name: productNames[i]
      };
      var currentProduct = {
        name: productNames[i],
        publicKey: itemPublicKeys[i],
        owner: publicKeys[0],
        privateKey: itemPrivateKeys[i],
        isActive : itemIsActive[i] == '1'
      };
      addProduct(currentProduct);
      current.items.push(currentProduct);
    }
    if(callBack)
      callBack(current);
  });
}
function addProduct(product) {
  for(var i = 0; i < allProducts.length; i++){
    if(allProducts[i].publicKey === product.publicKey){
      allProducts[i] = product;
      return;
    }
  }
  allProducts.push(product);
}
pagesController.product = function () {
  this.errorOccur = false;
  var publicKey = this.param("publicKey");
  this.title = 'Organify';
  var resultList = {
    total: 0,
    list: []
  };
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
    .catch((error) =>{
      this.txDataList = [];
      this.errorOccur = true;
    })
    .finally(() => {
      this.render();
    });
}

function findItem(publicKey){
   for (var i = 0; i < allProducts.length; i++) {
    if (allProducts[i].publicKey === publicKey) {
      return allProducts[i];
    }
  }
  return {};
}
function findFirstActiveItem(){
   for (var i = 0; i < allProducts.length; i++) {
    if (allProducts[i].isActive) {
      return allProducts[i];
    }
  }
  return {};
}
module.exports = pagesController;