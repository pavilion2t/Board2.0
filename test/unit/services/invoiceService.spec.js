import * as config from '../../../client/configs/config.dev';
import invoiceService from '../../../client/services/invoiceService';

export default function () {

    describe('Invoice Service', () => {
        beforeEach(() => {
            spyOn(invoiceService, 'get').and.returnValue(
                Promise.resolve({ invoice: { id: 789 } })
            );
        });

        it('Call AJAX with correct params', () => {
            let promise = invoiceService.getItem('123', '456');
            expect(invoiceService.get).toHaveBeenCalledWith(
                'v2/stores/123/invoices/456', undefined, config.gateway
            );
        });

        it('Return object exectly in HTTP response', () => {
            let promise = invoiceService.getItem('123', '456');

            promise.then(res=> {
                expect(res).toEqual(jasmine.any(Object));
                expect(res).toEqual({ invoice: { id: 789 } });
            });
        });
    });

}
