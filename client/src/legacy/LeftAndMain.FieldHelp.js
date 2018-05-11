import $ from 'jquery';

$.entwine('ss', function($) {
  /**
   * Converts an inline field description into a tooltip
   * which is shown on hover over any part of the field container,
   * as well as when focusing into an input element within the field container.
   *
   * Note that some fields don't have distinct focusable
   * input fields (e.g. GridField), and aren't compatible
   * with showing tooltips.
   */
  $(".cms .field.cms-description-tooltip .form__field-holder").entwine({
    onmatch: function() {
      this._super();

      var descriptionEl = this.find('.form__field-description');
      if(descriptionEl.length) {
        var offset = this.css('padding-left');
        this
          // TODO Remove title setting, shouldn't be necessary
          .attr('title', descriptionEl.text())
          .tooltip({
            content: descriptionEl.html(),
            position: {
              my: "left+" + offset + " top"
            }
          });
        descriptionEl.remove();
      }
    },
  });

  $(".cms .field.cms-description-tooltip :input").entwine({
    onfocusin: function(e) {
      var holder = this.closest('.form__field-holder');
      if (holder.data('tooltip')) {
        holder.tooltip('open');
      }
    },
    onfocusout: function(e) {
      var holder = this.closest('.form__field-holder');
      if (holder.data('tooltip')) {
        holder.tooltip('close');
      }
    }
  });

});
