import BindoService from './base/bindoService';
import config from '../configs/config';
import FilterHelper from '../helpers/filterHelper';
import map from 'lodash/map';
import pick from 'lodash/pick';
import forEach from 'lodash/forEach';


import { Schema, normalize, arrayOf } from 'normalizr';
export const VoucherSchema = new Schema('vouchers');
const ListingSchema = new Schema('listings');

class VoucherService extends BindoService {
  getList(storeId, page = 1, perPage = 25, orderBy = 'name', filters = []) {
    let path = `v2/stores/${storeId}/voucher_discounts`;
    let filtersQueryList = FilterHelper.filtersToQueryString(filters);
    let query = {
      page: page,
      per_page: perPage,
      order_by: 'name',
      filters: filtersQueryList
    };

    return super.get(path, query, config.gateway).then((res) => {
      let voucher_discounts = res.data.voucher_discounts;

        let data = voucher_discounts.map((voucher, i) => {
          let fix = {
            revenue_recognition: voucher.revenue_recognition % 2 == 0 ? 'AT SALES' : 'AT REDEMPTION',
            face_value: voucher.amount,
            // sold_qty: i,
            // redeemed_qty: i,
            // pending_qty: i
          };

          return Object.assign(voucher, fix);
        });

        let result = {
          page: page,
          count: perPage,
          perPage: perPage,
          totalCount: res.totalCount,
          totalPages: res.totalPages,
          filters: filters

        };
        //normalize
        const vouchers = normalize(data, arrayOf(VoucherSchema));


        return {
          state : {
            criteria: result,
            currentVouchers: vouchers.result
          },
          entities: vouchers.entities
        };

    });
  }

  getAssociateProducts(storeId, productsIds) {

    let promisese = [];

    for (let i in productsIds) {
        let query = {
          order_by: 'name',
          "filters[]": 'product_id__equal__' + String(productsIds[i])
        };

        let path = `v2/stores/${storeId}/listings`;

        promisese.push(super.get(path, query));
    }

    return Promise.all(promisese).then((res) => {
      let data = [];
      forEach(res, (item) => {
        if (item.data[0]) {
          data.push(item.data[0].listing);
        }
      });
      const listing = normalize(data, arrayOf(ListingSchema));

      const result = {
        state : {
          products: listing.entities.listings
        }
      };

      return result;
    });

  }


  getItem(storeId, discountId) {
    let path = `v2/stores/${storeId}/voucher_discounts/${discountId}`;
    return super.get(path, null, config.gateway).then((res) => {
      const voucherDiscount = res.voucher_discount;
      voucherDiscount.discountable_items = map(voucherDiscount.discountable_items, (item) => {
        return pick(item, ['item_type', 'item_id']);
      });

      const voucher = normalize(voucherDiscount, VoucherSchema);

      let productIds = [];
      forEach(voucherDiscount.discountable_items, (item) => {
        productIds.push(item.item_id);
      });

      return this.getAssociateProducts(storeId, productIds).then((res) => {
        const result = {
          state : res.state,
          entities: voucher.entities
        };

        return result;
      });

    });


  }

  createItem(storeId, voucher) {
    let path = `v2/stores/${storeId}/voucher_discounts`;
    return super.post(path, voucher, config.gateway).then((res) => {

      const voucher = normalize(res.voucher_discount, VoucherSchema);

      const result = {
        state : {},
        entities: voucher.entities
      };

      return result;
    }).catch((err) => {
      throw err;
      // return err;
    });

  }

  updateItem(storeId, discountId, data) {
    let path = `v2/stores/${storeId}/voucher_discounts/${discountId}`;


    return super.put(path, data, config.gateway).then((res) => {
      const voucher = normalize(res.voucher_discount, VoucherSchema);

      const result = {
        state : {},
        entities: voucher.entities
      };

      return result;
    });

  }

  removeItem(storeId, discountId) {

    let path = `v2/stores/${storeId}/voucher_discounts/${discountId}`;

    return super.delete(path, null, config.gateway).then((res) => {
      const voucher = normalize(res.voucher_discount, VoucherSchema);

      const result = {
        state : {},
        entities: voucher.entities
      };

      return result;
    });
  }

  getCoupons(storeId, discountId, page, perPage) {
    let path = `v2/stores/${storeId}/discounts/${discountId}/coupons`;

    let query = {
      page: page,
      per_page: perPage,
    };

    return super.get(path, query, config.gateway).then((res) => {

      let criteria = {
        page: res.page,
        count: res.count,
        totalCount: res.totalCount,
        totalPages: res.totalPages,
      };
      //normalize
      res.data.id = parseInt(discountId);
      const vouchers = normalize(res.data, VoucherSchema);

      return {
        state : {
          criteria: criteria,
        },
        entities: vouchers.entities
      };
    });
  }

  putCoupons(storeId, discountId, coupons) {
    let path = `v2/stores/${storeId}/discounts/${discountId}/coupons`;
    return super.put(path, {coupons: [coupons]}, config.gateway);
  }

  deleteCoupon(storeId, discountId, id) {
    let path = `v2/stores/${storeId}/discounts/${discountId}/coupons/${id}`;
    return super.delete(path, null, config.gateway);
  }

  createCouponImport(storeId, discountId, csv, progress = () => {}) {
    let path = `v2/stores/${storeId}/coupon_imports`;
    let data = new FormData();
    data.append('coupon_import[discount_id]', discountId);
    data.append('coupon_import[csv]', csv);
    return super.postFileWProgress(path, data, progress, config.gateway);
  }

  importValidatedCoupon(storeId, couponImportId) {
    let path = `v2/stores/${storeId}/coupon_imports/${couponImportId}/import`;
    return super.post(path, undefined, config.gateway);
  }

  getCouponImport(storeId, couponImportId) {
    let path = `v2/stores/${storeId}/coupon_imports/${couponImportId}`;
    return super.get(path, undefined, config.gateway);
  }
}

export default new VoucherService();
