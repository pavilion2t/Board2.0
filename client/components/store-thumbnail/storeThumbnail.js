/* eslint react/prop-types: 0 */

import './storeThumbnail.scss';

import React from 'react';

import placeholder from './images/store_placeholder.png';

function StoreThumbnail(props) {
  let image_path = props.src || placeholder;
  let className = 'store-thumbnail '+ props.className;

  return <img {...props} className={ className } src={ image_path } />;
}

export default StoreThumbnail;
