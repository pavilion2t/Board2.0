Feature: Voucher Action
  In order to handle user's action in voucher's page
  Voucher action will handle the data comes from user and pass to store

  Scenario: Get voucher's data by storeId, page, count, orderBy and filters, should update store's voucher data
    Given the storeId: "123" and the discount id: '123'
    When invoke voucher's getVoucher action
    Then the result should be handle promise object

  Scenario: After user setup the new filters, the voucher action should apply filter to store
    Given user setup the new filters
      """
      [
        {
          "id": 1,
          "column": "name",
          "condition": "contain",
          "conditionValue": "1"
        }
      ]
      """
    When invoke voucher's updateVoucherFilters action
    Then the store should receive action's data
      """
      {
        "type": "SET_VOUCHERS_FILTERS",
        "data": [
          {
            "id": 1,
            "column": "name",
            "condition": "contain",
            "conditionValue": "1"
          }
        ]
      }
      """
