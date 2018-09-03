const Eth = require('ethjs-query')
const abi = require('./abi.js')
const EthContract = require('ethjs-contract')
const ethUtil = require('ethereumjs-util')
window.ethUtil = ethUtil;
const Buffer = require('buffer/').Buffer
window.Buffer = Buffer;

window.web3Instance = null;
window.eth = null;

function startApp(web3) {
  window.web3Instance = web3;
  window.eth = new Eth(web3.currentProvider)
  const contract = new EthContract(eth)
  initContract(contract)
}
function initContract(contract) {
    const Contract = contract(abi.abi);
    const thisContract = Contract.at("0xc631d426fdee9ca5f9531ad87f69ee8396158e5a");
	window.smartContract = thisContract;
}

startApp(web3);