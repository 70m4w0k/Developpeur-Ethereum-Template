# Projet - Système de vote 2

https://formation.alyra.fr/products/developpeur-blockchain/categories/2149101531/posts/2153206159

Contract de vote pour une petite organisation.

Les électeurs, que l'organisation connaît tous, sont inscrits sur une liste blanche (whitelist) grâce à leur adresse Ethereum. Ils peuvent soumettre de nouvelles propositions lors d'une session d'enregistrement des propositions, et peuvent voter sur les propositions lors de la session de vote.

✔️ Le vote n'est pas secret

✔️ Chaque électeur peut voir les votes des autres

✔️ Le gagnant est déterminé à la majorité simple

✔️ La/les proposition(s) qui obtient le plus de voix l'emporte.

---

## Requirements 

    npm i @openzeppelin/contracts --save

    npm i @openzeppelin/test-helpers --save

## Code Coverage 

https://github.com/sc-forks/solidity-coverage

### Install

    npm install --save-dev solidity-coverage

### `truffle-config.js` : 

    module.exports = {

        networks: { ... },

        plugins: ["solidity-coverage"],
    };

### Run 

    truffle run coverage

## Eth Gas Reporter

https://www.npmjs.com/package/eth-gas-reporter

### Install

    npm i eth-gas-reporter

### `truffle-config.js` : 

    module.exports = {

        networks: { ... },

        mocha: {
            reporter: 'eth-gas-reporter',
            reporterOptions : { 
            gasPrice:1,
            token:'ETH',
            }
        },
    };

### Run 

    truffle test
