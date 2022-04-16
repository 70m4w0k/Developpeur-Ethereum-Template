const Web3 = require('web3');

const rpcURL = "https://ropsten.infura.io/v3/17764249f1c94268ab129ecefb1ee39c";

const web3 = new Web3(rpcURL);

var  ABI  =  [
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
	}
];

var  addr  =  "0xD50a997E054CFfE5a13E6120322151210c803D62";

const simpleStorage = new web3.eth.Contract(ABI, addr);

simpleStorage.methods.get().call((err, data) => {
    console.log(data);
});