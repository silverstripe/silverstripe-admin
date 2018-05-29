import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import GridFieldActions from 'components/GridFieldActions/GridFieldActions';

storiesOf('Admin/GridFieldActions', module)
  .add('Single', () => {
    const schema = [
      {
        type: 'link',
        title: 'Link Type Action',
        url: '#edit',
        group: 'General',
        data: {
          extraClass: 'edit-link'
        }
      }
    ];
    return (<GridFieldActions schema={schema} />);
  })
  .add('Multiple', () => {
    const schema = [
      {
        type: 'link',
        title: 'Link Type Action',
        url: '#edit',
        group: 'General',
        data: {
          extraClass: 'edit-link'
        }
      },
      {
        type: 'submit',
        title: 'Button Type Action',
        url: '#delete',
        group: 'General',
        data: {
          name: 'action_gridFieldAlterAction?StateID=gf_da2f6f50',
          id: 'action_DeleteRecord4111',
          'data-url': 'admin/pages/edit/EditForm/8/field/Companies'
        }
      }
    ];
    return (<GridFieldActions schema={schema} />);
  })
  .add('Grouped', () => {
    const schema = [
      {
        type: 'link',
        title: 'Action 1',
        url: '#edit',
        group: 'Group 1',
        data: {
          extraClass: 'edit-link'
        }
      },
      {
        type: 'link',
        title: 'Action 2',
        url: '#edit',
        group: 'Group 1',
        data: {
          extraClass: 'edit-link'
        }
      },
      {
        type: 'link',
        title: 'Action 3',
        url: '#edit',
        group: 'Group 2',
        data: {
          extraClass: 'edit-link'
        }
      },
      {
        type: 'link',
        title: 'Action 4',
        url: '#edit',
        group: 'Group 2',
        data: {
          extraClass: 'edit-link'
        }
      },
    ];
    return (<GridFieldActions schema={schema} />);
  })
  .add('Complex', () => {
    const schema = [
      {
        type: 'link',
        title: 'Link Type Action',
        url: '#edit',
        group: '1',
        data: {
          extraClass: 'edit-link'
        }
      },
      {
        type: 'submit',
        title: 'Button Type Action',
        url: '#delete',
        group: '1',
        data: {
          name: 'action_gridFieldAlterAction?StateID=gf_da2f6f50',
          id: 'action_DeleteRecord4111',
          'data-url': 'admin/pages/edit/EditForm/8/field/Companies'
        }
      },
      {
        type: 'link',
        title: 'Link Type Action',
        url: '#edit',
        group: '2',
        data: {
          extraClass: 'edit-link'
        }
      },
      {
        type: 'submit',
        title: 'Button Type Action',
        url: '#delete',
        group: '2',
        data: {
          name: 'action_gridFieldAlterAction?StateID=gf_da2f6f50',
          id: 'action_DeleteRecord4111',
          'data-url': 'admin/pages/edit/EditForm/8/field/Companies'
        }
      },
      {
        type: 'link',
        title: 'Link Type Action',
        url: '#edit',
        group: '2',
        data: {
          extraClass: 'edit-link'
        }
      },
      {
        type: 'submit',
        title: 'Button Type Action',
        url: '#delete',
        group: '2',
        data: {
          name: 'action_gridFieldAlterAction?StateID=gf_da2f6f50',
          id: 'action_DeleteRecord4111',
          'data-url': 'admin/pages/edit/EditForm/8/field/Companies'
        }
      },
      {
        type: 'link',
        title: 'Link Type Action',
        url: '#edit',
        group: '3',
        data: {
          extraClass: 'edit-link'
        }
      },
      {
        type: 'submit',
        title: 'Button Type Action',
        url: '#delete',
        group: '3',
        data: {
          name: 'action_gridFieldAlterAction?StateID=gf_da2f6f50',
          id: 'action_DeleteRecord4111',
          'data-url': 'admin/pages/edit/EditForm/8/field/Companies'
        }
      },
      {
        type: 'link',
        title: 'Link Type Action',
        url: '#edit',
        group: '3',
        data: {
          extraClass: 'edit-link'
        }
      },
      {
        type: 'submit',
        title: 'Button Type Action',
        url: '#delete',
        group: '3',
        data: {
          name: 'action_gridFieldAlterAction?StateID=gf_da2f6f50',
          id: 'action_DeleteRecord4111',
          'data-url': 'admin/pages/edit/EditForm/8/field/Companies'
        }
      },
      {
        type: 'link',
        title: 'Link Type Action',
        url: '#edit',
        group: '3',
        data: {
          extraClass: 'edit-link'
        }
      },
      {
        type: 'submit',
        title: 'Button Type Action',
        url: '#delete',
        group: '3',
        data: {
          name: 'action_gridFieldAlterAction?StateID=gf_da2f6f50',
          id: 'action_DeleteRecord4111',
          'data-url': 'admin/pages/edit/EditForm/8/field/Companies'
        }
      }
    ];
    return (<GridFieldActions schema={schema} />);
  });
