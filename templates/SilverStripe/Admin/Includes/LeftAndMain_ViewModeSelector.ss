<span id="$SelectID" class="preview-mode-selector preview-selector field dropdown">
	<select title="<%t SilverStripe\CMS\Controllers\SilverStripeNavigator.ChangeViewMode 'Change view mode' %>" id="$SelectID-select" class="preview-dropdown dropdown form-group--no-label no-change-track" autocomplete="off" name="Action">

		<option data-icon="font-icon-columns" class="font-icon-columns icon-view first" value="split"><%t SilverStripe\CMS\Controllers\SilverStripeNavigator.SplitView 'Split mode' %></option>
		<option data-icon="font-icon-eye" class="font-icon-eye icon-view" value="preview"><%t SilverStripe\CMS\Controllers\SilverStripeNavigator.PreviewView 'Preview mode' %></option>
		<option data-icon="font-icon-edit-write" class="font-icon-edit-write icon-view last" value="content"><%t SilverStripe\CMS\Controllers\SilverStripeNavigator.EditView 'Edit mode' %></option>
		<!-- Dual window not implemented yet -->
		<!--
			<option data-icon="icon-window" class="icon-window icon-view last" value="window"><%t SilverStripe\CMS\Controllers\SilverStripeNavigator.DualWindowView 'Dual Window' %></option>
		-->
	</select>
</span>
