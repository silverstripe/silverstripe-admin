import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import i18n from 'i18n';
import provideUsedOnData from './provideUsedOnData';

class UsedOnTable extends PureComponent {
  renderHeader() {
    return (
      <thead>
        <tr>
          <th className="used-on__col--index">#</th>
          <th className="used-on__col--title">{i18n._t('Admin.USED_ON', 'Used on')}</th>
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
        message = i18n._t('Admin.LOADING', 'Loading...');
        classState = 'loading';
      } else {
        message = i18n._t('Admin.NOT_USED', 'This is not used anywhere');
        classState = 'empty';
      }

      const className = classnames([
        'used-on__message',
        `used-on__message--${classState}`,
      ]);

      return (
        <tbody>
          <tr>
            <td className={className} colSpan="3">{message}</td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {usedOn.map(this.renderRow)}
      </tbody>
    );
  }

  renderRow(data, index) {
    const {
      id,
      title,
      type,
      link,
    } = data;

    const titleLabel = (link)
      ? <a className="used-on__edit-link" href={link}>{title}</a>
      : <span>{title}</span>;

    return (
      <tr key={id} className="used-on__row">
        <td className="used-on__col--index">{index + 1}</td>
        <td className="used-on__col--title">
          <span className="used-on__title">{titleLabel}</span>
          <span className="used-on__type">{type}</span>
        </td>
      </tr>
    );
  }

  render() {
    return (
      <table className="table">
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
    state: PropTypes.string,
    link: PropTypes.string,
  })),
  error: PropTypes.string,
};

export { UsedOnTable as Component };

export default provideUsedOnData(UsedOnTable);
