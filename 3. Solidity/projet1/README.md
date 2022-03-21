
# Projet - Système de vote 

https://formation.alyra.fr/products/developpeur-blockchain/categories/2149052575/posts/2153025072


Le smart contrat permet d'organiser différents votes les uns après les autres.
Uniquement les propositions gagnantes sont enregistrées d'une session à l'autre.
On garde néanmoins l'historique de vote des voters sur toutes les sessions.


L'administrateur peut lancer une session de vote via la fonction whitelist().

format de l'input : ["address1", "address2", "address3"]


# Workflow - Cas normal

adresse 1: administrateur
adresse 2: registred
adresse 3: registred
adresse 4: registred
adresse 4: unregistred

1. adresse 1 deploie le contrat 

## whitelist

2. adresse 1 whiteliste des adresses 2, 3, 4 => OK                  event VoterRegistered 
                                                                    event WorkflowStatusChange

## Propositions

3. adresse 1 demarre session propositions => OK                     event WorkflowStatusChange
4. adresse 2 fait une proposition => OK                             event ProposalRegistered
5. adresse 3 fait une proposition => OK                             event .
6. adresse 4 fait une proposition => OK                             event .
7. adresse 2 fait une nouvelle proposition => OK                    event ProposalRegistered
8. adresse 1 termine session propositions => OK                     event WorkflowStatusChange

## Votes
                                                                    
9. adresse 1 demarre session votes => OK                            event WorkflowStatusChange
10. adresse 2 vote pour proposition 1 => OK                         event Voted
11. adresse 3 vote pour proposition 1 => OK                         event Voted
12. adresse 4 vote pour proposition 1 => OK                         event Voted
13. adresse 1 termine la session de votes => OK                     event WorkflowStatusChange
14. adresse 1 demande le décompte des votes => OK                   event WorkflowStatusChange
                                                                    
15. tout le monde peut verifier la proposition gagnante => OK       



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
