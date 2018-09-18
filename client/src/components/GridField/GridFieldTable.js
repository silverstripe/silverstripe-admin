import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GridFieldTable extends Component {
  /**
   * Generates the header component.
   *
   * Uses the header component passed via the `header` prop if it exists.
   * Otherwise generates a header from the `data` prop.
   *
   * @return object|null
   */
  generateHeader() {
    if (typeof this.props.header !== 'undefined') {
      return this.props.header;
    }

    if (typeof this.props.data !== 'undefined') {
      // TODO: Generate the header.
    }

    return null;
  }

  /**
   * Generates the table rows.
   *
   * Uses the components passed via the `rows` props if it exists.
   * Otherwise generates rows from the `data` prop.
   *
   * @return object|null
   */
  generateRows() {
    if (typeof this.props.rows !== 'undefined') {
      return this.props.rows;
    }

    if (typeof this.props.data !== 'undefined') {
      // TODO: Generate the rows.
    }

    return null;
  }

  render() {
    return (
      <div className="grid-field">
        <table className="table table-hover grid-field__table">
          <thead>{this.generateHeader()}</thead>
          <tbody>{this.generateRows()}</tbody>
        </table>
      </div>
    );
  }
}

GridFieldTable.propTypes = {
  data: PropTypes.object,
  header: PropTypes.object,
  rows: PropTypes.array,
};

export default GridFieldTable;
