var bigChainDb = require('./bigchainDbService.js')

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}
function getTxData(txList, resultList) {
  //let resultList = [];
  let asyncList = [];
  for (var t = 0; t < txList.length; t++) {
      resultList.list.push({});
  }
  var i = txList.length - 1;
  
  return assignPromise(i, txList, resultList.list);
}
function assignPromise(index, txList, resultList){
  var len = resultList.length -1;
  return bigChainDb.loadTxbyId(txList[index].transaction_id).then((response) => {
      if (response.operation == 'CREATE') {
        resultList[len - index] = response.asset.data;
      }
      if(index > 0){
        return assignPromise(index-1, txList, resultList);
      }
      else{
        return;
      }
    });
}
function getTxIds(publicKey) {
  return bigChainDb.getTxIds(publicKey);
}

module.exports = {
  getTxData: getTxData,
  getTxIds: getTxIds,
  geTxData: getTxData,
  saveData: bigChainDb.saveData
}