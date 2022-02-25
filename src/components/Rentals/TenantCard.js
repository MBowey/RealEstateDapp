import React from "react";
import "../../App.css";
import "../../styling/Units.css";
import "../../styling/UnitCard.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// import { image } from "../images/apts/apt1.jpg";

export const TenantCard = ({
  toggleEditing,
  unit,
  image,
  path,
  //   onChange,
  //   onRent,
  index,
}) => (
  <li className="cards__unit">
    <div className="cards__unit__link">
      <figure className="cards__unit__pic-wrap" data-category="Luxury">
        <img className="cards__unit__img" src="/images/apts/apt1.jpeg" />
      </figure>
      <div className="cards__unit__info">
        <div className="row justify-content-center">
          <div>
            <button
              type="button"
              className="btn btn-primary"
              //   onClick={onRent}
            >
              Rent
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
