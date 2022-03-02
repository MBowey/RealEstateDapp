import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Text from "./Text";
import "../styling/BalanceCard.css";
import { colors } from "../theme";
import useEth from "../hooks/useEth";
import { shortenAddress } from "../utils/shortenAddress";

const BalanceCard = () => {
  const { active, account } = useWeb3React();
  const { fetchEthBalance, ethBalance } = useEth();

  useEffect(() => {
    if (account) {
      fetchEthBalance();
    }
  }, [account]);

  if (!active) {
    return <Text>{""}</Text>;
  }

  return (
    <div className="balance-container">
      <Text color="white">Address: </Text>
      <Text color="white">{shortenAddress(account)}</Text>
      <Text block color="white">
        ETH Balance:
      </Text>
      <Text color="white">
        {ethBalance} <i className="fab fa-ethereum"></i>{" "}
      </Text>
    </div>
  );
};

export default BalanceCard;
