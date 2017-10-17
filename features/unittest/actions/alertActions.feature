Feature: Alert action creator
  Alert action creator will pass alert style and message to store

  Scenario: Alert with danger style
    Given Use alert()
    When style is "danger" and message is "something is wrong"
    Then store should receive action
      | type     | ADD_ALERT          |
      | style    | danger             |
      | message  | something is wrong |

  Scenario: Alert with success style
    Given Use alert()
    When style is "warning" and message is "something is strange"
    Then store should receive action
      | type     | ADD_ALERT            |
      | style    | warning              |
      | message  | something is strange |

  Scenario: Alert with warning style
    Given Use alert()
    When style is "success" and message is "everthing is fine"
    Then store should receive action
      | type     | ADD_ALERT          |
      | style    | success            |
      | message  | everthing is fine  |

  Scenario: Remove a alert (by message)
    Given Use removeAlert()
    When message is "everthing is fine"
    Then store should receive action
      | type     | REMOVE_ALERT       |
      | message  | everthing is fine  |

  Scenario: Remove all alert
    Given Use truncateAlert()
    When any condition
    Then store should receive action
      | type     | TRUNCATE_ALERT     |
