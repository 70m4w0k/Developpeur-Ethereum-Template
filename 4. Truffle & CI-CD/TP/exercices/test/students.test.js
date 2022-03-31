// students.test.js 
const { BN, ether, expectRevert } = require('../node_modules/@openzeppelin/test-helpers');
const expectEvent = require('../node_modules/@openzeppelin/test-helpers/src/expectEvent');
const { assertion } = require('../node_modules/@openzeppelin/test-helpers/src/expectRevert');
const { expect } = require('chai');
const Students = artifacts.require('Students');
contract('STUDENTS', function (accounts) {
    const student1 = accounts[0];
    // const student2 = accounts[1];
    // const student3 = accounts[2];
    
    beforeEach(async function () {
        this.StudentsInstance = await Students.new();
    });

    it('should create a new etudiant', async function () {
        await this.StudentsInstance.set(student1, "michel", 13);
        const etudiant = await this.StudentsInstance.EtudiantsMap(student1);
        expect(etudiant.name).to.equal("michel");
        expect(etudiant.note).to.be.bignumber.equal(new BN(13));
    });

    describe('GET', async function () {

        beforeEach(async function () {
            await this.StudentsInstance.set(student1, "michel", 13);
        });

        it('should return etudiant from array', async function () {
            const etudiant = await this.StudentsInstance.getArray("michel");
            expect(etudiant.name).to.equal("michel");
            expect(etudiant.note).to.be.bignumber.equal(new BN(13));
        });

        it('should return etudiant from mapping', async function () {
            const etudiant = await this.StudentsInstance.getMap(student1);
            expect(etudiant.name).to.equal("michel");
            expect(etudiant.note).to.be.bignumber.equal(new BN(13));
        });
        
        it('should return nothing : name doesnt exist', async function () {
            const etudiant = await this.StudentsInstance.getArray("paul");
            expect(etudiant.name).to.equal("");
            expect(etudiant.note).to.be.bignumber.equal(new BN(0));
        });
        
        it('should delete a etudiant from map', async function () {
            await this.StudentsInstance.deleter(student1);
            const etudiant = await this.StudentsInstance.EtudiantsMap(student1);
            expect(etudiant.name).to.equal("");
            expect(etudiant.note).to.be.bignumber.equal(new BN(0));
        });

        it('should delete a etudiant from array', async function () {
            await this.StudentsInstance.deleter(student1);
            const etudiant = await this.StudentsInstance.EtudiantsArray(0);
            expect(etudiant.name).to.equal("");
            expect(etudiant.note).to.be.bignumber.equal(new BN(0));
        });
    });
});
