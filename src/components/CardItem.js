import React from "react";
import { Link } from "react-router-dom";


const ListingItem = ({ item }) => {
  const { propertyId, description, location, currentRentAmount: amount, imgUrl } = item;
  return (
    <StyledItem>
      <img src={imgUrl} alt="listing" style={{ height: '150px', width: '100%', borderRadius: '5px' }} />
      <StyledItemTextContainer>
        <Text center>{description}</Text>
        <Text center bold color={colors.green}>
          {formatEther(amount)} ETH/mo
        </Text>
        <Text center>{location}</Text>
        {item.status === 0 && (
          <Link
            style={{ textAlign: 'center' }}
            to={{ pathname: '/details', search: `?id=${BigNumber.from(propertyId).toNumber()}` }}
          >
            More info
          </Link>
        )}
        {item.status === 1 && item.tenant && <Text center>Tenant: {shortenAddress(item.tenant)}</Text>}
      </StyledItemTextContainer>
    </StyledItem>
  );
};


function CardItem(props) {
  return (
    <>
      <li className="cards__item">
        <Link className="cards__item__link" to={props.path}>
          <figure className="cards__item__pic-wrap" data-category={props.label}>
            <img
              className="cards__item__img"
              alt="Property Image"
              src={props.src}
            />
          </figure>
          <div className="cards__item__info">
            <h5 className="cards__item__text">{props.text}</h5>
          </div>
        </Link>
      </li>
    </>
  );
}

export default CardItem;
