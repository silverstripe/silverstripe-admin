/* eslint-disable */

import debounce from 'lodash.debounce';

// Copyright (c) 2009, SilverStripe Ltd.
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the <organization> nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY SilverStripe Ltd. ''AS IS'' AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL SilverStripe Ltd. BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/**
 * @class Tracks onchange events on all form fields.
 * 
 * @todo Implement form reset handling
 *  
 * @name jQuery.changetracker
 * @author Ingo Schommer, SilverStripe Ltd.
 * @license BSD License
 */
(function($) {
  $.fn.changetracker = function(_options) {
    var self = this;

    if(this.length > 1){
      this.each(function(i, item) {
        this.changetracker(_options);
      });
      return this;
    }

    this.defaults = {
      fieldSelector: ':input:not(:button,[type="submit"])',
      ignoreFieldSelector: '.no-change-track',
      changedCssClass: 'changed'
    };

    var options = $.extend({}, this.defaults, _options);

    this.initialize = function() {
      // optional metadata plugin support
      if ($.meta) options = $.extend({}, options, this.data());

      // Flag indicating this form was dirtied by an external component
      self.data('dirty', false);
            
      // Get value from field for purposes of change tracking
      var fieldValue = function($field) {
        // Get radio
        if ($field.is(':radio')) {
          var checkedItems = self.find(':input[name=' + $field.attr('name') + ']:checked');
          return checkedItems.length ? checkedItems.val() : 0;
        }
        
        if($field.is(':checkbox')) {
          return $field.is(':checked') ? 1 : 0;
        }

        var value = $field.val();

        if ($field && $field.hasClass('htmleditor')) {
          var editorClass = $field.data('editor') || 'default';

          // in case there are other editor class types
          switch (editorClass) {
            case 'tinyMCE':
            case 'default':
              var config = $.extend({ forced_root_block: 'p' }, $field.data('config'));

              var serializer = new tinymce.html.Serializer(config);
              var parser = new tinymce.html.DomParser(config);

              value = serializer.serialize(parser.parse(value));
              break;
          }
        }

        return value;
      }

      /**
       * Get serialised value for this form
       */
      var formValue = function () {
        var value = [];
        self.getFields().each(function() {
          var name = $(this).prop('name');
          if (name) {
            value.push({
              name: name,
              value: fieldValue($(this))
            });
          }
        });
        return JSON.stringify(value);
      };
      
      // Check global serialized state
      var initialState = formValue();

      // Detect changes to the form
      var isChanged = function () {
        var newState = formValue();

        return self.data('dirty') || initialState !== newState;
      };

      // Handler for detecting global changes
      var detectChanges = function () {
        var changed = isChanged();
        self.toggleClass(options.changedCssClass, changed);
      };

      var handleChanges = function (e) {
        var $field = $(e.target);
        var origVal = $field.data('changetracker.origVal');

        if ($field.is(options.ignoreFieldSelector)) {
          return;
        }
        // Determine value based on field type
        var newVal = fieldValue($field);

        // Determine changed state based on value comparisons
        if (origVal === null || newVal !== origVal) {
          $field.addClass(options.changedCssClass);
          self.addClass(options.changedCssClass);
        } else {
          $field.removeClass(options.changedCssClass);
          // Unset changed state on all radio buttons of the same name
          if ($field.is(':radio')) {
            self.find(':radio[name=' + $field.attr('name') + ']').removeClass(options.changedCssClass);
          }

          // Perform global change detection on the form
          ondetect();
        }
      };

      var ondetect = debounce(detectChanges, 250, { leading: true, trailing: true });

      var onchange = debounce(handleChanges, 250, { leading: true, trailing: true });

      // Delegate handlers
      self.on('click.changetracker', options.fieldSelector , onchange);
      self.on('keyup.changetracker', options.fieldSelector , onchange);
      self.on('change.changetracker', options.fieldSelector , onchange);
      
      // Bind observer to subtree
      self.on('change.changetracker', ondetect);
      
      // Set initial state
      this.getFields().each(function() {
        var origVal = fieldValue($(this));
        $(this).data('changetracker.origVal', origVal);
      });

      // Set dirty handler
      self.on('dirty.changetracker', function() {
        self.data('dirty', true);
        ondetect();
      });

      this.data('changetracker', true);
    };

    this.destroy = function() {
      this.reset();
      this
        .off('.changetracker')
        .removeData('changetracker');
    };

    /**
     * Reset change state of all form fields and the form itself.
     */
    this.reset = function() {
      this.getFields().each(function() {
        self.resetField(this);
      });

      this
        .data('dirty', false)
        .removeClass(options.changedCssClass);
    };

    /**
     * Reset the change single form field.
     * Does not reset to the original value.
     *
     * @param DOMElement field
     */
    this.resetField = function(field) {
      return $(field)
        .removeData('changetracker.origVal')
        .removeClass(options.changedCssClass);
    };

    /**
     * @return jQuery Collection of fields
     */
    this.getFields = function() {
      return this
        .find(options.fieldSelector)
        .not(options.ignoreFieldSelector);
    };

    // Support invoking "public" methods as string arguments
    if (typeof arguments[0] === 'string') {
      var property = arguments[1];
      var args = Array.prototype.slice.call(arguments);
      args.splice(0, 1);
      return this[arguments[0]].apply(this, args);
    } else {
      // Defer until other init scripts are run
      // E.g. PermissionCheckboxSetField.js
      var self = this;
      setTimeout(function () { 
        self.initialize(); 
      }, 0);
      return this;
    }

  };
}(jQuery));
