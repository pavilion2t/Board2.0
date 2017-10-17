import React from 'react'
import cx from 'classnames'

function Discount({discount, onSelect, active}) {
  return (
    <div className={cx("discount", {active})} onClick={onSelect.bind(this, discount)}>
      {discount.name}
      {active?<i className="fa fa-check-circle pull-right"/>:null}
    </div>
  )
}

export default Discount
