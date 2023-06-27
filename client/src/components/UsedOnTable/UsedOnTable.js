import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import i18n from 'i18n';
import Loading from 'components/Loading/Loading';
import provideUsedOnData from './provideUsedOnData';

class UsedOnTable extends PureComponent {
  renderHeader() {
    return (
      <thead>
        <tr>
          <th scope="col" className="used-on__col--index">{i18n._t('Admin.USED_ON_NUM', '#')}</th>
          <th scope="col" className="used-on__col--title">{i18n._t('Admin.USED_ON', 'Used on')}</th>
        </tr>
      </thead>
    );
  }

  renderBody() {
    const { usedOn, loading, error } = this.props;

    if (error || !usedOn || !usedOn.length) {
      let message = null;
      let classState = null;

      if (error) {
        message = i18n.inject(
          i18n._t('Admin.LOADING_ERROR', 'As error occured when loading the data: {message}'),
          { message: error },
        );
        classState = 'error';
      } else if (loading) {
        message = <Loading />;
        classState = 'loading';
      } else {
        message = i18n._t('Admin.NOT_USED', 'This file is currently not in use.');
        classState = 'empty';
      }

      const className = classnames([
        'used-on__message',
        `used-on__message--${classState}`,
      ]);

      return (
        <tbody aria-live="polite">
          <tr>
            <td className={className} colSpan="3">{message}</td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody aria-live="polite">
        {usedOn.map(this.renderRow)}
      </tbody>
    );
  }

  renderRow(data, index) {
    const { id, type } = data;
    const rowData = data.ancestors
      ? [data].concat(data.ancestors).reverse()
      : [data].reverse();
    let cellLink = '#';
    let isFirst = true;
    const titleLinks = rowData.map((arr, i) => {
      let title = arr.title;
      const link = arr.link;
      if (title && title.length >= 25) {
        title = `${title.substring(0, 25).trim()}...`;
      }
      if (link) {
        cellLink = link;
      }
      const key = `${index}-${id}-${i}`;
      const cssClasses = ['used-on__title-item'];
      if (isFirst) {
        cssClasses.push('used-on__title-item--first');
        isFirst = false;
      }
      return <li className={classnames(cssClasses)} key={key}>{title}</li>;
    });
    const key = `${index}-${id}`;
    return (
      <tr key={key} className="used-on__row">
        <td className="used-on__col--index">
          <a href={cellLink} className="used-on__cell-link">{index + 1}</a>
        </td>
        <td className="used-on__col--title">
          <a href={cellLink} className="used-on__cell-link">
            <ul className="used-on__title-items">{titleLinks}</ul>
            <span className="used-on__type">{type}</span>
          </a>
        </td>
      </tr>
    );
  }

  render() {
    return (
      <table className="table used-on__table">
        {this.renderHeader()}
        {this.renderBody()}
      </table>
    );
  }
}

UsedOnTable.propTypes = {
  loading: PropTypes.bool,
  usedOn: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    type: PropTypes.string,
    link: PropTypes.string,
    ancestors: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      link: PropTypes.string,
    })).isRequired,
  })),
  error: PropTypes.string,
};

export { UsedOnTable as Component };

export default provideUsedOnData(UsedOnTable);
