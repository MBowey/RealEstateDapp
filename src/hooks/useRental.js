import { useEffect, useState } from "react";
import { useContract } from "./useContract";
import RentalsABI from "../static/RentalsABI";
import useIsValidNetwork from "./useIsValidNetwork";
import { useWeb3React } from "@web3-react/core";
import { useAppContext } from "../AppContext";

export const useRental = () => {
  const { account } = useWeb3React();
  const { isValidNetwork } = useIsValidNetwork();
  const rentalsContractAddress = "0xFc7dF251862cC3B2A06FDE664e3f7aB7954802b6";
  const rentalsContract = useContract(rentalsContractAddress, RentalsABI);
  const { setTxnStatus } = useAppContext();
  const [rentalsAddress, setRentalsAddress] = useState(null);

  // useEffect(() => {
  //   if (chainId) {
  //     setRentalsAddress(RentalsABI.networks[chainId]?.address);
  //   }
  // }, [chainId]);

  const addRental = async (
    unitNumber,
    unitAddress,
    rent,
    deposit,
    term,
    startDate
  ) => {
    if (account && isValidNetwork) {
      try {
        setTxnStatus("LOADING");
        const txn = await rentalsContract.methods.addUnit(
          unitNumber,
          unitAddress,
          rent,
          deposit,
          term,
          startDate,
          { from: account }
        );
        await txn.wait(1);
        setTxnStatus("SUCCESS");
      } catch (error) {
        setTxnStatus("ERROR");
      }
    }
  };

  // const getRental = async (id) => {

  return {
    addRental,
  };
};
