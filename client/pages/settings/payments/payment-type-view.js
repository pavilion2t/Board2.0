import React, { PropTypes } from 'react';

function PaymentView(props) {
  let { data } = props;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Payment Type</th>
          <th>Tipping Enabled</th>
        </tr>
      </thead>
      <tbody>
        {
          data ? data.map(payment => (
            <tr key={ payment.id }>
              <td>{ payment.name }</td>
              <td>{ payment.tipping_enabled ?
                      <span className="label label-success">Enabled</span> :
                      <span className="label label-default">off</span>
                  }
              </td>
            </tr>
          )) : null
        }
      </tbody>
    </table>
  );
}
PaymentView.propTypes = {
  data: PropTypes.array,
};

export default PaymentView;
