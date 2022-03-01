import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "../styling/Cards.css";
import "../styling/UnitCard.css";
import { Spinner } from "react-bootstrap";
import { colors } from "../theme";
import Text from "./Text";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "../hooks/useContract";

import RentalsABI from "../contracts/Rentals.json";

const unitState = {
  LOADING: "LOADING",
  WAITING: "WAITING_CONFIRMATIONS",
  READY: "READY",
  LEASED: "LEASED",
  ERROR: "ERROR",
};

const CONFIRMATION_COUNT = 2;

const RentUnitButton = ({ item }) => {
  const [unitStatus, setUnitStatus] = useState(unitState.READY);
  const [mmError, setMmError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const { active, account, chainId } = useWeb3React();
  const rentalsAddress = "0x03Bb27A85a288E98C25dC3f4671eD9F4930b31B5";
  const contract = useContract(rentalsAddress, RentalsABI.abi);

  const onRentClick = async (event) => {
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
        <button type="button" className="btn-custom" onClick={onRentClick}>
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
          <Link style={{ marginLeft: "20px" }} to="/tenant">
            Refresh
          </Link>
        </>
      )}
      {unitStatus === ERROR && (
        <>
          <Text style={{}} color={colors.red}>
            {mmError || "Error Encountered!"}
          </Text>
          <button
            style={{
              marginLeft: "20px",
            }}
            type="button"
            className="btn-custom"
            onClick={() => setUnitStatus(unitState.READY)}
          >
            Back
          </button>
        </>
      )}
    </div>
  );
};

export default RentUnitButton;
