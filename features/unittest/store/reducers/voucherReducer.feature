Feature: Voucher Reducer
  In order to handle user's voucher state when receive user's action
  Voucher Reducer will process the data from action and merge with voucher's state

  Background:
    Given the reducer is "voucherReducer"

  Scenario: The initial value of voucher's state should be correct
    Given default state is undefined
    When after the reducer handled received action
      """
      {}
      """
    Then the state should be
      """
      {
          "criteria": {
              "totalCount": 0,
              "totalPages": 0,
              "page": 0,
              "count": 25,
              "filters": []
          },
          "currentVouchers": [],
          "products": [],
          "fetchingData": true
      }
      """

  Scenario: After receive SET_VOUCHERS, the state data should be updated
    Given current state is
      """
      {
          "criteria": {
              "totalCount": 0,
              "totalPages": 0,
              "page": 0,
              "count": 25,
              "filters": []
          },
          "currentVouchers": [],
          "products": [],
          "fetchingData": false
      }
      """
    When after the reducer handled received action
      """
      {
        "type": "SET_VOUCHERS",
        "data": {
          "criteria": {
            "totalCount": 150,
            "totalPages": 120,
            "page": 1,
            "count": 25,
            "filters": []
          },
          "currentVouchers": [ 1 ],
          "products": [],
          "fetchingData": false
        }
      }
      """
    Then the state should be
      """
      {
          "criteria": {
              "totalCount": 150,
              "totalPages": 120,
              "page": 1,
              "count": 25,
              "filters": []
          },
          "currentVouchers": [ 1 ],
          "products": [],
          "fetchingData": false
      }
      """
    And the state should not be same object

  Scenario: After receive SET_VOUCHERS_FILTERS, the state data should be updated
    Given current state is
      """
      {
          "criteria": {
              "totalCount": 0,
              "totalPages": 0,
              "page": 0,
              "count": 25,
              "filters": []
          },
          "currentVouchers": []
      }
      """
    When after the reducer handled received action
      """
      {
        "type": "SET_VOUCHERS_FILTERS",
        "data": [{
          "id": 1,
          "column": "name",
          "condition": "contain",
          "conditionValue": "1"
        }]
      }
      """
    Then the state should be
      """
      {
          "criteria": {
              "totalCount": 0,
              "totalPages": 0,
              "page": 0,
              "count": 25,
              "filters": [{
                "id": 1,
                "column": "name",
                "condition": "contain",
                "conditionValue": "1"
              }]
          },
          "currentVouchers": []
      }
      """
    And the state should not be same object
