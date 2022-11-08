import $ from 'jquery';

// TODO Enable once https://github.com/webpack/extract-text-webpack-plugin/issues/179 is resolved. Included in bundle.scss for now.
// import '../styles/legacy/ConfirmedPasswordField.scss';

$(document).on('click', '.confirmedpassword .showOnClick a', function () {
  var $container = $('.showOnClickContainer', $(this).parent());

  $container.toggle('fast', function() {
    $container
      .toggleClass('d-none')
      .find('input[type="hidden"]')
      .val($container.hasClass('d-none') ? 0 : 1);
  });

  return false;
});
