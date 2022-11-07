<?php
// force UTF-8 Ø
if (!defined('WEBPATH')) die();
?>
<!DOCTYPE html>
<html<?php printLangAttribute(); ?>>
<head>
  <meta charset="<?php echo LOCAL_CHARSET; ?>">
  <?php printHeadTitle(); ?>
  <?php zp_apply_filter('theme_head'); ?>
  <?php if (class_exists('RSS')) {
    if ($_rss_news) {
      printRSSHeaderLink("News", gettext("Latest news"));
    }
    if ($_rss_gallery) {
      printRSSHeaderLink("Gallery", gettext('Latest images'));
    }
  } ?>
</head>
<body class="loading">
  <?php zp_apply_filter('theme_body_open'); ?>
  <div id="wrapper">
    <?php include 'header.php'; ?>
    <div id="main">
      <article id="page">
        <h1><?php echo gettext('Archive') ?></h1>
        <h2><?php echo gettext('Gallery'); ?></h2>
        <?php printAllDates(); ?>
        <?php if(ZENPAGE_ON && ZP_NEWS_ENABLED) { ?>
          <h2 id="news_arch"><?php echo gettext('News'); ?></h2>
          <?php printNewsArchive("archive", 'year', 'month', "", false, 'asc'); ?>
        <?php } ?>
        <h2><?php echo gettext('Tags'); ?></h2>
        <div id="tag_cloud">
          <?php printAllTagsAs('cloud', '', 'abc', true, true, 1.6, 25); ?>
        </div>
      </article>
    </div>
  </div>
  <?php include 'footer.php'; ?>
  <?php zp_apply_filter('theme_body_close'); ?>
</body>
</html>
