import './inventory.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import find from 'lodash/find';

import Loading from '~/components/loading/loading';


const taxTypes = [
  {id:1, name:"Tax (Default)"},
  {id:2, name:"Service Fee"},
  {id:3, name:"Bottle Deposit"}
];

const taxMethods = [
  {id: 1, name: "Normal (Default)", detail: ""},
  {id: 2, name: "Threshold", detail: "Product price equal or over threshold amount, tax would automatically applied to entire order."},
  {id: 3, name: "Exempt", detail: "The Tax above specific amount only extra amount is taxable."}
];





class _TaxOptionForm extends Component {
  static propTypes = {
    activeIds: PropTypes.array.isRequired,
    taxOptions: PropTypes.array.isRequired,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func,
  };

  render(){
    let { taxOptions, fields, handleSubmit } = this.props;

    // fields.taxOptions is [] at start
    if (fields.taxOptions.length < 1) {
      return null;
    }

    return (
      <form id="TaxOptionForm" onSubmit={ handleSubmit }>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Tax Type</th>
            <th>Tax Rate</th>
            <th>Method</th>
            <th>Threshold</th>
            <th>Included in price</th>
            <th>Priority</th>
            <th>Enable</th>
          </tr>
        </thead>
        <tbody>
          {
            map(taxOptions, (taxOption, index) => (
              <tr key={ taxOption.id }>
                <td>{ taxOption.name }</td>
                <td>{ taxOption.tax_type_name }</td>
                <td>{ taxOption.tax_rate_text }</td>
                <td>{ taxOption.method_name }</td>
                <td>{ taxOption.threshold }</td>
                <td>{ taxOption.included_in_price ? 'YES': 'NO' }</td>
                <td>{ taxOption.priority }</td>
                <td><input
                        type="checkbox"
                        defaultChecked={ fields.taxOptions[index].active.defaultValue }
                        onChange={ fields.taxOptions[index].active.onChange }
                        ng-click="validateTaxOptions(taxOptions, taxOption)" /></td>
              </tr>
            ))
          }
        </tbody>
      </table>
      </form>
    );
  }
}



import { reduxForm } from 'redux-form';

const fields = [
  'taxOptions[].active',
  'taxOptions[].id',
];


const mapStateToProps = (state, ownProps) => {
  let initialValues = {
    taxOptions: map(ownProps.taxOptions, taxOption => {
      return {
        id: taxOption.id,
        active: ownProps.activeIds.includes(taxOption.id)
      };
    })
  };

  let props = {
    initialValues: initialValues
  };
  return props;
};


let TaxOptionForm = reduxForm({
  form: 'inventoryEditTaxOption',
  fields,
  // validate: validator
}, mapStateToProps)(_TaxOptionForm);

class InventoryShowTax extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };
  static propTypes = {
    appState: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentDidMount() {
    let { params, actions} = this.props;
    actions.getTaxOptions(params.store_id);
  }

  handleSubmit = (data) => {
    let { actions, params } = this.props;
    let backPath = `/v2/${params.store_id}/inventory/${params.listing_id}/tax`;

    let taxOptionIds = reduce(data.taxOptions, (acc, taxOption) => {
      if (taxOption.active) {
        acc.push(taxOption.id);
      }
      return acc;
    }, []);

    actions.updateListing(params.store_id, params.listing_id, { tax_option_ids: taxOptionIds })
    .then(res => {
      this.context.router.push(backPath);
    })
    .catch(res => {
      alert(res.message);
    });
  }

  render(){
    let { appState, params } = this.props;
    let { listings, taxOptions } = appState.entities;
    let listing = listings[params.listing_id];
    let backPath = `/v2/${params.store_id}/inventory/${params.listing_id}/tax`;


    let _parser = function (taxOption) {
      let option = taxOption;
      if (option.tax_type !== 3) { // If not Bottle Deposit
        option.tax_rate_text = (parseFloat(option.tax_rate*100)).toFixed(4) + '%';
      } else {
        option.tax_rate_text = '$' + option.tax_rate;
      }
      try {
        option.tax_type_name = find(taxTypes, {id: option.tax_type}).name;
        option.method_name = find(taxMethods, {id: option.method}).name;
      } catch (e) {
        // fall back
        option.tax_type_name = 'not set';
        option.method_name = 'not set';
      }
      return option;
    };


    if (!listing) {
      return <Loading>Loading Listing</Loading>;
    }

    if (!taxOptions) {
      return <Loading>Loading taxOptions</Loading>;

    } else {

      taxOptions = map(taxOptions, value => _parser(value));

      return (
        <div className="main-content">
          <header className="main-content-header columns">
            <h1 className="main-content-title columns-main">Inventory - { listing.name }</h1>
            <div>
              <Link to={ backPath } className="btn btn-secondary btn-sm">Cancel</Link> &nbsp;
              <button className="btn btn-primary btn-sm" form="TaxOptionForm">Save Tax Options</button>
            </div>
          </header>
          <div className="main-content-section">

          <TaxOptionForm taxOptions={ taxOptions } activeIds={ listing.tax_option_ids } onSubmit={ this.handleSubmit } />

          </div>
        </div>
      );
    }
  }
}


export default InventoryShowTax;
