require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
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
 
   // Configure your compilers
   compilers: {
     solc: {
       version: "0.8.13",
     }
   },
 };
