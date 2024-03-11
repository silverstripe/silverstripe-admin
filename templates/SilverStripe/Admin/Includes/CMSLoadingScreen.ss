<div class="ss-loading-screen">

    <% include SilverStripe/Admin/Includes/CMSLoadingSpinner  %>

    <h3 class="ss-loading-screen__text">
        Loading<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 3"
        width="10"
        height="3"
        class="ss-loading-screen__dots"
        >
            <circle cx="1" cy="1.75" r="1.25" class="ss-loading-screen__dot ss-loading-screen__dot--1" />
            <circle cx="5.5" cy="1.75" r="1.25" class="ss-loading-screen__dot ss-loading-screen__dot--2" />
            <circle cx="10.5" cy="1.75" r="1.25" class="ss-loading-screen__dot ss-loading-screen__dot--3" />
        </svg>
    </h3>
    <noscript><p class="nojs-warning alert alert-warning"><%t SilverStripe\\Admin\\LeftAndMain.REQUIREJS 'The CMS requires that you have JavaScript enabled.' %></p></noscript>
</div>
