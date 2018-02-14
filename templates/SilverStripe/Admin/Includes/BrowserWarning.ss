<% require css('silverstripe/admin: client/dist/styles/browser-warning.css') %>

<div id="browser-warning-wrapper" class="browser-warning-wrapper">
    <div class="browser-warning vertical-align-items">
        <div class="browser-warning__content flexbox-area-grow">
            <p class="ss-logo">SilverStripe</p>
            <h1><%t SilverStripe\Admin\LeftAndMain.BROWSER_WARNING_HEADING 'Unsupported browser' %></h1>

            <p>
                <%t SilverStripe\Admin\LeftAndMain.BROWSER_WARNING_TEXT 'You&apos;re using a web browser that&apos;s not supported by SilverStripe.<br />Please upgrade to one of the following options.' %>
            </p>
            <ul class="browser-warning__list">
                <li data-browser="ie"><a href="https://support.microsoft.com/en-us/help/17621/internet-explorer-downloads">Internet Explorer(11+)</a></li>

                <li data-browser="firefox"><a href="https://www.mozilla.org/en-US/firefox/">Mozilla Firefox</a></li>

                <li data-browser="chrome"><a href="https://www.google.com/chrome/">Google Chrome</a></li>
            </ul>
        </div>
    </div>
</div>

<% require javascript('silverstripe/admin: client/dist/js/browserWarning.js') %>

<!--[if lte IE 8]>
<script>
(function () {
  var warning = document.getElementById('browser-warning-wrapper');
  if (warning) {
  	warning.className = warning.className + ' browser-warning-wrapper--incompatible';
  }
})();
</script>
<![endif]-->
