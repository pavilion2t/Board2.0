import React, { Component, PropTypes } from 'react';

let dotStyle = {
  width: '0px',
  borderWidth: '4px'
};

export default class Priority extends Component {
  static propTypes = {
    name: PropTypes.string,
    minutes: PropTypes.number,
    color: PropTypes.string,
    onChange: PropTypes.func
  };

  render() {
    const { name, minutes, color, onChange } = this.props;

    dotStyle.borderColor = color;

    return (
      <div className="row" >
        <span className="col-md-1" style={ dotStyle }/>
        <span className="col-md-2">{ name } Passed</span>
        <p className="col-md-9"><input type="number"
                                        onChange={ (e) => onChange(parseInt(e.target.value)) }
                                        value={ minutes } /> mins</p>
      </div>
    );
  }
}
