import { browserHistory } from 'react-router';
import { ROUTE as R } from '~/constants';
import { bindPublicMethod } from './bindHelper';
import concat from 'lodash/concat';
import { default as menuConfig } from '@/config/menu';
import _ from 'lodash';

function join(...args) {
  return `/${args.join('/')}`;
}

function go(target) {
  let keys;
  if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
    keys = Reflect.ownKeys(target.prototype);
  } else {
    keys = Object.getOwnPropertyNames(target.prototype);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      keys = keys.concat(Object.getOwnPropertySymbols(target.prototype));
    }
  }

  keys.forEach(key => {
    if (key === 'constructor') {
      return;
    }
    let func = (target.prototype || {})[key];
    if (typeof func === 'function') {
      let newKey = 'go' + key.charAt(0).toUpperCase() + key.slice(1);
      target.prototype[newKey] = (...args) => browserHistory.push(func(...args));
    }
  });
  return target;
}

function routeAccessor(prefix, subRoutes) {
  return function wrapped(...args) {
    let params = concat(args[0], subRoutes);
    if (args.length > 1) {
      args.shift();
      params = concat(params, args);
    }
    if (prefix) params = concat([prefix], params);
    return join(...params);
  };
}

function configured(target) {
  _.forEach(menuConfig.DEFAULT, item => {
    let { type, subRoute: route1, children, route, prefix } = item;
    if (type === 'link') {
      bindPublicMethod(target, _.camelCase(route), routeAccessor(prefix, [route]));
    }
    if (type === 'menu') {
      children.forEach(child => {
        let { subRoute, children: subChildren } = child;
        let subRoutes = [route1];
        if (subRoute) subRoutes.push(subRoute);
        subChildren.forEach(c => {
          if (c.subRoute) {
            bindPublicMethod(target, _.camelCase(c.subRoute), routeAccessor(c.prefix, concat(subRoutes, [c.subRoute])));
          }
        });
      });
    }
  });

  return target;
}


@go
@configured
class RouteHelper {
  siteIndex() {
    return `/${R.SITE_PREFIX}`;
  }

  login() {
    return join(R.SITE_PREFIX, R.LOGIN);
  }
}


export default new RouteHelper();
