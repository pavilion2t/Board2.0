import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { getStoreModule, updateStoreModule } from '~/actions';

function formComponent(props) {
  let { handleSubmit } = props;
  let { store_credit_enabled, gift_card_enabled} = props.fields;

  return (
    <form onSubmit={ handleSubmit }>
      <p><label><input type="checkbox" onChange={ store_credit_enabled.onChange } checked={ store_credit_enabled.checked } /> Enable Store Credit</label></p>
      <p><label><input type="checkbox" onChange={ gift_card_enabled.onChange } checked={ gift_card_enabled.checked } /> Enable Gift Card</label></p>
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
    'store_credit_enabled',
    'gift_card_enabled',
  ]
})(formComponent);

function mapStateToProps(state, ownProps) {
 return state;
}
function mapDispatchToProps(dispatch) {
  const actions = { getStoreModule, updateStoreModule };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class StoreCredit extends Component {
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
    const { updateStoreModule } = this.props.actions;
    const { store_id } = this.props.params;

    updateStoreModule(store_id, {store_id: store_id, module: data});
  }

  render() {
    const { module } = this.context.currentStore;

    return (
        <div className="main-content">
          <header className="main-content-header columns">
            <h1 className="main-content-title columns-main">Store Credit</h1>
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


export default connect(mapStateToProps, mapDispatchToProps)(StoreCredit);
