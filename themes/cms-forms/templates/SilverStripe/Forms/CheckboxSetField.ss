<div $AttributesHTML>
	<% if $Options.Count %>
		<% loop $Options %>
			<div class="checkbox form-check $Class">
				<label class="form-check-label">
					<input id="$ID" class="checkbox form-check-input" name="$Name" type="checkbox" value="$Value"<% if $isChecked %> checked="checked"<% end_if %><% if $isDisabled %> disabled="disabled"<% end_if %> />
					$Title
				</label>
			</div>
		<% end_loop %>
	<% else %>
		<p>No options available</p>
	<% end_if %>
</div>
