// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract SPA {

    struct Animal {
        string race;
        uint taille;
        uint age;
        bool isAdopted;
    }

    Animal[] public animalArray;

    mapping(address => Animal) public appartenance;

    // CRUD animaux

    function create(string memory _race, uint _taille, uint _age) external {
        Animal memory animal;
        animal.race = _race;
        animal.taille = _taille;
        animal.age = _age;
        animal.isAdopted = false;
        animalArray.push(animal);
    }

    function get(uint _id) public view returns(Animal memory) {
        return animalArray[_id];
    }

    function update(uint _id, string memory _race, uint _taille, uint _age, bool _isAdopted) external {
        animalArray[_id].race = _race;
        animalArray[_id].taille = _taille;
        animalArray[_id].age = _age;
        animalArray[_id].isAdopted = _isAdopted;
    }   

    function deleter(uint _id) public {
        delete animalArray[_id];
    }

    // ADOPTION

    function adopt(uint _id) public {
        require(animalArray[_id].isAdopted == false, "animal is already adopted");
        appartenance[msg.sender] = get(_id);
        animalArray[_id].isAdopted = true;
    }



}