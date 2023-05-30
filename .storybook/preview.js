/** @type { import('@storybook/react').Preview } */
import SilverstripeTheme from './theme/SilverstripeTheme';

const preview = {
  parameters: {
    docs: {
      theme: SilverstripeTheme,
    },
  },
};

export default preview;
