import FormActionsSpec from './formActions';
import DeliveryOrderActionsSpec from './deliveryOrderActions.spec';
import EmailTemplateActionSpec from './emailTemplateActions.spec';
import InvoiceActionsSpec from './invoiceActions.spec';

export default function ActionsSpec() {
    describe("Action Creators", function () {
        FormActionsSpec();
        DeliveryOrderActionsSpec();
        EmailTemplateActionSpec();
        InvoiceActionsSpec();
    });
}
