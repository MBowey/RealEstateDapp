import React from "react";
import Modal from "react-bootstrap/Modal";
import useWalletConnectionModal from "../../hooks/useWalletConnectionModal";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../../connectors";
import MMLogo from "../static/metamask-logo.svg";
import Button from "react-bootstrap/Button";
import Text from "../Text";
import styled from "styled-components";

const MetamaskLogo = styled.img.attrs({
  src: MMLogo,
})`
  height: 40px;
`;

const ConnectWalletModal = () => {
  const { activate } = useWeb3React();
  const { setWalletConnectModal } = useWalletConnectionModal();
  return (
    <Modal show onHide={() => setWalletConnectModal(false)}>
      <Modal.Header>
        <MetamaskLogo />
        <Text uppercase color="green" t3 lineHeight="40px" className="mx-2">
          Connect your Metamask wallet
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Text block className="mb-5">
          You must connect a wallet to use this decentralized application
        </Text>
        <Button variant="outline-dark" onClick={() => activate(injected)}>
          Connect
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ConnectWalletModal;
