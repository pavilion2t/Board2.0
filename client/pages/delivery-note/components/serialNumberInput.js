import React, { Component, PropTypes } from 'react';
import ModalToggle from '../../../components/modal/modal-toggle';

class SerialNumberInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serialNumbers: [null],
        };
    }

    componentWillReceiveProps(nextProps) {
        const serialNumbers = (nextProps.serialNumbers||[]).map(d => d.value).concat(null);
        this.setState({ serialNumbers });
    }

    _confirm() {
        const { serialNumbers } = this.props;
        let data = this.state.serialNumbers || [];
        data = data.filter(this._filter).map(d => d.trim());
        const ret = this.props.onConfirm(data);
        if (ret !== false) {
            for (let i = serialNumbers.length - 1; i >= 0; i--) {
                serialNumbers.removeField(i);
            }
            data.forEach(d => serialNumbers.addField(d));
        }
    }

    _change(i, value) {
        let { max = -1 } = this.props;
        let { serialNumbers = [] } = this.state;
        serialNumbers = serialNumbers.slice(0);
        serialNumbers[i] = value;
        if (i === serialNumbers.length - 1 && value != null && value !== '') {
            serialNumbers.push(null);
        }
        this._refresh({ serialNumbers }, max);
    }

    _remove(i) {
        let { serialNumbers = [] } = this.state;
        serialNumbers = serialNumbers.slice(0);
        if (i >= 0 && i < serialNumbers.length) {
            serialNumbers.splice(i, 1);
        }
        this._refresh({ serialNumbers });
    }

    _filter(d) {
        return d != null && d !== '';
    }

    _refresh(state, max) {
        let { serialNumbers = [] } = state;
        serialNumbers = serialNumbers.slice(0);
        let lastValue = serialNumbers[serialNumbers.length - 1];
        if (this._filter(lastValue)) {
            serialNumbers.push(null);
        }
        if (max >= 0) {
            serialNumbers = serialNumbers.slice(0, max);
        }
        this.setState({ serialNumbers });
    }

    render() {
        const _confirm = this._confirm.bind(this);
        const props = this.props;
        const { productName = 'Serial Number' } = props;
        const state = this.state;
        const { serialNumbers = [] } = state;

        return (
            <ModalToggle
                header={ productName }
                togglerLabel="Enter S/N"
                togglerStyle={ { width: 250 } }
                onConfirm={ _confirm }
                >
                {
                    serialNumbers.map((sn, i) => (
                        <div className="form-group" key={ i }>
                            <label>Serial Number { i + 1 }</label>
                            <div style={ { display: 'flex' } }>
                                <input className="form-control" style={ { flex: 1 } }
                                    value={ sn } onChange={ event => this._change(i, event.target.value) } />
                                <span
                                    className="btn btn-sm"
                                    style={ {
                                        marginLeft: 10,
                                        visibility: i === serialNumbers.length - 1 ? 'hidden' : 'visible'
                                    } }
                                    onClick={ event => this._remove(i) }
                                    >x</span>
                            </div>
                        </div>
                    ))
                }
            </ModalToggle>
        );
    }
}

SerialNumberInput.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    productName: PropTypes.string,
    serialNumbers: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
    })),
    max: PropTypes.number,
};

export default SerialNumberInput;
