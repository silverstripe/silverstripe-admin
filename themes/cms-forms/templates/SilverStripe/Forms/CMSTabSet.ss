<%-- Exclude ".ss-tabset" class to avoid inheriting behaviour --%>
<%-- The ".cms-tabset" class needs to be manually applied to a container elment, --%>
<%-- above the level where the tab navigation is placed. --%>
<%-- Tab navigation is rendered through various templates, --%>
<%-- e.g. through LeftAndMain_EditForm.ss. --%>

<div $AttributesHTML>
	<div class="tab-content">
        <% loop $Tabs %>
            <% if $Tabs %>
                $FieldHolder
            <% else %>
                <div $getAttributesHTML("class") class="tab-pane $extraClass">
                    <% loop $Fields %>
                        $FieldHolder
                    <% end_loop %>
                </div>
            <% end_if %>
        <% end_loop %>
    </div>
</div>
