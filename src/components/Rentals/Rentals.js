import React, { Component, useEffect, UseMemo, useState } from "react";
import styled from "styled-components";
import Text from "../Text";
import { AddRental } from "../../components/Rentals/AddRental";
import { RentalCard } from "../../components/Rentals/RentalCard";
import "../../styling/AddUnit.css";
import { colors } from "../../theme";
import { useRental } from "../../hooks/useRental";
import { useWeb3React } from "@web3-react/core";
import { useAppContext } from "../../AppContext";
// import { Spinner } from "react-bootstrap";
import useEth from "../../hooks/useEth";
import useTransaction from "../../hooks/useTransaction";
import "../../App.css";
import "../../styling/Units.css";

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
  const [mmError, setMmError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [listing, setListing] = useState(undefined);
  const { active, account, chainId } = useWeb3React();
  const { rentalsContract } = useRental();
  const contract = rentalsContract;

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  const AddUnit = async () => {
    setStatus(DetailsState.LOADING);
    try {
      setStatus(DetailsState.WAITING);
      const txn = await contract.methods.addUnit(
        unitNumber,
        unitAddress,
        rent,
        deposit,
        term,
        startDate,
        { from: account }
      );
      const confirmations = chainId === 1337 ? 1 : CONFIRMATION_COUNT;
      await txn.wait(confirmations);
      setTxHash(transaction.hash);
      setStatus(DetailsState.LISTED);
    } catch (error) {
      setStatus(DetailsState.ERROR);
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

  const { LOADING, WAITING, READY, SOLD, ERROR } = DetailsState;

  return (
    <div className="units">
      <div className="addunit__container">
        <h1>List Your Luxury Property!!!!</h1>
        <div className="addunit__wrapper">
          <AddRental
            name={unitNumber}
            unitAddress={unitAddress}
            rent={rent}
            deposit={deposit}
            term={term}
            startDate={startDate}
            //   Status={Status}
            onChange={handleInputChange}
            onSubmit={AddUnit}
          />
        </div>
      </div>

      <div className="cards__container">
        <h1>Rentals</h1>
        <div className="cards__wrapper">
          <ul className="cards__units">
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
          </ul>
        </div>
      </div>

      <hr />
    </div>
  );
};

export default Rentals;
