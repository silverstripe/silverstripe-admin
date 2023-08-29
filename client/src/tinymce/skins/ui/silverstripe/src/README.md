See instructions for building the skin at https://www.tiny.cloud/docs/tinymce/6/creating-a-skin/#creating-a-skin

Once you've succesfully generated new css files via gulp, copy and replace the following files:
- content.css
- content.inline.css
- content.inline.min.css
- content.min.css
- skin.css
- skin.min.css
- skin.shadowdom.css
- skin.shadowdom.min.css

From:
- modules/oxide/build/skins/ui/default

To:
- vendor/silverstripe/admin/client/src/tinymce/skins/ui/silverstripe/src

Then run `yarn build` to rebuild the admin dist files.
