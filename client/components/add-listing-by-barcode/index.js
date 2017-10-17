import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '~/actions/formActions/addListingByBarcode';

function mapStateToProp(state, ownProps) {
  let thisState = state.forms.addListingByBarcode;
  return { ...thisState, ...ownProps };
}

function mapDispatchToProp(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

@connect(mapStateToProp, mapDispatchToProp)
export default class AddListingByBarcode extends Component {
  static propTypes = {
    storeId: PropTypes.string.isRequired,
    onAdd: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    isSearching: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
    baseSearch:  PropTypes.shape({
      query:    PropTypes.object,
      wildcard: PropTypes.object,
      range:    PropTypes.object,
      missing:  PropTypes.object,
      fields:   PropTypes.arrayOf(PropTypes.string),
      sort:     PropTypes.arrayOf(PropTypes.object),
    }),
  };

  static defaultProps = {
    disabled: false
  };

  handleSearch = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { value, storeId, baseSearch, onAdd } = this.props;
    this.props.actions.submit(value, storeId, baseSearch)
      .then(resp => {
        const { data, error } = resp;
        if (!error) onAdd(data.slice());
      });
  };

  render() {
    const { actions, value, disabled, isSearching } = this.props;
    return (
      <div style={ { display: 'inline-block' } }>
        <form className="form-inline" onSubmit={ this.handleSearch }>
          <input onChange={ (e) => actions.changeInput(e.target.value) }
                 type="text"
                 value={ value }
                 placeholder="UPC/EAN/PLU/SKU"
                 disabled={ disabled || isSearching }/>
          <button className="btn btn-primary btn-sm"
                  type="button"
                  onClick={ this.handleSearch }
                  disabled={ disabled || isSearching }>Enter
          </button>
        </form>
      </div>
    );
  }
}
