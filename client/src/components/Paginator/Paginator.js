import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18n';

function Paginator(props) {
  // Note that props.page is 1-based i.e. the first page is 1, not 0
  const totalPages = Math.ceil(props.totalItems / props.maxItemsPerPage);

  /**
   * Creates an array of <option> elements for the page selection dropdown.
   * Each option represents a page number from 1 to totalPages.
   */
  function createOptions() {
    const options = [];
    for (let page = 1; page <= totalPages; page++) {
      options.push(<option key={page} value={page}>{page}</option>);
    }
    return options;
  }

  /**
   * Handler for whena new page is selected
   */
  function handleChangePage(page) {
    props.onChangePage(page);
  }

  /**
   * Handler for when the user selects a new page from the dropdown.
   */
  function handleSelect(evt) {
    const page = evt.target.value * 1;
    handleChangePage(page);
  }

  /**
   * Handler for when the user clicks the "Previous" button.
   */
  function handlePrev() {
    handleChangePage(props.currentPage - 1);
  }

  /**
   * Handler for when the user clicks the "Next" button.
   */
  function handleNext() {
    handleChangePage(props.currentPage + 1);
  }

  /**
   * Renders the page selection dropdown.
   */
  function renderSelect() {
    return <>
      <select
        value={props.currentPage}
        onChange={(evt) => handleSelect(evt)}
      >
        {createOptions()}
      </select> / {totalPages}
    </>;
  }

  /**
   * Renders the "Previous" button.
   */
  function renderPrevButton() {
    if (props.currentPage === 1) {
      return null;
    }
    const label = i18n._t('Admin.PREVIOUS', 'Previous');
    return <button type="button" onClick={() => handlePrev()}>
      <span className="paginator-icon font-icon-angle-left" aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </button>;
  }

  /**
   * Renders the "Next" button.
   */
  function renderNextButton() {
    if (props.currentPage === totalPages) {
      return null;
    }
    const label = i18n._t('Admin.NEXT', 'Next');
    return <button type="button" onClick={() => handleNext()}>
      <span className="paginator-icon font-icon-angle-right" aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </button>;
  }

  // Render the paginator
  return <div className="paginator-footer">
    <div>
      <div className="paginator-prev">{renderPrevButton()}</div>
      <div className="paginator-page">{renderSelect()}</div>
      <div className="paginator-next">{renderNextButton()}</div>
    </div>
  </div>;
}

Paginator.propTypes = {
  totalItems: PropTypes.number.isRequired,
  maxItemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
};

export { Paginator as Component };

export default Paginator;
