import React from 'react';
import { shallow } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import InputNumber from '../../../../client/components/input-number';

export default function (){

    describe('<InputNumber />', () => {

        beforeEach(() => {
            jasmineEnzyme();
        });

        it('renders <InputNumber />', () => {
            const el = shallow(<InputNumber />);
            expect(el).toBePresent();
            expect(el).toHaveTagName('input');
            expect(el).toHaveValue('0.00');
        });

        it('renders correct value', () => {
            let el;
            el = shallow(<InputNumber value={ 1 }/>);
            expect(el).toHaveValue('1.00');
            el = shallow(<InputNumber value={ 1.2 }/>);
            expect(el).toHaveValue('1.20');
            el = shallow(<InputNumber value={ 1.23 }/>);
            expect(el).toHaveValue('1.23');
            el = shallow(<InputNumber value={ 1.234 }/>);
            expect(el).toHaveValue('1.23');
            el = shallow(<InputNumber value={ 1.235 }/>);
            expect(el).toHaveValue('1.23');
            el = shallow(<InputNumber value={ 1234 }/>);
            expect(el).toHaveValue('1,234.00');
            el = shallow(<InputNumber value={ 12345 }/>);
            expect(el).toHaveValue('12,345.00');
            el = shallow(<InputNumber value={ 123456 }/>);
            expect(el).toHaveValue('123,456.00');
            el = shallow(<InputNumber value={ 1234567 }/>);
            expect(el).toHaveValue('1,234,567.00');
        });

        it('renders correct DP', () => {
            let el;
            el = shallow(<InputNumber value={ 1 } dp={ 0 }/>);
            expect(el).toHaveValue('1');
            el = shallow(<InputNumber value={ 1 } dp={ 1 }/>);
            expect(el).toHaveValue('1.0');
            el = shallow(<InputNumber value={ 1 } dp={ 2 }/>);
            expect(el).toHaveValue('1.00');
            el = shallow(<InputNumber value={ 1.2 } dp={ 0 }/>);
            expect(el).toHaveValue('1');
            el = shallow(<InputNumber value={ 1.2 } dp={ 1 }/>);
            expect(el).toHaveValue('1.2');
            el = shallow(<InputNumber value={ 1.2 } dp={ 2 }/>);
            expect(el).toHaveValue('1.20');
            el = shallow(<InputNumber value={ 1.23 } dp={ 0 }/>);
            expect(el).toHaveValue('1');
            el = shallow(<InputNumber value={ 1.23 } dp={ 1 }/>);
            expect(el).toHaveValue('1.2');
            el = shallow(<InputNumber value={ 1.23 } dp={ 2 }/>);
            expect(el).toHaveValue('1.23');
            el = shallow(<InputNumber value={ 1234.567 } dp={ 0 }/>);
            expect(el).toHaveValue('1,234');
            el = shallow(<InputNumber value={ 1234.567 } dp={ 1 }/>);
            expect(el).toHaveValue('1,234.5');
            el = shallow(<InputNumber value={ 1234.567 } dp={ 2 }/>);
            expect(el).toHaveValue('1,234.56');
        });

        it('renders correct negative value', () => {
            let el;
            el = shallow(<InputNumber value={ -1 }/>);
            expect(el).toHaveValue('-1.00');
            el = shallow(<InputNumber value={ -1.23 }/>);
            expect(el).toHaveValue('-1.23');
            el = shallow(<InputNumber value={ -1234 }/>);
            expect(el).toHaveValue('-1,234.00');
            el = shallow(<InputNumber value={ -1234.56 }/>);
            expect(el).toHaveValue('-1,234.56');
            el = shallow(<InputNumber value={ -1 } dp={ 1 } />);
            expect(el).toHaveValue('-1.0');
            el = shallow(<InputNumber value={ -1.23 } dp={ 1 } />);
            expect(el).toHaveValue('-1.2');
            el = shallow(<InputNumber value={ -1234 } dp={ 1 } />);
            expect(el).toHaveValue('-1,234.0');
            el = shallow(<InputNumber value={ -1234.56 } dp={ 1 } />);
            expect(el).toHaveValue('-1,234.5');
        });

        it('renders correct prefix / suffix', () => {
            let el;
            el = shallow(<InputNumber value={ 1 } prefix="$" />);
            expect(el).toHaveValue('$1.00');
            el = shallow(<InputNumber value={ 1234 } prefix="$" />);
            expect(el).toHaveValue('$1,234.00');
            el = shallow(<InputNumber value={ 1 } prefix="HKD " />);
            expect(el).toHaveValue('HKD 1.00');
            el = shallow(<InputNumber value={ 1234 } prefix="HKD " />);
            expect(el).toHaveValue('HKD 1,234.00');
            el = shallow(<InputNumber value={ 1 } suffix=" HKD" />);
            expect(el).toHaveValue('1.00 HKD');
            el = shallow(<InputNumber value={ 1234 } suffix=" HKD" />);
            expect(el).toHaveValue('1,234.00 HKD');
            el = shallow(<InputNumber value={ 1 } suffix=" HKD" />);
            expect(el).toHaveValue('1.00 HKD');
            el = shallow(<InputNumber value={ 1234 } suffix=" HKD" />);
            expect(el).toHaveValue('1,234.00 HKD');
            el = shallow(<InputNumber value={ 1 } prefix="$" suffix=" HKD" />);
            expect(el).toHaveValue('$1.00 HKD');
            el = shallow(<InputNumber value={ 1234 } prefix="$" suffix=" HKD" />);
            expect(el).toHaveValue('$1,234.00 HKD');
            el = shallow(<InputNumber value={ -1 } prefix="$" suffix=" HKD" />);
            expect(el).toHaveValue('-$1.00 HKD');
            el = shallow(<InputNumber value={ -1234 } prefix="$" suffix=" HKD" />);
            expect(el).toHaveValue('-$1,234.00 HKD');
            el = shallow(<InputNumber value={ -1 } prefix="$" suffix=" HKD" signAfterPrefix />);
            expect(el).toHaveValue('$-1.00 HKD');
            el = shallow(<InputNumber value={ -1234 } prefix="$" suffix=" HKD" signAfterPrefix />);
            expect(el).toHaveValue('$-1,234.00 HKD');
        });

        it('renders correct className', () => {
            let el;
            el = shallow(<InputNumber className="foo" />);
            expect(el).toHaveClassName('foo');
            el = shallow(<InputNumber className="bar" />);
            expect(el).toHaveClassName('bar');
        });

        it('renders correct style', () => {
            let el;
            const style = { padding: 100 };
            el = shallow(<InputNumber style={ style } />);
            expect(el).toHaveStyle('padding', 100);
        });

        it('renders correct state', () => {
            let el;
            el = shallow(<InputNumber />);
            expect(el).toHaveProp('readOnly', false);
            el = shallow(<InputNumber readOnly />);
            expect(el).toHaveProp('readOnly', true);
            el = shallow(<InputNumber />);
            expect(el).toHaveProp('disabled', false);
            el = shallow(<InputNumber disabled />);
            expect(el).toHaveProp('disabled', true);
        });
    });

}
