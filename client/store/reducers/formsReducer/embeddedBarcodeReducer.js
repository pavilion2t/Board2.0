import * as actions from '~/actions/formActions/embeddedBarcode';

import {createReducer} from '~/helpers/reduxHelper';


const initialState = {
  initialValues: null,
  type: 0,
  enabled: false,
  decimalPoints: 0,
  editMode: false,
  changed: false,
  enableSubmit: false,
};

const actionHandlers = {
  [actions.SHOW_EMBEDDED_BARCODE_SETTING]: (state, action) => {
    const { store } = action;
    return ({
      initialValues: store,
      type: store.embedded_barcode_type,
      enabled: store.embedded_barcode_enabled,
      decimalPoints: store.embedded_barcode_decimal_points,
      editMode: false,
      changed: false,
      enableSubmit: false
    });
  },
  [actions.CHANGE_EMBEDDED_BARCODE_ENABLED]: (state, action) => {
    const { value } = action;
    const { type, decimalPoints, initialValues } = state;
    const { embedded_barcode_enabled, embedded_barcode_decimal_points, embedded_barcode_type } = initialValues;
    let changed = value !== embedded_barcode_enabled || type !== embedded_barcode_type || decimalPoints !== embedded_barcode_decimal_points;
    return Object.assign({}, state, { enabled: value, changed });
  },
  [actions.CHANGE_EMBEDDED_BARCODE_TYPE]: (state, action) => {
    const { value } = action;
    const { enabled, initialValues } = state;
    const { embedded_barcode_enabled, embedded_barcode_decimal_points, embedded_barcode_type } = initialValues;
    let changed = enabled !== embedded_barcode_enabled || value !== embedded_barcode_type || 0 !== embedded_barcode_decimal_points;
    return Object.assign({}, state, { type: value, decimalPoints: 0, changed });
  },
  [actions.CHANGE_EMBEDDED_BARCODE_DECIMAL_POINTS]: (state, action) => {
    const { value } = action;
    const { enabled, type, initialValues } = state;
    const { embedded_barcode_enabled, embedded_barcode_decimal_points, embedded_barcode_type } = initialValues;
    let changed = enabled !== embedded_barcode_enabled || type !== embedded_barcode_type || value !== embedded_barcode_decimal_points;
    return Object.assign({}, state, { decimalPoints: value, changed });
  },
  [actions.EDIT_EMBEDDED_BARCODE_SETTING]: (state, action) => {
    return Object.assign({}, state, { editMode: true, enableSubmit: true });
  },
  [actions.DISCARD_EMBEDDED_BARCODE_SETTING]: (state, action) => {
    const { initialValues } = state;
    return Object.assign({}, state, {
      type: initialValues.embedded_barcode_type,
      enabled: initialValues.embedded_barcode_enabled,
      decimalPoints: initialValues.embedded_barcode_decimal_points,
      editMode: false,
      changed: false,
      enableSubmit: false
    });
  },
  [actions.SUBMIT_EMBEDDED_BARCODE_SETTING_REQUEST]: (state, action) => {
    return Object.assign({}, state, { enableSubmit: false });
  },
  [actions.SUBMIT_EMBEDDED_BARCODE_SETTING_SUCCESS]: (state, action) => {
    return Object.assign({}, state, { enableSubmit: true, editMode: false });
  },
  [actions.SUBMIT_EMBEDDED_BARCODE_SETTING_FAILURE]: (state, action) => {
    return Object.assign({}, state, { enableSubmit: true, editMode: false });
  },
};

export default createReducer(initialState, actionHandlers);
