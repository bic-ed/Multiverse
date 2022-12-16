<?php // force UTF-8 Ø
if (!defined('WEBPATH')) die();
$pag = "";
$curr_pag = 1;
$numalbums = getNumAlbums();
$numimages = getNumImages();
$total = $numimages + $numalbums;
$img_per_page = getThemeOption('images_per_page');
$alb_per_page = getThemeOption('albums_per_page');
$pag_tot = getTotalPages();
if ($pag_tot > 1) {
  $curr_pag = getCurrentPage();
  $pag = " (" . $curr_pag . "/" . $pag_tot .")";
}
?>
<!DOCTYPE html>
<html<?php printLangAttribute(); ?>>
<head>
  <meta charset="<?php echo LOCAL_CHARSET; ?>">
  <?php printHeadTitle() ?>
  <?php zp_apply_filter('theme_head'); ?>
  <?php if (class_exists('RSS')) {
    if ($_rss_news) {
      printRSSHeaderLink("News", gettext("Latest news"));
    }
    if ($_rss_gallery) {
      printRSSHeaderLink("Gallery", gettext('Latest images'));
    }
  } ?>
  <?php printZDSearchToggleJS(); ?>
</head>
<body class="loading">
  <?php zp_apply_filter('theme_body_open'); ?>
  <div id="wrapper">
    <?php include("header.php"); ?>
    <div id="main">
      <article id="page">
        <h1><?php if (isArchive()) {
          $date = $_zp_current_search->getSearchDate();
          echo '<a href="' . getCustomPageURL('archive') . '">' . gettext('Gallery archive') . '</a>' . ': ' . getFormattedLocaleDate('F Y', $date);
        } else {
          echo gettext_th('Search results');
        }
        echo $pag; ?></h1>
        <?php
        if (ZENPAGE_ON && !isArchive()) {
          $numpages = getNumPages();
          $numnews = getNumNews();
          $total = $total + $numnews + $numpages;
        } else {
          $numpages = $numnews = 0;
        }
        $searchwords = getSearchWords();
        $searchdate = getSearchDate();
        if (!empty($searchdate)) {
          if (!empty($searchwords)) {
            $searchwords .= ": ";
          }
          $searchwords .= $searchdate;
        }
        if (isset($_GET['searchfields']) && $_GET['searchfields'] === "tags") {
          $searchwords = "tag = " . $searchwords;
        }
        ?>
        <h2>
          <?php printf(ngettext('%1$u Hit for <em>%2$s</em>', '%1$u Hits for <em>%2$s</em>', $total), $total, $searchwords);?>
        </h2>
        <?php
        if (!$total) {
          echo "<p>".gettext("Sorry, no matches found. Try refining your search.")."</p>";
        }
        if (ZENPAGE_ON && $_zp_page == 1) { //test of zenpage searches
          if ($numpages > 0 && ZP_PAGES_ENABLED) {
            $number_to_show = 5;
            $c = 0;
            ?>
            <hr />
            <h3><?php echo gettext('Pages') . ' (' . $numpages . ')'; ?> <small><?php printZDSearchShowMoreLink('pages', $number_to_show); ?></small></h3>
            <ul class="searchresults">
              <?php while (next_page()) {
                $c++; ?>
                <li<?php printZDToggleClass('pages', $c, $number_to_show); ?>>
                  <h4><?php printPageURL(); ?></h4>
                  <p class="zenpageexcerpt"><?php echo shortenContent(getBare(getPageContent()), 80, getOption("zenpage_textshorten_indicator")); ?></p>
                </li>
              <?php } // end while ?>
            </ul>
            <?php
          }
          if ($numnews > 0) {
            $number_to_show = 5;
            $c = 0;
            ?>
            <h3><?php printf(gettext('Articles (%s)'), $numnews); ?> <small><?php printZDSearchShowMoreLink("news", $number_to_show); ?></small></h3>
            <ul class="searchresults">
              <?php
              while (next_news()) {
                $c++;
                ?>
                <li<?php printZDToggleClass('news',$c,$number_to_show); ?>>
                  <h4><?php printNewsURL(); ?></h4>
                  <p class="zenpageexcerpt"><?php echo shortenContent(strip_tags(getNewsContent()),80,getOption("zenpage_textshorten_indicator")); ?></p>
                </li>
              <?php } // end while ?>
            </ul>
            <?php
          }
        }
        ?>
        <h3>
          <?php
          if (getOption('search_no_albums') && !getOption('search_no_images') && $numimages) {
            echo gettext('Images') . ' (' . $numimages . ')';
          } else if (getOption('search_no_images') && $numalbums) {
            echo gettext('Albums') . ' (' . $numalbums . ')';
          } else if ($numalbums && $numimages) {
            echo gettext('Albums') . ' (' . $numalbums . ') & ' . gettext('Images') . ' (' . $numimages . ')';
          } else if ($numalbums) {
            echo gettext('Albums') . ' (' . $numalbums . ')';
          } else if ($numimages) {
            echo gettext('Images') . ' (' . $numimages . ')';
          }
          ?>
        </h3>
        <?php printPageListWithNav("", "", false, true, 'pagelist', null, true, 5);
        ?>
      </article>
      <?php if ($numalbums) {
        $from = $to = '';
        $ii = 0;
        $first_album = getThemeOption('albums_per_page');
        while (next_album()) { ?>
          <?php if ($ii == 0) {
            $ii = 1;
            $from = ($_zp_page - 1) * $alb_per_page + 1;
            $to = min(($_zp_page * $alb_per_page), $numalbums);
            if ($from === $to || $numalbums < $alb_per_page) {
              $from = ' (' . $numalbums . ')';
            } else {
              $from = ' (' . $from . ' - ' . $to . ')';
            }
            ?>
            <h2><?php echo ngettext_th('album', 'albums', $numalbums) . $from; ?></h2>
          <?php } ?>
          <div class="album thumb">
            <a href="<?php echo html_encode(getAlbumURL()); ?>" title="<?php echo gettext('View album:'); ?> <?php printAnnotatedAlbumTitle(); ?>"><?php printCustomAlbumThumbImage(getBareAlbumTitle(), null, 300, 200, 300, 200); ?></a>
            <h3><a href="<?php echo html_encode(getAlbumURL()); ?>" title="<?php echo gettext('View album:'); ?> <?php printAnnotatedAlbumTitle(); ?>"><?php printAlbumTitle(); ?></a></h3>
            <span><?php printAlbumDate(""); ?></span>
            <p><?php echo truncate_string(getBareAlbumDesc(), 120); ?></p>
          </div>
        <?php } // end while ?>
      <?php } ?>
      <?php if ($numimages) {
        // Get size options before the loops
        $image_x = getThemeOption('multiverse_image_size_x');
        $image_y = getThemeOption('multiverse_image_size_y');
        $thumb_x = 600;
        $thumb_y = 10 * $thumb_x; // dummy multiplier for height to get all thumbs of the same width
        $from = $to = '';
        $ii = 0;
        while (next_image()) { ?>
          <?php if ($ii == 0) {
            $ii = 1;
            // Set a cookie with number of albums and first page images, needed on image.php
            zp_setCookie("bic_multiverse_search", $numalbums . ',' . $_zp_first_page_images, SEARCH_DURATION);
            $imagePageOffset = getTotalPages(2);
            if ($_zp_page == $imagePageOffset) {
              $from = 1;
              $to = min($_zp_first_page_images, $numimages);
            } else {
              $from = 1 + $_zp_first_page_images + ($_zp_page - $imagePageOffset - 1) * $img_per_page;
              $to = min($_zp_first_page_images + ($_zp_page - $imagePageOffset) * $img_per_page, $numimages);
            }
            if ($from === $to || $numimages <= $_zp_first_page_images) {
              $from = ' (' . $numimages . ')';
            } else {
              $from = ' (' . $from . ' - ' . $to . ')';
            }
            ?>
            <h2><?php echo ngettext_th('image', 'images', $numimages) . $from; ?></h2>
          <?php } ?>
          <div class="thumb">
            <a class="image" href='<?php echo getCustomSizedImageMaxSpace($image_x, $image_y); ?>' title="<?php printBareImageTitle(); ?>">
              <?php printCustomSizedImageThumbMaxSpace(getBareImageTitle(), $thumb_x, $thumb_y); ?>
            </a>
            <h2><a href="<?php echo htmlspecialchars(getImageURL());?>" title="<?php echo getBareImageTitle();?>"> <?php printBareImageTitle(); ?></a></h2>
            <?php // echo truncate_string(html_encodeTagged(getImageDesc()), 100, ' (..)'); ?>
          </div>
        <?php } // end while ?>
      <?php } ?>
    </div>
  </div>
  <?php include("footer.php"); ?>
  <?php zp_apply_filter('theme_body_close');

  // Open popup with the image of the referer image.php page
  if (!class_exists('static_html_cache')) { ?>
    <script>
      <?php echo file_get_contents(dirname(__FILE__) . '/js/internal/popup_on_hash.min.js'); ?>
    </script>
  <?php } ?>
</body>
</html>
