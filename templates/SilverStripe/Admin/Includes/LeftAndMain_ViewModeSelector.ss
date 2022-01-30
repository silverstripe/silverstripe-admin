<span id="$SelectID" class="preview-mode-selector preview-selector field dropdown $ExtraClass">
	<select title="<%t SilverStripe\\Admin\\LeftAndMain_ViewModeSelector.ChangeViewMode 'Change view mode' %>" id="$SelectID-select" class="preview-dropdown dropdown form-group--no-label no-change-track" autocomplete="off" name="Action">

		<option data-icon="font-icon-columns" class="font-icon-columns icon-view first" value="split"><%t SilverStripe\\Admin\\LeftAndMain_ViewModeSelector.SplitView 'Split mode' %></option>
		<option data-icon="font-icon-eye" class="font-icon-eye icon-view" value="preview"><%t SilverStripe\\Admin\\LeftAndMain_ViewModeSelector.PreviewView 'Preview mode' %></option>
		<option data-icon="font-icon-edit-write" class="font-icon-edit-write icon-view last" value="content"><%t SilverStripe\\Admin\\LeftAndMain_ViewModeSelector.EditView 'Edit mode' %></option>
		<!-- Dual window not implemented yet -->
		<!--
			<option data-icon="icon-window" class="icon-window icon-view last" value="window"><%t SilverStripe\\Admin\\LeftAndMain_ViewModeSelector.DualWindowView 'Dual Window' %></option>
		-->
	</select>
</span>
