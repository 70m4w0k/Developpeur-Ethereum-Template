var  Web3  =  require('web3');  
web3  =  new Web3(new  Web3.providers.HttpProvider('https://ropsten.infura.io/v3/VOTRE_ID_PROJET'));
console.log('Calling Contract.....');

var  abi  =  [
    {
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
var  addr  =  "0xD50a997E054CFfE5a13E6120322151210c803D62";

var  Contract  =  new web3.eth.Contract(abi, addr);

// FUNCTION must the name of the function you want to call. 
Contract.methods.FUNCTION().call().then(console.log);