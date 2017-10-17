/* eslint react/prop-types: 0 */

import './input-checkbox.scss';
import React, { Component } from 'react';


class Checkbox extends Component {
  constructor(props) {
    super(props);
  }
  test = () => {
    return this.refs.input;
  }

  render() {
    let label='test';


    return (
      <div className={ 'input-checkbox '+this.props.wrapperClassName }>
        <label onClick={ this.test }>
          <input id={ label } type="checkbox" {...this.props} ref="input" readOnly />
          <div className="input-checkbox-check"></div>
        </label>
      </div>
    );
  }
}

export default Checkbox;

