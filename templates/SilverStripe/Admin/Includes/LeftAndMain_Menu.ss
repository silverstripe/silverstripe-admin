<div class="cms-mobile-menu-toggle-wrapper"></div>

<nav class="fill-height cms-menu cms-panel cms-panel-layout" id="cms-menu" data-layout-type="border" aria-label="<%t SilverStripe\\Admin\\LeftAndMain_Menu.MainMenu 'Main menu' %>">
	<div class="cms-menu__header">
		<% include SilverStripe\\Admin\\LeftAndMain_MenuLogo %>
		<% include SilverStripe\\Admin\\LeftAndMain_MenuStatus %>
	</div>

	<div class="flexbox-area-grow panel--scrollable panel--triple-toolbar cms-panel-content">
		<% include SilverStripe\\Admin\\LeftAndMain_MenuList %>
	</div>

	<div class="toolbar toolbar--south cms-panel-toggle">
		<% include SilverStripe\\Admin\\LeftAndMain_MenuToggle %>
	</div>
</nav>

<button class="fill-height fill-width cms-menu-mobile-overlay" aria-controls="cms-menu" aria-expanded="false"></button>
