import React from 'react';
import { shallow } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import Status from '../../../../client/components/status/status';

export default function (){

    describe('<Status />', () => {
        beforeEach(() => {
            jasmineEnzyme();
        });

        it('renders <StatusIcon />', () => {
            const el = shallow(<Status state="pending" />);
            expect(el).toBePresent();
            expect(el).toHaveTagName('span');
            expect(el.find('StatusIcon')).toBePresent();
            expect(el.find('StatusIcon')).toHaveProp('state', 'pending');
        });

        it('renders correct label', () => {
            const pending = shallow(<Status state="pending" />);
            expect(pending.find('.status__label')).toHaveText('pending');

            const sent = shallow(<Status state="sent" />);
            expect(sent.find('.status__label')).toHaveText('sent');

            const override = shallow(<Status state="sent" label="override" />);
            expect(override.find('.status__label')).toHaveText('override');
        });

        it('return null when there is no state', () => {
            const el = shallow(<Status />);
            expect(el.type()).toBeNull();
        });
    });

}
