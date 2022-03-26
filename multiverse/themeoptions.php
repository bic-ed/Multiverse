<?php

// force UTF-8 Ø

class ThemeOptions {

  function __construct() {
    $me = basename(dirname(__FILE__));
    setThemeOptionDefault('zenpage_zp_index_news', 0);
    setThemeOptionDefault('zenpage_homepage', 'none');
    setThemeOptionDefault('custom_index_page', '');
    setThemeOptionDefault('search', true);
    setThemeOptionDefault('pagination', false);
    setThemeOptionDefault('image_gray', 0);
    setThemeOptionDefault('thumb_gray', 0);
    setThemeOptionDefault('image_size_x', 1600);
    setThemeOptionDefault('image_size_y', 1000);
    setThemeOptionDefault('email_subject', 'Message from your site');
    setThemeOptionDefault('social_content', ',,');
    setThemeOptionDefault('social_contacts', 0);
    setThemeOptionDefault('albums_per_page', 12);
    setThemeOptionDefault('images_per_page', 24);
    setThemeOptionDefault('thumb_transition', 1);
    setThemeOptionDefault('thumb_transition_min', 24);
    setThemeOptionDefault('thumb_transition_max', 24);
    setThemeOptionDefault('display_copyright_notice', 0);
    setThemeOptionDefault('full_image', 0);
    setThemeOptionDefault('image_size', 595);
    setThemeOptionDefault('image_use_side', 'longest');

    if (class_exists('cacheManager')) {
      cacheManager::deleteCacheSizes($me);
      $width = getThemeOption('image_size_x', null, 'multiverse');
      $height = getThemeOption('image_size_y', null, 'multiverse');
      $image_size = getThemeOption('image_size', null, 'multiverse');
      $img_wmk = getOption('fullimage_watermark') ? getOption('fullimage_watermark') : null;
      $tmb_wmk = getOption('Image_watermark') ? getOption('Image_watermark') : null;
      $img_effect = getThemeOption('image_gray', null, 'multiverse') ? 'gray' : null;
      $tmb_effect = getThemeOption('thumb_gray', null, 'multiverse') ? 'gray' : null;
      // popup
      cacheManager::addCacheSize($me, null, $width, $height, null, null, null, null, null, $img_wmk, $img_effect, true);
      // thumbs
      cacheManager::addCacheSize($me, null, 600, 6000, null, null, null, null, true, $tmb_wmk, $tmb_effect, true);
      // image page
      cacheManager::addCacheSize($me, $image_size, null, null, null, null, null, null, null, $img_wmk, $img_effect, null);
    }
  }

