Feature: Voucher List
  In order to query current voucher status
  As a customer
  I want to use voucher list to query current voucher status

  Related JIRA ticket:https://bindolabs.atlassian.net/browse/DASHBOARD-530
  Related workflow: attachment in DASHBOARD-530, voucher workflow 3.png, page 2

  Background:
    Given existing voucher data:
      | id | voucher_name |   amount   | revenue_recognition | sold_qty | redeemed_qty | pending_qty |
      |  1 |    name 0    |      0     |            2        |    0     |       0      |      0      |
      |  2 |    name 1    |     10     |            1        |    1     |       1      |      1      |
      |  3 |    name 2    |     20     |            2        |    2     |       2      |      2      |
      |  4 |    name 3    |     30     |            1        |    3     |       3      |      3      |
      |  5 |    name 4    |     40     |            2        |    4     |       0      |      4      |



  Scenario: Voucher list page should display voucher data with NO filter
    When I open the voucher list page
    Then voucher list page should display data:
      | id | voucher_name |   amount   | face_value | revenue_recognition | sold_qty | redeemed_qty | pending_qty |
      |  1 |    name 0    |      0     |     0      |     AT SALES        |    0     |       0      |      0      |
      |  2 |    name 1    |     10     |     10     |     AT REDEMPTION   |    1     |       1      |      1      |
      |  3 |    name 2    |     20     |     20     |     AT SALES        |    2     |       2      |      2      |
      |  4 |    name 3    |     30     |     30     |     AT REDEMPTION   |    3     |       3      |      3      |
      |  5 |    name 4    |     40     |     40     |     AT SALES        |    4     |       0      |      4      |

  Scenario: Voucher list should display filtered voucher with query string [filters]
    When I open the voucher list page with query "name__contain__name"
    Then criteria filter should be
      """
      [{
        "column":"name",
        "condition":"contain",
        "conditionValue":"name"
      }]
      """
