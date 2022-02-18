import React from "react";
import "../../App.css";
import "../../styling/Units.css";
import "../../styling/UnitCard.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// import { image } from "../images/apts/apt1.jpg";

export const RentalCard = ({
  toggleEditing,
  unit,
  image,
  path,
  onChange,
  onDelete,
  index,
}) => (
  <li className="cards__unit">
    <div className="cards__unit__link">
      <figure className="cards__unit__pic-wrap" data-category="Luxury">
        <img className="cards__unit__img" src="/images/apts/apt1.jpeg" />
      </figure>
      <div className="cards__unit__info">
        {unit.isEditing ? (
          <div className="editing__container">
            <div className="editing__input">
              <h4 className="editing__unit__text">Unit Number: </h4>
              <input
                type="text"
                name="unitNumber"
                placeholder={unit.unitNumber}
                value={unit.name}
                onChange={(event) => onChange(event, index)}
                required
              />
            </div>
            <div className="editing__input">
              <h4 className="editing__unit__text">Unit Address: </h4>
              <input
                type="text"
                name="unitAddress"
                placeholder={unit.unitAddress}
                value={unit.name}
                onChange={(event) => onChange(event, index)}
                required
              />
            </div>
            <div className="editing__input">
              <h4 className="editing__unit__text">Rent: </h4>
              <input
                type="text"
                name="rent"
                placeholder={unit.rent}
                value={unit.name}
                onChange={(event) => onChange(event, index)}
                required
              />
            </div>
            <div className="editing__input">
              <h4 className="editing__unit__text">Deposit: </h4>
              <input
                type="text"
                name="deposit"
                placeholder={unit.deposit}
                value={unit.name}
                onChange={(event) => onChange(event, index)}
                required
              />
            </div>
            <div className="editing__input">
              <h4 className="editing__unit__text">Term: </h4>
              <input
                type="text"
                name="term"
                placeholder={unit.term}
                value={unit.name}
                onChange={(event) => onChange(event, index)}
                required
              />
            </div>
            <div className="editing__input">
              <h4 className="editing__unit__text">Unit Number: </h4>
              <input
                type="text"
                name="startDate"
                placeholder={unit.startDate}
                value={unit.name}
                onChange={(event) => onChange(event, index)}
                required
              />
            </div>
          </div>
        ) : (
          <div className="cards__unit__text">
            <h4 className="cards__unit__text">
              Unit Number: {unit.unitNumber}
            </h4>
            <h4 className="cards__unit__text">
              Unit Address: {unit.unitAddress}
            </h4>
            <h4 className="cards__unit__text">Rent: {unit.rent} ETH</h4>
            <h4 className="cards__unit__text">Deposit: {unit.deposit} ETH</h4>
            <h4 className="cards__unit__text">Term: {unit.term} Months</h4>
            <h4 className="cards__unit__text">Start Date: {unit.startDate}</h4>
            <h4 className="cards__unit__text">Status: Available</h4>
            {/* <div className="row justify-content-center mb-4">
              <p className="card-text">
                <span className="badge badge-secondary py-2 mr-5">
                  unitAddress
                </span>
                <span>${unit.unitAddress}</span>
              </p>
            </div> */}
          </div>
        )}

        <div className="row justify-content-center">
          <div>
            <button
              type="button"
              className="btn btn-primary mr-2"
              onClick={toggleEditing}
            >
              {unit.isEditing ? "Save" : "Edit"}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </li>
);

// UnitCard.propTypes = {
//   image: PropTypes.string.isRequired,
//   item: PropTypes.shape({
//     name: PropTypes.string.isRequired,
//     price: PropTypes.string.isRequired,
//   }),
//   toggleEditing: PropTypes.func.isRequired,
//   onChange: PropTypes.func.isRequired,
// };
