import Big from 'big.js';

import * as actions from '../../../../../client/actions/formActions/paymentRefund';
import reducer from '../../../../../client/store/reducers/formsReducer/paymentRefund';

import PaymentRefundModal from '../../../../../client/pages/invoice/components/paymentRefundModal';
const { TYPE, DEFAULT_PAYMENT_TYPE } = PaymentRefundModal;

export default function () {

  describe('Payment Refund Reducer', () => {

    const initialState = {
      loading:            false,
      isOpen:             false,
      type:               TYPE.PAYMENT,
      storeId:            '',
      orderNumber:        null,
      amountDue:          Big(0),
      amountSettled:      Big(0),
      amountBalance:      Big(0),
      refundTo:           null,
      saleTransactions:   [],
      refundTransactions: [],
      amount:             Big(0),
      max:                null,
      tenderAmount:       Big(0),
      changeAmount:       Big(0),
      tipsAmount:         Big(0),
      showTips:           false,
      showChange:         true,
      note:               '',
      errors:             [],
      successResponse:    null,
      instrumentId:       DEFAULT_PAYMENT_TYPE.CASH,
      instrumentName:     '',
      paymentInstruments: [],
      cardNumber:         '',
      expMonth:           '',
      expYear:            '',
      cvv:                '',
    };

    describe(actions.PAYMENT_REFUND_INIT, () => {
      it('should initial state', () => {
        const state = { for: 'bar' };
        const action = { type: actions.PAYMENT_REFUND_INIT };
        expect(reducer(state, action)).toEqual(initialState);
      });
    });

    describe(actions.PAYMENT_REFUND_OPEN, () => {
      it('should update state', () => {
        const state = { isOpen: false };
        const action = {
          type: actions.PAYMENT_REFUND_OPEN,
          payload: { type: TYPE.PAYMENT, storeId: '123', orderNumber: '456' },
        };
        expect(reducer(state, action)).toEqual(
          jasmine.objectContaining({
            isOpen: true,
            type: TYPE.PAYMENT,
            storeId: '123',
            orderNumber: '456',
          })
        );
      });

      it('should validate madatory info', () => {
        const state1 = { isOpen: false };
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_OPEN,
          payload: {},
        });
        const state3 = reducer(state2, {
          type: actions.PAYMENT_REFUND_OPEN,
          payload: { type: TYPE.PAYMENT },
        });
        const state4 = reducer(state3, {
          type: actions.PAYMENT_REFUND_OPEN,
          payload: { type: TYPE.PAYMENT, storeId: '123' },
        });
        const state5 = reducer(state4, {
          type: actions.PAYMENT_REFUND_OPEN,
          payload: { type: TYPE.PAYMENT, storeId: '123', orderNumber: '456' },
        });
        expect(state2).toEqual(state1);
        expect(state3).toEqual(state1);
        expect(state4).toEqual(state1);
        expect(state5).toEqual(
          jasmine.objectContaining({
            isOpen:      true,
            type:        TYPE.PAYMENT,
            storeId:     '123',
            orderNumber: '456',
          })
        );
      });
    });

    describe(actions.PAYMENT_REFUND_CLOSE, () => {
      it('should update state', () => {
        const state = { isOpen: true };
        const action = { type: actions.PAYMENT_REFUND_CLOSE };
        expect(reducer(state, action)).toEqual({ isOpen: false });
      });
    });

    describe(actions.PAYMENT_REFUND_CHANGE_REFUND_TO, () => {
      it('should update state', () => {
        const state = {
          refundTo: null,
          saleTransactions: [
            { id: 123, amountLefted: Big('0') },
            { id: 456, amountLefted: Big('1') },
            { id: 789, amountLefted: Big('2') },
          ],
          amount: null,
          max: null,
        };
        const action = { type: actions.PAYMENT_REFUND_CHANGE_REFUND_TO, refundTo: 456 };
        expect(reducer(state, action)).toEqual(
          jasmine.objectContaining({
            refundTo: 456,
            amount:   Big('1'),
            max:      Big('1'),
          })
        );
      });

      it('should set to first refundable transaction if refund to is null', () => {
        const state = {
          refundTo: null,
          saleTransactions: [
            { id: 123, amountLefted: Big('0') },
            { id: 456, amountLefted: Big('1') },
            { id: 789, amountLefted: Big('2') },
          ],
          amount: null,
          max: null,
        };
        const action = { type: actions.PAYMENT_REFUND_CHANGE_REFUND_TO, refundTo: null };
        expect(reducer(state, action)).toEqual(
          jasmine.objectContaining({
            refundTo: 456,
            amount:   Big('1'),
            max:      Big('1'),
          })
        );
      });

      it('should reject refund to a non-refundable transaction', () => {
        const state = {
          refundTo: null,
          saleTransactions: [
            { id: 123, amountLefted: Big('0') },
            { id: 456, amountLefted: Big('1') },
            { id: 789, amountLefted: Big('2') },
          ],
          amount: null,
          max: null,
        };
        const action = { type: actions.PAYMENT_REFUND_CHANGE_REFUND_TO, refundTo: 123 };
        expect(reducer(state, action)).toEqual(
          jasmine.objectContaining({
            refundTo: 456,
            amount:   Big('1'),
            max:      Big('1'),
          })
        );
      });
    });

    describe(actions.PAYMENT_REFUND_CHANGE_AMOUNT, () => {
      it('should update state', () => {
        const state1 = {
          amount:       Big('10'),
          max:          Big('100'),
          tenderAmount: Big('10'),
          changeAmount: Big('0'),
        };
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_CHANGE_AMOUNT,
          payload: { amount: Big('20') },
        });
        expect(state2).toEqual(
          jasmine.objectContaining({ amount: Big('20') })
        );
      });

      it('should not greater than max', () => {
        const state1 = {
          amount:       Big('10'),
          max:          Big('100'),
          tenderAmount: Big('10'),
          changeAmount: Big('0'),
        };
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_CHANGE_AMOUNT,
          payload: { amount: Big('200') },
        });
        const state3 = reducer(state2, {
          type: actions.PAYMENT_REFUND_CHANGE_AMOUNT,
          payload: { amount: Big('20') },
        });
        const state4 = Object.assign({}, state3, { max: null });
        const state5 = reducer(state4, {
          type: actions.PAYMENT_REFUND_CHANGE_AMOUNT,
          payload: { amount: Big('200') },
        });
        expect(state2).toEqual(
          jasmine.objectContaining({ amount: Big('100') })
        );
        expect(state3).toEqual(
          jasmine.objectContaining({ amount: Big('20') })
        );
        expect(state5).toEqual(
          jasmine.objectContaining({ amount: Big('200') })
        );
      });

      it('should not less than zero', () => {
        const state1 = {
          amount:       Big('10'),
          max:          Big('100'),
          tenderAmount: Big('10'),
          changeAmount: Big('0'),
        };
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_CHANGE_AMOUNT,
          payload: { amount: Big('-1') },
        });
        const state3 = reducer(state2, {
          type: actions.PAYMENT_REFUND_CHANGE_AMOUNT,
          payload: { amount: Big('20') },
        });
        expect(state2).toEqual(
          jasmine.objectContaining({ amount: Big('0') })
        );
        expect(state3).toEqual(
          jasmine.objectContaining({ amount: Big('20') })
        );
      });

      it('should affect tender amount', () => {
        const state1 = {
          amount:       Big('10'),
          max:          Big('100'),
          tenderAmount: Big('10'),
          changeAmount: Big('0'),
        };
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_CHANGE_AMOUNT,
          payload: { amount: Big('20') },
        });
        const state3 = reducer(state2, {
          type: actions.PAYMENT_REFUND_CHANGE_AMOUNT,
          payload: { amount: Big('30') },
        });
        expect(state2).toEqual(
          jasmine.objectContaining({
            amount:       Big('20'),
            max:          Big('100'),
            tenderAmount: Big('20'),
            changeAmount: Big('0'),
          })
        );
        expect(state3).toEqual(
          jasmine.objectContaining({
            amount:       Big('30'),
            max:          Big('100'),
            tenderAmount: Big('30'),
            changeAmount: Big('0'),
          })
        );
      });

      it('should re-calculate change amount', () => {
        const state1 = {
          amount:       Big('10'),
          max:          Big('100'),
          tenderAmount: Big('100'),
          changeAmount: Big('0'),
        };
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_CHANGE_AMOUNT,
          payload: { amount: Big('20') },
        });
        const state3 = reducer(state2, {
          type: actions.PAYMENT_REFUND_CHANGE_AMOUNT,
          payload: { amount: Big('30') },
        });
        expect(state2).toEqual(
          jasmine.objectContaining({
            amount:       Big('20'),
            max:          Big('100'),
            tenderAmount: Big('100'),
            changeAmount: Big('80'),
          })
        );
        expect(state3).toEqual(
          jasmine.objectContaining({
            amount:       Big('30'),
            max:          Big('100'),
            tenderAmount: Big('100'),
            changeAmount: Big('70'),
          })
        );
      });
    });

    describe(actions.PAYMENT_REFUND_CHANGE_FIELDS, () => {
      it('should update state', () => {
        const state1 = {};
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_CHANGE_FIELDS,
          payload: { a: 1 },
        });
        const state3 = reducer(state2, {
          type: actions.PAYMENT_REFUND_CHANGE_FIELDS,
          payload: { b: 2 },
        });
        const state4 = reducer(state3, {
          type: actions.PAYMENT_REFUND_CHANGE_FIELDS,
          payload: { c: 3, d: 4 },
        });
        const state5 = reducer(state4, {
          type: actions.PAYMENT_REFUND_CHANGE_FIELDS,
          payload: { a: 0 },
        });
        expect(state2).toEqual({ a: 1 });
        expect(state3).toEqual({ a: 1, b: 2 });
        expect(state4).toEqual({ a: 1, b: 2, c: 3, d: 4 });
        expect(state5).toEqual({ a: 0, b: 2, c: 3, d: 4 });
      });
    });

    describe(actions.PAYMENT_REFUND_START_LOADING, () => {
      it('should update state', () => {
        const state = { loading: false };
        const action = { type: actions.PAYMENT_REFUND_START_LOADING };
        expect(reducer(state, action)).toEqual({ loading: true });
      });
    });

    describe(actions.PAYMENT_REFUND_STOP_LOADING, () => {
      it('should update state', () => {
        const state = { loading: true };
        const action = { type: actions.PAYMENT_REFUND_STOP_LOADING };
        expect(reducer(state, action)).toEqual({ loading: false });
      });
    });

    describe(actions.PAYMENT_REFUND_CLEAR_ERRORS, () => {
      it('should update state', () => {
        const state = { errors: ['error 1', 'error 2'] };
        const action = { type: actions.PAYMENT_REFUND_CLEAR_ERRORS };
        expect(reducer(state, action)).toEqual({ errors: [] });
      });
    });

    describe(actions.PAYMENT_REFUND_ADD_ERRORS, () => {
      it('should update state', () => {
        const state1 = { errors: ['error 1', 'error 2'] };
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_ADD_ERRORS,
          payload: { errors: ['error 3']},
        });
        const state3 = reducer(state2, {
          type: actions.PAYMENT_REFUND_ADD_ERRORS,
          payload: { errors: ['error 4', 'error 5']},
        });
        expect(state2).toEqual({ errors: ['error 1', 'error 2', 'error 3'] });
        expect(state3).toEqual({ errors: ['error 1', 'error 2', 'error 3', 'error 4', 'error 5'] });
      });
    });

    describe(actions.PAYMENT_REFUND_SET_ERRORS, () => {
      it('should update state', () => {
        const state1 = { errors: ['error 1', 'error 2'] };
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_SET_ERRORS,
          payload: { errors: ['error 3']},
        });
        const state3 = reducer(state2, {
          type: actions.PAYMENT_REFUND_SET_ERRORS,
          payload: { errors: ['error 4', 'error 5']},
        });
        expect(state2).toEqual({ errors: ['error 3'] });
        expect(state3).toEqual({ errors: ['error 4', 'error 5'] });
      });
    });

    describe(actions.PAYMENT_REFUND_SUCCESS_REFUND, () => {
      it('should update state', () => {
        const state1 = { amountDue: Big('100'), amountSettled: Big('10'), amountBalance: Big('90') };
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_SUCCESS_REFUND,
          payload: {
            order: { foo: 'bar' },
            amount: Big('10'),
          },
        });
        expect(state2).toEqual(
          jasmine.objectContaining({
            amountSettled: Big('0'),
            amountBalance: Big('100'),
            successResponse: { foo: 'bar' }
          })
        );
      });
    });

    describe(actions.PAYMENT_REFUND_SUCCESS_PAY, () => {
      it('should update state', () => {
        const state1 = { amountDue: Big('100'), amountSettled: Big('10'), amountBalance: Big('90') };
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_SUCCESS_PAY,
          payload: {
            order: { foo: 'bar' },
            amount: Big('10'),
          },
        });
        expect(state2).toEqual(
          jasmine.objectContaining({
            amountSettled: Big('20'),
            amountBalance: Big('80'),
            successResponse: { foo: 'bar' }
          })
        );
      });
    });

    describe(actions.PAYMENT_REFUND_CHANGE_PAYMENT_TYPE, () => {
      it('should update state', () => {
        const state1 = {
          paymentInstruments: [],
        };
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_CHANGE_PAYMENT_TYPE,
          payload: { instrumentId: 1 },
        });
        expect(state2).toEqual(
          jasmine.objectContaining({
            instrumentId: 1,
          })
        );
      });

      it('should update showChange flag', () => {
        const state1 = {
          paymentInstruments: [
            { id: 1000, tippingEnabled: false },
            { id: 2000, tippingEnabled: true },
          ],
        };
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_CHANGE_PAYMENT_TYPE,
          payload: { instrumentId: DEFAULT_PAYMENT_TYPE.CASH },
        });
        expect(state2).toEqual(
          jasmine.objectContaining({
            instrumentId: DEFAULT_PAYMENT_TYPE.CASH,
            showTips: false,
            showChange: true,
          })
        );
      });

      it('should update showTips flag', () => {
        const state1 = {
          paymentInstruments: [
            { id: 1000, tippingEnabled: false },
            { id: 2000, tippingEnabled: true },
          ],
        };
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_CHANGE_PAYMENT_TYPE,
          payload: { instrumentId: DEFAULT_PAYMENT_TYPE.CHECK },
        });
        const state3 = reducer(state2, {
          type: actions.PAYMENT_REFUND_CHANGE_PAYMENT_TYPE,
          payload: { instrumentId: DEFAULT_PAYMENT_TYPE.CREDIT_CARD },
        });
        const state4 = reducer(state3, {
          type: actions.PAYMENT_REFUND_CHANGE_PAYMENT_TYPE,
          payload: { instrumentId: 1000 },
        });
        const state5 = reducer(state4, {
          type: actions.PAYMENT_REFUND_CHANGE_PAYMENT_TYPE,
          payload: { instrumentId: 2000 },
        });
        expect(state2).toEqual(
          jasmine.objectContaining({
            instrumentId: DEFAULT_PAYMENT_TYPE.CHECK,
            showTips: false,
            showChange: false,
          })
        );
        expect(state3).toEqual(
          jasmine.objectContaining({
            instrumentId: DEFAULT_PAYMENT_TYPE.CREDIT_CARD,
            showTips: true,
            showChange: false,
          })
        );
        expect(state4).toEqual(
          jasmine.objectContaining({
            instrumentId: 1000,
            showTips: false,
            showChange: false,
          })
        );
        expect(state5).toEqual(
          jasmine.objectContaining({
            instrumentId: 2000,
            showTips: true,
            showChange: false,
          })
        );
      });

    });


    describe(actions.PAYMENT_REFUND_CHANGE_TENDER_AMOUNT, () => {

      it('should update state', () => {
        const state1 = {
          amount:       Big('10'),
          max:          Big('100'),
          tenderAmount: Big('10'),
          changeAmount: Big('0'),
        };
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_CHANGE_TENDER_AMOUNT,
          payload: { tenderAmount: Big('20') },
        });
        expect(state2).toEqual(
          jasmine.objectContaining({
            amount:       Big('10'),
            max:          Big('100'),
            tenderAmount: Big('20'),
            changeAmount: Big('10'),
          })
        );
      });

      it('should not less than payment amount', () => {
        const state1 = {
          amount:       Big('10'),
          max:          Big('100'),
          tenderAmount: Big('10'),
          changeAmount: Big('0'),
        };
        const state2 = reducer(state1, {
          type: actions.PAYMENT_REFUND_CHANGE_TENDER_AMOUNT,
          payload: { tenderAmount: Big('0') },
        });
        expect(state2).toEqual(
          jasmine.objectContaining({
            amount:       Big('10'),
            max:          Big('100'),
            tenderAmount: Big('10'),
            changeAmount: Big('0'),
          })
        );
      });

    });

  });
}
