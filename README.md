# Real Estate Landlord/Tenant Lease Agreement

![Real Estate Image](/src/images/banners/hero-image-inner.jpeg)

## Overview

Real Estate Dapp is a decentralized marketplace for landlords to be able to lease individual units to tenants. Landlords are able to add units to the marketplace and list them for rent with the desired lease terms (rent, deposit,term, etc). Tenants can search properties for availability by unit number and secure a unit for rent by depositing 2 months rent (first and last month).

## Tech Stack

FRONT-END: REACT, Web3.js, Metamask

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

**Step 5:** Update `dapp.js` file with Contract Address & ABI from deployment

```bash
const contractAddress = "0x00000000000000000000000000000000000"
const contractABI = []
```

**Step 6:** Run User Interface (http://localhost:3000`)

```bash
yarn start
```

**Step 7:** Connect Metamask

- Make sure Metamask network is setup to port `8545` and Chain ID is `1337`.
- Import first address (contract owner) from Ganache to Metamask with private key.

## Workflow: Real Estate Leasing

1. `Landlord/Owner` will creates a new unit with the following details

- Unit Number
- Location
- Number of bedrooms
- Number of bathrooms
- Unit Status/Availability (ForRent/Occupied)
- Landlord (Ethereum Address)

2. `Landlord/Owner` can then list the unit for rent with the following details

- LeaseID
- Unit Number
- Monthly Rental Amount (ETH)
- Required Depoist Amount (ETH) - 2 Months Rent
- Lease Term

3. `Tenant` can then fetch unit information for availability and lease details

4. `Tenant` can then rent unit by transfering 2 months rent to landlord

   - Unit/Lease are both updated with tenant's ethereum address

5. `Landlord/Owner` has ability to terminate lease

   - Tenant is removed from unit list
   - Unit status is updated to `ForRent`

6. (Future) Monthly timestamp that automatically transfers funds from `Tenant` account to `Landlord/Owner` on the first of every month (possible use of oracle to ensure calender accuracy)

7. (Future) `Tenant` has option to re-assign lease or sublet with `Landlord` permission

## Future Implementations

- Update User Interface with REACT to enable realtime updates of dynamic data
- Integrate Subgraph (Graph Protocol) for enhanced querying and scalability
- Add additional features
  - Encorporate `block.timestamp` for start/end lease dates
  - Automated monthly rent payments
  - Tenant credit check (i.e. account balances)
  - Unit profit sharing
  - Sublease/Lease Transfers

## Directory Structure

- `main` - Front End Directory
- `contracts` - Real Estate Smart Contracts
- `migrations` - Truffle files for deploying smart contracts
- `test` - Truffle files for testing smart contracts locally
