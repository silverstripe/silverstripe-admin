import React from 'react';
import Loading from 'components/Loading/Loading';

export default {
  title: 'Admin/Loading',
  component: Loading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Provides a simple SilverStripe loading indicator component.'
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
    containerClass: {
      description: "HTML classes to be added to the indicator's container div. If empty, no container will be rendered. Default: `flexbox-area-grow`",
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'flexbox-area-grow' },
      }
    }
  }
};

export const _Loading = () => <Loading />;
_Loading.args = {
  containerClass: '',
};
