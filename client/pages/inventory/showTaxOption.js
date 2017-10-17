import './inventory.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import find from 'lodash/find';

import Loading from '~/components/loading/loading';
import Can from '~/components/can/can';


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

class InventoryShowTax extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentDidMount() {
    let { params, actions} = this.props;
    actions.getTaxOptions(params.store_id);
  }

  render(){
    let { appState, params } = this.props;
    let { listings, taxOptions } = appState.entities;
    let listing = listings[params.listing_id];
    let editPath = `/v2/${params.store_id}/inventory/${params.listing_id}/tax/edit-tax`;

    let _parser = function (taxOption) {
      let option = taxOption;
      if (option.tax_type !== 3) { // If not Bottle Deposit
        option.tax_rate_text = (parseFloat(option.tax_rate)*100).toFixed(4) + '%';
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

      let activeTaxOptions = reduce(listing.tax_option_ids, (acc, id) => {
        if (taxOptions[id]) {
          acc.push(_parser(taxOptions[id]));
        }
        return acc;
      }, []);

      let taxOptionsLength = map(taxOptions, 'id').length;

      return (
        <div className="main-content">
          <header className="main-content-header columns">
            <h1 className="main-content-title columns-main">Inventory - { listing.name }</h1>
            <div>
              <Can action="inventory:edit">
                <Link to={ editPath } className="btn btn-primary btn-sm">Edit Tax Options</Link>
              </Can>
            </div>
          </header>
          <div className="main-content-section">
          <p>{ activeTaxOptions.length } of { taxOptionsLength } tax options seleced.</p>


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
              </tr>
            </thead>
            <tbody>
              {
                map(activeTaxOptions, (taxOption, index) => (
                  <tr key={ taxOption.id }>
                    <td>{ taxOption.name }</td>
                    <td>{ taxOption.tax_type_name }</td>
                    <td>{ taxOption.tax_rate_text }</td>
                    <td>{ taxOption.method_name }</td>
                    <td>{ taxOption.threshold }</td>
                    <td>{ taxOption.included_in_price ? 'YES': 'NO' }</td>
                    <td>{ taxOption.priority }</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          </div>
        </div>
      );
    }
  }
}

export default InventoryShowTax;
