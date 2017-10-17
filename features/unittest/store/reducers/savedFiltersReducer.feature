Feature: Saved Filters Reducer
  In order to handle user's saved filters state when receive user's action
  Saved Filters Reducer will process the data from action and merge with saved filter's state

  Background:
    Given the reducer is "savedFiltersReducer"

  Scenario: The initial value of saved filter's state should be correct
    Given default state is undefined
    When after the reducer handled received action
      """
      {}
      """
    Then the state should be
      """
      {}
      """

  Scenario: After receive SAVE_FILTER, the state data should be correct
    Given current state is
      """
      {}
      """
    When after the reducer handled received action
      """
      {
        "type": "SAVE_FILTER",
        "data": {
          "inventory": {
            "test": {
              "column": "name",
              "condition": "contain",
              "conditionValue": "123"
            }
          }
        }
      }
      """
    Then the state should be
      """
      {
        "inventory": {
          "test": {
            "column": "name",
            "condition": "contain",
            "conditionValue": "123"
          }
        }
      }
      """
    And the state should not be same object

  Scenario: After receive REMOVE_SAVED_FILTER, the state data should be correct
    Given current state is
      """
      {
        "inventory": {
          "test": {
            "column": "name",
            "condition": "contain",
            "conditionValue": "123"
          }
        }
      }
    """
    When after the reducer handled received action
      """
      {
        "type": "REMOVE_SAVED_FILTER",
        "data": {
          "group": "inventory",
          "name": "test"
        }
      }
      """
    Then the state should be
      """
      {
        "inventory": {}
      }
      """
    And the state should not be same object
