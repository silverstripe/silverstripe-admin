<div class="cms-login-status">
	<a href="$LogoutURL" class="logout-link font-icon-logout" title="<%t SilverStripe\Admin\LeftAndMain.LOGOUT 'Log out' %>"></a>
	<% with $CurrentMember %>
		<span>
			<%t SilverStripe\Admin\LeftAndMain.Hello 'Hi' %>
			<a href="{$AdminURL}myprofile" class="profile-link">
				<% if $FirstName && $Surname %>$FirstName $Surname<% else_if $FirstName %>$FirstName<% else %>$Email<% end_if %>
			</a>
		</span>
	<% end_with %>
</div>
