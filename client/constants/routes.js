
import { default as menuConfig }  from '@/config/menu';
import _ from 'lodash';

const makeKey = _.flow([_.snakeCase, _.toUpper]);

let ROUTE = {
  SITE_PREFIX: 'v2',
  LOGIN: 'login',
  INVOICES: 'invoices',
  QUOTES: 'quotes',
  DELIVERY_NOTE: 'delivery-note',
  PRODUCTION_ORDERS: 'production-orders',
  PROMO_CODES: 'promo-codes',
  INVENTORY_VARIANCE: 'inventory-variance',
  LINE_ITEM_STATUS_SET_UP: 'line-item-status-set-up',
  WORK_FLOW_SET_UP: 'workflow-set-up',
};

_.forEach(menuConfig.DEFAULT, item => {
  let { type, subRoute, children, route } = item;
  if (type === 'link' || type === 'menu') {
    let partial = subRoute || route;
    _.set(ROUTE, makeKey(partial), partial);
  }
  if (Array.isArray(children)) {
    children.forEach(child => {
      let { subRoute, children: subChildren } = child;
      if (subRoute) _.set(ROUTE, makeKey(subRoute), subRoute);
      subChildren.forEach(c => {
        if (c.subRoute) _.set(ROUTE, makeKey(c.subRoute), c.subRoute);
      });
    });
  }
});

export default ROUTE;
