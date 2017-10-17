export const START_FETCH = 'START_FETCH';
export const STOP_FETCH = 'STOP_FETCH';
export const SET_PATH_STATE = 'SET_PATH_STATE';

export function startFetch() {
  return {
    type: START_FETCH
  };
}

export function stopFetch() {
  return {
    type: STOP_FETCH,
  };
}

export function setPathState(path, stateName, result){
  return {
    type: SET_PATH_STATE,
    path,
    stateName,
    result,
  };
}