import React, { Component, PropTypes } from 'react';
import InputBox from '../input-box';

import './input-add.scss';

export default class InputAdd extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    failure: PropTypes.bool.isRequired
  };

  render() {
    const { onChange, onAdd, value, failure } = this.props;

    return (
      <div className="input-add">
        <a className="input-add__btn" onClick={ onAdd }>
          <i className="fa fa-plus"/>
        </a>
        <form className="input-add__form"  onSubmit={ onAdd }>
          <InputBox type="input-add__input"
                    value={ value }
                    failure={ failure }
                    placeholder=""
                    onChange={ (e) => onChange(e.target.value) }/>
        </form>
      </div>
    );
  }
}
