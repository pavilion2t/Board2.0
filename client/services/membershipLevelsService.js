import BindoService from './base/bindoService';

import { Schema, normalize, arrayOf } from 'normalizr';
export const MembershipLevelSchema = new Schema('membership_level');

class MembershipLevelService extends BindoService {
  getList(storeId, filters = []) {
    let path = `v2/stores/${storeId}/membership_levels`;

    return super.get(path).then((res) => {
      // asume user won't set over 1000 membership_levels
      let memberships = res.data.membership_levels;

      //normalize
      return normalize(memberships, arrayOf(MembershipLevelSchema));
    });
  }

  getItem(storeId, membershipId) {
    let path = `v2/stores/${storeId}/membership_levels/${membershipId}`;
    return super.get(path, null).then((res) => {
      let membership = res.membership_level;

      //normalize
      return normalize(membership, MembershipLevelSchema);
    });
  }

  createItem(storeId, membership) {
    let path = `v2/stores/${storeId}/membership_levels`;
    return super.post(path, membership).then((res) => {

      let membership = res.membership_level;

      //normalize
      return normalize(membership, MembershipLevelSchema);
    });
  }

  updateItem(storeId, membershipId, data) {
    let path = `v2/stores/${storeId}/membership_levels/${membershipId}`;


    return super.put(path, data).then((res) => {
      let membership = res.membership_level;

      //normalize
      return normalize(membership, MembershipLevelSchema);
    });

  }

  removeItem(storeId, membershipId) {

    let path = `v2/stores/${storeId}/membership_levels/${membershipId}`;

    return super.delete(path, null).then((res) => {
       let membership = res.membership_level;

      //normalize
      return normalize(membership, MembershipLevelSchema);
    });
  }
}

export default new MembershipLevelService();
