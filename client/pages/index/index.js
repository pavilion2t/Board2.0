import React, { PropTypes } from 'react';
import PageLoading from '../../components/loading/loading';

export default class Index extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    appState: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  componentWillMount() {
    this.props.actions.getStores();
  }
  componentWillReceiveProps(nextProps) {
    this.checkStore(nextProps);
  }
  checkStore(props) {
    let stores = props.appState.stores;

    if (stores.length > 0) {
      if (!props.params.store_id) {
        this.context.router.push({
          pathname: `/v2/${stores[0].id}/inventory`,
        });
      }
    }
  }

  render() {
    return (
      <div id="login-layout">
        <div className="login-layout-main">
          <div>
            <PageLoading>Loading Stores</PageLoading>
          </div>
        </div>
        <div className="login-layout-footer">
          <div className="copyright">
            <p>2016 Bindo Labs, Inc. All rights reserved.</p>
            <p>Bindo is a registered trademark of Bindo Labs, Inc</p>
          </div>
        </div>
      </div>
    );
  }
}
