<button $AttributesHTML>
    <% if $Icon %><span aria-hidden="true" class="btn__icon font-icon-$Icon"></span><% end_if %>
	<span class="btn__title"><% if $ButtonContent %>$ButtonContent<% else %>$Title<% end_if %></span>
</button>
