import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Uom from './uom';

import InputBox from '~/components/input-box';

export default class OverviewForm extends Component {
  static propTypes = {
    groupName: PropTypes.string.isRequired,
    units: PropTypes.array.isRequired,
    referenceUnit: PropTypes.object.isRequired,

    editMode: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isCreating: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,

    actions: PropTypes.object.isRequired
  };

  render() {
    const { groupName, editMode, isCreating, actions, referenceUnit, units  } = this.props;

    return (
      <div>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main"> </h1>
          <div>
            { editMode && <button className="btn btn-primary btn-sm" onClick={ actions.submit }>Save</button> }
            { !editMode && <button className="btn btn-primary btn-sm" onClick={ actions.enableEditMode }>Edit</button> }
          </div>
        </header>
        <div className="main-content-section">
          <InputBox title="GROUP NAME"
                    value={ groupName }
                    disabled={ !editMode }
                    onChange={ (e) => actions.changeGroupName(e.target.value) }/>
          <br/>
          <h3>Reference Unit</h3>
          <Uom name={ referenceUnit.name }
               ratio={ referenceUnit.ratio }
               isBaseUnit
               onNameChange={ (val) => actions.changeUnitName(val, undefined) }
               onRatioChange={ (val) => actions.changeUnitRatio(val, undefined) }
               disabled={ !editMode || !isCreating } />
        </div>
        <div className="main-content-section">
          <h3>Uom Group</h3>
          <div className="row">
            { units.map((group, i) => (
              <div className="col-md-12" key={ i }>
                <Uom name={ group.name }
                     ratio={  group.ratio }
                     onNameChange={ (val) => actions.changeUnitName(val, i) }
                     onRatioChange={ (val) => actions.changeUnitRatio(val, i) }
                     onRemove={ () => actions.removeUnit(i) }
                     disabled={ !editMode }/>
              </div>))
            }
          </div>
          <a className={ classnames('_add', { '__disabled': !editMode }) } onClick={ editMode ? actions.addUomUnit : () => {} }><i className="fa fa-plus-circle" /> Add New Unit</a>
        </div>
      </div>
    );
  }
}
