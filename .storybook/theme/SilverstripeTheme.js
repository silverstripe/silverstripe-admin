import { create } from '@storybook/theming/create';

const SilverstripeTheme = create({
  base: 'light',
  brandTitle: 'Silverstripe CMS - Storybook',
  brandImage: 'https://www.silverstripe.com/_resources/themes/app/dist/images/logos/silverstripe-logo.svg',
  brandTarget: '_self',

  // Main colors
  colorPrimary: '#005be0',
  // Temporary
  colorSecondary: '#005be0',
  
  // Toolbar default and active colors
  barTextColor: '#9E9E9E',
  barSelectedColor: '#005be0',
  barBg: '#ffffff',
});

export default SilverstripeTheme;
