import BindoService from './base/bindoService';
import config from '../configs/config';

const TYPE = {
    INVOICE: 'invoice',
    WELCOME: 'welcome',
    PASSWORD_RESET_INSTRUCTION: 'password_reset_instruction',
    PASSWORD_RESET_SUCCESS: 'password_reset_success',
    PARTY_CONFIRMATION: 'party_confirmation',
    AIRPRINT_INVOICE: 'airprint_invoice',
    ORDER_CONFIRMATION: 'order_confirmation',
    DELIVERY_ORDER: 'delivery_order',
};

class EmailTemplateService extends BindoService {

    TYPE = TYPE;

    /**
     * Send email template
     *
     * @param {string} storeId
     * @param {string} template_type
     * @param {string} recipient
     * @param {object} [params]
     * @param {number} [params.order_id]
     * @param {number} [params.order_number]
     * @param {number} [params.delivery_order_id]
     * @param {number} [params.party_id]
     * @param {number} [params.user_id]
     * @param {number} [params.customer_id]
     *
     * @memberOf EmailTemplateService
     */
    send(storeId, template_type, recipient, params = {}) {
        let path = `v2/stores/${storeId}/email_template/send`;

        let query = {
            template_type,
            recipient,
            ...params
        };

        return super.post(path, query, config.gateway)
            .then(
                res => {
                    if (res.success) {
                        return true;
                    } else {
                        throw res;
                    }
                }
            );
    }

}

export default new EmailTemplateService();
