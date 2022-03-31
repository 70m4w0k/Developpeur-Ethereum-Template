const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {

  networks: {
    develop: {
     host: "localhost",
     port: 7545,
     network_id: "5777"
    },
    // development: {
    //  host: "127.0.0.1",     // Localhost (default: none)
    //  port: 8545,            // Standard Ethereum port (default: none)
    //  network_id: "*",       // Any network (default: none)
    // },
    // ropsten:{
    //   provider : function() {return new HDWalletProvider({mnemonic:{phrase:`${process.env.MNEMONIC}`},providerOrUrl:`https://ropsten.infura.io/v3/${process.env.INFURA_ID}`})},
    //   network_id:3,
    // },
    // kovan:{
    //   provider : function() {return new HDWalletProvider({mnemonic:{phrase:`${process.env.MNEMONIC}`},providerOrUrl:`https://kovan.infura.io/v3/${process.env.INFURA_ID}`})},
    //   network_id:42,
    //   from: '0x55467540b54348a4769396e5Ea4fb489022306bd',
    // }
  },
  
  mocha: {
    // timeout: 100000
  },

  plugins: ["solidity-coverage"],

  mocha: {
    reporter: 'eth-gas-reporter',
     reporterOptions : { 
       gasPrice:1,
       token:'ETH',
      }
   },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.13",
    }
  },
};