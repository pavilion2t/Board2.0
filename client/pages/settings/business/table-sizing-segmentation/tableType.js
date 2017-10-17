import React, { Component, PropTypes } from 'react';
import InputBox from '~/components/input-box';
import InputSelectBox from '~/components/input-select-box';

import './tableType.scss';

function optionsFactroy(min) {
  let options = [];
  for (let i = 1; i < 21; i++) {
    options.push({ label: `${i}+`, value: i, disabled: i < min });
  }
  return options;
}

export default class TableType extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    onNameChange: PropTypes.func.isRequired,
    onSizeChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    min: PropTypes.number.isRequired
  };

  render() {
    const { label, size, disabled, onNameChange, onSizeChange, min, onRemove } = this.props;
    return (
      <div className="row table-type">
        <div className="col-md-4">
          <InputBox title="Table Type Name" value={ label } disabled={ disabled } onChange={ (e) => onNameChange(e.target.value) }/>
        </div>
        <div className="col-md-2">
          <InputSelectBox value={ size }
                          valueRenderer={ (opt) => <span>{ opt.value } + People</span> }
                          title="Table Size"
                          placeholder="Select size"
                          resetValue={ undefined }
                          clearable={ false }
                          disabled={ disabled }
                          onChange={ (opt) => onSizeChange(opt.value) }
                          options={ optionsFactroy(min) }/>
        </div>
        { !disabled && <div className="table-type_remove">
          <a className="btn btn-primary btn-sm" onClick={ onRemove }>Remove</a>
        </div> }
      </div>
    );
  }
}
