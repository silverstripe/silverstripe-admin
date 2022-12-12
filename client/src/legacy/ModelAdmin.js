/**
 * File: ModelAdmin.js
 */
import $ from 'jquery';

import './LeftAndMain.js';

$.entwine('ss', function($){
  $('.cms-content-tools #Form_SearchForm').entwine({
    onsubmit: function(e) {
      //We need to trigger handleStateChange() explicitly, otherwise handleStageChange()
      //doesn't called if landing from another section of cms
      this.trigger('beforeSubmit');
    }
  });

  /**
   * Class: .importSpec
   *
   * Toggle import specifications
   */
  $('.importSpec').entwine({
    onmatch: function() {
      this.find('div.details').hide();
      this.find('a.detailsLink').click(function() {
        $('#' + $(this).attr('href').replace(/.*#/,'')).slideToggle();
        return false;
      });

      this._super();
    },
    onunmatch: function() {
      this._super();
    }
  });

  $('.cms .btn.clear-search').entwine({
    onclick: function (e) {
      e.preventDefault();
      var container = this.parents('.cms-container');
      container.loadPanel(this.attr('href'), '', {}, true, false);
    }
  });
});
