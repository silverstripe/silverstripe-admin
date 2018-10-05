<div class="cms-help__toggle">
    <button class="cms-help__menu" type="button" title="<%t SilverStripe\Admin\LeftAndMain.HelpMenu "Help menu" %>" aria-label="<%t SilverStripe\Admin\LeftAndMain.HelpMenu "Help menu" %>">
        <span class="cms-help__logo font-icon-silverstripe"></span>
        <span class="cms-help__toggle-title">
            $ApplicationName
        </span>
        <span class="cms-help__badge badge badge-info">
                <% if $CMSVersionNumber %>
                    <span class="cms-sitename__version" title="$ApplicationName (<%t SilverStripe\Admin\LeftAndMain.Version "Version" %> - $CMSVersion)">$CMSVersionNumber.LimitCharacters(3, '')</span>
                <% end_if %>
            </span>
            <span class="cms-help__caret font-icon-caret-down-two"></span>
    </button>
    <% if $HelpLinks %>
        <div class="cms-help__links">
            <% loop $HelpLinks %>
                <% if $URL %>
                    <a class="cms-help__link" href="$URL" target="_blank">$Title</a>
                <% end_if %>
            <% end_loop %>
        </div>
    <% end_if %>
</div>

<button class="sticky-toggle" type="button" title="<%t SilverStripe\Admin\LeftAndMain.MenuToggleStickyNav "Sticky nav" %>"><%t SilverStripe\Admin\LeftAndMain.MenuToggleStickyNav "Sticky nav" %></button>
<span class="sticky-status-indicator"><%t SilverStripe\Admin\LeftAndMain.MenuToggleAuto "Auto" %></span>

<a class="toggle-expand" href="#" data-toggle="tooltip" title="<%t SilverStripe\Admin\LeftAndMain.ExpandPanel "Expand panel" %>" aria-label="<%t SilverStripe\Admin\LeftAndMain.ExpandPanel "Expand panel" %>"><span>&raquo;</span></a>
<a class="toggle-collapse" href="#" data-toggle="tooltip" title="<%t SilverStripe\Admin\LeftAndMain.CollapsePanel "Collapse panel" %>" aria-label="<%t SilverStripe\Admin\LeftAndMain.CollapsePanel "Collapse panel" %>"><span>&laquo;</span></a>
