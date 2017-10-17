import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

import * as actions from '../../../client/actions';
import emailService from '../../../client/services/emailTemplateService';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const SEND_EMAIL_URL_REGEX = /v2\/stores\/\d+\/email_template\/send/;

export default function () {

  describe('Email Template Actions', () => {
    let store = null;

    describe('sendEmail()', () => {

      describe('Success Scenario', () => {
        afterEach(fetchMock.restore);

        beforeEach((done) => {
          spyOn(emailService, 'send').and.returnValue(Promise.resolve());
          fetchMock.post(SEND_EMAIL_URL_REGEX, { success: true });
          store = mockStore({});
          store
            .dispatch(actions.sendEmail('123', emailService.TYPE.INVOICE, 'test@bindo.com', { order_number: '1234' }))
            .then(() => done());
        });

        it('dispatch correct actions', () => {
          expect(store.getActions()).toEqual(
            jasmine.arrayContaining([
              jasmine.objectContaining({ type: actions.ADD_ALERT, style: 'success' }),
            ])
          );
        });

        it('call service with correct params', () => {
          expect(emailService.send)
            .toHaveBeenCalledWith('123', emailService.TYPE.INVOICE, 'test@bindo.com', { order_number: '1234' });
        });

      });

      describe('Failure Scenario', () => {
        afterEach(fetchMock.restore);

        beforeEach((done) => {
          fetchMock.post(SEND_EMAIL_URL_REGEX, { status: 404, body: { message: 'Order does not exists' } });
          store = mockStore({});
          store
            .dispatch(actions.sendEmail('123', emailService.TYPE.INVOICE, 'test@bindo.com', { order_number: '1234' }))
            .then(() => done());
        });

        it('dispatch correct actions', () => {
          expect(store.getActions()).toEqual(
            jasmine.arrayContaining([
              jasmine.objectContaining({ type: actions.ADD_ALERT, style: 'danger', message: 'Order does not exists' }),
            ])
          );
        });

      });

    });

  });

}
