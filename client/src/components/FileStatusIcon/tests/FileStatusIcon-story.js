import FileStatusIcon from 'components/FileStatusIcon/FileStatusIcon';

export default {
  title: 'Admin/FileStatusIcon',
  component: FileStatusIcon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Generates a file status icon element with a reactstrap tooltip.
        The icon and tooltip text is controlled via boolean props on the component rather than passed in as strings.`
      },
      canvas: {
        sourceState: 'shown',
      },
      controls: {
        sort: 'alpha',
      }
    }
  },
  argTypes: {
    fileID: {
      description: 'The database ID of the file.',
      control: 'number',
      table: {
        type: { summary: 'number' },
      }
    },
    hasRestrictedAccess: {
      description: 'Whether the file has restricted access / permissions.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      }
    },
    isTrackedFormUpload: {
      description: 'Whether the file is associated with a tracked form upload.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      }
    },
    placement: {
      description: 'Reactstramp tooltip position.',
      control: 'select',
      options: ['auto', 'top', 'bottom', 'left', 'right'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'auto' },
      }
    },
    disableTooltip: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      }
    },
    extraClassName: {
      description: 'Extra class the component should have',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    includeBackground: {
      description: 'Whether to render the icon on a white circle background',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      }
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
