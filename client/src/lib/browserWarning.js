import browser from 'detect-browser';
import $ from 'jquery';

if (browser.name === 'ie' && parseInt(browser.version, 10) <= 10) {
  $('.browser-warning-wrapper').removeClass('hide');
}
