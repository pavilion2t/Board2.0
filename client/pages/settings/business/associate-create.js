import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import map from 'lodash/map';

import FormGroup from '~/components/form-group/formGroup';


function AssociateCreate(props) {
  let { handleSubmit, roles } = props;
  let { full_name, user_email, password, role_id } = props.fields;



  return (
    <form onSubmit={ handleSubmit }>
      <FormGroup>
        <label>Full Name</label>
        <input type="text" className="form-control" onChange={ full_name.onChange } value={ full_name.value } />
      </FormGroup>

      <FormGroup>
        <label>Email</label>
        <input type="text" className="form-control"  onChange={ user_email.onChange } value={ user_email.value } />
      </FormGroup>

      <FormGroup>
        <label>Password (at least 6 characters)</label>
        <input type="text" className="form-control"  onChange={ password.onChange } value={ password.value } />
      </FormGroup>

      <FormGroup>
        <label>Role</label>
        <select onChange={ role_id.onChange } value={ role_id.value } className="form-control">
          {
            map(roles, (role_id, key) => (
              <option key={ key } value={ key }>{ role_id }</option>
            ))
          }
        </select>
      </FormGroup>

    </form>
  );
}
AssociateCreate.propTypes = {
  fields: PropTypes.object,
  handleSubmit: PropTypes.func,
  roles: PropTypes.object,
};

export default reduxForm({
  form: 'paymentType',
  initialValues: {
    role_id: 1,
  },
  fields: [
    'full_name',
    'user_email',
    'password',
    'role_id',
  ]
})(AssociateCreate);
