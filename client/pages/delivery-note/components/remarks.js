import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import * as actions from '../../..//actions/index';

import { MainContentSection } from '../../layout/main-content';
import FormGroup from '../../../components/form-group/formGroup';

import { VIEW } from '../constant';

const fields = [
    'delivery_order.remarks',
];

class Remarks extends Component {
    render() {
        const props = this.props;
        const { className, style, pathState = {} } = props;
        const { page } = pathState;
        const {
            fields: {
                delivery_order: { remarks }
            }
        } = props;
        return (
            <div className={ className } style={ style }>
                <MainContentSection>
                    <FormGroup label="NOTE" autoHideHelpText>
                        <textarea className="form-control" value={ remarks.value } readOnly={ page === VIEW } onChange={ remarks.onChange }/>
                    </FormGroup>
                </MainContentSection>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    const appState = state;
    const { base: { loading }, entities, deliveryOrder: pathState } = state;
    return { appState, pathState, entities, loading };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(actions, dispatch) };
};

Remarks.propTypes = {
    remarks: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
};

export default reduxForm({
    form: 'deliveryOverviewForm',
    fields: fields,
    destroyOnUnmount: false,
}, mapStateToProps, mapDispatchToProps)(Remarks);
