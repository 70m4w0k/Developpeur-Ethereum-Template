const Reentrancy = artifacts.require("Reentrancy");

module.exports = function (deployer) {
  deployer.deploy(Reentrancy);
};
