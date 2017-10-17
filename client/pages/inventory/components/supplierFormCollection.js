import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import compact from 'lodash/compact';
import validate from 'validate.js';

import SupplierForm from './supplierForm';

export const fields = [
  'supplierForms[].isDefault',
  'supplierForms[].id',
  'supplierForms[].productId',
  'supplierForms[].point',
  'supplierForms[].cost',
  'supplierForms[].amount',
  'supplierForms[].margin'
];

class SupplierFormCollection extends Component {
  static propTypes = {
    listing: PropTypes.object.isRequired,
    suppliers: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired
  };

  handleRemove(index) {
    const {
      fields: { supplierForms }
    } = this.props;

    supplierForms.removeField(index);
  }

  handleDefaultSet(index) {
    const {
      fields: { supplierForms }
    } = this.props;

    let defaultValue = !!supplierForms[index].isDefault.value;
    supplierForms.map(form => {
      form.isDefault.onChange(false);
    });
    supplierForms[index].isDefault.onChange(!defaultValue);
  }

  render() {
    const {
      fields: { supplierForms },
      listing,
      suppliers,
      handleSubmit,
      onCancel
    } = this.props;

    return (
      <form onSubmit={ handleSubmit }>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main">Inventory</h1>
          <div>
            <button className="btn btn-secondary btn-sm" onClick={ onCancel }>Cancel</button> &nbsp;
            <button type="submit" className="btn btn-primary btn-sm">Save</button>
          </div>
        </header>
        <div className="main-content-section">
          {
            supplierForms.length < 1 ? (
              <p>No supplier</p>
            ) : (
              <p>{ supplierForms.length } suppliers</p>
            )
          }
          {
            supplierForms.map((supplierForm, index) => (
              <SupplierForm key={ index }
                formKey={ index.toString() }
                listing={ listing }
                suppliers={ suppliers }
                supplierForm={ supplierForm }
                onRemove={ this.handleRemove.bind(this, index) }
                onDefaultSet={ this.handleDefaultSet.bind(this, index) }/>
            ))
          }
          <p className="align-right">
            <span className="btn btn-primary" onClick={ () => {
                supplierForms.addField();
              } }>Add Supplier</span>
          </p>
        </div>
      </form>
    );
  }
}


const mapInitialValue = (state, props) => {
  let { listing } = props;
  let suppliers = listing.suppliers.map(supplier => {
    return {
      isDefault: supplier.default,
      id: supplier.supplier_id,
      cost: supplier.cost,
      point: supplier.reorder_point,
      amount: supplier.reorder_level,
      productId: supplier.supplier_product_id
    };
  });

  let initialValues = {
    initialValues: {
      supplierForms: suppliers
    }
  };

  return initialValues;
};



const constraints = {
  id: {
    presence: {message: "^Must select a supplier "},
  },
};

function validator(values) {
  let result = values.supplierForms.map(v => {
    return validate(v, constraints);
  });
  if (compact(result).length < 1) {
    return {};
  } else {
    return { supplierForms: result };
  }
}

export default reduxForm({
  form: 'inventoryEditSupplier',
  fields,
  validate: validator
}, mapInitialValue)(SupplierFormCollection);
