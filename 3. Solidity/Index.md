# **Solidity**
= 
## -- 1. Epargne --

    Faire un compte d’épargne sur la blockchain!

    On a le droit de transférer au compte de l’argent quand on le souhaite

    1 - Ajouter un admin au déploiement du contrat.
    2 - Ajouter la condition suivante : l'admin ne peut récupérer les fonds qu'après 3 mois après la
        première transaction
    3 - On peut évidemment rajouter de l’argent sur le contrat régulièrement. Faire une fonction
        pour ça, et garder un historique (simple, d’un numero vers une quantité) des dépots dans un
        mapping.
    4 - Mettre en commentaire les fonctions d’admin, et rajouter onlyOwner

- 

## -- 2. Deviner c'est Gagner --

    Faire un "deviner c'est gagné!"

    Un administrateur va placer un mot, et un indice sur le mot
    Les joueurs vont tenter de découvrir ce mot en faisant un essai

    Le jeu doit donc :

    1 - instancier un owner
    2 - permettre a l'owner de mettre un mot et un indice
    3 - les autres joueurs vont avoir un getter sur l'indice
    4 - ils peuvent proposer un mot, qui sera comparé au mot référence, return un boolean
    5 - les joueurs seront inscrit dans un mapping qui permet de savoir si il a déjà joué
    6 - avoir un getter, qui donne si il existe le gagnant.
    7 - facultatif (necessite un array): faire un reset du jeu pour relancer une instance
- 

## -- 3. Shop --

    Ecrire un smart contract qui gère un magasin d'articles (addItem, getItem, setItem).

    Un article est défini par une structure de données
    
    ``struct Item {
        uint price;
        uint units;
    }``

    On stocke ces produits dans un mapping
- 

## -- 4. Shop, la Suite --

    Ecrire un smart contract qui gère un magasin d'articles (addItem, getItem, setItem).
    Un article est défini par une structure de données

    ``item {
        uint price;
        uint units;
    }``

    Cette fois ci on les stocke dans un tableau

    On rajoute `deleteLastItem()` et `totalItems()`
- 

## -- 5. Grades --

    Ecrire un smart contract qui gère un système de notation d'une classe d'étudiants avec addNote, getNote,
    setNote. Un élève est défini par une structure de données :

    ``student {
        uint noteBiology;
        uint noteMath;
        uint noteFr;
    }``

    Les professeurs adéquats (rentrés en "dur") peuvent rajouter des notes. Chaque élève est stocké de
    manière pertinente. On doit pouvoir récupérer:
    - la moyenne générale d’un élève
    - la moyenne de la classe sur une matière
    - la moyenne générale de la classe au global
    On doit avoir un getter pour savoir si l’élève valide ou non son année.
- 

## -- 6. Lycee --

    On récupère l'exercice précédent et on l'incrémente, le but: en faire un système
    complet de notation dans un lycée:

    Système de classes définis par un nom (exemple: 2b)
    Les professeurs peuvent etre différents d'une classe à l'autre
    Les éléves sont stockés par classe.

    Indices:
    - Vous devrez surement utiliser un double mapping et/ou un tableau dans un mapping
    - Modifier les require
    Vérifier les visibilités de nos fonctions
- 




