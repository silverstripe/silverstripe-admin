<!DOCTYPE html>
<html lang="$Locale.RFC1766">
    <head>
    <% base_tag %>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>$Title</title>
</head>
<body class="loading cms" data-frameworkpath="$ModulePath(silverstripe/framework)"
    data-member-tempid="$CurrentMember.TempIDHash.ATT"
>
    <% include SilverStripe\\Admin\\CMSLoadingScreen %>

    <a class="cms-container-skip-link"
       href="#cms-container-skip-link-target"
       tabindex="0"
    ><%t SilverStripe\\Admin\\LeftAndMain.SkipLink "Skip main navigation" %></a>

    <div class="cms-container" data-layout-type="custom">
        $Menu
        <main id="cms-container-skip-link-target"
             class="cms-container-skip-link-target flexbox-area-grow fill-height fill-width"
             tabindex="-1"
        >$Content</main>
        $PreviewPanel
    </div>
</body>
</html>
