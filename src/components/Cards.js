import React from "react";
import "../styling/Cards.css";
import CardItem from "./CardItem";

function Cards() {
  return (
    <div className="cards">
      <h1>Check out these EPIC Rentals!</h1>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src="/images/apts/apt1.jpeg"
              text="Beautiful 2-Story Penthouse in Tribeca"
              label="TRIBECA"
              path="/details"
            />
            <CardItem
              src="/images/apts/apt2.jpeg"
              text="Brooklyn Loft With Stunning Views of Manhattan"
              label="BROOKLYN"
              path="/details"
            />
          </ul>
          <ul className="cards__items">
            <CardItem
              src="/images/apts/apt3.jpeg"
              text="Former Textile Factory Converted Into One of a Kind Apartment"
              label="BROOKLYN"
              path="/details"
            />
            <CardItem
              src="/images/apts/apt4.jpeg"
              text="Rare Luxury Apartment Meatpacking District"
              label="MEATPACKING"
              path="/details"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
