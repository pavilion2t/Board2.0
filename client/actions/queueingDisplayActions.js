import { camelizeKeys } from 'humps';
import queueingDisplayService from '~/services/queueingDisplayService';


export const LINK_UP_QUEUEING_DISPLAY_REQUEST = 'LINK_UP_QUEUEING_DISPLAY_REQUEST';
export const LINK_UP_QUEUEING_DISPLAY_SUCCESS = 'LINK_UP_QUEUEING_DISPLAY_SUCCESS';
export const LINK_UP_QUEUEING_DISPLAY_FAILURE = 'LINK_UP_QUEUEING_DISPLAY_FAILURE';

export const linkUpDisplay = (key, storeId) => (dispatch) => {
  dispatch({ type: LINK_UP_QUEUEING_DISPLAY_REQUEST });
  return queueingDisplayService.linkUpDisplay(key, storeId)
    .then(resp => {
      let { station } = resp;
      if (station){
        let data = camelizeKeys(station);
        dispatch({ type: LINK_UP_QUEUEING_DISPLAY_SUCCESS, data });
        return { data };
      } else {
        let error = new Error(resp.message);
        dispatch({ type: LINK_UP_QUEUEING_DISPLAY_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: LINK_UP_QUEUEING_DISPLAY_FAILURE, error });
      return { error };
    });
};
