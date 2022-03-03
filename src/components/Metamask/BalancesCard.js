import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { shortenAddress } from "../../utils/shortenAddress";
import useEth from "../../hooks/useEth";
import Text from "../Text";
import "../../styling/BalanceCard.css";

const BalanceCard = () => {
  const { active, account } = useWeb3React();
  const { fetchEthBalance, ethBalance } = useEth();

  useEffect(() => {
    if (account) {
      fetchEthBalance();
    }
  }, [account, fetchEthBalance]);

  if (!active) {
    return <Text>{""}</Text>;
  }

  return (
    <div className="balance-container">
      <div className="balance-column1">
        <Text color="white">Address: </Text>
        <Text block color="white">
          ETH Balance:
        </Text>
      </div>
      <div className="balance-column2">
        <Text color="white">{shortenAddress(account)}</Text>
        <Text color="white">
          {ethBalance} <i className="fab fa-ethereum"></i>{" "}
        </Text>
      </div>
    </div>
  );
};

export default BalanceCard;
