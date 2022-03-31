// students.test.js 
const { BN, ether, expectRevert } = require('../node_modules/@openzeppelin/test-helpers');
const expectEvent = require('../node_modules/@openzeppelin/test-helpers/src/expectEvent');
const { assertion } = require('../node_modules/@openzeppelin/test-helpers/src/expectRevert');
const { expect } = require('chai');
const Students = artifacts.require('Students');
contract('STUDENTS', function (accounts) {
    const alice = accounts[0];
    const bob = accounts[1];
    const charlie = accounts[2];

    let StudentsInstance;

    describe('test setter', async function () {

        before(async function () {
            StudentsInstance = await Students.new();
        });

        it("should store name student in mapping", async () => {
            await StudentsInstance.set(alice,"alice", 12);
            const storedData = await StudentsInstance.EtudiantsMap(alice);
            expect(storedData.name).to.equal("alice");
        });

        it("should store note student in mapping", async () => {
            await StudentsInstance.set(alice,"alice", 12);
            const storedData = await StudentsInstance.EtudiantsMap(alice);
            expect(new BN(storedData.note)).to.be.bignumber.equal(new BN(12));
        });

        it("should store name student in array", async () => {
            await StudentsInstance.set(alice,"alice", 12);
            const storedData = await StudentsInstance.EtudiantsArray(0);
            expect(storedData.name).to.equal("alice");
        });

        it("should store note student in array", async () => {
            await StudentsInstance.set(alice,"alice", 12);
            const storedData = await StudentsInstance.EtudiantsArray(0);
            expect(new BN(storedData.note)).to.be.bignumber.equal(new BN(12));
        });
        
    });

    describe('test getter', async function () {

        before(async function () {
            StudentsInstance = await Students.new();
            await StudentsInstance.set(alice,"alice", 12);
        });

        it("should return student name from mapping", async () => {
            const storedData = await StudentsInstance.getMap(alice);
            expect(storedData.name).to.equal("alice");
        });

        it("should return student note from mapping", async () => {
            const storedData = await StudentsInstance.getMap(alice);
            expect(new BN(storedData.note)).to.be.bignumber.equal(new BN(12));
        });

        it("should return student name from array", async () => {
            const storedData = await StudentsInstance.getArray("alice");
            expect(storedData.name).to.equal("alice");
        });

        it("should return student note from array", async () => {
            const storedData = await StudentsInstance.getArray("alice");
            expect(new BN(storedData.note)).to.be.bignumber.equal(new BN(12));
        });
        
    });

    describe('test deleter', async function () {

        before(async function () {
            StudentsInstance = await Students.new();
            await StudentsInstance.set(alice,"alice", 12);
            await StudentsInstance.set(bob,"bob", 18);
            await StudentsInstance.set(charlie,"charlie", 8);
            await StudentsInstance.deleter(charlie);
        });

        it("should delete name in mapping", async () => {
            const storedData = await StudentsInstance.getMap(charlie);
            expect(storedData.name).to.equal("");
        });

        it("should delete note in mapping", async () => {
            const storedData = await StudentsInstance.getMap(charlie);
            expect(new BN(storedData.note)).to.be.bignumber.equal(new BN(0));
        });

        it("should delete name in array", async () => {
            const storedData = await StudentsInstance.getArray("charlie");
            expect(storedData.name).to.equal("");
        });

        it("should delete note in array", async () => {
            const storedData = await StudentsInstance.getArray("charlie");
            expect(new BN(storedData.note)).to.be.bignumber.equal(new BN(0));
        });
        
    });

});
