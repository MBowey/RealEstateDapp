import React, { useState, useEffect, useCallback } from "react";
import ListingItem from "./ListingItem";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "../../hooks/useContract";
import { BigNumber } from "ethers";
import { Spinner } from "react-bootstrap";
import { colors } from "../../theme";
import "../../styling/Cards.css";
import "../../styling/UnitCard.css";

import RentalsABI from "../../contracts/Rentals.json";

const listingState = {
  LOADING: "LOADING",
  READY: "READY",
  ERROR: "ERROR",
};

const FilteredListing = ({ listings, state }) => {
  const filtered = listings.filter((l) => l.state === state);

  if (filtered.length < 1 && state === 0) {
    return <div className="cards__nothing">No units available for rent!!!</div>;
  }

  if (filtered.length < 1 && state === 1) {
    return <div className="cards__nothing">No units have been rented!!!</div>;
  }

  return (
    <>
      {filtered.map((l) => {
        const id = BigNumber.from(l.unitNumber).toNumber();
        return <ListingItem key={id} item={l} />;
      })}
    </>
  );
};

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState(listingState.LOADING);
  const { active, chainId } = useWeb3React();
  const rentalsAddress = RentalsABI.networks[1337].address;
  const contract = useContract(rentalsAddress, RentalsABI.abi);

  const getUnits = useCallback(async (contract) => {
    try {
      // still on the lookout for optimal solidity data structures, this ain't it
      const idListLengthBN = await contract.unitCount();
      const idListLength = idListLengthBN.toNumber();
      const ids = [];
      for (let idNumber = 1; idNumber < idListLength; idNumber++) {
        ids.push(idNumber);
      }
      const arr = await Promise.all(ids.map((id) => contract.units(id)));
      setListings(arr);
      setStatus(listingState.READY);
    } catch (error) {
      console.log("error:", error);
      setStatus(listingState.ERROR);
    }
  }, []);

  useEffect(() => {
    if (active) {
      getUnits(contract);
    }
  }, [active]);

  if (!active) {
    return null;
  }

  if (status === listingState.LOADING) {
    return (
      <Spinner
        animation="border"
        size="sm"
        style={{ color: colors.green, marginTop: "20px" }}
      />
    );
  }

  return (
    <div className="card">
      <h1>Check out these EPIC Rentals!</h1>
      <div className="cards__container">
        <div className="cards__wrapper">
          <h2>Available listings</h2>
          <ul className="cards__items">
            <FilteredListing listings={listings} state={0} />
          </ul>
          <h2>Rented</h2>
          <ul className="cards__items">
            <FilteredListing listings={listings} state={1} />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Listings;
