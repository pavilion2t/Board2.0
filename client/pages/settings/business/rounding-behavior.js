import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import map from 'lodash/map';

import { getStoreModule, updateStoreModule, alert } from '~/actions';
import FormGroup from '~/components/form-group/formGroup';

const ROUNDING_BEHAVIOR = {
  1: 'Normal Rounding',
  2: 'Rounding Up',
  3: 'Rounding Down',
  4: 'Round To Nearest Five',
};

function formComponent(props) {
  let { handleSubmit } = props;
  let { rounding_type, decimal_points} = props.fields;

  return (
    <form onSubmit={ handleSubmit }>
      <FormGroup label="Behavior">
        <select
          className="form-control"
          onChange={ rounding_type.onChange }
          value={ rounding_type.value }>
          {
            map(ROUNDING_BEHAVIOR, (behavior, key) => (
              <option key={ key } value={ key }>{ behavior }</option>
            ))
          }
        </select>
      </FormGroup>
      <FormGroup label="Demical Points">
        <input type="text"
          className="form-control"
          onChange={ decimal_points.onChange }
          value={ decimal_points.value } />
      </FormGroup>
    </form>
  );
}
formComponent.propTypes = {
  fields: PropTypes.object,
  handleSubmit: PropTypes.func,
};

let SettingsForm = reduxForm({
  form: 'SettingsStorecredits',
  fields: [
    'rounding_type',
    'decimal_points',
  ]
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

class RoundingBehavior extends Component {
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
      alert('success', 'Rounding Behavior setting saved.');
    });
  }

  render() {
    const { module } = this.context.currentStore;

    return (
        <div className="main-content">
          <header className="main-content-header columns">
            <h1 className="main-content-title columns-main">Rounding Behavior</h1>
            <div>
              <button className="btn btn-primary btn-sm" onClick={ this.submitForm }>Save</button>
            </div>
          </header>
          <div className="main-content-section">
            <SettingsForm ref="SettingsForm" initialValues={ module } onSubmit={ this.updateSettings } />
          </div>
        </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(RoundingBehavior);
