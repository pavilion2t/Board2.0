import React, { Component, PropTypes } from 'react';

import InputSelectBox from '~/components/input-select-box';

export default class Step extends Component {
  static propTypes = {
    stepNumber: PropTypes.number.isRequired,
  };

  static defaultProps = {
    placeholder: ''
  };

  render() {
    const { stepNumber }  = this.props;

    let title = stepNumber === 0 ? 'WORKFLOW' : `STEP ${stepNumber + 1}`;

    return (
      <div className="row">
        <div className="col-sm-6 col-md-3">
          <InputSelectBox title={ title } { ...this.props }/>
        </div>
      </div>
    );
  }
}
