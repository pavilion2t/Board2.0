import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import './input-box.scss';

export default class InputBox extends Component {
  static propTypes = {
    title: PropTypes.string,
    containerClass: PropTypes.string,
    success: PropTypes.bool,
    failure: PropTypes.bool,
  };

  static defaultProps = {
    onChange: () => {},
    containerClass: ''
  };

  render() {
    const { title, failure, success, containerClass } = this.props;

    return (
      <div className={ `input-box ${containerClass}` }>
        { (title != false) && <p className="input-box__title">{ title }</p> }
        <input className={ classnames('input-box__input', { '_failure': failure }) } { ...this.props } />
        { success && <i className="fa fa-check input-box__status _success"/> }
        { failure && <span className="input-box__status _failure">failed</span> }
      </div>
    );
  }
}
