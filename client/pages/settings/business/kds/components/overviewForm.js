import React, { Component, PropTypes } from 'react';

import InputBox from '~/components/input-box';
import Priority from './priority';
import MatchingCriteria from './matchingCriteria';

const STATION_TYPES = {
  0: 'Kitchen Display',
  1: 'Queueing Display',
  2: 'Queue Monitor Display'
};

export default class OverviewForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    need_aggregation: PropTypes.bool.isRequired,
    aggregation_minutes: PropTypes.number.isRequired,
    station_priorities: PropTypes.array.isRequired,
    matchCriteria: PropTypes.array.isRequired,
    //pending
    show_in_progress: PropTypes.bool.isRequired,
    // display_view: PropTypes.number.isRequired,

    openDepartmentSelection: PropTypes.func,
    openStatusSelection: PropTypes.func,
    changeStationName: PropTypes.func,
    changeShowInProgressState: PropTypes.func,
    // selectDisplayView: PropTypes.func,
    addMatchingCriteria: PropTypes.func,
    changePriority: PropTypes.func,
    toggleAggregation: PropTypes.func,
    changeAggregationTime: PropTypes.func,
    changeMatchingCriteria: PropTypes.func,
    save: PropTypes.func,
    discard: PropTypes.func,
  };

  render() {
    const {
      initialValues,
      name,
      need_aggregation,
      aggregation_minutes,
      station_priorities,
      matchCriteria,
      show_in_progress,
      // display_view,

      discard,
      save,
      openDepartmentSelection,
      openStatusSelection,
      changeStationName,
      changeShowInProgressState,
      // selectDisplayView,
      addMatchingCriteria,
      changePriority,
      toggleAggregation,
      changeAggregationTime,
      changeMatchingCriteria,
    } = this.props;

    const { station_key, signature_key, station_type } = initialValues;

    const isKds = !station_type;

    return (
      <div>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main"/>
          { isKds && <div>
            <button className="btn btn-secondary btn-sm"
                    onClick={ discard }
                    type="submit">Cancel</button>
            &nbsp;
            <button className="btn btn-primary btn-sm"
                    onClick={ save }
                    type="submit">Save</button>
          </div> }
        </header>
        <div className="main-content-section">
          <h1 >Station: { station_key }</h1>
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <div className="input-box">
                <p className="input-box__title">WAN IP</p>
                <span className="input-box__input">-</span>
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              <div className="input-box">
                <p className="input-box__title">LAN IP</p>
                <span className="input-box__input">-</span>
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              <div className="input-box">
                <p className="input-box__title">STATION KEY</p>
                <span className="input-box__input">{ station_key }</span>
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              <div className="input-box">
                <p className="input-box__title">STATION VIEWER URL</p>
                <a className="input-box__input">{ `kds.bindo.com/${station_key}` }</a>
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              <div className="input-box">
                <p className="input-box__title">ACTIVATION CODE</p>
                <span className="input-box__input">{ signature_key }</span>
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              <div className="input-box">
                <p className="input-box__title">STATION TYPE</p>
                <span className="input-box__input">{ STATION_TYPES[station_type || 0] }</span>
              </div>
            </div>
          </div>
        </div>
        { isKds && <div className="main-content-section">
          <h1>Station Settings</h1>
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <InputBox title="Station Name"
                        value={ name }
                        onChange={ (e) => changeStationName(e.target.value) }
                        type="text"/>
            </div>
          </div>
          <p><input type="checkbox"
                    checked={ show_in_progress }
                    value={ show_in_progress }
                    onChange={ e => changeShowInProgressState(e.target.checked) }/> Show In Progress State</p>
        </div> }
        { isKds && <div className="main-content-section">
              <h1>Matching Criteria</h1>
              { matchCriteria && matchCriteria.map((m, i) => <MatchingCriteria key={ i }
                                                                               number={ m.match_group_number }
                                                                               status={ m.status }
                                                                               showPrematureItems={ m.show_premature_items }
                                                                               departments={ m.departments }
                                                                               changeMatchingCriteria={ changeMatchingCriteria }
                                                                               openDepartmentSelection={ openDepartmentSelection }
                                                                               openStatusSelection={ openStatusSelection } />) }
              <a className="btn" onClick={ addMatchingCriteria }><i className="fa fa-plus-circle" /> Add New Matching Criteria</a>
            </div>
        }
        { isKds && <div className="main-content-section">
          <h1>Priority(from order time)</h1>
          { (station_priorities && station_priorities.length > 0) && station_priorities.map((p, i) => {
            const { name, minutes, color, id } = p;
            return (<Priority key={ i }
                              color={ color }
                              minutes={ minutes }
                              onChange={ (val) => changePriority({ id, minutes: val, name, color }) }
                              name={ name }/>);
          }) }
        </div>
        }
        { isKds && <div className="main-content-section">
          <h1>Aggragation / Grouping</h1>
          <div className="row">
            <span className="col-md-2">Aggregation Gate</span>
            <p className="col-md-1"><input type="radio"
                                           checked={ need_aggregation === true }
                                           onChange={ e => e.target.checked ? toggleAggregation(true) : null }
                                           value="true"/> on</p>
            <p className="col-md-1"><input type="radio"
                                           checked={ need_aggregation === false }
                                           onChange={ e => e.target.checked ? toggleAggregation(false) : null }
                                           value="false"/> off</p>
          </div>
          <div className="row">
            <span className="col-md-4">Aggregation Gate All Same Items Within</span>
            <div className="col-md-8">
              <p><input type="number"
                        value={ aggregation_minutes }
                        onChange={ e => changeAggregationTime(parseInt(e.target.value)) }
              /> mins</p>
            </div>
          </div>
        </div>
        }
        </div>
      );
    }
}
