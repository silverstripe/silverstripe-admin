import $ from 'jQuery';
import i18n from 'i18n';
import moment from 'moment';
import modernizr from 'modernizr';

require('../../../thirdparty/jquery-entwine/dist/jquery.entwine-dist.js');

$.entwine('ss', function($) {
  $('input[type=date]').entwine({
    onadd: function () {
      // Browser supports type=date natively
      if (modernizr.inputtypes.date) {
        return;
      }

      // disabled, readonly or already applied
      if (this.prop('disabled') || this.prop('readonly') || this.hasClass('hasDatepicker')) {
        return;
      }

      // Duplicate input field to store ISO value
      const hiddenInput = $('<input/>', { type: 'hidden', name: this.attr('name'), value: this.val() });
      this.parent().append(hiddenInput);

      // Avoid original field being saved
      this.removeAttr('name');

      // Set localised value in original field
      moment.locale(this.attr('lang'));
      const isoDate = this.val();
      let localDate = '';
      if (isoDate) {
        localDate = moment(isoDate).format('L');
      }
      this.val(localDate);

      // Set useful localised placeholder
      this.attr(
        'placeholder',
        i18n._t('DateField.DateFormatExample') + ': ' + moment().endOf('month').format('L')
      );

      this.updateValue();
    },
    onchange: function () {
      // TODO Validation
      this.updateValue();
    },
    updateValue: function () {
      const localDate = this.val();
      let isoDate = '';
      if (localDate) {
        isoDate = moment(localDate, 'L').format('YYYY-MM-DD');
      }
      this.parent().find('input[type=hidden]').val(isoDate);
    },
  });
});
