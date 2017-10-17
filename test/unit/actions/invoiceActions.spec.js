import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

import * as invoiceConst from '~/pages/invoice/constant';

import * as alertActions from '~/actions/alertActions';
import * as baseActions from '~/actions/baseActions';
import * as invoiceActions from '~/actions/invoiceActions';

import invoiceService from '~/services/invoiceService';
import deliveryOrderService from '~/services/deliveryOrderService';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store = null;

const actions = { ...alertActions, ...invoiceActions, ...baseActions };
const VOID_TRANSACTION_URL = /v2\/stores\/\d+\/invoices\/\d+\/transactions\/\d+\/void/;
const GET_DELIVERY_NOTE_URL = /v2\/stores\/\d+\/delivery_orders/;

export default function () {

  describe('Invoice Actions', () => {

    describe('loadInvoiceToForm()', () => {

      describe('Load an invoice with all line item details and unit group info', () => {
        afterEach(() => {
          fetchMock.restore();
        });
        beforeEach((done) => {
          fetchMock.get(/v2\/stores\/\d+\/invoices\/\d+/, {
            invoice: {
              id: 22, listingLineItems: [
                { purchasableId: 333 },
                { purchasableId: 444 },
              ]
            }
          });
          fetchMock.get(/v2\/stores\/\d+\/listings\/by/, {
            page: 1,
            count: 2,
            totalCount: 2,
            totalPages: 1,
            data: {
              listings: [
                { id: 333 },
                { id: 444, unitGroupId: 5555 },
              ],
            },
          });
          fetchMock.get(/v2\/stores\/\d+\/unit_groups\/\d+/, {
            unit_group: {
              id: 5555,
              name: 'weight',
              units: [
                { id: 66666 },
                { id: 77777 },
              ],
            },
          });

          store = mockStore({});
          store
            .dispatch(actions.loadInvoiceToForm(invoiceConst.INVOICE_TYPE, 1, 22))
            .then(() => done());
        });
        it('dispatch correct actions', () => {
          expect(store.getActions()).toEqual(
            jasmine.arrayContaining([
              { type: actions.START_FETCH },
              jasmine.objectContaining({
                type: actions.LOAD_INVOICE_TO_FORM,
                data: jasmine.objectContaining({ id: 22 })
              }),
              jasmine.objectContaining({
                type: actions.PATCH_INVOICE_LISTING_MISSING_INFO,
                data: [
                  jasmine.objectContaining({ id: 333 }),
                  jasmine.objectContaining({ id: 444 }),
                ],
              }),
              jasmine.objectContaining({
                type: actions.PATCH_INVOICE_LISTING_UNIT_GROUP,
                data: {
                  unitGroups: {
                    5555: jasmine.any(Object),
                  },
                  units: {
                    66666: jasmine.any(Object),
                    77777: jasmine.any(Object),
                  },
                },
              }),
              { type: actions.STOP_FETCH },
            ])
          );
        });
      });

      describe('Load a quote', () => {
        afterEach(() => {
          fetchMock.restore();
        });
        beforeEach((done) => {
          fetchMock.get(/v2\/stores\/\d+\/quotes\/\d+/, {
            quote: {
              id: 22, listingLineItems: []
            }
          });

          store = mockStore({});
          store
            .dispatch(actions.loadInvoiceToForm(invoiceConst.QUOTE_TYPE, 1, 22))
            .then(() => done());
        });
        it('dispatch correct actions', () => {
          expect(store.getActions()).toEqual(
            jasmine.arrayContaining([
              { type: actions.START_FETCH },
              jasmine.objectContaining({
                type: actions.LOAD_INVOICE_TO_FORM,
                data: jasmine.objectContaining({ id: 22 })
              }),
              { type: actions.STOP_FETCH },
            ])
          );
        });
      });

    });

    describe('voidTransaction()', () => {

      describe('Success Scenario', () => {
        afterEach(fetchMock.restore);
        beforeEach((done) => {
          spyOn(invoiceService, 'voidTransaction').and.returnValue(Promise.resolve());
          fetchMock.put(VOID_TRANSACTION_URL, {});
          store = mockStore({});
          store
            .dispatch(actions.voidTransaction('123', '456', '789'))
            .then(() => done());
        });

        it('dispatch correct actions', () => {
          expect(store.getActions()).toEqual(
            [
              { type: actions.START_FETCH },
            ]
          );
        });

        it('call service with correct params', () => {
          expect(invoiceService.voidTransaction).toHaveBeenCalledWith('123', '456', '789');
        });
      });

      describe('Failure Scenario', () => {
        afterEach(fetchMock.restore);
        beforeEach((done) => {
          fetchMock.put(VOID_TRANSACTION_URL, { status: 404, body: { message: 'Void Transaction Error'} });
          store = mockStore({});
          store
            .dispatch(actions.voidTransaction('123', '456', '789'))
            .then(() => done());
        });
        it('dispatch correct actions', () => {
          expect(store.getActions()).toEqual(
            [
              { type: actions.START_FETCH },
              { type: actions.STOP_FETCH },
              { type: actions.ADD_ALERT, style: 'danger', message: 'Void Transaction Error' },
            ]
          );
        });
      });

    });


    describe('getInvoiceDeliveryNote()', () => {
      describe('Success Scenario', () => {
        afterEach(fetchMock.restore);
        beforeEach((done) => {
          spyOn(deliveryOrderService, 'getItems').and.returnValue(
            Promise.resolve({
              data: [
                { id: 1, store_id: 123 },
                { id: 2, store_id: 123 },
              ],
            })
          );
          store = mockStore({
            invoice: {
              currentStore: { id: 123 },
              order: { id: 456 },
            },
          });
          store
            .dispatch(actions.getInvoiceDeliveryNote())
            .then(() => done());
        });

        it('dispatch correct actions', () => {
          expect(store.getActions()).toEqual(
            [
              { type: actions.START_FETCH },
              { type: actions.STOP_FETCH },
              { type: actions.LOAD_INVOICE_DELIVERY_ORDER_SUCCESS, payload: [
                { id: 1, storeId: 123 },
                { id: 2, storeId: 123 },
              ] },
            ]
          );
        });

        it('call service with correct params', () => {
          expect(deliveryOrderService.getItems).toHaveBeenCalledWith(123, { order_id: 456 }, 1, 9999);
        });
      });

      describe('Failure Scenario', () => {
        afterEach(fetchMock.restore);
        beforeEach((done) => {
          fetchMock.get(GET_DELIVERY_NOTE_URL, { status: 404, body: { message: 'Server Error'} });
          store = mockStore({
            invoice: {
              currentStore: { id: 123 },
              order: { id: 456 },
            },
          });
          store
            .dispatch(actions.getInvoiceDeliveryNote())
            .then(() => done());
        });
        it('dispatch correct actions', () => {
          expect(store.getActions()).toEqual(
            [
              { type: actions.START_FETCH },
              { type: actions.STOP_FETCH },
              { type: actions.ADD_ALERT, style: 'danger', message: 'Server Error' },
            ]
          );
        });
      });
    });

  });
}
