import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useAppContext } from "../AppContext";
import { injected } from "../connectors";
import "../App.css";
import { Button } from "./button";
import "../styling/HeroSection.css";
import Text from "../components/Text";

const pageState = {
  LOADING: "LOADING",
  READY: "READY",
};

const HeroSection = () => {
  const { activate, active, account } = useWeb3React();
  const { setContentError } = useAppContext();
  const [status, setStatus] = useState(pageState.LOADING);

  useEffect(() => {
    const tryActivate = async () => {
      await activate(injected, () => {
        setStatus(pageState.READY);
      });
      setStatus(pageState.READY);
    };
    tryActivate();
  }, []);

  if (status === pageState.LOADING) {
    return <Text>Loading..</Text>;
  }

  if (status === pageState.READY && !active) {
    return (
      <div className="hero-container">
        <h1>YOUR LUXURY RENTAL AWAITS</h1>
        <p>What are you waiting for?</p>
        <div className="hero-btns">
          <Button
            className="btns"
            buttonStyle="btn--outline"
            buttonSize="btn--large"
            onClick={() => {
              if (!window.ethereum) {
                setContentError(
                  "Looks like you don't have Metamask, you'll need it to use this app."
                );
                return;
              }
              activate(injected, (e) => {
                if (e instanceof UnsupportedChainIdError) {
                  setContentError("Network not supported.");
                }
              });
            }}
          >
            CONNECT METAMASK WALLET
          </Button>
        </div>
      </div>
    );
  }

  // const NotActive = () => {
  //   return <Text>Please Connect Your Wallet!!</Text>;
  // };

  return (
    <div className="hero-container">
      {!active && <NotActive />}
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
};

export default HeroSection;
