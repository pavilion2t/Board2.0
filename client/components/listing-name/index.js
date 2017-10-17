import React from 'react';
export default function ListingName({ name, gtid, listingBarcode, imageUrl }) { // eslint-disable-line react/prop-types
  return (
    <div className="media listing-name-thumbnail">
      <div className="media-left">
        <img
          className="_thumbnail"
          src={ imageUrl || require('./images/inventory_placeholder.png') }
          alt=""/>
      </div>
      <div className="media-body">
        <p className="_name">{ name }</p>
        { gtid && <p className="_code">UPC/EAN: { gtid }</p> }
        { listingBarcode && <p className="_code">PLU/SKU: { listingBarcode }</p> }
      </div>
    </div>
  );
}
