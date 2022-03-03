import React, { useEffect, useState } from "react";
import { useAppContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { injected } from "../../connectors";
import { Button } from "../button";
import "../../styling/button.css";
import "../../styling/Navbar.css";

const pageState = {
  LOADING: "LOADING",
  READY: "READY",
  ERROR: "ERROR",
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
    return (
      <Button
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
      </Button>
    );
  }

  if (status === pageState.READY && !active) {
    return (
      <Button
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
      </Button>
    );
  }

  return (
    <Button
      buttonStyle="btn--outline"
      onClick={() => onLogOut(deactivate, () => navigate("/"))}
    >
      LOG OUT
    </Button>
  );
};

export default MetamaskConnectButton;
