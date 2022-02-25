import React, { useState, useEffect, useCallback } from "react";
import "../styling/Cards.css";
import { Spinner } from "react-bootstrap";
import { colors } from "../theme";
import Text from "./Text";
import { TenantCard } from "../../components/Rentals/RentalCard";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "../hooks/useContract";
import { BigNumber } from "ethers";
import { formatEther } from "@ethersproject/units";

import RentalsABI from "../contracts/Rentals.json";

const listingState = {
  LOADING: "LOADING",
  READY: "READY",
  ERROR: "ERROR",
};

const FilteredListing = ({ listings, status }) => {
  const filtered = listings.filter((l) => l.status === status);

  if (filtered.length < 1) {
    return <Text>Nothing here 🤷</Text>;
  }

  return (
    <StyledDiv>
      {filtered.map((l) => {
        const id = BigNumber.from(l.propertyId).toNumber();
        return <ListingItem key={id} item={l} />;
      })}
    </StyledDiv>
  );
};

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState(listingState.LOADING);
  const { active } = useWeb3React();
  const rentalsAddress = "0x03Bb27A85a288E98C25dC3f4671eD9F4930b31B5";
  const contract = useContract(rentalsAddress, RentalsABI.abi);

  const getUnits = useCallback(async (contract) => {
    try {
      // still on the lookout for optimal solidity data structures, this ain't it
      const idListLengthBN = await contract.unitCount();
      const idListLength = idListLengthBN.toNumber();
      console.log(idListLength);
      for (let i = 1; i < idListLength; i++) {
        const unit = await contract.units(i);
        const units = [...listings, unit];
        setListings(units);
        setStatus(listingState.READY);
        console.log(listings);
      }
    } catch (error) {
      console.log("error:", error);
      setStatus(listingState.ERROR);
    }
  }, []);

  // // const idBNs = await Promise.all(
  // //   Array.from(Array(idListLengthBN.toNumber())).map((_, i) =>
  // //     contract.idList(i)
  // //   )
  // );
  // const ids = idBNs.map((n) => n.toNumber());
  // const arr = await Promise.all(ids.map((id) => contract.properties(id)));
  // setListings(arr);

  useEffect(() => {
    if (active) {
      getUnits(contract);
    }
  }, [active]);

  if (!active) {
    return null;
  }

  if (status === listingState.LOADING) {
    return (
      <Spinner
        animation="border"
        size="sm"
        style={{ color: colors.green, marginTop: "20px" }}
      />
    );
  }

  return (
    // <>
    //   <Text t3 color={colors.green}>
    //     Available listings
    //   </Text>
    //   <FilteredListing listings={listings} status={0} />
    //   <Text t3 color={colors.red} style={{ marginTop: "20px" }}>
    //     Rented
    //   </Text>
    //   <FilteredListing listings={listings} status={1} />
    // </>
    <div className="cards">
      <div className="cards__container">
        <h1>Check out these EPIC Rentals</h1>
        <div className="cards__wrapper">
          <ul className="cards__units">
            {/* {listings.map((unit, index) => (
              <TenantCard
                key={unit.unitNumber}
                index={index}
                src="/images/apts/apt1.jpeg"
                unit={unit}
                // toggleEditing={() => this.toggleUnitEditing(index)}
                // onChange={this.handleUnitUpdate}
                // onDelete={() => this.onDelete(index)}
              />
            ))} */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Listings;

// function Cards() {
//   return (
//     <div className="cards">
//       <div className="cards__container">
//         <h1>Check out these EPIC Rentals</h1>
//         <div className="cards__wrapper">
//           <ul className="cards__units">
//             <Listings />
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Cards;
