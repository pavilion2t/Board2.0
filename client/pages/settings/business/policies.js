import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { getStorePolicy, updateStore, alert } from '~/actions';
import FormGroup from '~/components/form-group/formGroup';

function formComponent(props) {
  let { handleSubmit } = props;
  let { highlight, policy } = props.fields;

  return (
    <form onSubmit={ handleSubmit }>
        <FormGroup label="Store Highlight">
          <textarea
            className="form-control"
            onChange={ highlight.onChange }
            value={ highlight.value } />
        </FormGroup>
        <FormGroup label="Return and Exchange Policy">
          <textarea
            className="form-control"
            onChange={ policy.onChange }
            value={ policy.value } />
        </FormGroup>
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
    'highlight', 'policy',
  ]
})(formComponent);



function mapStateToProps(state, ownProps) {
  return state;
}
function mapDispatchToProps(dispatch) {
  const actions = { getStorePolicy, updateStore, alert };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class Policies extends Component {
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

    let initialValues = {
      highlight: currentStore.highlight,
      policy: currentStore.policy
    };

    return (
        <div className="main-content">
          <header className="main-content-header columns">
            <h1 className="main-content-title columns-main">Policies</h1>
            <div>
              <button className="btn btn-primary btn-sm" onClick={ this.submitForm }>Save</button>
            </div>
          </header>
          <div className="main-content-section">
            <SettingsForm ref="SettingsForm" initialValues={ initialValues } onSubmit={ this.updateSettings } />
          </div>
        </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Policies);
