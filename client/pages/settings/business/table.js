import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../../actions/tableActions';

import MainContent from '../../layout/main-content/main-content';
import MainContentHeader from '../../layout/main-content/main-content-header';
import MainContentSection from '../../layout/main-content/main-content-section';
import FromGroup from '../../../components/form-group/formGroup';
import InputNumber from '../../../components/input-number';


class SettingsBusinessTable extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    pathState: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    currentStore: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { store_id } = this.props.params;
    this.props.actions.init(store_id);
  }

  save = () => {
    const { currentStore = {} } = this.context;
    const { module = {} } = currentStore;
    const { default_table_turn_time } = module;
    const { actions = {}, pathState = {} } = this.props;
    const { storeId, defaultTableTurnTime } = pathState;
    actions.save(storeId, default_table_turn_time, defaultTableTurnTime);
  }

  render() {
    const { currentStore = {} } = this.context;
    const { module = {} } = currentStore;
    const { default_table_turn_time: initDefaultTableTurnTime } = module;
    const { pathState = {}, actions = {}, loading } = this.props;
    const { defaultTableTurnTime } = pathState;
    return (
      <MainContent>
        <MainContentHeader title="Table">
          <button
            className="btn btn-primary btn-sm"
            disabled={ loading || defaultTableTurnTime == null }
            onClick={ this.save }>Save</button>
        </MainContentHeader>
        <MainContentSection>
          <FromGroup className="w-30" label="Default Table Seat Time" autoHideHelpText>
            <InputNumber
              value={ defaultTableTurnTime == null ? initDefaultTableTurnTime : defaultTableTurnTime }
              dp={ 0 }
              suffix=" min"
              onChange={ v => actions.updateField('defaultTableTurnTime', v) }
              />
          </FromGroup>
        </MainContentSection>
      </MainContent>
    );
  }
}

const mapStateToProps = (state, props) => {
  let appState = state;
  let { table: pathState = {}} = state;
  let { base: { loading } } = state;
  let ret = Object.assign({}, props, { appState, pathState, loading });
  return ret;
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsBusinessTable);
