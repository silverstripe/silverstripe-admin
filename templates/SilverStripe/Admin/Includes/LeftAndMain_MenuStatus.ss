<div class="cms-login-status">
	<% with $CurrentMember %>
        <a href="$AdminURL('myprofile')" class="cms-login-status__profile-link"
            aria-label="<%t SilverStripe\Admin\LeftAndMain.PROFILE '{name} profile' name=$Name %>"
            title="<%t SilverStripe\Admin\LeftAndMain.PROFILE '{name} profile' name=$Name %>"
        >
            <span class="cms-login-status__profile-icon font-icon-torso" aria-hidden="true"></span>
            <span class="cms-login-status__profile-text">
                <% if $FirstName && $Surname %>$FirstName $Surname<% else_if $FirstName %>$FirstName<% else %>$Email<% end_if %>
            </span>
        </a>
	<% end_with %>

	<a href="$LogoutURL" class="cms-login-status__logout-link" aria-label="<%t SilverStripe\Admin\LeftAndMain.LOGOUT 'Log out' %>" title="<%t SilverStripe\Admin\LeftAndMain.LOGOUT 'Log out' %>">
        <span class="font-icon-logout" aria-hidden="true"></span>
    </a>
</div>
