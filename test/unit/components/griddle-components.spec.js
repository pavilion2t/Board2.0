import React from 'react';
import { shallow } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import Status from '~/components/status/status';

import {
  statusComponent,
  storeComponent,
} from '~/components/griddle-components';

@statusComponent
@storeComponent
class DummyGrid {
  constructor(props = {}, context = {}) {
    this.props = props;
    this.context = context;
  }
}

export default function () {

  describe('Griddle Component Decorators', () => {

    describe('@statusComponent', () => {
      beforeEach(() => jasmineEnzyme());
      it('renders <Status />', () => {
        const grid = new DummyGrid();
        const cell = grid.statusComponent()({ data: 'paid' });
        const el = shallow(cell);
        expect(el.find('.status__label')).toHaveText('paid');
      });

      it('transform label base on status type', () => {
        const grid = new DummyGrid();
        const cell1 = grid.statusComponent('deliveryOrder')({ data: 'partially_sent' });
        const el1 = shallow(cell1);
        const cell2 = grid.statusComponent('order')({ data: 'fulfilled' });
        const el2 = shallow(cell2);
        expect(el1.find('.status__label')).toHaveText('Partially Delivered');
        expect(el2.find('.status__label')).toHaveText('Finished');
        expect(el2.find('StatusIcon')).toHaveProp('customColor', '#49bbeb');
      });

      it('renders default status when data is null', () => {
        const grid = new DummyGrid();
        const cell = grid.statusComponent('deliveryOrder')({ data: null });
        const el = shallow(cell);
        expect(el.find('.status__label')).toHaveText('Created');
      });
    });

    describe('@storeComponent', () => {
      beforeEach(() => jasmineEnzyme());
      it('renders <span>Store Name</span>', () => {
        const grid = new DummyGrid({ stores: [{ id: 1, title: 'Test Store' }] });
        const cell = grid.storeComponent({ data: 1 });
        const el = shallow(cell);
        expect(el).toBePresent();
        expect(el).toHaveTagName('span');
        expect(el.find('span')).toHaveText('Test Store');
      });

      it('return null when there is no such store', () => {
        const grid = new DummyGrid({ stores: [{ id: 1, title: 'Test Store' }] });
        const cell = grid.storeComponent({ data: 2 });
        expect(cell).toBeNull();
      });
    });

  });

}
