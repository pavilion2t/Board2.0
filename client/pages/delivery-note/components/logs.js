import React, { PropTypes } from 'react';

import { MainContentSection } from '../../layout/main-content';
import Status from './indexStatus';
import DateTimeDisplay from '../../../components/date/dateTimeDisplay';

function Logs(props) {
    const { className, style } = props;
    const { qtySent = 0, invoices = [], logs = []} = props;
    return (
        <div className={ className } style={ style }>
            <MainContentSection>
                <div className="row">
                    <div className="col-xs-8">
                        <div>INVOICES</div>
                        {
                            invoices.map(id => <div key={ id }>{ id }</div>)
                        }
                    </div>
                    <div className="col-xs-4" style={ { textAlign: 'right' } }>
                        <div>QTY DELIVERED</div>
                        <div>{ qtySent }</div>
                    </div>
                </div>
            </MainContentSection>

            <table className="table data-table data-table--no-border">
                <thead>
                    <tr>
                        <th style={ { width: '60%' } }>Date</th>
                        <th style={ { width: '20%' } }>User</th>
                        <th style={ { width: '20%' } }>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        logs.map((log, i) =>
                            <tr key={ i }>
                                <td>{ <DateTimeDisplay value={ log.created_at } /> }</td>
                                <td>{ log.cashier_name }</td>
                                <td>
                                    <Status data={ log.state }/>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );
}

Logs.propTypes = {
    qtySent: PropTypes.number,
    invoices: PropTypes.arrayOf(
        PropTypes.string
    ),
    logs: PropTypes.arrayOf(
        PropTypes.shape({
            cashier_name: PropTypes.string.isRequired,
            created_at: PropTypes.object.isRequired,
            state: PropTypes.string,
        })
    ),
    className: PropTypes.string,
    style: PropTypes.object,
};

export default Logs;
