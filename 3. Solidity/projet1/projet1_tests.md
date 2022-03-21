adresse 1: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 owner
adresse 2: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2 registred
adresse 3: 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db registred
adresse 4: 0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB registred
adresse 5: 0x617F2E2fD72FD9D5503197092aC168c91465E7f2 unregistred

                 id            description             

proposition 1  |  0  |  pour la retraite à 60 ans  |
proposition 2  |  1  |  pour la retraite à 70 ans  |
proposition 3  |  2  |  pour la retraite à 90 ans  |
proposition 4  |  3  |  pour plus de retraite      |

OK - L'administrateur du vote enregistre une liste blanche d'électeurs identifiés par leur adresse Ethereum.

OK - L'administrateur du vote commence la session d'enregistrement de la proposition.

OK - Les électeurs inscrits sont autorisés à enregistrer leurs propositions pendant que la session d'enregistrement est active.

OK - L'administrateur de vote met fin à la session d'enregistrement des propositions.

OK - L'administrateur du vote commence la session de vote.

OK - Les électeurs inscrits votent pour leurs propositions préférées.

OK - L'administrateur du vote met fin à la session de vote.

OK - L'administrateur du vote comptabilise les votes.

OK - Tout le monde peut vérifier les derniers détails de la proposition gagnante.

OK - Votre smart contract doit s’appeler “Voting”. 

OK - Votre smart contract doit utiliser la dernière version du compilateur.

OK - L’administrateur est celui qui va déployer le smart contract. 

OK - Votre smart contract doit définir les structures de données suivantes : 
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

OK - Votre smart contract doit définir une énumération qui gère les différents états d’un vote
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

OK - Votre smart contract doit définir un uint winningProposalId qui représente l’id du gagnant ou une fonction getWinner qui retourne le gagnant.

OK - Votre smart contract doit importer le smart contract la librairie “Ownable” d’OpenZepplin.

OK - Votre smart contract doit définir les événements suivants : 
    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

OK - il faut faire en sorte que l'on puisse voir pour quelle proposal a voté un voter

OK - cas d'égalité n'est pas à gérer en effet, si vous le faites bien c'est benefique

OK - les details que tu souhaites, de manière logique ça peut etre la proposal comme son vote count

OK - tu peux ajouter ce que tu veux tant que ce qui est donné reste tel quel

OK - au choix, tu peux etre verbeux comme au contraire etre tres concis et avoir un message d'erreur commun, fais ce qui te semble le plus adapté



1. adresse 1 deploie le contrat 

## Tests whitelist

2. adresse 1 whiteliste des adresses 2, 3, 4 => OK
3. adresse 1 déliste l'adresse 2 => OK
4. adresse 2 whiteliste addresse 2 => NOK : pas owner
5. adresse 1 whiteliste adresse 2 => OK

## Tests Propositions

6. adresse 1 demarre session propositions => OK
7. adresse 1 demarre session propositions => NOK : session en cours
8. adresse 1 termine session propositions => OK
9. adresse 1 demarre une session de votes => NOK : pas de propositions
10. adresse 1 demarre session propositions => OK
11. adresse 2 fait une proposition => OK
12. adresse 3 fait une proposition => OK
13. adresse 4 fait une proposition => OK
14. adresse 2 fait une nouvelle proposition => OK
15. adresse 5 fait une nouvelle proposition => NOK : non enregistré
16. adresse 1 termine session propositions => OK

## Tests Votes

17. adresse 1 demarre session votes => OK
18. adresse 2 vote pour proposition 1 => OK
19. adresse 2 vote pour proposition 2 => NOK : deja vote
20. adresse 3 vote pour proposition 1 => OK
21. adresse 4 vote pour proposition 1 => OK
22. adresse 5 vote pour proposition 1 => NOK : non enregistré
23. adresse 1 termine la session de votes => OK

24. adresse 1 termine la session de votes => OK
25. adresse 1 demande le décompte des votes => OK

26. tout le monde peut verifier la proposition gagnante => OK


# Cas normal

1. adresse 1 deploie le contrat 

## whitelist

2. adresse 1 whiteliste des adresses 2, 3, 4 => OK

## Propositions

6. adresse 1 demarre session propositions => OK
7. adresse 2 fait une proposition => OK
8. adresse 3 fait une proposition => OK
9. adresse 4 fait une proposition => OK
10. adresse 2 fait une nouvelle proposition => OK
11. adresse 1 termine session propositions => OK

## Votes

12. adresse 1 demarre session votes => OK
13. adresse 2 vote pour proposition 1 => OK
14. adresse 3 vote pour proposition 1 => OK
15. adresse 4 vote pour proposition 1 => OK
16. adresse 1 termine la session de votes => OK

17. adresse 1 termine la session de votes => OK
18. adresse 1 demande le décompte des votes => OK

19. tout le monde peut verifier la proposition gagnante => OK

# Cas unregistred

## whitelist

2. adresse 1 whiteliste des adresses 2, 3, 4 => OK

## Propositions

10b. adresse 5 fait une nouvelle proposition => NOK : non enregistré

## Votes

15b. adresse 5 vote pour proposition 1 => NOK : non enregistré


# Cas pas de proposition

## whitelist

## Propositions

## Votes

19. adresse 2 vote pour proposition 2 => NOK : pas de proposition
