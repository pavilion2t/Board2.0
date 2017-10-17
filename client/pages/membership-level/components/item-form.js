import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import FormGroup from '~/components/form-group/formGroup';

export const fields = ['title', 'note'];

class MembershipForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    voucher: PropTypes.object,
  };

  render(){

    const {
      fields: { title, note },
      handleSubmit
    } = this.props;

    return (
      <form id="MembershipForm" onSubmit={ handleSubmit }>
        <FormGroup state={ title }>
          <label>Title</label>
          <input type="text" className="form-control" onChange={ title.onChange } value={ title.value } />
        </FormGroup>
        <FormGroup state={ note }>
          <label>Note</label>
          <textarea type="text" className="form-control" onChange={ note.onChange } value={ note.value } />
        </FormGroup>
      </form>
    );
  }
}

let formOptions = {
  form: 'membership',
  fields,
  // validate
};

export default reduxForm(formOptions)(MembershipForm);
