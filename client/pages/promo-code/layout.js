import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { PROMO_CODE } from '~/constants';

import routeHelper from '~/helpers/routeHelper';

import * as baseSelectors from '~/selectors/baseSelectors';
import * as promoCodeSelectors from '~/selectors/promoCodeSelectors';

import * as promoCodeActions from '~/actions/promoCodeActions';

import {
  MainContent,
  MainContentHeader,
  MainContentHeaderButtons,
  MainContentTabs,
} from '~/pages/layout/main-content';
import Breadcrumb from '~/pages/layout/breadcrumb/breadcrumb';
import Overview from './components/overview';

const mapStateToProp = (state, props, context) => {
  return {
    loading: baseSelectors.getLoading(state),
    pageTitle: promoCodeSelectors.getPageTitle(state),
    breadcrumbTitle: promoCodeSelectors.getBreadcrumbTitle(state),
    pathInfo: promoCodeSelectors.getPathInfo(state),
    btnShowConfig: promoCodeSelectors.getButtonShowConfig(state),
    data: promoCodeSelectors.getItem(state),
    errMsg: promoCodeSelectors.getErrMsg(state),
    storeId: props.storeId
  };
};

const mapDispatchToProp = (dispatch) => {
  const actions = {
    ...promoCodeActions,
  };
  return bindActionCreators(actions, dispatch);
};

@connect(mapStateToProp, mapDispatchToProp)
export default class PromoCodeLayout extends Component {
  static propTypes = {
  };

  static contextTypes = {
    currentStore: PropTypes.object.isRequired,
  };

  // componentDidMount(){
  //   const props = this.props || {};
  //   const { mode, storeId, promoCodeId } = props;
  //   props.initPromoCode(mode, storeId, promoCodeId);
  // }

  render() {
    const { props } = this;
    const { loading, pageTitle, breadcrumbTitle, storeId, pathInfo = {}, btnShowConfig = {}, data = {} } = props;
    const { mode, promoCodeId, tab } = pathInfo;
    const btnConfig = [
      {
        content: 'Cancel',
        disabled: loading,
        show: btnShowConfig.cancelEdit,
        onClick: () => props.cancelEditPromoCode(mode, storeId, promoCodeId),
      },
      {
        content: 'Save',
        disabled: loading,
        show: btnShowConfig.saveEdit,
        btnType: 'primary',
        onClick: () => props.savePromoCode(storeId, data)
      },
    ];
    let mainContent = null;
    if (tab === PROMO_CODE.TAB.OVERVIEW){
      mainContent = <Overview />;
    }

    return (
      <MainContent>
        <MainContentHeader title={ pageTitle }>
          <MainContentHeaderButtons config={ btnConfig } />
        </MainContentHeader>

        <Breadcrumb links={
          [
            { label: 'Promotion' },
            { label: 'Promotion Codes', link: routeHelper.promoCodes(storeId) },
            { label: breadcrumbTitle },
          ]
        }/>
        <MainContentTabs
          tabs={
            [
              { label: 'Overview', value: PROMO_CODE.TAB.OVERVIEW },
            ]
          }
          currentTab={ tab }
        />

        { mainContent }

      </MainContent>
    );
  }
}
