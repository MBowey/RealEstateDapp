import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import Text from "./Text";
import { StyledHeaderBox } from "./StyledHelpers";
import { injected } from "../connectors";
import { shortenAddress } from "../utils/shortenAddress";
import { useAppContext } from "../AppContext";
import { Button } from "./button";

const ConnectBtn = styled.button`
  background-color: transparent;
  color: #fff;
  padding: 8px 20px;
  border: 1px solid var(--primary);
  transition: all 0.3s ease-out;
  margin-left: 10px;
  font-size: 1rem;
  &:hover {
    background-color: #fff;
    color: #242424;
    border-radius: 0;
  }
`;

const pageState = {
  LOADING: "LOADING",
  READY: "READY",
};

const onLogOut = (deactivate, cb) => {
  deactivate();
  cb();
};

const MetamaskConnectButton = () => {
  const navigate = useNavigate();
  const { setContentError } = useAppContext();
  const { activate, active, account, deactivate } = useWeb3React();
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
      <ConnectBtn
        buttonStyle="btn--outline"
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
        CONNECT
      </ConnectBtn>
    );
  }

  return (
    <StyledHeaderBox>
      <Text uppercase color="white">
        {shortenAddress(account)}
      </Text>
      <ConnectBtn
        buttonStyle="btn--outline"
        onClick={() => onLogOut(deactivate, () => navigate("/"))}
      >
        LOG OUT
      </ConnectBtn>
    </StyledHeaderBox>
  );
};

export default MetamaskConnectButton;
