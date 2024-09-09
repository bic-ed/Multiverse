<?php
/**
 * Prints jQuery JS to enable the toggling of search results of Zenpage  items
 *
 */
function printZDSearchToggleJS() {
  echo <<<HTML
  <script>
  function toggleExtraElements(category, show) {
    if (show) {
      $('.' + category + '_showless').show()
      $('.' + category + '_showmore').hide()
      $('.' + category + '_extrashow').show()
    } else {
      $('.' + category + '_showless').hide()
      $('.' + category + '_showmore').show()
      $('.' + category + '_extrashow').hide()
    }
  }
  </script>
  HTML;
}

/**
 * Prints the "Show more/less results" buttons in search results for Zenpage items
 *
 * @param string $type Item typology ("news" or "pages")
 * @param int $limit How many search results should be shown initially
 * @param int $tot Total items count
 */
function printZDSearchShowMoreLink($type, $limit, $tot) {
  if ($tot > $limit) {
    $more = gettext('Show more results');
    $less = gettext('Show fewer results');
    echo <<<HTML
    <a class="{$type}_showmore small" href="javascript:toggleExtraElements('$type',true)">$more</a>
    <a class="{$type}_showless small" href="javascript:toggleExtraElements('$type',false)" style="display:none">$less</a>
    HTML;
  }
}

/**
 * Adds the css class necessary for toggling of Zenpage items search results.
 * 
 * Hides items exceeding the provided number to show initially.
 *
 * @param string $type Item typology ("news" or "pages")
 * @param int $count Current item number
 * @param int $limit How many search results should be shown initially
 */
function printZDToggleClass($type, $count, $limit) {
  if ($count > $limit) {
    echo "class='{$type}_extrashow' style='display:none'";
  }
}


zp_register_filter('theme_head', 'css_head', 500);
zp_register_filter('theme_body_close', 'multiverse');

/**
 * Sets viewport and loads CSS
 *
 * @return void 
 */
function css_head() {
  global $_zp_themeroot, $_zp_loggedin, $_zp_gallery_page;
  // Viewport and CSS links
  $multi_css = '/css/multi.css';
  $timestamp = filemtime(__DIR__ . $multi_css);
  echo <<<HTML
     <meta name="viewport" content="width=device-width, initial-scale=1.0">\n
     <link rel="stylesheet" href="$_zp_themeroot$multi_css?t=$timestamp">\n
     HTML;
  if ($_zp_gallery_page == 'image.php' && extensionEnabled('paged_thumbs_nav')) {
    $pagedthumbsnav_css = '/css/plugins/pagedthumbsnav.css';
    $timestamp = filemtime(__DIR__ . $pagedthumbsnav_css);
    echo <<<HTML
     <link rel="stylesheet" href="$_zp_themeroot$pagedthumbsnav_css?t=$timestamp">\n
     HTML;
  }
  // Internal CSS
  $internal_style = '';
  if (extensionEnabled("themeSwitcher") && themeSwitcher::active()) {
    $internal_style .= '<style>';
    $internal_style .= file_get_contents(__DIR__ . '/css/internal/theme_switcher.min.css');
  }
  if ($_zp_loggedin) {
    $internal_style .= $internal_style ? '' : '<style>';
    $internal_style .= file_get_contents(__DIR__ . '/css/internal/mv_ad_tb.min.css');
  }
  echo $internal_style ? "$internal_style</style>\n" : '';

  // Store the email subject theme option to use it later
  Multiverse::$mailsubject = trim(getThemeOption('multiverse_email_subject'));

}

function my_checkPageValidity($request, $gallery_page, $page) {
  switch ($gallery_page) {
    case 'gallery.php':
    $gallery_page = 'index.php'; // same as an album gallery index
    break;
    case 'index.php':
    if (ZENPAGE_ON) {
      if (NEWS_IS_HOME) {
        $gallery_page = 'news.php'; // really a news page
        break;
      }
      if (PAGE_IS_HOME) {
        return $page == 1; // only one page if zenpage enabled.
      }
    }
    break;
    case 'news.php':
    case 'album.php':
    case 'search.php':
    break;
    default:
    if ($page != 1) {
      return false;
    }
  }
  return checkPageValidity($request, $gallery_page, $page);
}

