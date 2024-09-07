<?php
// force UTF-8 Ø
if (!defined('WEBPATH'))
die();

if (isset($_zp_current_search)) {

  $origin = array_merge(
    getParentBreadcrumb()[0],
    array(
      'open_title' => gettext_th('Open the popup in Search page'),
      'key' => stripcslashes($_zp_current_search->codifySearchString()),
    )
  );

  if ($_zp_current_search->getSearchDate()) {
    $origin['open_title'] = gettext_th('Open the popup in Archive page');
  }

  // NOTE: Dates are not used at all in cached files and
  // there is no difference between tag or normal search,
  // so the specific infos below are available for live pages only.
  if (!class_exists('static_html_cache')) {

    if ($search_date = $_zp_current_search->getSearchDate()) {
      $origin['key'] = getFormattedLocaleDate('F Y', strtotime($search_date));
    }

    if ($_zp_current_search->getSearchFields() && $_zp_current_search->getSearchFields() != 'tags') {
      $searchfields = 1;
    } elseif ($_zp_current_search->getSearchFields() === 'tags') {
      $origin['text'] = gettext('Tag');
    }

  } elseif ($_zp_current_search->getSearchDate()) {
    $origin['text'] = "";
    $origin['key'] = gettext('Archive');
  }

} else {
  if (getThemeOption('multiverse_pagination')) {
    $page = getAlbumPage();
  } else {
    $page = 1;
  }
  $origin = array(
    'link' => html_encode($_zp_current_album->getLink($page)),
    'title' => gettext('View Album'),
    'text' => gettext('Album'),
    'open_title' => gettext_th('Open the popup in Album page'),
    'key' => getBareAlbumTitle(),
  );
}

$imgNumber = imageNumber() . '/' . getNumImages();
if (!class_exists('static_html_cache')) {
  $open = urlencode($_zp_current_image->getTitle());
  // NOTE: handled with an hashtag now, as ZP v1.6 does not allow parameters other than search words
  $open = '#' . $open;
  $imgNumber = ' <a title="'
  . $origin['open_title']. '" href="' . $origin['link'] . $open . '">' . $imgNumber
  . '</a>';
} else {
  $imgNumber = ' <span>' . $imgNumber . '</span>';
}

// Handle non image media
if (!$_zp_current_image->isPhoto()) {
  $media_data = Multiverse::handleMediaImgPage($_zp_current_image);
}
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
<?php if (isset($media_data['width'])) { ?>
<style>
  :root {
    --media-width: <?php echo $media_data['width'] . 'px' ?>;
    --media-ratio: <?php echo $media_data['width'] . '/' . $media_data['height'] ?>
  }
</style>
<?php } ?>
</head>
<body class="loading">
  <?php zp_apply_filter('theme_body_open'); ?>
  <div id="wrapper">
    <?php include 'header.php'; ?>
    <div id="main">
      <article id="page">
        <div id="container">
          <div id="image"<?php echo isset($media_data) ? $media_data['class'] : ""; ?>>
            <?php
            if (isset($media_data['element'])) { // Video or audio file
              echo $media_data['element'];
            } else {
              printDefaultSizedImage(getBareImageTitle());
            }
            ?>
            <?php if (hasPrevImage()) { ?>
              <a class="nav-prev" href="<?php echo html_encode(getPrevImageURL()); ?>"></a>
            <?php } if (hasNextImage()) { ?>
              <a class="nav-next" href="<?php echo html_encode(getNextImageURL()); ?>"></a>
            <?php } ?>
          </div>
          <div id="img_info">
            <h1><?php printBareImageTitle() ?></h1>
            <h2>
              <span>
                <?php echo $origin['text'] ?>
              </span>
              <a href="<?php echo $origin['link'] ?>" title="<?php echo $origin['title'] ?>"><?php echo $origin['key'] ?></a>
            </h2>
            <p>
              <?php echo gettext('Image') . $imgNumber ?>
            </p>
            <p class="date">
              <?php printImageDate(); ?>
            </p>
            <?php printTags('links', null, 'taglist','&nbsp;'); ?>
            <?php $full_img_opt = getOption('protect_full_image');
            if (!isset($media_data) && $full_img_opt !== "No access" && $full_img_opt !== "no-access" && getThemeOption("multiverse_full_image")) { ?>
              <p>
                <?php $icon = "fa fa-picture-o";
                $text = gettext('Original');
                if ($full_img_opt === "Download" || $full_img_opt === "download") {
                  $icon = "fa fa-download";
                  $text = gettext('Download');
                } ?>
                <i class="<?php echo $icon ?>" aria-hidden="true"></i>&nbsp;
                <a id="full_image" href="<?php echo pathurlencode(getFullImageURL()); ?>" title="<?php echo $text . ' (' . getFullWidth() . ' x ' . getFullHeight() . ')'; ?>">
                  <?php echo $text; ?>
                </a>
              </p>
            <?php } ?>
            <?php
            if (getImageMetaData()) {
              printImageMetadata(gettext('Metadata'), true);
            } ?>
          </div>
        </div>
        <?php @callUserFunction('printPagedThumbsNav', [6, false, " ", " ", 50, 50]) ?>
        <div class="img_descr">
          <?php printImageDesc(); ?>
        </div>
        <?php @callUserFunction('printOpenStreetMap'); ?>
        <?php if ($_zp_current_image->getCommentsAllowed() || $_zp_current_image->getCommentCount()) {
          @callUserFunction('printCommentForm');
        } ?>
      </article>
    </div>
  </div>
  <?php include("footer.php"); ?>
  <?php
  printCodeblock(1);
  zp_apply_filter('theme_body_close'); ?>
</body>
</html>
