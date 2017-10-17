import * as actions from '~/actions/formActions/uomGroupOverview';
import { uniqBy } from 'lodash';
import { createReducer } from '~/helpers/reduxHelper';

const initialState = {
  editMode: false,
  initialValues: {},
  storeId: '',
  isCreating: false,
  isLoading: false,
  isSubmitting: false,
  groupName: '',
  units: [],
  referenceUnit: {
    name: '',
    ratio: 1,
    unitGroupId: undefined,
    isBaseUnit: true
  }
};

const actionHandlers = {
  [actions.OPEN_WORKFLOW_OVERVIEW_REQUEST]: (state, action) => {
    const { unitGroupId, storeId } = action;
    if (!unitGroupId) {
      return Object.assign({}, state, { isCreating: true, editMode: true, storeId });
    } else {
      return Object.assign({}, state, { isLoading: true, storeId, unitGroupId });
    }
  },
  [actions.OPEN_WORKFLOW_OVERVIEW_SUCCESS]: (state, action) => {
    const { data } = action;
    let loaded = {};
    loaded.isLoading = false;
    loaded.initialValues = data;
    loaded.groupName = data.name;
    let units = data.units || [];
    let ref = units.filter(u => u.isBaseUnit === true);
    if (ref.length) {
      ref = ref[0];
      if (ref.ratio) ref.ratio = parseFloat(ref.ratio);
      loaded.referenceUnit = ref;
    }
    let normal = units.filter(u => !u.isBaseUnit);
    if (normal.length) {
      normal.forEach(u => u.ratio = parseFloat(u.ratio));
      loaded.units = uniqBy(normal, 'id');
    }
    return Object.assign({}, state, loaded);
  },
  [actions.OPEN_WORKFLOW_OVERVIEW_FAILURE]: (state, action) => {
    return Object.assign({}, state, { isLoading: false });
  },
  [actions.CLOSE_WORKFLOW_OVERVIEW]: () => {
    return initialState;
  },
  [actions.ENABLE_UOM_OVERVIEW_EDITMODE]: (state) => {
    return Object.assign({}, state, { editMode: true });
  },
  [actions.CHANGE_UOM_GROUP_NAME]: (state, action) => {
    const { value } = action;
    return Object.assign({}, state, { groupName: value });
  },
  [actions.CHANGE_UOM_UNIT_NAME]: (state, action) => {
    const { value, index } = action;
    if (index !== undefined) {
      let { units } = state;
      units[index].name = value;
      return Object.assign({}, state, { units });
    } else {
      let { referenceUnit } = state;
      referenceUnit.name = value;
      return Object.assign({}, state, {referenceUnit });
    }
  },
  [actions.CHANGE_UOM_UNIT_RATIO]: (state, action) => {
    const { value, index } = action;
    if (index !== undefined) {
      let { units } = state;
      units[index].ratio = value;
      return Object.assign({}, state, { units });
    } else {
      let { referenceUnit } = state;
      referenceUnit.ratio = value;
      return Object.assign({}, state, {referenceUnit });
    }
  },
  [actions.ADD_UOM_UNIT]: (state, action) => {
    const units = state.units.slice();
    units.push({ name: '', ratio: 1 });
    return Object.assign({}, state, { units });
  },
  [actions.REMOVE_UOM_UNIT]: (state, action) => {
    const { index } = action;
    const units = state.units.slice();
    units.splice(index, 1);
    return Object.assign({}, state, { units });
  },
  [actions.SUBMIT_UOM_GROUP_REQUEST]: (state) => {
    return Object.assign({}, state, { isSubmitting: true });
  },
  [actions.SUBMIT_UOM_GROUP_SUCCESS]: (state) => {
    return Object.assign({}, state, { isSubmitting: false, editMode: false });
  },
  [actions.SUBMIT_UOM_GROUP_FAILURE]: (state) => {
    return Object.assign({}, state, { isSubmitting: false, editMode: false });
  }
};

export default createReducer(initialState, actionHandlers);
