Feature: Alert Reducer
  This is the heart of our global alert system.
  A list of alert in store should display to user.
  Alert Reducer will add or remove alert to the list.

  Background:
    Given the reducer is "alertReducer"

  Scenario: The initial value of alert's state is array
    Given current state is undefined
    When after the reducer handled received action
      """
      { "type": "WHAT_EVER"}
      """
    Then the state should be
      """
      []
      """

  Scenario: After receive ADD_ALERT, reducer should add new alert to the list
    Given current state is
      """
      []
      """
    When after the reducer handled received action
      """
      {
        "type": "ADD_ALERT",
        "style": "danger",
        "message": "something is wrong"
      }
      """
    Then the state should be
      """
      [{
        "style": "danger",
        "message": "something is wrong"
      }]
      """
    And the state should not be same object

  Scenario: After receive REMOVE_ALERT, reducer should remove alert by message
    Given current state is
      """
      [{
        "style": "success",
        "message": "everything is good"
      },{
        "style": "success",
        "message": "remove me"
      }]
      """
    When after the reducer handled received action
      """
      {
        "type": "REMOVE_ALERT",
        "message": "remove me"
      }
      """
    Then the state should be
      """
      [{
        "style": "success",
        "message": "everything is good"
      }]
      """
    And the state should not be same object

  Scenario: After receive TRUNCATE_ALERT, the alert list should be empty
    Given current state is
      """
      [{
        "style": "success",
        "message": "everything is good"
      }]
      """
    When after the reducer handled received action
      """
      {
        "type": "TRUNCATE_ALERT"
      }
      """
    Then the state should be
      """
      []
      """
    And the state should not be same object
