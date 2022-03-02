import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import RentUnitButton from "./RentUnitButton";
// import EditLeaseButton from "./EditLeaseButton";
import TerminateButton from "./TerminateButton";

import { shortenAddress } from "../utils/shortenAddress";
import "../styling/Cards.css";
import "../styling/UnitCard.css";

import apt1 from "../images/apts/apt3.jpeg";
import apt2 from "../images/apts/apt4.jpeg";
import apt3 from "../images/apts/apt1.jpeg";
import apt4 from "../images/apts/apt2.jpeg";
import apt5 from "../images/apts/apt5.jpeg";
import apt6 from "../images/apts/apt6.jpeg";

import { UnitContext } from "../hooks/useUnitInfo";

const image = [apt1, apt2, apt3, apt4, apt5, apt6];

const pageState = {
  HOME: "/",
  TENANT: "TENANT",
  LANDLORD: "LANDLORD",
};

const ListingButtons = () => {
  const { pathname } = useLocation();

  if (pathname === "/tenant") {
    return <RentUnitButton />;
  }

  //   if (pathname === "/landlord") {
  //     return <EditLeaseButton />;
  //   }

  return <></>;
};

const Terminate = () => {
  const { pathname } = useLocation();

  if (pathname === "/landlord") {
    return <TerminateButton />;
  }

  return <></>;
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
  } = item;

  return (
    <UnitContext.Provider value={item}>
      <li className="cards__item">
        <div className="cards__item__link">
          <figure className="cards__item__pic-wrap" data-category="Luxury">
            <img
              className="cards__item__img"
              alt="Property Image"
              src={image[unitNumber.toNumber() - 1]}
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
          {item.state === 0 && <ListingButtons />}
          {item.state === 1 && <Terminate />}
        </div>{" "}
      </li>
    </UnitContext.Provider>
  );
};

export default ListingItem;
