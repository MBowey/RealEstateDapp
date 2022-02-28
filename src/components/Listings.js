import React, { useState, useEffect, useCallback } from "react";
import "../styling/Cards.css";
import "../styling/UnitCard.css";
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
import apt1 from "../images/apts/apt1.jpeg";
import apt2 from "../images/apts/apt1.jpeg";
import apt3 from "../images/apts/apt2.jpeg";
import apt4 from "../images/apts/apt2.jpeg";

import RentalsABI from "../contracts/Rentals.json";

const image = [apt1, apt2, apt3, apt4];

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
    return <div className="cards__nothing">Nothing rented 🤷</div>;
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

const ListingItem = ({ item }) => {
  const {
    unitNumber,
    unitAddress,
    rent,
    deposit,
    term,
    startDate,
    tenant,
    state,
    landlord,
  } = item;
  return (
    <div className="cards__container">
      <div className="cards__wrapper">
        <ul className="cards__items">
          <li className="cards__item">
            <figure className="cards__item__pic-wrap" data-category="Luxury">
              <img
                className="cards__item__img"
                alt="Property Image"
                src={image[unitNumber.toNumber()]}
              />
            </figure>

            <div className="cards__item__info">
              <div className="row justify-content-center">
                <h5 className="cards__item__text">{unitNumber.toNumber()}</h5>
                <h5 className="cards__item__text">{unitAddress}</h5>
                <h5 className="cards__item__text">{rent.toNumber()} ETH/mo</h5>
                <h5 className="cards__item__text">
                  {deposit.toNumber()} ETH/mo
                </h5>
                <h5 className="cards__item__text">{term.toNumber()} ETH/mo</h5>
                <h5 className="cards__item__text">{startDate}</h5>

                {item.state === 0 && (
                  <h5 className="cards__item__text">Status: Available</h5>
                )}
                {item.state === 1 && item.tenant && (
                  <h5 className="cards__item__text">
                    Tenant: {shortenAddress(item.tenant)}
                  </h5>
                )}

                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    //   onClick={onRent}
                  >
                    Rent
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
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
      <h2>Available listings</h2>
      <FilteredListing listings={listings} state={0} />
      <h2>Rented</h2>
      <FilteredListing listings={listings} state={1} />
    </div>
  );
};

export default Listings;
