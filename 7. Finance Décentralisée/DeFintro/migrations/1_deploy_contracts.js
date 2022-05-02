// 1_deploy_contracts.js
const Dai = artifacts.require("Dai");
const MyDeFiProject = artifacts.require("MyDeFiProject");
 
module.exports = async function(deployer, _network, accounts) {
	await deployer.deploy(MyDeFiProject);
	console.log(MyDeFiProject.address);
	// const myDeFiProject = await MyDeFiProject.deployed();
	// await myDeFiProject.foo(accounts[1], 10);
};