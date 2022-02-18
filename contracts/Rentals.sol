// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title A decentralized real estate app
/// @author MBowey
/// @notice Landlords can use this contract to lease rental units 
/// @dev All function calls are currently implemented without side effects


import "@openzeppelin/contracts/access/Ownable.sol";

contract Rentals is Ownable {

  /// @notice Emitted when a new unit is added to the contract
  uint public unitCount = 1; 


  struct Unit {
    uint unitNumber;
    string unitAddress;
    State state;
    uint rent; 
    uint term;
    string startDate;
    uint deposit;
    address payable landlord;
    address payable tenant;
  }


  // <units mapping>
  mapping (uint => Unit) public units;


  // <enum State: Vacant, Occupied>
  enum State { ForRent, Occupied}


  /// @notice Emitted when a unit is added and listed of rent
  /// @param unitNumber Unit Number requiring state change
  event LogForRent(uint unitNumber);

  /// @notice Emitted when a unit is has been rented
  /// @param unitNumber Unit Number requiring state change
  event LogOccupied(uint unitNumber);

  /// @notice Emitted when a unit is added 
  event LogUnitAdded(uint unitNumber);

  /// @notice Emitted when a unit has been rented
  event LogUnitRented(uint unitNumber, address tenant);
  
  
 /// @notice Ensures the unit is available for rent
  modifier forRent(uint unitNumber) {
    require(units[unitNumber].state == State.ForRent, "Unit is not for rent");
    _;
  }
  /// @notice Ensures tenant has deposited rent
  modifier paidDeposit(uint unitNumber) { 
    require(units[unitNumber].deposit == msg.value, "Not enough deposit"); 
    _;
  }

  

  constructor()  {}

  /// @notice Adds a unit under the ownership of a landlord 
  /// @param _unitAddress Address of the unit being listed
  /// @dev The landlord adding the unit must be the owner of the contract 
  /// @dev The unit number is automatically assigned
  function addUnit(
    string memory _unitAddress, 
    uint _rent, 
    uint _deposit,
    uint _term, 
    string memory _startDate
    ) onlyOwner public  {
   

    units[unitCount] = Unit({
     unitNumber: unitCount,
     unitAddress: _unitAddress,
     state: State.ForRent,
     rent: _rent,
     deposit: _deposit,
     term: _term,
     startDate: _startDate,
     landlord: payable(msg.sender),
     tenant: payable(address(0))
    });
    
    emit LogUnitAdded(unitCount);
    emit LogForRent(unitCount);
    unitCount = unitCount + 1;
    
  
  }


  
  /// @notice Allows tenant to rent a unit that is availabe to rent 
  /// @param _unitNumber The unit number to be listed
  /// @dev The unit must be available for rent
  /// @dev The tenant must pay enough deposit to rent unit  
  function rentUnit(uint _unitNumber) 
  public 
  payable 
  forRent(_unitNumber) 
  paidDeposit(_unitNumber)  
  {

    Unit storage _unit = units[_unitNumber];
    _unit.state = State.Occupied;
    _unit.tenant = payable(msg.sender);

    address owner = owner();

    (bool success, ) = owner.call{ value: msg.value }("");
        require(success, "Renting unit failed.");
    

    emit LogUnitRented(_unitNumber, msg.sender);
    emit LogOccupied(_unitNumber);
    
  }

  /// @notice Allows landlord to terminate a lease and evict tenant
  /// @param _unitNumber The unit that is to be terminated
  /// @dev The landlord must be the owner of the unit
  function terminateLease(
    uint _unitNumber
    ) 
    onlyOwner public { 
    
    Unit storage _unit = units[_unitNumber];
    _unit.state = State.ForRent;
    _unit.tenant = payable(address(0));
    

    emit LogUnitAdded(_unitNumber);
    emit LogForRent(_unitNumber);

  }
  

  /// @notice Allows landlord/tenant to fetch the details of a unit
  /// @param _unitNumber The unit number to be fetched
  function fetchUnit(uint _unitNumber) public view 
      returns (
        uint unitNumber, 
        string memory unitAddress,
        uint state, 
        uint rent, 
        uint deposit,
        uint term, 
        string memory startDate, 
        address landlord, 
        address tenant
        )  
    {
      unitNumber = units[_unitNumber].unitNumber; 
      unitAddress =  units[_unitNumber].unitAddress;
      state = uint(units[_unitNumber].state); 
      rent = units[_unitNumber].rent;
      deposit = units[_unitNumber].deposit;
      term = units[_unitNumber].term;
      startDate = units[_unitNumber].startDate; 
      landlord = units[_unitNumber].landlord; 
      tenant = units[_unitNumber].tenant; 
      return (unitNumber, unitAddress, state,rent, deposit, term, startDate,  landlord, tenant); 
    } 
  
}
