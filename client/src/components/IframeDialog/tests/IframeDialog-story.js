import IframeDialog from 'components/IframeDialog/IframeDialog';

export default {
  title: 'Admin/IframeDialog',
  component: IframeDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'IframeDialog Component Description. To show iFrame dialog switch `isOpen` to true.'
      },
      canvas: {
        sourceState: 'shown',
      },
      controls: {
        sort: 'alpha',
      }
    }
  },
  argTypes: {},
};
export const _IframeDialog = {
  args: {
    url: 'https://silverstripe.org',
    isOpen: false,
    title: 'iFrame Dialog'
  }
};
