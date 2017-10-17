export function DashboardFactory(currencymap, $q, $rootScope, $http, $filter, $locale) {
  'ngInject';
  var _all = [];

  // JUST FOR SINGLE STORE MODE
  var getStoreId = function () {

    var store_id = null;
    if ($rootScope.currentStores && $rootScope.currentStores.length > 0){
      store_id = $rootScope.currentStores[0].id;
      $locale.NUMBER_FORMATS.CURRENCY_SYM = getStoreCurrency();
    }
    return store_id;

  };


  // Should be able to set the date format
  var getCurrentDateFormat = function (){
    return 'M/D/YYYY, h:mm:ss A';
  };

  //Should be able to set the date format
  var getCurrentSimpleDateFormat = function (){
    return 'M/D/YYYY';
  };

  var getCurrentStore = function () {
    try {
      return $rootScope.currentStores[0];

    } catch (e) {
      return null;
    }
  };

  var getStoreSlug = function () {
    try {
      return getCurrentStore().slug;

    } catch (e) {
      return null;
    }
  };


  // JUST FOR MULTI-STORE MODE
  var getCurrentStores = function () {
    var stores = [];
    _.each($rootScope.currentStores, function (store, i) {
      if (store._children) {
        _.each(store._children, function (s, i) {
          stores.push(s);
        });
      } else {
        stores.push(store);
      }
    });
    return _.uniq(stores);
  };
  var getStoreIds = function () {
    var ids = [];
    _.each($rootScope.currentStores, function (store, i) {
      if (store._children) {
        _.each(store._children, function (s, i) {
          ids.push(s.id);
        });
      } else {
        ids.push(store.id);
      }
    });
    return _.uniq(ids);
  };
  var findById = function (id) {

    var foundStore = _.find(_all, {id: id });

    if (foundStore){
      return foundStore;
    }
    else {
      foundStore = _.find(_all, {id: Number(id) });
      if (foundStore){
        return foundStore;
      }
      else {
        return null;
      }
    }
  };
  var isMultiStore = function () {
    var selectedMultiStore = false;

    if ($rootScope.selectedStoresId && $rootScope.selectedStoresId.length > 1) {
      selectedMultiStore = true;
    }

    return selectedMultiStore;
  };

  var getStores = function () {
    var promise = $http.get($rootScope.api + '/api/v2/stores?per_page=99', { cache: true });

    promise.then(function (res) {
      _all = _.map(res.data, function (item){return item.store;});
    });

    return promise;
  };

  var getStoreSetting = function (storeId) {
    storeId = storeId || getStoreId();
    return $http.get($rootScope.api + '/api/v1/stores/' + storeId+ '/module', { cache: true });
  };

  var getStorePermission = function (storeId) {
    storeId = storeId || getStoreId();
    return $http.get($rootScope.api + '/api/v2/stores/' + storeId + '/store_permissions');
  };

  var profetch = function (type, storeId, datacallback, per_page, extraParam){
    var deferred = $q.defer();
    storeId = storeId || getStoreId();
    var alldata = [];
    var page = 1;
    var fetch = function () {

      var url = $rootScope.api + '/api/v2/stores/' + storeId + '/'+type+'?per_page='+per_page+'&page='+page;
      if (extraParam){
        url = url + extraParam;
      }

      $http
        .get(url, {cache: false})
        .success(function (data, status, headerFunc, xhr) {
          var link = headerFunc('Link');

          var header = JSON.parse(headerFunc('Link'));
          var parsedData = datacallback(data);
          alldata = alldata.concat(parsedData);
          if (header && page < header.total_pages) {
            page++;
            fetch();
          }
          else if (!header || page === header.total_pages) {
            deferred.resolve(alldata);
          }
          else {
            deferred.resolve([]);
          }
        })
        .error(function (err) {
          deferred.resolve([]);
        });
    };
    fetch();
    return deferred.promise;
  };

  var getCustomers = function (storeId) {

    var datacallback = function (data) {
      return _.map(data, function (item) { return item.customer; });
    };
    return profetch('customers', storeId, datacallback, 5000);
  };

  var getCustomerGroup = function (storeId){

    var datacallback = function (data) {
      return _.map(data, function (item) { return item.customer; });
    };
    return profetch('customer_groups', storeId, datacallback, 100);
  };

  var getSuppliers = function (storeId) {

    var datacallback = function (data) {
      return _.map(data, function (item) {return item.supplier;});
    };
    return profetch('suppliers', storeId, datacallback, 100);
  };

  var getBrands = function (storeId) {

    var datacallback = function (data) {
      return _.map(data, function (item) {return item.brand;});
    };
    return profetch('brands', storeId, datacallback, 100);
  };

  var getAttributes = function (storeId) {
    var datacallback = function (data) {
      return data.custom_fields;
    };
    return profetch('custom_fields', storeId, datacallback, 100);
  };

  var getCategories = function (storeId) {
    var datacallback = function (data) {
      return _.map(data, function (item) { return item.category; });
    };
    return profetch('categories', storeId, datacallback, 100);
  };

  var getUnitGroups = function (storeId) {
    var datacallback = function (data) {
      return data.unit_groups;
    };
    return profetch('unit_groups', storeId, datacallback, 100);
  };

  var getModifierGroups = function () {
    /*
     var datacallback = function (data) {
     return _.map(data, function(item) { return item.category; });
     };
     return profetch('modifier_groups', storeId, datacallback, 100);
     */
    return $http.get($rootScope.api + '/api/v2/stores/' + getStoreId() + '/modifier_groups?per_page=999999');
  };


  var getDiscounts = function (storeId) {
    /*

     var datacallback = function (data) {
     return _.map(data, function(item) { return item.discount; });
     };
     return profetch('discounts', storeId, datacallback, 100, '&order_by=priority' );
     */
    var defer = $q.defer();
    $http.get($rootScope.gateway + '/v2/stores/' + storeId + '/discounts?order_by=priority&per_page=999999&page=1').then(function (data){
      var discounts = data.data;
      var newdata = _.map(discounts,function (discount){
        return discount.discount;
      });
      defer.resolve(newdata);
    });
    return defer.promise;
  };

  var getTaxOptions = function (storeId) {

    var datacallback = function (data) {
      var options = _.map(data, function (item) {
        return item.tax_option;
      });
      _.each (options, function (value){
        value.display =  value.name + ' ('+ $filter('percentage')(value.tax_rate) + ')';
      });
      return options;
    };
    return profetch('tax_options', storeId, datacallback, 100);
  };

  var getDepartments = function (storeId) {
    var datacallback = function (data) {
      return _.map(data, function (item) { return item.department; });
    };
    return profetch('departments', storeId, datacallback, 100);
  };

  var getAssociates = function (storeId) {
    var datacallback = function (data) {
      return _.map(data, function (item) { return item.user; });
    };
    return profetch('associates', storeId, datacallback, 100);
  };


  // this is slow as fukk dude
  var getListings = function () {
    var chain = '';
    if (getCurrentStore().chain){
      chain = 'chain=1&unique_prod=true&';
    }
    return $http.get($rootScope.api + '/api/v2/stores/' + getStoreId() + '/listings?'+chain+'per_page=999999', { cache: true });
  };



  var searchListings = function (keyword, storeId) {
    storeId = storeId || getStoreId();
    var slug = findById(storeId).slug;
    var chain = '';
    if (getCurrentStore().chain){
      chain = 'chain=1&unique_prod=true&';
    }
    return $http.get($rootScope.BindoAPI + '/stores/' + slug + '/listings?'+chain+'include_in_store_only=true&per_page=999999&name=' + keyword, {
      cache: true,
      headers: {
        Accept:'application/vnd.bindo-v201501+json'
      }
    });
  };

  var searchProductsByName = function (keyword, storeId) {
    storeId = storeId || getStoreId();
    var slug = findById(storeId).slug;
    var chain = '';
    if (getCurrentStore().chain){
      chain = 'chain=1&unique_prod=true&';
    }
    return $http.get($rootScope.api + '/api/v2/stores/' + storeId + '/listings?'+chain+'per_page=999999&filters[]=products.name__contain__' + keyword, {
      cache: true,
      headers: {
        Accept:'application/vnd.bindo-v201501+json'
      }
    });
  };

  var searchProductsById = function (id, storeId) {
    storeId = storeId || getStoreId();
    var slug = findById(storeId).slug;
    var chain = '';
    if (getCurrentStore().chain){
      chain = 'chain=1&unique_prod=true&';
    }
    return $http.get($rootScope.api + '/api/v2/stores/' + storeId + '/listings?'+chain+'filters[]=products.id__equal__' + id, {
      cache: true,
      headers: {
        Accept:'application/vnd.bindo-v201501+json'
      }
    });
  };

  var searchListingByID = function (id, storeId) {
    storeId = storeId || getStoreId();
    var deferred = $q.defer();
    var chain = '';
    if (getCurrentStore().chain){
      chain = '?chain=1&unique_prod=true';
    }
    $http.get($rootScope.api + '/api/v2/stores/' + storeId + '/listings/'+ id + chain).then(function (data){
      deferred.resolve(data.data);
    },function (err){
      deferred.reject(err);
    });

    return deferred.promise;
  };

  var searchListingsByBarcode = function (barcode, storeId, page) {

    var deferred = $q.defer();
    storeId = storeId || getStoreId();
    page = page || '1';
    let isExactMatch = false;
    let bcode = barcode;
    let typeOfCodeToSearch = ['upc', 'listings.listing_barcode', 'products.bpid'];
    if (/^BP-.+/i.test(bcode)){
      isExactMatch = true;
      bcode = bcode.slice(3);
      typeOfCodeToSearch = ['products.bpid'];
    }

    var promises = typeOfCodeToSearch.map(type => {
      const condition = isExactMatch ? 'contain' : 'contain';
      const url = `${$rootScope.api}/api/v2/stores/${storeId}/listings?filters[]=${type}__${condition}__${bcode}&order_by=name&page=${page}&per_page=25`;
      return $http({
        url,
        method: 'GET',
      });
    });

    $q.all(promises)
      .then(function (data) {
        const newItemsHash = data.reduce((hash, item) => {
          item.data.forEach(d => {
            hash[d.listing.id] = d;
          });
          return hash;
        }, {});
        const newItems = Object.keys(newItemsHash).map(k => newItemsHash[k]);
        deferred.resolve(newItems);
      });



    return deferred.promise;
  };

  var searchListingsOld = function (keyword, storeId) {
    storeId = storeId || getStoreId();
    return $http.get($rootScope.api + '/api/v2/stores/' + storeId + '/listings?per_page=25&filters[]=name__contain__' + keyword, { cache: true });
  };

  var searchListingID = function (id, storeId) {
    storeId = storeId || getStoreId();
    var deferred = $q.defer();

    $http.get($rootScope.api + '/api/v2/stores/' + storeId + '/listings?page=1&per_page=25&order_by=name&filters[]=product_id__equal__'+ id, { cache: true }).then(function (data){
      deferred.resolve(data.data);
    },function (err){
      deferred.reject(err);
    });

    return deferred.promise;
  };


  var languages_by_locale = {
    af_NA: "Afrikaans (Namibia)",
    af_ZA: "Afrikaans (South Africa)",
    af: "Afrikaans",
    ak_GH: "Akan (Ghana)",
    ak: "Akan",
    sq_AL: "Albanian (Albania)",
    sq: "Albanian",
    am_ET: "Amharic (Ethiopia)",
    am: "Amharic",
    ar_DZ: "Arabic (Algeria)",
    ar_BH: "Arabic (Bahrain)",
    ar_EG: "Arabic (Egypt)",
    ar_IQ: "Arabic (Iraq)",
    ar_JO: "Arabic (Jordan)",
    ar_KW: "Arabic (Kuwait)",
    ar_LB: "Arabic (Lebanon)",
    ar_LY: "Arabic (Libya)",
    ar_MA: "Arabic (Morocco)",
    ar_OM: "Arabic (Oman)",
    ar_QA: "Arabic (Qatar)",
    ar_SA: "Arabic (Saudi Arabia)",
    ar_SD: "Arabic (Sudan)",
    ar_SY: "Arabic (Syria)",
    ar_TN: "Arabic (Tunisia)",
    ar_AE: "Arabic (United Arab Emirates)",
    ar_YE: "Arabic (Yemen)",
    ar: "Arabic",
    hy_AM: "Armenian (Armenia)",
    hy: "Armenian",
    as_IN: "Assamese (India)",
    as: "Assamese",
    asa_TZ: "Asu (Tanzania)",
    asa: "Asu",
    az_Cyrl: "Azerbaijani (Cyrillic)",
    az_Cyrl_AZ: "Azerbaijani (Cyrillic, Azerbaijan)",
    az_Latn: "Azerbaijani (Latin)",
    az_Latn_AZ: "Azerbaijani (Latin, Azerbaijan)",
    az: "Azerbaijani",
    bm_ML: "Bambara (Mali)",
    bm: "Bambara",
    eu_ES: "Basque (Spain)",
    eu: "Basque",
    be_BY: "Belarusian (Belarus)",
    be: "Belarusian",
    bem_ZM: "Bemba (Zambia)",
    bem: "Bemba",
    bez_TZ: "Bena (Tanzania)",
    bez: "Bena",
    bn_BD: "Bengali (Bangladesh)",
    bn_IN: "Bengali (India)",
    bn: "Bengali",
    bs_BA: "Bosnian (Bosnia and Herzegovina)",
    bs: "Bosnian",
    bg_BG: "Bulgarian (Bulgaria)",
    bg: "Bulgarian",
    my_MM: "Burmese (Myanmar [Burma])",
    my: "Burmese",
    ca_ES: "Catalan (Spain)",
    ca: "Catalan",
    tzm_Latn: "Central Morocco Tamazight (Latin)",
    tzm_Latn_MA: "Central Morocco Tamazight (Latin, Morocco)",
    tzm: "Central Morocco Tamazight",
    chr_US: "Cherokee (United States)",
    chr: "Cherokee",
    cgg_UG: "Chiga (Uganda)",
    cgg: "Chiga",
    zh_Hans: "Chinese (Simplified Han)",
    zh_Hans_CN: "Chinese (Simplified Han, China)",
    zh_Hans_HK: "Chinese (Simplified Han, Hong Kong SAR China)",
    zh_Hans_MO: "Chinese (Simplified Han, Macau SAR China)",
    zh_Hans_SG: "Chinese (Simplified Han, Singapore)",
    zh_Hant: "Chinese (Traditional Han)",
    zh_Hant_HK: "Chinese (Traditional Han, Hong Kong SAR China)",
    zh_Hant_MO: "Chinese (Traditional Han, Macau SAR China)",
    zh_Hant_TW: "Chinese (Traditional Han, Taiwan)",
    zh: "Chinese",
    kw_GB: "Cornish (United Kingdom)",
    kw: "Cornish",
    hr_HR: "Croatian (Croatia)",
    hr: "Croatian",
    cs_CZ: "Czech (Czech Republic)",
    cs: "Czech",
    da_DK: "Danish (Denmark)",
    da: "Danish",
    nl_BE: "Dutch (Belgium)",
    nl_NL: "Dutch (Netherlands)",
    nl: "Dutch",
    ebu_KE: "Embu (Kenya)",
    ebu: "Embu",
    en_AS: "English (American Samoa)",
    en_AU: "English (Australia)",
    en_BE: "English (Belgium)",
    en_BZ: "English (Belize)",
    en_BW: "English (Botswana)",
    en_CA: "English (Canada)",
    en_GU: "English (Guam)",
    en_HK: "English (Hong Kong SAR China)",
    en_IN: "English (India)",
    en_IE: "English (Ireland)",
    en_JM: "English (Jamaica)",
    en_MT: "English (Malta)",
    en_MH: "English (Marshall Islands)",
    en_MU: "English (Mauritius)",
    en_NA: "English (Namibia)",
    en_NZ: "English (New Zealand)",
    en_MP: "English (Northern Mariana Islands)",
    en_PK: "English (Pakistan)",
    en_PH: "English (Philippines)",
    en_SG: "English (Singapore)",
    en_ZA: "English (South Africa)",
    en_TT: "English (Trinidad and Tobago)",
    en_UM: "English (U.S. Minor Outlying Islands)",
    en_VI: "English (U.S. Virgin Islands)",
    en_GB: "English (United Kingdom)",
    en_US: "English (United States)",
    en_ZW: "English (Zimbabwe)",
    en: "English",
    eo: "Esperanto",
    et_EE: "Estonian (Estonia)",
    et: "Estonian",
    ee_GH: "Ewe (Ghana)",
    ee_TG: "Ewe (Togo)",
    ee: "Ewe",
    fo_FO: "Faroese (Faroe Islands)",
    fo: "Faroese",
    fil_PH: "Filipino (Philippines)",
    fil: "Filipino",
    fi_FI: "Finnish (Finland)",
    fi: "Finnish",
    fr_BE: "French (Belgium)",
    fr_BJ: "French (Benin)",
    fr_BF: "French (Burkina Faso)",
    fr_BI: "French (Burundi)",
    fr_CM: "French (Cameroon)",
    fr_CA: "French (Canada)",
    fr_CF: "French (Central African Republic)",
    fr_TD: "French (Chad)",
    fr_KM: "French (Comoros)",
    fr_CG: "French (Congo - Brazzaville)",
    fr_CD: "French (Congo - Kinshasa)",
    fr_CI: "French (Côte d’Ivoire)",
    fr_DJ: "French (Djibouti)",
    fr_GQ: "French (Equatorial Guinea)",
    fr_FR: "French (France)",
    fr_GA: "French (Gabon)",
    fr_GP: "French (Guadeloupe)",
    fr_GN: "French (Guinea)",
    fr_LU: "French (Luxembourg)",
    fr_MG: "French (Madagascar)",
    fr_ML: "French (Mali)",
    fr_MQ: "French (Martinique)",
    fr_MC: "French (Monaco)",
    fr_NE: "French (Niger)",
    fr_RW: "French (Rwanda)",
    fr_RE: "French (Réunion)",
    fr_BL: "French (Saint Barthélemy)",
    fr_MF: "French (Saint Martin)",
    fr_SN: "French (Senegal)",
    fr_CH: "French (Switzerland)",
    fr_TG: "French (Togo)",
    fr: "French",
    ff_SN: "Fulah (Senegal)",
    ff: "Fulah",
    gl_ES: "Galician (Spain)",
    gl: "Galician",
    lg_UG: "Ganda (Uganda)",
    lg: "Ganda",
    ka_GE: "Georgian (Georgia)",
    ka: "Georgian",
    de_AT: "German (Austria)",
    de_BE: "German (Belgium)",
    de_DE: "German (Germany)",
    de_LI: "German (Liechtenstein)",
    de_LU: "German (Luxembourg)",
    de_CH: "German (Switzerland)",
    de: "German",
    el_CY: "Greek (Cyprus)",
    el_GR: "Greek (Greece)",
    el: "Greek",
    gu_IN: "Gujarati (India)",
    gu: "Gujarati",
    guz_KE: "Gusii (Kenya)",
    guz: "Gusii",
    ha_Latn: "Hausa (Latin)",
    ha_Latn_GH: "Hausa (Latin, Ghana)",
    ha_Latn_NE: "Hausa (Latin, Niger)",
    ha_Latn_NG: "Hausa (Latin, Nigeria)",
    ha: "Hausa",
    haw_US: "Hawaiian (United States)",
    haw: "Hawaiian",
    he_IL: "Hebrew (Israel)",
    he: "Hebrew",
    hi_IN: "Hindi (India)",
    hi: "Hindi",
    hu_HU: "Hungarian (Hungary)",
    hu: "Hungarian",
    is_IS: "Icelandic (Iceland)",
    is: "Icelandic",
    ig_NG: "Igbo (Nigeria)",
    ig: "Igbo",
    id_ID: "Indonesian (Indonesia)",
    id: "Indonesian",
    ga_IE: "Irish (Ireland)",
    ga: "Irish",
    it_IT: "Italian (Italy)",
    it_CH: "Italian (Switzerland)",
    it: "Italian",
    ja_JP: "Japanese (Japan)",
    ja: "Japanese",
    kea_CV: "Kabuverdianu (Cape Verde)",
    kea: "Kabuverdianu",
    kab_DZ: "Kabyle (Algeria)",
    kab: "Kabyle",
    kl_GL: "Kalaallisut (Greenland)",
    kl: "Kalaallisut",
    kln_KE: "Kalenjin (Kenya)",
    kln: "Kalenjin",
    kam_KE: "Kamba (Kenya)",
    kam: "Kamba",
    kn_IN: "Kannada (India)",
    kn: "Kannada",
    kk_Cyrl: "Kazakh (Cyrillic)",
    kk_Cyrl_KZ: "Kazakh (Cyrillic, Kazakhstan)",
    kk: "Kazakh",
    km_KH: "Khmer (Cambodia)",
    km: "Khmer",
    ki_KE: "Kikuyu (Kenya)",
    ki: "Kikuyu",
    rw_RW: "Kinyarwanda (Rwanda)",
    rw: "Kinyarwanda",
    kok_IN: "Konkani (India)",
    kok: "Konkani",
    ko_KR: "Korean (South Korea)",
    ko: "Korean",
    khq_ML: "Koyra Chiini (Mali)",
    khq: "Koyra Chiini",
    ses_ML: "Koyraboro Senni (Mali)",
    ses: "Koyraboro Senni",
    lag_TZ: "Langi (Tanzania)",
    lag: "Langi",
    lv_LV: "Latvian (Latvia)",
    lv: "Latvian",
    lt_LT: "Lithuanian (Lithuania)",
    lt: "Lithuanian",
    luo_KE: "Luo (Kenya)",
    luo: "Luo",
    luy_KE: "Luyia (Kenya)",
    luy: "Luyia",
    mk_MK: "Macedonian (Macedonia)",
    mk: "Macedonian",
    jmc_TZ: "Machame (Tanzania)",
    jmc: "Machame",
    kde_TZ: "Makonde (Tanzania)",
    kde: "Makonde",
    mg_MG: "Malagasy (Madagascar)",
    mg: "Malagasy",
    ms_BN: "Malay (Brunei)",
    ms_MY: "Malay (Malaysia)",
    ms: "Malay",
    ml_IN: "Malayalam (India)",
    ml: "Malayalam",
    mt_MT: "Maltese (Malta)",
    mt: "Maltese",
    gv_GB: "Manx (United Kingdom)",
    gv: "Manx",
    mr_IN: "Marathi (India)",
    mr: "Marathi",
    mas_KE: "Masai (Kenya)",
    mas_TZ: "Masai (Tanzania)",
    mas: "Masai",
    mer_KE: "Meru (Kenya)",
    mer: "Meru",
    mfe_MU: "Morisyen (Mauritius)",
    mfe: "Morisyen",
    naq_NA: "Nama (Namibia)",
    naq: "Nama",
    ne_IN: "Nepali (India)",
    ne_NP: "Nepali (Nepal)",
    ne: "Nepali",
    nd_ZW: "North Ndebele (Zimbabwe)",
    nd: "North Ndebele",
    nb_NO: "Norwegian Bokmål (Norway)",
    nb: "Norwegian Bokmål",
    nn_NO: "Norwegian Nynorsk (Norway)",
    nn: "Norwegian Nynorsk",
    nyn_UG: "Nyankole (Uganda)",
    nyn: "Nyankole",
    or_IN: "Oriya (India)",
    or: "Oriya",
    om_ET: "Oromo (Ethiopia)",
    om_KE: "Oromo (Kenya)",
    om: "Oromo",
    ps_AF: "Pashto (Afghanistan)",
    ps: "Pashto",
    fa_AF: "Persian (Afghanistan)",
    fa_IR: "Persian (Iran)",
    fa: "Persian",
    pl_PL: "Polish (Poland)",
    pl: "Polish",
    pt_BR: "Portuguese (Brazil)",
    pt_GW: "Portuguese (Guinea-Bissau)",
    pt_MZ: "Portuguese (Mozambique)",
    pt_PT: "Portuguese (Portugal)",
    pt: "Portuguese",
    pa_Arab: "Punjabi (Arabic)",
    pa_Arab_PK: "Punjabi (Arabic, Pakistan)",
    pa_Guru: "Punjabi (Gurmukhi)",
    pa_Guru_IN: "Punjabi (Gurmukhi, India)",
    pa: "Punjabi",
    ro_MD: "Romanian (Moldova)",
    ro_RO: "Romanian (Romania)",
    ro: "Romanian",
    rm_CH: "Romansh (Switzerland)",
    rm: "Romansh",
    rof_TZ: "Rombo (Tanzania)",
    rof: "Rombo",
    ru_MD: "Russian (Moldova)",
    ru_RU: "Russian (Russia)",
    ru_UA: "Russian (Ukraine)",
    ru: "Russian",
    rwk_TZ: "Rwa (Tanzania)",
    rwk: "Rwa",
    saq_KE: "Samburu (Kenya)",
    saq: "Samburu",
    sg_CF: "Sango (Central African Republic)",
    sg: "Sango",
    seh_MZ: "Sena (Mozambique)",
    seh: "Sena",
    sr_Cyrl: "Serbian (Cyrillic)",
    sr_Cyrl_BA: "Serbian (Cyrillic, Bosnia and Herzegovina)",
    sr_Cyrl_ME: "Serbian (Cyrillic, Montenegro)",
    sr_Cyrl_RS: "Serbian (Cyrillic, Serbia)",
    sr_Latn: "Serbian (Latin)",
    sr_Latn_BA: "Serbian (Latin, Bosnia and Herzegovina)",
    sr_Latn_ME: "Serbian (Latin, Montenegro)",
    sr_Latn_RS: "Serbian (Latin, Serbia)",
    sr: "Serbian",
    sn_ZW: "Shona (Zimbabwe)",
    sn: "Shona",
    ii_CN: "Sichuan Yi (China)",
    ii: "Sichuan Yi",
    si_LK: "Sinhala (Sri Lanka)",
    si: "Sinhala",
    sk_SK: "Slovak (Slovakia)",
    sk: "Slovak",
    sl_SI: "Slovenian (Slovenia)",
    sl: "Slovenian",
    xog_UG: "Soga (Uganda)",
    xog: "Soga",
    so_DJ: "Somali (Djibouti)",
    so_ET: "Somali (Ethiopia)",
    so_KE: "Somali (Kenya)",
    so_SO: "Somali (Somalia)",
    so: "Somali",
    es_AR: "Spanish (Argentina)",
    es_BO: "Spanish (Bolivia)",
    es_CL: "Spanish (Chile)",
    es_CO: "Spanish (Colombia)",
    es_CR: "Spanish (Costa Rica)",
    es_DO: "Spanish (Dominican Republic)",
    es_EC: "Spanish (Ecuador)",
    es_SV: "Spanish (El Salvador)",
    es_GQ: "Spanish (Equatorial Guinea)",
    es_GT: "Spanish (Guatemala)",
    es_HN: "Spanish (Honduras)",
    es_419: "Spanish (Latin America)",
    es_MX: "Spanish (Mexico)",
    es_NI: "Spanish (Nicaragua)",
    es_PA: "Spanish (Panama)",
    es_PY: "Spanish (Paraguay)",
    es_PE: "Spanish (Peru)",
    es_PR: "Spanish (Puerto Rico)",
    es_ES: "Spanish (Spain)",
    es_US: "Spanish (United States)",
    es_UY: "Spanish (Uruguay)",
    es_VE: "Spanish (Venezuela)",
    es: "Spanish",
    sw_KE: "Swahili (Kenya)",
    sw_TZ: "Swahili (Tanzania)",
    sw: "Swahili",
    sv_FI: "Swedish (Finland)",
    sv_SE: "Swedish (Sweden)",
    sv: "Swedish",
    gsw_CH: "Swiss German (Switzerland)",
    gsw: "Swiss German",
    shi_Latn: "Tachelhit (Latin)",
    shi_Latn_MA: "Tachelhit (Latin, Morocco)",
    shi_Tfng: "Tachelhit (Tifinagh)",
    shi_Tfng_MA: "Tachelhit (Tifinagh, Morocco)",
    shi: "Tachelhit",
    dav_KE: "Taita (Kenya)",
    dav: "Taita",
    ta_IN: "Tamil (India)",
    ta_LK: "Tamil (Sri Lanka)",
    ta: "Tamil",
    te_IN: "Telugu (India)",
    te: "Telugu",
    teo_KE: "Teso (Kenya)",
    teo_UG: "Teso (Uganda)",
    teo: "Teso",
    th_TH: "Thai (Thailand)",
    th: "Thai",
    bo_CN: "Tibetan (China)",
    bo_IN: "Tibetan (India)",
    bo: "Tibetan",
    ti_ER: "Tigrinya (Eritrea)",
    ti_ET: "Tigrinya (Ethiopia)",
    ti: "Tigrinya",
    to_TO: "Tonga (Tonga)",
    to: "Tonga",
    tr_TR: "Turkish (Turkey)",
    tr: "Turkish",
    uk_UA: "Ukrainian (Ukraine)",
    uk: "Ukrainian",
    ur_IN: "Urdu (India)",
    ur_PK: "Urdu (Pakistan)",
    ur: "Urdu",
    uz_Arab: "Uzbek (Arabic)",
    uz_Arab_AF: "Uzbek (Arabic, Afghanistan)",
    uz_Cyrl: "Uzbek (Cyrillic)",
    uz_Cyrl_UZ: "Uzbek (Cyrillic, Uzbekistan)",
    uz_Latn: "Uzbek (Latin)",
    uz_Latn_UZ: "Uzbek (Latin, Uzbekistan)",
    uz: "Uzbek",
    vi_VN: "Vietnamese (Vietnam)",
    vi: "Vietnamese",
    vun_TZ: "Vunjo (Tanzania)",
    vun: "Vunjo",
    cy_GB: "Welsh (United Kingdom)",
    cy: "Welsh",
    yo_NG: "Yoruba (Nigeria)",
    yo: "Yoruba",
    zu_ZA: "Zulu (South Africa)",
    zu: "Zulu"
  };


  var languages_by_locale_lower = {};
  for (var key in languages_by_locale){
    var keylower = key.toLowerCase();
    languages_by_locale_lower[keylower] = languages_by_locale[key];
  }



  var getLocales = function (storeId) {
    storeId = storeId || getStoreId();

    var deferred = $q.defer();

    $http
      .get($rootScope.api + '/api/v2/stores/' + storeId + '/store_locales?per_page=999999', { cache: true })
      .success(function (data) {
        deferred.resolve(_.map(data.store_locales,function (locale){
          locale.language = languages_by_locale_lower[locale.locale];
          return locale;
        }));
      })
      .error(function (err) {
        deferred.resolve([]);
      });

    return deferred.promise;
  };




  var getExchangeRate = function () {
    return $http.get($rootScope.api + '/api/v2/stores/' + getStoreId() + '/exchange_rates');
  };

  var setExchangeRate = function (data){
    $http.post($rootScope.api + '/api/v2/stores/' + getStoreId() + '/exchange_rates', data);
  };

  var getChainInfo = function (storeId) {
    storeId = storeId || getStoreId();
    return $http.get($rootScope.api + '/api/v2/stores/' + storeId + '/chain_info');
  };

  const getChainModule = (storeId) => {
    storeId = storeId || getStoreId();
    return $http.get($rootScope.api + '/api/v2/stores/' + storeId + '/chain_module');
  };

  const getCurrentChainModules = () => {
    return $rootScope.chainModule || {};
  };

  var checkAssociateType = function (store_id, associate) {
    if (!store_id) {
      return false;
    }

    var deferred = $q.defer();
    // use first store only if multi store
    var storeId = parseInt(store_id.toString().split(',')[0]);
    getStores().success(function (res) {
      try {
        var stores = _.map(res, function (item) {return item.store; });
        var targetStore = _.find(stores, {id: storeId});
        if (targetStore.associate_type === associate) {
          deferred.resolve();
        } else {
          deferred.reject();
        }

      } catch (e) {
        deferred.reject();
      }
    }).error(function () {
      deferred.reject();
    });
    return deferred.promise;
  };

  var getStoreCurrency = function (){
    var store = getCurrentStore();
    var currency;
    if (store) {
      currency = store.currency;
    } else {
      currency = 'USD';
    }
    if (currencymap[currency]){
      return currencymap[currency].symbol_native;
    }
    return '$';
  };

  var getCurrentEditPermission = function (module){

    if (!storeModules.permission_enabled){
      return true;
    }
    var associate = getCurrentStore().associate_type;
    if (editPermission[module] && editPermission[module].roles.indexOf(associate) !== -1){
      return true;
    }
    return false;

  };

  var getCurrentReportPermission = function (module){
    if (!storeModules.permission_enabled){
      return true;
    }
    var associate = getCurrentStore().associate_type;
    if (reportPermission[module] && reportPermission[module].roles.indexOf(associate) !== -1){
      return true;
    }
    if (!reportPermission[module]){
      return true;
    }
    return false;

  };

  var getCurrentSettingsPermission = function (module){
	  if (!storeModules.permission_enabled){
		  return true;
	  }
	  var associate = getCurrentStore().associate_type;
	  if (settingsPermission[module] && settingsPermission[module].roles.indexOf(associate) !== -1){
		  return true;
	  }
	  if (!settingsPermission[module]){
		  return true;
	  }
	  return false;

  };

  var getCurrentViewPermission = function (module){
    if (!storeModules.permission_enabled){
      return true;
    }
    var associate = getCurrentStore().associate_type;
    if (viewPermission[module] && viewPermission[module].roles.indexOf(associate) !== -1){
      return true;
    }
    if (!viewPermission[module]){
      return true;
    }
    return false;

  };

  var getCurrentPermission = function (key){
    if (!storeModules.permission_enabled){
      return true;
    }
    var currentStore = getCurrentStore();
    if (!currentStore) return false;
    var associate = currentStore.associate_type;
    if (allPermission[key] && allPermission[key].roles.indexOf(associate) !== -1){
      return true;
    }
    if (!allPermission[key]){
      return true;
    }
    return false;

  };

  var getStoreModules = function () {
    return storeModules;
  };

  var viewPermission = {};
  var editPermission = {};
  var reportPermission = {};
  var settingsPermission = {};

  var allPermission = {};

  var storeModules = {};
  var gotPerission = false;

  var setupSetting = function (storeId){

    var deferred = $q.defer();

    getStoreSetting(storeId).success(function (res){
      storeModules = res.module;
      deferred.resolve(res.module);
    }).error(function (res){
      deferred.resolve("");
    });
    return deferred.promise;
  };

  var getViewRole = function (module){
    if (viewPermission[module]){
      return viewPermission[module].roles;
    }
    else {
      return [];
    }
  };

  var getEditRole = function (module){
    if (editPermission[module]){
      return editPermission[module].roles;
    }
    else {
      return [];
    }
  };

  var getSettingsRole = function (module){
	  if (settingsPermission[module]){
		  return settingsPermission[module].roles;
	  }
	  else {
		  return [];
	  }
  };

  var setupPermission = function (storeId){
	  var deferred = $q.defer();

	  getStorePermission(storeId).success(function (res){

			var store_permissions = res.store_permissions;

			for (var key in viewPermission){
				viewPermission[key] = { roles: [] };
			}
			for (var key in editPermission){
				editPermission[key] = { roles: [] };
			}
			for (var key in reportPermission){
				reportPermission[key] = { roles: [] };
			}

			_.each(store_permissions, function (permission){
				var role = permission.store_role_name;
				for (var key in permission.permissions){

          if (!allPermission[key]) {
            allPermission[key] = { roles: [] };
          }
          if (permission.permissions[key]) {
            allPermission[key].roles.push(role);
          }

					var moduleValues = key.split(':');
					var moduleName = moduleValues[0];
					var moduleMode = moduleValues[1];
					if (!viewPermission[moduleName]){
						viewPermission[moduleName] = { roles: [] };
					}
					if (!editPermission[moduleName]){
						editPermission[moduleName] = { roles: [] };
					}

					if (moduleName === 'report' && !reportPermission[moduleMode]){
						reportPermission[moduleMode] = { roles: [] };
					}

          if (moduleName === 'settings' && !settingsPermission[moduleMode]){
            settingsPermission[moduleMode] = { roles: [] };
          }

					if (permission.permissions[key] && moduleMode === 'view_only' && viewPermission[moduleName].roles.indexOf(role) === -1){
						viewPermission[moduleName].roles.push(role);
					}

          if (permission.permissions[key] && moduleMode === 'view' && viewPermission[moduleName].roles.indexOf(role) === -1){
            viewPermission[moduleName].roles.push(role);
          }

          if (permission.permissions[key] && moduleMode === 'edit' && editPermission[moduleName].roles.indexOf(role) === -1){
            editPermission[moduleName].roles.push(role);
          }

          if (moduleName === 'report' && permission.permissions[key] && viewPermission[moduleName].roles.indexOf(role) === -1){
            viewPermission[moduleName].roles.push(role);
          }

          if (moduleName === 'report' && permission.permissions[key] && reportPermission[moduleMode].roles.indexOf(role) === -1){
            reportPermission[moduleMode].roles.push(role);
          }

					if (moduleName === 'settings' && permission.permissions[key] && viewPermission[moduleName].roles.indexOf(role) === -1){
						viewPermission[moduleName].roles.push(role);
					}

					if (moduleName === 'settings' && permission.permissions[key] && settingsPermission[moduleMode].roles.indexOf(role) === -1){
						settingsPermission[moduleMode].roles.push(role);
					}
				}
			});

      gotPerission = true;
      deferred.resolve(store_permissions);
    }).error(function (){
      gotPerission = true;
      deferred.resolve([]);
    });
    return deferred.promise;
  };

  var getMembership_level = function (storeId) {
    storeId = storeId || getStoreId();

    return $http.get($rootScope.api + '/api/v2/stores/' + storeId + '/membership_levels/', { cache: false });
  };


  var hasPermission = function () {return gotPerission;};

  // https://gateway.trybindo.com/v2/stores/store_id/discounts/reprioritize
  var reOrderDiscounts = function (discounts) {
    var data = {
      discount_ids: discounts
    };
    return $http.post($rootScope.gateway + '/v2/stores/' + getStoreId() + '/discounts/reprioritize', data);
  };

  return {
    all: _all,
    reOrderDiscounts: reOrderDiscounts,
    getStoreId: getStoreId,
    getCurrentStore: getCurrentStore,
    getStoreSlug: getStoreSlug,
    viewPermission: viewPermission,
    editPermission: editPermission,
    getViewRole: getViewRole,
    getEditRole: getEditRole,
    getMembership_level: getMembership_level,
    getCurrentPermission: getCurrentPermission,
    reportPermission: reportPermission,
    getCurrentDateFormat: getCurrentDateFormat,
    getCurrentSimpleDateFormat: getCurrentSimpleDateFormat,
    checkAssociateType: checkAssociateType,
    getCurrentStores: getCurrentStores,
    getStoreIds: getStoreIds,
    getDiscounts: getDiscounts,
    isMultiStore: isMultiStore,
    findById: findById,
    getCurrentReportPermission:getCurrentReportPermission,
    settingsPermission: settingsPermission,
    getSettingsRole: getSettingsRole,
    getCurrentSettingsPermission: getCurrentSettingsPermission,
    getStoreCurrency: getStoreCurrency,
    getStores: getStores,
    getAttributes:getAttributes,
    getStoreSetting: getStoreSetting,
    getStorePermission: getStorePermission,
    getCustomers: getCustomers,
    getSuppliers: getSuppliers,
    getListings: getListings,
    getUnitGroups:getUnitGroups,
    searchListings: searchListings,
    searchListingID: searchListingID,
    searchListingsOld: searchListingsOld,
    searchListingsByBarcode: searchListingsByBarcode,
    setupPermission: setupPermission,
    hasPermission: hasPermission,
    getTaxOptions: getTaxOptions,
    getDepartments: getDepartments,
    getLocales: getLocales,
    languages_by_locale: languages_by_locale,
    languages_by_locale_lower: languages_by_locale_lower,
    getModifierGroups: getModifierGroups,
    getChainInfo: getChainInfo,
    getChainModule: getChainModule,
    getCurrentChainModules: getCurrentChainModules,
    getAssociates: getAssociates,
    getBrands:getBrands,

    getCategories:getCategories,
    getCustomerGroup:getCustomerGroup,
    searchListingByID: searchListingByID,

    searchProductsById: searchProductsById,
    getCurrentEditPermission: getCurrentEditPermission,
    getCurrentViewPermission: getCurrentViewPermission,
    getStoreModules: getStoreModules,
    searchProductsByName: searchProductsByName,
    setupSetting: setupSetting,
    getExchangeRate: getExchangeRate,
    setExchangeRate: setExchangeRate,

  };

}
