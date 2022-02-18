import React from "react";
import { useWeb3React } from "@web3-react/core";
// import { useRentals } from "../../hooks/useRentals";
import "../App.css";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Text from "../components/Text";

const Home = () => {
  const { active, account } = useWeb3React();

  const NotActive = () => {
    return <Text>Please Connect Your Wallet!!</Text>;
  };

  return (
    <>
      {!active && <NotActive />}
      <HeroSection />
    </>
  );
};

export default Home;
