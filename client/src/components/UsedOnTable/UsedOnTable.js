import React, { PureComponent, PropTypes } from 'react';
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
    const { usedOn, loading } = this.props;
    if (!usedOn || !usedOn.length) {
      const message = (loading)
        ? i18n._t('Admin.LOADING', 'Loading...')
        : i18n._t('Admin.NOT_USED', 'This is not used anywhere');
      const className = classnames({
        'used-on__message': true,
        'used-on__message--loading': loading,
        'used-on__message--empty': !loading,
      });

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
      editLink,
    } = data;

    const badge = (state)
      ? <span className={classnames('badge', 'used-on__badge', `status-${state}`)}>{state}</span>
      : null;

    const titleLabel = (editLink)
      ? <a className="used-on__edit-link" href={editLink}>{title} {badge}</a>
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
  usedOn: PropTypes.array,
};

export { UsedOnTable as Component };

export default provideUsedOnData(UsedOnTable);
