Feature: Login Service
  In order to process login data with api
  Login Service will handle login action through our api

Background:
  Given login api url is "/v2/login"

  Scenario: With correct username and password, login should be success
    Given the username and password are
      | username | username |
      | password | password |
    And   the api should return user's infomation
      | name                 | User N.            |
      | full_name            | User Name          |
      | id                   | 1111               |
      | access_token         | 1111111111111111   |
      | email                | testuser@bindo.com |
      | is_inventory_manager | false              |
      | is_admin             | false              |
      | belongs_to_internal  | false              |
      | belongs_to_reseller  | false              |
      | belongs_to_courier   | false              |
    When Login Service process login with Username: "username" and Password: "password"
    Then Login should be success

  Scenario: With wrong username and password, login should be failure
    Given the username and password are
      | username | username      |
      | password | errorpassword |
    And   the api should return login error message
      | message | 401 Unauthorized |
    When Login Service process login with Username: "username" and Password: "password"
    Then Login should be failed and the error message is "401 Unauthorized"
