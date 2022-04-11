# Bonnes pratiques - Solidity

## 1. Utiliser les bonnes méthodes de tests

### if

Doit être utlisé pour les conditions un peu complexes

    if (msg.sender != owner) { revert(); }

### require

Doit être utilisé pour s'assurer que les conditions (inputs ou variables d'état) soient valides ou pour valider des valeurs de retour des appels à des contrats externes. 

    require (msg.sender == owner);

### assert

Ne doit être utilisé que pour tester les erreurs internes et vérifier les changements

    assert (msg.sender == owner);



https://medium.com/blockchannel/the-use-of-revert-assert-and-require-in-solidity-and-the-new-revert-opcode-in-the-evm-1a3a7990e06e

## 2. Attention à l'arrondi avec division par nombre entier

### pas bien
    uint x = 5 / 2; // x = 2

L'utilisation d'un multiplicateur permet d'éviter l'arrondi à l'entier inférieur, ce multiplicateur doit être pris
en compte lorsque vous travaillerez avec x à l'avenir :

### bien
    uint multiplier = 10;
    uint x = (5 * multiplier) / 2;


## 3. Utiliser les modifiers uniquement pour les contrôles

Le code à l'intérieur d'un modifier est exécuté avant le corps de la fonction, donc tout
changement d'état ou appel externe violera le modèle Checks-Effects-Interactions.

    contract Registry {
        address owner;
        function isVoter(address _addr) external returns(bool) {
            ...
        }
    }

    contract Election {
        Registry registry;
        modifier isEligible(address _addr) {
            require(registry.isVoter(_addr));
            _;
        }

        function vote() isEligible(msg.sender) public {
            ...
        }
    }

Dans ce cas, le contrat de Registry peut fauire une attaque de reentrancy en appelant `Election.vote()` dans `isVoter()`


## 4. la fonction fallback

La fonction `fallback()` est appelée pour les transferts d'ether simples (avec données) et aussi lorsqu'aucune autre fonction correspond.

Il faut vérifier que les données sont vides si la fonction fallback est destinée à
être utilisée uniquement pour l'enregistrement des Ethers reçus.

Sinon, les appelants n'apercevront pas si votre contrat est mal utilisé et si des
fonctions qui n'existent pas sont appelées.

### pas bien

    fallback() payable { balances[msg.sender] += msg.value; }

### bien

    fallback() payable { 
        require(msg.data.length == 0);
        emit LogDepositReceived(msg.sender);
    }

https://blog.soliditylang.org/2020/03/26/fallback-receive-split/



## 5. Verrouiller pragmas à une version précise du compilateur 

### pas bien 

    pragma solidity ^0.8.0;

### bien

    pragma solidity 0.8.13;

Cela permet d'éviter d'utiliser une version du compilateur pas encore éprouvée.

## 6. Utiliser des events pour surveiller l'activité


## 7. Ne pas utiliser tx.origin pour une autorisation

Ne pas utiliser `tx.origin` pour une autorisation. Va être supprimé de solidity.

https://ethereum.stackexchange.com/questions/196/how-do-i-make-my-dapp-serenity-proof

## 8. Utiliser le type d'interface au lieu de l'adresse

Lorsqu'une fonction prend une adresse de contrat comme argument, il est préférable de passer une interface ou un type de contrat plutôt qu'une adresse brute. Si la fonction est appelée ailleurs dans le code source, le compilateur fournira des garanties de sécurité supplémentaires.

    contract Validator {
        function validate(uint) external returns(bool);
    }

### bien

    contract TypeSafeAuction {
        function validateBet(Validator _validator, uint _value) internal returns(bool) {
            bool valid = _validator.validate(_value);
            return valid;
        }
    }

### pas bien

    contract TypeUnsafeAuction {
        function validateBet(address _addr, uint _value) internal returns(bool) {
            Validator _validator = Validator(_addr);
            bool valid = _validator.validate(_value);
            return valid;
        }
    }

Si `validateBet()` du contrat TypeSafeAuction est appelée avec un argument adresse, ou un type de contrat autre que Validator, le compilateur lancera une erreur du style : 

    contract NonValidator{}
    contract Auction is TypeSafeAuction {
        NonValidator nonValidator;

        function bet(uint _value) {
            bool valid = validateBet(nonValidator, _value);
        }
    }

