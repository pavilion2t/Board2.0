Feature: Store Reducer
  In order to handle store's state when receive store's related action
  Store Reducer will process the data from action and merge with store's state

  Background:
    Given the reducer is "storeReducer"

  Scenario: The initial value of store's state should be correct
    Given current state is undefined
    When after the reducer handled received action
      """
      {}
      """
    Then the state should be
      """
      []
      """

  Scenario: The initial value of store's state should be correct
    Given current state is undefined
    When after the reducer handled received action
      """
      {
        "type": "SET_STORES",
        "stores": [{
          "id": 1
        }]
      }
      """
    Then the state should be
      """
      [{
        "id": 1
      }]
      """
