import React from "react";
import PropTypes from "prop-types";
import "../../styling/AddUnit.css";

export const AddRental = ({
  unitNumber,
  unitAddress,
  rent,
  deposit,
  term,
  startDate,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="input-container">
      <form className="custom-form" onSubmit={onSubmit}>
        <label className="custom-input">
          <input
            type="text"
            value={unitNumber}
            name="unitNumber"
            onChange={onChange}
          />
          <span className="placeholder"> Unit Number </span>
        </label>
        <label className="custom-input">
          <input
            type="text"
            value={unitAddress}
            name="unitAddress"
            onChange={onChange}
          />
          <span className="placeholder"> Address </span>
        </label>
        <label className="custom-input">
          <input type="text" value={rent} name="rent" onChange={onChange} />
          <span className="placeholder"> Rent </span>
        </label>
        <label className="custom-input">
          <input
            type="text"
            value={deposit}
            name="deposit"
            onChange={onChange}
          />
          <span className="placeholder"> Deposit </span>
        </label>
        <label className="custom-input">
          <input type="text" value={term} name="term" onChange={onChange} />
          <span className="placeholder"> Term </span>
        </label>
        <label className="custom-input">
          <input
            type="text"
            value={startDate}
            name="startDate"
            onChange={onChange}
          />
          <span className="placeholder"> Start Date </span>
        </label>
        {/* <label class="custom-input">
        <input type="text" value={Status} name="Status" onChange={onChange} />
        <span className="placeholder"> Status </span>
      </label> */}
        <div className="button-container">
          <button type="submit" className="custom-button">
            LIST PROPERTY
          </button>
        </div>
      </form>
    </div>
  );
};

// export default AddRental;

// AddUnit.propTypes = {
//   unitNumber: PropTypes.string.isRequired,
//   unitAddress: PropTypes.string.isRequired,
//   Rent: PropTypes.string.isRequired,
//   Deposit: PropTypes.string.isRequired,
//   Term: PropTypes.string.isRequired,
//   StartDate: PropTypes.string.isRequired,
//   Status: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired,
//   onSubmit: PropTypes.func.isRequired,
// };
