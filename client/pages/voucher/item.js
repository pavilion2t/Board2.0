import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Importer from '~/components/importer';
import * as importerActions from '~/actions/formActions/fileImporter';

function mapStateToProps(state) {
  const { fileImporter } = state.forms;
  return {
    importerState: fileImporter
  };
}

function mapDispatchToProps(dispatch) {
  return {
    importerActions: bindActionCreators(importerActions, dispatch)
  };
}

class VoucherItem extends Component {
  static propTypes = {
    params: PropTypes.shape({
      store_id: PropTypes.string.isRequired,
      discount_id: PropTypes.string.isRequired
    }).isRequired,
    children: PropTypes.element.isRequired,
    importerState: PropTypes.object.isRequired,
    importerActions: PropTypes.object.isRequired
  };

  render() {
    const { importerState, importerActions, params } = this.props;
    const { store_id, discount_id } = params;
    const path = `/v2/${store_id}/vouchers/${discount_id}`;
    const importerProps = Object.assign({}, importerState, {
      title: "Import Voucher",
      onClose: importerActions.closeFileImporter,
      onUpload: importerActions.uploadFile,
      onSubmit: importerActions.submitFile,
    });

    const importerOpener = () => {
      importerActions.showFileImporter(store_id, discount_id);
    };

    return (
      <div className="main-content">
        <Importer { ...importerProps }/>
        <div className="main-content-tab">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link to={ `${path}/overview` } className="nav-link" activeClassName="active">Overview</Link>
            </li>
            <li className="nav-item">
              <Link to={ `${path}/associate` } className="nav-link" activeClassName="active">Associated Products</Link>
            </li>
            <li className="nav-item">
              <Link to={ `${path}/vouchers` } className="nav-link" activeClassName="active">Vouchers</Link>
            </li>
          </ul>
        </div>
        { React.cloneElement(this.props.children, { importerOpener }) }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VoucherItem);
