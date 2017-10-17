import React, {Component, PropTypes} from 'react';
import pick from 'lodash/pick';
import keys from 'lodash/keys';
import cloneDeep from 'lodash/cloneDeep';
import FilterHelper from '~/helpers/filterHelper';
import routeHelper from '~/helpers/routeHelper';
import CascadeFilterCollection from '~/components/cascade-filter/cascadeFilterCollection';

import Loading from '~/components/loading/loading';
import LinkStationModal from './components/linkStation';
import { GridBody } from '~/components/grid';
import { GridRowsPerPage } from '~/components/grid/gridFooter';
import { Link } from 'react-router';

const STATION_TYPES = {
  0: 'Kitchen Display',
  1: 'Queueing Display',
  2: 'Queue Monitor Display'
};

export default class SettingsBusinessKdsIndex extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    appState: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.handleLinkStation = this.handleLinkStation.bind(this);
    this.state = {
      modalIsOpen: false,
      linkError: false,
    };

    this.gridActions = [
      { name: 'Edit', onClick: (item) => {
        const { id } = item;
        const { store_id } = this.props.params;
        routeHelper.goStations(store_id, id);
      } },
      { name: 'View with browser', onClick: () => {} },
      { name: 'Remove', onClick: (item) => {
        if (!confirm('Do you really want to delete this item?')) return false;
        this.props.actions.removeStation(item.id, this.props.params.store_id);
      } },
    ];

    this.columnMetadatas = [{
      columnName: "name",
      displayName: "STATION NAME",
      filterConditions: [ 'contain', 'equal' ]
    },{
      columnName: "wan_ip",
      displayName: "WAN IP",
      filterConditions: [ 'contain', 'equal' ]
    },{
      columnName: "lan_ip",
      displayName: "LAN IP",
      filterConditions: [ 'contain', 'equal' ]
    },{
      columnName: "station_key",
      displayName: "STATION Key",
      filterConditions: [ 'contain', 'equal' ],
      customComponent: (props) => {
        const { rowData, data } = props;//eslint-disable-line react/prop-types
        const { id } = rowData;
        const { store_id } = this.props.params;
        let path = routeHelper.stations(store_id, id);
        return (<Link to={ path }>{ data }</Link>);
      }
    },{
      columnName: "station_type",
      displayName: "STATION TYPE",
      filterConditions: [ 'equal' ],
      customComponent: (props) => {
        let { data } = props;//eslint-disable-line react/prop-types
        let type = data === " " ? 0 : data;
        return (<span>{ STATION_TYPES[type] }</span>);
      }
    }];

    this.filterSettings = this.columnMetadatas
      .map(column => pick(column, 'columnName', 'displayName', 'filterConditions'));

  }

  componentDidMount() {
    let { store_id } = this.props.params;
    let { count, page, filters } = this.props.location.query;
    let filtersObject = FilterHelper.stringToFilters(filters);

    let status = {};
    if (count) status.count = count;
    if (page) status.page = page;
    this.props.actions.updateStationsStatus(status);
    this.props.actions.getStations(store_id, page, count, undefined, filtersObject);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname ||
      this.props.location.search !== nextProps.location.search) {
      let { store_id } = nextProps.params;
      let { filters } = nextProps.location.query;
      let filtersObject = FilterHelper.stringToFilters(filters);

      this.props.actions.getStations(store_id, filtersObject);
    }
  }

  handleRowsPerPageChange = (perPage) => {
    const { store_id } = this.props.params;
    const { filters } = this.props.appState.kdsStatus;
    let filterString = FilterHelper.filtersToString(filters);

    this.props.actions.updateStationsFilters(filters);
    // this.props.actions.getStations(store_id, page, count, undefined, filters);
    this.context.router.push({
      pathname: routeHelper.stations(store_id),
      query: {
        page: 1,
        count: perPage,
        filters: filterString
      }
    });
  };

  handleSearch = (filters) => {
    const { store_id, page, count } = this.props.params;
    let filterString = FilterHelper.filtersToString(filters);
    this.props.actions.updateStationsFilters(filters);
    this.props.actions.getStations(store_id, page, count, undefined, filters);
    this.context.router.push({
      pathname: routeHelper.stations(store_id),
      query: {
        page: page,
        count: count,
        filters: filterString
      }
    });
  };

  handleLinkStation = (key) => {
    let {store_id} = this.props.params;
    this.setState({linkError: false});
    this.props.actions.linkStationToStore(key, store_id).then(result => {
      let { id, error } = result;
      if (id) {
        this.setState({ modalIsOpen: false });
        routeHelper.goStations(store_id, id);
      }
      if (error) {
        this.setState({linkError: true});
      }
    }) ;
  };

  render() {
    const { appState } = this.props;
    const { modalIsOpen, linkError } = this.state;
    const { entities, kdsStatus } = appState;

    let data = [];

    if (entities.stations){
      keys(entities.stations).forEach(key => {
        data.push(entities.stations[key]);
      });
    }

    return (
      <div>
        <LinkStationModal isOpen={ modalIsOpen }
                          failure={ linkError }
                          onRequestClose={ () => this.setState({ modalIsOpen: false }) }
                          onSubmit={ this.handleLinkStation }/>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main"> </h1>
          <button className="btn btn-primary btn-sm" onClick={ () => this.setState({ modalIsOpen: true }) }>New</button>

        </header>
        <div className="main-content -main-filter">
          <CascadeFilterCollection
            group="stations"
            settings={ this.filterSettings }
            filters={ kdsStatus.filters }
            onSearch={ this.handleSearch }
          />
        </div>
        <div className="main-content">
          <div>
            { kdsStatus.loading ?
              (
                <Loading>Loading...</Loading>
              ) : (
              <div className="grid">
                <GridBody data={ cloneDeep(data) }
                          actions={ this.gridActions }
                          columns={ this.columnMetadatas } />
                <GridRowsPerPage totalEntries={ kdsStatus.totalCount }
                                 rowsPerPage={ kdsStatus.count }
                                 currentPage={ kdsStatus.page }
                                 updateRowsPerPage={ this.handleRowsPerPageChange } />
              </div>
            )
            }
          </div>
        </div>
      </div>
    );
  }
}
