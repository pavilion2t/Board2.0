import React, { PropTypes } from 'react';

import './house-number.scss';

function HouseNumber(props){
  const count = (props.value || []).length;
  return (
    <span className="house-number">
      <span className="house-number__number">{ count }</span>
      <i className="fa fa-chevron-right house-number__icon"></i>
    </span>
  );
}

HouseNumber.propTypes = {
  value: PropTypes.array,
};

export default HouseNumber;