---

    TypeError: Invalid type for argument in function call.
    Invalid implicit conversion from contract NonValidator to Validator requested.
---

## 9. Optimisation gas : regroupement des variables ou variable packing

Les smart contrats solidity comportent des emplacements contigus de 32 octets (256 bits) utilisés pour le stockage. 

Lorsque nous arrangeons les variables de manière à ce que plusieurs d'entre elles tiennent dans un seul emplacement, on parle de “variable packing”.

Comme chaque emplacement de stockage coûte du gas, le regroupement des variables nous aide à optimiser notre utilisation du gas en réduisant le nombre d'emplacements requis par notre contrat.

### pas bien

    uint128 a;
    uint256 b;
    uint128 c;
     
    ----------------------------------------
    |     a      |     b      |     c      |
    ----------------------------------------
    |  256 bits  |  256 bits  |  256 bits  |
    ----------------------------------------
    

### bien 

    uint128 a;
    uint128 c;
    uint256 b;

    ---------------------------
    |   a  |  c  |     b      |
    ---------------------------
    |  256 bits  |  256 bits  |
    ---------------------------

## 10. Optimisation gas : regroupement des variables dans les structs

### Pas de variable packing possible

    struct Personne {
        string nom;
        uint age;
        address adresse;
    }

### Variable packing impossible entre 2 uint256

    struct Personne {
        string nom;
        uint age;
        uint poids;
        address adresse;
    }

### Variables non packées (mais packables)

    struct Personne {
        string nom;
        uint8 age;
        address adresse;
        uint8 poids;
    }


### Variables packées 

    struct Personne {
        string nom;
        uint8 age;
        uint8 poids;
        address adresse;
    }

## 11. Pas besoin d'initialiser les variables avec des valeurs par défaut 

## 12. Utiliser des messages d'erreur courts

## 13. Eviter les contrôles répétitifs

        require(balance >= amount);
        balance = balance.sub(amount); // redundancy -> SafeMath

## 14. Utiliser les échanges des valeurs en 1 seule ligne

    (balance, amount) = (amount, balance);

## 15. Appeler les fonctions `internal` est moins cher

Lors d'un appel d'une fonction publique, tous les paramètrres sont à nouveau copiés en mémoire et transmis à cette fonction.

En revanche, lors de l'appel d'une fonction avec une autre visibilité, les références de ces paramètres sont transmises et elles ne sont pas recopiées en mémoire.

## 16. Mapping vs Array

La plupart du temps, il sera préférable d'utiliser un mapping plutôt qu'un tableau en raison de son fonctionnement moins coûteux.

## 17. Fixe vs Dynamique

Les variables de taille fixe sont toujours moins chères que les variables dynamiques.

## 18. Suppression

Ethereum nous donne un remboursement de gas lorsque nous supprimons des variables.
- La suppression d'une variable permet de rembourser 15 000 gas jusqu'à un maximum de la moitié du coût du gas de la transaction.

- Supprimer avec le mot-clé `delete` équivaut à attribuer la valeur initiale pour le type de données, comme 0 pour les nombres entiers.


## 19. Stockage de données dans les évènements

Les données qui n'ont pas besoin d'être accessibles sur la blockchain peuvent être stockées dans les événements pour économiser du gas.

**Attention**

>*Bien que cette technique puisse fonctionner, elle n'est pas strictement recommandée - les événements ne sont pas destinés au stockage de données. Si les données dont nous avons besoin sont stockées dans un événement émis il y a longtemps, leur récupération peut prendre du temps en raison du nombre de blocs à rechercher.*

## 20. Choisir entre le stockage et la mémoire (storage vs memory)

Il existe deux possibilités pour stocker des variables dans Solidity, à savoir storage (stockage) et memory (mémoire):

- Les variables « storage » sont stockées définitivement dans la blockchain.

- Les variables « memory » sont temporaires et effacées entre les appels externes de fonction.

Un moyen courant de réduire le nombre d'opérations de stockage consiste à manipuler une variable de mémoire locale avant de l'affecter à une variable de stockage.

    uint256 return = 5;
    uint256 totalReturn;
    function updateTotalReturn(uint256 timesteps) external {
        uint256 r = totalReturn || 1;
        for (uint256 i = 0; i < timesteps; i++) {
            r = r * return;
        }

        totalReturn = r;
    }