/**
 * makes news page 1 link go to the index page
 * 
 * @param string $link
 * @param object $obj
 * @param int $page
 */
function newsOnIndex($link, $obj, $page) {
  if (is_string($obj) && $obj == 'news.php') {
    if (MOD_REWRITE) {
      if (preg_match('~' . _NEWS_ . '[/\d/]*$~', $link)) {
        $link = WEBPATH . '/';
        if ($page > 1)
        $link .=  _PAGE_ . '/' . $page;
      }
    } else {
      if (strpos($link, 'category=') === false && strpos($link, 'title=') === false) {
        $link = str_replace('?&', '?', rtrim(str_replace('p=news', '', $link), '?'));
      }
    }
  }
  return $link;
}

if (!OFFSET_PATH) {
  setOption('user_logout_login_form', 2, false);
  define('ZENPAGE_ON', extensionEnabled('zenpage'));
  $_zp_page_check = 'my_checkPageValidity';
  if (ZENPAGE_ON) {
    define('NEWS_IS_HOME', getThemeOption('multiverse_index_news'));
    define('PAGE_IS_HOME', NEWS_IS_HOME ? false : getThemeOption('multiverse_homepage'));
    if (NEWS_IS_HOME) {  // only one index page if zenpage plugin is enabled & displaying
      zp_register_filter('getLink', 'newsOnIndex');
    }
  }
}


if (extensionEnabled("contact_form")) {
  // Disable contact form unwanted fields.
  setOption('contactform_title', 'omitted', false);
  setOption('contactform_city', 'omitted', false);
  setOption('contactform_state', 'omitted', false);
  setOption('contactform_company', 'omitted', false);
  setOption('contactform_street', 'omitted', false);
  setOption('contactform_postal', 'omitted', false);
  setOption('contactform_country', 'omitted', false);
  setOption('contactform_website', 'omitted', false);
  setOption('contactform_phone', 'omitted', false);
  setOption('contactform_confirm', '0', false);
  setOption('contactform_email', 'required', false);
  setOption('contactform_name', 'required', false);
}

if (extensionEnabled('comment_form')) {
  setOption('tinymce4_comments', null, false);
}

if (extensionEnabled("themeSwitcher")) {
  setOption('themeSwitcher_css', null, false);
  setOption('themeSwitcher_css_loggedin', null, false);
}

if (extensionEnabled("reCaptcha")) {
  setOption('reCaptcha_theme', 'dark', false);
}

/**
 *
 * Defines variables and loads javascript file
 * @author bic-ed
 *
 */
function multiverse() {
  global $_zp_themeroot, $_zp_gallery_page, $_zp_loggedin;

  // Some missing context sensitive menu behavior to be added via JavaScript:
  // $news_active = 1 -> Disable "All news" link in NewsCategories menu
  // $gallery_active = 1 -> Disable "Gallery index" link in Album menu
  $news_active = $gallery_active = 0;
  if (ZENPAGE_ON) {
    switch ($_zp_gallery_page) {
      case 'index.php':
        if (NEWS_IS_HOME) {
          $news_active = 1;
        } elseif (!PAGE_IS_HOME) {
          $gallery_active = 1;
        }
        break;
      case 'gallery.php':
        $gallery_active = 1;
        break;
    }
  } else if ($_zp_gallery_page == "index.php" && getCurrentPage() < 2) {
    $gallery_active = 1;
  }

  $javas = json_encode([
    'searchPlaceholder' => strtoupper(gettext("search")),
    'newsActive' => ($news_active ? 1 : 0),
    'galleryActive' => ($gallery_active ? 1 : 0),
    'contactURL' => WEBPATH . '/themes/multiverse/ajax/contact.php',
    'mailSubject' => Multiverse::$mailsubject,
    'mailSent' => get_language_string(getOption('contactform_thankstext')),
  ]);
  $multi_js = '/js/merged/multi.js';
  $timestamp = filemtime(__DIR__ . $multi_js);
  echo <<<HTML
     <script>phpToJS=$javas</script>
     <script src="$_zp_themeroot$multi_js?t=$timestamp"></script>\n
     HTML;
  return;
}

