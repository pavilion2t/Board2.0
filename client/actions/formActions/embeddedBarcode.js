import find from 'lodash/find';
import {getStoreModule, updateStoreModule} from '~/actions/storeActions';

export const SHOW_EMBEDDED_BARCODE_SETTING = 'SHOW_EMBEDDED_BARCODE_SETTING';
export const CHANGE_EMBEDDED_BARCODE_ENABLED = 'CHANGE_EMBEDDED_BARCODE_ENABLED';
export const CHANGE_EMBEDDED_BARCODE_TYPE = 'CHANGE_EMBEDDED_BARCODE_TYPE';
export const CHANGE_EMBEDDED_BARCODE_DECIMAL_POINTS = 'CHANGE_EMBEDDED_BARCODE_DECIMAL_POINTS';
export const EDIT_EMBEDDED_BARCODE_SETTING = 'EDIT_EMBEDDED_BARCODE_SETTING';
export const DISCARD_EMBEDDED_BARCODE_SETTING = 'DISCARD_EMBEDDED_BARCODE_SETTING';
export const SUBMIT_EMBEDDED_BARCODE_SETTING_REQUEST = 'SUBMIT_EMBEDDED_BARCODE_SETTING_REQUEST';
export const SUBMIT_EMBEDDED_BARCODE_SETTING_SUCCESS = 'SUBMIT_EMBEDDED_BARCODE_SETTING_SUCCESS';
export const SUBMIT_EMBEDDED_BARCODE_SETTING_FAILURE = 'SUBMIT_EMBEDDED_BARCODE_SETTING_FAILURE';

export const showEmbeddedBarcodeSetting = (storeId) => (dispatch, getState) => {
  dispatch(getStoreModule(storeId)).then(() => {
    const state = getState();
    const targetStore = find(state.stores, { id: storeId });
    if (targetStore) {
      dispatch({ type: SHOW_EMBEDDED_BARCODE_SETTING, store: targetStore.module });
    } else {
      alert('Cannot find target store module');
    }
  });
};
export const changeEmbeddedBarcodeEnabled = (value) => ({ type: CHANGE_EMBEDDED_BARCODE_ENABLED, value });
export const changeEmbeddedBarcodeType = (value) => ({ type: CHANGE_EMBEDDED_BARCODE_TYPE, value });
export const changeEmbeddedBarcodeDeciamlPoints = (value) => ({ type: CHANGE_EMBEDDED_BARCODE_DECIMAL_POINTS, value });
export const editEmbeddedBarcodeSetting = () => ({ type: EDIT_EMBEDDED_BARCODE_SETTING });
export const discardEmbeddedBarcodeSetting = () => (dispatch, getState) => {
  const state = getState();
  const pageState = state.forms.embeddedBarcode;
  const { type, enabled, decimalPoints, initialValues } = pageState;
  if (type !== initialValues.embedded_barcode_type
    && enabled !== initialValues.embedded_barcode_enabled
    && decimalPoints !== initialValues.embedded_barcode_decimal_points) {
    if (confirm('Do you want to discard your changes?')) {
      dispatch({ type: DISCARD_EMBEDDED_BARCODE_SETTING });
    }
  } else {
    dispatch({ type: DISCARD_EMBEDDED_BARCODE_SETTING });
  }
};
export const submitEmbeddedBarcodeSetting = () => (dispatch, getState) => {
  const state = getState();
  const pageState = state.forms.embeddedBarcode;
  const { type, enabled, decimalPoints, initialValues } = pageState;
  let data = {};
  data.embedded_barcode_enabled = enabled;
  data.embedded_barcode_type = enabled ? type : null;
  data.embedded_barcode_decimal_points = enabled ? decimalPoints : null;
  dispatch({ type: SUBMIT_EMBEDDED_BARCODE_SETTING_REQUEST });
  dispatch(updateStoreModule(initialValues.store_id, { 'module': data })).then(() => {
    dispatch({ type: SUBMIT_EMBEDDED_BARCODE_SETTING_SUCCESS });
  }).catch(e => {
    dispatch({ type: SUBMIT_EMBEDDED_BARCODE_SETTING_FAILURE });
    alert('Failed to update settings.');
  });

};
