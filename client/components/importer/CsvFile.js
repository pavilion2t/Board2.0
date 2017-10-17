import React, { Component, PropTypes } from 'react';
import sampleFile from './sample/coupons.csv';

export default class Status extends Component {
  static propTypes = {
    onUpload: PropTypes.string.isRequired
  };

  static defaultProps = {
    sample: 'javascript:void(0);',
    fullSample: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      value: ''//hack, if the uploaded file with the same name, the handleFile function will not be called.
    };
  }

  handleFile = () => {
    const reader = new FileReader();
    let fileBlob = this.refs.file.files[0];
    reader.onload = (evt) => {
      const resultText = evt.target.result;
      this.props.onUpload(resultText, fileBlob, 'csv');
    };
    reader.readAsText(fileBlob);
  };

  render() {
    return (
      <div className="">
        <div className="fileUpload btn btn-primary btn-sm">
          <span><i className="fa fa-upload"/> Choose CSV File</span>
          <input type="file"
                 ref="file"
                 name="file"
                 value={ this.state.value }
                 onChange={ this.handleFile }
                 accept=".csv"/>
        </div>
        <small><a href={ sampleFile } target="_blank">   ( Sample CSV )</a></small>
      </div>
    );
  }
}
