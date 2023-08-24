<div class="cms-help__toggle">
    <button class="cms-help__menu" type="button" title="<%t SilverStripe\Admin\LeftAndMain.HelpMenu "Help menu" %>" aria-label="<%t SilverStripe\Admin\LeftAndMain.HelpMenu "Help menu" %>" aria-expanded="false">
        <span class="cms-help__logo font-icon-silverstripe-cms"></span>
        <span class="cms-help__toggle-title">
            $ApplicationName
        </span>
        <span class="cms-help__badge badge badge-info">
                <% if $CMSVersionNumber %>
                    <span class="cms-sitename__version" title="$ApplicationName (<%t SilverStripe\Admin\LeftAndMain.Version "Version" %> - $CMSVersion)">$CMSVersionNumber</span>
                <% end_if %>
            </span>
            <span class="cms-help__caret font-icon-caret-up-two"></span>
    </button>
    <% if $HelpLinks %>
        <div class="cms-help__links">
            <% loop $HelpLinks %>
                <% if $URL %>
                    <a class="cms-help__link" href="$URL" target="_blank" rel="noopener noreferrer">$Title</a>
                <% end_if %>
            <% end_loop %>
        </div>
    <% end_if %>
</div>

<div class="sticky-toggle">
    <button class="sticky-toggle__button" type="button" title="<%t SilverStripe\Admin\LeftAndMain.MenuToggleStickyNav "Sticky nav" %>"><%t SilverStripe\Admin\LeftAndMain.MenuToggleStickyNav "Sticky nav" %></button>
    <span class="sticky-toggle__status sticky-status-indicator"><%t SilverStripe\Admin\LeftAndMain.MenuToggleAuto "Auto" %></span>
</div>

<a class="toggle-expand" href="#" data-toggle="tooltip" title="<%t SilverStripe\Admin\LeftAndMain.ExpandPanel "Expand panel" %>" aria-label="<%t SilverStripe\Admin\LeftAndMain.ExpandPanel "Expand panel" %>"><span>&raquo;</span></a>
<a class="toggle-collapse" href="#" data-toggle="tooltip" title="<%t SilverStripe\Admin\LeftAndMain.CollapsePanel "Collapse panel" %>" aria-label="<%t SilverStripe\Admin\LeftAndMain.CollapsePanel "Collapse panel" %>"><span>&laquo;</span></a>
