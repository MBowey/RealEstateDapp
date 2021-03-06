import React, { useState, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "../../hooks/useContract";
import { UnitContext } from "../../hooks/useUnitInfo";
import "../../styling/Cards.css";
import "../../styling/UnitCard.css";
import { Spinner } from "react-bootstrap";
import { colors } from "../../theme";
import Text from "../Text";

import RentalsABI from "../../contracts/Rentals.json";

const unitState = {
  LOADING: "LOADING",
  WAITING: "WAITING_CONFIRMATIONS",
  READY: "READY",
  LEASED: "LEASED",
  ERROR: "ERROR",
};

const CONFIRMATION_COUNT = 2;

const RentUnitButton = () => {
  const item = useContext(UnitContext);
  const { unitNumber, deposit } = item;
  const [unitStatus, setUnitStatus] = useState(unitState.READY);
  const [mmError, setMmError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const { active, account, chainId } = useWeb3React();
  const rentalsAddress = RentalsABI.networks[1337].address;
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
