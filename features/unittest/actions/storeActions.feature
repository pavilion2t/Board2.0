Feature: Store action creator
  Store action creator will pass alert style and message to store

  Scenario: Switch between Store
    When execute switchStore() action
    Then store should receive action
      | type     | SWITCH_STORE          |

