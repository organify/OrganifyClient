var bigChainDb = require('../services/bigchainDbService.js')
var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var pagesController = new Controller();

const getTxData = async function(txList){
  let resultList = [];
  let asyncList = [];
  for (var i = 0; i < txList.length; i++) {
    asyncList.push(bigChainDb.loadTxbyId(tcList[i].transaction_id));
  }
  let allResponses = await Promise.all(asyncList);
  allResponses.forEach(function(response) {
    if (response.operation == 'CREATE'){
        resultList.push(response.asset.data);
    }
  }, this);
  return result;
}
pagesController.main = function(publicKey) {
  this.title = 'Organify';
  //let txIds = await bigChainDb.getTxIds(publicKey);
  //this.txDataList = await getTxData(txIds);
  this.render();
}

module.exports = pagesController;
