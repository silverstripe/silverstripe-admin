## Tip UI

The Tip UI allows you to provide extra context on the purpose of a field. Note that it is applied to `InputField`, not
`TextField` directly, and will not render correctly alongside the prefix / suffix options.

It is triggered via the presence of the `tip` prop, and can accept the following configuration:

- `content`: The text to render in the popover. Should be plaintext - no HTML allowed.
- `icon`: An icon from the icon font to use. See the Icon reference for options. Defaults to `white-question`.
- `iconColor`: A suffix to the `text-*` utility class from Bootstrap. Defaults to `muted` (grey). See the [color docs](https://getbootstrap.com/docs/4.3/utilities/colors/#color).
- `autoOpen`: Whether to display the tip popover immediately when the field is rendered. Defaults to `false`.

If you're using the TextField backend component in SilverStripe Framework, it has an API to push the Tip schema to the
field. See the `enableTip` method in `TextField.php`.
