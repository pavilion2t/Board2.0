import { get, update, create, refresh } from '~/actions/tableSizeSegmentationActions';
import { linkUpDisplay } from '~/actions/queueingDisplayActions';
import { pick } from 'lodash';

import { startFetch, stopFetch } from '../baseActions';

export const CHANGE_TABLE_SIZE_SEGMENTATION_EDIT_MODE = 'CHANGE_TABLE_SIZE_SEGMENTATION_EDIT_MODE';
export const CHANGE_TYPE_NAME = 'CHANGE_TYPE_NAME';
export const CHANGE_TABLE_SIZE = 'CHANGE_TABLE_SIZE';
export const CHANGE_RESTART_ENABLE = 'CHANGE_RESTART_ENABLE';
export const ADD_TABLE_TYPE = 'ADD_TABLE_TYPE';
export const REMOVE_TABLE_TYPE = 'REMOVE_TABLE_TYPE';
export const REFRESH_TABLE_SIZING_NOW_REQUEST = 'REFRESH_TABLE_SIZING_NOW_REQUEST';
export const REFRESH_TABLE_SIZING_NOW_SUCCESS = 'REFRESH_TABLE_SIZING_NOW_SUCCESS';
export const REFRESH_TABLE_SIZING_NOW_FAILURE = 'REFRESH_TABLE_SIZING_NOW_FAILURE';
export const SUBMIT_TABLE_SIZE_SEGMENTATION_REQUEST = 'SUBMIT_TABLE_SIZE_SEGMENTATION_REQUEST';
export const SUBMIT_TABLE_SIZE_SEGMENTATION_SUCCESS = 'SUBMIT_TABLE_SIZE_SEGMENTATION_SUCCESS';
export const SUBMIT_TABLE_SIZE_SEGMENTATION_FAILURE = 'SUBMIT_TABLE_SIZE_SEGMENTATION_FAILURE';
export const OPEN_TABLE_SIZE_SEGMENTATION_REQUEST = 'OPEN_TABLE_SIZE_SEGMENTATION_REQUEST';
export const OPEN_TABLE_SIZE_SEGMENTATION_SUCCESS = 'OPEN_TABLE_SIZE_SEGMENTATION_SUCCESS';
export const OPEN_TABLE_SIZE_SEGMENTATION_FAILURE = 'OPEN_TABLE_SIZE_SEGMENTATION_FAILURE';

export const CLOSE_TABLE_SIZE_SEGMENTATION = 'CLOSE_TABLE_SIZE_SEGMENTATION';

export const SUBMIT_LINK_UP_QUEUE_DISPLAY_REQUEST = 'SUBMIT_LINK_UP_QUEUE_DISPLAY_REQUEST';
export const SUBMIT_LINK_UP_QUEUE_DISPLAY_SUCCESS = 'SUBMIT_LINK_UP_QUEUE_DISPLAY_SUCCESS';
export const SUBMIT_LINK_UP_QUEUE_DISPLAY_FAILURE = 'SUBMIT_LINK_UP_QUEUE_DISPLAY_FAILURE';

export const OPEN_LINK_UP_QUEUE_DISPLAY_MODAL = 'OPEN_LINK_UP_QUEUE_DISPLAY_MODAL';
export const CLOSE_LINK_UP_QUEUE_DISPLAY_MODAL = 'CLOSE_LINK_UP_QUEUE_DISPLAY_MODAL';

