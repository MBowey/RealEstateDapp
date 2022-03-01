import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "../styling/Cards.css";
import "../styling/UnitCard.css";
import styled from "styled-components";
import { Spinner } from "react-bootstrap";
import { colors } from "../theme";
import Text from "./Text";
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

const unitState = {
  LOADING: "LOADING",
  WAITING: "WAITING_CONFIRMATIONS",
  READY: "READY",
  LEASED: "LEASED",
  ERROR: "ERROR",
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
  const { active, account, chainId } = useWeb3React();
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
        {item.state === 0 && (
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
                  This apartment is now yours!
                  {/* Access it with this keycode:{" "}
                    {KEYCODE_DUMMY} */}
                </Text>
                <Link style={{ marginTop: "20px" }} to="/tenant">
                  Refresh
                </Link>
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
                <Link style={{ marginTop: "20px" }} to="/tenant">
                  Refresh
                </Link>
              </>
            )}
          </div>
        )}
      </div>{" "}
    </li>
  );
};

export default ListingItem;
