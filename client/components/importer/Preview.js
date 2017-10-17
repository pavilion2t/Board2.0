import React, {Component, PropTypes} from 'react';

export default class Preview extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired
  };

  render() {
    const { data } = this.props;
    // if (!data.length) return null;
    return (
      <div className="importer_preview">
        <h4 className="importer_preview-title">Preview</h4>
        <table className="importer_preview-table table listing-table">
          <tbody>
          { data.map((row, i) => {
            return (
              <tr key={ i }>
                <td>{ i > 0 ? i : '' }</td>
                { row.map((col, j) => {
                  return (
                    <td key={ `${i}-${j}` }>{ col }</td>
                  );
                }) }
              </tr>
            );
          }) }
          </tbody>
        </table>
      </div>
    );
  }
}
