<!DOCTYPE html>
<html lang="$Locale.RFC1766">
	<head>
	<% base_tag %>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, maximum-scale=1.0" />
	<title>$Title</title>
</head>
<body class="loading cms" data-frameworkpath="$ModulePath(silverstripe/framework)"
	data-member-tempid="$CurrentMember.TempIDHash.ATT" <% if $GraphQLLegacy %>data-graphql-legacy="1"<% end_if %>
>
	<% include SilverStripe\\Admin\\CMSLoadingScreen %>

	<div class="cms-container" data-layout-type="custom">
		$Menu
		$Content
		$PreviewPanel
    </div>
</body>
</html>
