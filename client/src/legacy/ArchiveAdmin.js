/**
 * File: ArchiveAdmin.js
 */
import $ from 'jquery';

$.entwine('ss', ($) => {
  $('.ArchiveAdmin__action--restore').entwine({
    onmatch() {
      $(this).attr('readonly', false);
      $(this).attr('disabled', false);
    }
  });

  $('.other-model-selector select').entwine({
    /**
     * Reacts to the user changing the content type.
     */
    onchange(e) {
      e.preventDefault();

      let targetClassName = $(this).val();
      const othersArchiveUrl = $(this).data('others-archive-url');
      if (targetClassName) {
        targetClassName = targetClassName.replace(/\\/g, '-');
        const url = othersArchiveUrl + targetClassName + '#Root_Others';

        $('.cms-container').loadPanel(url, '', { pjax: 'CurrentForm' });
      }
    }
  });
});
