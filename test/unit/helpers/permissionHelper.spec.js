import {
  permissionAccessor,
  getCurrentPermission,
} from '../../../client/helpers/permissionHelper';

export default function () {

  describe('Permission Helpers', () => {

    describe('permissionAccessor()', () => {

      it('can test permission', () => {
        const role = 'MANAGER';
        const permissionEnabled = true;
        const storePermissions = [
          {
            store_role_name: 'MANAGER',
            permissions: {
              "invoice": true,
              "inventory": false,
            },
          },
        ];
        expect(permissionAccessor('invoice', role, storePermissions, permissionEnabled)).toEqual(true);
        expect(permissionAccessor('inventory', role, storePermissions, permissionEnabled)).toEqual(false);
      });

      it('can test with different role', () => {
        const permissionEnabled = true;
        const storePermissions = [
          {
            store_role_name: 'MANAGER',
            permissions: {
              "invoice": true,
            },
          },
          {
            store_role_name: 'SALESPERSON',
            permissions: {
              "invoice": false,
            },
          },
        ];
        expect(permissionAccessor('invoice', 'MANAGER', storePermissions, permissionEnabled)).toEqual(true);
        expect(permissionAccessor('invoice', 'SALESPERSON', storePermissions, permissionEnabled)).toEqual(false);
      });

      it('can test with RegExp', () => {
        const role = 'MANAGER';
        const permissionEnabled = true;
        const storePermissions = [
          {
            store_role_name: 'MANAGER',
            permissions: {
              "invoice:view": true,
              "invoice:edit": false,
              "report:view": false,
              "report:edit": false,
              "setting:report:view": true,
              "setting:report:edit": true,
            },
          },
        ];
        expect(permissionAccessor('invoice:view', role, storePermissions, permissionEnabled)).toEqual(true);
        expect(permissionAccessor('invoice:edit', role, storePermissions, permissionEnabled)).toEqual(false);
        expect(permissionAccessor('invoice', role, storePermissions, permissionEnabled)).toEqual(true);
        expect(permissionAccessor(/^invoice:/, role, storePermissions, permissionEnabled)).toEqual(true);
        expect(permissionAccessor('report:view', role, storePermissions, permissionEnabled)).toEqual(false);
        expect(permissionAccessor('report:edit', role, storePermissions, permissionEnabled)).toEqual(false);
        expect(permissionAccessor('report', role, storePermissions, permissionEnabled)).toEqual(false);
        expect(permissionAccessor(/^report:/, role, storePermissions, permissionEnabled)).toEqual(false);
        expect(permissionAccessor('setting', role, storePermissions, permissionEnabled)).toEqual(true);
        expect(permissionAccessor('setting:report', role, storePermissions, permissionEnabled)).toEqual(true);
        expect(permissionAccessor(/^setting:/, role, storePermissions, permissionEnabled)).toEqual(true);
        expect(permissionAccessor(/report:/, role, storePermissions, permissionEnabled)).toEqual(true);
      });

      it('can call with (action, store) => boolean', () => {
        expect(permissionAccessor('invoice:view', {
          associate_type: 'MANAGER',
          store_permissions: [
            {
              store_role_name: 'MANAGER',
              permissions: {
                "invoice:view": true,
                "invoice:edit": false,
              },
            }
          ],
          module: { permission_enabled: true }
        })).toEqual(true);

        expect(permissionAccessor('invoice:edit', {
          associate_type: 'MANAGER',
          store_permissions: [
            {
              store_role_name: 'MANAGER',
              permissions: {
                "invoice:view": true,
                "invoice:edit": false,
              },
            }
          ],
          module: { permission_enabled: true }
        })).toEqual(false);

        expect(permissionAccessor('invoice:edit', {
          associate_type: 'MANAGER',
          store_permissions: [
            {
              store_role_name: 'MANAGER',
              permissions: {
                "invoice:view": true,
                "invoice:edit": false,
              },
            }
          ],
          module: { permission_enabled: false }
        })).toEqual(true);

        expect(permissionAccessor('invoice:view', {
          associateType: 'MANAGER',
          storePermissions: [
            {
              storeRoleName: 'MANAGER',
              permissions: {
                "invoice:view": true,
                "invoice:edit": false,
              },
            }
          ],
          module: { permissionEnabled: true }
        })).toEqual(true);

        expect(permissionAccessor('invoice:edit', {
          associateType: 'MANAGER',
          storePermissions: [
            {
              storeRoleName: 'MANAGER',
              permissions: {
                "invoice:view": true,
                "invoice:edit": false,
              },
            }
          ],
          module: { permissionEnabled: true }
        })).toEqual(false);

        expect(permissionAccessor('invoice:edit', {
          associateType: 'MANAGER',
          storePermissions: [
            {
              storeRoleName: 'MANAGER',
              permissions: {
                "invoice:view": true,
                "invoice:edit": false,
              },
            }
          ],
          module: { permissionEnabled: false }
        })).toEqual(true);

      });

      it('return true when store permission module is disabled', () => {
        const role = 'MANAGER';
        const permissionEnabled = false;
        const storePermissions = [
          {
            store_role_name: 'MANAGER',
            permissions: {
              "invoice": true,
              "inventory": false,
            },
          },
        ];
        expect(permissionAccessor('invoice', role, storePermissions, permissionEnabled)).toEqual(true);
        expect(permissionAccessor('inventory', role, storePermissions, permissionEnabled)).toEqual(true);
      });

      it('return false when role\'s permission is not defined', () => {
        const role = 'MANAGER';
        const permissionEnabled = true;
        const storePermissions = [];
        expect(permissionAccessor('invoice', role, storePermissions, permissionEnabled)).toEqual(false);
      });

      it('return false when action type is not string and RegExp', () => {
        const role = 'MANAGER';
        const permissionEnabled = true;
        const storePermissions = [
          {
            store_role_name: 'MANAGER',
            permissions: {
              "invoice": true,
              "inventory": false,
            },
          },
        ];
        expect(permissionAccessor({}, role, storePermissions, permissionEnabled)).toEqual(false);
        expect(permissionAccessor(true, role, storePermissions, permissionEnabled)).toEqual(false);
        expect(permissionAccessor(null, role, storePermissions, permissionEnabled)).toEqual(false);
      });

    });

    describe('getCurrentPermission()', () => {
      it('can test permission', () => {
        @getCurrentPermission
        class Wrapper {
          constructor(store){
            this.context = { currentStore: store };
          }
        }
        const store1 = {
          associateType: 'MANAGER',
          storePermissions: [
            {
              storeRoleName: 'MANAGER',
              permissions: {
                "invoice:view": true,
                "invoice:edit": false,
              },
            }
          ],
          module: { permissionEnabled: true }
        };
        const store2 = {
          associateType: 'MANAGER',
          storePermissions: [
            {
              storeRoleName: 'MANAGER',
              permissions: {
                "invoice:view": true,
                "invoice:edit": false,
              },
            }
          ],
          module: { permissionEnabled: false }
        };
        const component1 = new Wrapper(store1);
        const component2 = new Wrapper(store2);

        expect(component1.getCurrentPermission('invoice:view')).toEqual(true);
        expect(component1.getCurrentPermission('invoice:edit')).toEqual(false);
        expect(component1.getCurrentPermission(/^invoice:/)).toEqual(true);
        expect(component2.getCurrentPermission('invoice:view')).toEqual(true);
        expect(component2.getCurrentPermission('invoice:edit')).toEqual(true);
        expect(component2.getCurrentPermission(/^invoice:/)).toEqual(true);
      });
    });

  });

}
