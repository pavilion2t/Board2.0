import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { cloneDeep, omit, xor } from 'lodash';
import Loading from '~/components/loading/loading';
import classnames from 'classnames';

function mapStateToProp(state) {
  let formState = state.forms.productionOrderItem;
  return { ...formState };
}


@connect(mapStateToProp, () => ({}))
export default class ProductionOrderItemMaterialList extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    productionOrderItems: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      collased: []
    };
  }

  toggleItem = (index) => {
    this.setState({ collased: xor(this.state.collased, [index]) });
  };

  flattenDeep = (orderItems) => {
    let items = cloneDeep(orderItems);
    items.forEach(i => {
      i.children = i.productionOrderItemMaterials.slice();
      i.materialBomType = 0;
      i.showCaret = Array.isArray(i.children) && i.children.length > 0;
    });
    let flattened = this.flatternMaterials(items, 0);
    return flattened.map(i => omit(i, ['productionOrderItemMaterials', 'children']));
  };

  flatternMaterials = (items, level) => {
    let ret = [];
    items.forEach(i => {
      i.level = level;
      i.showCaret = Array.isArray(i.children) && i.children.length > 0;
      let collasped = this.state.collased.indexOf(i.uuid) > -1;
      ret.push(i);
      if (!collasped && i.showCaret) {
        let flattened = this.flatternMaterials(i.children, level + 1);
        ret = ret.concat(flattened);
      }
    });
    return ret;
  };

  renderTable() {
    const { productionOrderItems = [] } = this.props;
    const { collased } = this.state;

    let flattenData = this.flattenDeep(productionOrderItems);

    return (<table className="table offset-table data-table--no-border data-table--primary-link">
      <thead>
      <tr>
        <th>MATERIAL</th>
        <th>PLU/SKU</th>
        <th>UPC/EAN</th>
        <th>TYPE</th>
        <th>PLANNED QTY</th>
        <th>PROCESSED QTY</th>
        <th>UOM</th>
        <th>CURRENT QTY</th>
      </tr>
      </thead>
      <tbody>
      { flattenData.length > 0 && flattenData.map((d, i) => {
        const {
          level,
          name,
          uuid,
          showCaret
        } = d;

        const caretDown = collased.indexOf(uuid) == -1;
        return (
          <tr key={ i }>
            <td>
              <div style={ { marginLeft: level * 25 } }><span>
                { showCaret && <a onClick={ () => this.toggleItem(uuid) }><i className={ classnames('fa', {
                  'fa-caret-down': caretDown,
                  'fa-caret-up': !caretDown
                }) }/></a> }{ name }</span></div>
            </td>

            <td>{ d.ean13 }</td>
            <td>{ d.listingBarcode  }</td>
            <td>{ d.trackQuantity === 1 ? 'Non Inventory Item' : 'Inventory Item' }</td>
            <td>{ d.quantityInDisplayUnit }</td>
            <td>{ d.qtyFulfilledInDisplayUnit }</td>
            <td>{ d.displayUnit }</td>
            <td>{ d.listingQuantity }</td>
          </tr>);
      }) }
      </tbody>
    </table>);
  }


  render() {
    const { isLoading } = this.props;

    return (
      <div>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main"/>
          {/* <div>
           <button className="btn btn-secondary btn-sm">Excel</button>
           <button className="btn btn-secondary btn-sm">PDF</button>
           <button className="btn btn-secondary btn-sm">CSV</button>
           </div>*/}
        </header>
        { isLoading && <div className="main-content-section"><Loading>Loading...</Loading></div> }
        { !isLoading && this.renderTable() }
      </div>
    );
  }
}
