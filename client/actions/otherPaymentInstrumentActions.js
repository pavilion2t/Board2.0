import { HANDLE_PROMISE } from '../store/middlewares/handlePromiseMiddleware';
import { SET_PATH_STATE } from './baseActions';
import otherPaymentInstrumentService from '../services/otherPaymentInstrumentService';

import { normalize, arrayOf } from 'normalizr';
import { PaymentSchema } from '../store/middlewares/schema';

export function getOtherPaymentInstrument(storeId, path) {
  return {
    [HANDLE_PROMISE]: {
      promise: otherPaymentInstrumentService.getAll(storeId)
                  .then((res) => normalize(res.payment_instruments, arrayOf(PaymentSchema))),
      actions: {
        type: SET_PATH_STATE,
        stateName: 'payment_instruments',
        path: path,
      }
    }
  };
}

export function updateOtherPaymentInstrument(storeId, data, path) {
  return {
    [HANDLE_PROMISE]: {
      promise: otherPaymentInstrumentService.updateAll(storeId, data)
                  .then((res) => normalize(res.payment_instruments, arrayOf(PaymentSchema))),
      actions: {
        type: SET_PATH_STATE,
        stateName: 'payment_instruments',
        path: path,
      }
    }
  };
}


