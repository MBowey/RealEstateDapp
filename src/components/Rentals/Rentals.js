import React, { Component, useEffect, UseMemo, useState } from "react";
import styled from "styled-components";
import Text from "../Text";
import { AddRental } from "../../components/Rentals/AddRental";
import { RentalCard } from "../../components/Rentals/RentalCard";
import "../../styling/AddUnit.css";
import { colors } from "../../theme";
import { useRental } from "../../hooks/useRental";
import { useAppContext } from "../../AppContext";
// import { Spinner } from "react-bootstrap";
import useEth from "../../hooks/useEth";
import useTransaction from "../../hooks/useTransaction";
import "../../App.css";
import "../../styling/Units.css";

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

  const { addRental, unitNumber, unitAddress, rent, deposit, term, startDate } =
    useRental();
  const { txnStatus, setTxnStatus } = useTransaction();

  const handleAddUnit = () =>
    addRental(unitNumber, unitAddress, rent, deposit, term, startDate);

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  const AddUnit = (event) => {
    //   const { unitNumber, unitAddress, rent, deposit, term, startDate } =
    //     this.state;
    // const transaction = await addRental( unitNumber, unitAddress, rent, deposit, term, startDate);

    const { unitNumber, unitAddress, rent, deposit, term, startDate } =
      this.state;

    const unitsInState = this.state.units;
    console.log(unitsInState);

    const unitsArrayLength = unitsInState.length;
    const id = unitsArrayLength
      ? (unitsInState[unitsArrayLength - 1].id += 1)
      : 1;

    this.setState({
      units: [
        ...unitsInState,
        Object.assign(
          {},
          {
            id,
            unitNumber,
            unitAddress,
            rent,
            deposit,
            term,
            startDate,
          }
        ),
      ],
      id: "",
      unitNumber: "",
      unitAddress: "",
      Rent: "",
      Deposit: "",
      Term: "",
      StartDate: "",
    });
    console.log(unitsInState);
    localStorage.setItem("units", JSON.stringify(this.state));
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

  // useEffect(() => {
  //   // storing input name
  //   localStorage.setItem("units", JSON.stringify(this.state.units));
  // }, []);

  // if (txnStatus === "LOADING") {
  //   return (
  //     <div className="units">
  //       <div className="addunit__container">
  //         <h1>List Your Luxury Property!!!!</h1>
  //         <div className="addunit__wrapper">
  //           {/* <Spinner animation="border" role="status" className="m-auto" /> */}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (txnStatus === "COMPLETE") {
  //   return (
  //     <div className="units">
  //       <div className="addunit__container">
  //         <h1>List Your Luxury Property!!!!</h1>
  //         <div className="tx__text">
  //           <h4>Property was successfully listed!!!</h4>
  //           <div className="button-container">
  //             <button
  //               type="submit"
  //               className="custom-button"
  //               onClick={() => setTxnStatus("NOT_SUBMITTED")}
  //             >
  //               Go Back
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (txnStatus === "ERROR") {
  //   return (
  //     <div className="units">
  //       <div className="addunit__container">
  //         <h1>List Your Luxury Property!!!!</h1>
  //         <div className="addunit__wrapper">
  //           <h4>Transaction ERROR!!!</h4>
  //           <div className="button-container">
  //             <button
  //               type="submit"
  //               className="custom-button"
  //               onClick={() => setTxnStatus("NOT_SUBMITTED")}
  //             >
  //               Go Back
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

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
            onChange={this.handleInputChange}
            onSubmit={this.AddUnit}
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
