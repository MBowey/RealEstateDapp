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
  TERMINATED: "TERMINATED",
  ERROR: "ERROR",
};

const CONFIRMATION_COUNT = 2;

const TerminateButton = ({ unit, onRent }) => {
  const [unitStatus, setUnitStatus] = useState(unitState.READY);
  const [mmError, setMmError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const { active, account, chainId } = useWeb3React();
  const rentalsAddress = "0x03Bb27A85a288E98C25dC3f4671eD9F4930b31B5";
  const contract = useContract(rentalsAddress, RentalsABI.abi);

  const onTerminate = async (event) => {
    setUnitStatus(unitState.LOADING);
    try {
      setUnitStatus(unitState.WAITING);
      const transaction = await contract.terminateLease(unitNumber, {
        from: account,
      });
      const confirmations = chainId === 1337 ? 1 : CONFIRMATION_COUNT;
      await transaction.wait(confirmations);
      setTxHash(transaction.hash);
      setUnitStatus(unitState.TERMINATED);
    } catch (e) {
      setUnitStatus(unitState.ERROR);
      if (e.code && typeof e.code === "number") {
        setMmError(e.message);
      }
    }
  };

  const { LOADING, WAITING, READY, TERMINATED, ERROR } = unitState;

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
                Lease will be terminated in {CONFIRMATION_COUNT} block
                confirmations.
              </Text>
            )}
          </>
        ))}
      {unitStatus === READY && (
        <button type="button" className="btn-custom" onClick={onTerminate}>
          TERMINATE LEASE
        </button>
      )}
      {unitStatus === TERMINATED && !!txHash && (
        <>
          <Text
            t3
            color={colors.green}
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            Lease has been terminated!!!
          </Text>
          <Link style={{ marginTop: "20px" }} to="/landlord">
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
          <Link style={{ marginTop: "20px" }} to="/landlord">
            Refresh
          </Link>
        </>
      )}
    </div>
  );
};

export default TerminateButton;
