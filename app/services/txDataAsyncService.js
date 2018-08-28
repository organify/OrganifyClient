var bigChainDb = require('./bigchainDbService.js')

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
function getTxData(txList){
  let resultList = [];
  let asyncList = [];
  
  for (var i = 0; i < txList.length; i++) {
    bigChainDb.loadTxbyId(txList[i].transaction_id).then((response) => {
      debugger;
      if (response.operation == 'CREATE'){
        resultList.push(response.asset.data);
      }
    });
  }
  wait(5000);
  return resultList;
}
function getTxIds(publicKey) {
  return bigChainDb.getTxIds(publicKey);
}

module.exports = {
    getTxData: getTxData,
    getTxIds : getTxIds,
    geTxData : getTxData
}