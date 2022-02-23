import React, { Component, useEffect, UseMemo, useState, useForm } from "react";
import styled from "styled-components";
import Text from "../Text";
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
import { useContract } from "../../hooks/useContract";

import RentalsABI from "../../contracts/Rentals.json";

const CONFIRMATION_COUNT = 1;

const DetailsState = {
  LOADING: "LOADING",
  WAITING: "WAITING_CONFIRMATIONS",
  READY: "READY",
  ERROR: "ERROR",
  SOLD: "LISTED",
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
  // const [unitNumber, setUnitNumber] = useState("");
  // const [unitAddress, setUnitAddress] = useState("");
  // const [rent, setRent] = useState("");
  // const [deposit, setDeposit] = useState("");
  // const [term, setTerm] = useState("");
  // const [startDate, setStartDate] = useState("");

  const [mmError, setMmError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  // const [listing, setListing] = useState(undefined);
  const { active, account, chainId } = useWeb3React();
  const rentalsAddress = "0x03Bb27A85a288E98C25dC3f4671eD9F4930b31B5"; //"0x03Bb27A85a288E98C25dC3f4671eD9F4930b31B5";
  const contract = useContract(rentalsAddress, RentalsABI.abi);

  const handleInputChange = (event) => {
    setUnit({ ...unit, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(unit);
    setUnit({
      unitNumber: "",
      unitAddress: "",
      rent: "",
      deposit: "",
      term: "",
      startDate: "",
    });
  };

  const AddUnit = async (event) => {
    setStatus(DetailsState.LOADING);
    try {
      setStatus(DetailsState.WAITING);
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

  return (
    <div className="units">
      <div className="addunit__container">
        <h1>List Your Luxury Property!!!!</h1>
        <div className="addunit__wrapper">
          <form className="custom-form" onSubmit={AddUnit}>
            <label className="custom-input">
              <input
                type="text"
                value={unit.unitNumber.unitNumber}
                name="unitNumber"
                onChange={handleInputChange}
              />
              <span className="placeholder"> Unit Number </span>
            </label>
            <label className="custom-input">
              <input
                type="text"
                value={unit.unitAddress.unitAddress}
                name="unitAddress"
                onChange={handleInputChange}
              />
              <span className="placeholder"> Address </span>
            </label>
            <label className="custom-input">
              <input
                type="text"
                value={unit.rent.rent}
                name="rent"
                onChange={handleInputChange}
              />
              <span className="placeholder"> Rent </span>
            </label>
            <label className="custom-input">
              <input
                type="text"
                value={unit.deposit.deposit}
                name="deposit"
                onChange={handleInputChange}
              />
              <span className="placeholder"> Deposit </span>
            </label>
            <label className="custom-input">
              <input
                type="text"
                value={unit.term.term}
                name="term"
                onChange={handleInputChange}
              />
              <span className="placeholder"> Term </span>
            </label>
            <label className="custom-input">
              <input
                type="text"
                value={unit.startDate.startDate}
                name="startDate"
                onChange={handleInputChange}
              />
              <span className="placeholder"> Start Date </span>
            </label>
            <div className="button-container">
              <button type="submit" className="custom-button">
                LIST PROPERTY
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="cards__container">
        <h1>Rentals</h1>
        <div className="cards__wrapper">
          {/* <ul className="cards__units">
            {this.state.units.map((unit, index) => (
              <RentalCard
                key={unit.id}
                index={index}
                src="/images/apts/apt1.jpeg"
                unit={unit}
                toggleEditing={() => this.toggleUnitEditing(index)}
                onChange={this.handleUnitUpdate}
                onDelete={() => this.onDelete(index)}
              />
            ))}
          </ul> */}
        </div>
      </div>

      <hr />
    </div>
  );
};

export default Rentals;
