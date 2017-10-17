import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import uniqueId from 'lodash/uniqueId';

import ActionButton from '~/components/action-button/action-button';

function PaymentEdit(props) {
  let { handleSubmit } = props;
  let { payment_instruments } = props.fields;

  function addPayment() {
    payment_instruments.addField({_id: uniqueId()});
  }
  function removePayment(index) {
    payment_instruments.removeField(index);
  }

  return (
    <form onSubmit={ handleSubmit }>
      <table className="table">
        <thead>
          <tr>
            <th>Payment Type</th>
            <th>Tipping Enabled</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            payment_instruments ? payment_instruments.map((p, index) => (
              <tr key={ p.id.value || p._id.value }>
                <td><input
                      className="form-control"
                      type="text"
                      placeholder="Enter payment's name"
                      value={ p.name.value }
                      disabled={ p.id.value }
                      onChange={ p.name.onChange } />
                </td>
                <td><input type="checkbox" checked={ p.tipping_enabled.checked } onChange={ p.tipping_enabled.onChange } /></td>
                <td><ActionButton type="delete" onClick={ removePayment.bind(null, index) }>remove</ActionButton></td>
              </tr>
            )) : null
          }
        </tbody>
      </table>

      <ActionButton type="add" onClick={ addPayment }>Create New Payment Type</ActionButton>
    </form>
  );
}
PaymentEdit.propTypes = {
  fields: PropTypes.object,
  handleSubmit: PropTypes.func,
};

export default reduxForm({
  form: 'paymentType',
  fields: [
    'payment_instruments[]._id',
    'payment_instruments[].id',
    'payment_instruments[].name',
    'payment_instruments[].tipping_enabled'
  ]
})(PaymentEdit);
