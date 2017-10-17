/* eslint react/no-multi-comp: 0 */

import './supplierForm.scss';

import React, { PropTypes, Component } from 'react';

import * as supplierHelper from '../../../helpers/supplierHelper';
import FormGroup from '../../../components/form-group/formGroup';

class SupplierForm extends Component {
  static propTypes = {
    listing: PropTypes.object.isRequired,
    suppliers: PropTypes.object.isRequired,
    supplierForm: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    onDefaultSet: PropTypes.func.isRequired
  };

  render(){
    let { listing, supplierForm, suppliers } = this.props;

    return (
      <div className="card card-block supplier-form">
        <div className="row">
          <div className="checkbox">
            <label>
              <input type="radio" name="isDefault" checked={ supplierForm.isDefault.value } onChange={ this.props.onDefaultSet } /> Mark as default supplier
              </label>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <FormGroup state={ supplierForm.id }>
              <label>Supplier Name</label>
              <SelectSuppliers suppliers={ suppliers } {...supplierForm.id} />
            </FormGroup>
          </div>
          <div className="col-sm-6">
            <FormGroup state={ supplierForm.productId }>
              <label>Supplier Product ID</label>
              <input type="text" className="form-control" {...supplierForm.productId} />
            </FormGroup>
          </div>
          <div className="col-sm-6">
            <FormGroup state={ supplierForm.point }>
              <label>Reorder Trigger Point</label>
              <input type="number" step="any" className="form-control" {...supplierForm.point} />
            </FormGroup>
          </div>
          <div className="col-sm-6">
            <FormGroup state={ supplierForm.cost }>
              <label>Cost</label>
              <div className="input-group">
                <div className="input-group-addon">$</div>
                <input type="number" step="any" className="form-control" {...supplierForm.cost} />
              </div>
            </FormGroup>
          </div>
          <div className="col-sm-6">
            <FormGroup state={ supplierForm.amount }>
              <label>Reorder Amount</label>
              <input type="number" step="any" className="form-control" {...supplierForm.amount} />
            </FormGroup>
          </div>
          <div className="col-sm-6">
            <FormGroup state={ {} }>
              <label>Margin</label>
              <div className="input-group">
                <input className="form-control" type="text" value={ supplierHelper.getMargin(supplierForm.cost.value, listing.price) } disabled />
                <div className="input-group-addon">%</div>
              </div>
            </FormGroup>
          </div>
        </div>
          <button className="btn btn-secondary btn-sm text-danger" onClick={ this.props.onRemove }>- remove this supplier</button>
      </div>
    );
  }
}

/* eslint react/prop-types: 0 */
function SelectSuppliers(props) {
  const { suppliers, value, onBlur, onChange, ...rest } = props;

  let options = [];
  let counter = 0;
  for (let supplier in suppliers) {
    if (suppliers.hasOwnProperty(supplier)) {
      options.push(<option key={ ++counter } value={ supplier }>{ suppliers[supplier].name }</option>);
    }
  }

  return (
    <select className="form-control"
      value={ value || '' }
      onBlur={ onBlur }
      onChange={ onChange }
      {...rest}>
      <option></option>
      { options }
    </select>
  );
}

export default SupplierForm;
