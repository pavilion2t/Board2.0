import chai from 'chai';
import chaiSubset from 'chai-subset';

import { actionTypes } from '../../../../client/actions/formActions/productionOrderItem';
import reducer from '../../../../client/store/reducers/formsReducer/productionOrderItem';

chai.use(chaiSubset);
const { expect } = chai;

export default function () {
  describe('ProductionOrderItem Reducer', () => {
    const initialState = {
      editMode: false,
      isCreating: false,

      isLoading: false,
      isSubmitting: false,

      isLoadingBom: false,
      isLoadingUom: false,
      isLoadingListing: false,

      errors: {
        loadBOM: [],
        loadUOM: [],
        loadListing: []
      },

      initialValues: {},
      initialProductionOrderItems: [],
      billOfMaterials: {},
      uomGroups: {},
      storeId: null,
      id: null,
      status: '',
      orderType: 1,
      productionOrderItems: [],
    };

    it('should return initial state if not match', () => {
      const state = initialState;
      const action = { type: 'blabla' };
      expect(reducer(state, action)).to.eql(initialState);
    });

    describe('actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_REQUEST', () => {

      it('should mutate the isLoading flag', () => {
        const state = initialState;
        const action = {
          type: actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_REQUEST,
          id: 1,
          storeId: 4497
        };
        expect(reducer(state, action)).to.containSubset({
          isLoading: false
        });
      });

      it('should store the storeId', () => {
        const state = initialState;
        const action = {
          type: actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_REQUEST,
          id: 1,
          storeId: 4497
        };
        expect(reducer(state, action)).to.containSubset({
          storeId: 4497
        });
      });

      it('should mutate the isCreating flag', () => {
        const state = initialState;
        const actionCreate = {
          type: actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_REQUEST,
          id: undefined,
          storeId: 4497
        };
        const actionView = {
          type: actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_REQUEST,
          id: 12,
          storeId: 4497
        };
        expect(reducer(state, actionCreate)).to.containSubset({
          isCreating: true
        });
        expect(reducer(state, actionView)).to.containSubset({
          isCreating: false
        });
      });
    });

    describe('actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_SUCCESS', () => {
      it('should mutate the isLoading flag', () => {
        const state = { isLoading: true };
        const action = {
          type: actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_SUCCESS,
          data: {},
        };
        expect(reducer(state, action)).to.containSubset({
          isLoading: false
        });
      });
      it('should transform flatten array to nested tree', () => {
        const action = {
          type: actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_SUCCESS,
          data: {
            "productionOrderItems": [{
              "productionOrderItemMaterials": [{
                "uuid": "uu1",
                "parentUuid": null
              }, {
                "uuid": "uu2",
                "parentUuid": null
              }, {
                "uuid": "uu1-1",
                "parentUuid": "uu1"
              }, {
                "uuid": "uu1-2",
                "parentUuid": "uu1"
              }, {
                "uuid": "uu1-1-1",
                "parentUuid": "uu1-1"
              }]
            }]
          }
        };

        expect(reducer({}, action)).to.containSubset({
          productionOrderItems: [{
            "productionOrderItemMaterials": [{
              "uuid": "uu1",
              "parentUuid": null,
              "children": [{
                "uuid": "uu1-1",
                "parentUuid": "uu1",
                children: [{
                  "uuid": "uu1-1-1",
                  "parentUuid": "uu1-1",
                }]
              }, {
                "uuid": "uu1-2",
                "parentUuid": "uu1"
              }]
            }, {
              "uuid": "uu2",
              "parentUuid": null
            }]
          }]
        });
      });
      it('should patch the production item materails if missing', () => {
        const action = {
          type: actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_SUCCESS,
          data: {
            "productionOrderItems": [{
              "productionOrderItemMaterials": [{
                "uuid": "uu1",
                "parentUuid": null
              }, {
                "uuid": "uu2",
                "parentUuid": null
              }, {
                "uuid": "uu1-1",
                "parentUuid": "uu1"
              }, {
                "uuid": "uu1-2",
                "parentUuid": "uu1"
              }]
            }]
          }
        };

        let nextState = reducer({}, action);
        
        expect(nextState.productionOrderItems).to.containSubset([{
          "productionOrderItemMaterials": [{
            "uuid": "uu1",
            "parentUuid": null,
            "children": [{
              "uuid": "uu1-1",
              "parentUuid": "uu1",
              "unitRatio": 1,
              "bomRatio": 0,
              "quantity": 0,
              "quantityInDisplayUnit": "0.0000",
              "qtyFulfilled": "0.0000",
              "qtyFulfilledInDisplayUnit": "0.0000"
            }, {
              "uuid": "uu1-2",
              "parentUuid": "uu1",
              "unitRatio": 1,
              "bomRatio": 0,
              "quantity": 0,
              "quantityInDisplayUnit": "0.0000",
              "qtyFulfilled": "0.0000",
              "qtyFulfilledInDisplayUnit": "0.0000"
            }],
            "unitRatio": 1,
            "bomRatio": 0,
            "quantity": 0,
            "quantityInDisplayUnit": "0.0000",
            "qtyFulfilled": "0.0000",
            "qtyFulfilledInDisplayUnit": "0.0000"
          }, {
            "uuid": "uu2",
            "parentUuid": null,
            "unitRatio": 1,
            "bomRatio": 0,
            "quantity": 0,
            "quantityInDisplayUnit": "0.0000",
            "qtyFulfilled": "0.0000",
            "qtyFulfilledInDisplayUnit": "0.0000"
          }],
          "quantity": 0,
          "ratio": 1,
          "qtyFulfilledInDisplayUnit": 0,
          "qtyFulfilled": 0
        }]);
      });
      it('should patch the production item materails if the order is processing', () => {
        const action = {
          type: actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_SUCCESS,
          data: {
            "productionOrderItems": [{
              "uuid": "0c9911a3-fc81-43ad-b834-abacf59c584f",
              "quantity": "100",
              "qtyFulfilled": "50",
              "quantityInDisplayUnit": "20",
              "qtyFulfilledInDisplayUnit": "10",
              "productionOrderItemMaterials": [{
                "uuid": "uu1",
                "parentUuid": null,
                "quantity": "10",
                "quantityInDisplayUnit": "5"
              }, {
                "uuid": "uu2",
                "parentUuid": null,
                "quantity": "20",
                "quantityInDisplayUnit": "6"
              }, {
                "uuid": "uu1-1",
                "parentUuid": "uu1",
                "quantity": "30",
                "quantityInDisplayUnit": "7"
              }, {
                "uuid": "uu1-2",
                "parentUuid": "uu1",
                "quantity": "40",
                "quantityInDisplayUnit": "8"
              }]
            }]
          }
        };

        let nextState = reducer({}, action);
        expect(nextState.productionOrderItems).to.containSubset([{
          "uuid": "0c9911a3-fc81-43ad-b834-abacf59c584f",
          "quantity": "100",
          "qtyFulfilled": "50",
          "quantityInDisplayUnit": "20",
          "qtyFulfilledInDisplayUnit": "10",
          "productionOrderItemMaterials": [{
            "uuid": "uu1",
            "parentUuid": null,
            "quantity": "10",
            "quantityInDisplayUnit": "5",
            "children": [{
              "uuid": "uu1-1",
              "parentUuid": "uu1",
              "quantity": "30",
              "quantityInDisplayUnit": "7",
              "qtyFulfilled": "15.0000",
              "qtyFulfilledInDisplayUnit": "3.5000"
            }, {
              "uuid": "uu1-2",
              "parentUuid": "uu1",
              "quantity": "40",
              "quantityInDisplayUnit": "8",
              "qtyFulfilled": "20.0000",
              "qtyFulfilledInDisplayUnit": "4.0000"
            }],
            "qtyFulfilled": "5.0000",
            "qtyFulfilledInDisplayUnit": "2.5000"
          }, {
            "uuid": "uu2",
            "parentUuid": null,
            "quantity": "20",
            "quantityInDisplayUnit": "6",
            "qtyFulfilled": "10.0000",
            "qtyFulfilledInDisplayUnit": "3.0000"
          }]
        }]);
      });
      it('should patch the production item materails if the order is processed', () => {
        const action = {
          type: actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_SUCCESS,
          data: {
            "productionOrderItems": [{
              "quantity": "100",
              "qtyFulfilled": "100",
              "quantityInDisplayUnit": "20",
              "qtyFulfilledInDisplayUnit": "20",
              "productionOrderItemMaterials": [{
                "uuid": "uu1",
                "parentUuid": null,
                "quantity": "10",
                "quantityInDisplayUnit": "5"
              }, {
                "uuid": "uu2",
                "parentUuid": null,
                "quantity": "20",
                "quantityInDisplayUnit": "6"
              }, {
                "uuid": "uu1-1",
                "parentUuid": "uu1",
                "quantity": "30",
                "quantityInDisplayUnit": "7"
              }, {
                "uuid": "uu1-2",
                "parentUuid": "uu1",
                "quantity": "40",
                "quantityInDisplayUnit": "8"
              }]
            }]
          }
        };

        let nextState = reducer({}, action);
        expect(nextState.productionOrderItems).to.containSubset([{
          "quantity": "100",
          "qtyFulfilled": "100",
          "quantityInDisplayUnit": "20",
          "qtyFulfilledInDisplayUnit": "20",
          "productionOrderItemMaterials": [{
            "uuid": "uu1",
            "parentUuid": null,
            "quantity": "10",
            "quantityInDisplayUnit": "5",
            "children": [{
              "uuid": "uu1-1",
              "parentUuid": "uu1",
              "quantity": "30",
              "quantityInDisplayUnit": "7",
              "unitRatio": 1,
              "bomRatio": 0,
              "qtyFulfilled": "30.0000",
              "qtyFulfilledInDisplayUnit": "7.0000"
            }, {
              "uuid": "uu1-2",
              "parentUuid": "uu1",
              "quantity": "40",
              "quantityInDisplayUnit": "8",
              "unitRatio": 1,
              "bomRatio": 0,
              "qtyFulfilled": "40.0000",
              "qtyFulfilledInDisplayUnit": "8.0000"
            }],
            "unitRatio": 1,
            "bomRatio": 0,
            "qtyFulfilled": "10.0000",
            "qtyFulfilledInDisplayUnit": "5.0000"
          }, {
            "uuid": "uu2",
            "parentUuid": null,
            "quantity": "20",
            "quantityInDisplayUnit": "6",
            "unitRatio": 1,
            "bomRatio": 0,
            "qtyFulfilled": "20.0000",
            "qtyFulfilledInDisplayUnit": "6.0000"
          }]
        }]);

      });
    });

    describe('actionTypes.LOAD_ALL_UOM_FOR_PRODUCTION_ORDER_SUCCESS', () => {
      it('should store the received data', () => {
        const state = {
          productionOrderItems: []
        };

        const action = {
          type: actionTypes.LOAD_ALL_UOM_FOR_PRODUCTION_ORDER_SUCCESS,
          data: [{
            "id": 1,
            "units": [{
              "id": 11,
              "unitGroupId": 1,
              "name": "a",
              "isBaseUnit": true,
              "ratio": "1.0",
            }, {
              "id": 12,
              "unitGroupId": 1,
              "name": "aa",
              "isBaseUnit": false,
              "ratio": "1000.0",
            }]
          }, {
            "id": 2,
            "units": [{
              "id": 21,
              "unitGroupId": 2,
              "name": "b",
              "isBaseUnit": true,
              "ratio": "1.0",
            }, {
              "id": 22,
              "unitGroupId": 2,
              "name": "bb",
              "isBaseUnit": false,
              "ratio": "2.0",
            }]
          }]
        };

        let nextState = reducer(state, action);
        expect(nextState).to.containSubset({
          uomGroups: {
            "1": {
              "id": 1,
              "units": [{ "id": 11, "unitGroupId": 1, "name": "a", "isBaseUnit": true, "ratio": "1.0" }, {
                "id": 12,
                "unitGroupId": 1,
                "name": "aa",
                "isBaseUnit": false,
                "ratio": "1000.0"
              }]
            },
            "2": {
              "id": 2,
              "units": [{ "id": 21, "unitGroupId": 2, "name": "b", "isBaseUnit": true, "ratio": "1.0" }, {
                "id": 22,
                "unitGroupId": 2,
                "name": "bb",
                "isBaseUnit": false,
                "ratio": "2.0"
              }]
            }
          }
        });
      });

      it('should patch the unit group info of production order items', () => {
        const state = {
          productionOrderItems: [{
            unitGroupId: 1,
            displayUnitId: 12
          }, {
            unitGroupId: 2,
            displayUnitId: 22
          }]
        };

        const action = {
          type: actionTypes.LOAD_ALL_UOM_FOR_PRODUCTION_ORDER_SUCCESS,
          data: [{
            "id": 1,
            "units": [{
              "id": 11,
              "unitGroupId": 1,
              "name": "a",
              "isBaseUnit": true,
              "ratio": "1.0",
            }, {
              "id": 12,
              "unitGroupId": 1,
              "name": "aa",
              "isBaseUnit": false,
              "ratio": "1000.0",
            }]
          }, {
            "id": 2,
            "units": [{
              "id": 21,
              "unitGroupId": 2,
              "name": "b",
              "isBaseUnit": true,
              "ratio": "1.0",
            }, {
              "id": 22,
              "unitGroupId": 2,
              "name": "bb",
              "isBaseUnit": false,
              "ratio": "2.0",
            }]
          }]
        };

        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([{
          "unitGroupId": 1,
          "displayUnitId": 12,
          "units": [{ "id": 11, "unitGroupId": 1, "name": "a", "isBaseUnit": true, "ratio": "1.0" }, {
            "id": 12,
            "unitGroupId": 1,
            "name": "aa",
            "isBaseUnit": false,
            "ratio": "1000.0"
          }],
          "unitMap": {
            "11": { "id": 11, "unitGroupId": 1, "name": "a", "isBaseUnit": true, "ratio": "1.0" },
            "12": { "id": 12, "unitGroupId": 1, "name": "aa", "isBaseUnit": false, "ratio": "1000.0" }
          },
          "ratio": "1000.0"
        }, {
          "unitGroupId": 2,
          "displayUnitId": 22,
          "units": [{ "id": 21, "unitGroupId": 2, "name": "b", "isBaseUnit": true, "ratio": "1.0" }, {
            "id": 22,
            "unitGroupId": 2,
            "name": "bb",
            "isBaseUnit": false,
            "ratio": "2.0"
          }],
          "unitMap": {
            "21": { "id": 21, "unitGroupId": 2, "name": "b", "isBaseUnit": true, "ratio": "1.0" },
            "22": { "id": 22, "unitGroupId": 2, "name": "bb", "isBaseUnit": false, "ratio": "2.0" }
          },
          "ratio": "2.0"
        }]);
      });

      it('should set the ratio of production order items with empty unitGroupId to be 1', () => {
        const state = {
          productionOrderItems: [{
            id: 1
          }, {
            id: 2,
            unitGroupId: 2,
            displayUnitId: 22
          }]
        };

        const action = {
          type: actionTypes.LOAD_ALL_UOM_FOR_PRODUCTION_ORDER_SUCCESS,
          data: [{
            "id": 1,
            "units": [{
              "id": 11,
              "unitGroupId": 1,
              "name": "a",
              "isBaseUnit": true,
              "ratio": "1.0",
            }, {
              "id": 12,
              "unitGroupId": 1,
              "name": "aa",
              "isBaseUnit": false,
              "ratio": "1000.0",
            }]
          }, {
            "id": 2,
            "units": [{
              "id": 21,
              "unitGroupId": 2,
              "name": "b",
              "isBaseUnit": true,
              "ratio": "1.0",
            }, {
              "id": 22,
              "unitGroupId": 2,
              "name": "bb",
              "isBaseUnit": false,
              "ratio": "2.0",
            }]
          }]
        };

        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([{
          id: 1,
          ratio: 1
        }, {
          id: 2,
          "unitGroupId": 2,
          "displayUnitId": 22,
          "units": [{ "id": 21, "unitGroupId": 2, "name": "b", "isBaseUnit": true, "ratio": "1.0" }, {
            "id": 22,
            "unitGroupId": 2,
            "name": "bb",
            "isBaseUnit": false,
            "ratio": "2.0"
          }],
          "unitMap": {
            "21": { "id": 21, "unitGroupId": 2, "name": "b", "isBaseUnit": true, "ratio": "1.0" },
            "22": { "id": 22, "unitGroupId": 2, "name": "bb", "isBaseUnit": false, "ratio": "2.0" }
          },
          "ratio": "2.0"
        }]);
      });
    });

    describe('actionTypes.LOAD_LISTINGS_FOR_PRODUCTION_ORDER_SUCCESS', () => {
      it('should store the received data', () => {
        const action = {
          type: actionTypes.LOAD_LISTINGS_FOR_PRODUCTION_ORDER_SUCCESS,
          data: [
            {
              "id": 1,
              "qtyReservedForProductionOrder": "1.0",
              "quantity": 11,
              "ean13": null,
              "unitGroupId": 111,
              "listingBarcode": "1111",
              "trackQuantity": 0,
              "imageUrl": "https://s3.amazonaws.com/bindo-images-dev/product_graphics/391166/medium/1.png?1476693008"
            },
            {
              "id": 2,
              "qtyReservedForProductionOrder": "2.0",
              "quantity": 22,
              "ean13": null,
              "unitGroupId": 222,
              "listingBarcode": "2222",
              "trackQuantity": 0,
              "imageUrl": "https://s3.amazonaws.com/bindo-images-dev/product_graphics/391166/medium/1.png?1476693008"
            }
          ]
        };
        let nextState = reducer({}, action);
        expect(nextState).to.containSubset({
          listings: {
            "1": {
              "id": 1,
              "qtyReservedForProductionOrder": "1.0",
              "quantity": 11,
              "ean13": null,
              "unitGroupId": 111,
              "listingBarcode": "1111",
              "trackQuantity": 0,
              "imageUrl": "https://s3.amazonaws.com/bindo-images-dev/product_graphics/391166/medium/1.png?1476693008"
            },
            "2": {
              "id": 2,
              "qtyReservedForProductionOrder": "2.0",
              "quantity": 22,
              "ean13": null,
              "unitGroupId": 222,
              "listingBarcode": "2222",
              "trackQuantity": 0,
              "imageUrl": "https://s3.amazonaws.com/bindo-images-dev/product_graphics/391166/medium/1.png?1476693008"
            }
          }
        });
      });

      it('should patch the necessary info for every production order item and materials', () => {
        const state = {
          productionOrderItems: [{
            listingId: 1,
            "productionOrderItemMaterials": [{
              listingId: 2,
              "children": [{
                listingId: 3
              }, {
                listingId: 4
              }]
            }, {
              listingId: 5
            }]
          }]
        };
        const action = {
          type: actionTypes.LOAD_LISTINGS_FOR_PRODUCTION_ORDER_SUCCESS,
          data: [
            {
              "id": 1,
              "qtyReservedForProductionOrder": "1.0",
              name: 'name1',
              "quantity": 11,
              "ean13": null,
              "unitGroupId": 111,
              "listingBarcode": "1111",
              "trackQuantity": 0,
              "imageUrl": "https://s3.amazonaws.com/bindo-images-dev/product_graphics/391166/medium/1.png?1476693008"
            },
            {
              "id": 2,
              "qtyReservedForProductionOrder": "2.0",
              name: 'name2',
              "quantity": 22,
              "ean13": null,
              "unitGroupId": 222,
              "listingBarcode": "2222",
              "trackQuantity": 0,
              "imageUrl": "https://s3.amazonaws.com/bindo-images-dev/product_graphics/391166/medium/1.png?1476693008"
            },
            {
              "id": 3,
              "qtyReservedForProductionOrder": "2.0",
              name: 'name3',
              "quantity": 22,
              "ean13": null,
              "unitGroupId": 222,
              "listingBarcode": "2222",
              "trackQuantity": 0,
              "imageUrl": "https://s3.amazonaws.com/bindo-images-dev/product_graphics/391166/medium/1.png?1476693008"
            },
            {
              "id": 4,
              "qtyReservedForProductionOrder": "2.0",
              name: 'name4',
              "quantity": 22,
              "ean13": null,
              "unitGroupId": 222,
              "listingBarcode": "2222",
              "trackQuantity": 0,
              "imageUrl": "https://s3.amazonaws.com/bindo-images-dev/product_graphics/391166/medium/1.png?1476693008"
            }, {
              "id": 5,
              "qtyReservedForProductionOrder": "2.0",
              name: 'name5',
              "quantity": 22,
              "ean13": null,
              "unitGroupId": 222,
              "listingBarcode": "2222",
              "trackQuantity": 0,
              "imageUrl": "https://s3.amazonaws.com/bindo-images-dev/product_graphics/391166/medium/1.png?1476693008"
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState).to.containSubset({
          productionOrderItems: [{
            "listingId": 1,
            "productionOrderItemMaterials": [{
              "listingId": 2,
              "children": [{
                "listingId": 3,
                nameOfListing: 'name3',
                "ean13": null,
                "listingBarcode": "2222",
                "listingQuantity": "22.0000",
                "listingQtyReservedForProductionOrder": "2.0000"
              }, {
                "listingId": 4,
                nameOfListing: 'name4',
                "ean13": null,
                "listingBarcode": "2222",
                "listingQuantity": "22.0000",
                "listingQtyReservedForProductionOrder": "2.0000"
              }],
              "ean13": null,
              nameOfListing: 'name2',
              "listingBarcode": "2222",
              "listingQuantity": "22.0000",
              "listingQtyReservedForProductionOrder": "2.0000"
            }, {
              "listingId": 5,
              nameOfListing: 'name5',
              "ean13": null,
              "listingBarcode": "2222",
              "listingQuantity": "22.0000",
              "listingQtyReservedForProductionOrder": "2.0000"
            }],
            "ean13": null,
            "listingBarcode": "1111",
            "imageUrl": "https://s3.amazonaws.com/bindo-images-dev/product_graphics/391166/medium/1.png?1476693008",
            "listingQuantity": "11.0000",
            "listingQtyReservedForProductionOrder": "1.0000",
            nameOfListing: 'name1'
          }]
        });
      });
    });

    describe('actionTypes.LOAD_BOM_FOR_PRODUCTION_ORDER_ITEM_SUCCESS', () => {
      it('should store the raw values', () => {
        const state = {
          billOfMaterials: {}
        };
        const action = {
          type: actionTypes.LOAD_BOM_FOR_PRODUCTION_ORDER_ITEM_SUCCESS,
          data: {
            1: [{
              "id": 11,
              "listingId": 1
            }],
            2: [{
              "id": 22,
              "listingId": 2
            }]
          }
        };
        let nextState = reducer(state, action);
        expect(nextState.billOfMaterials).to.containSubset({
          1: [{
            id: 11
          }],
          2: [{
            id: 22
          }]
        });
      });
      it('should turn billOfMaterials to children', () => {
        const state = {
          billOfMaterials: {}
        };
        const action = {
          type: actionTypes.LOAD_BOM_FOR_PRODUCTION_ORDER_ITEM_SUCCESS,
          data: {
            1: [{
              "id": 11,
              "listingId": 1,
              billOfMaterials: [
                {
                  id: 111,
                  billOfMaterials: [
                    {
                      id: 1111
                    }
                  ]
                },
                {
                  id: 112
                }
              ]
            }]
          }
        };
        let nextState = reducer(state, action);
        expect(nextState.billOfMaterials).to.containSubset({
          1: [{
            "id": 11,
            "listingId": 1,
            children: [
              {
                id: 111,
                children: [
                  {
                    id: 1111
                  }
                ]
              },
              {
                id: 112
              }
            ]
          }]
        });
      });
    });

    describe('actionTypes.ENABLE_PRODUCTION_ORDER_EDITMODE', () => {
      it('should set editMode to be true', () => {
        const state = {};

        const action = {
          type: actionTypes.ENABLE_PRODUCTION_ORDER_EDITMODE
        };
        expect(reducer(state, action)).to.containSubset({ editMode: true });
      });
    });

    describe('actionTypes.CHANGE_PRODUCTION_ORDER_TYPE', () => {
      it('should change the order type the order', () => {
        const state = {
          orderType: 0
        };
        const action = {
          type: actionTypes.CHANGE_PRODUCTION_ORDER_TYPE,
          value: 1
        };
        expect(reducer(state, action)).to.containSubset({ orderType: 1 });
      });
    });

    describe('actionTypes.CHANGE_PRODUCTION_ORDER_PLANNED_QUANTITY', () => {
      it('should change quantityInDisplayUnit of production order item', ()=> {
        const state = {
          productionOrderItems: [
            {
              quantityInDisplayUnit: 12
            }
          ]
        };
        const action = {
          type: actionTypes.CHANGE_PRODUCTION_ORDER_PLANNED_QUANTITY,
          value: 123.45,
          index: 0
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            quantityInDisplayUnit: 123.45
          }
        ]);
      });

      it('should limit value to 4dp', ()=> {
        const state = {
          productionOrderItems: [
            {
              quantityInDisplayUnit: 12
            }
          ]
        };
        const action = {
          type: actionTypes.CHANGE_PRODUCTION_ORDER_PLANNED_QUANTITY,
          value: 123.456789,
          index: 0
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            quantityInDisplayUnit: 123.4567
          }
        ]);
      });

      it('should re-calculate the planned quantity of all layers of materials', () => {
        const state = {
          productionOrderItems: [
            {
              quantityInDisplayUnit: 12,
              ratio: 10,
              productionOrderItemMaterials: [
                {
                  unitRatio: 2,
                  bomRatio: 2,
                  children: [
                    {
                      unitRatio: 3,
                      bomRatio: 3,
                      children: [
                        {
                          unitRatio: 4,
                          bomRatio: 4,
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        };
        const action = {
          type: actionTypes.CHANGE_PRODUCTION_ORDER_PLANNED_QUANTITY,
          value: 10,
          index: 0
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([{
          "quantityInDisplayUnit": 10,
          "ratio": 10,
          "productionOrderItemMaterials": [{
            "children": [{
              "children": [{
                "quantity": "57600.0000",
                "quantityInDisplayUnit": "14400.0000"
              }],
              "quantity": "3600.0000",
              "quantityInDisplayUnit": "1200.0000"
            }],
            "quantity": "400.0000",
            "quantityInDisplayUnit": "200.0000"
          }],
          "quantity": "100.0000"
        }]);
      });
    });

    describe('actionTypes.CHANGE_PRODUCTION_ORDER_PROCESSED_QUANTITIY', () => {
      it('should change qtyFulfilledInDisplayUnit of production order item', ()=> {
        const state = {
          productionOrderItems: [
            {
              qtyFulfilledInDisplayUnit: 12
            }
          ]
        };
        const action = {
          type: actionTypes.CHANGE_PRODUCTION_ORDER_PROCESSED_QUANTITIY,
          value: 123.45,
          index: 0
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            qtyFulfilledInDisplayUnit: 123.45
          }
        ]);
      });

      it('should limit value to 4dp', ()=> {
        const state = {
          productionOrderItems: [
            {
              qtyFulfilledInDisplayUnit: 12
            }
          ]
        };
        const action = {
          type: actionTypes.CHANGE_PRODUCTION_ORDER_PROCESSED_QUANTITIY,
          value: 123.4567891234,
          index: 0
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            qtyFulfilledInDisplayUnit: 123.4567
          }
        ]);
      });

      it('should re-calculate the processed quantity of all layers of materials', () => {
        const state = {
          productionOrderItems: [
            {
              quantityInDisplayUnit: 12,
              qtyFulfilledInDisplayUnit: 2,
              ratio: 10,
              productionOrderItemMaterials: [
                {
                  unitRatio: 2,
                  bomRatio: 2,
                  children: [
                    {
                      unitRatio: 3,
                      bomRatio: 3,
                      children: [
                        {
                          unitRatio: 4,
                          bomRatio: 4,
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        };
        const action = {
          type: actionTypes.CHANGE_PRODUCTION_ORDER_PROCESSED_QUANTITIY,
          value: 6,
          index: 0
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([{
          "quantityInDisplayUnit": 12,
          "qtyFulfilledInDisplayUnit": 6,
          "ratio": 10,
          "productionOrderItemMaterials": [{
            "unitRatio": 2,
            "bomRatio": 2,
            "children": [{
              "children": [{
                "quantity": "69120.0000",
                "quantityInDisplayUnit": "17280.0000",
                "qtyFulfilled": "34560.0000",
                "qtyFulfilledInDisplayUnit": "138240.0000"
              }],
              "quantity": "4320.0000",
              "quantityInDisplayUnit": "1440.0000",
              "qtyFulfilled": "2160.0000",
              "qtyFulfilledInDisplayUnit": "6480.0000"
            }],
            "quantity": "480.0000",
            "quantityInDisplayUnit": "240.0000",
            "qtyFulfilled": "240.0000",
            "qtyFulfilledInDisplayUnit": "480.0000"
          }],
          "quantity": "120.0000",
          "qtyFulfilled": "60.0000"
        }]);
      });
    });

    describe('actionTypes.CHANGE_PRODUCTION_ORDER_UOM', () => {
      it('should change the uom of production order item', () => {
        const state = {
          productionOrderItems: [
            {
              quantityInDisplayUnit: 12
            }
          ]
        };
        const action = {
          type: actionTypes.CHANGE_PRODUCTION_ORDER_UOM,
          value: {
            id: 1,
            name: 'testName',
            ratio: '1000'
          },
          index: 0
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            displayUnitId: 1,
            displayUnit: 'testName',
            ratio: '1000'
          }
        ]);
      });

      it('should re-calculate the quantity of all layers of materials', () => {
        const state = {
          productionOrderItems: [
            {
              quantityInDisplayUnit: 12,
              ratio: 10,
              productionOrderItemMaterials: [
                {
                  unitRatio: 2,
                  bomRatio: 2,
                  children: [
                    {
                      unitRatio: 3,
                      bomRatio: 3,
                      children: [
                        {
                          unitRatio: 4,
                          bomRatio: 4,
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        };
        const action = {
          type: actionTypes.CHANGE_PRODUCTION_ORDER_UOM,
          value: {
            id: 1,
            name: 'testName',
            ratio: '5'
          },
          index: 0
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            displayUnitId: 1,
            displayUnit: 'testName',
            ratio: '5',
            quantityInDisplayUnit: 12,
            "productionOrderItemMaterials": [{
              "children": [{
                "children": [{
                  "quantity": "34560.0000",
                  "quantityInDisplayUnit": "8640.0000"
                }],
                "quantity": "2160.0000",
                "quantityInDisplayUnit": "720.0000"
              }],
              "quantity": "240.0000",
              "quantityInDisplayUnit": "120.0000"
            }],
            "quantity": "60.0000"
          }
        ]);
      });
    });

    describe('actionTypes.REMOVE_PRODUCTION_ORDER_LISTING_ITEM', () => {
      it('should remove target item', () => {
        const state = {
          productionOrderItems: [
            {
              name: '1'
            },
            {
              name: '2'
            },
            {
              name: '3'
            }
          ]
        };
        const action = {
          type: actionTypes.REMOVE_PRODUCTION_ORDER_LISTING_ITEM,
          index: 1
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            name: '1'
          },
          {
            name: '3'
          }
        ]);
      });
    });

    describe('actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM', () => {
      it('should not change the existed items', () => {
        const state = {
          productionOrderItems: [
            {
              name: 'should not change'
            }
          ],
          uomGroups: {},
          billOfMaterials: {}
        };
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 1,
              "name": 'listingName1'
            },
            {
              "id": 2,
              "name": 'listingName2'
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([
          { "name": "should not change" },
          {
            "name": "listingName1"
          },
          {
            "name": "listingName2"
          }
        ]);
      });
      it('should patch the unit info of listing', () => {
        const state = {
          productionOrderItems: [],
          uomGroups: {
            1: {
              "id": 1,
              "units": [{
                "id": 11,
                "unitGroupId": 1,
                "name": "g",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 12,
                "unitGroupId": 1,
                "name": "kg",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            },
            2: {
              "id": 2,
              "units": [{
                "id": 21,
                "unitGroupId": 2,
                "name": "mL",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 22,
                "unitGroupId": 2,
                "name": "L",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            }
          },
          billOfMaterials: {}
        };
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 1,
              "unitGroupId": 1
            },
            {
              "id": 2,
              "unitGroupId": 2
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            "units": [{ "id": 11, "unitGroupId": 1, "name": "g", "isBaseUnit": true, "ratio": "1.0" }, {
              "id": 12,
              "unitGroupId": 1,
              "name": "kg",
              "isBaseUnit": false,
              "ratio": "1000.0"
            }],
            "unitMap": {
              "11": { "id": 11, "unitGroupId": 1, "name": "g", "isBaseUnit": true, "ratio": "1.0" },
              "12": { "id": 12, "unitGroupId": 1, "name": "kg", "isBaseUnit": false, "ratio": "1000.0" }
            },
            "baseUnitId": 11,
            "baseUnit": "g",
            "displayUnitId": 11,
            "displayUnit": "g",
            "ratio": 1
          },
          {
            "units": [{ "id": 21, "unitGroupId": 2, "name": "mL", "isBaseUnit": true, "ratio": "1.0" }, {
              "id": 22,
              "unitGroupId": 2,
              "name": "L",
              "isBaseUnit": false,
              "ratio": "1000.0"
            }],
            "unitMap": {
              "21": { "id": 21, "unitGroupId": 2, "name": "mL", "isBaseUnit": true, "ratio": "1.0" },
              "22": { "id": 22, "unitGroupId": 2, "name": "L", "isBaseUnit": false, "ratio": "1000.0" }
            },
            "baseUnitId": 21,
            "baseUnit": "mL",
            "displayUnitId": 21,
            "displayUnit": "mL",
            "ratio": 1
          }]);
      });
      it('should use listing name', () => {
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 1,
              "name": 'listingName1'
            },
            {
              "id": 2,
              "name": 'listingName2'
            }
          ]
        };
        let nextState = reducer(initialState, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            "name": "listingName1"
          }, {
            "name": "listingName2"
          }]);
      });
      it('should use listing imageUrl', () => {
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 1,
              "imageUrl": "https://s3.amazonaws.com/bindo-images-dev/product_graphics/391166/medium/1.png?1476693008",
            },
            {
              "id": 2,
              "imageUrl": "https://s3.amazonaws.com/bindo-images-dev/product_graphics/391166/medium/1.png?1476693008",
            }
          ]
        };
        let nextState = reducer(initialState, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            "imageUrl": "https://s3.amazonaws.com/bindo-images-dev/product_graphics/391166/medium/1.png?1476693008",
          },
          {
            "imageUrl": "https://s3.amazonaws.com/bindo-images-dev/product_graphics/391166/medium/1.png?1476693008",
          }]);
      });
      it('should use listing id', () => {
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 1
            },
            {
              "id": 2
            }
          ]
        };
        let nextState = reducer(initialState, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            listingId: 1
          },
          {
            listingId: 2
          }]);
      });
      it('should use listing ean13', () => {
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 1,
              ean13: 'abc'
            }
          ]
        };
        let nextState = reducer(initialState, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            ean13: 'abc'
          }]);
      });
      it('should use listing trackQuantity', () => {
        const state = {
          productionOrderItems: [],
          uomGroups: {},
          billOfMaterials: {}
        };
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 1,
              trackQuantity: 0
            },
            {
              "id": 2,
              trackQuantity: 1
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            trackQuantity: 0
          },
          {
            trackQuantity: 1
          }
        ]);
      });
      it('should use listing listingBarcode', () => {
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 1,
              listingBarcode: 'abc'
            },
            {
              "id": 2,
              listingBarcode: 'def'
            }
          ]
        };
        let nextState = reducer(initialState, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            listingBarcode: 'abc'
          },
          {
            listingBarcode: 'def'
          }
        ]);
      });
      it('should use listing quantity', () => {
        const state = {
          productionOrderItems: [],
          uomGroups: {},
          billOfMaterials: {}
        };
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 1,
              quantity: 1
            },
            {
              "id": 2,
              quantity: "2.0"
            },
            {
              "id": 2
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            listingQuantity: "1.0000"
          },
          {
            listingQuantity: "2.0000"
          },
          {
            listingQuantity: "0.0000"
          }
        ]);
      });
      it('should use listing qtyReservedForProductionOrder', () => {
        const state = {
          productionOrderItems: [],
          uomGroups: {},
          billOfMaterials: {}
        };
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 1,
              qtyReservedForProductionOrder: 1
            },
            {
              "id": 2,
              qtyReservedForProductionOrder: "2.0"
            },
            {
              "id": 2
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset([
          {
            listingQtyReservedForProductionOrder: "1.0000"
          },
          {
            listingQtyReservedForProductionOrder: "2.0000"
          },
          {
            listingQtyReservedForProductionOrder: "0.0000"
          }
        ]);
      });
      it('should process non-trackQuantity case of listing', () => {
        const state = {
          productionOrderItems: [],
          uomGroups: {
            1: {
              "id": 1,
              "units": [{
                "id": 11,
                "unitGroupId": 1,
                "name": "g",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 12,
                "unitGroupId": 1,
                "name": "kg",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            },
            2: {
              "id": 2,
              "units": [{
                "id": 21,
                "unitGroupId": 2,
                "name": "mL",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 22,
                "unitGroupId": 2,
                "name": "L",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            }
          },
          billOfMaterials: {
            7771: [{
              "id": 1
            }],
            7772: [{
              "id": 2
            }]
          }
        };
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 7771,
              trackQuantity: 0
            },
            {
              "id": 7772,
              trackQuantity: 1
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset(
          [
            {
              "productionOrderItemMaterials": [
                {
                  "id": 1
                }
              ]
            },
            {
              "productionOrderItemMaterials": []
            }]);
      });
      it('should process material bomRatio', () => {
        const state = {
          productionOrderItems: [],
          uomGroups: {
            1: {
              "id": 1,
              "units": [{
                "id": 11,
                "unitGroupId": 1,
                "name": "g",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 12,
                "unitGroupId": 1,
                "name": "kg",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            },
            2: {
              "id": 2,
              "units": [{
                "id": 21,
                "unitGroupId": 2,
                "name": "mL",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 22,
                "unitGroupId": 2,
                "name": "L",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            }
          },
          billOfMaterials: {
            7771: [{
              "id": 1,
              quantityInDisplayUnit: 1.1,
              trackQuantity: 0,
              children: [{
                id: 11,
                quantityInDisplayUnit: "1.2",
                trackQuantity: 0,
                children: [
                  {
                    id: 111,
                    trackQuantity: 1
                  }
                ]
              }]
            }]
          }
        };
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 7771,
              trackQuantity: 0
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset(
          [
            {
              "productionOrderItemMaterials": [
                {
                  "id": 1,
                  bomRatio: 1.1,
                  children: [
                    {
                      id: 11,
                      bomRatio: "1.2",
                      children: [{
                        id: 111,
                        bomRatio: 0
                      }]
                    }]
                }
              ]
            }
          ]);
      });
      it('should process material unit info', () => {
        const state = {
          productionOrderItems: [],
          uomGroups: {
            1: {
              "id": 1,
              "units": [{
                "id": 11,
                "unitGroupId": 1,
                "name": "g",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 12,
                "unitGroupId": 1,
                "name": "kg",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            },
            2: {
              "id": 2,
              "units": [{
                "id": 21,
                "unitGroupId": 2,
                "name": "mL",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 22,
                "unitGroupId": 2,
                "name": "L",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            }
          },
          billOfMaterials: {
            7771: [{
              "id": 1,
              quantityInDisplayUnit: 1.1,
              displayUnitId: 11,
              trackQuantity: 0,
              children: [{
                id: 11,
                quantityInDisplayUnit: "1.2",
                displayUnitId: 12,
                trackQuantity: 1
              }]
            }]
          }
        };
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 7771,
              unitGroupId: 1,
              trackQuantity: 0
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset(
          [
            {
              productionOrderItemMaterials: [
                {
                  id: 1,
                  unitGroupId: 1,
                  ratio: "1.0",
                  baseUnit: "g",
                  baseUnitId: 11,
                  children: [
                    {
                      id: 11,
                      unitGroupId: 1,
                      ratio: "1000.0",
                      baseUnit: "g",
                      baseUnitId: 11
                    }]
                }
              ]
            }
          ]);
      });
      it('should process material unitRatio', () => {
        const state = {
          productionOrderItems: [],
          uomGroups: {
            1: {
              "id": 1,
              "units": [{
                "id": 11,
                "unitGroupId": 1,
                "name": "g",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 12,
                "unitGroupId": 1,
                "name": "kg",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            },
            2: {
              "id": 2,
              "units": [{
                "id": 21,
                "unitGroupId": 2,
                "name": "mL",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 22,
                "unitGroupId": 2,
                "name": "L",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            }
          },
          billOfMaterials: {
            7771: [{
              "id": 1,
              quantityInDisplayUnit: 1.1,
              displayUnitId: 11,
              trackQuantity: 0,
              children: [{
                id: 11,
                quantityInDisplayUnit: "1.2",
                displayUnitId: 12,
                trackQuantity: 1
              }]
            }]
          }
        };
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 7771,
              unitGroupId: 1,
              trackQuantity: 0
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset(
          [
            {
              productionOrderItemMaterials: [
                {
                  unitRatio: "1.0",
                  children: [
                    {
                      unitRatio: "1000.0"
                    }]
                }
              ]
            }
          ]);
      });
      it('should process material displayUnit', () => {
        const state = {
          productionOrderItems: [],
          uomGroups: {
            1: {
              "id": 1,
              "units": [{
                "id": 11,
                "unitGroupId": 1,
                "name": "g",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 12,
                "unitGroupId": 1,
                "name": "kg",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            },
            2: {
              "id": 2,
              "units": [{
                "id": 21,
                "unitGroupId": 2,
                "name": "mL",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 22,
                "unitGroupId": 2,
                "name": "L",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            }
          },
          billOfMaterials: {
            7771: [{
              "id": 1,
              displayUnitName: 'abc',
              trackQuantity: 0,
              children: [{
                id: 11,
                displayUnitName: 'def',
                trackQuantity: 0,
                children: [
                  {
                    id: 111,
                    displayUnitName: 'gh',
                    trackQuantity: 1
                  }
                ]
              }]
            }]
          }
        };
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 7771,
              trackQuantity: 0
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset(
          [
            {
              "productionOrderItemMaterials": [
                {
                  displayUnit: 'abc',
                  trackQuantity: 0,
                  children: [
                    {
                      displayUnit: 'def',
                      trackQuantity: 0,
                      children: [{
                        displayUnit: 'gh'
                      }]
                    }]
                }
              ]
            }
          ]);
      });
      it('should process material name', () => {
        const state = {
          productionOrderItems: [],
          uomGroups: {
            1: {
              "id": 1,
              "units": [{
                "id": 11,
                "unitGroupId": 1,
                "name": "g",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 12,
                "unitGroupId": 1,
                "name": "kg",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            },
            2: {
              "id": 2,
              "units": [{
                "id": 21,
                "unitGroupId": 2,
                "name": "mL",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 22,
                "unitGroupId": 2,
                "name": "L",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            }
          },
          billOfMaterials: {
            7771: [{
              "id": 1,
              nameOfMaterial: 'abc',
              trackQuantity: 0,
              children: [{
                id: 11,
                nameOfMaterial: 'def',
                trackQuantity: 0,
                children: [
                  {
                    id: 111,
                    nameOfMaterial: 'gh',
                    trackQuantity: 1
                  }
                ]
              }]
            }]
          }
        };
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 7771,
              trackQuantity: 0
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset(
          [
            {
              "productionOrderItemMaterials": [
                {
                  nameOfMaterial: 'abc',
                  trackQuantity: 0,
                  children: [
                    {
                      nameOfMaterial: 'def',
                      trackQuantity: 0,
                      children: [{
                        nameOfMaterial: 'gh',
                        trackQuantity: 1
                      }]
                    }]
                }
              ]
            }
          ]);
      });
      it('should process material ean13', () => {
        const state = {
          productionOrderItems: [],
          uomGroups: {
            1: {
              "id": 1,
              "units": [{
                "id": 11,
                "unitGroupId": 1,
                "name": "g",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 12,
                "unitGroupId": 1,
                "name": "kg",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            },
            2: {
              "id": 2,
              "units": [{
                "id": 21,
                "unitGroupId": 2,
                "name": "mL",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 22,
                "unitGroupId": 2,
                "name": "L",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            }
          },
          billOfMaterials: {
            7771: [{
              "id": 1,
              materialEan13: 'abc',
              trackQuantity: 0,
              children: [{
                id: 11,
                materialEan13: 'def',
                trackQuantity: 0,
                children: [
                  {
                    id: 111,
                    materialEan13: 'gh',
                    trackQuantity: 1
                  }
                ]
              }]
            }]
          }
        };
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 7771,
              trackQuantity: 0
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset(
          [
            {
              "productionOrderItemMaterials": [
                {
                  ean13: 'abc',
                  children: [
                    {
                      ean13: 'def',
                      children: [{
                        ean13: 'gh'
                      }]
                    }]
                }
              ]
            }
          ]);
      });
      it('should process material listingBarcode', () => {
        const state = {
          productionOrderItems: [],
          uomGroups: {
            1: {
              "id": 1,
              "units": [{
                "id": 11,
                "unitGroupId": 1,
                "name": "g",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 12,
                "unitGroupId": 1,
                "name": "kg",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            },
            2: {
              "id": 2,
              "units": [{
                "id": 21,
                "unitGroupId": 2,
                "name": "mL",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 22,
                "unitGroupId": 2,
                "name": "L",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            }
          },
          billOfMaterials: {
            7771: [{
              "id": 1,
              materialListingBarcode: 'abc',
              trackQuantity: 0,
              children: [{
                id: 11,
                materialListingBarcode: 'def',
                trackQuantity: 0,
                children: [
                  {
                    id: 111,
                    materialListingBarcode: 'gh',
                    trackQuantity: 1
                  }
                ]
              }]
            }]
          }
        };
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 7771,
              trackQuantity: 0
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset(
          [
            {
              "productionOrderItemMaterials": [
                {
                  listingBarcode: 'abc',
                  children: [
                    {
                      listingBarcode: 'def',
                      children: [{
                        listingBarcode: 'gh'
                      }]
                    }]
                }
              ]
            }
          ]);
      });
      it('should process material bomType', () => {
        const state = {
          productionOrderItems: [],
          uomGroups: {
            1: {
              "id": 1,
              "units": [{
                "id": 11,
                "unitGroupId": 1,
                "name": "g",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 12,
                "unitGroupId": 1,
                "name": "kg",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            },
            2: {
              "id": 2,
              "units": [{
                "id": 21,
                "unitGroupId": 2,
                "name": "mL",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 22,
                "unitGroupId": 2,
                "name": "L",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            }
          },
          billOfMaterials: {
            7771: [{
              "id": 1,
              materialBomType: '0',
              trackQuantity: 0,
              children: [{
                id: 11,
                materialBomType: '1',
                trackQuantity: 0,
                children: [
                  {
                    id: 111,
                    materialBomType: '0,1',
                    trackQuantity: 1
                  }
                ]
              }]
            }]
          }
        };
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 7771,
              trackQuantity: 0
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset(
          [
            {
              "productionOrderItemMaterials": [
                {
                  bomType: '0',
                  children: [
                    {
                      bomType: '1',
                      children: [{
                        bomType: '0,1'
                      }]
                    }]
                }
              ]
            }
          ]);
      });
      it('should process non-trackQuantity case of materials', () => {
        const state = {
          productionOrderItems: [],
          uomGroups: {
            1: {
              "id": 1,
              "units": [{
                "id": 11,
                "unitGroupId": 1,
                "name": "g",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 12,
                "unitGroupId": 1,
                "name": "kg",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            },
            2: {
              "id": 2,
              "units": [{
                "id": 21,
                "unitGroupId": 2,
                "name": "mL",
                "isBaseUnit": true,
                "ratio": "1.0",
              }, {
                "id": 22,
                "unitGroupId": 2,
                "name": "L",
                "isBaseUnit": false,
                "ratio": "1000.0",
              }]
            }
          },
          billOfMaterials: {
            7771: [{
              "id": 1,
              trackQuantity: 0,
              children: [{
                id: 11,
                trackQuantity: 1,
                children: [
                  {
                    id: 111,
                    trackQuantity: 1
                  },
                  {
                    id: 112,
                    trackQuantity: 1
                  }
                ]
              }, {
                id: 12,
                trackQuantity: 0,
                children: [
                  {
                    id: 121,
                    trackQuantity: 1
                  },
                  {
                    id: 122,
                    trackQuantity: 1
                  }
                ]
              }]
            }]
          }
        };
        const action = {
          type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM,
          data: [
            {
              "id": 7771,
              trackQuantity: 0
            }
          ]
        };
        let nextState = reducer(state, action);
        expect(nextState.productionOrderItems).to.containSubset(
          [
            {
              "productionOrderItemMaterials": [
                {
                  "id": 1,
                  trackQuantity: 0,
                  children: [
                    {
                      id: 11,
                      trackQuantity: 1,
                      children: []
                    },
                    {
                      id: 12,
                      trackQuantity: 0,
                      children: [
                        {
                          id: 121,
                          trackQuantity: 1
                        },
                        {
                          id: 122,
                          trackQuantity: 1
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]);
      });
    });
  });
}

