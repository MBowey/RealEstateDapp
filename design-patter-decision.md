# Design Pattern Decisions

### Inheritance and Interfaces
* The contract inherits from the @OpenZeppelin `Ownable` contract which gives it additional functionality like `transferOwnership` and `renounceOwnership`.


### Access Control Design Patterns
* Additional features of @OpenZeppeling `Ownable` is the ability to utlize the `onlyOwner` modifier that ristricts access to  `addUnit()`, `listUnit()` & `terminateLease()` functions. This means that only the owner of the contract can add a new unit, list a unit for rent or terminate a lease. 