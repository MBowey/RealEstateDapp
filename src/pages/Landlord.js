import React from "react";
import "../App.css";
import Rentals from "../components/Rentals/Rentals";
import HeroSection from "../components/HeroSection";
import Listings from "../components/Listings";

function Landlord() {
  return (
    <>
      <Rentals />
      <Listings />
    </>
  );
}

export default Landlord;
