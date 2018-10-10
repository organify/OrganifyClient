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
var instance = contract.at("0xaa2fae558e5d7f61076a78c5fc0ff5c1d1af9781");
//0xd4c0a4d8fb375c9b5433a3a4b88501462f2a2b0f
module.exports = {
    instance: instance
}