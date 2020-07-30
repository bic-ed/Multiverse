<?php

// force UTF-8 Ø

require_once(dirname(__FILE__) . '/functions.php');
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
		setThemeOptionDefault('albums_per_row', 4);
		setThemeOptionDefault('images_per_page', 24);
		setThemeOptionDefault('images_per_row', 2);
		setThemeOptionDefault('thumb_transition', 1);
		
		if (class_exists('cacheManager')) {
			cacheManager::deleteCacheSizes($me);
			$width = getThemeOption('image_size_x');
			$height = getThemeOption('image_size_y');
			$img_wmk = getOption('fullimage_watermark') ? getOption('fullimage_watermark') : null;
			$tmb_wmk = getOption('Image_watermark') ? getOption('Image_watermark') : null;
			$img_effect = getThemeOption('image_gray') ? 'gray' : null;
			$tmb_effect = getThemeOption('thumb_gray') ? 'gray' : null;
			// popup
			cacheManager::addCacheSize($me, null, $width, $height, null, null, null, null, null, $img_wmk, $img_effect, true);
			// thumbs
			cacheManager::addCacheSize($me, null, 600, 6000, null, null, null, null, true, $tmb_wmk, $tmb_effect, true);
		}
	}

	function getOptionsSupported() {
		$pages = query_full_array("SELECT `title`,`titlelink`,`show` FROM " . prefix('pages') . "ORDER by `sort_order`");
		$allpages = array();
		$unpublishedpages = array();
		foreach ($pages as $page) {
			$allpages[get_language_string($page['title'])] = $page['titlelink'];
			if (!$page['show']) {
				$unpublishedpages[get_language_string($page['title'])] = $page['titlelink'];
			}
		}
		return array(
			gettext_th('Image width') => array(
				'key' => 'image_size_x',
				'type' => OPTION_TYPE_CUSTOM,
				'order' => 1,
				'desc' => gettext_th('Set the max width in pixels for the image displayed in the popup.')),
			gettext_th('Image height') => array(
				'key' => 'image_size_y',
				'type' => OPTION_TYPE_CUSTOM,
				'order' => 2,
				'desc' => gettext_th('Set the max height in pixels for the image displayed in the popup.') . '<p class="notebox">' . gettext_th("<strong>Note:</strong> images in the popup might be visually reduced in width and height to fit user screen, but they can be zoomed to the sizes set here by double clicking on them.") . '</p>'),
			gettext('Allow search') => array(
				'key' => 'search',
				'type' => OPTION_TYPE_CHECKBOX,
				'order' => 4,
				'desc' => gettext('Check to enable search form.')),
			gettext_th('Email subject') => array(
				'key' => 'email_subject',
				'type' => OPTION_TYPE_TEXTBOX,
				'order' => 5,
				'desc' => gettext_th('Subject of the email sent through the contact form included in Multiverse footer. Zenphoto automatically adds the title of your gallery (between brackets)') . '<br><p class="notebox">' .  gettext_th('<strong>Note:</strong> leave this field empty to include a subject field in the contact form and let users fill it as they wish.') . "</p>"),
			gettext_th('Copyright owner') => array(
				'key' => 'copyrigth_text',
				'type' => OPTION_TYPE_TEXTBOX,
				'order' => 6,
				'desc' => gettext_th('Write the name of the copyright owner here. To this will be automatically added the year of the older image present in your gallery, followed by the current year, with a link to the full archive page.') . "<p class='notebox'>" . gettext_th("<strong>Note:</strong> leave this field empty if you don’t want any copyright text displayed.") . "</p>"),
			gettext_th('Copyright page') => array(
				'key' => 'copyright_page',
				'type' => OPTION_TYPE_SELECTOR,
				'selections' => $allpages,
				'order' => 7,
				'null_selection' => gettext('none'),
				'desc' => gettext_th("Choose the page that contains your site copyright terms, if any. A link to this page will be generated on the name of the copyright owner.") . "<p class='notebox'>" . gettext_th("<strong>Note:</strong> You need the Zenpage extension enabled to use this feature.") . "</p>"),
			gettext_th('Social profiles') => array(
				'key' => 'social_contacts',
				'type' => OPTION_TYPE_CHECKBOX,
				'order' => 8,
				'desc' => gettext_th("Check to display a list of icons with links to your social media profiles, defined by filling the fields below with the following data:") . "<ul><li>" . gettext_th("Your social profile URL") . "</li><li>" . gettext_th("Font Awesome class for the icon (i.e. <em>fa-github</em> for GitHub).") . "<a href='https://fontawesome.com/v4.7.0/icons/#brand' target='blank' title='FontAwesome 4.7'> " . gettext_th("Here the full list") . "</a>" . "</li><li>" . gettext_th("Name of the social media") . "</li></ul>" . gettext_th('Use the <strong>Add</strong> button to add a new social media or the <strong>Delete</strong> button to remove the last one.')),
			gettext('Homepage') => array(
				'key' => 'zenpage_homepage',
				'type' => OPTION_TYPE_SELECTOR,
				'order' => 10,
				'selections' => $unpublishedpages,
				'null_selection' => gettext('none'),
				'desc' => gettext("Choose here any <em>un-published Zenpage page</em> (listed by <em>titlelink</em>) to act as your site’s homepage instead the normal gallery index.") . "<p class='notebox'>" . gettext_th("<strong>Note:</strong> You need the Zenpage extension enabled to use this feature.") . "</p>"),
			gettext('News on index page') => array(
				'key' => 'zenpage_zp_index_news',
				'type' => OPTION_TYPE_CHECKBOX,
				'order' => 11,
				'desc' => gettext("Enable this if you want to show the news section’s first page on the <code>index.php</code> page.") . "<p class='notebox'>" . gettext_th("<strong>Note:</strong> You need the Zenpage extension enabled to use this feature.") . "<br>" . gettext_th("This overrides the <em>Homepage</em> option above.") . "</p>"),
			gettext_th('Enable Pagination') => array(
				'key' => 'pagination',
				'type' => OPTION_TYPE_CHECKBOX,
				'order' => 12,
				'desc' => gettext_th('Check to split albums into multiple pages, depending on the options <code>Albums</code> and <code>Images</code> found at the top of this page. The album design is cleaner with this option disabled (default), however if you have some albums with many images and you are experiencing a too long loading time, you may wish to enable this option.')),
		);
	}
	
	function getOptionsDisabled() {
		return array(
			'image_size',
			'thumb_size',
			'custom_index_page',
			'thumb_transition',
			'thumb_crop'
		);
	}

	function handleOption($option, $currentValue) {
?>
			<input  id="<?php echo $option ?>" name="<?php echo $option;?>" value="<?php echo html_encode($currentValue);?>" type="number" size="4" required min="500">
		<?php
	}
}

$social_contacts = getThemeOption('social_contacts');
$social_content = getThemeOption('social_content');
?>
<script>
var socialEnabled = <?php echo $social_contacts ? $social_contacts : 0; ?>,
socialContent = '<?php echo $social_content ? $social_content : ',,'; ?>',
saveurl = '<?php echo WEBPATH . "/" . THEMEFOLDER; ?>/multiverse/ajax/save_options.php',
buttonAdd = '<?php echo ucfirst(gettext("add")) ?>',
buttonDel = '<?php echo gettext("Delete") ?>';
</script>
<script src="<?php echo WEBPATH . "/" . THEMEFOLDER; ?>/multiverse/js/admin/theme_options.min.js"></script>
