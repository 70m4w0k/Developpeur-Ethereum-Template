async function main(){

    var Web3 = require('web3');
    require('dotenv').config();
    const HDWalletProvider = require('@truffle/hdwallet-provider');
    
    provider = new HDWalletProvider(`${process.env.MNEMONIC}`, `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`);
    
    web3 = new Web3(provider);
    
    
    var abi =   [    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "n",
                "type": "uint256"
            }
        ],
        "name": "decrement",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "n",
                "type": "uint256"
            }
        ],
        "name": "increment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "n",
                "type": "uint256"
            }
        ],
        "name": "set",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "get",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
    ];
    var addr  =  "0xD50a997E054CFfE5a13E6120322151210c803D62";
    var Contract  =  new web3.eth.Contract(abi, addr);
    
    Contract.methods.get().call().then(console.log);
    
    await Contract.methods.set(10).send({ from:'0x13bc18faeC7f39Fb5eE428545dBba611267AEAa4' });
    
    Contract.methods.get().call().then(console.log);
}
    
main();