import React, { useState, useEffect, useCallback } from "react";
import "../styling/Cards.css";
import styled from "styled-components";
import { Spinner } from "react-bootstrap";
import { colors } from "../theme";
import Text from "./Text";
import { TenantCard } from "../../components/Rentals/RentalCard";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "../hooks/useContract";
import { BigNumber } from "ethers";
import { shortenAddress } from "../utils/shortenAddress";
import { formatEther } from "@ethersproject/units";

import RentalsABI from "../contracts/Rentals.json";

const listingState = {
  LOADING: "LOADING",
  READY: "READY",
  ERROR: "ERROR",
};

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  max-width: 90%;
  flex-wrap: wrap;
`;

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  max-width: 175px;
`;

const StyledItemTextContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;

const FilteredListing = ({ listings, state }) => {
  const filtered = listings.filter((l) => l.state === state);

  if (filtered.length < 1) {
    return <Text>Nothing here 🤷</Text>;
  }

  return (
    <StyledDiv>
      {filtered.map((l) => {
        const id = BigNumber.from(l.unitNumber).toNumber();
        return <ListingItem key={id} item={l} />;
      })}
    </StyledDiv>
  );
};

const ListingItem = ({ item }) => {
  const {
    unitNumber,
    unitAddress,
    rent,
    deposit,
    term,
    startDate,
    tenant,
    landlord,
  } = item;
  return (
    <StyledItem>
      {/* <img className="cards__unit__img" src="/images/apts/apt1.jpeg" /> */}
      <StyledItemTextContainer>
        <Text center bold color={colors.green}>
          {rent} ETH/mo
        </Text>
        <Text center>{unitAddress}</Text>
        {item.state === 0 && (
          <Text center>Tenant: {shortenAddress(item.tenant)}</Text>
        )}
        {item.state === 1 && item.tenant && (
          <Text center>Tenant: {shortenAddress(item.tenant)}</Text>
        )}
      </StyledItemTextContainer>
    </StyledItem>
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
      const ids = [];
      for (let idNumber = 1; idNumber < idListLength; idNumber++) {
        ids.push(idNumber);
      }
      const arr = await Promise.all(ids.map((id) => contract.units(id)));
      setListings(arr);
      console.log(arr);
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
    <>
      <Text t3 color={colors.green}>
        Available listings
      </Text>
      <FilteredListing listings={listings} state={0} />
      <Text t3 color={colors.red} style={{ marginTop: "20px" }}>
        Rented
      </Text>
      <FilteredListing listings={listings} state={1} />
    </>
    // <div className="cards">
    //   <div className="cards__container">
    //     <h1>Check out these EPIC Rentals</h1>

    //     <div className="cards__wrapper">
    //       <ul className="cards__units">
    //         {/* {listings.map((unit, index) => (
    //           <TenantCard
    //             key={unit.unitNumber}
    //             index={index}
    //             src="/images/apts/apt1.jpeg"
    //             unit={unit}
    //             // toggleEditing={() => this.toggleUnitEditing(index)}
    //             // onChange={this.handleUnitUpdate}
    //             // onDelete={() => this.onDelete(index)}
    //           />
    //         ))} */}
    //       </ul>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Listings;
