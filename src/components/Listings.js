import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
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
const CONFIRMATION_COUNT = 2;

const listingState = {
  LOADING: "LOADING",
  READY: "READY",
  ERROR: "ERROR",
};

const unitState = {
  LOADING: "LOADING",
  WAITING: "WAITING_CONFIRMATIONS",
  READY: "READY",
  LEASED: "LEASED",
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
    return <div className="cards__nothing">Nothing Rented Yet!! 🤷</div>;
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
  const [unitStatus, setUnitStatus] = useState(unitState.READY);
  const [mmError, setMmError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const { active, account, chainID } = useWeb3React();
  const rentalsAddress = "0x03Bb27A85a288E98C25dC3f4671eD9F4930b31B5";
  const contract = useContract(rentalsAddress, RentalsABI.abi);

  const onBuyClick = async (event) => {
    setUnitStatus(unitState.LOADING);
    try {
      setUnitStatus(unitState.WAITING);
      const transaction = await contract.rentUnit(unitNumber, {
        from: account,
        value: deposit,
      });
      const confirmations = chainId === 1337 ? 1 : CONFIRMATION_COUNT;
      await transaction.wait(confirmations);
      setTxHash(transaction.hash);
      setUnitStatus(unitState.LEASED);
    } catch (e) {
      setUnitStatus(unitState.ERROR);
      if (e.code && typeof e.code === "number") {
        setMmError(e.message);
      }
    }
  };

  const { LOADING, WAITING, READY, LEASED, ERROR } = unitState;

  return (
    <li className="cards__item">
      <div className="cards__item__link">
        <figure className="cards__item__pic-wrap" data-category="Luxury">
          <img
            className="cards__item__img"
            alt="Property Image"
            src={image[unitNumber.toNumber()]}
          />
        </figure>

        <div className="cards__item__info">
          <div className="cards__item__text">
            <h5>Unit Number: </h5>
            <h5>Unit Addres: </h5>
            <h5>Rent: </h5>
            <h5>Deposit: </h5>
            <h5>Lease Term: </h5>
            <h5>Start Date: </h5>
            <h5>Status: </h5>
            <h5>Tenant: </h5>
          </div>
          <div className="cards__item__values">
            <h5>{unitNumber.toNumber()}</h5>
            <h5> {unitAddress}</h5>
            <h5>{rent.toNumber()} ETH/mo</h5>
            <h5>{deposit.toNumber()} ETH/mo</h5>
            <h5>{term.toNumber()} Months</h5>
            <h5> {startDate}</h5>
            {item.state === 0 && <h5> Available</h5>}
            {item.state === 1 && item.tenant && <h5>Occupied</h5>}
            <h5>{shortenAddress(item.tenant)}</h5>
          </div>
        </div>
        <div className="btn-container">
          {unitStatus === LOADING ||
            (unitStatus === WAITING && (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  style={{
                    color: colors.green,
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                />
                {unitStatus === WAITING && (
                  <Text>
                    The apartment is yours after {CONFIRMATION_COUNT} block
                    confirmations.
                  </Text>
                )}
              </>
            ))}
          {unitStatus === READY && (
            <button type="button" className="btn-custom" onClick={onBuyClick}>
              RENT UNIT
            </button>
          )}
          {unitStatus === LEASED && !!txHash && (
            <>
              <Text
                t3
                color={colors.green}
                style={{ marginTop: "20px", marginBottom: "20px" }}
              >
                This apartment is now yours! Access it with this keycode:{" "}
                {/* {KEYCODE_DUMMY} */}
              </Text>
            </>
          )}
          {unitStatus === ERROR && (
            <>
              <Text
                style={{ marginTop: "20px", marginBottom: "20px" }}
                color={colors.red}
              >
                {mmError || "Error encountered!"}
              </Text>
            </>
          )}
        </div>
      </div>{" "}
    </li>
  );
};

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState(listingState.LOADING);
  const [unitStatus, setUnitStatus] = useState(unitState.READY);
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
