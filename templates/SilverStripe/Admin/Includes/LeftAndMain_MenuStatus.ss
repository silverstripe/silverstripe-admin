<div class="cms-login-status">
	<% with $CurrentMember %>
        <a href="$AdminURL('myprofile')" class="cms-login-status__profile-link" title="<%t SilverStripe\Admin\LeftAndMain.PROFILE '{name} profile' name=$Name %>">
            <i class="font-icon-torso"></i>
            <span>
                <% if $FirstName && $Surname %>$FirstName $Surname<% else_if $FirstName %>$FirstName<% else %>$Email<% end_if %>
            </span>
        </a>
	<% end_with %>

	<a href="$LogoutURL" class="cms-login-status__logout-link font-icon-logout" title="<%t SilverStripe\Admin\LeftAndMain.LOGOUT 'Log out' %>"></a>
</div>
