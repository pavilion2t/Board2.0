import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

import Big from 'big.js';
import moment from 'moment';

import config from '../../../../client/configs/config';
import * as actions from '../../../../client/actions/formActions/paymentRefund';

import invoiceService from '../../../../client/services/invoiceService';
import PaymentRefundModal from '../../../../client/pages/invoice/components/paymentRefundModal';
const { TYPE, DEFAULT_PAYMENT_TYPE } = PaymentRefundModal;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

export default function () {

    describe('Payment Refund Actions', () => {
        let store = null;

        describe('startLoading()', () => {
          it('dispatch correct actions', () => {
            store = mockStore({});
            store.dispatch(actions.startLoading());
            expect(store.getActions()).toEqual([
              { type: actions.PAYMENT_REFUND_START_LOADING }
            ]);
          });
        });

        describe('stopLoading()', () => {
          it('dispatch correct actions', () => {
            store = mockStore({});
            store.dispatch(actions.stopLoading());
            expect(store.getActions()).toEqual([
              { type: actions.PAYMENT_REFUND_STOP_LOADING }
            ]);
          });
        });

        describe('clearErrors()', () => {
          it('dispatch correct actions', () => {
            store = mockStore({});
            store.dispatch(actions.clearErrors());
            expect(store.getActions()).toEqual([
              { type: actions.PAYMENT_REFUND_CLEAR_ERRORS }
            ]);
          });
        });

        describe('addErrors()', () => {
          it('dispatch correct actions', () => {
            store = mockStore({});
            store.dispatch(actions.addErrors([ 'error 1', 'error 2' ]));
            expect(store.getActions()).toEqual([
              { type: actions.PAYMENT_REFUND_ADD_ERRORS, payload: { errors: ['error 1', 'error 2']} }
            ]);
          });
        });

        describe('setErrors()', () => {
          it('dispatch correct actions', () => {
            store = mockStore({});
            store.dispatch(actions.setErrors([ 'error 1', 'error 2' ]));
            expect(store.getActions()).toEqual([
              { type: actions.PAYMENT_REFUND_SET_ERRORS, payload: { errors: ['error 1', 'error 2']} }
            ]);
          });
        });

        describe('openPaymentRefundModal()', () => {

          describe('Open a refund modal', () => {
            it('dispatch correct actions', () => {
              const now = moment();
              store = mockStore({});
              store.dispatch(actions.openPaymentRefundModal(
                TYPE.REFUND,
                '123',
                {
                  number:             '456789',
                  saleTransactions:   [],
                  refundTransactions: [],
                  total:              Big('100'),
                  paidTotal:          Big('50'),
                  refundTotal:        Big('20'),
                  amountLefted:       Big('70'),
                },
                789,
              ));
              expect(store.getActions()).toEqual([
                { type: actions.PAYMENT_REFUND_INIT },
                {
                  type: actions.PAYMENT_REFUND_OPEN,
                  payload: {
                    type:               TYPE.REFUND,
                    storeId:            '123',
                    orderNumber:        '456789',
                    amountDue:          Big('100'),
                    amountSettled:      Big('30'),
                    amountBalance:      Big('70'),
                    refundTo:           789,
                    saleTransactions:   [],
                    refundTransactions: [],
                    expYear:            now.format('YY'),
                    expMonth:           now.format('MM'),
                  }
                },
                { type: actions.PAYMENT_REFUND_CHANGE_REFUND_TO, payload: { refundTo: 789 }},
              ]);
            });
          });

          describe('Open a payment modal', () => {
            afterEach(() => {
              fetchMock.restore();
            });
            beforeEach((done) => {
              fetchMock.get(/v2\/stores\/\d+\/other_payment_instruments/, {
                payment_instruments: [
                  { id: 1, name: 'Other payment method 1', tippingEnabled: true },
                  { id: 2, name: 'Other payment method 2', tippingEnabled: false },
                  { id: 3, name: 'Other payment method 3', tippingEnabled: true },
                ],
              });

              store = mockStore({});
              store
                .dispatch(actions.openPaymentRefundModal(
                  TYPE.PAYMENT,
                  '123',
                  {
                    number:             '456789',
                    saleTransactions:   [],
                    refundTransactions: [],
                    total:              Big('100'),
                    paidTotal:          Big('50'),
                    refundTotal:        Big('20'),
                    amountLefted:       Big('70'),
                  },
                  789,
                ))
                .then(() => done());
            });
            it('dispatch correct actions', () => {
              const now = moment();

              expect(store.getActions()).toEqual([
                { type: actions.PAYMENT_REFUND_INIT },
                {
                  type: actions.PAYMENT_REFUND_OPEN,
                  payload: {
                    type:               TYPE.PAYMENT,
                    storeId:            '123',
                    orderNumber:        '456789',
                    amountDue:          Big('100'),
                    amountSettled:      Big('30'),
                    amountBalance:      Big('70'),
                    refundTo:           789,
                    saleTransactions:   [],
                    refundTransactions: [],
                    expYear:            now.format('YY'),
                    expMonth:           now.format('MM'),
                  }
                },
                { type: actions.PAYMENT_REFUND_START_LOADING },
                {
                  type: actions.PAYMENT_REFUND_CHANGE_AMOUNT,
                  payload: {
                    amount: Big('70'),
                  },
                },
                {
                  type: actions.PAYMENT_REFUND_CHANGE_FIELDS,
                  payload: {
                    paymentInstruments: [
                      { id: 1, name: 'Other payment method 1', tippingEnabled: true },
                      { id: 2, name: 'Other payment method 2', tippingEnabled: false },
                      { id: 3, name: 'Other payment method 3', tippingEnabled: true },
                    ],
                  }
                },
                { type: actions.PAYMENT_REFUND_STOP_LOADING },
              ]);
            });
          });

        });

        describe('closePaymentRefundModal()', () => {
          it('dispatch correct actions', () => {
            store = mockStore({});
            store.dispatch(actions.closePaymentRefundModal());
            expect(store.getActions()).toEqual([
              { type: actions.PAYMENT_REFUND_CLOSE }
            ]);
          });
        });

        describe('changeRefundTo()', () => {
          it('dispatch correct actions', () => {
            store = mockStore({});
            store.dispatch(actions.changeRefundTo('123'));
            expect(store.getActions()).toEqual([
              { type: actions.PAYMENT_REFUND_CHANGE_REFUND_TO, payload: { refundTo: 123 } }
            ]);
          });
        });

        describe('changePaymentType()', () => {
          it('dispatch correct actions', () => {
            store = mockStore({});
            store.dispatch(actions.changePaymentType(1));
            expect(store.getActions()).toEqual([
              { type: actions.PAYMENT_REFUND_CHANGE_PAYMENT_TYPE, payload: { instrumentId: 1 } }
            ]);
          });
        });

        describe('changeAmount()', () => {
          it('dispatch correct actions', () => {
            store = mockStore({});
            store.dispatch(actions.changeAmount(Big('123')));
            expect(store.getActions()).toEqual([
              { type: actions.PAYMENT_REFUND_CHANGE_AMOUNT, payload: { amount: Big('123') } }
            ]);
          });
        });

        describe('changeTenderAmount()', () => {
          it('dispatch correct actions', () => {
            store = mockStore({});
            store.dispatch(actions.changeTenderAmount(Big('123')));
            expect(store.getActions()).toEqual([
              { type: actions.PAYMENT_REFUND_CHANGE_TENDER_AMOUNT, payload: { tenderAmount: Big('123') } }
            ]);
          });
        });

        describe('changeField()', () => {
          it('dispatch correct actions', () => {
            store = mockStore({});
            store.dispatch(actions.changeField('foo', 'bar'));
            expect(store.getActions()).toEqual([
              { type: actions.PAYMENT_REFUND_CHANGE_FIELDS, payload: { foo: 'bar' } }
            ]);
          });
        });

        describe('changeFields()', () => {
          it('dispatch correct actions', () => {
            store = mockStore({});
            store.dispatch(actions.changeFields({ a: 1, b: 2}));
            expect(store.getActions()).toEqual([
              { type: actions.PAYMENT_REFUND_CHANGE_FIELDS, payload: { a: 1, b: 2 } }
            ]);
          });
        });

        describe('refundInvoice()', () => {

          describe('Call Invoice Return Money API', () => {
            beforeEach((done) => {
              spyOn(invoiceService, 'post').and.returnValue(
                Promise.resolve({ invoice: { id: 789 } })
              );
              store = mockStore({});
              store
                .dispatch(actions.refundInvoice({
                  storeId: 123,
                  orderNumber: 456,
                  refundTo: 789,
                  amount: Big('10'),
                  note: 'Remark notes',
                }))
                .then(() => done());
            });
            it('pass correct params', () => {
              const expectParams = {
                return: {
                  transactions_to_be_refunded: [
                    { transaction_id: 789, amount: '10', note: 'Remark notes' },
                  ]
                }
              };
              expect(invoiceService.post).toHaveBeenCalledWith(
                'v2/stores/123/invoices/456/returns', expectParams, config.gateway
              );
            });
          });

          describe('Refund success scenario', () => {
            afterEach(() => {
              fetchMock.restore();
            });
            beforeEach((done) => {
              fetchMock.post(/v2\/stores\/\d+\/invoices\/\d+\/returns/, {
                order: { foo: 'bar' }
              });

              store = mockStore({});
              store
                .dispatch(actions.refundInvoice({
                  storeId: 123,
                  orderNumber: 456,
                  refundTo: 789,
                  amount: Big('10'),
                  note: 'Remark notes',
                }))
                .then(() => done());
            });
            it('dispatch correct actions', () => {
              expect(store.getActions()).toEqual([
                { type: actions.PAYMENT_REFUND_START_LOADING },
                { type: actions.PAYMENT_REFUND_SUCCESS_REFUND, payload: { amount: Big('10'), order: { foo: 'bar' } } },
                { type: actions.PAYMENT_REFUND_STOP_LOADING },
              ]);
            });
          });

          describe('Refund failure scenario', () => {
            afterEach(() => {
                fetchMock.restore();
            });
            beforeEach((done) => {
              fetchMock.post(/v2\/stores\/\d+\/invoices\/\d+\/returns/, {
                status: 404,
                body: { message: 'Transaction return fail' },
              });

              store = mockStore({});
              store
                .dispatch(actions.refundInvoice({
                  storeId: 123,
                  orderNumber: 456,
                  refundTo: 789,
                  amount: Big('10'),
                  note: 'Remark notes',
                }))
                .then(() => done());
            });
            it('dispatch correct actions', () => {
              expect(store.getActions()).toEqual([
                { type: actions.PAYMENT_REFUND_START_LOADING },
                { type: actions.PAYMENT_REFUND_SET_ERRORS, payload: { errors: ['Transaction return fail'] } },
                { type: actions.PAYMENT_REFUND_STOP_LOADING },
              ]);
            });
          });

        });

        describe('payInvoice()', () => {

          describe('Call Invoice Pay Money API', () => {

            describe('Pay by Cash', () => {
              beforeEach((done) => {
                spyOn(invoiceService, 'post').and.returnValue(
                  Promise.resolve({ invoice: { id: 789 } })
                );
                store = mockStore({});
                store
                  .dispatch(actions.payInvoice({
                    storeId:        123,
                    orderNumber:    456,
                    instrumentId:   DEFAULT_PAYMENT_TYPE.CASH,
                    instrumentName: null,
                    amount:         Big('10'),
                    tenderAmount:   Big('100'),
                    changeAmount:   Big('90'),
                    showChange:     true,
                    note:           'Remark notes',
                    cardNumber:     '',
                    expMonth:       '',
                    expYear:        '',
                    cvv:            '',
                  }))
                  .then(() => done());
              });
              it('pass correct params', () => {
                const expectParams = {
                  order: {
                    payment: {
                      cashes: [ { amount: '10', change_amount: '90', note: 'Remark notes' } ]
                    },
                  },
                };
                expect(invoiceService.post).toHaveBeenCalledWith(
                  'v2/stores/123/invoices/456/pay', expectParams, config.gateway
                );
              });
            });

            describe('Pay by Other Payment Method', () => {
              beforeEach((done) => {
                spyOn(invoiceService, 'post').and.returnValue(
                  Promise.resolve({ invoice: { id: 789 } })
                );
                store = mockStore({});
                store
                  .dispatch(actions.payInvoice({
                    storeId:        123,
                    orderNumber:    456,
                    instrumentId:   789,
                    instrumentName: 'Other payment method',
                    amount:         Big('10'),
                    tipsAmount:     Big('40'),
                    showTips:       true,
                    note:           'Remark notes',
                    cardNumber:     '',
                    expMonth:       '',
                    expYear:        '',
                    cvv:            '',
                  }))
                  .then(() => done());
              });
              it('pass correct params', () => {
                const expectParams = {
                  order: {
                    payment: {
                      others: [ { amount: '50', tips_amount: '40', note: 'Remark notes', instrument_id: 789, instrument_name: 'Other payment method' } ]
                    },
                  },
                };
                expect(invoiceService.post).toHaveBeenCalledWith(
                  'v2/stores/123/invoices/456/pay', expectParams, config.gateway
                );
              });
            });

            describe('Pay by Credit Card', () => {
              beforeEach((done) => {
                spyOn(invoiceService, 'post').and.returnValue(
                  Promise.resolve({ invoice: { id: 789 } })
                );
                store = mockStore({});
                store
                  .dispatch(actions.payInvoice({
                    storeId:        123,
                    orderNumber:    456,
                    instrumentId:   DEFAULT_PAYMENT_TYPE.CREDIT_CARD,
                    instrumentName: null,
                    amount:         Big('10'),
                    note:           'Remark notes',
                    cardNumber:     '4111111111111111',
                    expMonth:       '11',
                    expYear:        '18',
                    cvv:            '737',
                  }))
                  .then(() => done());
              });
              it('pass correct params', () => {
                const expectParams = {
                  order: {
                    payment: {
                      credit_cards: [
                        {
                          amount:   '10',
                          note:     'Remark notes',
                          number:   '4111111111111111',
                          exp_month: '11',
                          exp_year:  '18',
                          cvv:      '737',
                        }
                      ]
                    },
                  },
                };
                expect(invoiceService.post).toHaveBeenCalledWith(
                  'v2/stores/123/invoices/456/pay', expectParams, config.gateway
                );
              });
            });

          });

          describe('Payment success scenario', () => {
            afterEach(() => {
              fetchMock.restore();
            });
            beforeEach((done) => {
              fetchMock.post(/v2\/stores\/\d+\/invoices\/\d+\/pay/, {
                order: { foo: 'bar' }
              });

              store = mockStore({});
              store
                .dispatch(actions.payInvoice({
                  storeId:        123,
                  orderNumber:    456,
                  instrumentId:   DEFAULT_PAYMENT_TYPE.CHECK,
                  instrumentName: null,
                  amount:         Big('10'),
                  note:           'Remark notes',
                  cardNumber:     '',
                  expMonth:       '',
                  expYear:        '',
                  cvv:            '',
                }))
                .then(() => done());
            });
            it('dispatch correct actions', () => {
              expect(store.getActions()).toEqual([
                { type: actions.PAYMENT_REFUND_CLEAR_ERRORS },
                { type: actions.PAYMENT_REFUND_START_LOADING },
                { type: actions.PAYMENT_REFUND_SUCCESS_PAY, payload: { amount: Big('10'), order: { foo: 'bar' } } },
                { type: actions.PAYMENT_REFUND_STOP_LOADING },
              ]);
            });
          });

          describe('Payment failure scenario', () => {
            afterEach(() => {
                fetchMock.restore();
            });
            beforeEach((done) => {
              fetchMock.post(/v2\/stores\/\d+\/invoices\/\d+\/pay/, {
                status: 404,
                body: { message: 'Pay invoice fail' },
              });

              store = mockStore({});
              store
                .dispatch(actions.payInvoice({
                  storeId:        123,
                  orderNumber:    456,
                  instrumentId:   DEFAULT_PAYMENT_TYPE.CHECK,
                  instrumentName: null,
                  amount:         Big('10'),
                  note:           'Remark notes',
                  cardNumber:     '',
                  expMonth:       '',
                  expYear:        '',
                  cvv:            '',
                }))
                .then(() => done());
            });
            it('dispatch correct actions', () => {
              expect(store.getActions()).toEqual([
                { type: actions.PAYMENT_REFUND_CLEAR_ERRORS },
                { type: actions.PAYMENT_REFUND_START_LOADING },
                { type: actions.PAYMENT_REFUND_SET_ERRORS, payload: { errors: ['Pay invoice fail'] } },
                { type: actions.PAYMENT_REFUND_STOP_LOADING },
              ]);
            });
          });

        });

    });

}
