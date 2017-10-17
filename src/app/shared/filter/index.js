export const pick = (iterable, key) => _.map(iterable, d => _.get(d, key)).join(', ')
export const available = val => {
  if (_.isString(val)) return val.length ? val : '-'
  if (_.isNumber(val)) return val
  return val || '-'
}

export default angular
.module('filter', [])
.filter('percentage', ['$filter', function ($filter) {
	'ngInject';
	return function (input, decimals, times) {
		if (isNaN(parseFloat(input))) {
			return input
		}
		times = times || 100
		decimals = decimals || 2
		input = typeof input === "string" ? parseFloat(input) : input;
		return $filter('number')(input * times, decimals) + '%';
	};
}])
.filter('propsFilter', function () {
	return function (items, props) {
		var out = [];

		if (angular.isArray(items)) {
			items.forEach(function (item) {
				var itemMatches = false;

				var keys = Object.keys(props);
				for (var i = 0; i < keys.length; i++) {
					var prop = keys[i];
					var text = props[prop].toLowerCase();
					if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
						itemMatches = true;
						break;
					}
				}

				if (itemMatches) {
					out.push(item);
				}
			});
		} else {
			// Let the output be the input untouched
			out = items;
		}

		return out;
	};
})
.filter('moment', ['DashboardFactory', function (DashboardFactory) {
	'ngInject';
	return function (value) {
		if (!value) {
			return '';
		}
		if (!moment(value).isValid()) {
			return value;
		}

		var store = DashboardFactory.getCurrentStore();
		var timezone = store.timezone;
		var format = DashboardFactory.getCurrentDateFormat();

		var correctedTime;
		if (!moment.tz.needsOffset(moment(value))) {
			correctedTime = moment(value).tz(timezone);
		}
		else {
			correctedTime = moment(value);
		}
		return correctedTime.format(format);
	};
}])
.filter('momentDate', ['DashboardFactory', function (DashboardFactory) {
	'ngInject';
	return function (value) {
		if (!value) {
			return '';
		}
		if (!moment(value).isValid()) {
			return value;
		}
		var store = DashboardFactory.getCurrentStore();
		var timezone = store.timezone;

		var correctedTime;
		if (!moment.tz.needsOffset(moment(value))) {
			correctedTime = moment(value).tz(timezone);
		}
		else {
			correctedTime = moment(value);
		}
		return correctedTime.format('YYYY-MM-DD');
	};
}])
.filter('momentTime', ['DashboardFactory', function (DashboardFactory) {
	'ngInject';
	return function (value) {
		if (!value) {
			return '';
		}
		if (!moment(value).isValid()) {
			return value;
		}
		var store = DashboardFactory.getCurrentStore();
		var timezone = store.timezone;


		var correctedTime;
		if (!moment.tz.needsOffset(moment(value))) {
			correctedTime = moment(value).tz(timezone);
		}
		else {
			correctedTime = moment(value);
		}
		return correctedTime.format('HH:mm:ss');
	};
}])
.filter('timeDurationHour', [function () {
	return function (value) {
		if (typeof value === 'undefined' || value === null) {
			return '';
		}

		var hour = Math.floor(Math.abs(value));
		var min = Math.round(( Math.abs(value) % 1 ) * 60);

		if (hour !== 0 && min === 0) {
			min = '';
			hour = hour + 'hr';
		}
		else {
			min = min + 'min';
			if (hour > 0) {
				hour = hour + 'hr ';
			}
			else {
				hour = '';
			}
		}

		return hour + min;

	};
}])
.filter('titleCase', function () {
	return function (str) {
		return (str === undefined || str === null) ? '' : str.replace(/_|-/g, ' ').replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}
})
.filter('titleCaseWithDash', function () {
	return function (str) {

		return (str === undefined || str === null) ? '' : str.replace(/:/g, ' - ').replace(/_/g, ' ').replace(/\w\S*/g, function (txt) {
			var second_str = txt.substr(1).toLowerCase();
			if (second_str.indexOf('anagerment') != -1) {
				second_str = second_str.replace('anagerment', 'anagement');
			}
			return txt.charAt(0).toUpperCase() + second_str;
		});
	}
})
.filter('slashToDot', function () {
	return function (str) {
		return str.replace(/\//g, '.');
	}
})
.filter('decode', function () {
	return function (value) {
		return decodeURI(value);
	};
})
.filter('quantity', function () {


	return function (amount) {
		// Check undefined
		if (typeof amount === 'number' && amount === Infinity) {
			return 'Unlimited';
		}
		return amount;
	};
})
.filter('myCurrency', function ($filter, DashboardFactory) {
	'ngInject';

	return function (amount, symbol, fractionSize) {
		var mySymbol = DashboardFactory.getStoreCurrency();
		var currencyFilter = $filter('currency');
		symbol = symbol || mySymbol;
		return currencyFilter(amount, symbol, fractionSize);
	};
})
.filter('myCurrencyReport', function($filter, DashboardFactory, reportsFactory){


	return function(amount, symbol, fractionSize){
		var mySymbol = DashboardFactory.getStoreCurrency();
		var currencyFilter = $filter('currency');
		symbol = symbol || mySymbol;
		if ( reportsFactory.showCurrency.value ) {
			return currencyFilter(amount, symbol, fractionSize);
		}
		else {
			if ( typeof amount === 'string' ) {
				amount = Number(amount);
			}
			if ( typeof amount === 'number' && !isNaN(amount) ) {
				return amount.toFixed(2);
			}
			return '';
		}
	};
})
.filter('myCurrencyJson', function ($filter, DashboardFactory) {

	'ngInject';
	return function (amount, member, symbol, fractionSize) {
		var mySymbol = DashboardFactory.getStoreCurrency();
		var currencyFilter = $filter('currency');
		symbol = symbol || mySymbol;

		var newAmount = amount[member];
		return currencyFilter(newAmount, symbol, fractionSize);
	};
})
.filter('myCurrencyNoSymbol', function ($filter, DashboardFactory) {
	'ngInject';
	return function (amount) {
		if (typeof amount === 'string') {
			amount = Number(amount);
		}
		if (typeof amount === 'number' && !isNaN(amount)) {
			return amount.toFixed(2);
		}
		return '';
	};
})
.filter('genderFilterFormatter', function () {

	return function (value) {
		if (typeof value === 'number') {
			if (value === 1) {
				return 'Male'
			}
			else if (value === 2) {
				return 'Female';
			}
			else {
				return 'Unknown';

			}
		}
		else {
			return 'Unknown';
		}
	}
})
.filter('noteFilter', function () {
	return function (note) {
		if (typeof amount === 'string') {
			if (note === '(null)') {
				return ''
			}
			else {
				return note;
			}
		}
		return '';
	};
})
.filter('colorFilter', function () {
	return function (color) {
		if (typeof color !== 'string') {
			return 'transparent';
		}
		else {
			if (color.length < 2) {
				return 'transparent';
			}
			var num = Number(color);
			if (!isNaN(num)) {
				return 'transparent';
			}
			else {
				var bgcolor = w3color(color);
				if (bgcolor.valid) {
					return bgcolor.toHexString();
				}
				else {
					return 'transparent';
				}
			}
		}
	};
})
.filter('purchaseOrderFilter', function () {
	return function (value) {
		if (value === 'pending') {
			value = 'created';
		}
		if (value === 'canceled') {
			value = 'cancelled';
		}

		return (value === undefined || value === null) ? '' : value.replace(/:/g, ' - ').replace(/_/g, ' ').replace(/\w\S*/g, function (txt) {
			var second_str = txt.substr(1).toLowerCase();
			return txt.charAt(0).toUpperCase() + second_str;
		});
	};
})
.filter('pick',() => pick)
.filter('available', () => available)

