import Big from 'big.js';

import { createReducer } from '../../helpers/reduxHelper';

import * as actions from '../../actions/tableActions';

const initialState = {
  storeId: null,
  defaultTableTurnTime: null,
};

const actionHandlers = {
  [actions.INIT_SETTINGS_BUSINESS_TABLE]: (state, { data }) => {
    const { storeId } = data || {};
    if (storeId) {
      return Object.assign({}, state, { storeId });
    } else {
      return state;
    }
  },
  [actions.UPDATE_SETTINGS_BUSINESS_TABLE_FIELD]: (state, {data}) => {
    const { field, value} = data || {};
    if (field) {
      let v = value;
      const numberFields = ['defaultTableTurnTime'];
      if (numberFields.indexOf(field) >= 0 && v != null) {
        v = Big(v);
      }
      return Object.assign({}, state, { [field]: v });
    } else {
      return state;
    }
  }
};

export default createReducer(initialState, actionHandlers);
