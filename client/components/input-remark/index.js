import React, { Component, PropTypes } from 'react';
import './input-remark.scss';


export default class InputRemark extends Component {
  static propTypes = {
      onInputRemark: PropTypes.func.isRequired,
      placeholder: PropTypes.string,
      disabled: PropTypes.bool,
      value: PropTypes.string
  };
  constructor(props) {
      super(props);
      this.handleInput = this.handleInput.bind(this);
  }

  handleInput(event) {
      this.props.onInputRemark(event.target.value);
      event.stopPropagation();
      event.preventDefault();
  }

  render() {
    const { placeholder, disabled, value } = this.props;

    if (disabled) {
        return (
          <div>
            <textarea disabled className="input-remark" placeholder={ value } />
          </div>
        );
    }
    return (
      <div>
        <textarea className="input-remark" placeholder={ placeholder } onChange={ this.handleInput }/>
      </div>
    );
  }
}
