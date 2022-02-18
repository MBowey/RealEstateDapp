import React from "react";
import "../App.css";
import { Button } from "./button";
import "../styling/HeroSection.css";

function HeroSection() {
  return (
    <div className="hero-container">
      <h1>YOUR LUXURY RENTAL AWAITS</h1>
      <p>What are you waiting for?</p>
      <div className="hero-btns">
        <Button
          to="/landlord"
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
        >
          LIST YOUR PROPERTY
        </Button>
        <Button
          to="/tenant"
          className="btns"
          buttonStyle="btn--primary"
          buttonSize="btn--large"
        >
          FIND YOUR HOME <i className="fas fa-search"></i>
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
