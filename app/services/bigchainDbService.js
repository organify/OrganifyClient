const driver = require('bigchaindb-driver')

// BigchainDB server instance (e.g. https://test.bigchaindb.com/api/v1/)
const API_PATH = 'https://test.bigchaindb.com/api/v1/'

// Create a new keypair.
const organifyKeypair = new driver.Ed25519Keypair()

//connection

const conn = new driver.Connection(API_PATH, { 
    app_id: 'eb2fc977',
    app_key: 'a480e4f00167ee32ccc99ed311e14c92'
})

/**
* Get a list of ids of unspent transactions for a certain public key.
* @returns {Array} An array containing all unspent transactions for a certain public key.
*/
const getTxIdsbyPublicKey = function(publicKey){
    return conn.listOutputs(publicKey, false).then((response) => {

        console.log('getData response is', response);
        return response;
    });
}
const listTransactions = function(assetId){
    return conn.listTransactions(assetId, 'CREATE');
}
/**
* Load a transaction by using its transaction id.
* @param {*} transactionId 
*/
const loadTxbyId = function(txId){
    return conn.getTransaction(txId).then((response) => {
        console.log('loadTx response is', response);
        return response;
    })
}


module.exports = {
    getTxIds: getTxIdsbyPublicKey,
    loadTxbyId: loadTxbyId
}