import $ from 'jquery';
import debounce from 'lodash/debounce';

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

$(document).on('input', '.confirmedpassword .password', function() {
  const $password = $(this);
  debounce(function () {
    const url = $password.attr('data-strengthurl');
    const $container = $password.closest('.confirmedpassword');
    const $strength = $container.find('.passwordstrength');
    if (!$strength.length || !url) {
      return;
    }
    $.post({
      url,
      data: JSON.stringify({
        password: $password.val()
      }),
    }).done(function(data) {
      const json = JSON.parse(data);
      const level = json.valid ? 'success' : 'danger';
      $strength.html('<p class="alert alert-' + level + '" role="alert">' + json.message + '</p>');
    });
  }, 300)()
});
