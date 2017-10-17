import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import FormGroup from '../../../components/form-group/formGroup';

export const fields = ['code_from', 'code_to'];

class NewVoucherForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    voucher: PropTypes.object,
  };

  render(){

    const {
      fields: { code_from, code_to },
      handleSubmit
    } = this.props;

    return (
      <form id="NewVoucherForm" onSubmit={ handleSubmit }>
        <div className="row">
          <div className="col-sm-6">
            <FormGroup state={ code_from }>
              <label>START</label>
              <input type="text" className="form-control" { ...code_from } />
            </FormGroup>
          </div>
          <div className="col-sm-6">
            <FormGroup state={ code_to }>
              <label>END</label>
              <input type="text" className="form-control" { ...code_to } />
            </FormGroup>
          </div>
        </div>
      </form>
    );
  }
}

let formOptions = {
  form: 'voucherOverview',
  fields,
  // validate
};

export default reduxForm(formOptions)(NewVoucherForm);
