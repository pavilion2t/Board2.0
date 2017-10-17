import React, { PropTypes } from 'react';

import './slip.scss';

function Slip(props) {
    const { className = '', style, details = [], totals = []} = props;
    return (
        <table className={ `slip ${className}` } style={ style }>
            <tbody>
                {
                    details
                        .filter(item =>  typeof item.hide === 'function' ? !item.hide(item) : !item.hide)
                        .map((item, i, filteredDetails) => {
                            const isLastRow = i === filteredDetails.length - 1;
                            const className = `slip__detail ${ isLastRow ? 'slip__detail--last-row' : ''} ${ item.className || ''}`;
                            return (
                                item.title ?
                                    <tr key={ `detail-${i}` } className={ className } style={ item.style }>
                                        <td className="slip__title" colSpan="3">{ item.title }</td>
                                    </tr>
                                    :
                                    <tr key={ `detail-${i}` } className={ className } style={ item.style }>
                                        <td className="slip__field">{ item.field }</td>
                                        <td className="slip__value">{ item.value }</td>
                                        <td></td>
                                    </tr>
                            );
                        })
                }
                {
                    totals
                        .filter(item =>  typeof item.hide === 'function' ? !item.hide(item) : !item.hide)
                        .map((item, i) => {
                            return (
                                item.title ?
                                    <tr key={ `total-${i}` } className="slip__total" style={ item.style }>
                                        <td className="slip__title" colSpan="3">{ item.title }</td>
                                    </tr>
                                    :
                                    <tr key={ `total-${i}` } className="slip__total" style={ item.style }>
                                        <td className="slip__field">{ item.field }</td>
                                        <td className="slip__value">{ item.value }</td>
                                        <td></td>
                                    </tr>
                            );
                        })
                }
            </tbody>
        </table>
    );
}

Slip.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    details: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            field: PropTypes.string,
            value: PropTypes.node,
            style: PropTypes.object,
            hide: PropTypes.oneOfType([
                PropTypes.func,
                PropTypes.bool,
            ]),
        })
    ),
    totals: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            field: PropTypes.string,
            value: PropTypes.node,
            style: PropTypes.object,
            hide: PropTypes.oneOfType([
                PropTypes.func,
                PropTypes.bool,
            ]),
        })
    ),
};

export default Slip;
