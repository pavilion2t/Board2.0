import './listingNameDisplay.scss';

import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

export default class ListingNameDisplay extends Component {
  static propTypes = {
    rowData: PropTypes.object.isRequired
  }

  render() {

    return (
      <Link className="block-a"
            to={ `/v2/${this.props.rowData.store_id}/inventory/${this.props.rowData.id}` }>
        <div className="media listing-name-thumbnail">
          <div className="media-left">
            <img
              className="_thumbnail"
              src={ this.props.rowData.image_url || require('../images/inventory_placeholder.png') }
              alt="" />
          </div>
          <div className="media-body">
            <p className="_name">{ this.props.rowData.name }</p>
            <p className="_code">UPC/EAN: { this.props.rowData.gtid || "N/A" }</p>
            <p className="_code">PLU/SKU: { this.props.rowData.listing_barcode || "N/A" }</p>
          </div>
        </div>
      </Link>
    );
  }
}

// TODO: image_url is too large
