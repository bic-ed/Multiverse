<?php
// force UTF-8 Ø
// TODO: Develop video compatibility
if (!defined('WEBPATH')) die();
?>
<!DOCTYPE html>
<html<?php printLangAttribute(); ?>>
<head>
  <meta charset="<?php echo LOCAL_CHARSET; ?>">
  <?php zp_apply_filter('theme_head'); ?>
  <?php printHeadTitle(); ?>
  <?php if (class_exists('RSS') && $_rss_gallery) {
    printRSSHeaderLink("Album", "Album: " . getAlbumTitle());
  } ?>
</head>
<body class="loading">
  <?php zp_apply_filter('theme_body_open'); ?>
  <div id="wrapper">
    <?php include 'header.php'; ?>
    <div id="main">
      <?php
      // Get size options before the loops
      $image_x = getThemeOption('multiverse_image_size_x');
      $image_y = getThemeOption('multiverse_image_size_y');
      $thumb_x = 600;
      $thumb_y = 10 * $thumb_x; // dummy multiplier for height to get all thumbs of the same width

      if (!getThemeOption('multiverse_pagination')) { // no pagination (default)
        while (next_image(true)) { ?>
          <div class="thumb">
            <a class="image" href='<?php echo getCustomSizedImageMaxSpace($image_x, $image_y); ?>' title="<?php printBareImageTitle(); ?>">
              <?php printCustomSizedImageThumbMaxSpace(getBareImageTitle(), $thumb_x, $thumb_y); ?>
            </a>
            <h2><a href="<?php echo htmlspecialchars(getImageURL());?>" title="<?php echo getBareImageTitle();?>"> <?php printBareImageTitle(); ?></a></h2>
            <?php // echo truncate_string(html_encodeTagged(getImageDesc()), 100, ' (..)'); ?>
          </div>
        <?php } // end while
        $once = 0;
        while (next_album(true)) {
          if (!$once++) { ?>
            <h2><?php echo gettext('Subalbums') ?></h2>
          <?php } ?>
          <div class="album thumb">
            <a href="<?php echo html_encode(getAlbumURL()); ?>" title="<?php echo gettext('View album:'); ?> <?php printAnnotatedAlbumTitle(); ?>"><?php printCustomAlbumThumbImage(getBareAlbumTitle(), null, 300, null, 300, 200); ?></a>
            <h3><a href="<?php echo html_encode(getAlbumURL()); ?>" title="<?php echo gettext('View album:'); ?> <?php printAnnotatedAlbumTitle(); ?>"><?php printAlbumTitle(); ?></a></h3>
            <span><?php printAlbumDate(""); ?></span>
            <p><?php echo truncate_string(getBareAlbumDesc(), 120); ?></p>
          </div>
        <?php } // end while

      } else { // pagination enabled
        $once = 0;
        while (next_album()) {
          if (!$once++) {
            $has_sub = 1; ?>
            <h2><?php echo gettext('Subalbums') ?></h2>
          <?php } ?>
          <div class="album thumb">
            <a href="<?php echo html_encode(getAlbumURL()); ?>" title="<?php echo gettext('View album:'); ?> <?php printAnnotatedAlbumTitle(); ?>"><?php printCustomAlbumThumbImage(getBareAlbumTitle(), null, 300, null, 300, 200); ?></a>
            <h3><a href="<?php echo html_encode(getAlbumURL()); ?>" title="<?php echo gettext('View album:'); ?> <?php printAnnotatedAlbumTitle(); ?>"><?php printAlbumTitle(); ?></a></h3>
            <span><?php printAlbumDate(""); ?></span>
            <p><?php echo truncate_string(getBareAlbumDesc(), 120); ?></p>
          </div>
        <?php }
        $once = 0;
        while (next_image()) {
          if (!$once++ && isset($has_sub)) { ?>
            <h2><?php echo gettext('Images') ?></h2>
          <?php } ?>
          <div class="thumb">
            <a class="image" href='<?php echo getCustomSizedImageMaxSpace($image_x, $image_y); ?>' title="<?php printBareImageTitle(); ?>">
              <?php printCustomSizedImageThumbMaxSpace(getBareImageTitle(), $thumb_x, $thumb_y); ?>
            </a>
            <h2><a href="<?php echo htmlspecialchars(getImageURL());?>" title="<?php echo getBareImageTitle();?>"> <?php printBareImageTitle(); ?></a></h2>
            <?php // echo truncate_string(html_encodeTagged(getImageDesc()), 100, ' (..)'); ?>
          </div>
        <?php }
        printPageListWithNav("", "", false, true, 'pagelist gallery', null, true, 5);
      } // end if ?>
    </div>
  </div>
  <?php include 'footer.php'; ?>
  <?php zp_apply_filter('theme_body_close');

  // Open popup with the image of the referer image.php page
  if (isset($_GET['title']) && !class_exists('static_html_cache')) {
    $title = sanitize($_GET['title']); ?>
    <script>
    $(window).on('load', function(){
      $('a.image, a.icon').css("pointer-events", "none");
      var title = "<?php echo js_encode($title); ?>",
      $image = $('a.image[title="' + title + '"]');
      setTimeout(function(){
        $('html').animate({scrollTop: $image.offset().top + ($image.height() - $(window).height())/2}, 400, function(){
          $('a.image, a.icon').css("pointer-events", "auto");
        });
      }, 2000);
      setTimeout(function(){
        $image.click();
      }, 1600);
    });
    </script>
  <?php } ?>
</body>
</html>
