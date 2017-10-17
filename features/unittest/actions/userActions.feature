Feature: User action
  In order to handle user's action with storeId
  User action will handle the data comes from user and pass to store

  Background:
    Given if login with username: "username" and password: "password"
    Then  login Service will return
      | name | User N. |

  Scenario: When login with correct username and password, login should be success
    Given the username: "username" and the password "password"
    And   expect store will receive these actions
      """
      [
        {
          "type": "START_FETCH"
        },
        {
          "type": "LOGIN_SUCCESS",
          "user": {
            "name": "User N."
          }
        },
        {
          "type": "STOP_FETCH"
        }
      ]
      """
    When invoke login action
    Then store should receive correct login action data

  Scenario: When login with wrong username and password, login should be failure
    Given the username: "username" and the password "wrongpassword"
    And   expect store will receive these actions
      """
      [
        {
          "type": "START_FETCH"
        },
        {
          "type": "LOGIN_FAILURE"
        },
        {
          "type": "STOP_FETCH"
        }
      ]
      """
    When invoke login action
    Then store should receive correct login action data