  function getOptionsSupported() {
    global $_zp_db;
    $pages = $_zp_db->queryFullArray("SELECT `title`,`titlelink`,`show` FROM " . $_zp_db->prefix('pages') . "ORDER by `sort_order`");
    $allpages = array();
    $unpublishedpages = array();
    foreach ($pages as $page) {
      $allpages[get_language_string($page['title'])] = $page['titlelink'];
      if (!$page['show']) {
        $unpublishedpages[get_language_string($page['title'])] = $page['titlelink'];
      }
    }
    $me = "multiverse";
    return array(
      gettext_th('Image width', $me) => array(
        'key' => 'image_size_x',
        'type' => OPTION_TYPE_CUSTOM,
        'order' => 1,
        'desc' => gettext_th('Set the max width in pixels for the image displayed in the popup.', $me)
      ),
      gettext_th('Image height', $me) => array(
        'key' => 'image_size_y',
        'type' => OPTION_TYPE_CUSTOM,
        'order' => 2,
        'desc' => gettext_th('Set the max height in pixels for the image displayed in the popup.', $me) . '<p class="notebox">' . gettext_th("<strong>Note:</strong> images in the popup might be visually reduced in width and height to fit user screen, but they can be zoomed to the sizes set here by double clicking on them.", $me) . '</p>'
      ),
      gettext('Full image link') => array(
        'key' => 'full_image',
        'type' => OPTION_TYPE_CHECKBOX,
        'order' => 3,
        'desc' => gettext_th('Check to show a link to the full size image on the image page. The behavior of the link depends on the options set in <code>Options->Image: Full image protection</code>.', $me) . "</p>"
      ),
      gettext('Allow search') => array(
        'key' => 'search',
        'type' => OPTION_TYPE_CHECKBOX,
        'order' => 4,
        'desc' => gettext('Check to enable search form.')
      ),
      gettext_th('Email subject', $me) => array(
        'key' => 'email_subject',
        'type' => OPTION_TYPE_TEXTBOX,
        'order' => 5,
        'desc' => gettext_th('Subject of the email sent through the contact form included in Multiverse footer. Zenphoto automatically adds the title of your gallery (between brackets)', $me) . '<p class="notebox">' .  gettext_th('<strong>Note:</strong> leave this field empty to include a subject field in the contact form and let users fill it as they wish.', $me) . "</p>"
      ),
      gettext_th('Copyright owner', $me) => array(
        'key' => 'copyrigth_text',
        'type' => OPTION_TYPE_TEXTBOX,
        'order' => 6,
        'desc' => gettext_th('Write the name of the copyright owner here. To this will be automatically added the year of the older image present in your gallery, followed by the current year, with a link to the full archive page.', $me) . "<p class='notebox'>" . gettext_th("<strong>Note:</strong> leave this field empty if you don’t want any copyright text displayed.", $me) . "</p>"
      ),
      gettext_th('Copyright page', $me) => array(
        'key' => 'copyright_page',
        'type' => OPTION_TYPE_SELECTOR,
        'selections' => $allpages,
        'order' => 7,
        'null_selection' => gettext('none'),
        'desc' => gettext_th("Choose the page that contains your site copyright terms, if any. A link to this page will be generated on the name of the copyright owner.", $me) . "<p class='notebox'>" . gettext_th("<strong>Note:</strong> You need the Zenpage extension enabled to use this feature.", $me) . "</p>"
      ),
      gettext_th('Social profiles', $me) => array(
        'key' => 'social_contacts',
        'type' => OPTION_TYPE_CHECKBOX,
        'order' => 8,
        'desc' => gettext_th("Check to display a list of icons with links to your social media profiles, defined by filling the fields below with the following data:", $me)
        . "<ul><li>"
        . gettext_th("Your social profile URL", $me)
        . "</li><li>"
        . gettext_th("Font Awesome class for the icon (i.e. <em>fa-github</em> for GitHub).", $me)
        . '<a href="https://fontawesome.com/v4.7.0/icons/#brand" target="_blank" rel="noopener" title="FontAwesome 4.7"> '
        . gettext_th("Here the full list", $me) . "</a>"
        . "</li><li>"
        . gettext_th("Name of the social media", $me)
        . "</li></ul>"
        . gettext_th('Use the <strong>Add</strong> button to add a new social media or the <strong>Delete</strong> button to remove the last one.', $me)
      ),
      gettext('Homepage') => array(
        'key' => 'zenpage_homepage',
        'type' => OPTION_TYPE_SELECTOR,
        'order' => 10,
        'selections' => $unpublishedpages,
        'null_selection' => gettext('none'),
        'desc' => gettext("Choose here any <em>un-published Zenpage page</em> (listed by <em>titlelink</em>) to act as your site’s homepage instead the normal gallery index.")
        . "<p class='notebox'>"
        . gettext_th("<strong>Note:</strong> You need the Zenpage extension enabled to use this feature.", $me)
        . "</p>"
      ),
      gettext('News on index page') => array(
        'key' => 'zenpage_zp_index_news',
        'type' => OPTION_TYPE_CHECKBOX,
        'order' => 11,
        'desc' => gettext("Enable this if you want to show the news section’s first page on the <code>index.php</code> page.")
        . "<p class='notebox'>"
        . gettext_th("<strong>Note:</strong> You need the Zenpage extension enabled to use this feature.", $me)
        . "<br>"
        . gettext_th("This overrides the <em>Homepage</em> option above.", $me)
        . "</p>"
      ),
      gettext_th('Enable Pagination', $me) => array(
        'key' => 'pagination',
        'type' => OPTION_TYPE_CHECKBOX,
        'order' => 12,
        'desc' => gettext_th('Check to split albums into multiple pages, depending on the options <code>Albums</code> and <code>Images</code> found at the top of this page. The album design is cleaner with this option disabled (default), however if you have some albums with many images and you are experiencing a too long loading time, you may wish to enable this option.', $me)
      )
    );
  }

  function getOptionsDisabled() {
    return array(
      // 'image_size',
      'thumb_size',
      'custom_index_page',
      'thumb_transition',
      'thumb_transition_min',
      'thumb_transition_max',
      'thumb_crop'
    );
  }

  function handleOption($option, $currentValue) {
    ?>
    <input  id="<?php echo $option ?>" name="<?php echo $option;?>" value="<?php echo html_encode($currentValue);?>" type="number" size="4" required min="500">
    <?php
  }
}

$social_contacts = getThemeOption('social_contacts', null, 'multiverse');
$social_content = getThemeOption('social_content', null, 'multiverse');
?>
<script>
var socialEnabled = <?php echo $social_contacts ? $social_contacts : 0; ?>,
socialContent = '<?php echo $social_content ? $social_content : ',,'; ?>',
saveurl = '<?php echo WEBPATH . "/" . THEMEFOLDER; ?>/multiverse/ajax/save_options.php',
buttonAdd = '<?php echo ucfirst(gettext("add")) ?>',
buttonDel = '<?php echo gettext("Delete") ?>';
</script>
<script src="<?php echo WEBPATH . "/" . THEMEFOLDER; ?>/multiverse/js/admin/theme_options.min.js"></script>
