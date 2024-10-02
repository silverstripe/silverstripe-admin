<% if $Tag == 'fieldset' && $Legend %>
	<legend>$Legend</legend>
<% end_if %>
<% loop $FieldList %>
	$Holder
<% end_loop %>
