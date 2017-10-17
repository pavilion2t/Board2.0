import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '~/actions/formActions/embeddedBarcode';

import InputSelectBox from '~/components/input-select-box';

const typeOptions = [
  {value: 0, label: 'Embedded Price'},
  {value: 1, label: 'Embedded Weight'}
];

const pointOptions = {
  0: [
    {value: 0, label: '0'},
    {value: 1, label: '1'},
    {value: 2, label: '2'},
  ],
  1: [
    {value: 0, label: '0'},
    {value: 1, label: '1'},
    {value: 2, label: '2'},
    {value: 3, label: '3'},
  ]
};

function mapStateToProps(state, ownProps) {
  // console.log(state.forms.embeddedBarcode);
  return state.forms.embeddedBarcode;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class SettingsBusinessEmbededBarcode extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    type: PropTypes.number.isRequired,
    enabled: PropTypes.bool.isRequired,
    decimalPoints: PropTypes.number.isRequired,
    editMode: PropTypes.bool.isRequired,
    changed: PropTypes.bool.isRequired,
    enableSubmit: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };

  componentDidMount() {
    let {store_id} = this.props.params;
    this.props.actions.showEmbeddedBarcodeSetting(store_id);
  }

  render() {
    const {type, enabled, decimalPoints, editMode, changed, enableSubmit, actions } = this.props;

    return (
      <div className="main-content">
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main"></h1>
          { !editMode && <button className="btn btn-secondary btn-sm" onClick={ actions.editEmbeddedBarcodeSetting }>Edit</button> }
          { editMode && <button className="btn btn-primary btn-sm" disabled={ !changed || !enableSubmit } onClick={ actions.submitEmbeddedBarcodeSetting }>Save</button> }
        </header>
        <div className="main-content-section">
          <h1>Embedded Barcode</h1>
          <div>
            <p><input type="checkbox"
                      value="1"
                      checked={ enabled }
                      disabled={ !editMode }
                      onChange={ (e) => actions.changeEmbeddedBarcodeEnabled(e.target.checked) }/> Enable Embedded Barcode for by weight pricing product</p>
          </div>
        </div>
        { enabled && <div className="main-content-section">
          <div className="row">
            <div className="col-md-3">
              <InputSelectBox value={ type }
                              key="1"
                              title="Embedded Type"
                              placeholder="Select Type"
                              resetValue={ undefined }
                              clearable={ false }
                              disabled={ !editMode }
                              onChange={ (opt) => actions.changeEmbeddedBarcodeType(opt.value) }
                              options={ typeOptions }/>
            </div>
            <div className="col-md-3">
              <InputSelectBox value={ decimalPoints }
                              key="2"
                              title="No. of decimal"
                              placeholder="Select decimal"
                              resetValue={ undefined }
                              clearable={ false }
                              disabled={ !editMode }
                              onChange={ (opt) => actions.changeEmbeddedBarcodeDeciamlPoints(opt.value) }
                              options={ pointOptions[type] || [] }/>
            </div>
          </div>
        </div> }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsBusinessEmbededBarcode);
