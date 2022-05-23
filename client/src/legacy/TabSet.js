import $ from 'jquery';

require('../../../thirdparty/jquery-ui/jquery-ui.js');
require('../../../thirdparty/jquery-cookie/jquery.cookie.js');
require('../../../thirdparty/jquery-entwine/dist/jquery.entwine-dist.js');

// TODO Enable once https://github.com/webpack/extract-text-webpack-plugin/issues/179 is resolved. Included in bundle.scss for now.
// require('../../../thirdparty/jquery-ui-themes/smoothness/jquery-ui.css');

$.entwine('ss', function($){
  $('.ss-tabset, .cms-tabset').entwine({
    onmatch: function () {
      var hash = window.location.hash;
      if (hash !== '') {
        this.openTabFromURL(hash);
      }

      this._super();
    },
    
    onadd: function() {
      this.on("tabsactivate", (function (event, {newPanel}) {
        this.triggerLazyLoad(newPanel);
      }).bind(this));
      this.on("tabscreate", (function(event, {panel}) {
        this.triggerLazyLoad(panel);
      }).bind(this));
      this._super();
    },

    /**
     * @func openTabFromURL
     * @param {string} hash
     * @desc Allows linking to a specific tab.
     */
    openTabFromURL: function (hash) {
      var $trigger;

      // Make sure the hash relates to a valid tab.
      $.each(this.find('.ui-tabs-anchor'), function () {
        // The hash in in the button's href and there is exactly one tab with that id.
        if (this.href.indexOf(hash) !== -1 && $(hash).length === 1) {
          $trigger = $(this);
          return false; // break the loop
        }
      });

      // If there's no tab, it means the hash is invalid, so do nothing.
      if ($trigger === void 0) {
        return;
      }

      // Switch to the correct tab when the page is loaded
      $(() => {
        $trigger.click();
      });
    },

    /**
     * @func lazyLoadGridFields
     * @desc Find all the lazy loadable gridfield in the panel and trigger their reload.
     * @param {Object} panel
     */
    triggerLazyLoad: function(panel) {
      panel.find('.grid-field--lazy-loadable, .lazy-loadable').each((i, el) => {
        const $el = e(el);
        // Avoid triggering all lazy loadable scripts when using nested tabs
        if ($el.closest('.ss-tabset, .cms-tabset').is(this)) {
          // Trigger dedicated entwine function (see GridField.js)
          if(typeof $el.lazyload === 'function') {
            $el.lazyload();
          }
          // Also dispatch a native event for scripts not using entwine
          el.dispatchEvent(new Event("lazyload"), { once: true });
        }
      });
    },
    
  }),

  /**
   * Lightweight wrapper around jQuery UI tabs for generic tab set-up
   */
  $('.ss-tabset').entwine({
    IgnoreTabState: false,

    onadd: function() {
      // Can't name redraw() as it clashes with other CMS entwine classes
      this.redrawTabs();
      this._super();
    },

    onremove: function() {
      if(this.data('tabs')) this.tabs('destroy');
      this._super();
    },

    redrawTabs: function() {
      // If accessing a tabset from a page in the CMS module
      // alter how the tabs are rendered
      if ($(this).hasClass('ss-tabset')) {
        this.rewriteHashlinks();
        this.tabs()
      } else {
        this._super();
      }
    },

    /**
     * @func rewriteHashlinks
     * @desc Ensure hash links are prefixed with the current page URL, otherwise jQuery interprets them as being external.
     */
    rewriteHashlinks: function() {
      $(this).find('ul a').each(function() {
        if (!$(this).attr('href')) return;

        var matches = $(this).attr('href').match(/#.*/);
        if(!matches) return;
        $(this).attr('href', document.location.href.replace(/#.*/, '') + matches[0]);
      });
    },
    
  });

  // adding bootstrap theme classes to corresponding jQueryUI elements
  $('.ui-tabs-active .ui-tabs-anchor').entwine({
    onmatch: function() {
      this.addClass('nav-link active');
    },
    onunmatch: function() {
      this.removeClass('active');
    }
  });
});
