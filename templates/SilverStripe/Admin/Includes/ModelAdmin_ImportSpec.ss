<div class="importSpec" id="SpecFor{$ClassName}">
	<a href="#SpecDetailsFor{$ClassName}" class="detailsLink"><%t SilverStripe\Admin\ModelAdmin.IMPORTSPECLINK 'Show Specification for {model}' model=$ModelName %></a>
	<div class="details" id="SpecDetailsFor{$ClassName}">
	<h4><%t SilverStripe\Admin\ModelAdmin.IMPORTSPECTITLE 'Specification for {model}' model=$ModelName %></h4>
		<h5><%t SilverStripe\Admin\ModelAdmin.IMPORTSPECFIELDS 'Database columns' %></h5>
		<% loop $Fields %>
		<dl>
			<dt><em>$Name</em></dt>
			<dd>$Description</dd>
		</dl>
		<% end_loop %>

		<h5><%t SilverStripe\Admin\ModelAdmin.IMPORTSPECRELATIONS 'Relations' %></h5>
		<% loop $Relations %>
		<dl>
			<dt><em>$Name</em></dt>
			<dd>$Description</dd>
		</dl>
		<% end_loop %>
	</div>
</div>
