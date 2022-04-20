const path = require("path")
require('dotenv').config();

module.exports = {

  networks: {
    develop: {
      host: "localhost",
      port: 7545,
      network_id: "5777"
    },
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
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