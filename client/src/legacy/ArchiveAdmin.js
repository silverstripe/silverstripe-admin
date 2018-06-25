/**
 * File: ArchiveAdmin.js
 */
import $ from 'jquery';

window.onbeforeunload = function () { };

$.entwine('ss', ($) => {
  $('.other-model-selector select').entwine({
    /**
     * Reacts to the user changing the content type.
     */
    onchange(e) {
      e.preventDefault();

      let targetClassName = $(this).val();
      if (targetClassName) {
        targetClassName = targetClassName.replace(/\\/g, '-');
        const othersArchiveUrl = $('[name="ModelSelectURL"]').val();
        const url = othersArchiveUrl + '/' + targetClassName;

        $('.cms-container').loadPanel(url, '', { pjax: 'CurrentForm' });
      }
    }
  });
});
