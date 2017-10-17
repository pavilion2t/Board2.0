import * as actions from '~/actions/formActions/tableSizeSegmentation';

import { createReducer } from '~/helpers/reduxHelper';

const initialState = {
  editMode: false,
  items: [],
  enableDailyRestart: false,
  initialValues: {},
  storeId: '',
  isCreating: false,
  isLoading: false,
  loadingError: '',
  isSubmitting: false,
  isRefreshing: false,
  isLinking: false,
  isModalOpen: false,
  updatedAt: '',
  linkSuccess: false,
  linkError: false
};

const actionHandlers = {
  [actions.CHANGE_TABLE_SIZE_SEGMENTATION_EDIT_MODE]: (state, action) => {
    const { value } = action;
    return Object.assign({}, state, { editMode: value });
  },
  [actions.CHANGE_TYPE_NAME]: (state, action) => {
    const { value, index } = action;
    let { items } = state;
    items[index].label = value;
    return Object.assign({}, state, { items: items.slice() });
  },
  [actions.CHANGE_TABLE_SIZE]: (state, action) => {
    const { value, index } = action;
    let { items } = state;
    items[index].minimumPartySize = value;
    let prev = value;
    for (let i = index + 1; i < items.length; i++) {
      if (items[i].minimumPartySize <= prev) {
        items[i].minimumPartySize = prev + 1;
        prev = prev + 1;
      } else {
        prev = items[i].minimumPartySize;
      }
    }
    return Object.assign({}, state, { items: items.slice() });
  },
  [actions.CHANGE_RESTART_ENABLE]: (state, action) => {
    const { value } = action;
    return Object.assign({}, state, { enableDailyRestart: value });
  },
  [actions.ADD_TABLE_TYPE]: (state) => {
    let { items } = state;
    items.push({ label: '', minimumPartySize: 0 });
    return Object.assign({}, state, { items: items.slice() });
  },
  [actions.REMOVE_TABLE_TYPE]: (state, action) => {
    const { index } = action;
    let { items } = state;
    items.splice(index, 1);
    return Object.assign({}, state, { items: items.slice() });
  },
  [actions.REFRESH_TABLE_SIZING_NOW_REQUEST]: (state, action) => {
    return Object.assign({}, state, { isRefreshing: true });
  },
  [actions.REFRESH_TABLE_SIZING_NOW_SUCCESS]: (state) => {
    return Object.assign({}, state, { isRefreshing: false });
  },
  [actions.REFRESH_TABLE_SIZING_NOW_FAILURE]: (state) => {
    return Object.assign({}, state, { isRefreshing: false });
  },
  [actions.SUBMIT_TABLE_SIZE_SEGMENTATION_REQUEST]: (state) => {
    return Object.assign({}, state, { isSubmitting: true });
  },
  [actions.SUBMIT_TABLE_SIZE_SEGMENTATION_SUCCESS]: (state) => {
    return Object.assign({}, state, { isSubmitting: false, editMode: false });
  },
  [actions.SUBMIT_TABLE_SIZE_SEGMENTATION_FAILURE]: (state) => {
    return Object.assign({}, state, { isSubmitting: false, editMode: false });
  },
  [actions.OPEN_TABLE_SIZE_SEGMENTATION_REQUEST]: (state, action) => {
    return Object.assign({}, state, { isLoading: true });
  },
  [actions.OPEN_TABLE_SIZE_SEGMENTATION_SUCCESS]: (state, action) => {
    const { data, isCreating, storeId }  = action;
    let items = [];
    let updatedAt = '';
    let enableDailyRestart = false;
    if (!isCreating) {
      items = data.partySizeSegmentItems.slice();
      items.sort((a, b) => a.minimumPartySize - b.minimumPartySize);
      enableDailyRestart = data.dailyCountRestart;
      updatedAt = data.updatedAt;
    }
    return Object.assign({}, state, {
      storeId,
      initialValues: data,
      items,
      enableDailyRestart,
      updatedAt,
      isCreating: isCreating ? true: false,
      editMode: isCreating ? true: false,
      isLoading: false
    });
  },
  [actions.OPEN_TABLE_SIZE_SEGMENTATION_FAILURE]: (state, action) => {
    const { error, storeId } = action;
    return Object.assign({}, state, { isLoading: false, loadingError: error.message, storeId });
  },
  [actions.CLOSE_TABLE_SIZE_SEGMENTATION]: () => initialState,
  [actions.OPEN_LINK_UP_QUEUE_DISPLAY_MODAL]: (state) => {
    return Object.assign({}, state, { isModalOpen: true });
  },
  [actions.CLOSE_LINK_UP_QUEUE_DISPLAY_MODAL]: (state) => {
    return Object.assign({}, state, { isModalOpen: false });
  },
  [actions.SUBMIT_LINK_UP_QUEUE_DISPLAY_REQUEST]: (state, action) => {
    return Object.assign({}, state, { isLinking: true, linkSuccess: false, linkError: false });
  },
  [actions.SUBMIT_LINK_UP_QUEUE_DISPLAY_SUCCESS]: (state, action) => {
    return Object.assign({}, state, { isLinking: false, linkSuccess: true });
  },
  [actions.SUBMIT_LINK_UP_QUEUE_DISPLAY_FAILURE]: (state, action) => {
    return Object.assign({}, state, { isLinking: false, linkError: true });
  }
};


export default createReducer(initialState, actionHandlers);
