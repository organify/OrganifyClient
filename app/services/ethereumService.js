var Web3 = require('web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
var fs = require('fs');

var rawAbi = fs.readFileSync('./abi.txt', 'utf8');
var abi = JSON.parse(rawAbi);
var web3 = new Web3(
  new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/682195f0b13a4811998ba46dfcb2e1d4')
);

var contract = web3.eth.contract(abi);
var instance = contract.at("0x8d1086dc3395c556ba10c2b17d213c308c33fce2");

module.exports = {
    instance: instance
}