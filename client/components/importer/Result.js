import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Result extends Component {
  static propTypes = {
    errors: PropTypes.array.isRequired,
    warnings: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      shownDetail: false
    };
  }

  renderTable() {
    const { errors, warnings } = this.props;
    return (
      <ul>
        {  errors.map((issue, i) => {
          return (
            <li key={  `error${ i }`  }>
              <i className="fa fa-times-circle"/>
              <span> Row {  issue.row  } </span>
              <span>- {  issue.value  }</span>
            </li>
          );
        })  }
        {  warnings.map((issue, i) => {
          return (
            <li key={  `warning${ i }`  }>
              <i className="fa fa-exclamation-triangle text-warning"/>
              <span> Row {  issue.row  } </span>
              <span>- {  issue.value  }</span>
            </li>
          );
        })  }
      </ul>
    );
  }


  render() {
    const { errors, warnings } = this.props;
    const { shownDetail } = this.state;
    let noOfErrors = errors.length;
    let noOfWarnings = warnings.length;
    let issues = errors.concat(warnings);


    return (
      <div>
        <h4>Result </h4>
        <div className={  classNames('alert importer_result', {
          'alert-success': issues.length === 0,
          'alert-error': errors.length > 0,
          'alert-warnings': errors.length === 0 && warnings.length > 0
        }) }>
          <div className={  classNames({
            'importer_response--error': noOfErrors > 0,
            'importer_response--success': noOfErrors === 0
          })  }>
            {  (noOfWarnings > 0 && noOfErrors === 0) &&
            <span className="importer_response-text">Import is successful but there are some warnings - </span>  }
            {  noOfErrors > 0 &&
            <span className="importer_response-text">Import is unsuccessful due to errors - </span>  }
            {  issues.length === 0 && <span className="importer_response-text">Import is successful - </span>  }
            {  noOfErrors === 0 && <span>1 Success</span>  }
            {  noOfErrors > 0 && <span>{  ` ${  noOfErrors } Error` }</span>  }
            {  noOfWarnings > 0 && <span >{  ` ${  noOfWarnings } Warning`  }</span>  }
            {  (issues.length > 0 && !shownDetail) &&
            <a onClick={  () => this.setState({ shownDetail: true })  }> <i className="fa fa-caret-down fa-lg"/></a> }
            {  (issues.length > 0 && shownDetail) &&
            <a onClick={  () => this.setState({ shownDetail: false })  }> <i className="fa fa-caret-up fa-lg"/></a> }
          </div>
          {  shownDetail && this.renderTable()  }
        </div>
      </div>

    );
  }
}
