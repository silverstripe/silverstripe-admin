/* global document */
import browser from 'detect-browser';

if (browser.name === 'ie' && parseInt(browser.version, 10) <= 10) {
  const warning = document.getElementById('browser-warning-wrapper');
  if (warning) {
    warning.className = `${warning.className} browser-warning-wrapper--incompatible`;
  }
}
