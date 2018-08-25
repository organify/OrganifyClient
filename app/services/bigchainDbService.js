const driver = require('bigchaindb-driver')

// BigchainDB server instance (e.g. https://test.bigchaindb.com/api/v1/)
const API_PATH = 'https://test.bigchaindb.com/api/v1/'

// Create a new keypair.
const organifyKeypair = new driver.Ed25519Keypair()

// Construct a transaction payload
const tx = driver.Transaction.makeCreateTransaction(
    // Define the asset to store, in this example it is the current temperature
    // (in Celsius) for the city of Berlin.
    { city: 'Berlin, DE', temperature: 22, datetime: new Date().toString() },

    // Metadata contains information about the transaction itself
    // (can be `null` if not needed)
    { what: 'My first BigchainDB transaction' },

    // A transaction needs an output
    [ driver.Transaction.makeOutput(
            driver.Transaction.makeEd25519Condition(organifyKeypair.publicKey))
    ],
    organifyKeypair.publicKey
)

// Sign the transaction with private keys
const txSigned = driver.Transaction.signTransaction(tx, organifyKeypair.privateKey)

// Send the transaction off to BigchainDB
let conn = new driver.Connection(API_PATH, { 
    app_id: 'eb2fc977',
    app_key: 'a480e4f00167ee32ccc99ed311e14c92'
})

conn.postTransactionCommit(txSigned)
    .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))