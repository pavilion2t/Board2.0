import React from 'react';
import { shallow } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import InputCurrency from '../../../../client/components/input-currency';

export default function (){

    describe('<InputCurrency />', () => {
        beforeEach(() => {
            jasmineEnzyme();
        });

        it('renders with given currency code', () => {
            const el = shallow(<InputCurrency currency="HKD"/>);
            expect(el).toBePresent();
            expect(el.find('InputNumber')).toBePresent();
            expect(el.find('InputNumber')).toHaveProp('prefix', '$');
        });

        it('renders without currency code', () => {
            const el = shallow(<InputCurrency />, {
                context: {
                    currentStore: { currency: 'HKD' }
                }
            });
            expect(el.find('InputNumber')).toHaveProp('prefix', '$');
        });

        it('renders with given currency code which will overwrite context settings', () => {
            const el = shallow(<InputCurrency currency="JPY" />, {
                context: {
                    currentStore: { currency: 'HKD' }
                }
            });
            expect(el.find('InputNumber')).toHaveProp('prefix', '¥');
        });

        it('renders correct value', () => {
            let el;
            el = shallow(<InputCurrency currency="HKD" value="1"/>);
            expect(el.find('InputNumber')).toHaveProp('value', '1');
            el = shallow(<InputCurrency currency="HKD" value="1.2"/>);
            expect(el.find('InputNumber')).toHaveProp('value', '1.2');
        });

        it('renders correct dp', () => {
            let el;
            el = shallow(<InputCurrency currency="HKD" dp={ 0 }/>);
            expect(el.find('InputNumber')).toHaveProp('dp', 0);
            el = shallow(<InputCurrency currency="HKD" dp={ 1 }/>);
            expect(el.find('InputNumber')).toHaveProp('dp', 1);
            el = shallow(<InputCurrency currency="HKD" value="1.2" dp={ 1 }/>);
            expect(el.find('InputNumber')).toHaveProp('dp', 1);
            expect(el.find('InputNumber')).toHaveProp('value', '1.2');
            el = shallow(<InputCurrency currency="HKD" value="1.2" dp={ 2 }/>);
            expect(el.find('InputNumber')).toHaveProp('dp', 2);
            expect(el.find('InputNumber')).toHaveProp('value', '1.2');
        });

        it('renders correct className', () => {
            const el = shallow(<InputCurrency currency="HKD" className="foo"/>);
            expect(el.find('InputNumber')).toHaveProp('className', 'foo');
        });

        it('renders correct style', () => {
            const style = { color: 'red' };
            const el = shallow(<InputCurrency currency="HKD" style={ style }/>);
            expect(el.find('InputNumber')).toHaveProp('style', style);
        });

        it('renders correct state', () => {
            let el;
            el = shallow(<InputCurrency currency="HKD" />);
            expect(el.find('InputNumber')).toHaveProp('readOnly', false);
            el = shallow(<InputCurrency currency="HKD" readOnly/>);
            expect(el.find('InputNumber')).toHaveProp('readOnly', true);
            el = shallow(<InputCurrency currency="HKD" />);
            expect(el.find('InputNumber')).toHaveProp('disabled', false);
            el = shallow(<InputCurrency currency="HKD" disabled/>);
            expect(el.find('InputNumber')).toHaveProp('disabled', true);
        });
    });

}
