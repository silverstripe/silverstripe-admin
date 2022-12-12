/* eslint-disable
 import/extensions
*/
import jQuery from 'jquery';
import i18n from 'i18n';
import moment from 'moment';
import modernizr from 'modernizr';

import '../../../thirdparty/jquery-entwine/jquery.entwine.js';

jQuery.entwine('ss', ($) => {
  $('input[type=datetime-local]').entwine({
    onadd() {
      // Browser supports type=date natively
      if (modernizr.inputtypes['datetime-local']) {
        return;
      }

      // disabled, readonly or already applied
      if (this.prop('disabled') || this.prop('readonly') || this.hasClass('hasDatepicker')) {
        return;
      }

      // Duplicate input field to store ISO value
      const hiddenInput = $(
        '<input/>',
        { type: 'hidden', name: this.attr('name'), value: this.val() }
      );
      this.parent().append(hiddenInput);

      // Avoid original field being saved
      this.removeAttr('name');

      // Set localised value in original field
      moment.locale(this.attr('lang'));
      const isoDate = this.val();
      let localDate = '';
      if (isoDate) {
        const dateObject = moment(isoDate);
        if (dateObject.isValid()) {
          localDate = dateObject.format('L LT');
        }
      }
      this.val(localDate);

      // Set useful localised placeholder
      const placeholder = i18n.inject(
        i18n._t('Admin.FormatExample', 'Example: {format}'),
        { format: moment().endOf('month').format('L LT') }
      );
      this.attr('placeholder', placeholder);

      this.updateValue();
    },
    onchange() {
      // TODO Validation
      this.updateValue();
    },
    updateValue() {
      const localDate = this.val();
      let isoDate = '';
      if (localDate) {
        const dateObject = moment(localDate, ['L LT', moment.ISO_8601]);
        if (dateObject.isValid()) {
          isoDate = dateObject.format('YYYY-MM-DDTHH:mm:ss');
        }
      }
      this.parent().find('input[type=hidden]').val(isoDate);
    },
  });
});

