import Big from 'big.js';

import * as constants from '../../../../client/constants';
import * as actions from '../../../../client/actions/invoiceActions';
import reducer from '../../../../client/store/reducers/invoiceReducer';

export default function () {

  describe('Invoice Reducer', () => {
    const initialState = {
      type: null,
      mode: null,
      currentTab: null,
      multiStore: false,
      currentStore: null,
      orderNumber: null,
      totalDp: constants.DECIMAL_POINTS_ZERO_DP,
      totalRoundType: constants.ROUNDING_TYPE_NORMAL,
      listingDp: constants.DECIMAL_POINTS_ZERO_DP,
      listingRoundType: constants.ROUNDING_TYPE_NORMAL,
      quantityDp: constants.QUANTITY_DECIMAL_POINTS_FOUR_DP,
      order: {
        lineItems: [],
        totalItems: Big(0),
        subtotal: Big(0),
        tax: Big(0),
        taxError: Big(0),
        discountTotal: Big(0),
        serviceFee: Big(0),
        tips: Big(0),
        charge: Big(0),
        rounding: Big(0),
        total: Big(0),
        paidTotal: Big(0),
        refundTotal: Big(0),
        amountLefted: Big(0),
        roundingId: undefined,
        saleTransactions: [],
        refundTransactions: [],
      },
      history: [],
      isLoadingHistory: false,
      deliveryOrders: [],
    };

    describe(actions.INIT_INVOICE_STATE, () => {

      it('should initial state', () => {
        const state = initialState;
        const action = {
          type: actions.INIT_INVOICE_STATE,
          data: { type: 'Invoice', mode: 'view', currentTab: 'overview' },
        };
        expect(reducer(state, action)).toEqual(
          Object.assign({}, initialState, action.data)
        );
      });

      it('should ignore existing state', () => {
        const state = { type: 'Invoice', mode: 'new' };
        const action = {
          type: actions.INIT_INVOICE_STATE,
          data: { type: 'Quote' },
        };
        expect(reducer(state, action)).toEqual(
          jasmine.objectContaining({ type: 'Quote', mode: null })
        );
      });

    });

    describe(actions.SET_INVOICE_STATE, () => {
      it('should update state', () => {
        const state = { type: 'Invoice', mode: 'view' };
        const action = {
          type: actions.SET_INVOICE_STATE,
          data: { mode: 'edit', currentTab: 'overview' },
        };
        expect(reducer(state, action)).toEqual(
          { type: 'Invoice', mode: 'edit', currentTab: 'overview' }
        );
      });
    });

    describe(actions.CHANGE_INVOICE_TAB, () => {
      it('should update current tab', () => {
        const state = {};
        const newState1 = reducer(state, { type: actions.CHANGE_INVOICE_TAB, data: 'overview' });
        const newState2 = reducer(newState1, { type: actions.CHANGE_INVOICE_TAB, data: 'log' });
        expect(newState1).toEqual(
          { currentTab: 'overview' }
        );
        expect(newState2).toEqual(
          { currentTab: 'log' }
        );
      });
    });

    describe(actions.ADD_LISTINGS_TO_INVOICE, () => {

      it('should append to line items', () => {
        const state = initialState;
        const newState1 = reducer(state, {
          type: actions.ADD_LISTINGS_TO_INVOICE,
          data: [
            {
              id: 111,
              name: 'Product 1',
              price: 50,
              quantity: 5, // quantity should ignore, since it represent stock quantity
              quantityAllowDecimal: false,
            },
          ],
        });
        const newState2 = reducer(newState1, {
          type: actions.ADD_LISTINGS_TO_INVOICE,
          data: [
            {
              id: 222,
              name: 'Product 2',
              price: 20,
              quantityAllowDecimal: false,
            },
          ],
        });
        expect(newState1).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                {
                  id: null,
                  label: 'Product 1',
                  purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                  purchasableId: 111,
                  unitQuantity: Big(1),
                  quantity: Big(1),
                  unitPrice: Big(50),
                  unitRatio: Big(1),
                  roundingAmount: Big(0),
                  qtyFulfilled: Big(0),
                  qtyFulfilledInDisplayUnit: Big(0),
                  qtyRefunded: Big(0),
                  qtyRefundedInDisplayUnit: Big(0),
                  price: Big(50),
                  total: Big(50),
                  quantityAllowDecimal: false,
                },
              ],
            }),
          })
        );
        expect(newState2).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                {
                  id: null,
                  label: 'Product 1',
                  purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                  purchasableId: 111,
                  unitQuantity: Big(1),
                  quantity: Big(1),
                  unitPrice: Big(50),
                  unitRatio: Big(1),
                  roundingAmount: Big(0),
                  qtyFulfilled: Big(0),
                  qtyFulfilledInDisplayUnit: Big(0),
                  qtyRefunded: Big(0),
                  qtyRefundedInDisplayUnit: Big(0),
                  price: Big(50),
                  total: Big(50),
                  quantityAllowDecimal: false,
                },
                {
                  id: null,
                  label: 'Product 2',
                  purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                  purchasableId: 222,
                  unitQuantity: Big(1),
                  quantity: Big(1),
                  unitPrice: Big(20),
                  unitRatio: Big(1),
                  roundingAmount: Big(0),
                  qtyFulfilled: Big(0),
                  qtyFulfilledInDisplayUnit: Big(0),
                  qtyRefunded: Big(0),
                  qtyRefundedInDisplayUnit: Big(0),
                  price: Big(20),
                  total: Big(20),
                  quantityAllowDecimal: false,
                },
              ],
            }),
          })
        );
      });

      it('should be stateless', () => {
        const state = initialState;
        const newState = reducer(state, { type: actions.ADD_LISTINGS_TO_INVOICE, data: { id: 111, price: 50 } });
        expect(newState).not.toEqual(state);
        expect(newState).not.toEqual(initialState);
        expect(newState).toEqual(jasmine.objectContaining({
          order: jasmine.objectContaining({
            lineItems: [
              jasmine.objectContaining({
                id: null,
                purchasableId: 111,
                price: Big(50),
              })
            ]
          })
        }));
      });

      it('should attach unit groups info', () => {
        const state = Object.assign({}, initialState, {
          unitGroups: {
            2222: {
              id: 2222,
              name: 'weight',
              units: [33333, 44444],
            },
          },
          units: {
            33333: { id: 33333, name: 'g', ratio: 1, isBaseUnit: true },
            44444: { id: 44444, name: 'kg', ratio: 1000, isBaseUnit: false },
          },
        });
        const action = {
          type: actions.ADD_LISTINGS_TO_INVOICE,
          data: [
            { id: 111, price: 50, unitGroupId: 2222, unitId: 44444 },
          ],
        };
        expect(reducer(state, action)).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                jasmine.objectContaining({
                  price: Big(50),
                  unitPrice: Big(50).times(1000),
                  unitRatio: Big(1000),
                  unitGroupId: 2222,
                  baseUnitId: 33333,
                  baseUnit: 'g',
                  unitId: 44444,
                  unit: 'kg',
                })
              ],
            }),
          })
        );
      });

      it('should use base unit by default', () => {
        const state = Object.assign({}, initialState, {
          unitGroups: {
            2222: {
              id: 2222,
              name: 'weight',
              units: [33333, 44444],
            },
          },
          units: {
            33333: { id: 33333, name: 'g', ratio: 1, isBaseUnit: true },
            44444: { id: 44444, name: 'kg', ratio: 1000, isBaseUnit: false },
          },
        });
        const action = {
          type: actions.ADD_LISTINGS_TO_INVOICE,
          data: [
            { id: 111, price: 50, unitGroupId: 2222 },
          ],
        };
        expect(reducer(state, action)).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                jasmine.objectContaining({
                  price: Big(50),
                  unitPrice: Big(50),
                  unitRatio: Big(1),
                  unitGroupId: 2222,
                  baseUnitId: 33333,
                  baseUnit: 'g',
                  unitId: 33333,
                  unit: 'g',
                })
              ],
            }),
          })
        );
      });

      it('should ignore invoice default unit even it is given', () => {
        const state = Object.assign({}, initialState, {
          unitGroups: {
            2222: {
              id: 2222,
              name: 'weight',
              units: [33333, 44444],
            },
          },
          units: {
            33333: { id: 33333, name: 'g', ratio: 1, isBaseUnit: true },
            44444: { id: 44444, name: 'kg', ratio: 1000, isBaseUnit: false },
          },
        });
        const action = {
          type: actions.ADD_LISTINGS_TO_INVOICE,
          data: [
            { id: 111, price: 50, unitGroupId: 2222, defaultOrderUnitId: 44444 },
          ],
        };
        expect(reducer(state, action)).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                jasmine.objectContaining({
                  price: Big(50),
                  unitPrice: Big(50),
                  unitRatio: Big(1),
                  unitGroupId: 2222,
                  defaultOrderUnitId: 44444,
                  baseUnitId: 33333,
                  baseUnit: 'g',
                  unitId: 33333,
                  unit: 'g',
                })
              ],
            }),
          })
        );
      });

      it('should increase the same line item quantity by 1 each time', () => {
        const state = initialState;
        const newState1 = reducer(state, {
          type: actions.ADD_LISTINGS_TO_INVOICE,
          data: { id: 111, price: 50 },
        });
        const newState2 = reducer(newState1, {
          type: actions.ADD_LISTINGS_TO_INVOICE,
          data: { id: 111, price: 50 },
        });
        expect(newState1).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                jasmine.objectContaining({
                  id: null,
                  purchasableId: 111,
                  unitQuantity: Big(1),
                  quantity: Big(1),
                  unitRatio: Big(1),
                  unitPrice: Big(50),
                  price: Big(50),
                  total: Big(50),
                }),
              ],
            }),
          })
        );
        expect(newState2).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                jasmine.objectContaining({
                  id: null,
                  purchasableId: 111,
                  unitQuantity: Big(2),
                  quantity: Big(2),
                  unitRatio: Big(1),
                  unitPrice: Big(50),
                  price: Big(50),
                  total: Big(100),
                }),
              ],
            }),
          })
        );
      });

    });

    describe(actions.REMOVE_LISTINGS_FROM_INVOICE, () => {
      it('should remove relavent line item', () => {
        const state = initialState;
        const newState1 = reducer(state, { type: actions.ADD_LISTINGS_TO_INVOICE, data: { id: 1, price: 50 } });
        const newState2 = reducer(newState1, { type: actions.REMOVE_LISTINGS_FROM_INVOICE, data: [0] });
        expect(newState2).toEqual(initialState);
      });

      it('can remove multiple line item', () => {
        const state = {
          order: {
            lineItems: [
              { id: 1 },
              { id: 2 },
              { id: 3 },
              { id: 4 },
            ]
          }
        };
        const newState = reducer(state, { type: actions.REMOVE_LISTINGS_FROM_INVOICE, data: [1, 3] });
        expect(newState).toEqual({
          order: {
            lineItems: [
              { id: 1 },
              { id: 3 },
            ]
          }
        });
      });
    });

    describe(actions.CHANGE_INVOICE_FIELD, () => {
      it('should chnage ralavent field', () => {
        const state = {
          order: {}
        };
        const newState1 = reducer(state, { type: actions.CHANGE_INVOICE_FIELD, data: { field: 'referenceNumber', value: '1234' } });
        const newState2 = reducer(newState1, { type: actions.CHANGE_INVOICE_FIELD, data: { field: 'phone', value: '87654321' } });
        expect(newState1).toEqual({
          order: { referenceNumber: '1234' }
        });
        expect(newState2).toEqual({
          order: { referenceNumber: '1234', phone: '87654321' }
        });
      });
    });

    describe(actions.CHANGE_INVOICE_FIELDS, () => {
      it('should chnage multiple fields', () => {
        const state = {
          order: {}
        };
        const newState1 = reducer(state, { type: actions.CHANGE_INVOICE_FIELDS, data: { referenceNumber: '1234' } });
        const newState2 = reducer(newState1, { type: actions.CHANGE_INVOICE_FIELDS, data: { phone: '87654321', shipDate: '2016-11-04' } });
        expect(newState1).toEqual({
          order: { referenceNumber: '1234' }
        });
        expect(newState2).toEqual({
          order: { referenceNumber: '1234', phone: '87654321', shipDate: '2016-11-04' }
        });
      });

      it('should chnage billing and shipping info togehter, if both are NULL', () => {
        const state = {
          order: {}
        };
        const newState1 = reducer(state, {
          type: actions.CHANGE_INVOICE_FIELDS,
          data: {
            billToId: 1,
            billingAddressInfo: { id: 1, name: 'billing customer' },
          }
        });
        const newState2 = reducer(newState1, {
          type: actions.CHANGE_INVOICE_FIELDS,
          data: {
            shipToId: 2,
            shippingAddressInfo: { id: 2, name: 'shipping customer' },
          }
        });
        expect(newState1).toEqual({
          order: {
            billToId: 1,
            billingAddressInfo: { id: 1, name: 'billing customer' },
            shipToId: 1,
            shippingAddressInfo: { id: 1, name: 'billing customer' },
            customerId: 1,
            customerName: 'billing customer',
            customerPhone: null,
            customerEmail: null,
          }
        });
        expect(newState2).toEqual({
          order: {
            billToId: 1,
            billingAddressInfo: { id: 1, name: 'billing customer' },
            shipToId: 2,
            shippingAddressInfo: { id: 2, name: 'shipping customer' },
            customerId: 1,
            customerName: 'billing customer',
            customerPhone: null,
            customerEmail: null,
          }
        });
        const state3 = {
          order: {}
        };
        const newState4 = reducer(state3, {
          type: actions.CHANGE_INVOICE_FIELDS,
          data: {
            shipToId: 2,
            shippingAddressInfo: { id: 2, name: 'shipping customer' },
          }
        });
        const newState5 = reducer(newState4, {
          type: actions.CHANGE_INVOICE_FIELDS,
          data: {
            billToId: 1,
            billingAddressInfo: { id: 1, name: 'billing customer' },
          }
        });
        expect(newState4).toEqual({
          order: {
            billToId: 2,
            billingAddressInfo: { id: 2, name: 'shipping customer' },
            shipToId: 2,
            shippingAddressInfo: { id: 2, name: 'shipping customer' },
            customerId: 2,
            customerName: 'shipping customer',
            customerPhone: null,
            customerEmail: null,
          }
        });
        expect(newState5).toEqual({
          order: {
            billToId: 1,
            billingAddressInfo: { id: 1, name: 'billing customer' },
            shipToId: 2,
            shippingAddressInfo: { id: 2, name: 'shipping customer' },
            customerId: 1,
            customerName: 'billing customer',
            customerPhone: null,
            customerEmail: null,
          }
        });
      });
    });

    describe(actions.CHANGE_INVOICE_LISTING_QUANTITY, () => {

      it('should change quantity and recalculate total', () => {
        const state = reducer({
          order: {}
        },
          {
            type: actions.ADD_LISTINGS_TO_INVOICE,
            data: [
              { id: 111, name: 'Product 1', price: 50, quantityAllowDecimal: false }
            ]
          }
        );
        const newState = reducer(state, {
          type: actions.CHANGE_INVOICE_LISTING_QUANTITY,
          data: { index: 0, value: '3' },
        });
        expect(newState).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                {
                  id: null,
                  label: 'Product 1',
                  purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                  purchasableId: 111,
                  unitQuantity: Big(3),
                  quantity: Big(3),
                  unitPrice: Big(50),
                  price: Big(50),
                  unitRatio: Big(1),
                  roundingAmount: Big(0),
                  qtyFulfilled: Big(0),
                  qtyFulfilledInDisplayUnit: Big(0),
                  qtyRefunded: Big(0),
                  qtyRefundedInDisplayUnit: Big(0),
                  total: Big(150),
                  quantityAllowDecimal: false,
                },
              ]
            })
          })
        );
      });

      it('should change correct line item', () => {
        const state = reducer({
          order: {}
        },
          {
            type: actions.ADD_LISTINGS_TO_INVOICE,
            data: [
              { id: 111, name: 'Product 1', price: 10, quantityAllowDecimal: false },
              { id: 222, name: 'Product 2', price: 20, quantityAllowDecimal: false },
            ]
          }
        );
        const newState = reducer(state, {
          type: actions.CHANGE_INVOICE_LISTING_QUANTITY,
          data: { index: 1, value: '3' },
        });
        expect(newState).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                {
                  id: null,
                  label: 'Product 1',
                  purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                  purchasableId: 111,
                  unitQuantity: Big(1),
                  quantity: Big(1),
                  unitPrice: Big(10),
                  price: Big(10),
                  unitRatio: Big(1),
                  roundingAmount: Big(0),
                  qtyFulfilled: Big(0),
                  qtyFulfilledInDisplayUnit: Big(0),
                  qtyRefunded: Big(0),
                  qtyRefundedInDisplayUnit: Big(0),
                  total: Big(10),
                  quantityAllowDecimal: false,
                },
                {
                  id: null,
                  label: 'Product 2',
                  purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                  purchasableId: 222,
                  unitQuantity: Big(3),
                  quantity: Big(3),
                  unitPrice: Big(20),
                  price: Big(20),
                  unitRatio: Big(1),
                  roundingAmount: Big(0),
                  qtyFulfilled: Big(0),
                  qtyFulfilledInDisplayUnit: Big(0),
                  qtyRefunded: Big(0),
                  qtyRefundedInDisplayUnit: Big(0),
                  total: Big(60),
                  quantityAllowDecimal: false,
                },
              ]
            })
          })
        );
      });

      it('should round base on different store settings', () => {
        const state1 = reducer({
          order: {},
          listingDp: constants.DECIMAL_POINTS_TWO_DP,
          listingRoundType: constants.ROUNDING_TYPE_NORMAL,
          quantityDp: constants.QUANTITY_DECIMAL_POINTS_FOUR_DP,
        },
          {
            type: actions.ADD_LISTINGS_TO_INVOICE,
            data: [
              { id: 111, price: 88.88, quantityAllowDecimal: true }
            ]
          }
        );
        const newState1 = reducer(state1, {
          type: actions.CHANGE_INVOICE_LISTING_QUANTITY,
          data: { index: 0, value: '3.33' },
        });
        expect(newState1).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                jasmine.objectContaining({
                  unitPrice: Big('88.88'),
                  price: Big('88.88'),
                  unitQuantity: Big('3.33'),
                  quantity: Big('3.33'),
                  unitRatio: Big('1.0'),
                  total: Big('295.97'),
                  roundingAmount: Big('295.97').minus(Big('88.88').times('3.33')),
                })
              ]
            })
          })
        );
        const state2 = reducer({
          order: {},
          listingDp: constants.DECIMAL_POINTS_ONE_DP,
          listingRoundType: constants.ROUNDING_TYPE_ROUND_UP,
          quantityDp: constants.QUANTITY_DECIMAL_POINTS_ONE_DP,
        },
          {
            type: actions.ADD_LISTINGS_TO_INVOICE,
            data: [
              { id: 111, price: 88.88, quantityAllowDecimal: true }
            ]
          }
        );
        const newState2 = reducer(state2, {
          type: actions.CHANGE_INVOICE_LISTING_QUANTITY,
          data: { index: 0, value: '3.3' },
        });
        expect(newState2).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                jasmine.objectContaining({
                  unitPrice: Big('88.88'),
                  price: Big('88.88'),
                  unitQuantity: Big('3.3'),
                  quantity: Big('3.3'),
                  unitRatio: Big('1.0'),
                  total: Big('293.4'),
                  roundingAmount: Big('293.4').minus(Big('88.88').times('3.3')),
                })
              ]
            })
          })
        );
        const state3 = reducer({
          order: {},
          listingDp: constants.DECIMAL_POINTS_ZERO_DP,
          listingRoundType: constants.ROUNDING_TYPE_ROUND_DOWN,
          quantityDp: constants.QUANTITY_DECIMAL_POINTS_TWO_DP,
        },
          {
            type: actions.ADD_LISTINGS_TO_INVOICE,
            data: [
              { id: 111, price: 88.88, quantityAllowDecimal: true }
            ]
          }
        );
        const newState3 = reducer(state3, {
          type: actions.CHANGE_INVOICE_LISTING_QUANTITY,
          data: { index: 0, value: '3.33' },
        });
        expect(newState3).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                jasmine.objectContaining({
                  unitPrice: Big('88.88'),
                  price: Big('88.88'),
                  unitQuantity: Big('3.33'),
                  quantity: Big('3.33'),
                  unitRatio: Big('1.0'),
                  total: Big('295'),
                  roundingAmount: Big('295').minus(Big('88.88').times('3.33')),
                })
              ]
            })
          })
        );
        const state4 = reducer({
          order: {},
          listingDp: constants.DECIMAL_POINTS_TWO_DP,
          listingRoundType: constants.ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE,
          quantityDp: constants.QUANTITY_DECIMAL_POINTS_TWO_DP,
        },
          {
            type: actions.ADD_LISTINGS_TO_INVOICE,
            data: [
              { id: 111, price: 88.88, quantityAllowDecimal: true }
            ]
          }
        );
        const newState4 = reducer(state4, {
          type: actions.CHANGE_INVOICE_LISTING_QUANTITY,
          data: { index: 0, value: '3.33' },
        });
        expect(newState4).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                jasmine.objectContaining({
                  unitPrice: Big('88.88'),
                  price: Big('88.88'),
                  unitQuantity: Big('3.33'),
                  quantity: Big('3.33'),
                  unitRatio: Big('1.0'),
                  total: Big('295.95'),
                  roundingAmount: Big('295.95').minus(Big('88.88').times('3.33')),
                })
              ]
            })
          })
        );
      });

      it('should works with unit', () => {
        const state = {
          order: {
            lineItems: [
              {
                id: null,
                purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                purchasableId: 111,
                unitQuantity: Big(0),
                quantity: Big(0),
                unitPrice: Big('88.88'),
                price: Big('88.88'),
                unitRatio: Big('453.5924'),
                roundingAmount: Big(0),
                qtyFulfilled: Big(0),
                qtyFulfilledInDisplayUnit: Big(0),
                qtyRefunded: Big(0),
                qtyRefundedInDisplayUnit: Big(0),
                total: Big(0),
                quantityAllowDecimal: true,
              }
            ],
          },
          listingDp: constants.DECIMAL_POINTS_TWO_DP,
          listingRoundType: constants.ROUNDING_TYPE_NORMAL,
          quantityDp: constants.QUANTITY_DECIMAL_POINTS_FOUR_DP,
        };
        const newState = reducer(state, {
          type: actions.CHANGE_INVOICE_LISTING_QUANTITY,
          data: { index: 0, value: '3.33' },
        });
        expect(newState).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                jasmine.objectContaining({
                  unitPrice: Big('40315.29'),
                  price: Big('88.88'),
                  unitQuantity: Big('3.33'),
                  quantity: Big('1510.4627'),
                  unitRatio: Big('453.5924'),
                  total: Big('134249.92'),
                  roundingAmount: Big('134249.92').minus(Big('88.88').times('1510.4627')),
                })
              ]
            })
          })
        );
      });

      it('should not less than fulfilled quantity', () => {
        const state1 = {
          order: {
            lineItems: [
              {
                id: null,
                purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                purchasableId: 111,
                unitQuantity: Big(6),
                quantity: Big(6),
                unitPrice: Big('10'),
                price: Big('10'),
                unitRatio: Big('1'),
                roundingAmount: Big(0),
                qtyFulfilled: Big(5),
                qtyFulfilledInDisplayUnit: Big(5),
                qtyRefunded: Big(0),
                qtyRefundedInDisplayUnit: Big(0),
                total: Big(60),
                quantityAllowDecimal: true,
              }
            ],
          },
          listingDp: constants.DECIMAL_POINTS_TWO_DP,
          listingRoundType: constants.ROUNDING_TYPE_NORMAL,
          quantityDp: constants.QUANTITY_DECIMAL_POINTS_FOUR_DP,
        };
        const state2 = reducer(state1, {
          type: actions.CHANGE_INVOICE_LISTING_QUANTITY,
          data: { index: 0, value: '3' },
        });
        const state3 = reducer(state2, {
          type: actions.CHANGE_INVOICE_LISTING_QUANTITY,
          data: { index: 0, value: '10' },
        });
        expect(state2).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                {
                  id: null,
                  purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                  purchasableId: 111,
                  unitQuantity: Big(5),
                  quantity: Big(5),
                  unitPrice: Big('10'),
                  price: Big('10'),
                  unitRatio: Big('1'),
                  roundingAmount: Big(0),
                  qtyFulfilled: Big(5),
                  qtyFulfilledInDisplayUnit: Big(5),
                  qtyRefunded: Big(0),
                  qtyRefundedInDisplayUnit: Big(0),
                  total: Big(50),
                  quantityAllowDecimal: true,
                },
              ]
            })
          })
        );
        expect(state3).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                {
                  id: null,
                  purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                  purchasableId: 111,
                  unitQuantity: Big(10),
                  quantity: Big(10),
                  unitPrice: Big('10'),
                  price: Big('10'),
                  unitRatio: Big('1'),
                  roundingAmount: Big(0),
                  qtyFulfilled: Big(5),
                  qtyFulfilledInDisplayUnit: Big(5),
                  qtyRefunded: Big(0),
                  qtyRefundedInDisplayUnit: Big(0),
                  total: Big(100),
                  quantityAllowDecimal: true,
                },
              ]
            })
          })
        );
      });

    });

    describe(actions.CHANGE_INVOICE_LISTING_UNIT, () => {
      it('should update unit price, fulfilled qty, refund qty and total in UI', () => {
        const state = {
          order: {
            lineItems: [
              {
                id: null,
                purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                purchasableId: 111,
                unitQuantity: Big('333.3'),
                quantity: Big('333.3'),
                unitPrice: Big('88.88'),
                price: Big('88.88'),
                unitRatio: Big('1.0'),
                qtyFulfilled: Big('300.0'),
                qtyFulfilledInDisplayUnit: Big('300.0'),
                qtyRefunded: Big('200.0'),
                qtyRefundedInDisplayUnit: Big('200.0'),
                total: Big('293.30'),
                roundingAmount: Big('-0.004'),
                quantityAllowDecimal: true,
                unitGroupId: 2222,
                baseUnitId: 33333,
                baseUnit: 'g',
                unitId: 33333,
                unit: 'g',
              }
            ],
          },
          listingDp: constants.DECIMAL_POINTS_TWO_DP,
          listingRoundType: constants.ROUNDING_TYPE_NORMAL,
          quantityDp: constants.QUANTITY_DECIMAL_POINTS_FOUR_DP,
          unitGroups: {
            2222: {
              id: 2222,
              name: 'weight',
              units: [33333, 44444, 55555],
            },
          },
          units: {
            33333: { id: 33333, name: 'g', ratio: Big('1.0'), isBaseUnit: true },
            44444: { id: 44444, name: 'kg', ratio: Big('1000.0'), isBaseUnit: false },
            55555: { id: 55555, name: 'lbs', ratio: Big('453.5924'), isBaseUnit: false },
          },
        };
        const newState1 = reducer(state, {
          type: actions.CHANGE_INVOICE_LISTING_UNIT,
          data: { index: 0, value: 44444 },
        });
        const newState2 = reducer(newState1, {
          type: actions.CHANGE_INVOICE_LISTING_UNIT,
          data: { index: 0, value: 55555 },
        });
        expect(newState1).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                jasmine.objectContaining({
                  unitPrice: Big('88880.0'),
                  price: Big('88.88'),
                  unitQuantity: Big('333.3'),
                  quantity: Big('333300.0'),
                  unitRatio: Big('1000.0'),
                  qtyFulfilled: Big('300.0'),
                  qtyFulfilledInDisplayUnit: Big('0.3'),
                  qtyRefunded: Big('200.0'),
                  qtyRefundedInDisplayUnit: Big('0.2'),
                  total: Big('29623704'),
                  roundingAmount: Big('29623704').minus(Big('88.88').times('333300.0')),
                  baseUnitId: 33333,
                  baseUnit: 'g',
                  unitId: 44444,
                  unit: 'kg',
                })
              ]
            })
          })
        );
        expect(newState2).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                jasmine.objectContaining({
                  unitPrice: Big('40315.29'),
                  price: Big('88.88'),
                  unitQuantity: Big('333.3'),
                  quantity: Big('151182.3469'),
                  unitRatio: Big('453.5924'),
                  qtyFulfilled: Big('300.0'),
                  qtyFulfilledInDisplayUnit: Big('0.6614'),
                  qtyRefunded: Big('200.0'),
                  qtyRefundedInDisplayUnit: Big('0.4409'),
                  total: Big('13437086.99'),
                  roundingAmount: Big('13437086.99').minus(Big('88.88').times('151182.3469')),
                  baseUnitId: 33333,
                  baseUnit: 'g',
                  unitId: 55555,
                  unit: 'lbs',
                })
              ]
            })
          })
        );
      });
    });

    describe(actions.CHANGE_INVOICE_LISTING_UNIT_PRICE, () => {

      it('should change unit price and recalculate total', () => {
        const state1 = reducer({ order: {} },
          {
            type: actions.ADD_LISTINGS_TO_INVOICE,
            data: [
              { id: 111, name: 'Product 1', price: 50, quantityAllowDecimal: false }
            ]
          }
        );
        const state2 = reducer(state1, {
          type: actions.CHANGE_INVOICE_LISTING_QUANTITY,
          data: { index: 0, value: '3' },
        });
        const state3 = reducer(state2, {
          type: actions.CHANGE_INVOICE_LISTING_UNIT_PRICE,
          data: { index: 0, value: '3' },
        });

        expect(state3).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                {
                  id: null,
                  label: 'Product 1',
                  purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                  purchasableId: 111,
                  unitQuantity: Big(3),
                  quantity: Big(3),
                  unitPrice: Big(3),
                  price: Big(3),
                  unitRatio: Big(1),
                  roundingAmount: Big(0),
                  qtyFulfilled: Big(0),
                  qtyFulfilledInDisplayUnit: Big(0),
                  qtyRefunded: Big(0),
                  qtyRefundedInDisplayUnit: Big(0),
                  total: Big(9),
                  quantityAllowDecimal: false,
                },
              ],
            })
          })
        );
      });

      it('should change correct line item', () => {
        const state1 = reducer({ order: {} },
          {
            type: actions.ADD_LISTINGS_TO_INVOICE,
            data: [
              { id: 111, name: 'Product 1', price: 10, quantityAllowDecimal: false },
              { id: 222, name: 'Product 2', price: 20, quantityAllowDecimal: false },
            ]
          }
        );
        const state2 = reducer(state1, {
          type: actions.CHANGE_INVOICE_LISTING_QUANTITY,
          data: { index: 0, value: '3' },
        });
        const state3 = reducer(state2, {
          type: actions.CHANGE_INVOICE_LISTING_QUANTITY,
          data: { index: 1, value: '4' },
        });
        const state4 = reducer(state3, {
          type: actions.CHANGE_INVOICE_LISTING_UNIT_PRICE,
          data: { index: 1, value: '5' },
        });

        expect(state4).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                {
                  id: null,
                  label: 'Product 1',
                  purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                  purchasableId: 111,
                  unitQuantity: Big(3),
                  quantity: Big(3),
                  unitPrice: Big(10),
                  price: Big(10),
                  unitRatio: Big(1),
                  roundingAmount: Big(0),
                  qtyFulfilled: Big(0),
                  qtyFulfilledInDisplayUnit: Big(0),
                  qtyRefunded: Big(0),
                  qtyRefundedInDisplayUnit: Big(0),
                  total: Big(30),
                  quantityAllowDecimal: false,
                },
                {
                  id: null,
                  label: 'Product 2',
                  purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                  purchasableId: 222,
                  unitQuantity: Big(4),
                  quantity: Big(4),
                  unitPrice: Big(5),
                  price: Big(5),
                  unitRatio: Big(1),
                  roundingAmount: Big(0),
                  qtyFulfilled: Big(0),
                  qtyFulfilledInDisplayUnit: Big(0),
                  qtyRefunded: Big(0),
                  qtyRefundedInDisplayUnit: Big(0),
                  total: Big(20),
                  quantityAllowDecimal: false,
                },
              ],
            })
          })
        );
      });

      it('should round base price to 2 DP', () => {
        const state1 = {
          order: {
            lineItems: [
              {
                id: null,
                purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                purchasableId: 111,
                unitQuantity: Big('1'),
                quantity: Big('453.5934'),
                unitPrice: Big('0'),
                price: Big('0'),
                unitRatio: Big('453.5934'),
                qtyFulfilled: Big('0'),
                qtyFulfilledInDisplayUnit: Big('0'),
                qtyRefunded: Big('0'),
                qtyRefundedInDisplayUnit: Big('0'),
                total: Big('0'),
                roundingAmount: Big('0'),
                quantityAllowDecimal: true,
                unitGroupId: 2222,
                baseUnitId: 33333,
                baseUnit: 'g',
                unitId: 44444,
                unit: 'lbs',
              }
            ],
          },
          listingDp: constants.DECIMAL_POINTS_TWO_DP,
          listingRoundType: constants.ROUNDING_TYPE_NORMAL,
          quantityDp: constants.QUANTITY_DECIMAL_POINTS_FOUR_DP,
        };
        const state2 = reducer(state1, {
          type: actions.CHANGE_INVOICE_LISTING_UNIT_PRICE,
          data: { index: 0, value: '300' },
        });

        expect(state2).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                {
                  id: null,
                  purchasableType: constants.PURCHASABLE_TYPE_LISTING,
                  purchasableId: 111,
                  unitQuantity: Big('1'),
                  quantity: Big('453.5934'),
                  unitPrice: Big('299.37'),
                  price: Big('0.66'),
                  unitRatio: Big('453.5934'),
                  qtyFulfilled: Big('0'),
                  qtyFulfilledInDisplayUnit: Big('0'),
                  qtyRefunded: Big('0'),
                  qtyRefundedInDisplayUnit: Big('0'),
                  total: Big('299.37'),
                  roundingAmount: Big('-0.001644'),
                  quantityAllowDecimal: true,
                  unitGroupId: 2222,
                  baseUnitId: 33333,
                  baseUnit: 'g',
                  unitId: 44444,
                  unit: 'lbs',
                },
              ],
            })
          })
        );
      });

    });

    describe(actions.CALCULATE_INVOICE_ORDER_TOTAL, () => {

      it('should calculate order total and rounding', () => {
        let state = reducer(
          Object.assign({}, initialState, {
            listingDp: constants.DECIMAL_POINTS_TWO_DP,
            listingRoundType: constants.ROUNDING_TYPE_NORMAL,
            totalDp: constants.DECIMAL_POINTS_TWO_DP,
            totalRoundType: constants.ROUNDING_TYPE_NORMAL,
          }),
          {
            type: actions.ADD_LISTINGS_TO_INVOICE,
            data: [
              { id: 111, price: 33.33, quantityAllowDecimal: true },
              { id: 222, price: 44.44, quantityAllowDecimal: true },
            ],
          }
        );
        state = reducer(state, { type: actions.CHANGE_INVOICE_LISTING_QUANTITY, data: { index: 0, value: 0 }});
        state = reducer(state, { type: actions.CHANGE_INVOICE_LISTING_QUANTITY, data: { index: 1, value: 0 }});
        state.order.tax = Big('10.0');
        state.order.initialIncludedInPriceTaxError = Big('0');
        state.order.paidTotal = Big('9.55'); // already deduct refund total
        state.order.refundTotal = Big('1.01');
        const newState1 = reducer(state, { type: actions.CALCULATE_INVOICE_ORDER_TOTAL });
        const newState2 = reducer(newState1, { type: actions.CHANGE_INVOICE_LISTING_QUANTITY, data: { index: 0, value: 3.3 } });
        const newState3 = reducer(newState2, { type: actions.CALCULATE_INVOICE_ORDER_TOTAL });
        const newState4 = reducer(newState3, { type: actions.CHANGE_INVOICE_LISTING_QUANTITY, data: { index: 1, value: 7.77 } });
        const newState5 = reducer(newState4, { type: actions.CALCULATE_INVOICE_ORDER_TOTAL });
        expect(newState1).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              subtotal: Big('0.0'),
              total: Big('10.0'),
              amountLefted: Big('0.45'),
            })
          })
        );
        expect(newState3).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              subtotal: Big('109.99'),
              total: Big('119.99'),
              amountLefted: Big('110.44'),
            })
          })
        );
        expect(newState5).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              subtotal: Big('455.29'),
              total: Big('465.29'),
              amountLefted: Big('455.74'),
            })
          })
        );
      });

      it('should handle rounding amount', () => {
        let state = reducer(
          Object.assign({}, initialState, {
            listingDp: constants.DECIMAL_POINTS_TWO_DP,
            listingRoundType: constants.ROUNDING_TYPE_NORMAL,
            totalDp: constants.DECIMAL_POINTS_ONE_DP,
            totalRoundType: constants.ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE,
          }),
          {
            type: actions.ADD_LISTINGS_TO_INVOICE,
            data: [
              { id: 111, price: 33.33, quantityAllowDecimal: true },
              { id: 222, price: 44.44, quantityAllowDecimal: true },
            ],
          }
        );
        state = reducer(state, { type: actions.CHANGE_INVOICE_LISTING_QUANTITY, data: { index: 0, value: 0 }});
        state = reducer(state, { type: actions.CHANGE_INVOICE_LISTING_QUANTITY, data: { index: 1, value: 0 }});
        state.order.tax = Big('10.0');
        state.order.initialIncludedInPriceTaxError = Big('0');
        state.order.paidTotal = Big('9.55');
        const newState1 = reducer(state, { type: actions.CALCULATE_INVOICE_ORDER_TOTAL });
        const newState2 = reducer(newState1, { type: actions.CHANGE_INVOICE_LISTING_QUANTITY, data: { index: 0, value: 3.3 } });
        const newState3 = reducer(newState2, { type: actions.CALCULATE_INVOICE_ORDER_TOTAL });
        const newState4 = reducer(newState3, { type: actions.CHANGE_INVOICE_LISTING_QUANTITY, data: { index: 1, value: 7.77 } });
        const newState5 = reducer(newState4, { type: actions.CALCULATE_INVOICE_ORDER_TOTAL });
        expect(newState1).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              subtotal: Big('0.0'),
              total: Big('10.0'),
              rounding: Big('0'),
              amountLefted: Big('0.45'),
            })
          })
        );
        expect(newState3).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              subtotal: Big('109.99'),
              total: Big('120.0'),
              rounding: Big('0.01'),
              amountLefted: Big('110.45'),
            })
          })
        );
        expect(newState5).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              subtotal: Big('455.29'),
              total: Big('465.5'),
              rounding: Big('0.21'),
              amountLefted: Big('455.95'),
            })
          })
        );
      });

    });

    describe(actions.LOAD_INVOICE_TO_FORM, () => {
      it('should fill info and initialize Big number', () => {
        const state = Object.assign({}, initialState, {
          currentStore: {
            timezone: 'America/New_York',
          },
          quantityAllowDecimal: constants.QUANTITY_DECIMAL_POINTS_FOUR_DP,
          totalDp: constants.DECIMAL_POINTS_ONE_DP,
          totalRoundType: constants.ROUNDING_TYPE_ROUND_TO_NEAREST_FIVE,
          listingDp: constants.DECIMAL_POINTS_TWO_DP,
          listingRoundType: constants.ROUNDING_TYPE_ROUND_DOWN,
        });
        const newState = reducer(state, {
          type: actions.LOAD_INVOICE_TO_FORM,
          data: {
            effectiveCreatedAt: '2016-11-21T00:00:00-05:00',
            listingLineItems: [
              {
                price: '3.33',
                quantity: '4.44',
                unitQuantity: '4.44',
                roundingAmount: '0.0',
                total: '14.78',
                qtyFulfilled: '0.0',
                qtyFulfilledInDisplayUnit: '0.0',
                qtyRefunded: '0.0',
                qtyRefundedInDisplayUnit: '0.0',
                quantityAllowDecimal: true,
              },
            ],
            roundingLineItem: { id: 123 },
            subtotal: '14.78',
            initialTax: '1.23',
            initialIncludedInPriceTaxError: '0.00',
            discountTotal: '2.34',
            initialServiceFee: '3.45',
            initialRounding: '-0.12',
            initialTips: '4.56',
            initialTotal: '21.56',
            paidTotal: '11.11',
            refundTotal: '1.01',
            amountLefted: '10.45',
            saleTransactions: [
              {
                amount: '1.00',
                changeAmount: '2.00',
                actualPaymentAmount: '3.00',
                amountLefted: '4.00',
              }
            ],
            refundTransactions: [
              {
                amount: '1.00',
                changeAmount: '2.00',
                actualPaymentAmount: '3.00',
                amountLefted: '4.00',
              }
            ],
          }
        });

        expect(newState).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              effectiveCreatedAt: '2016-11-21',
              lineItems: [
                jasmine.objectContaining({
                  price: Big('3.33'),
                  quantity: Big('4.44'),
                  unitQuantity: Big('4.44'),
                  roundingAmount: Big('0.0'),
                  total: Big('14.78'),
                  qtyFulfilled: Big('0.0'),
                  qtyFulfilledInDisplayUnit: Big('0.0'),
                  qtyRefunded: Big('0.0'),
                  qtyRefundedInDisplayUnit: Big('0.0'),
                  quantityAllowDecimal: true,
                }),
              ],
              subtotal: Big('14.78'),
              tax: Big('1.23'),
              discountTotal: Big('2.34'),
              serviceFee: Big('3.45'),
              tips: Big('4.56'),
              rounding: Big('-0.12'),
              roundingId: 123,
              total: Big('21.56'),
              paidTotal: Big('11.11'),
              refundTotal: Big('1.01'),
              amountLefted: Big('10.45'),
              saleTransactions: [
                {
                  amount: Big('1.00'),
                  changeAmount: Big('2.00'),
                  actualPaymentAmount: Big('3.00'),
                  amountLefted: Big('4.00'),
                }
              ],
              refundTransactions: [
                {
                  amount: Big('1.00'),
                  changeAmount: Big('2.00'),
                  actualPaymentAmount: Big('3.00'),
                  amountLefted: Big('4.00'),
                }
              ],
            })
          })
        );
      });
    });

    describe(actions.PATCH_INVOICE_LISTING_MISSING_INFO, () => {
      it('should update line item info', () => {
        const state = {
          order: {
            lineItems: [
              { id: 1, purchasableId: 111 },
              { id: 111, purchasableId: 222 },
              { id: null, purchasableId: 111 },
            ]
          }
        };
        const newState = reducer(state, {
          type: actions.PATCH_INVOICE_LISTING_MISSING_INFO,
          data: [
            {
              id: 111,
              description: 'Item 1 description',
              upc: 'UPC0001',
              ean13: 'EAN13',
              listingBarcode: 'barcode',
              unitGroupId: 333,
              defaultOrderUnitId: 444,
              quantityAllowDecimal: true,
            }
          ]
        });
        expect(newState).toEqual({
          order: {
            lineItems: [
              {
                id: 1,
                purchasableId: 111,
                description: 'Item 1 description',
                upc: 'UPC0001',
                ean13: 'EAN13',
                listingBarcode: 'barcode',
                unitGroupId: 333,
                defaultOrderUnitId: 444,
                quantityAllowDecimal: true,
              },
              {
                id: 111,
                purchasableId: 222,
              },
              {
                id: null,
                purchasableId: 111,
                description: 'Item 1 description',
                upc: 'UPC0001',
                ean13: 'EAN13',
                listingBarcode: 'barcode',
                unitGroupId: 333,
                defaultOrderUnitId: 444,
                quantityAllowDecimal: true,
              },
            ]
          }
        });
      });
    });

    describe(actions.PATCH_INVOICE_LISTING_UNIT_GROUP, () => {
      it('should patch unit group and unit info accumulately', () => {
        const state = reducer(initialState, {
          type: actions.ADD_LISTINGS_TO_INVOICE,
          data: [
            { id: 111, price: 50, unitGroupId: 2222, unitId: 44444 },
          ],
        });
        const newState1 = reducer(state, {
          type: actions.PATCH_INVOICE_LISTING_UNIT_GROUP,
          data: {
            unitGroups: {
              2222: {
                id: 2222,
                name: 'weight',
                units: [33333, 44444],
              },
            },
            units: {
              33333: { id: 33333, name: 'g', ratio: 1, isBaseUnit: true },
              44444: { id: 44444, name: 'kg', ratio: 1000, isBaseUnit: false },
            },
          }
        });
        const newState2 = reducer(newState1, {
          type: actions.PATCH_INVOICE_LISTING_UNIT_GROUP,
          data: {
            unitGroups: {
              5555: {
                id: 5555,
                name: 'lenght',
                units: [66666, 77777],
              },
            },
            units: {
              66666: { id: 66666, name: 'mm', ratio: 1, isBaseUnit: true },
              77777: { id: 77777, name: 'cm', ratio: 10, isBaseUnit: false },
            },
          }
        });

        expect(newState1).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                jasmine.objectContaining({
                  id: null,
                  purchasableId: 111,
                  price: Big(50),
                  unitGroupId: 2222,
                  unitId: 44444,
                  unit: 'kg',
                  unitRatio: Big('1000'),
                })
              ],
            }),
            unitGroups: {
              2222: {
                id: 2222,
                name: 'weight',
                units: [33333, 44444],
              },
            },
            units: {
              33333: { id: 33333, name: 'g', ratio: 1, isBaseUnit: true },
              44444: { id: 44444, name: 'kg', ratio: 1000, isBaseUnit: false },
            },
          })
        );
        expect(newState2).toEqual(
          jasmine.objectContaining({
            order: jasmine.objectContaining({
              lineItems: [
                jasmine.objectContaining({
                  id: null,
                  purchasableId: 111,
                  price: Big(50),
                  unitGroupId: 2222,
                  unitId: 44444,
                  unit: 'kg',
                  unitRatio: Big('1000'),
                })
              ],
            }),
            unitGroups: {
              2222: {
                id: 2222,
                name: 'weight',
                units: [33333, 44444],
              },
              5555: {
                id: 5555,
                name: 'lenght',
                units: [66666, 77777],
              },
            },
            units: {
              33333: { id: 33333, name: 'g', ratio: 1, isBaseUnit: true },
              44444: { id: 44444, name: 'kg', ratio: 1000, isBaseUnit: false },
              66666: { id: 66666, name: 'mm', ratio: 1, isBaseUnit: true },
              77777: { id: 77777, name: 'cm', ratio: 10, isBaseUnit: false },
            },
          })
        );
      });
    });

    describe(actions.LOAD_INVOICE_HISTORY_REQUEST, () => {
      it('should update loading history flag', () => {
        const state1 = Object.assign({}, initialState);
        const state2 = reducer(state1, { type: actions.LOAD_INVOICE_HISTORY_REQUEST });
        expect(state2).toEqual(
          jasmine.objectContaining({
            isLoadingHistory: true,
          })
        );
      });
    });


    describe(actions.LOAD_INVOICE_HISTORY_SUCCESS, () => {
      it('should update history records', () => {
        const state1 = Object.assign({}, initialState);
        const state2 = reducer(state1, { type: actions.LOAD_INVOICE_HISTORY_REQUEST });
        const state3 = reducer(state1, {
          type: actions.LOAD_INVOICE_HISTORY_SUCCESS,
          data: [
            { id: 1 },
            { id: 2 },
          ],
        });
        expect(state3).toEqual(
          jasmine.objectContaining({
            isLoadingHistory: false,
            history: [
              { id: 1 },
              { id: 2 },
            ],
          })
        );
      });
    });

    describe(actions.LOAD_INVOICE_HISTORY_FAILURE, () => {
      it('should update loading history flag', () => {
        const state1 = Object.assign({}, initialState);
        const state2 = reducer(state1, { type: actions.LOAD_INVOICE_HISTORY_FAILURE });
        expect(state2).toEqual(
          jasmine.objectContaining({
            isLoadingHistory: false,
          })
        );
      });
    });

    describe(actions.LOAD_INVOICE_DELIVERY_ORDER_SUCCESS, () => {
      it('should update delivery order records', () => {
        const state1 = Object.assign({}, initialState);
        const state2 = reducer(state1, {
          type: actions.LOAD_INVOICE_DELIVERY_ORDER_SUCCESS,
          payload: {
            deliveryOrders: [
              { id: 1 },
              { id: 2 },
            ],
          },
        });
        expect(state2).toEqual(
          jasmine.objectContaining({
            deliveryOrders: [
              { id: 1 },
              { id: 2 },
            ],
          })
        );
      });
    });

  });

}
