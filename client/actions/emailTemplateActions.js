import emailTemplateService from '../services/emailTemplateService';
import * as alertActions from './alertActions';

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const EMAIL_TEMPLATE_TYPE = emailTemplateService.TYPE;

const sendEmail = (storeId, template_type, recipient, params = {}) => (dispatch) => {
  return emailTemplateService.send(storeId, template_type, recipient, params)
    .then(res => {
      return dispatch(alertActions.alert('success', 'Send Email Template Success'));
    })
    .catch(err => {
      return dispatch(alertActions.alert('danger', err.message));
    });
};

/* istanbul ignore next */
const askRecipientThenSendEmail = ({storeId, templateType, defaultRecipient, params = {}}, msg = 'Please enter customer\'s email') => (dispatch) => {
  const askEmail = (prevRecipient) => {
    let errorMsg = prevRecipient ? `"${prevRecipient}" is not a valid email address.\n` : "";
    let promptMsg = errorMsg + msg;
    let recipient = window.prompt(promptMsg, defaultRecipient || '');
    // Press cancel
    if (recipient == null) {
      return;
    }
    // Validate recipient email address
    recipient = (recipient || '').trim();
    if (EMAIL_PATTERN.test(recipient)) {
      return sendEmail(storeId, templateType, recipient, params)(dispatch);
    } else {
      return askEmail(recipient);
    }
  };
  return askEmail();
};

export {
  EMAIL_PATTERN,
  EMAIL_TEMPLATE_TYPE,
  sendEmail,
  askRecipientThenSendEmail,
};
