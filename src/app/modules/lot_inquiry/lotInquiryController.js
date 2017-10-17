import { curry2, curry3 } from '../../shared/helper/fpHelper'

//raw data processing

const groupingFields = ['lot_number', 'product_id', 'expiration_date']

const makeStringAsIdFromFieldValues = (fields, obj) => _.reduce(groupingFields, (acc, field) => acc + `${_.get(obj, field, '')}`, '')

const groupDataByFields = curry2(_.groupBy)(makeStringAsIdFromFieldValues.bind(null, groupingFields))

const fieldsToAggregate = ['quantity', 'qty_remaining']

const aggregateIntoOneObject = arr => _.reduce(fieldsToAggregate, (acc, field) => _.set(acc, field, _.sum(_.map(acc[field], field))), _.first(arr) || {})

const aggregateEachGroup = curry2(_.mapValues)(aggregateIntoOneObject)

const aggregateEntities = _.flow(groupDataByFields, aggregateEachGroup)

const dateRangeInOneMonth = (start, end) => (new Date(end) - new Date(start)) < 1000 * 60 * 60 * 24 * 31

const validDateRange = (start, end) => (new Date(end) - new Date(start)) > 0


const ReferenceCodesFieldRange = _.range(0, 3)

const makeOneReferenceCodesField = num => `listing_reference_code_${num + 1}`

const getOneReferenceCodeValue = num => curry2(_.get)(`listing_reference_codes.${num}`)

const makeOneReferenceCodePair = listing => num => ([makeOneReferenceCodesField(num), getOneReferenceCodeValue(num)(listing)])

const makeAllReferenceCodePairs = listing => _.map(ReferenceCodesFieldRange, makeOneReferenceCodePair(listing))

const makeReferenceCodes = _.flow(makeAllReferenceCodePairs, _.object)

const addReferenceCode = listing => _.assign(listing, makeReferenceCodes(listing))

const addAllReferenceCodes = curry2(_.map)(addReferenceCode)

const strToArr = s => s.length ? s.split(',') : []

const splitReferenceCodes = listing => _.set(listing, 'listing_reference_codes', strToArr(listing.listing_reference_codes))

const splitAllReferenceCodes = curry2(_.map)(splitReferenceCodes)

export class LotInquiryController {
  constructor(ngDialog, $scope, $filter, $stateParams, DashboardFactory, LotInquiryFactory, gettextCatalog, uiGridConstants, columnDefsFactory, reportsFactory, ExportFactory, uiGridExporterConstants) {
    'ngInject';

    this.$filter = $filter

    const columnDefs = [
      columnDefsFactory.standardGroupField("store_name"),
      columnDefsFactory.standardGroupField("product_name"),
      columnDefsFactory.standardGroupField("bpid", 'BPID'),
      columnDefsFactory.standardGroupField("gtid", 'UPC/EAN'),
      columnDefsFactory.standardGroupField("listing_barcode", 'PLU/SKU'),
      columnDefsFactory.standardGroupField("listing_reference_code_1", 'Reference Code 1'),
      columnDefsFactory.standardGroupField("listing_reference_code_2", 'Reference Code 2'),
      columnDefsFactory.standardGroupField("listing_reference_code_3", 'Reference Code 3'),
      columnDefsFactory.standardGroupField("brand"),
      columnDefsFactory.standardGroupField("department"),
      columnDefsFactory.standardGroupField("lot_number"),
      columnDefsFactory.standardGroupField("expiration_date"),
      columnDefsFactory.numberAggregateField("total_received"),
      columnDefsFactory.numberAggregateField("balance")
    ];

    $scope.gridOptions = {
      columnDefs,
      data: [],
      onRegisterApi: (gridApi) => $scope.gridApi = gridApi
    };

    $scope.showOpenBalance = true;
    $scope.showZeroBalance = false;
    $scope.selectedProducts = [];
    $scope.gridMessage = "Please select inquiry criteria to show";
    $scope.download = function (mode) {
      var fileName = 'Lot Inquiry';
      var grid = $scope.gridApi.exporter.rawExport(uiGridExporterConstants.VISIBLE, uiGridExporterConstants.VISIBLE);
      const colMap = _.reduce(columnDefs, (acc, col) => _.set(acc, col.field, col), {})
      ExportFactory.exportTables(mode, [{ columns: grid.column, entries: grid.data }], [], { mode: 'grid', gridDef: colMap, showCurrency: reportsFactory.showCurrency.value }, fileName);
    };

    const dateFormatter = this.$filter('momentDate')
    const loadData = function (filter) {
      $scope.gridMessage = "Loading data";
      let qs = {
        page: 1,
        per_page: 200,
        store_ids: [$stateParams.store_id],
        include_zero_balance: $scope.showZeroBalance ? 1 : 0,
      }
      if (_.size($scope.selectedProducts))qs.product_ids = _.map($scope.selectedProducts, 'product_id');
      if ($scope.dateFrom) {
        qs.date_from = $scope.dateFrom
        qs.date_to = $scope.dateTo
      }
      LotInquiryFactory.getLotInquiries(qs)
        .success((data, status, headers) => {
          const processDataToShow = _.flow(
            curry2(_.get)('lot_inquiries'),
            _.flow(
              curry2(_.map)(d => _.set(d, 'expiration_date', dateFormatter(d.expiration_date))),
              aggregateEntities,
              splitAllReferenceCodes,
              addAllReferenceCodes,
              curry2(_.map)(_.identity)
            )
          )
          $scope.gridOptions.data = processDataToShow(data)
          $scope.gridMessage = !$scope.gridOptions.data.length ? "No result" : "";
        })
        .error(e => $scope.gridMessage = 'Failed to fetch data');
    };

    // loadData()

    const validateDateRange = () => {
      if (!$scope.dateFrom || !$scope.dateTo) return 'Please select expiration date range.'
      if (!dateRangeInOneMonth($scope.dateFrom, $scope.dateTo)) return 'Please select expiration date range within one month.'
      if (!validDateRange($scope.dateFrom, $scope.dateTo)) return 'Invalid date range.'
    }

    $scope.loadData = function () {
      if (!_.size($scope.selectedProducts)) {
        let dateError = validateDateRange()
        if (dateError) {
          alert(dateError)
          return
        }
      }
      loadData()
    }

    $scope.clear = function () {
      $scope.selectedProducts = []
      $scope.dateFrom = ''
      $scope.dateTo = ''
      $scope.gridOptions.data = []
    }

    // search product
    $scope.selectProduct = function () {
      ngDialog.open({

        template: 'app/shared/directive/add_listings/add_listings_input_select.html',
        className: 'ngdialog-theme-defaut ngdialog-theme-mega width-42p',
        controller: 'addListingsInputSelect',
        scope: $scope

      }).closePromise.then(function (response) {
        if (response.value === null || typeof response.value === "undefined" || response.value === '$closeButton') {
          return;
        }
        $scope.selectedProducts = response.value
        $scope.lists = response.value
      });
    }

    $scope.search = function (key) {
      return DashboardFactory.searchProductsByName(key, DashboardFactory.getStoreId())
        .then(function (data) {
          var items = _.map(data.data, function (item) {
            return item.listing;
          });
          return items;
        });
    };

    $scope.isSearch = true
  }
}
