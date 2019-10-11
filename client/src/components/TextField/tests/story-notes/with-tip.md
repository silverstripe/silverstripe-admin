## Tip UI

The Tip UI allows you to provide extra context on the purpose of a field. Note that it is applied to `InputField`, not
`TextField` directly, and will not render correctly alongside the prefix / suffix options.

It is triggered via the presence of the `tip` prop, and can accept the following configuration:

- `content`: The text to render in the popover. Should be plaintext - HTML will not be parsed.
- `icon`: An icon from the icon font to use. See the Icon reference for options. Defaults to `lamp`.
- `importance`: Should be specified as `'normal'` or `'high'` (defaults to `'normal'`). Designates the colour used for
   the icon, and the accessible label of the toggle. 

If you're using the TextField backend component in SilverStripe Framework, it has an API to push the Tip schema to the
field. See the `enableTip` method in `TextField.php`.
