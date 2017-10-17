Feature: Entity Reducer
  In order to handle entity's state when receive entity's related action
  Entity Reducer will process the data from action and merge with entity's state

  Background:
    Given the reducer is "entityReducer"

  Scenario: The initial value of entity's state should be correct
    Given current state is undefined
    When after the reducer handled received action
      """
      {}
      """
    Then the state should be
      """
      {
        "listings": null,
        "suppliers": null,
        "departments": null,
        "vouchers": null,
        "stations": null,
        "lineItemStatuses": null,
        "workflows": null,
        "uomGroups": null
      }
      """

  Scenario: Update listings entity from nothing
    Given current state is
      """
      {
        "listings": null,
        "suppliers": null,
        "departments": null,
        "vouchers": null,
        "stations": null,
        "lineItemStatuses": null,
        "workflows": null,
        "uomGroups": null
      }
      """
    When after the reducer handled received action
      """
      {
        "type": "SET_ENTITIES_LISTINGS",
        "data": {
          "listings": {
            "1": {
              "id": 1
            }
          }
        }
      }
      """
    Then the state should be
      """
      {
        "listings": {
          "1": {
            "id": 1
          }
        },
        "suppliers": null,
        "departments": null,
        "vouchers": null,
        "stations": null,
        "lineItemStatuses": null,
        "workflows": null,
        "uomGroups": null
      }
      """

  Scenario: Update listings entity from existing entity, should reserve exsiting data
    Given current state is
      """
      {
        "listings": {
          "1": {
            "id": 1,
            "name": "foo",
            "price": 100
          }
        },
        "suppliers": null,
        "departments": null
      }
      """
    When after the reducer handled received action
      """
      {
        "type": "SET_ENTITIES_LISTINGS",
        "data": {
          "listings": {
            "1": {
              "id": 1,
              "name": "bar"
            },
            "2": {
              "id": 2
            }
          }
        }
      }
      """
    Then the state should be
      """
      {
        "listings": {
          "1": {
            "id": 1,
            "name": "bar",
            "price": 100
          },
          "2": {
            "id": 2
          }
        },
        "suppliers": null,
        "departments": null
      }
      """

  Scenario: Update listings entity, e.g. it's product graphic. It should become new object
    Given current state is
      """
      {
        "listings": {
          "1": {
            "id": 1,
            "name": "foo"
          }
        },
        "suppliers": null,
        "departments": null
      }
      """
    When after the reducer handled received action
      """
      {
        "type": "UPDATE_ENTITY",
        "collection": "listings",
        "id": "1",
        "data": { "product_graphics": [{"id": 1}] }
      }
      """
    Then the state should be
      """
      {
        "listings": {
          "1": {
            "id": 1,
            "name": "foo",
            "product_graphics": [{"id": 1}]
          }
        },
        "suppliers": null,
        "departments": null
      }
      """

  Scenario: After receive ADD_ENTITY_LISTING_GRAPHIC, the entities' state chould be correct
    Given current state is
      """
      {
        "listings": {
          "1": {
            "id": 1,
            "product_graphics": [
              {
                "id": 1,
                "image_url": "url"
              },
              {
                "id": 2,
                "image_url": "url"
              }
            ]
          }
        }
      }
      """
    When after the reducer handled received action
      """
      {
        "type": "ADD_ENTITY_LISTING_GRAPHIC",
        "listingId": 1,
        "graphicData": {
          "id": 3,
          "image_url": "url"
        }
      }
      """
    Then the state should be
      """
      {
        "listings": {
          "1": {
            "id": 1,
            "product_graphics": [
              {
                "id": 1,
                "image_url": "url"
              },
              {
                "id": 2,
                "image_url": "url"
              },
              {
                "id": 3,
                "image_url": "url"
              }
            ]
          }
        }
      }
      """

  Scenario: After receive REMOVE_ENTITY_LISTING_GRAPHIC, the entities' state chould be correct
    Given current state is
    """
      {
        "listings": {
          "1": {
            "id": 1,
            "product_graphics": [
              {
                "id": 1,
                "image_url": "url"
              },
              {
                "id": 2,
                "image_url": "url"
              }
            ]
          }
        }
      }
      """
    When after the reducer handled received action
      """
      {
        "type": "REMOVE_ENTITY_LISTING_GRAPHIC",
        "listingId": 1,
        "graphicId": 1
      }
      """
    Then the state should be
      """
      {
        "listings": {
          "1": {
            "id": 1,
            "product_graphics": [
              {
                "id": 2,
                "image_url": "url"
              }
            ]
         }
       }
      }
      """

  Scenario: After receive SET_HANDLE_PROMISE_ENTITIES, the entities' state chould be correct
    Given current state is
      """
      {
        "listings": {
          "1": {
            "id": 1
          }
        }
      }
      """
    When after the reducer handled received action
      """
      {
        "type": "SET_HANDLE_PROMISE_ENTITIES",
        "data": {
          "listings": {
            "2": {
              "id": 2
            }
          }
        }
      }
      """
    Then the state should be
      """
      {
        "listings": {
          "1": {
            "id": 1
          },
          "2": {
            "id": 2
          }
        }
      }
      """
