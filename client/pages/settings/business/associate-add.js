import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import map from 'lodash/map';

import FormGroup from '~/components/form-group/formGroup';


function AssociateCreate(props) {
  let { handleSubmit, roles } = props;
  let { user_id, role_id } = props.fields;

  return (
    <form onSubmit={ handleSubmit }>
      <FormGroup>
        <label>Bindo ID / Email</label>
        <input type="text" className="form-control" onChange={ user_id.onChange } value={ user_id.value } />
      </FormGroup>

      <FormGroup>
        <label>Role</label>
        <select onChange={ role_id.onChange } value={ role_id.value } className="form-control">
          {
            map(roles, (role, key) => (
              <option key={ key } value={ key }>{ role }</option>
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
    'user_id',
    'role_id',
  ]
})(AssociateCreate);
