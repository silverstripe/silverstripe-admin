// This file was generated by silverstripe/cow from client/lang/src/en.json.
// See https://github.com/tractorcow/cow for details
if (typeof(ss) === 'undefined' || typeof(ss.i18n) === 'undefined') {
  if (typeof(console) !== 'undefined') { // eslint-disable-line no-console
    console.error('Class ss.i18n not defined');  // eslint-disable-line no-console
  }
} else {
  ss.i18n.addDictionary('en', {
    "Admin.BATCH_ARCHIVE_PROMPT": "You have {num} page(s) selected.\n\nAre you sure you want to archive these pages?\n\nThese pages and all of their children pages will be unpublished and sent to the archive.",
    "Admin.BATCH_DELETELIVE_PROMPT": "You have {num} page(s) selected.\n\nDo you really want to delete these pages from live?",
    "Admin.BATCH_DELETE_PROMPT": "You have {num} page(s) selected.\n\nAre you sure you want to delete these pages?\n\nThese pages and all of their children pages will be deleted and sent to the archive.",
    "Admin.BATCH_PUBLISH_PROMPT": "You have {num} page(s) selected.\n\nDo you really want to publish?",
    "Admin.BATCH_RESTORE_PROMPT": "You have {num} page(s) selected.\n\nDo you really want to restore to stage?\n\nChildren of archived pages will be restored to the root level, unless those pages are also being restored.",
    "Admin.BATCH_UNPUBLISH_PROMPT": "You have {num} page(s) selected.\n\nDo you really want to unpublish",
    "Admin.SELECTONEPAGE": "Please select at least one page",
    "Admin.FormatExample": "Example: {format}",
    "Admin.NO_SIZE": "N/A",
    "Admin.CLOSE": "Close",
    "Admin.CONFIRMUNSAVED": "Are you sure you want to navigate away from this page?\n\nWARNING: Your changes have not been saved.\n\nPress OK to continue, or Cancel to stay on the current page.",
    "Admin.CONFIRMUNSAVEDSHORT": "WARNING: Your changes have not been saved.",
    "Admin.VALIDATIONERROR": "Validation Error",
    "Admin.NONE": "None",
    "Admin.EDIT": "Edit",
    "Admin.ANY": "Any",
    "Admin.LOADING": "Loading...",
    "Admin.USED_ON": "Used on",
    "Admin.TYPE": "Type",
    "Admin.NOT_USED": "This is not used anywhere",
    "Admin.NOT_AVAILABLE_USED_DATA": "The usage data is currently unavailable.",
    "Admin.LOADING_ERROR": "As error occured when loading the data: {message}",
    "Admin.ERRORINTRANSACTION": "An error occured while fetching data from the server\n Please try again later.",
    "Admin.DELETECONFIRMMESSAGE": "Are you sure you want to delete this record?",
    "Admin.EXPANDPANEL": "Expand panel",
    "Admin.COLLAPSEPANEL": "Collapse panel",
    "Admin.VALIDATOR_MESSAGE_REQUIRED": "{name} is required.",
    "Admin.VALIDATOR_MESSAGE_EQUALS": "{name} are not equal.",
    "Admin.VALIDATOR_MESSAGE_NUMERIC": "{name} is not a number.",
    "Admin.VALIDATOR_MESSAGE_DATE": "{name} is not a proper date format.",
    "Admin.VALIDATOR_MESSAGE_ALPHANUMERIC": "{name} is not an alphanumeric value.",
    "Admin.VALIDATOR_MESSAGE_ALPHA": "{name} is not only letters.",
    "Admin.VALIDATOR_MESSAGE_DEFAULT": "{name} is not a valid value.",
    "Admin.OWNED_WARNING_1": "You are unpublishing content that is being used in {count} other published section(s).",
    "Admin.OWNED_WARNING_2": "This could cause a published page have missing components on the live site.",
    "Admin.OWNED_WARNING_3": "Do you want to unpublish anyway?"
});
}
