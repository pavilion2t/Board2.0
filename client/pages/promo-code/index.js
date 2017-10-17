import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';

import routeHelper from '~/helpers/routeHelper';
import filterHelper from '~/helpers/filterHelper';

import * as gridSelectors from '~/selectors/gridSelectors';
import * as promoCodeSelectors from '~/selectors/promoCodeSelectors';

import * as promoCodeActions from '~/actions/promoCodeActions'

import {
  MainContent,
  MainContentHeader,
  MainContentHeaderButtons,
} from '~/pages/layout/main-content';
import CascadeFilterCollection from '~/components/cascade-filter/cascadeFilterCollection';
import { Grid } from '~/components/grid';

const mapStateToProp = (state, props, context) => {
  const gridMeta = gridSelectors.getMeta(state, props);
  const gridMeta2 = promoCodeSelectors.getGridMeta(state, props);
  return {
    ...gridMeta,
    ...gridMeta2,
    promoCodes: promoCodeSelectors.getPromoCodes(state)
  };
};

const mapDispatchToProp = (dispatch) => {
  const actions = {...promoCodeActions};
  return bindActionCreators(actions, dispatch)
};

@connect(mapStateToProp, mapDispatchToProp)
export default class PromoCodeList extends Component {
  static propTypes = {
    currentPage: PropTypes.number,
    rowsPerPage: PropTypes.number,
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        column: PropTypes.string.isRequired,
        condition: PropTypes.string.isRequired,
        conditionValue: PropTypes.any,
        conditionFrom: PropTypes.any,
        conditionTo: PropTypes.any,
      })
    ),
    totalEntries: PropTypes.number,
    totalPages: PropTypes.number,
    location: PropTypes.object,
    loadPromoCodeList: PropTypes.func.isRequired
  };

  static contextTypes = {
    currentStore: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.refreshData(this.props);
  }

  componentDidUpdate(prevProps) {
    const prevPathKey = prevProps.location.pathname + prevProps.location.search;
    const pathKey = this.props.location.pathname + this.props.location.search;
    if (prevPathKey !== pathKey) {
      this.refreshData(this.props);
    }
  }

  refreshData(props) {
    let { params: { store_id }, location: { query: { per_page, page, filters } } } = props;
    let filtersObject = filterHelper.stringToFilters(filters);
    this.props.loadPromoCodeList(store_id, page, per_page, filtersObject)
  }

  render() {
    const { props, context } = this;
    const { promoCodes, currentPage, rowsPerPage, filters, totalEntries, totalPages } = props;
    const storeId = get(context, 'currentStore.id');
    const data = promoCodes.map(({id, code, discount, individual_user_quota:userQuota, total_quota:totalQuota, used_quota: usedQuota})=>({
      id,
      code,
      discount: discount.name,
      userQuota: userQuota?userQuota:'Unlimited',
      totalQuota: totalQuota?totalQuota:'Unlimited',
      usedQuota
    }))
    const columns = [
      {
        columnName: "code",
        displayName: "Promotion Code",
        filterConditions: ['contain', 'equal'],
      },
      {
        columnName: "discount",
        displayName: "Discount",
        filterConditions: ['equal'],
      },
      {
        columnName: "userQuota",
        displayName: "Individual User Quota",
        filterConditions: ['contain', 'equal', 'between'],
      },
      {
        columnName: "totalQuota",
        displayName: "Total Quota",
        filterConditions: ['contain', 'equal', 'between'],
      },
      {
        columnName: "usedQuota",
        displayName: "Used Quota",
      },
    ];
    const filterSettings = filterHelper.getFilterSettings(columns);
    const basePath = routeHelper.promoCodes(storeId);
    const handleSearch = filterHelper.onSearchFactory(basePath, rowsPerPage);
    const goToPage = filterHelper.goToPageFactory(basePath, rowsPerPage, filters);
    const updateRowsPerPage = filterHelper.updateRowsPerPageFactory(basePath, filters);
    const btnConfig = [
      {
        content: 'New Promotion Code',
        link: routeHelper.promoCodes(storeId, 'new'),
        permission: null, // TODO: add permission checking
        btnType: 'primary',
      },
    ];
    const actions = [
      {
        name: 'Edit',
        onClick: (promoCode)=>{
          routeHelper.goPromoCodes(storeId, promoCode.id)
        }
      }
    ]
    const bodyConfig = { data, columns, actions };
    const footerConfig = {
      currentPage,
      rowsPerPage,
      totalEntries,
      totalPages,
      goToPage,
      updateRowsPerPage,
    };

    return (
      <div>
        <MainContent className="-main-filter">
          <CascadeFilterCollection
            group="delivery_orders"
            settings={ filterSettings }
            filters={ filters }
            onSearch={ handleSearch }
          />
        </MainContent>
        <MainContent>
          <MainContentHeader title="Promotion Codes">
            <MainContentHeaderButtons config={ btnConfig } />
          </MainContentHeader>
          <Grid bodyConfig={ bodyConfig } footerConfig={ footerConfig } />
        </MainContent>
      </div>
    );
  }
}
