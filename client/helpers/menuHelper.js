import filter from 'lodash/filter';

import { moduleEnabled } from './storeHelper';
import { permissionAccessor } from './permissionHelper';

// example menu = [
//   { name: 'Summary', route: 'summary'},
//   { name: 'Inventory', route: 'inventory'},
//   { name: 'Customer', route: 'customer', permission: 'customer:view_only'},
//   { name: 'Gift Card', route: 'gift-card', module: 'gift_card_enabled'},
// ];
//
// example store_module = {
//   "id": 100,
//   "store_id": 100,
//   "restaurant_features_enabled": false,
//   "gift_card_enabled": true,
// };
//
// exampler store_permissions = [
//   {
//     "store_id": 9999,
//     "store_role_id": 1,
//     "store_role_name": "MANAGER",
//     "permissions": {
//       "inventory:view_only": true,
//       "customer:view_only": true,
//       "gift_card:view_only": true,
//       "discount:view_only": true,
//       "sales:view_only": true,
//     }
//   },
//   {
//     "store_id": 4497,
//     "store_role_id": 2,
//     "store_role_name": "EMPLOYEE",
//     "permissions": {
//       "inventory:view_only": true,
//       "customer:view_only": true,
//       "gift_card:view_only": false,
//       "discount:view_only": false,
//       "sales:view_only": false,
//     }
//   },
// ];

// filter MENU for ROLE base on store_module and store_permissions
export function filterMenu(menu, role, store_module, store_permissions) {
  let filteredByModule = filter(menu, m => {
    return m.module ? moduleEnabled(m.module, store_module) : true;
  });

  if (store_module && store_module.permission_enabled) {
    let filteredByPermission = filter(filteredByModule, m => {
      return m.permission ? permissionAccessor(m.permission, role, store_permissions, true) : true;
    });

    // Recursive filter sub-menu
    filteredByPermission = filteredByPermission.map(m => {
      if (m.child && m.child.length > 0){
        m.child = filterMenu(m.child, role, store_module, store_permissions);
      }
      return m;
    });

    return filteredByPermission;

  } else {
    return filteredByModule;
  }
}
