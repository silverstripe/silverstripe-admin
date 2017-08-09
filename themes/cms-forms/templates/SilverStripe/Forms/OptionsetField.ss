<div $AttributesHTML <% include SilverStripe/Forms/AriaAttributes %>>
	<% loop $Options %>
		<div class="radio form-check $Class">
			<label class="form-check-label">
				<input class="form-check-input" id="$ID" name="$Name" type="radio" value="$Value"<% if $isChecked %> checked<% end_if %><% if $isDisabled %> disabled<% end_if %> <% if $Up.Required %>required<% end_if %> />
				$Title
			</label>
		</div>
	<% end_loop %>
</div>
