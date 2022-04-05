const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {

  networks: {
    develop: {
     host: "localhost",
     port: 7545,
     network_id: "5777"
    },
  },

  plugins: ["solidity-coverage"],

  mocha: {
    reporter: 'eth-gas-reporter',
     reporterOptions : { 
       gasPrice:1,
       token:'ETH',
      }
   },

  compilers: {
    solc: {
      version: "0.8.13",
    }
  },
};