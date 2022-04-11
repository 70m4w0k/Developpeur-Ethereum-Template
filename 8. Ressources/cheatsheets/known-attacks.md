# Known Attacks - Solidity

## Self Destruct

Un attaquant peut envoyer de force de l'Ether sur n'importe quel compte et cela ne peut être empêché (pas même avec une fonction de fallback qui fait un revert()).

L'attaquant peut le faire en créant un contrat, en le finançant avec 1 wei, et en invoquant `selfdestruct(victimAddress)`. Aucun code n'est invoqué dans victimAddress, donc on ne peut pas l'empêcher.

De plus, comme les adresses de contrat peuvent être calculées à l'avance, l'Ether peut être envoyé à une adresse avant que le contrat ne soit déployé.

## Front Running

Le front running se décline en de multiples cas. Lorsque l’issue est favorable à un parti, il peut être préférable de prendre de vitesse ce parti et prendre sa place. N’oubliez pas que les transactions peuvent être jouées avant d’être inscrites sur la blockchain (comme une fonction view) et ainsi, on peut en connaître le résultat !


>Voici un témoignage d’un cas réel sur ethereum : https://www.paradigm.xyz/2020/08/ethereum-is-a-dark-forest

## Oracle manipulation

Les oracles sont en constants développement depuis quelques années. En effet, ils apportent des informations cruciales sur la BC : des informations off-chain. Ces informations sont à l’origine de décision, de logique de smart contracts. Leur manipulation est alors un risque interne aux smart contracts fort et difficilement décelable.

Il faut alors porter une attention particulière à l’utilisation d’oracle. Cette utilisation peut être un risque fort sur certains projets se basant beaucoup sur ces informations off-chain. Il faut ainsi penser à optimiser l’achtitecture du projet/code en minimisant l’impact des oracles.

## Timestamp Dependance

Les mineurs, qui vont inclure les transactions dans les blocks sur Ethereum, doivent avoir un nœud globalement synchronisé avec les autres. Si les spécifications techniques d’Ethereum considèrent qu’il faut juste que le block miné ait un horodatage dans le futur du block précédent, les spécifications techniques des clients Ethereum sont souvent bien différentes.

Pour GEth par exemple, le timestamp inscrit par le nœud doit être maximum de 15 secondes dans le futur par rapport au temps de référence. Ce qui parait être une contrainte est en réalité une grande souplesse pour les mineurs qui peuvent donc faire jouer sur 15 secondes le block.timestamp d’un contrat exécuté.

- l’utilisation d’un random créé on-chain via l’utilisation de `block.timestamp` est complètement caduque: un mineur peut jouer sur les 15 secondes de battement pour tester la valeur de sortie de votre fonction aléatoire et ainsi la rendre plus du tout aléatoire. On utilisera plutôt le random d'un oracle (attention à l’oracle manipulation).
 
 - De manière générale, si une fonctionnalité de votre smart contract dépend d’une date, vérifiez que vous n’êtes pas à 15 secondes près;

- Enfin, la gestion du temps n’est pas parfaite. Certains essais ont pu être faits sur le block.number pour tenter une mesure du temps (en fonction de la durée moyenne de minage d’un block), mais en réalité, block.timestamp reste quand même plus fiable.

## Griefing

“Qui cause de la douleur” si l’on voulait traduire le sens. Le but de cette attaque n’est pas de gagner, mais de gêner un contrat (ce qui peut être gros).

Le concept est décrit de manière un peu complexe et datée, nous préférons revenir dessus.

- Nous avons deux contrats, un contrat relay.sol, un contrat cible.sol. Relay.sol fait appel dans une fonction A à une fonction B de cible.sol.

- La fonction A fait des computations avant de faire le call à cible. La fonction B nécessite du gas pour s’exécuter.

- Un Call peut s’exécuter et ne pas se finir s'il manque de gas. Cela ne fera pas revert la fonction faisant le call.

- Ainsi, en envoyant assez de gas pour exécuter A mais pas assez pour B, un attaquant peut faire se réaliser les computations de A, sans agir sur Cible.sol.

- Et ainsi, dans certains cadres, il peut, pour un cout pas forcément excessif, remplir les stockages de relay.sol, et donc gêner le système.

Ce type de contrat relay est utilisé notamment dans le cadre de wallet multisign. Ne pas pouvoir finir les transactions que l’on souhaite réaliser peut être très dérangeant.