export const close = () => ({ type: CLOSE_TABLE_SIZE_SEGMENTATION });
export const changeTableSizeSegmentationEditMode = (value) => ({
  type: CHANGE_TABLE_SIZE_SEGMENTATION_EDIT_MODE,
  value
});
export const changeTypeName = (value, index) => ({ type: CHANGE_TYPE_NAME, value, index });
export const changeTableSize = (value, index) => ({ type: CHANGE_TABLE_SIZE, value, index });
export const changeRestartEnable = (value) => ({ type: CHANGE_RESTART_ENABLE, value });
export const addTableType = () => ({ type: ADD_TABLE_TYPE });
export const removeTableType = (index) => ({ type: REMOVE_TABLE_TYPE, index });
export const refreshNow = (storeId) => (dispatch, getState) => {
  const state = getState();
  const data = state.forms.tableSizeSegmentation;
  dispatch({ type: REFRESH_TABLE_SIZING_NOW_REQUEST });
  dispatch(refresh(data.storeId)).then(({ error }) => {
    if (!error) {
      dispatch({ type: REFRESH_TABLE_SIZING_NOW_SUCCESS });
    } else {
      dispatch({ type: REFRESH_TABLE_SIZING_NOW_FAILURE, error });
    }
  });
};
export const submit = () => (dispatch, getState) => {
  dispatch({ type: SUBMIT_TABLE_SIZE_SEGMENTATION_REQUEST });
  const state = getState();
  const data = state.forms.tableSizeSegmentation;
  let handler;
  let body = { dailyCountRestart: data.enableDailyRestart };

  if (!data.isCreating) {
    body.partySizeSegmentItemsAttributes = typeDiff(data.initialValues.partySizeSegmentItems, data.items);
    handler = update;
  } else {
    body.partySizeSegmentItemsAttributes = data.items.slice();
    handler = create;
  }

  let len = body.partySizeSegmentItemsAttributes.length;

  if (len > 0) {
    //validate name input
    let invalidNames = [];
    body.partySizeSegmentItemsAttributes.forEach((d, i) => {
      if (!d.label || !d.label.length){
        invalidNames.push(d);
      }
    });
    if (invalidNames.length) {
      alert(`Please set name for all types.`);
      return;
    }

    //validate name value
    let duplicated = [];
    let names = body.partySizeSegmentItemsAttributes.map(d => d.label);
    body.partySizeSegmentItemsAttributes.forEach((d, i) => {
      if (names.indexOf(d.label) !== i) {
        duplicated.push(d.label);
      }
    });
    if (duplicated.length) {
      alert(`Duplicated name: ${duplicated.join(', ')}`);
      return;
    }
    //validate size input
    let invalidSize = [];
    body.partySizeSegmentItemsAttributes.forEach((d, i) => {
      if (!d.minimumPartySize){
        invalidSize.push(d);
      }
    });
    if (invalidSize.length) {
      alert(`Please set table size for all types.`);
      return;
    }
  }

  body.partySizeSegmentItemsAttributes.sort((a, b) => a.minimumPartySize - b.minimumPartySize);
  if (len > 1) {
    for (let i = 1; i < len; i++) {
      body.partySizeSegmentItemsAttributes[i - 1].maximumPartySize = body.partySizeSegmentItemsAttributes[i].minimumPartySize - 1;
    }
  }

  let temp = [];
  body.partySizeSegmentItemsAttributes.forEach(d => {
    temp.push(pick(d, ['id', 'maximumPartySize', 'minimumPartySize', 'label', '_destroy']));
  });
  body.partySizeSegmentItemsAttributes = temp;
  dispatch(startFetch());
  dispatch(handler(body, data.storeId)).then(({ data, error }) => {
    dispatch(stopFetch());
    if (!error) {
      dispatch({ type: SUBMIT_TABLE_SIZE_SEGMENTATION_SUCCESS, data });
    } else {
      alert(error.message);
      dispatch({ type: SUBMIT_TABLE_SIZE_SEGMENTATION_FAILURE, error });
    }
  });
};
export const open = (storeId) => (dispatch) => {
  dispatch({ type: OPEN_TABLE_SIZE_SEGMENTATION_REQUEST });
  dispatch(get(storeId)).then(({ data, error }) => {
    if (!error) {
      dispatch({ type: OPEN_TABLE_SIZE_SEGMENTATION_SUCCESS, data, storeId });
    } else {
      if (error.message === '404') {
        dispatch({ type: OPEN_TABLE_SIZE_SEGMENTATION_SUCCESS, data: {}, isCreating: true, storeId });
      } else {
        alert("Failed to fetch data.");
        dispatch({ type: OPEN_TABLE_SIZE_SEGMENTATION_FAILURE, error, storeId });
      }
    }
  });
};
export const openLinkUpQueueDisplayModal = () => ({ type: OPEN_LINK_UP_QUEUE_DISPLAY_MODAL });
export const closeLinkUpQueueDisplayModal = () => ({ type: CLOSE_LINK_UP_QUEUE_DISPLAY_MODAL });
export const submitLinkUp = (key) => (dispatch, getState) => {
  dispatch(startFetch());
  dispatch({ type: SUBMIT_LINK_UP_QUEUE_DISPLAY_REQUEST });
  const state = getState();
  const data = state.forms.tableSizeSegmentation;
  dispatch(linkUpDisplay(key, data.storeId)).then(({ error }) => {
    dispatch(stopFetch());
    if (!error) {
      dispatch({ type: SUBMIT_LINK_UP_QUEUE_DISPLAY_SUCCESS });
    } else {
      alert(error.message);
      dispatch({ type: SUBMIT_LINK_UP_QUEUE_DISPLAY_FAILURE, error });
    }
  });
};

function typeDiff(prev, next) {
  let prevTypes = {};
  let newTypes = [];
  prev.forEach(type => prevTypes[type.id] = type);
  next.forEach(type => {
    let { id } = type;
    if (!id || !prevTypes[id]) {
      let temp = { ...type };
      temp.id = undefined;
      newTypes.push(temp);
    }
  });
  let nextIds = next.map(d => d.id).filter(d => d != false);
  prev.forEach(type => {
    if (nextIds.indexOf(type.id) === -1) {
      prevTypes[type.id]['_destroy'] = true;
    }
  });
  return Object.keys(prevTypes).map(id => prevTypes[id]).concat(newTypes);
}
