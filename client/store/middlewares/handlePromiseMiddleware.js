import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';

import * as handlers from './promiseHandlers';

export const HANDLE_PROMISE = "HANDLE_PROMISE";

export default (store) => (next) => (action) => {
  // Check if need to handle promise
  const handlePromise = action && action[HANDLE_PROMISE];

  if (typeof handlePromise === 'undefined') {
    return next(action);
  }

  if (!isObject(handlePromise) ||
    !isObject(handlePromise.promise) ||
    !isFunction(handlePromise.promise.then)){
      return next(action);
    }

  // Wrap action
  const { promise, actions, ...settings } = handlePromise;

  let wrappedAction = (dispatch) => {
    // Register promise handlers
    let promiseHandlers = [];
    for (let handler in handlers) {
      if (handlers.hasOwnProperty(handler)) {
        promiseHandlers.push(new handlers[handler](dispatch, settings));
      }
    }

    promiseHandlers.map(handler => handler.onBeforePromise());

    // Handle promise
    return promise.then(
      (data) => {
        //have to update entities first.
        let state = typeof data.state !== "undefined" ? data.state : null;

        dispatch({ type: 'SET_HANDLE_PROMISE_ENTITIES', data: data.entities });

        // Dispatch actions if specified
        if (actions) {
          if (isArray(actions)) {
            for (let i in actions) {
              const { ...props } = actions[i];
              let opts = Object.assign({}, { data: state }, props, data);
              dispatch(opts);
            }
          } else if (isObject(actions)) {
            const { ...props } = actions;
            let opts = Object.assign({}, { data: state }, props, data);
            dispatch(opts);
          }
        }

        promiseHandlers.map(handler => handler.onAfterPromise());
        return data;
      }
    ).catch(
      (err) => {
        promiseHandlers.forEach(handler => handler.onCatchPromise(err));
      }
    );
  };

  return next(wrappedAction);
};
