import { bindPublicMethod } from './bindHelper';
import { find } from 'lodash';

/**
 * Test whether a ROLE can do ACTION base on the STORE_PERMISSIONS
 *
 * @param {string|RegExp} action                            The action want to perform
 * @param {string|object} store                             The store object or association type string
 * @param {string}        [store.associate_type]            The association type string
 * @param {object[]}      [store.store_permissions]         The array of store permission object
 * @param {boolean}       [store.module.permission_enabled] The indicator of store permission module
 * @param {object[]}      [storePermissions]                The array of store permission object
 * @param {boolean}       [permissionEnabled]               The indicator of store permission module
 *
 * @return {boolean}
 *
 * @example Call with params (action, store)
 * var canEditInvoice = permissionAccessor('invoice:edit', currentStore);
 *
 * @example Call with params (action, associateType, storePermissions, permissionEnabled)
 * var canEditInvoice = permissionAccessor('invoice:edit', store.associate_type, store.store_permissions, true);
 *
 * @example Call with RegExp
 * // return true for 'invoice:view_only', 'invoice:edit', 'invoice:edit_button', etc.
 * var canViewInvoice = permissionAccessor(/^invoice:/, currentStore);
 *
 * @example Store permission module is disabled
 * var canEditInvoice = permissionAccessor('invoice:edit', currentStore); // Always true
 */
export function permissionAccessor(action, associateType, storePermissions, permissionEnabled) {
  let needCheck = permissionEnabled;
  let permissions = null;

  // Get role's permission
  if (typeof associateType === 'string'){
    permissions = find(storePermissions, { store_role_name: associateType });
  } else {
    const store = associateType || {};
    const r = store.associate_type || store.associateType;
    const p = store.store_permissions || store.storePermissions || [];
    const m = store.module || {};
    const e = m.permission_enabled || m.permissionEnabled;
    needCheck = e;
    permissions = p.find(d => d.store_role_name === r || d.storeRoleName === r);
  }

  if (!needCheck) return true;

  if (!permissions) {
    console.warn('user\'s role not in store permissions');
    return false;
  }

  // Exect match with permission object
  if (typeof action === 'string') {
    if (typeof permissions.permissions[action] === 'boolean'){
      return permissions.permissions[action];
    } else {
      // Permission not found, assume for super-module prefix search
      action = RegExp(`^${action}:`);
    }
  }

  // RegExp match with permission object
  if (action instanceof RegExp) {
    for (let key in permissions.permissions) {
      if (action.test(key) && permissions.permissions[key]) {
        return true;
      }
    }
    return false;

  // Unknow permission checking
  } else {
    console.warn('unknow data type for permission checking');
    return false;
  }
}

export function getCurrentPermission(WrappedComponent) {
  function accessor(key) {
    const { currentStore }= this.context;
    return permissionAccessor(key, currentStore);
  }

  return bindPublicMethod(WrappedComponent, 'getCurrentPermission', accessor);
}
