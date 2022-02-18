// let BN = web3.utils.BN;
let Rentals = artifacts.require("Rentals");
let { catchRevert } = require("./exceptionsHelpers.js");

const {
  units: UnitStruct,
  isDefinedUnit,
  isPayableUnit,
  isTypeUnit,
} = require("./leaseHelpers/ast-unit-helper");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Rentals", function (accounts) {
  // it("should assert true", async function () {
  //   await RegisterProperty.deployed();
  //   return assert.isTrue(true);
  const [_owner, user1, user2] = accounts;
  const emptyAddress = "0x0000000000000000000000000000000000000000";

  // parameters for UnitOne
  const unitOne = "1";
  const location1 = "Apartment 5A, 129 W. 81st St., New York, N.Y.";
  // const bedrooms1 = "2";
  // const bathrooms1 = "2";
  const rent1 = web3.utils.toWei("1", "ether");
  const term1 = "12";
  const deposit1 = web3.utils.toWei("2", "ether");
  const startDate1 = "December 1, 2021";

  // parameters for UnitTwo
  const unitTwo = "2";
  const location2 = "508 Saint Cloud Road, Bel Air, CA";
  // const bedrooms2 = "5";
  // const bathrooms2 = "4";
  const rent2 = web3.utils.toWei("0.5", "ether");
  const deposit2 = web3.utils.toWei("1", "ether");
  const term2 = "12";
  const startDate2 = "December 1, 2021";

  let instance;

  beforeEach(async () => {
    instance = await Rentals.new();
  });

  describe("Contract", () => {
    it("should have an owner", async () => {
      assert.equal(
        typeof instance.owner,
        "function",
        "the contract has no owner"
      );
    });
  });

  describe("Unit State", () => {
    let enumState;

    before(() => {
      enumState = Rentals.enums.State;
      assert(enumState, "The contract should define an Enum called State");
    });

    it("should define `ForRent`", () => {
      assert(
        enumState.hasOwnProperty("ForRent"),
        "The enum does not have a `ForRent` value"
      );
    });

    it("should define `Occupied`", () => {
      assert(
        enumState.hasOwnProperty("Occupied"),
        "The enum does not have a `Occupied` value"
      );
    });
  });

  describe("Unit use cases", () => {
    it("should add a new unit", async () => {
      await instance.addUnit(location1, rent1, deposit1, term1, startDate1, {
        from: _owner,
      });

      const result = await instance.fetchUnit.call(1);

      assert.equal(
        result[1].toString(10),
        location1,
        "the location of the last added unit does not match the expected value"
      );
      assert.equal(
        result[2].toString(10),
        Rentals.State.ForRent,
        'the state of the unit should be "For Rent"'
      );
      assert.equal(
        result[7],
        _owner,
        "the address adding the unit should be listed as the owner"
      );
      assert.equal(
        result[8],
        emptyAddress,
        "the tenant address should be set to 0 when a unit is added"
      );
    });

    it("should revert when someone that is not the owner tries to add Unit", async () => {
      await catchRevert(
        instance.addUnit(location1, rent1, deposit1, term1, startDate1, {
          from: user2,
        })
      );
    });

    it("should emit a LogUnitAdded & LogForRent event when a unit is listed", async () => {
      let eventEmitted = false;
      const tx = await instance.addUnit(
        location1,
        rent1,
        deposit1,
        term1,
        startDate1,
        {
          from: _owner,
        }
      );

      if (tx.logs[0].event == "LogUnitAdded") {
        eventEmitted = true;
      }

      assert.equal(
        eventEmitted,
        true,
        "adding a unit should emit a UnitListed event"
      );
      if (tx.logs[1].event == "LogForRent") {
        eventEmitted = true;
      }

      assert.equal(
        eventEmitted,
        true,
        "adding a unit should emit a ForRent event"
      );
    });

    it("should allow the owner to terminate lease & relist unit", async () => {
      await instance.addUnit(location1, rent1, deposit1, term1, startDate1, {
        from: _owner,
      });
      await instance.rentUnit(unitOne, {
        from: _owner,
        value: web3.utils.toWei("2"),
      });
      await instance.terminateLease(unitOne, {
        from: _owner,
      });

      const result = await instance.fetchUnit.call(1);

      assert.equal(
        result[0].toString(10),
        unitOne,
        "the unitNumber of the last terminated lease does not match the expected unitNumber"
      );

      assert.equal(
        result[2].toString(10),
        Rentals.State.ForRent,
        'the state of the unit should be "For Rent"'
      );

      assert.equal(
        result[8],
        emptyAddress,
        "the tenant address should be set to 0 when lease is terminated and relisted"
      );

      assert.equal(
        result[3].toString(10),
        rent1,
        "the rent of the re-listed unit does not match the expected rent"
      );

      assert.equal(
        result[5].toString(10),
        term1,
        "the term of the re-listed unit does not match the expected term"
      );
    });
  });

  describe("Renting a unit", () => {
    beforeEach(async () => {
      await instance.addUnit(location1, rent1, deposit1, term1, startDate1, {
        from: _owner,
      });

      await instance.addUnit(location2, rent2, deposit2, term2, startDate2, {
        from: _owner,
      });
    });

    it("should fail if unit is already occupied", async () => {
      await instance.rentUnit(unitOne, {
        from: user1,
        value: web3.utils.toWei("2"),
      });
      await catchRevert(
        instance.rentUnit(unitOne, {
          from: user2,
          value: web3.utils.toWei("2"),
        })
      );
    });

    it("should fail if tenant did not deposit 2 months of rent", async () => {
      await catchRevert(
        instance.rentUnit(unitOne, {
          from: user1,
          value: web3.utils.toWei("0"),
        })
      );
    });

    it("should send tenant deposit to owner address", async () => {
      const balanceBefore = await web3.eth.getBalance(_owner);
      await instance.rentUnit(unitOne, {
        from: user1,
        value: web3.utils.toWei("2", "ether"),
      });
      const balanceAfter = await web3.eth.getBalance(_owner);
      const depositAmount = balanceAfter - balanceBefore;

      const result = await instance.fetchUnit.call(1);

      assert.equal(result[4], depositAmount, 'deposit was not sent to owner"');
    });

    it("should emit LogTenantAdded & LogOccupied event when a unit is rented", async () => {
      let eventEmitted = false;
      const tx = await instance.rentUnit(unitTwo, {
        from: _owner,
        value: web3.utils.toWei("1"),
      });

      if (tx.logs[0].event == "LogUnitRented") {
        eventEmitted = true;
      }

      assert.equal(
        eventEmitted,
        true,
        "renting a unit should emit a Tenant Added to unit event"
      );

      if (tx.logs[1].event == "LogOccupied") {
        eventEmitted = true;
      } else {
        eventEmitted = false;
      }

      assert.equal(
        eventEmitted,
        true,
        "renting a unit should emit a unit Occupied event"
      );
    });
  });
});
