Feature: Voucher Overview
  In order to query current voucher status
  As a customer I want to view voucher detail by voucher overview

  URL format :store_id/vouchers/:voucher_id/overview

  Background:
    Given voucher item data
      """
      {
          "id": 1,
          "store_id": 999,
          "name": "Voucher 888",
          "percentage": null,
          "amount": "2000.0",
          "price": "0.0",
          "discount_type": 1,
          "start_from": null,
          "end_at": null,
          "coupon_code_only": false,
          "days_of_week": [],
          "time_range_type": 1,
          "time_range": null,
          "party_size_type": 0,
          "party_size": null,
          "channels": [],
          "shipping_methods": [],
          "priority": 50,
          "auto_apply": false,
          "deduct_tax_base": true,
          "created_at": "2016-04-14T04:08:15-04:00",
          "updated_at": "2016-04-14T04:08:15-04:00",
          "notes": null,
          "deleted": false,
          "revenue_recognition": 0,
          "expiration_setting": {
            "type": "date",
            "value": "2016-12-12"
          },
          "mix_and_match": false,
          "quantity_required": null,
          "discountable_items": [],
          "stackable_discounts": []
      }
      """

  Scenario: Voucher overview page should display voucher's detail
    When I open the voucher overview page
    Then voucher overview should display
    """
    {

        "id": 1,
        "store_id": 999,
        "name": "Voucher 888",
        "percentage": null,
        "amount": "2000.0",
        "price": "0.0",
        "discount_type": 1,
        "start_from": null,
        "end_at": null,
        "coupon_code_only": false,
        "days_of_week": [],
        "time_range_type": 1,
        "time_range": null,
        "party_size_type": 0,
        "party_size": null,
        "channels": [],
        "shipping_methods": [],
        "priority": 50,
        "auto_apply": false,
        "deduct_tax_base": true,
        "created_at": "2016-04-14T04:08:15-04:00",
        "updated_at": "2016-04-14T04:08:15-04:00",
        "notes": null,
        "deleted": false,
        "revenue_recognition": 0,
        "revenue_recognition_text": "SALES",
        "expiration_setting": {
          "type": "date",
          "value": "2016-12-12"
        },
        "expiration_setting_text": "Expire on 2016-12-12",
        "mix_and_match": false,
        "quantity_required": null,
        "discountable_items": [],
        "stackable_discounts": []
    }
    """

  Scenario: Voucher overview page should show updated details of voucher after editing
    Given I update voucher data with
      """
      {
        "name": "燕窩桂花糕",
        "amount": "399.95"
      }
      """

    When I save voucher

    Then voucher overview should display
    """
    {
        "id": 1,
        "store_id": 999,
        "name": "燕窩桂花糕",
        "percentage": null,
        "amount": "399.95",
        "price": "0.0",
        "discount_type": 1,
        "start_from": null,
        "end_at": null,
        "coupon_code_only": false,
        "days_of_week": [],
        "time_range_type": 1,
        "time_range": null,
        "party_size_type": 0,
        "party_size": null,
        "channels": [],
        "shipping_methods": [],
        "priority": 50,
        "auto_apply": false,
        "deduct_tax_base": true,
        "created_at": "2016-04-14T04:08:15-04:00",
        "updated_at": "2016-04-14T04:08:15-04:00",
        "notes": null,
        "deleted": false,
        "revenue_recognition": 0,
        "revenue_recognition_text": "SALES",
        "expiration_setting": {
          "type": "date",
          "value": "2016-12-12"
        },
        "expiration_setting_text": "Expire on 2016-12-12",
        "mix_and_match": false,
        "quantity_required": null,
        "discountable_items": [],
        "stackable_discounts": []
    }
    """
