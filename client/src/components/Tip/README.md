## Tip

The Tip UI allows you to provide extra context on the purpose of a field. It is designed to be applied to an InputGroup.
You can use it with an `InputField` by passing the relevant configuration in the `tip` prop.

**Note:** The Tip UI will visually conflict with prefix / suffix rendering, as they use the same input-grou
functionality and this can't be stacked.

The Tip component can accept the following configuration:

- `content`: The text to render in the popover. Should be plaintext - HTML will not be parsed.
- `icon`: An icon from the icon font to use. See the Icon reference in the Pattern Library UI. Defaults to `lamp`.
- `importance`: Should be specified as `'normal'` or `'high'` (defaults to `'normal'`). Designates the colour used for
   the icon, and the accessible label of the toggle. Allowed values are defined in the exported `TIP_IMPORTANCE_LEVELS`
   constant in `Tip.js`.

It also requires the following configuration:

- `fieldTitle`: A title for the field it relates to, which will be read aloud for screenreaders.
- `id`: A unique identifier for this instance of the tip

See the `addTip` method in `TextField.php` for an explanation on how to add Tips from the backend.
