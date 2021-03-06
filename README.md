# Real Estate Dapp

![Real Estate Image](/src/images/banners/hero-image-inner.jpeg)

## Overview

Real Estate Dapp is a decentralized marketplace for landlords to be able to lease luxury units to tenants via the Ethereum blockchain. Landlords are able to list units online with their desired lease terms (rent, deposit, term, start date, etc). Tenants can then search properties based on availability and rent units by depositing the required amount of ETH set out in the lease. The smart contract automates the payment process of depositing ETH and the reccuring monthly rent payments.

## Tech Stack

FRONT-END: REACT, Web3-React, Ethers.js, Metamask

BACK-END: Truffle, Ganache

## Design Patterns & Security

- [`Design Pattern Decisions`](design-patter-decision.md)

- [`Avoiding Common Attacks`](avoiding_common_attacks.md)

## Installation

**Step 1:** Clone Github Repo and `cd` to the `blockchain-developer-bootcamp-final-project`

**Step 2:** Install dependencies

```Bash
yarn install
```

**Step 3:** Star your local blockahin with `Ganache`

```Bash
Port Number: 8545
Network/Chain ID: 1337
```

**Step 4:** Deploy your contracts

```bash
truffle migrate --network development
```

**Step 5:** Run User Interface (http://localhost:3000`)

```bash
yarn start
```

**Step 6:** Connect Metamask Wallet

- Make sure Metamask network is setup to port `8545` and Chain ID is `1337`.
- Import mnemonic created from your local ganache blockchain and selct first address (contract owner)

## Workflow: Real Estate Leasing

1. On Landlord Page, `Landlord/Owner` will list a new unit for lease with the following details:

![Add Unit](/src/images/AddUnit.png)

4. `Tenant` can then rent available units on the tenant page

![Rent Unit](/src/images/RentUnit.png)

- Deposit amount will automatically be sent via the smart contract set by the landlord
- Once the transaction is complete, the unit status will be updated to `Occupied` and the tenant's ethereum address will be updated to the contract

5. `Landlord/Owner` can terminate lease at anytime

   - Tenant is removed from unit contract
   - Unit status is updated to `Available`

6. (Future) Monthly timestamp that automatically transfers rent from `Tenant` account to `Landlord/Owner` on the first of every month (possible use of oracle to ensure calender accuracy)

7. (Future) `Tenant` has option to sublet unit with `Landlord` permission

## Future Implementations

- Utilize IPFS to upload pictures of units
- Integrate Subgraph (Graph Protocol) for enhanced querying and scalability
- Add additional features
  - Encorporate `block.timestamp` for start/end lease dates
  - Automated monthly rent payments
  - Tenant credit check (i.e. account balances)
  - Unit profit sharing
  - Sublease/Lease Transfers

## Directory Structure

- `src` - Front End Directory
- `contracts` - Real Estate Smart Contracts
- `migrations` - Truffle files for deploying smart contracts
- `test` - Truffle files for testing smart contracts locally
