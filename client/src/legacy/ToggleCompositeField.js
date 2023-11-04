import $ from 'jquery';

// entwine also required, but can't be included more than once without error
import '../../../thirdparty/jquery-ui/jquery-ui.js';

$.entwine('ss', function($){
	$('.ss-toggle').entwine({
		onadd: function() {
			this._super();

			this.accordion({
				heightStyle: "content",
				collapsible: true,
				active: (this.hasClass("ss-toggle-start-closed")) ? false : 0
			});
		},
		onremove: function() {
			if (this.data('uiAccordion')) this.accordion('destroy');
			this._super();
		},

		getTabSet: function() {
			return this.closest(".ss-tabset");
		},

		fromTabSet: {
			ontabsshow: function() {
				this.accordion("resize");
			}
		}
	});
});
