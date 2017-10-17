Feature: Store Helper
  In order to handle store's data
  Store Helper will provide serveral function to do that.

  Scenario: buildStoreTree should covert flat store array to store tree
    Given the falt store array data
      | id | parent_id |
      | 1  |    999    |
      | 2  |    999    |
      | 3  |    999    |
      | 11 |     1     |
      | 11 |     1     |
      | 11 |     1     |
      | 12 |     2     |
      | 12 |     2     |
      | 12 |     2     |
      | 13 |     3     |
      | 13 |     3     |
      | 13 |     3     |
    When build store tree
    Then the store tree should look like
      """
      [
        {
          "id": "1",
          "parent_id": "999",
          "_children": [
            {
              "id": "11",
              "parent_id": "1"
            },
            {
              "id": "11",
              "parent_id": "1"
            },
            {
              "id": "11",
              "parent_id": "1"
            }
          ]
        },
        {
          "id": "2",
          "parent_id": "999",
          "_children": [
            {
              "id": "12",
              "parent_id": "2"
            },
            {
              "id": "12",
              "parent_id": "2"
            },
            {
              "id": "12",
              "parent_id": "2"
            }
          ]
        },
        {
          "id": "3",
          "parent_id": "999",
          "_children": [
            {
              "id": "13",
              "parent_id": "3"
            },
            {
              "id": "13",
              "parent_id": "3"
            },
            {
              "id": "13",
              "parent_id": "3"
            }
          ]
        }
      ]
      """

  Scenario: moduleEnabled should detect is given module name enabled
    Given the module status list
      """
      {
        "id": 123,
        "store_credit_enabled": true,
        "print_gift_receipt_enabled": false
      }
      """
    When check is module "id" enabled
    Then module should be enabled


  Scenario: moduleEnabled should detect is given module name enabled
    Given the module status list
      """
      {
        "id": 123,
        "store_credit_enabled": true,
        "print_gift_receipt_enabled": false
      }
      """
    When check is module "store_credit_enabled" enabled
    Then module should be enabled

  Scenario: moduleEnabled should detect is given module name enabled
    Given the module status list
      """
      {
        "id": 123,
        "store_credit_enabled": true,
        "print_gift_receipt_enabled": false
      }
      """
    When check is module "print_gift_receipt_enabled" enabled
    Then module should not be enabled
