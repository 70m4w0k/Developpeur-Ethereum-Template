const path = require("path")
var HDWalletProvider = require("truffle-hdwallet-provider");
require("dotenv").config();
const mnemonic = 'season cruise report day trip common mixed direct goose rail disagree erosion'

module.exports = {

  networks: {
    // develop: {
    //   host: "localhost",
    //   port: 7545,
    //   network_id: "5777"
    // },
    // development: {
    //   host: "127.0.0.1",     // Localhost (default: none)
    //   port: 8545,            // Standard Ethereum port (default: none)
    //   network_id: "*",       // Any network (default: none)
    // },
    kovan: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://kovan.infura.io/v3/17764249f1c94268ab129ecefb1ee39c");
      },
      network_id: 42
    },
  },

  mocha: {
   },

  compilers: {
    solc: {
      version: "0.8.13",
    }
  },
};