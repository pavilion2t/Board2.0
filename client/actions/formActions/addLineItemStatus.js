import { createLineItemStatus, updateLineItemStatus } from '~/actions/lineItemStatusAction';

export const OPEN_ADD_LINE_ITEM_STATUS = 'OPEN_ADD_LINE_ITEM_STATUS';
export const CLOSE_ADD_LINE_ITEM_STATUS = 'CLOSE_ADD_LINE_ITEM_STATUS';
export const CHANGE_LINE_ITEM_STATUS_INPUT = 'CHANGE_LINE_ITEM_STATUS_INPUT';

export const SAVE_LINE_ITEM_STATUS_REQUEST = 'SAVE_LINE_ITEM_STATUS_REQUEST';
export const SAVE_LINE_ITEM_STATUS_SUCCESS = 'SAVE_LINE_ITEM_STATUS_SUCCESS';
export const SAVE_LINE_ITEM_STATUS_FAILURE = 'SAVE_LINE_ITEM_STATUS_FAILURE';


export const openAddLineItemStatus = ({ storeId, initialValues, isCreating }) => ({ type: OPEN_ADD_LINE_ITEM_STATUS, initialValues, storeId, isCreating });

export const closeAddLineItemStatus = () => ({ type: CLOSE_ADD_LINE_ITEM_STATUS });

export const changeLineItemStatusInput = (value) => ({ type: CHANGE_LINE_ITEM_STATUS_INPUT, value });

export const saveLineItemStatus = () => (dispatch, getState) => {
  dispatch({ type: SAVE_LINE_ITEM_STATUS_REQUEST  });

  const state = getState();
  const { input, storeId, isCreating, initialValues } = state.forms.addLineItemStatus;
  let nextAction = isCreating ? createLineItemStatus(input.value, '#FFFFFF', storeId) : updateLineItemStatus(initialValues.id, { status: input.value }, storeId);
  dispatch(nextAction).then(response => {
    const { error } = response;
    if (!error) {
      dispatch({ type: SAVE_LINE_ITEM_STATUS_SUCCESS });
    } else {
      dispatch({ type: SAVE_LINE_ITEM_STATUS_FAILURE });
    }
  });
};