/**
 * Detects if there is at least one link to print
 * for the next function printFooterRSS()
 * @var bool
 */
$rss_links_enabled = false;
if (class_exists('RSS') && !OFFSET_PATH) {
  // Get needed (here and later) RSS options
  $_rss_gallery = getOption('RSS_album_image');
  $_rss_news = ZENPAGE_ON && ZP_NEWS_ENABLED && getOption('RSS_articles');
  $rss_links_enabled = $_rss_gallery || $_rss_news;
}
/**
 * Prints RSS links in footer
 * @author bic-ed
 */
function printFooterRSS() {
  global $_zp_current_album, $rss_links_enabled, $_rss_gallery, $_rss_news;
  if ($rss_links_enabled) { ?>
    <li class="main-nav rss">
      <ul class="drop rss">
        <li>
          <a class="icon fa-rss">
            <span class="hide">RSS Feed</span>
          </a>
        </li>
      </ul>
      <ul>
        <?php
        if ($_rss_news) {
          printRSSLink("News", "<li>", gettext("News"), '</li>', false);
        }
        if ($_rss_gallery) {
          printRSSLink('Gallery', '<li>', gettext('Gallery'), '</li>', false);
          if (!is_null($_zp_current_album)) {
            printRSSLink('Album', '<li>', gettext('Album'), '</li>', false);
          }
        }
        ?>
      </ul>
    </li>
    <?php
  }
  return;
}

class Multiverse {

static $mailsubject = '';

  /**
   * Implements audio, video and text object support for poptrox-popup
   * 
   * Also returns some media info to be used in the single image page
   * @param object  $media  current media ($_zp_current_image)
   * @param int $w      media width
   * @param int $h      media height
   * @return array
   */
  static function handleMediaAlbPage($media, $w = 0, $h = 0) {

    $type = $poster = $icon = null;

    if ($media->isPhoto()) {

      $media_url = getCustomSizedImageMaxSpace($w, $h);
      $data_poptrox = '';

    } else if ($media->isVideo()) { // video or audio file

      $media_url = getUnprotectedImageURL();

      if ($width = $media->get('VideoResolution_x')) { // video file

        $height = $media->get('VideoResolution_y');

        $data_poptrox = ' data-poptrox="video,' . $width . 'x' . $height . '"';
        $type = 'video';
        $icon = '<i class="fa fa-video-camera" aria-hidden="true"></i>';

      } else { // audio file

        $poster = $media->getThumbImageFile();
        list($width, $height) = getimagesize($poster);
        
        $data_poptrox = ' data-poptrox="audio,' . $width . 'x' . $height . '"';
        $type = 'audio';
        $icon = '<i class="fa fa-music" aria-hidden="true"></i>';

      }

    } else if (strtolower(get_class($media)) == 'textobject') { // text object

      $dom = new DOMDocument();
      @$dom->loadHTML(file_get_contents(SERVERPATH . getUnprotectedImageURL()));
      $elm = $dom->getElementsByTagName('iframe');

      if ($elm->length) { // iframe text object

        $width = $elm->item(0)->getAttribute('width');
        $height = $elm->item(0)->getAttribute('height');

        if (strpos($width, '%') !== false || strpos($height, '%') !== false) {
          $width = $height = null;
        }

        if (!($width && $height)) {
          $poster = $media->getThumbImageFile();
          if (strpos($poster, 'themes/multiverse/images') === false) {
            list($width, $height) = getimagesize($poster);
          }
        }
        $sizes = ($width && $height) ? ',' . $width . 'x' . $height : '';

        $media_url = $elm->item(0)->getAttribute('src');
        $data_poptrox = ' data-poptrox="iframe' . $sizes . '"';
        $type = 'text-iframe';
        $icon = '<i class="fa fa-code" aria-hidden="true"></i>';

      } else { // generic text object. We don't load it into the popup but open its image page
        // QUESTION: Add popup support for non-iframe TextObject?

        $media_url = getImageURL();
        $data_poptrox = ' data-poptrox="ignore"';
        $type = 'text-any';
        $icon = '<i class="fa fa-external-link-square" aria-hidden="true"></i>';

      }

    } else { // class-AnyFile object. We don't load it into the popup but open its image page

      $media_url = getImageURL();
      $data_poptrox = ' data-poptrox="ignore"';
      $type = 'anyfile-any';
      $icon = '<i class="fa fa-external-link-square" aria-hidden="true"></i>';

    }

    return array(
      // for poptrox-popup
      'url' => $media_url,
      'data' => $data_poptrox,
      'icon' => $icon,
      // for image page
      'width' => isset($width) ? round($width) : null,
      'height' => isset($height) ? round($height) : null,
      'type' => $type,
      'poster' => $poster
    );

  }

