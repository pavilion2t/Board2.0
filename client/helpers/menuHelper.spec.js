import chai from 'chai';
import { filterMenu } from './menuHelper';

chai.should();

const store_module = {
  "id": 9999,
  "store_id": 9999,
  "restaurant_features_enabled": true,
  "gift_card_enabled": false,
  "customer_module_enabled": false,
  "permission_enabled": true, // must be true
};

const store_permissions = [
  {
    "store_id": 9999,
    "store_role_id": 1,
    "store_role_name": "MANAGER",
    "permissions": {
      "inventory:view_only": true,
      "customer:view_only": true,
      "gift_card:view_only": true,
      "discount:view_only": true,
      "sales:view_only": true,
    }
  },
  {
    "store_id": 4497,
    "store_role_id": 2,
    "store_role_name": "EMPLOYEE",
    "permissions": {
      "inventory:view_only": true,
      "customer:view_only": false,
      "gift_card:view_only": false,
      "discount:view_only": false,
      "sales:view_only": false,
    }
  },
];

describe('menuHelper:', () => {
  describe('menufilter()', () => {
    it("check permission and only check permission if set", () => {
      let menu;

      menu = [
        { name: 'Summary', route: 'summary'},
        { name: 'Inventory', route: 'inventory'},
        { name: 'Customer', route: 'customer'},
      ];

      filterMenu(menu, store_module, store_permissions, 'EMPLOYEE').should.deep.equal([
        { name: 'Summary', route: 'summary'},
        { name: 'Inventory', route: 'inventory'},
        { name: 'Customer', route: 'customer'},
      ]);

      menu = [
        { name: 'Summary', route: 'summary'},
        { name: 'Inventory', route: 'inventory', permission: 'inventory:view_only'},
        { name: 'Customer', route: 'customer', permission: 'customer:view_only'},
      ];

      filterMenu(menu, 'MANAGER', store_module, store_permissions).should.deep.equal([
        { name: 'Summary', route: 'summary'},
        { name: 'Inventory', route: 'inventory', permission: 'inventory:view_only'},
        { name: 'Customer', route: 'customer', permission: 'customer:view_only'},
      ]);

      filterMenu(menu, 'EMPLOYEE', store_module, store_permissions).should.deep.equal([
        { name: 'Summary', route: 'summary'},
        { name: 'Inventory', route: 'inventory', permission: 'inventory:view_only'},
      ]);
    });

    it("check module and only check module if set", () => {

      let menu = [
        { name: 'Summary', route: 'summary'},
        { name: 'Inventory', route: 'inventory'},
        { name: 'Customer', route: 'customer', module: 'customer_module_enabled'},
        { name: 'Event & Devices', route: 'event-devices', module: 'restaurant_features_enabled' },
        { name: 'Gift Cards', route: 'gift-cards', module: 'gift_card_enabled' },
      ];

      filterMenu(menu, 'MANAGER', store_module, store_permissions).should.deep.equal([
        { name: 'Summary', route: 'summary'},
        { name: 'Inventory', route: 'inventory'},
        { name: 'Event & Devices', route: 'event-devices', module: 'restaurant_features_enabled' },
      ]);

    });
  });
});


