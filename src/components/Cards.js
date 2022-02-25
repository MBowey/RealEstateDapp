import React, { useState, useEffect, useCallback } from "react";
import "../styling/Cards.css";
import { Spinner } from "react-bootstrap";
import { colors } from "../theme";
import Text from "./Text";
import CardItem from "./CardItem";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "../hooks/useContract";
import { BigNumber } from "ethers";
import { formatEther } from "@ethersproject/units";

import RentalsABI from "../contracts/Rentals.json";

const listingState = {
  LOADING: "LOADING",
  READY: "READY",
  ERROR: "ERROR",
};

const FilteredListing = ({ listings, status }) => {
  const filtered = listings.filter((l) => l.status === status);

  if (filtered.length < 1) {
    return <Text>Nothing here 🤷</Text>;
  }

  return (
    <StyledDiv>
      {filtered.map((l) => {
        const id = BigNumber.from(l.propertyId).toNumber();
        return <ListingItem key={id} item={l} />;
      })}
    </StyledDiv>
  );
};

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState(listingState.LOADING);
  const { active } = useWeb3React();
  const rentalsAddress = "0x03Bb27A85a288E98C25dC3f4671eD9F4930b31B5";
  const contract = useContract(rentalsAddress, RentalsABI.abi);

  const getUnits = useCallback(async (contract) => {
    try {
      // still on the lookout for optimal solidity data structures, this ain't it
      const idListLengthBN = await contract.unitCount();
      const idListLength = idListLengthBN.toNumber();
      console.log(idListLength);
      for (let i = 1; i < idListLength; i++) {
        const unit = await contract.units(i);
        const units = [...listings, unit];
        setListings(units);
        setStatus(listingState.READY);
      }
    } catch (error) {
      console.log("error:", error);
      setStatus(listingState.ERROR);
    }
  }, []);

  // // const idBNs = await Promise.all(
  // //   Array.from(Array(idListLengthBN.toNumber())).map((_, i) =>
  // //     contract.idList(i)
  // //   )
  // );
  // const ids = idBNs.map((n) => n.toNumber());
  // const arr = await Promise.all(ids.map((id) => contract.properties(id)));
  // setListings(arr);

  useEffect(() => {
    if (active) {
      getUnits(contract);
      console.log(listings);
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
    <>
      <Text t3 color={colors.green}>
        Available listings
      </Text>
      <FilteredListing listings={listings} status={0} />
      <Text t3 color={colors.red} style={{ marginTop: "20px" }}>
        Rented
      </Text>
      <FilteredListing listings={listings} status={1} />
    </>
  );
};

function Cards() {
  return (
    <div className="cards">
      <Listings />
      <h1>Check out these EPIC Rentals!</h1>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src="/images/apts/apt1.jpeg"
              text="Beautiful 2-Story Penthouse in Tribeca"
              label="TRIBECA"
              path="/details"
            />
            <CardItem
              src="/images/apts/apt2.jpeg"
              text="Brooklyn Loft With Stunning Views of Manhattan"
              label="BROOKLYN"
              path="/details"
            />
          </ul>
          <ul className="cards__items">
            <CardItem
              src="/images/apts/apt3.jpeg"
              text="Former Textile Factory Converted Into One of a Kind Apartment"
              label="BROOKLYN"
              path="/details"
            />
            <CardItem
              src="/images/apts/apt4.jpeg"
              text="Rare Luxury Apartment Meatpacking District"
              label="MEATPACKING"
              path="/details"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
