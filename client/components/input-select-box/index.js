import React, { Component, PropTypes } from 'react';
import Select from 'react-select';


import '../input-box/input-box.scss';
import './input-select-box.scss';

export default class InputSelectBox extends Component {
  static propTypes = {
    title: PropTypes.string,
    containerClass: PropTypes.string
  };

  static defaultProps = {
    onChange: () => {},
    containerClass: ''
  };

  render() {
    const { title, containerClass } = this.props;

    return (
      <div className={ `input-box ${containerClass}` }>
        { (title != false) && <p className="input-box__title">{ title }</p> }
        <Select { ...this.props }/>
      </div>
    );
  }
}
