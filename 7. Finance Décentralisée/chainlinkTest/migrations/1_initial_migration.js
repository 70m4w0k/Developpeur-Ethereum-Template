const Chainlink = artifacts.require("Chainlink");

var id = 3552;
module.exports = function (deployer) {
  deployer.deploy(Chainlink, id);
};
