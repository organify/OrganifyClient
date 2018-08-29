
var txService = require('../services/txDataAsyncService.js')
var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var pagesController = new Controller();

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
pagesController.main = function() {
  //let txIds = await bigChainDb.getTxIds(publicKey);
  //this.txDataList = await getTxData(txIds);
  this.render();
}
pagesController.product = function() {
  var publicKey = this.param("publicKey");
  this.title = 'Organify';

  var txIds = txService.getTxIds(publicKey)
  .then((response) =>{
    this.txDataList = txService.getTxData(response);
  });
  setTimeout(() => 
  this.render(), 30000);
}
module.exports = pagesController;
