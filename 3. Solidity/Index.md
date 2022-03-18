# **Solidity**

## 1. Epargne 

Faire un compte d’épargne sur la blockchain!

On a le droit de transférer au compte de l’argent quand on le souhaite

1. Ajouter un admin au déploiement du contrat.
2. Ajouter la condition suivante : l'admin ne peut récupérer les fonds qu'après 3 mois après la
    première transaction
3. On peut évidemment rajouter de l’argent sur le contrat régulièrement. Faire une fonction
    pour ça, et garder un historique (simple, d’un numero vers une quantité) des dépots dans un
    mapping.
4. Mettre en commentaire les fonctions d’admin, et rajouter onlyOwner

## 2. Deviner c'est Gagner

Faire un "deviner c'est gagné!"

Un administrateur va placer un mot, et un indice sur le mot
Les joueurs vont tenter de découvrir ce mot en faisant un essai

Le jeu doit donc :

1. instancier un owner
2. permettre a l'owner de mettre un mot et un indice
3. les autres joueurs vont avoir un getter sur l'indice
4. ils peuvent proposer un mot, qui sera comparé au mot référence, return un boolean
5. les joueurs seront inscrit dans un mapping qui permet de savoir si il a déjà joué
6. avoir un getter, qui donne si il existe le gagnant.
7. facultatif (necessite un array): faire un reset du jeu pour relancer une instance

## 3. Shop

Ecrire un smart contract qui gère un magasin d'articles (addItem, getItem, setItem).

Un article est défini par une structure de données

    struct Item {
        uint price;
        uint units;
    }

On stocke ces produits dans un mapping

## 4. Shop, la Suite

Ecrire un smart contract qui gère un magasin d'articles (addItem, getItem, setItem).
Un article est défini par une structure de données

    item {
        uint price;
        uint units;
    }

Cette fois ci on les stocke dans un tableau

On rajoute `deleteLastItem()` et `totalItems()`

## 5. Grades

Ecrire un smart contract qui gère un système de notation d'une classe d'étudiants avec addNote, getNote,
setNote. Un élève est défini par une structure de données :

    student {
        uint noteBiology;
        uint noteMath;
        uint noteFr;
    }

Les professeurs adéquats (rentrés en "dur") peuvent rajouter des notes. Chaque élève est stocké de
manière pertinente. On doit pouvoir récupérer:
- la moyenne générale d’un élève
- la moyenne de la classe sur une matière
- la moyenne générale de la classe au global
On doit avoir un getter pour savoir si l’élève valide ou non son année.

## 6. Lycee

On récupère l'exercice précédent et on l'incrémente, le but: en faire un système
complet de notation dans un lycée:

Système de classes définis par un nom (exemple: 2b)
Les professeurs peuvent etre différents d'une classe à l'autre
Les éléves sont stockés par classe.

Indices:
- Vous devrez surement utiliser un double mapping et/ou un tableau dans un mapping
- Modifier les require
Vérifier les visibilités de nos fonctions

## 7. Heritage 1

Faire 3 contrats (en 1 fichier) : 
- un contrat parent, avec une variable et une fonction agissant sur la variable
- un contrat enfant, ayant une fonction capable de retourner la valeur de la variable du contrat parent
- un contrat caller, capable de faire une instance du contrat enfant, et capable de lancer la fonction du contrat parent et de retourner la variable 

## 8. Heritage 2

Un contrat `SimpleStorage` est déployé sur Ropsten à l'adresse : 


Vous allez réaliser un contrat appelant le contrat déployé dans une instance, à travers deux fonctions : `get` et `set`, afin d'intéragir sur le contrat précédent.

Attention, il faut récupérer la signature des fonctions (l'en-tête), recquise par l'ABI

## 9. Enums

En partant de l'exerice Whitelist, ajouter un `Admin`, l'enregistrement dans la WL ne peut passer que par lui.

Utiliser l'énumération suivante et adapter la gestion de la whitelist : 

    enum addressStatus {
        Default, 
        Blacklist, 
        Whitelist
    }

Ajouter un event "Blacklisted" dès qu'un compte est blacklisté.

## 10. ERC20

Créez votre propre token !

En utilisant l'ERC20 d'OpenZeppelin.
Vous devez créer un token, puis l'ajouter sur metamask. 

## 11. Bank

Cet exercice consiste à écrire un smart contract qui permet de simuler le fonctionnement d’une banque. 

Les instructions suivantes peuvent vous aider : 

1. Votre smart contract doit s’appeler “Bank”. 
2. Votre smart contract doit utiliser la dernière version du compilateur.
3. Votre smart contract doit définir un mapping _balances qui détient le solde détenu par un compte.
4. Votre smart contract doit définir une fonction deposit qui permet à son appelant de déposer de l’argent dans son compte. Elle prend comme paramètre un uint _amount.
5. Votre smart contract doit définir une fonction transfer qui permet à son appelant de transférer de l’argent de son propre compte à un autre compte. Elle prend comme paramètre une address _recipient et un uint _amount.
6. Votre smart contract doit définir une fonction balanceOf qui renvoie le solde détenu par un compte. Elle prend comme paramètre une address _address. 


## 12. Random

Comment générer des nombres aléatoires dans Solidity ?
https://medium.com/coinmonks/how-to-generate-random-numbers-on-ethereum-using-vrf-8250839dd9e2

1. Votre smart contract doit s'appeler “Random”. 
2. Votre smart contract doit utiliser la dernière version du compilateur.
3. Votre smart contract doit définir uint appelé nonce de visibilité private, et fixez-le à 0.
4. Votre smart contract doit définir une fonction random qui retourne un nombre aléatoire entre 0 et 100. random doit utiliser la fonction de hachage keccak256. 
5. Enfin, elle doit (en une ligne de code) calculer le typecast uint du hash keccak256 des paramètres suivants : block.timestamp, msg.sender, nonce. 

## 13. Admin

Ecrire un smart contract qui permet de simuler un système d’administration. 

Les instructions suivantes peuvent vous aider : 

1. Votre smart contract doit s'appeler “Admin”. 
2. Votre smart contract doit utiliser la dernière version du compilateur.
3. L’administrateur est celui qui va déployer le smart contract. 
4. L’administrateur est le seul qui a le droit d’autoriser un compte Ethereum à l’aide de la fonction “whitelist”.
5. L’administrateur est le seul qui a le droit de bloquer un compte Ethereum à l’aide de la fonction “blacklist”.
6. Votre smart contract doit définir une fonction isWhitelisted qui retourne un compte whitelisté.
7. Votre smart contract doit définir une fonction isBlacklisted qui retourne un compte blacklisté.
8. Votre smart contract doit définir deux événements “Whitelisted” et “Blacklisted”.
9. L’utilisation du type mapping est exigée. 
10. L’utilisation d’un modifier est exigée. 
11. L’import de la librairie “Ownable” d’OpenZepplin est obligatoire. 