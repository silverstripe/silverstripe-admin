import FileStatusIcon from 'components/FileStatusIcon/FileStatusIcon';

export default {
  title: 'Admin/FileStatusIcon',
  component: FileStatusIcon,
  argTypes: {
    fileID: {
      control: 'number'
    },
    hasRestrictedAccess: {
      control: 'boolean'
    },
    isTrackedFormUpload: {
      control: 'boolean'
    },
    includeBackground: {
      control: 'boolean'
    },
    placement: {
      control: 'select',
      options: ['auto', 'top', 'bottom', 'left', 'right']
    },
    disableTooltip: {
      control: 'boolean'
    }
  }
};

export const _FileStatusIcon = {
  args: {
    fileID: 123,
    hasRestrictedAccess: true,
    isTrackedFormUpload: false,
    includeBackground: false,
    placement: 'auto',
    disableTooltip: false
  }
};
