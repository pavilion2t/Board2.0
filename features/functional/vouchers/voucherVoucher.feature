Feature: Voucher Overview
  After setting up the basic of voucher in overview page, and setting up associated products in associated products page,
  I want to create and manage vouchers for printing and prepare to sell it to my customer
  I want to delete or suspend vouchers in case I create incorrect data or don't want to sell remaining vouchers anymore.

  URL format :store_id/vouchers/:voucher_id/overview

  Scenario: vouchers tab should be empty if no voucher has been generated by user
    Given voucher coupon data
      """
      []
      """
    When I open a voucher's voucher tab
    Then voucher tab should display
      """
      []
      """

  Scenario: Voucher voucher tab should display coupon list
    Given voucher coupon data
      """
      [{
          "id": 5857,
          "discount_id": 10930,
          "store_id": 1651,
          "code": "104",
          "redeemed": false,
          "activated": true,
          "canceled": true,
          "is_voucher": true,
          "line_item_id": null,
          "applied_to_order_id": null,
          "deleted_at": null,
          "created_at": "2016-04-27T03:53:35-04:00",
          "updated_at": "2016-04-27T06:06:41-04:00",
          "expired_at": "2016-04-21T00:00:00-04:00",
          "assigned_at": null,
          "redeemed_at": null,
          "activated_at": "2016-04-27T03:53:34-04:00",
          "canceled_at": "2016-04-27T06:06:41-04:00",
          "status": "Canceled"
        }, {
          "id": 5863,
          "discount_id": 10930,
          "store_id": 1651,
          "code": "106",
          "redeemed": false,
          "activated": true,
          "canceled": true,
          "is_voucher": true,
          "line_item_id": null,
          "applied_to_order_id": null,
          "deleted_at": null,
          "created_at": "2016-04-27T03:53:35-04:00",
          "updated_at": "2016-04-27T06:07:15-04:00",
          "expired_at": "2016-04-21T00:00:00-04:00",
          "assigned_at": null,
          "redeemed_at": null,
          "activated_at": "2016-04-27T03:53:34-04:00",
          "canceled_at": "2016-04-27T06:07:15-04:00",
          "status": "Canceled"
      }]
      """
    When I open a voucher's voucher tab
    Then voucher tab should display
    """
    [{
        "id": 5857,
        "discount_id": 10930,
        "store_id": 1651,
        "code": "104",
        "redeemed": false,
        "activated": true,
        "canceled": true,
        "is_voucher": true,
        "line_item_id": null,
        "applied_to_order_id": null,
        "deleted_at": null,
        "created_at": "2016-04-27T03:53:35-04:00",
        "updated_at": "2016-04-27T06:06:41-04:00",
        "expired_at": "2016-04-21T00:00:00-04:00",
        "assigned_at": null,
        "redeemed_at": null,
        "activated_at": "2016-04-27T03:53:34-04:00",
        "canceled_at": "2016-04-27T06:06:41-04:00",
        "status": "Canceled",
        "created_at_text": "4/27/2016, 3:53 AM",
        "expired_at_text": "4/21/2016, 12:00 AM"
      }, {
        "id": 5863,
        "discount_id": 10930,
        "store_id": 1651,
        "code": "106",
        "redeemed": false,
        "activated": true,
        "canceled": true,
        "is_voucher": true,
        "line_item_id": null,
        "applied_to_order_id": null,
        "deleted_at": null,
        "created_at": "2016-04-27T03:53:35-04:00",
        "updated_at": "2016-04-27T06:07:15-04:00",
        "expired_at": "2016-04-21T00:00:00-04:00",
        "assigned_at": null,
        "redeemed_at": null,
        "activated_at": "2016-04-27T03:53:34-04:00",
        "canceled_at": "2016-04-27T06:07:15-04:00",
        "status": "Canceled",
        "created_at_text": "4/27/2016, 3:53 AM",
        "expired_at_text": "4/21/2016, 12:00 AM"

    }]
    """
