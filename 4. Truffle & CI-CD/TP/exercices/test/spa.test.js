// spa.test.js 
const { BN, ether, expectRevert } = require('../node_modules/@openzeppelin/test-helpers');
const expectEvent = require('../node_modules/@openzeppelin/test-helpers/src/expectEvent');
const { assertion } = require('../node_modules/@openzeppelin/test-helpers/src/expectRevert');
const { expect } = require('chai');
const SPA = artifacts.require('SPA');
contract('SPA', function (accounts) {
    const adopter1 = accounts[0];

    beforeEach(async function () {
        this.SPAInstance = await SPA.new();
    });

    it('should create a new animal', async function () {
        await this.SPAInstance.create("border collie", 100, 7);
        const animal = await this.SPAInstance.animalArray(0);
        expect(animal.race).to.equal("border collie");
        expect(animal.taille).to.be.bignumber.equal(new BN(100));
        expect(animal.age).to.be.bignumber.equal(new BN(7));
    });

    describe('CRUD', async function () {

        beforeEach(async function () {
            await this.SPAInstance.create("border collie", 100, 7);
        });

        it('should return an animal', async function () {
            const animal = await this.SPAInstance.get(0);
            expect(animal.race).to.equal("border collie");
            expect(animal.taille).to.be.bignumber.equal(new BN(100));
            expect(animal.age).to.be.bignumber.equal(new BN(7));
        });

        it('should update an animal', async function () {
            await this.SPAInstance.update(0, "labrador", 50, 13, false);
            const animal = await this.SPAInstance.get(0);
            expect(animal.race).to.equal("labrador");
            expect(animal.taille).to.be.bignumber.equal(new BN(50));
            expect(animal.age).to.be.bignumber.equal(new BN(13));
        });

        it('should delete an animal', async function () {
            await this.SPAInstance.deleter(0);
            const animal = await this.SPAInstance.get(0);
            expect(animal.race).to.equal("");
            expect(animal.taille).to.be.bignumber.equal(new BN(0));
            expect(animal.age).to.be.bignumber.equal(new BN(0));
        });
    });

    describe('Adoption', async function () {

        beforeEach(async function () {
            await this.SPAInstance.create("border collie", 100, 7);
            await this.SPAInstance.create("labrador", 150, 11);
        });

        it('adopter can adopt animal', async function () {
            await this.SPAInstance.adopt(0, {from: adopter1});
            const animal = await this.SPAInstance.appartenance(adopter1);
            expect(animal.race).to.equal("border collie");
            expect(animal.taille).to.be.bignumber.equal(new BN(100));
            expect(animal.age).to.be.bignumber.equal(new BN(7));
            expect(animal.isAdopted).to.equal(false);
        });

        it('adopter cannot adopt already adopted animal', async function () {
            await this.SPAInstance.adopt(0, {from: adopter1});
            await expectRevert(this.SPAInstance.adopt(0, {from: adopter1}), "animal is already adopted");
        });
    });
});