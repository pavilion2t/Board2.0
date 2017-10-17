import GriddleComponentSpec from './griddle-components.spec';
import InputNumberSpec from './input-number/index.spec';
import InputCurrencySpec from './input-currency/index.spec';
import StatusSpec from './status/index';

export default function () {
  describe('React Components', () => {
    GriddleComponentSpec();
    InputNumberSpec();
    InputCurrencySpec();
    StatusSpec();
  });
}
