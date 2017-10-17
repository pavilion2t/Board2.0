import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { getStoreDelivery, updateStore, alert } from '~/actions';
import FormGroup from '~/components/form-group/formGroup';

function formComponent(props) {
  let { handleSubmit } = props;
  let { delivery, delivery_desc, delivery_fee, delivery_miles, delivery_min_amount } = props.fields;

  return (
    <form onSubmit={ handleSubmit }>
      <p>
        <label>
          <input
            type="checkbox"
            onChange={ delivery.onChange }
            checked={ delivery.checked } /> Enable local delivery
        </label>
      </p>
      {
        delivery.value ? (
          <div>
            <FormGroup label="Maximun distance (in mile)">
              <input
                type="text"
                className="form-control"
                onChange={ delivery_miles.onChange }
                value={ delivery_miles.value } />
            </FormGroup>
            <FormGroup label="Minimum order ($)">
              <input
                type="text"
                className="form-control"
                onChange={ delivery_min_amount.onChange }
                value={ delivery_min_amount.value } />
            </FormGroup>
            <FormGroup label="Delivery charge if minimum order is not met ($)">
              <input
                type="text"
                className="form-control"
                onChange={ delivery_fee.onChange }
                value={ delivery_fee.value } />
            </FormGroup>
            <FormGroup label="Other pick up and delivery information">
              <textarea
                className="form-control"
                onChange={ delivery_desc.onChange }
                value={ delivery_desc.value } />
            </FormGroup>

          </div>

        ) : null
      }
    </form>
  );
}
formComponent.propTypes = {
  fields: PropTypes.object,
  handleSubmit: PropTypes.func,
};

let SettingsForm = reduxForm({
  form: 'store_policy',
  fields: [
    'delivery', 'delivery_desc', 'delivery_fee', 'delivery_miles', 'delivery_min_amount'
  ]
})(formComponent);


function mapStateToProps(state, ownProps) {
  return state;
}
function mapDispatchToProps(dispatch) {
  const actions = { getStoreDelivery, updateStore, alert };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class Delivery extends Component {
  static propTypes = {
    actions: PropTypes.object,
    params: PropTypes.object,
    location: PropTypes.object,
    associates: PropTypes.array,
  }
  static contextTypes = {
    currentStore: React.PropTypes.object.isRequired
  }

  submitForm = () => {
    this.refs.SettingsForm.submit();
  }
  updateSettings = (data) => {
    const { updateStore, alert } = this.props.actions;
    const { store_id } = this.props.params;

    updateStore(store_id, {store_attributes: data}).then(() => {
      alert('success', 'Policies setting saved.');
    });
  }

  render() {
    let { currentStore } = this.context;

    return (
      <div className="main-content">
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main">Delivery</h1>
          <div>
            <button className="btn btn-primary btn-sm" onClick={ this.submitForm }>Save</button>
          </div>
        </header>
        <div className="main-content-section">
          <SettingsForm ref="SettingsForm" initialValues={ currentStore } onSubmit={ this.updateSettings } />
        </div>
      </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Delivery);
