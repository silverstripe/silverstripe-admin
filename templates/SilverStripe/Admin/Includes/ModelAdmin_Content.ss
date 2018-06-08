<div class="cms-content fill-height flexbox-area-grow cms-tabset center $BaseCSSClasses" data-layout-type="border" data-pjax-fragment="Content">

	<div class="cms-content-header north">
		<div class="cms-content-header-info vertical-align-items flexbox-area-grow">
			<div class="breadcrumbs-wrapper">
				<span class="cms-panel-link crumb last">
					<% if $SectionTitle %>
						$SectionTitle
					<% else %>
						<%t SilverStripe\Admin\ModelAdmin.Title 'Data Models' %>
					<% end_if %>
				</span>
			</div>
		</div>

		<div class="cms-content-header-tabs cms-tabset-nav-primary ss-ui-tabs-nav">
            <% if $SearchForm %>
			    <button id="filters-button" class="btn btn-secondary btn--icon-large font-icon-search no-text" title="<%t SilverStripe\Admin\ModelAdmin.SEARCH 'Search' %>"></button>
            <% end_if %>
			<ul class="cms-tabset-nav-primary">
				<% loop $ManagedModelTabs %>
				<li class="tab-$ClassName $LinkOrCurrent<% if $LinkOrCurrent == 'current' %> ui-tabs-active<% end_if %>">
					<a href="$Link" class="cms-panel-link" title="$Title.ATT">$Title</a>
				</li>
				<% end_loop %>
			</ul>
		</div>
	</div>

	<div class="cms-content-fields center ui-widget-content cms-panel-padded fill-height flexbox-area-grow" data-layout-type="border">
		$Tools

		<div class="cms-content-view">
			<% if $SearchSummary %>
				<p class="message notice">
						<a href="$Link" class="clear-search btn btn-notice font-icon-cancel"><%t SilverStripe\Admin\ModelAdmin.CLEARSEARCH 'Clear search' %></a>
                        <%t SilverStripe\Admin\ModelAdmin.SEARCHRESULTSFOR 'Search results for' %>
					<% loop $SearchSummary %>
						$Field<% if $Value %>: <strong>$Value</strong><% end_if %>
					<% end_loop %>
				</p>
			<% end_if %>
			$EditForm
		</div>
	</div>

</div>
