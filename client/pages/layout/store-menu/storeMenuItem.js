/* eslint react/prop-types: 0 */

import './storeMenuItem.scss';

import React from 'react';

import truncate from 'lodash/truncate';

import StoreThumbnail from '~/components/store-thumbnail/storeThumbnail';
import Checkbox from '~/components/input-checkbox/input-checkbox';

function StoreMenuItem(props) {
  let { store } = props;

  let hasChildren = store._children && store._children.length > 0;
  let className = 'store-menu-item '+ props.className;

  return (
    <div className={ className }>
      <StoreThumbnail className="image" src={ store.logo_url } />
      <div className="details">
        <div className="left">
          <p className="details__title">{ truncate(store.title, {length: 40}) }</p>
          {
            hasChildren ? (
              <p className="details__address" >
                Chain with { store._children.length } Stores
              </p>

            ) : (
              <p className="details__address">
                { truncate(store.address1, {length: 40}) }
              </p>
            )
          }

        </div>
        <div className="right"><Checkbox wrapperClassName="store-checkbox" checked={ store.selected || false } /></div>
      </div>
    </div>
  );
}

export default StoreMenuItem;

                            // <div className="info__checkbox">
                            //   <input-checkbox label="selected-store-{childStore.id }" ng-model="$root.updatedStores[childStore.id]"></input-checkbox>
                            // </div>
