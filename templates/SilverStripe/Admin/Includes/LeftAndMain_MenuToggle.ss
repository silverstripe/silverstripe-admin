<div class="cms-help__toggle">
    <button class="cms-help__menu" type="button">
        <span class="cms-help__logo font-icon-silverstripe"></span>
        <span class="cms-help__toggle-title">
            $ApplicationName
        </span>
        <span class="cms-help__badge badge badge-info">
                <% if $MinorCMSVersion %>
                    <span class="cms-sitename__version" title="$ApplicationName (Version - $CMSVersion)">$MinorCMSVersion</span>
                <% end_if %>
            </span>
            <span class="cms-help__caret font-icon-caret-down-two"></span>
    </button>
    <div class="cms-help__links">
        <% loop $HelpLinks %>
            <% if $URL %>
                <a class="cms-help__link" href="$URL" target="_blank">$Title</a>
            <% end_if %>
        <% end_loop %>
    </div>
</div>

<button class="sticky-toggle" type="button" title="<%t SilverStripe\Admin\LeftAndMain.MenuToggleStickyNav "Sticky nav" %>"><%t SilverStripe\Admin\LeftAndMain.MenuToggleStickyNav "Sticky nav" %></button>
<span class="sticky-status-indicator"><%t SilverStripe\Admin\LeftAndMain.MenuToggleAuto "Auto" %></span>

<a class="toggle-expand" href="#" data-toggle="tooltip" title="<%t SilverStripe\Admin\LeftAndMain.ExpandPanel "Expand Panel" %>"><span>&raquo;</span></a>
<a class="toggle-collapse" href="#" data-toggle="tooltip" title="<%t SilverStripe\Admin\LeftAndMain.CollapsePanel "Collapse Panel" %>"><span>&laquo;</span></a>
