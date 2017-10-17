import '../../../node_modules/pikaday/css/pikaday.css';
import './cascadeFilter.scss';

import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';
import DatePicker from 'react-pikaday-component';
import find from 'lodash/find';

const conditions = {
  contain: 'contains',
  equal: 'is',
  between: 'is between',
  date_equal: 'is on',
  date_between: 'is from',
  options: 'is'
};

class CascadeFilter extends Component {
  static propTypes = {
    settings: PropTypes.arrayOf(PropTypes.object).isRequired,
    filter: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    showDelete: PropTypes.bool,
  }

  handleColumnChange = (e) => {
    let selectedColumn = e.target.value;
    let selectedColumnConditions = find(this.state.settings, ['columnName', selectedColumn]).conditions;

    this.setState({
      selectedColumn: selectedColumn,
      selectedColumnConditions: selectedColumnConditions
    });

    this.props.onChange({
      column: selectedColumn,
      condition: selectedColumnConditions[0].value,
      conditionValue: undefined
    });
  }

  handleChange = (e) => {
    let selectedCondition = findDOMNode(this.refs.conditionOptions).value;
    let filter = {
      column: this.state.selectedColumn,
      condition: selectedCondition,
      conditionValue: findDOMNode(this.refs.conditionValue) ? findDOMNode(this.refs.conditionValue).value : undefined,
      conditionFrom: findDOMNode(this.refs.conditionValueFrom) ? findDOMNode(this.refs.conditionValueFrom).value : undefined,
      conditionTo: findDOMNode(this.refs.conditionValueTo) ? findDOMNode(this.refs.conditionValueTo).value : undefined,
    };

    this.props.onChange(Object.assign(this.props.filter, filter));
  }
  handleDelete = (e) => {
    this.props.onDelete();
  }

  render(){

    let settings = this.props.settings.map(setting => {
      setting.conditions = setting.filterConditions.map(filterCondition => {
        return {
          value: filterCondition,
          displayName: conditions[filterCondition]
        };
      });

      return setting;
    });

    let selectedColumn =  this.props.filter.column || settings[0].columnName;
    let selectedColumnConditions = find(settings, ['columnName', selectedColumn]).conditions;
    this.state = {
      settings: settings,
      selectedColumn: selectedColumn,
      selectedColumnConditions: selectedColumnConditions
    };


    // Get columns for choice
    let columnOptions = this.state.settings.map((optionSetting, index) => {
      return (
        <option key={ index } value={ optionSetting.columnName }>{ optionSetting.displayName }</option>
      );
    });

    // Get column's condition
    let conditionOptions = this.state.selectedColumnConditions.map((condition, index)=>{
      return (
        <option  key={ index } value={ condition.value }>{ condition.displayName }</option>
      );
    });
    let { filter, showDelete } = this.props;

    let conditionValueInput;
    let condition = filter.condition || this.state.selectedColumnConditions[0].value;
    switch (condition) {
      case 'between':
        conditionValueInput =(
          <div>
            <input type="text"
              ref="conditionValueFrom"
              className="form-control form-control-sm"
              value={ filter.conditionFrom?filter.conditionFrom:'' }
              onChange={ this.handleChange }/>
            and
            <input type="text"
              ref="conditionValueTo"
              className="form-control form-control-sm"
              value={ filter.conditionTo?filter.conditionTo:'' }
              onChange={ this.handleChange }/>
          </div>
        );
        break;
      case 'date_equal':
        conditionValueInput =(
          <DatePicker
            ref="conditionValue"
            value={ new Date(filter.conditionValue) }
            placeholder="Select Date"
            format="YYYY-MM-DD"
            onChange={ this.handleChange }
          />
        );
        break;
      case 'date_between':
        conditionValueInput = (
          <div>
            <DatePicker
              ref="conditionValueFrom"
              placeholder="Starting Date"
              format="YYYY-MM-DD"
              className="form-control form-control-sm"
              value={ new Date(filter.conditionFrom) }
              onChange={ this.handleChange }
            />
            To
            <DatePicker
              ref="conditionValueTo"
              placeholder="Ending Date"
              format="YYYY-MM-DD"
              className="form-control form-control-sm"
              value={ new Date(filter.conditionTo) }
              onChange={ this.handleChange }
            />
          </div>
        );
        break;
      default:
        conditionValueInput = (
          <input type="text"
            ref="conditionValue"
            className="form-control form-control-sm"
            value={ filter.conditionValue?filter.conditionValue:'' }
            onChange={ this.handleChange } />
        );
        break;
    }

    return (
      <div className="cascade-filter form-group row">
        <div className="col-sm-3">
          <select ref="columnOptions"
            className="form-control form-control-sm"
            value={ filter.column }
            onChange={ this.handleColumnChange } >
            { columnOptions }
          </select>
        </div>
        <div className="col-sm-2">

          <select ref="conditionOptions"
            className="form-control form-control-sm"
            value={ filter.condition }
            onChange={ this.handleChange } >

            { conditionOptions }
          </select>
        </div>
        <div className="col-sm-3">
          { conditionValueInput }
        </div>
        {
          showDelete ? (
            <div className="col-sm-1">
              <a className="text-danger a small" onClick={ this.handleDelete } >remove</a>
            </div>

          ) : null
        }
      </div>
    );
  }
}

export default CascadeFilter;
