import FromsReducerSpec from './formsReducer';
import InvoiceReducerSpec from './invoiceReducer.spec';
import ProductionOrderItemReducerSpec from './productionOrderItem.spec';

export default function () {
  describe('Reducers', () => {
    FromsReducerSpec();
    InvoiceReducerSpec();
    ProductionOrderItemReducerSpec();
  });
}
