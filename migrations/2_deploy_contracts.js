const Rentals = artifacts.require("Rentals");

module.exports = function (deployer) {
  deployer.deploy(Rentals);
};
