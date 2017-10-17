
import { DoPdfController } from './doPdfController'
import { InvoiceFulfillController } from './fulfillController'
import { InvoiceFactory } from './invoiceFactory'
import { InvoicesQuotesController, InvoiceQuoteViewController, InvoiceQuoteNewController } from './invoicesQuotesController'
import { InvoiceQuotePdfController } from './invoicesQuotesPdfController'
import { PdfInvoiceFactory } from './pdfInvoiceFactory'

export default angular
  .module('invoices', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.invoices', {
        abstract: true,
        url: '/invoices',
        template: '<ui-view />'
      })
      .state('app.dashboard.invoices.index', {
        url: '?page&count&filters',
        templateUrl: 'app/modules/invoices/invoice_list.html',
        data: { multiStoreSupport: true },
        controller: 'InvoicesQuotesController'})
      .state('app.dashboard.invoices.new', {url: '/new', templateUrl: 'app/modules/invoices/new_invoice.html', data: { multiStoreSupport: true }, controller: 'InvoiceQuoteNewController'})
      .state('app.dashboard.invoices.view', {cache: false, url: '/:number', templateUrl: 'app/modules/invoices/view_invoice.html', data: { multiStoreSupport: true }, controller: 'InvoiceQuoteViewController'})
      .state('app.dashboard.invoices.pdf', {url: '/pdf/:number', templateUrl: 'app/modules/invoices/invoice_pdf.html', controller: 'InvoiceQuotePdfController'})
      .state('app.dashboard.invoices.dopdf', {url: '/dopdf/:number', templateUrl: 'app/modules/invoices/do_pdf.html', controller: 'DoPdfController'})
      .state('app.dashboard.quotes', {url: '/quotes', template: '<ui-view />'})
      .state('app.dashboard.quotes.new', {url: '/new', templateUrl: 'app/modules/invoices/new_invoice.html', data: { multiStoreSupport: true }, controller: 'InvoiceQuoteNewController'})
      .state('app.dashboard.quotes.view', {cache: false, url: '/:number', templateUrl: 'app/modules/invoices/view_invoice.html', data: { multiStoreSupport: true }, controller: 'InvoiceQuoteViewController'})

  })
  .controller('DoPdfController', DoPdfController)
  .controller('InvoiceFulfillController', InvoiceFulfillController)
  .factory('InvoiceFactory', InvoiceFactory)
  .controller('InvoicesQuotesController', InvoicesQuotesController)
  .controller('InvoiceQuoteViewController', InvoiceQuoteViewController)
  .controller('InvoiceQuoteNewController', InvoiceQuoteNewController)
  .controller('InvoiceQuotePdfController', InvoiceQuotePdfController)
  .factory('PdfInvoiceFactory', PdfInvoiceFactory)

