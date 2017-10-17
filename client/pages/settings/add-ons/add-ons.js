import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import map from 'lodash/map';

import { getStoreModule, updateStoreModule, alert } from '~/actions';
import FormGroup from '~/components/form-group/formGroup';

const restaurantAddOns = {
  "qsr_mode_enabled": "QSR mode",
  "clear_table_after_checkout": "Clear table after checkout",
  // "": "Show order time for each line item",
  "auto_lock": "Automatically lock POS when an order is saved",
};

const permissionAddOns = {

  "permission_enabled": "Enable Store Permission",
  "overwrite_price_enabled": "Allow manager to overwrite product price at checkout",
  "time_clock_enabled": "Enable Time Clock",
  "loyalty_enabled": "Enable Loyalty",
  // "": "Support Serialized Inventory",
  "cash_management_enabled": "Cash Management",
  "bill_of_material_enabled": "Enable Bill of Material"
};

const inventoryAddOns = {
  "quantity_allow_decimal": "Allow decimal inventory quantity",
  "quantity_decimal_points" : "Quantity decimal points",
  "costing_method": "Costing method"
};

const otherInventoryAddOns = {
  "kitchen_alias_enabled": "Kitchen Alias Enabled"
};

const paymentAddOns = {
  "payment_check_enabled": "Check Payment",
};

const miscAddOns = {
  "gift_receipt_enabled": "Gift Receipt",
  "allow_change_meal_period_enabled": "Allow Change Meal Period",
  "po_tax_enabled": "Apply Tax for Purchase Order",
  "discount_breakdown_line_item_level": "Show discount breakdown on printed receipt",
  // "": "Allow all",
  // "": "Allow partially",
  // "": "Use A5 paper for AirPrint Receipt (default A4)",
  "always_print_receipt_enabled": "Always print receipt when checkout",
  // "" : "Double print receipt",
  // "" : "Double print check",
  // "" : "Auto popup modufuer when checkout",
  "track_associate_sales_enabled": "Track sales by associate",
  // "": "Automatically attribute line-item to cashier",
  "line_item_code_enabled": "Enable Line Itme Barcode",
  "round_tax_line_item_level": "Round Tax Line Item Level",
  "separate_tax_and_service_fee": "Separate Tax and Service Charge",
  "show_zero_dollar_item_on_printed_receipt_enabled": "Show zero amount line itme on printed receipt",
  // "": "Display product quantity for menu",
  "require_cvv_for_card_presence_transactions": "Require CVV For Card Presence Transactions",
  "lock_table_after_print_check": "Lock Table After Print Check"
  // "": "Hold an item to the invoice without sending to kitchen",
};

const quantity_allow_decimal_options = {
  QUANTITY_ALLOW_DECIMAL_NO: 0,
  QUANTITY_ALLOW_DECIMAL_ALLOW_PARTIALLY: 1,
  QUANTITY_ALLOW_DECIMAL_ALLOW_ALL: 2,
};

const quantity_decimal_points_options = {
  // QUANTITY_DECIMAL_POINTS_ZERO_DP: 0,
  QUANTITY_DECIMAL_POINTS_ONE_DP: 1,
  QUANTITY_DECIMAL_POINTS_TWO_DP: 2,
  QUANTITY_DECIMAL_POINTS_THREE_DP: 3,
  QUANTITY_DECIMAL_POINTS_FOUR_DP: 4,
};

const listing_costing_methods = {
  MARKET_TO_MARKET: 0,
  WEIGHTED_AVERAGE_COST: 1,
  FIXED_PRICE: 2,
  FIRST_IN_FIRST_OUT: 4
};

let allAddOns = Object.assign({}, restaurantAddOns, permissionAddOns, inventoryAddOns, miscAddOns, paymentAddOns, otherInventoryAddOns);

function AddOnInput(props) {
  let { field, addOn } = props;
  return (
    <p>
      <label>
        <input
          type="checkbox"
          onChange={ field.onChange }
          checked={ field.checked } /> { addOn }
      </label>
    </p>
  );
}
AddOnInput.propTypes = {
  field: PropTypes.object,
  addOn: PropTypes.string,
};

