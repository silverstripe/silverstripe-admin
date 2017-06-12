<div class="cms-login-status">
	<% with $CurrentMember %>
		<span class="cms-login-status__profile">
            <i class="font-icon-torso"></i>
			<%t SilverStripe\Admin\LeftAndMain.Hello 'Hi' %>
			<a href="{$AdminURL}myprofile" class="cms-login-status__profile-link">
				<% if $FirstName && $Surname %>$FirstName $Surname<% else_if $FirstName %>$FirstName<% else %>$Email<% end_if %>
			</a>
		</span>
	<% end_with %>

	<a href="$LogoutURL" class="cms-login-status__logout-link font-icon-logout" title="<%t SilverStripe\Admin\LeftAndMain.LOGOUT 'Log out' %>"></a>
</div>
