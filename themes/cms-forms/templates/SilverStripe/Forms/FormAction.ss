<% if $UseButtonTag %>
	<button $getAttributesHTML('class') class="btn<% if $extraClass %> $extraClass<% end_if %>">
        <% if $Icon %><span aria-hidden="true" class="btn__icon font-icon-$Icon"></span><% end_if %>
		<% if $ButtonContent %>$ButtonContent<% else %><span class="btn__title">$Title.XML</span><% end_if %>
	</button>
<% else %>
	<input $getAttributesHTML('class') class="btn<% if $extraClass %> $extraClass<% end_if %>"/>
<% end_if %>
