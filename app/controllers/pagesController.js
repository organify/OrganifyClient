var txService = require('../services/dynamoDbService.js')
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
  var current = this;
  function callback() {
    
    allProducts.sort(function (a, b) {
      return a.id - b.id;
    });
    this.allProducts = allProducts;
    current.render();
  }
  getItemsFromDynamo(this, callback);

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
  if (!sessionService.auth(this.req)) {
    this.res.send("You don't have permission to access this page, please login", 401);
    return;
  }

  var publicKey = this.param("publicKey");

  if (!publicKey) {
    this.res.send("Invalid request", 403);
  }

  var item = findItem(publicKey);
  this.item = item;
  this.render();
}

pagesController.submitItem = function () {
  if (!sessionService.auth(this.req)) {
    this.res.send("You don't have permission to access this page, please login", 401);
    return;
  }

  var current = this;
  var requestObj = this.request.body;
  var keyObject = {
    publicKey: "",
    privateKey: ""
  };
  for (var i = 0; i < allProducts.length; i++) {
    if (allProducts[i].publicKey == requestObj.publicKey) {
      keyObject.publicKey = allProducts[i].publicKey;
      keyObject.privateKey = allProducts[i].privateKey;
    }
  }
  var callback = function (err, data) {
    if (err) {
      console.error("Unable to submit item. Error JSON:" + err);

    }
    current.res.end("true");
  }
  txService.addEvent(keyObject.publicKey, requestObj.data, callback);

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
    var callBack = function (cur) {
      allProducts.sort(function (a, b) {
        return a.id - b.id;
      });
      var firstActiveItem = findFirstActiveItem();
      cur.res.send({ status: 200, data: firstActiveItem.publicKey });;
    }
    getItemsFromDynamo(this, callBack);

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
  if (!sessionService.auth(this.req)) {
    this.res.send("You don't have permission to access this page, please login", 401);
    return;
  }
  if (allProducts.length > 0) {
    this.items = allProducts;
    this.render();
    return;
  }

  var current = this;
  var callBack = function (cur) {
    cur.render();
  }
  getItems(current, callBack);
}
var getItemsFromDynamo = function (current, callback) {
  function onscan(err, data) {
    if (err) {
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      // print all the movies
      console.log("Scan succeeded.");
      data.Items.forEach(function (event) {
        var currentProduct = {
          name: event.name,
          publicKey: event.productId, 
          type: event.type,
          id: event.itemId
        };
        addProduct(currentProduct);
        current.items.push(currentProduct);
      });

      // continue scanning if we have more movies, because
      // scan can retrieve a maximum of 1MB of data
      if (typeof data.LastEvaluatedKey != "undefined") {
        console.log("Scanning for more...");
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        txService.getAllEvents(onscan, callback);
      }
      else if (callback)
        callback(current)
    }
  }
  current.items = [];
  txService.getAllEvents(onscan);
}
var getItems = function (current, callBack) {
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
        isActive: itemIsActive[i] == '1'
      };
      addProduct(currentProduct);
      current.items.push(currentProduct);
    }
    if (callBack)
      callBack(current);
  });
}
function addProduct(product) {
  for (var i = 0; i < allProducts.length; i++) {
    if (allProducts[i].publicKey === product.publicKey) {
      allProducts[i] = product;
      return;
    }
  }
  allProducts.push(product);
}
pagesController.product = function () {
  var scope = this;
  scope.title = "Organify";
  scope.errorOccur = false;
  var publicKey = scope.param("publicKey");
  var resultList = {
    total: 0,
    list: []
  };
  var callback = function (err, data) {
    if (err) {
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      scope.txDataList = [];
      scope.errorOccur = true;
    } else {
      var items = data.Item;
      scope.txDataList = items.events;
      scope.name = items.name;
      scope.title = items.name;
      scope.type = items.type;
      //var transfer = items.events[0].receipient;
    }
    scope.render();
  }
  var txIds = txService.get(publicKey, callback);
}

function findItem(publicKey) {
  for (var i = 0; i < allProducts.length; i++) {
    if (allProducts[i].publicKey === publicKey) {
      return allProducts[i];
    }
  }
  return {};
}
function findFirstActiveItem() {
  return allProducts[allProducts.length-1];
}
module.exports = pagesController;