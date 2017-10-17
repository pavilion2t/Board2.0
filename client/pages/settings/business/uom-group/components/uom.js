import React, { Component, PropTypes } from 'react';

import RemoveButton from '~/components/remove-button';
import InputBox from '~/components/input-box';
// import InputSuggest from '~/components/input-select';

// const UNITS = [
//   { label: 'cup', value: 'cup' },
//   { label: 'doz', value: 'doz' },
//   { label: 'drop(s)', value: 'drop(s)' },
//   { label: 'ea', value: 'ea' },
//   { label: 'g', value: 'g' },
//   { label: 'gal', value: 'gal' },
//   { label: 'kg', value: 'kg' },
//   { label: 'L', value: 'L' },
//   { label: 'lb', value: 'lb' },
//   { label: 'oz', value: 'oz' },
//   { label: 'qt dry', value: 'qt dry' },
//   { label: 'qt liquid', value: 'qt liquid' },
//   { label: 'pc(s)', value: 'pc(s)' },
//   { label: 'tsp', value: 'tsp' },
//   { label: 'ton', value: 'ton' }
// ];

// const getSuggestions = value => {
//   const inputValue = value.trim().toLowerCase();
//   const inputLength = inputValue.length;
//
//   return inputLength === 0 ? UNITS : UNITS.filter(unit =>
//     unit.label.toLowerCase().slice(0, inputLength) === inputValue
//   );
// };

export default class Uom extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    ratio: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    isBaseUnit: PropTypes.bool,

    onRemove: PropTypes.func,
    onNameChange: PropTypes.func.isRequired,
    onRatioChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isBaseUnit: false
  };

  render() {
    const { name, ratio, disabled, onNameChange, onRatioChange, onRemove, isBaseUnit } = this.props;

    let removeable = typeof onRemove === 'function';

    return (
      <div className="row table-type">
        <div className="col-md-3">
          <InputBox title="UNIT NAME"
                    value={ name }
                    disabled={ disabled }
                    onChange={ (e) => onNameChange(e.target.value) }/>
        </div>
        <div className="col-md-2">
          <InputBox title="RATIO"
                    type="number"
                    step="0.0001"
                    min="1"
                    value={ ratio }
                    disabled={ disabled || isBaseUnit }
                    onChange={ (e) => onRatioChange(e.target.value) }/>
        </div>
        <div className="col-md-1">
          { (!disabled && removeable) && <RemoveButton onClick={ onRemove }/> }
        </div>
      </div>
    );
  }
}
