export const ADD_ALERT = 'ADD_ALERT';
export const REMOVE_ALERT = 'REMOVE_ALERT';
export const TRUNCATE_ALERT = 'TRUNCATE_ALERT';

export function alert(style, message) {
  return {
    type: ADD_ALERT,
    style: style,
    message: message,
  };
}

export function removeAlert(message) {
  return {
    type: REMOVE_ALERT,
    message: message,
  };
}

export function truncateAlert() {
  return {
    type: TRUNCATE_ALERT,
  };
}
