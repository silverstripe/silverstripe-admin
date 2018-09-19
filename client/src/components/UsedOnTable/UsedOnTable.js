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
          <th className="used-on__col--type">{i18n._t('Admin.TYPE', 'Type')}</th>
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
      state,
      link,
    } = data;

    const badge = (state)
      ? <span className={classnames('badge', 'used-on__badge', `status-${state}`)}>{state}</span>
      : null;

    const titleLabel = (link)
      ? <a className="used-on__edit-link" href={link}>{title} {badge}</a>
      : <span>{title} {badge}</span>;

    return (
      <tr key={id}>
        <td className="used-on__col--index">{index + 1}</td>
        <td className="used-on__col--title">{titleLabel}</td>
        <td className="used-on__col--type">{type}</td>
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
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    state: PropTypes.string,
    link: PropTypes.string,
  })),
  error: PropTypes.string,
};

export { UsedOnTable as Component };

export default provideUsedOnData(UsedOnTable);
