# Avoiding Common Attacks

## (SWC-103) Solidity Compile Version

    * Using Solidity >= v0.8.0 Contracts should be deployed with the same compiler version and flags that they have been tested with thoroughly. Locking the pragma helps to ensure that contracts do not accidentally get deployed using, for example, an outdated compiler version that might introduce bugs that affect the contract system negatively.

## (SWC-100) Function Visibility

    * Specifying functions with `public`, `external`, `internal` and `private` to ensure proper visibility


## (SWC-111) Use of Deprecated Solidity Functions

* Using `.call` instead of `.transfer` to send Ether in the rentUnit function

* Ensure transfers of Ether happens after any necessary state changes have been made, to prevent reentrancy attacks.


## Use Modifiers Only for Validation 

* Ensure transfers of Ether for rentUnit() happens after unit availability and correct depoist amount has been verified. State changes to Unit status are only made after funds have been transfered. 
    