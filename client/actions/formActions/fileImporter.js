import { keys, get, size } from 'lodash';

import VoucherService from '~/services/voucherService';


export const SHOW_FILE_IMPORTER = 'SHOW_FILE_IMPORTER';
export const CLOSE_FILE_IMPORTER = 'CLOSE_FILE_IMPORTER';
export const UPLOAD_FILE = 'UPLOAD_FILE';
export const SUBMIT_UPLOAD_FILE_REQUEST = 'SUBMIT_UPLOAD_FILE_REQUEST';
export const SUBMIT_UPLOAD_FILE_SUCCESS = 'SUBMIT_UPLOAD_FILE_SUCCESS';
export const SUBMIT_UPLOAD_FILE_FAILURE = 'SUBMIT_UPLOAD_FILE_FAILURE';
export const GET_IMPORT_VALIDATION_PROGRESS_REQUEST = 'GET_IMPORT_VALIDATION_PROGRESS_REQUEST';
export const GET_IMPORT_VALIDATION_PROGRESS_SUCCESS = 'GET_IMPORT_VALIDATION_PROGRESS_SUCCESS';
export const GET_IMPORT_VALIDATION_PROGRESS_FAILURE = 'GET_IMPORT_VALIDATION_PROGRESS_FAILURE';
export const POST_VALIDATED_COUPON_IMPORT_REQUEST = 'POST_VALIDATED_COUPON_IMPORT_REQUEST';
export const POST_VALIDATED_COUPON_IMPORT_SUCCESS = 'POST_VALIDATED_COUPON_IMPORT_SUCCESS';
export const POST_VALIDATED_COUPON_IMPORT_FAILURE = 'POST_VALIDATED_COUPON_IMPORT_FAILURE';
export const UPDATE_IMPORT_PROGRESS = 'UPDATE_IMPORT_PROGRESS';
export const UPDATE_VALIDATION_PROGRESS = 'UPDATE_VALIDATION_PROGRESS';


const updateImportProgress = (value) => ({ type: UPDATE_IMPORT_PROGRESS, value });
// const updateValidationProgress = (value) => ({ type: UPDATE_VALIDATION_PROGRESS, value });
export const showFileImporter = (storeId, discountId) => ({ type: SHOW_FILE_IMPORTER, storeId, discountId });
export const closeFileImporter = () => ({ type: CLOSE_FILE_IMPORTER });
export const uploadFile = (fileString, fileBlob, fileType) => ({ type: UPLOAD_FILE, fileString, fileBlob, fileType });
export const submitFile = () => (dispatch, getState) => {
  dispatch({ type: SUBMIT_UPLOAD_FILE_REQUEST });
  const state = getState();
  const store = state.forms.fileImporter;
  //TODO: use parmas array to store the ids, then 'func.apply(null, params.concat([fileData]))', use a promise to wrap it
  const { storeId, discountId, fileBlob } = store;
  const importProgressHandler = (e) => dispatch(updateImportProgress(e.lengthComputable ? e.loaded / e.total: 0));
  return VoucherService.createCouponImport(storeId, discountId, fileBlob, importProgressHandler)
    .then(resp => {
      const { coupon_import } = resp;
      dispatch({ type: SUBMIT_UPLOAD_FILE_SUCCESS, data: coupon_import });//TODO: use data accessor
      dispatch(getValidateProgress(storeId, coupon_import.id));//TODO: use import id accessor
    })
    .catch(error => {
      dispatch({ type: SUBMIT_UPLOAD_FILE_FAILURE, error });
    });
};
const getValidateProgress = (storeId, importId) => (dispatch) => {
  dispatch({ type: GET_IMPORT_VALIDATION_PROGRESS_REQUEST });
  return VoucherService.getCouponImport(storeId, importId)//TODO: use abstruct validation api caller
    .then(resp => {
      const { coupon_import } = resp;
      dispatch({ type: GET_IMPORT_VALIDATION_PROGRESS_SUCCESS, data: coupon_import });
      dispatch({ type: UPDATE_VALIDATION_PROGRESS, value: parseFloat(coupon_import.validation_progress_rate) });
      if (coupon_import.status === 'validated') {
        if (!size(keys(get(coupon_import, 'humanize_validation_errors'))) && !size(keys(get(coupon_import, 'humanize_validation_warnings')))) {
          dispatch(postValidatedImport(storeId, importId));
        }
      } else {
        dispatch(getValidateProgress(storeId, importId));
      }
    })
    .catch(error => {
      dispatch({ type: GET_IMPORT_VALIDATION_PROGRESS_FAILURE, error });
    });
};
const postValidatedImport = (storeId, importId) => (dispatch) => {
  dispatch({ type: POST_VALIDATED_COUPON_IMPORT_REQUEST });
  return VoucherService.importValidatedCoupon(storeId, importId)//TODO: use abstruct validation api caller
    .then(resp => {
      const { data, error } = resp;
      if (error){
        dispatch({ type: POST_VALIDATED_COUPON_IMPORT_FAILURE, error });
      } else {
        dispatch({ type: POST_VALIDATED_COUPON_IMPORT_SUCCESS, data: data.coupon_import });//TODO: use data accessor
      }
    })
    .catch(error => {
      dispatch({ type: POST_VALIDATED_COUPON_IMPORT_FAILURE, error });
    });
};
