const { ChainId, Token, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const ethers = require('ethers');
 
const chainId = ChainId.KOVAN;
const tokenAddress = '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'; // DAI address Kovan
 
const init = async () => {
    const dai = await Fetcher.fetchTokenData(chainId, tokenAddress, undefined, 'DAI', 'Dai Stablecoin');
    // const dai = new Token(chainId, tokenAddress, 18, 'DAI', 'Dai Stablecoin');
    const weth = WETH[chainId];
    const pair = await Fetcher.fetchPairData(dai, weth);
    const route = new Route([pair], weth);
    const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT);
    console.log(route.midPrice.toSignificant(6));
    console.log(route.midPrice.invert().toSignificant(6));
    console.log(trade.executionPrice.toSignificant(6));
    console.log(trade.nextMidPrice.toSignificant(6));
    console.log(weth);
    console.log(dai);
    
    const slippageTolerance = new Percent('50', '10000'); // tolérance prix 50 bips = 0.050%
    
    const _tokenIn = dai;
    const _tokenOut = weth;
    const _fee = 500; // 0.05%
    const _recipient = "";
    const _deadline = Math.floor(Date.now() / 1000) + 60 * 20; // le délai après lequel le trade n’est plus valable 
    const _amountIn = trade.minimumAmountOut(slippageTolerance).raw; // minimum des tokens à récupérer avec une tolérance de 0.050%
    const _amountOutMin = 0; //Mettre à 0 de manière naive (ce sera forcément plus). En vrai, utiliser un oracle pour déterminer cette valeur précisément.
    const _sqrtPriceLimitX96 = 0; // Assurer le swap au montant exact

    const value = trade.inputAmount.raw; // la valeur des ethers à envoyer 
    
    const provider = ethers.getDefaultProvider('kovan', {
    infura: 'https://mainnet.infura.io/v3/17764249f1c94268ab129ecefb1ee39c'
    }); // utilisation du provider infura pour effectuer une transaction  
    
    const signer = new ethers.Wallet('01875a62d3091ebfefb4705453c5933b6660d404da7f539e9ccd247a05f296c6'); // récupérer son wallet grâce au private key
    const account = signer.connect(provider); // récupérer l’account qui va effectuer la transaction 
    
    const uniswapABI = [
        {
            "inputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "tokenIn",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "tokenOut",
                            "type": "address"
                        },
                        {
                            "internalType": "uint24",
                            "name": "fee",
                            "type": "uint24"
                        },
                        {
                            "internalType": "address",
                            "name": "recipient",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountIn",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOutMinimum",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint160",
                            "name": "sqrtPriceLimitX96",
                            "type": "uint160"
                        }
                    ],
                    "internalType": "struct ISwapRouter.ExactInputSingleParams",
                    "name": "params",
                    "type": "tuple"
                }
            ],
            "name": "exactInputSingle",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "amountOut",
                    "type": "uint256"
                }
            ],
            "stateMutability": "payable",
            "type": "function"
        }
    ]
    
    const uniswap = new ethers.Contract(
        '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        uniswapABI,
        account
    ); // récupérer le smart contract d’Uniswap avec l’adress du smart contract et l’ABI. Grâce à ethers on peut passer la fonction et la structure à utiliser en solidity 
    
    const tx = await uniswap.exactInputSingle(
        {
            tokenIn: _tokenIn,
            tokenOut: _tokenOut,
            fee: _fee,
            recipient: _recipient,
            deadline: _deadline,
            amountIn: _amountIn,
            amountOutMinimum: _amountOutMin,
            sqrtPriceLimitX96: _sqrtPriceLimitX96,
        },
        { value, gasPrice: 20e9 }
        ); // envoyer la transaction avec les bons paramètres 
    console.log(`Transaction hash: ${tx.hash}`); // afficher le hash de la transaction 
    
    const receipt = await tx.wait(); // récupérer la transaction receipt 
    console.log(`Transaction was mined in block ${receipt.blockNumber}`);
}
 
init();
