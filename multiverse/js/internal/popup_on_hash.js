$(window).on('load', () => {

  var title = decodeURI(window.location.hash.replace('#', '').replaceAll('+', ' ')),
    $image = $('a.image[title="' + title + '"]');

  if (!$image.length)
    return;

  $('a').css("pointer-events", "none");

  setTimeout(() => {

    $('html').animate({ scrollTop: $image.offset().top + ($image.height() - $(window).height()) / 2 }, 400, () => {
      $image.trigger('click');
      $('a').css("pointer-events", "");
    });

  }, 1500);

});
