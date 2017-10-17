import { REMOVE_ALERT } from '~/actions/alertActions';

const alertMiddleware = (store) => (next) => (action) => {

  let result = next(action);

  setTimeout(() => {
    next({
      type: REMOVE_ALERT,
      message: action.message
    });
  }, 3000);

  return result;
};

export default alertMiddleware;
