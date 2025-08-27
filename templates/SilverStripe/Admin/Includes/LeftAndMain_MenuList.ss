<ul class="cms-menu__list">
	<% loop $MainMenu %>
		<li class="$LinkingMode $FirstLast <% if $LinkingMode == 'link' %><% else %>opened<% end_if %>" id="Menu-$Code" title="$Title.ATT">
            <%-- Put the aria label on the link, because in some scenarios the actual text will be hidden --%>
			<a href="$Link" $AttributesHTML aria-label="$Title">
				<% if $IconClass %>
					<span class="menu__icon $IconClass" aria-hidden="true"></span>
				<% else_if $HasCSSIcon %>
					<span class="menu__icon icon icon-16 icon-{$Icon}" aria-hidden="true">&nbsp;</span>
				<% else %>
					<span class="menu__icon font-icon-circle-star" aria-hidden="true">&nbsp;</span>
				<% end_if %>
				<span class="text" aria-hidden="true">$Title</span>
			</a>
		</li>
	<% end_loop %>
</ul>
