<div class="breadcrumbs-wrapper flexbox-area-grow" data-pjax-fragment="Breadcrumbs">
	<% loop $Breadcrumbs %>
		<% if $IsLast %>
			<span class="cms-panel-link crumb last">$Title<% if $Extra %>$Extra<% end_if %></span>
		<% else %>
			<a class="cms-panel-link crumb" href="$Link">$Title</a>
			<span class="sep">/</span>
		<% end_if %>
	<% end_loop %>
</div>
