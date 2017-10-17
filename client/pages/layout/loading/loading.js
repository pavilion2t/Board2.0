import './loading.scss';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

function loadingCompoenent(props) {
  let { show, text } = props;
  if (show) {
    return (
      <div className="loading-spinner-wrapper" ng-show="$root.requestCounter">
        <div className="loading-spinner-box">
          <span className="loading-spinner"></span> { text || 'Loading...' }
        </div>
      </div>
    );

  } else {
    return <div></div>;
  }
}
loadingCompoenent.propTypes = {
  show: PropTypes.bool.isRequired,
  text: PropTypes.string,
};


const mapStateToProps = (state) => {
  return {
    show: state.base.loading
  };
};

const Loading = connect(mapStateToProps)(loadingCompoenent);

export default Loading;
