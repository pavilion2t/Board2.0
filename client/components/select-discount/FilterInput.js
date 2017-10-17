import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {filterChange} from '~/actions/componentActions/selectDiscountActions'

class FilterInput extends React.Component{
  constructor(props){
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(event){
    this.props.onChange(event.target.value)
  }
  render(){
    let {value} = this.props
    return (
      <div className="discount-filter">
        <input
          className="form-control"
          value={value}
          onChange={this.handleChange}
          placeholder="filter by discount name"
        />
      </div>
    )
  }
}

FilterInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

function mapStateToProp(state){
  return {
    value: state.components.selectDiscount.filter
  }
}

function mapDispatchToProp(dispatch) {
  return {
    onChange: value=>dispatch(filterChange(value))
  }
}

export default connect(mapStateToProp, mapDispatchToProp)(FilterInput)
