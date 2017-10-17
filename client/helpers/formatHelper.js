import Big from 'big.js';
import { findCurrency } from 'currency-formatter';
import moment from 'moment';
import 'moment-timezone/builds/moment-timezone-with-data-2010-2020';
import { bindPublicMethod } from './bindHelper';
import { isNumber } from 'lodash';

export function dateTime(datetime, timezone = 'Asia/Hong_Kong') {
  const d = moment(datetime);
  if (d.isValid()){
    return d.tz(timezone).format('M/D/YYYY, h:mm A');
  }
  return '';
}

/**
 * Format date without timezone, it is useful when you want to
 * format a date string to M/D/YYYY format.
 *
 * @param {string|Date|Moment} date
 * @returns {string}
 *
 * @example
 * date('2016-05-31') // 5/31/2016
 */
export function date(date, asIsoValue) {
  const d = moment(date);
  if (d.isValid()){
    if (asIsoValue) {
      return moment(date).format('M/D/YYYY');
    } else {
      return moment(date).format('YYYY-MM-DD');
    }
  }
  return '';
}

/**
 * Format date with timezone, it is useful when you want to
 * format a ISO datetime string to a local date with M/D/YYYY format.
 *
 * @param {string|Date|Moment} date
 * @param {string} [timezone="Asia/Hong_Kong"]
 * @returns {string}
 *
 * @example
 * dateTz('2016-05-31T18:00:00.000Z', 'Asia/Hong_Kong') // 6/1/2016
 */
export function dateTz(date, timezone = 'Asia/Hong_Kong', asIsoValue) {
  const d = moment(date);
  if (d.isValid()){
    if (asIsoValue) {
      return d.tz(timezone).format('M/D/YYYY');
    } else {
      return d.tz(timezone).format('YYYY-MM-DD');
    }
  }
  return '';
}

/**
 * Format date string to ISO date string
 * @param {string} date
 * @param {string} [timezone="Asia/Hong_Kong"]
 * @returns {string}
 *
 * @example
 * dateToIso('2016-05-31', 'America/new_york') // 2016-05-31T00:00:00-04:00
 */
export function dateToIso(date, timezone = 'Asia/Hong_Kong') {
  const d = moment.tz(date, timezone);
  return d.isValid() ? d.format() : '';
}

export const dateTimeFormatter = (WrappedComponent) => {
  function formatter(data) {
    let timezone = this.context.currentStore && this.context.currentStore.timezone;
    return dateTime(data, timezone);
  }
  return bindPublicMethod(WrappedComponent, 'dateTime', formatter);
};

/**
 * @typedef {object} NumberMaskDecoded
 *
 * @property {boolean} valid     Given string is a valid format number or not
 * @property {object}  match     Matching components of the format
 * @property {string}  mask      The given mask
 * @property {string}  formatted Formatted number string
 * @property {Big}     value     The number value
 */

/**
 * Decode number string in specific format
 *
 * @param {string}  mask
 * @param {object}  [format]                 The number format config
 * @param {number}  [format.dp]              The decimal points
 * @param {string}  [format.prefix]          The prefix string
 * @param {string}  [format.suffix]          The suffix string
 * @param {boolean} [format.signAfterPrefix] The sign should place after prefix
 *
 * @return {NumberMaskDecoded}
 */
export function decodeNumberMask(mask, format = {}) {
  const { dp = 2, prefix = '', suffix = '', signAfterPrefix = false } = format;
  const prefixRegexp = prefix.replace(/(\W)/g, '\\$1');
  const suffixRegexp = suffix.replace(/(\W)/g, '\\$1');
  const regexp = RegExp('^(-)?(' + prefixRegexp + ')?(-)?(\\d+(,\\d+)*)?(\\.)?(\\d*)(' + suffixRegexp + ')?$');
  let [
    matchStr,
    matchNe1 = '',
    matchPrefix = '',
    matchNe2 = '',
    matchDigit = '',
    matchIgnore,
    matchDot = '',
    matchDecimal = '',
    matchSuffix = '',
  ] = mask.match(regexp) || [];
  const valid = !!matchStr;

  if (valid) {
    let matchDecimalFormatted = Array(dp).fill('0').join('');
    if (matchDecimal !== '') {
      matchSuffix = suffix;
      matchDigit = (matchDigit || '0');
      matchDecimal = matchDecimal.substr(0, dp);
      matchDecimalFormatted = (matchDecimal + matchDecimalFormatted).substr(0, dp);
    }

    if (matchDigit !== '') {
      matchPrefix = prefix;
      matchDigit = matchDigit.replace(/,/g, '').replace(/^0*/, '');
      matchDigit = (matchDigit || '0').split('').reverse().reduce((ret, d, i, ary) => {
        if (i !== 0 && i % 3 == 0) {
          ret.push(',');
        }
        ret.push(d);
        return ret;
      }, []).reverse().join('');
    }
    const match = {
      matchStr,
      matchNe1,
      matchPrefix,
      matchNe2,
      matchDigit,
      matchIgnore,
      matchDot,
      matchDecimal,
      matchDecimalFormatted,
      matchSuffix,
    };
    const newMask = matchNe1 + matchPrefix + matchNe2 + matchDigit + matchDot + matchDecimal + matchSuffix;
    const newMaskFormatted = (signAfterPrefix ? '' : matchNe1 + matchNe2) + prefix + (signAfterPrefix ? matchNe1 + matchNe2 : '') + matchDigit + (dp > 0 ? '.' + matchDecimalFormatted : '') + suffix;
    const newValue = Big(matchNe1 + matchNe2 + (matchDigit.split(',').join('') || '0') + (matchDot || '.') + matchDecimal || '0');
    return {
      valid,
      match,
      mask: newMask,
      formatted: newMaskFormatted,
      value: newValue,
    };
  } else {
    return { valid };
  }
}

/**
 * Format number in given format
 *
 * @param {number|string|Big} number                   The given number
 * @param {object}            [format]                 The number format config
 * @param {number}            [format.dp]              The decimal points
 * @param {string}            [format.prefix]          The prefix string
 * @param {string}            [format.suffix]          The suffix string
 * @param {boolean}           [format.signAfterPrefix] The sign should place after prefix
 *
 * @return {string}
 */
export function formatNumber(number, format = {}) {
  const decoded = decodeNumberMask(Big(number || 0).toString(), format);
  return decoded.valid ? decoded.formatted : '';
}

export function currencySymbol(currency = 'HKD') {
  return currency === 'HKD' ? '$' : findCurrency(currency).symbol;
}

/**
 * Format number in given format
 *
 * @param {number|string|Big} number                   The given number
 * @param {object}            [format]                 The number format config
 * @param {number}            [format.dp]              The decimal points
 * @param {string}            [format.currency]        The currency code, eg. HKD, USD
 * @param {boolean}           [format.signAfterPrefix] The sign should place after prefix
 *
 * @return {string}
 */
export function formatCurrency(number, format = {}) {
  const { currency = 'HKD', ...cfg } = format;
  const prefix = currencySymbol(currency);
  return formatNumber(number, { prefix, ...cfg });
}

export function decimal(value) {
  return isNumber(value) ? new Intl.NumberFormat().format(value) : '';
}

/**
 * Format string to lower case
 *
 * @param {string} string The given string
 *
 * @return {string}
 */
export function lowercase(string) {
  const str = string || '';
  return str.toLowerCase();
}
