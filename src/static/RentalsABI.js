const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "unitNumber",
        type: "uint256",
      },
    ],
    name: "LogForRent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "unitNumber",
        type: "uint256",
      },
    ],
    name: "LogOccupied",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "unitNumber",
        type: "uint256",
      },
    ],
    name: "LogUnitAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "unitNumber",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tenant",
        type: "address",
      },
    ],
    name: "LogUnitRented",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unitCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "units",
    outputs: [
      {
        internalType: "uint256",
        name: "unitNumber",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "unitAddress",
        type: "string",
      },
      {
        internalType: "enum Rentals.State",
        name: "state",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "rent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "term",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "startDate",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "deposit",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "landlord",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "tenant",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_unitAddress",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_rent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_deposit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_term",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_startDate",
        type: "string",
      },
    ],
    name: "addUnit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_unitNumber",
        type: "uint256",
      },
    ],
    name: "rentUnit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_unitNumber",
        type: "uint256",
      },
    ],
    name: "terminateLease",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_unitNumber",
        type: "uint256",
      },
    ],
    name: "fetchUnit",
    outputs: [
      {
        internalType: "uint256",
        name: "unitNumber",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "unitAddress",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "state",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deposit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "term",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "startDate",
        type: "string",
      },
      {
        internalType: "address",
        name: "landlord",
        type: "address",
      },
      {
        internalType: "address",
        name: "tenant",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];

export default abi;
