import React from "react";
import "../App.css";
import Rentals from "../components/Rentals/Rentals";
import Listings from "../components/Listings/Listings";

function Landlord() {
  return (
    <>
      <Rentals />
      <Listings />
    </>
  );
}

export default Landlord;
