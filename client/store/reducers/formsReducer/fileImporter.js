import Papa from 'papaparse';
import * as actions from '~/actions/formActions/fileImporter';

import { createReducer } from '~/helpers/reduxHelper';


const initialState = {
  storeId: '',
  discountId: '',
  fileString: null,
  fileBlob: null,
  previewData: [],
  status: '',
  step: 0,
  importProgress: 0,
  validatateProgress: 0,
  isDoing: false,//all
  isDone: false,
  isSubmitting: false,//create new import
  isSubmitted: false,
  isValidated: false,//validate import
  isValidating: false,
  isPosting: false,// post validated import
  isPosted: false,
  isOpen: false,
  isUploaded: false,
  errors: [],
  warnings: []
};

const actionHandlers = {
  [actions.SHOW_FILE_IMPORTER]: (state, action) => {
    const { storeId, discountId } = action;
    return Object.assign({}, state, { storeId, discountId, isOpen: true });
  },
  [actions.CLOSE_FILE_IMPORTER]: () => initialState,
  [actions.UPLOAD_FILE]: (state, action) => {
    const { fileString, fileBlob, fileType } = action;
    if (fileType.toUpperCase() === 'CSV') {
      let preview = Papa.parse(fileString);
      return Object.assign({}, state, { previewData: preview.data, isUploaded: true, fileString, fileBlob, isDone: false });
    } else {
      return state;
    }
  },
  [actions.SUBMIT_UPLOAD_FILE_REQUEST]: (state, action) => {
    return Object.assign({}, state, { isDoing: true, isSubmitting: true, status: 'Step 1/3: Uploading CSV', step: 1 });
  },
  [actions.SUBMIT_UPLOAD_FILE_SUCCESS]: (state, action) => {
    return Object.assign({}, state, { isSubmitting: false, isSubmitted: true, status: 'Step 2/3: Validating CSV', step: 2 });
  },
  [actions.SUBMIT_UPLOAD_FILE_FAILURE]: (state, action) => {
    return Object.assign({}, state, { isSubmitting: false, isSubmitted: true });
  },
  [actions.GET_IMPORT_VALIDATION_PROGRESS_REQUEST] : (state) => {
    return Object.assign({}, state, { isValidating: true });
  },
  [actions.GET_IMPORT_VALIDATION_PROGRESS_SUCCESS] : (state, action) => {
    const { data } = action;
    let errors = [];
    let errorNums = Object.keys(data.humanize_validation_errors || {});
    if (errorNums.length) {
      errorNums.forEach(num => {
        let array = data.humanize_validation_errors[num];
        array.forEach(value => { errors.push({row: num, value }); });
      });
    }
    let warnings = [];
    let warningNums = Object.keys(data.humanize_validation_warnings || {});
    if (warningNums.length) {
      warningNums.forEach(num => {
        let array = data.humanize_validation_warnings[num];
        array.forEach(value => { warnings.push({row: num, value }); });
      });
    }
    let stop = false;
    if (errors.length || warnings.length) {
      stop = true;
    }
    return Object.assign({}, state, { isValidating: true, errors, warnings,  isDoing: !stop, isDone: stop });
  },
  [actions.UPDATE_IMPORT_PROGRESS]: (state, action) => {
    const { value } = action;
    return Object.assign({}, state, { importProgress: value });
  },
  [actions.UPDATE_VALIDATION_PROGRESS]: (state, action) => {
    const { value } = action;
    return Object.assign({}, state, { validatateProgress: value });
  },
  [actions.POST_VALIDATED_COUPON_IMPORT_REQUEST]: (state) => {
    return Object.assign({}, state, { isPosting: true, status: 'Step 3/3: Finalizing Upload', isValidating: false, isValidated: true, step: 3 });
  },
  [actions.POST_VALIDATED_COUPON_IMPORT_SUCCESS]: (state, action) => {
    return Object.assign({}, state, { isPosting: false, isPosted: true, isDoing: false, isDone: true, status: 'Step End: Finalized', step: 0 });
  },
  [actions.POST_VALIDATED_COUPON_IMPORT_FAILURE]: (state) => {
    return Object.assign({}, state, { isPosting: false, isPosted: true, isDoing: false, isDone: true });
  }
};

export default createReducer(initialState, actionHandlers);