  /**
   * Scales dimensions following image size settings. Does not enlarge.
   * 
   * @param int     $width  Full widht of the media
   * @param int     $height Full height of the media
   * @return array<int>         scaled width and height
   */
  static function resizePoster($width, $height) {
    $ratio = $width / $height;
    $size = getOption('image_size');

    switch (getOption('image_use_side')) {

      case 'width':
        if ($width > $size) {
          $width = $size;
          $height = round($size / $ratio);
        }
        break;

      case 'height':
        if ($height > $size) {
          $height = $size;
          $width = round($size * $ratio);
        }
        break;

      case 'longest':
        if ($ratio >= 1 && $width > $size) {
          $width = $size;
          $height = round($size / $ratio);
        } else if ($height > $size) {
          $height = $size;
          $width = round($size * $ratio);
        }
        break;

      case 'shortest':
        if ($ratio < 1 && $width > $size) {
          $width = $size;
          $height = round($size / $ratio);
        } else if ($height > $size) {
          $height = $size;
          $width = round($size * $ratio);
        }
        break;
    }

    return array('width' => (int) $width, 'height' => (int) $height);

  }

  /**
   * Implements audio, video and text object handling on image page
   * 
   * @param object $media current media ($_zp_current_image)
   * @return array The class and sizes for any media; The html element for video or audio
   */
  static function handleMediaImgPage($media) {

    $media_info = self::handleMediaAlbPage($media);

    // If missing sizes, get them from poster (if any).
    if (!($media_info['height'] && $media_info['width']) && !$media_info['poster']) {
      $poster = $media->getThumbImageFile();
      if (strpos($poster, 'themes/multiverse/images') === false) {
        list($media_info['width'], $media_info['height']) = getimagesize($poster);
      }
    }

    $resized = array('width' => null, 'height' => null);
    if ($media_info['height'] && $media_info['width']) {
      $resized = self::resizePoster($media_info['width'], $media_info['height']);
    }

    $class = ' class="is-media"';
    $element = null;
    if ($media_info['type'] == 'audio') {
      $class = ' class="is-media is-audio"';
      $poster = $media_info['poster'];
      if (strpos($poster, 'themes/multiverse/images') !== false) {
        $poster_src = str_replace(SERVERPATH, WEBPATH, $poster);
      } else {
        $filename = makeSpecialImageName($poster);
        $args = getImageParameters(array(null, $resized['width'], $resized['height']));
        $mtime = filemtime(internalToFilesystem($poster));
        $poster_src = getImageURI($args, $media->getAlbumName(), $filename, $mtime);
      }
      $element = '<audio style="background-image:url(' . $poster_src . ')" controls src="' . getUnprotectedImageURL() . '">'
      . gettext('Your browser sadly does not support this audio format.')
      . '</audio>';
    } else if ($media_info['type'] == 'video') {
      $element = '<video controls preload="metadata" src="' . getUnprotectedImageURL() . '">'
      . gettext('Your browser sadly does not support this video format.')
      . '</video>';
    }

    return array(
      'class' => $class,
      'width' => $resized['width'],
      'height' => $resized['height'],
      'element' => $element
    );

  }

}
