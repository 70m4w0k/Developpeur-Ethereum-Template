var Web3 = require('web3'); 

web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/17764249f1c94268ab129ecefb1ee39c'));

var ethTx = ('0xb232e8dd4648d52caa2268a28aaa16cea2148855c743df57252774cc80459512');

web3.eth.getTransaction(ethTx, function(err, result) { 

    if (!err && result!== null) {
        console.log(result); // Log all the transaction info

        console.log('From Address: '+ result.from); // Log the from address 
        console.log('To Address: ' +  result.to); // Log the to address
        console.log('Ether Transacted: '+ (web3.utils.fromWei(result.value, 'ether'))); // Get the value, convert from Wei to Ether and log it
    } 
    
    else {
        console.log('Error!', err); // Dump errors here
    }

});