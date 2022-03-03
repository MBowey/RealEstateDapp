import React, { Component, useEffect, UseMemo, useState, useForm } from "react";
import styled from "styled-components";
import Text from "../Text";
import { Spinner } from "react-bootstrap";
import { AddRental } from "../../components/Rentals/AddRental";
import { RentalCard } from "../../components/Rentals/RentalCard";
import "../../styling/AddUnit.css";
import { colors } from "../../theme";
import { useRental } from "../../hooks/useRental";
import { useWeb3React } from "@web3-react/core";
// import RentalsABI from "../../static/RentalsABI";
import { useAppContext } from "../../AppContext";
// import { Spinner } from "react-bootstrap";
import useEth from "../../hooks/useEth";
import useTransaction from "../../hooks/useTransaction";
import "../../App.css";
import "../../styling/Units.css";
import "../../styling/AddUnit.css";
import "../../styling/button.css";
import { Button } from "../button";
import { useContract } from "../../hooks/useContract";
import Listings from "../Listings";

import RentalsABI from "../../contracts/Rentals.json";

const CONFIRMATION_COUNT = 1;

const DetailsState = {
  LOADING: "LOADING",
  WAITING: "WAITING_CONFIRMATIONS",
  READY: "READY",
  ERROR: "ERROR",
  LISTED: "LISTED",
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 100px;
  -webkit-box-align: center;
  align-items: center;
  flex: 1 1 0%;
  overflow: hidden auto;
  z-index: 1;
`;

const Rentals = () => {
  // const state = {
  //   id: "",
  //   unitNumber: "",
  //   unitAddress: "",
  //   rent: "",
  //   deposit: "",
  //   term: "",
  //   startDate: "",
  //   // Status: "",
  //   units: [],
  // };

  const [status, setStatus] = useState(DetailsState.READY);
  const [unit, setUnit] = useState({
    unitNumber: "",
    unitAddress: "",
    rent: "",
    deposit: "",
    term: "",
    startDate: "",
  });
  const [mmError, setMmError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  // const [listing, setListing] = useState(undefined);
  const { active, account, chainId } = useWeb3React();
  const rentalsAddress = RentalsABI.networks[1337].address;
  const contract = new useContract(rentalsAddress, RentalsABI.abi);

  const handleInputChange = (event) => {
    setUnit({ ...unit, [event.target.name]: event.target.value });
  };

  const AddUnit = async (event) => {
    setStatus(DetailsState.LOADING);
    try {
      setStatus(DetailsState.WAITING);
      event.preventDefault();
      setUnit({
        unitNumber: "",
        unitAddress: "",
        rent: "",
        deposit: "",
        term: "",
        startDate: "",
      });
      const { unitAddress, rent, deposit, term, startDate } = unit;
      const txn = await contract.addUnit(
        unitAddress,
        rent,
        deposit,
        term,
        startDate,
        {
          from: account,
        }
      );

      const confirmations = chainId === 1337 ? 1 : CONFIRMATION_COUNT;
      await txn.wait(confirmations);
      setTxHash(txn.hash);
      console.log("Hash of the transaction: " + { txHash });
      setStatus(DetailsState.LISTED);
    } catch (error) {
      setStatus(DetailsState.ERROR);
      console.log("An error occured: ", error);
      if (error.code && typeof error.code === "number") {
        setMmError(error.message);
      }
    }
  };

  const toggleUnitEditing = (index) => {
    this.setState({
      units: this.state.units.map((unit, i) => {
        if (i === index) {
          return {
            ...unit,
            isEditing: !unit.isEditing,
          };
        }
        return unit;
      }),
    });
  };

  const handleUnitUpdate = (event, index) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      units: this.state.units.map((unit, unitIndex) => {
        if (unitIndex === index) {
          return {
            ...unit,
            [name]: value,
          };
        }
        return unit;
      }),
    });
  };

  const onDelete = (index) => {
    this.setState({
      units: [
        ...this.state.units.slice(0, index),
        ...this.state.units.slice(index + 1),
      ],
    });
  };

  const { LOADING, WAITING, READY, LISTED, ERROR } = DetailsState;

  return (
    <div className="units">
      <div className="addunit__container">
        <h1>List Your Luxury Property!!!!</h1>
        <div className="addunit__wrapper">
          {status === LOADING ||
            (status === WAITING && (
              <div className="custom-box">
                <Spinner
                  animation="border"
                  size="sm"
                  style={{
                    color: colors.green,
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                />
                {status === WAITING && (
                  <Text color="white" t4>
                    The unit will be listed after {CONFIRMATION_COUNT} block
                    confirmations.
                  </Text>
                )}
              </div>
            ))}
          {status === READY && (
            <form className="custom-form" onSubmit={AddUnit}>
              <label className="custom-input">
                <input
                  type="text"
                  value={unit.unitNumber.unitNumber}
                  name="unitNumber"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />

                <span className="placeholder"> Unit Number </span>
              </label>
              <label className="custom-input">
                <input
                  type="text"
                  value={unit.unitAddress.unitAddress}
                  name="unitAddress"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder"> Address </span>
              </label>
              <label className="custom-input">
                <input
                  type="text"
                  value={unit.rent.rent}
                  name="rent"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder"> Rent </span>
              </label>
              <label className="custom-input">
                <input
                  type="text"
                  value={unit.deposit.deposit}
                  name="deposit"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder"> Deposit </span>
              </label>
              <label className="custom-input">
                <input
                  type="text"
                  value={unit.term.term}
                  name="term"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder"> Term </span>
              </label>
              <label className="custom-input">
                <input
                  type="text"
                  value={unit.startDate.startDate}
                  name="startDate"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder"> Start Date </span>
              </label>
              <div className="button-container">
                <button type="submit" className="custom-button">
                  LIST PROPERTY
                </button>
              </div>
            </form>
          )}
          {status === LISTED && !!txHash && (
            <div className="custom-box">
              <Text
                t3
                color={colors.white}
                style={{ marginTop: "20px", marginBottom: "20px" }}
              >
                This unit has been listed!!!
              </Text>
              <Button
                style={{
                  marginLeft: "20px",
                }}
                type="button"
                buttonStyle="btn--outline"
                onClick={() => setStatus(DetailsState.READY)}
              >
                BACK
              </Button>
            </div>
          )}
          {status === ERROR && (
            <div className="custom-box">
              <Text
                style={{ marginTop: "20px", marginBottom: "20px" }}
                color={colors.red}
              >
                {mmError || "Error encountered!"}
              </Text>
              <Button
                style={{
                  marginLeft: "20px",
                }}
                type="button"
                buttonStyle="btn--outline"
                onClick={() => setStatus(DetailsState.READY)}
              >
                BACK
              </Button>
            </div>
          )}
        </div>
      </div>

      <hr />
    </div>
  );
};

export default Rentals;
