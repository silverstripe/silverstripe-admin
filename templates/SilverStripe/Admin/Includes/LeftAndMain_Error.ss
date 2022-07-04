<div class="cms-content flexbox-area-grow $BaseCSSClasses" data-layout-type="border" data-pjax-fragment="Content">

    <div class="cms-content-header north">
        <div class="cms-content-header-info vertical-align-items flexbox-area-grow">
            <div class="breadcrumbs-wrapper">
                <span class="cms-panel-link crumb last">
                    $ErrorType
                </span>
            </div>
        </div>
    </div>

    $Tools

    <div class="panel panel--padded">
        <p>$Message</p>
        <% if $isDev && $HttpErrorMessage %>
            <p>
                <strong><%t SilverStripe\Admin\LeftAndMain.ErrorDetail "Error detail: {detail}" detail=$HttpErrorMessage %></strong>
            </p>
        <% end_if %>
    </div>

</div>
