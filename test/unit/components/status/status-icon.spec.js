import React from 'react';
import { shallow } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import StatusIcon from '../../../../client/components/status/status-icon';

export default function (){

    describe('<StatusIcon />', () => {
        beforeEach(() => {
            jasmineEnzyme();
        });

        it('renders <i />', () => {
            const el = shallow(<StatusIcon state="pending" />);
            expect(el).toBePresent();
            expect(el).toHaveTagName('i');
        });

        it('renders correct className', () => {
            const pending = shallow(<StatusIcon state="pending" />);
            expect(pending).toHaveClassName('status-icon pending');

            const sent = shallow(<StatusIcon state="sent" />);
            expect(sent).toHaveClassName('status-icon sent');
        });

        it('return null when there is no state', () => {
            const el = shallow(<StatusIcon />);
            expect(el.type()).toBeNull();
        });
    });

}