function formComponent(props) {
  let { handleSubmit, fields, isRestaurant } = props;

  return (
    <form onSubmit={ handleSubmit }>
      {
        isRestaurant ? (
          <div>
            <h4>Resturant</h4>
            {
              map(restaurantAddOns, (addOn, key) => (
                <AddOnInput field={ fields[key] } addOn={ addOn } key={ key } />
              ))
            }
            <hr />
          </div>
        ) : null
      }

      <div>
        <h4>Inventory</h4>
          <FormGroup>
            <label>Allow decimal quantity ?</label> &nbsp;
            <select value={ fields.quantity_allow_decimal.value } onChange={ fields.quantity_allow_decimal.onChange }>
              <option value={ quantity_allow_decimal_options.QUANTITY_ALLOW_DECIMAL_NO }>Don't allow</option>
              <option value={ quantity_allow_decimal_options.QUANTITY_ALLOW_DECIMAL_ALLOW_PARTIALLY }>Allow all</option>
              <option value={ quantity_allow_decimal_options.QUANTITY_ALLOW_DECIMAL_ALLOW_ALL }>Allow partially</option>
            </select>
          </FormGroup>
        <FormGroup>
          <label>Costing method: </label> &nbsp;
          <select value={ fields.costing_method.value } onChange={ (e) => fields.costing_method.onChange(parseInt(e.target.value)) }>
            <option value={ listing_costing_methods.MARKET_TO_MARKET }>Market to market</option>
            <option value={ listing_costing_methods.WEIGHTED_AVERAGE_COST }>Weighted average cost</option>
            {/*<option value={ listing_costing_methods.FIXED_PRICE }>Fixed price</option>*/}
            {/*<option value={ listing_costing_methods.FIRST_IN_FIRST_OUT }>First in first out</option>*/}
          </select>
        </FormGroup>
          {
            fields.quantity_allow_decimal.value > 0 ? (
              <FormGroup>
                <label>{ inventoryAddOns.quantity_decimal_points }</label>  &nbsp;

                <select value={ fields.quantity_decimal_points.value } onChange={ fields.quantity_decimal_points.onChange }>
                  {
                    map(quantity_decimal_points_options, option => (
                      <option value={ option }>{ option }</option>
                    ))
                  }
                </select>
              </FormGroup>
            ) : null
          }

          <br/>

          {
            map(otherInventoryAddOns, (addOn, key) => (
              <AddOnInput field={ fields[key] } addOn={ addOn } key={ key } />
            ))
          }

      </div>
      <hr />
      <div>
        <h4>Permission</h4>
        {
          map(permissionAddOns, (addOn, key) => (
            <AddOnInput field={ fields[key] } addOn={ addOn } key={ key } />
          ))
        }
      </div>
      <hr />
      <div>
        <h4>Payment</h4>
        {
          map(paymentAddOns, (addOn, key) => (
            <AddOnInput field={ fields[key] } addOn={ addOn } key={ key } />
          ))
        }
      </div>
      <hr />
      <div>
        <h4>Misc</h4>
        {
          map(miscAddOns, (addOn, key) => (
            <AddOnInput field={ fields[key] } addOn={ addOn } key={ key } />
          ))
        }
      </div>


    </form>
  );
}

let fields = map(allAddOns, (addOn, key) => key);

formComponent.propTypes = {
  fields: PropTypes.object,
  handleSubmit: PropTypes.func,
  isRestaurant: PropTypes.bool,
};

let SettingsForm = reduxForm({
  form: 'SettingsStorecredits',
  fields: fields,
})(formComponent);

function mapStateToProps(state, ownProps) {
 return state;
}
function mapDispatchToProps(dispatch) {
  const actions = { getStoreModule, updateStoreModule, alert };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class AddOns extends Component {
  static propTypes = {
    actions: PropTypes.object,
    params: PropTypes.object,
  }
  static contextTypes = {
    currentStore: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    const { store_id } = this.props.params;
    const { getStoreModule } = this.props.actions;

    getStoreModule(store_id);
  }
  submitForm = () => {
    this.refs.SettingsForm.submit();
  }

  updateSettings = (data) => {
    const { updateStoreModule, alert } = this.props.actions;
    const { store_id } = this.props.params;

    updateStoreModule(store_id, {store_id: store_id, module: data}).then(() => {
      alert('success', 'Add-Ons setting saved.');
    });
  }

  render() {
    const { module = {} } = this.context.currentStore;
    let isRestaurant = !!module.restaurant_features_enabled;
    return (
        <div className="main-content">
          <header className="main-content-header columns">
            <h1 className="main-content-title columns-main">Add-Ons</h1>
            <div>
              <button className="btn btn-primary btn-sm" onClick={ this.submitForm }>Save</button>
            </div>
          </header>
          <div className="main-content-section">
            <SettingsForm ref="SettingsForm" isRestaurant={ isRestaurant } initialValues={ module } onSubmit={ this.updateSettings } />
          </div>
        </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(AddOns);
