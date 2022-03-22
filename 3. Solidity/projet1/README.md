
# Projet - Système de vote 

https://formation.alyra.fr/products/developpeur-blockchain/categories/2149052575/posts/2153025072


Le smart contrat permet d'organiser différents votes les uns après les autres.

La `struct Proposal` contient `sessionId` qui permet de différencier les différentes sessions de vote.

Uniquement les propositions gagnantes sont enregistrées d'une session à l'autre.

On garde néanmoins l'historique de vote des voters sur toutes les sessions.


Pour lancer une nouvelle session de vote, l'administrateur doit enregistrer les addresses participantes via la fonction `whitelist`.

format de l'input : `["address1", "address2", "address3"]`


# Workflow - Cas normal

    adresse 1: administrateur

    adresse 2: registred

    adresse 3: registred

    adresse 4: registred

    adresse 4: unregistred


1. adresse 1 deploie le contrat 

## whitelist

2. adresse 1 whiteliste des adresses 2, 3, 4 => OK                  

## propositions

3. adresse 1 demarre session propositions => OK                     
4. adresse 2 fait une proposition => OK                             
5. adresse 3 fait une proposition => OK                             
6. adresse 4 fait une proposition => OK                             
7. adresse 2 fait une nouvelle proposition => OK                    
8. adresse 1 termine session propositions => OK                

## votes
                                                                    
9. adresse 1 demarre session votes => OK                         
10. adresse 2 vote pour proposition 1 => OK                   
11. adresse 3 vote pour proposition 1 => OK                      
12. adresse 4 vote pour proposition 1 => OK                      
13. adresse 1 termine la session de votes => OK                  
14. adresse 1 demande le décompte des votes => OK                 
                                                                    
15. tout le monde peut verifier la proposition gagnante => OK       