Feature: Supplier Helper
  In order to format supplier data
  Supplier Helper will provide serveral function to do that.
  
  Scenario: Calculate inventory's margin by listing's price and supplier's cost
    Given listing's price "100" and supplier's cost "80"
    When calculate inventory's margin
    Then the margin of inventory is "20.00"

  Scenario: Calculate inventory's margin, return empty when price is null.
    Given listing's price "" and supplier's cost "80"
    When calculate inventory's margin
    Then the margin of inventory is empty string

  Scenario: Calculate inventory's margin, return empty when price is zero.
    Given listing's price "0" and supplier's cost "80"
    When calculate inventory's margin
    Then the margin of inventory is empty string

  Scenario: Calculate inventory's margin, return empty when cost is null.
    Given listing's price "100" and supplier's cost ""
    When calculate inventory's margin
    Then the margin of inventory is empty string

  Scenario: Calculate inventory's margin, return empty when cost is zero.
    Given listing's price "100" and supplier's cost "0"
    When calculate inventory's margin
    Then the margin of inventory is empty string
