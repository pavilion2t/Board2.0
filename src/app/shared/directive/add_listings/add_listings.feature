Feature: Add listing directive
  This is a directive that can search listing and can select to add

  Scenario: add with qty
    Given attr single-select is not set
    Then id will display qty input

  Scenario: add with checkbox
    Given attr single-select is not set
    Then id will display a select button

  Scenario: need a callback function when finished
    Given Use onClose=<function>
    Then When the pop up save button is clicked the callback function will be called

  Scenario: if some of the items are already taken
    Given Use takenIds=<id>
    Then the item which has the id in this array will be removed
