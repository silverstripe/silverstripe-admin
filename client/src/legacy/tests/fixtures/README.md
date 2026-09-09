# Edit form tab fixtures

Edit form markup captured from a CMS after a real failed save, reduced to the tab, panel,
nav and alert elements. Every attribute on those elements is as the CMS emitted it; the
field internals, toolbars and scripts around them were removed, and the absolute hash
links were pointed at `example.com`.

Each fixture holds one required field left blank on a non-active tab.

| Fixture | Form | Tab shape |
|---|---|---|
| `editForm-page-flat.html` | page edit form | flat tabs |
| `editForm-page-flat-valid.html` | page edit form | flat tabs, re-rendered after the error was fixed, still carrying the previous render's icon |
| `editForm-page-nested-tabset-as-tab.html` | page edit form | a tab which is itself a `TabSet` |
| `editForm-page-nested-tabset-in-tab.html` | page edit form | a `TabSet` added inside a `Tab` |
| `editForm-gridfield-flat.html` | GridField detail form | flat tabs |
| `editForm-gridfield-nested-tabset-as-tab.html` | GridField detail form | a tab which is itself a `TabSet` |
| `editForm-gridfield-nested-tabset-in-tab.html` | GridField detail form | a `TabSet` added inside a `Tab` |

The two form types differ in a way the marking logic has to cope with. A page edit form
renders its tab nav inside `#Root`, so each anchor carries `id="tab-<panelId>"`. A
GridField detail form promotes the top level of tabs into
`.cms-content-header-tabs.cms-tabset-nav-primary`, where jQuery UI generates the anchor
ids and the only stable hook is `li[role="tab"][aria-controls="<panelId>"]`. Nested
tabsets keep the `id="tab-<panelId>"` anchors in both.
