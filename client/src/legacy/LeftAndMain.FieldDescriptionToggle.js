/**
 * Enable toggling (show/hide) of the field's description.
 */

import $ from 'jquery';

$.entwine('ss', function ($) {

  $('.cms-description-toggle').entwine({
    onadd: function () {
      var shown = false, // Current state of the description.
        fieldId = this.prop('id').substr(0, this.prop('id').indexOf('_Holder')),
        $trigger = this.find('.cms-description-trigger'), // Click target for toggling the description.
        $description = this.find('.form__field-description');

      // Prevent multiple events being added.
      if (this.hasClass('description-toggle-enabled')) {
        return;
      }

      // If a custom trigger han't been supplied use a sensible default.
      if ($trigger.length === 0) {
        $trigger = this
          .find('.form__field-holder')
          .first() // Get the first middleColumn so we don't add multiple triggers on composite field types.
          .after('<label class="right" for="' + fieldId + '"><a class="cms-description-trigger" href="javascript:void(0)"><span class="btn btn-secondary btn--no-text font-icon-info-circled"></span></a></label>')
          .next();
      }

      this.addClass('description-toggle-enabled');

      // Toggle next description when button is clicked.
      $trigger.on('click', function(event) {
        $description[shown ? 'hide' : 'show']();
        shown = !shown;
        event.preventDefault();
      });

      // Hide next description by default.
      $description.hide();
    }
  });

});
