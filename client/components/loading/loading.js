/* eslint react/prop-types: 0 */

import './loading.scss';
import React from 'react';

function Loading(props) {
  return (
    <div className="loading-container">
      <div>
        <div className="loading-content">{ props.children }</div>
        <div className="loading">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
        </div>
      </div>
    </div>
  );

}

export default Loading;
