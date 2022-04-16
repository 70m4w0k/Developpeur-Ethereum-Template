const path = require("path")
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {

  networks: {
    // develop: {
    //   host: "localhost",
    //   port: 7545,
    //   network_id: "5777"
    // },
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(`${process.env.MNEMONIC}`, `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`)
      },
      network_id: 4
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(`${process.env.MNEMONIC}`, `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`)
      },
      network_id: 3
    }

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