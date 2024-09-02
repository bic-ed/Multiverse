<?php
$follow_section = 0;
$has_search = getThemeOption('multiverse_search');
$has_album_menu = function_exists('printAlbumMenu');
$has_news = ZENPAGE_ON && ZP_NEWS_ENABLED && !empty($_zp_zenpage->getArticles(1));
$has_pages = ZENPAGE_ON && ZP_PAGES_ENABLED && !empty($_zp_zenpage->getPages(true, true, 1));
$see_more_count = $has_search + $has_album_menu + $has_news + $has_pages;
$has_lang_menu = function_exists('printLanguageSelector');
$menus_count = $see_more_count + 3 * $has_lang_menu;
$has_contact = method_exists( 'contactForm','printContactForm');
$has_social = getThemeOption('multiverse_social_contacts');
/** @var int Vertical "size" of the Contact Form */
$contact_size = 0;
if ($has_contact) {
  $contact_size = $has_contact *
    (4 // Minimum size of the Contact Form
      + 2 * getOption('contactform_captcha') // reCaptcha widget takes about 2 slots
      + empty(Multiverse::$mailsubject)
      + !empty(getOption('contactform_dataconfirmation'))
      + !empty(contactForm::getQuizFieldQuestion('contactform_textquiz'))
      + !empty(contactForm::getQuizFieldQuestion('contactform_mathquiz'))
    );
}
/** @var int Vertical "size" of the Menu Section */
$menu_size = $has_search + $has_album_menu + $has_news + $has_pages + 2 * $has_lang_menu;

// Positioning the "follow" section according to the layout
// $rss_links_enabled is defined in functions.php
if ($has_social || $rss_links_enabled) {
  if ($menus_count > 0 && $contact_size > $menu_size) {
    $follow_section = 3;
  } else if ($has_contact) {
    $follow_section = 2;
  } else {
    $follow_section = 1;
  }

  function printFollowSection() {
    global $has_social;
    ?>
    <section class="social">
      <h2><?php echo gettext_th('Follow me on...'); ?></h2>
      <ul class="icons">
        <?php printFooterRSS(); // RSS links as defined in functions.php
        if ($has_social) {
          $icons = explode (",", getThemeOption("multiverse_social_content"));
          $icons = array_chunk($icons, 3);
          foreach ($icons as $key) { ?>
            <li>
              <a href="<?php echo htmlentities(urldecode($key[0])); ?>" target="_blank" rel="noopener" class="icon <?php echo $key[1]; ?>">
                <span class="hide"><?php echo htmlentities(urldecode($key[2])); ?></span>
              </a>
            </li>
          <?php }
        } ?>
      </ul>
    </section>
    <?php
    return;
  }
}
?>
<footer class="panel">
  <div class="inner split">
    <div>
      <section>
        <?php if (in_context(ZP_IMAGE)) { ?>
          <h2><?php printAlbumTitle(); ?></h2>
          <?php printAlbumDesc(); ?>
        <?php } elseif (in_context(ZP_ALBUM)) { ?>
          <h1><?php printAlbumTitle(); ?></h1>
          <?php printAlbumDesc(); ?>
        <?php } else { ?>
          <h2><?php printGalleryTitle(); ?></h2>
          <?php printGalleryDesc(); ?>
        <?php } ?>
      </section>
      <?php if ($follow_section == 1) printFollowSection(); ?>
      <section class="copyright">
        <p>
          <?php if ($copy_text = getThemeOption('multiverse_copyrigth_text')) { ?>
            <i class="icon fa-copyright" aria-hidden="true"></i>
            <?php
            echo $contact_size, ' ', $menu_size, ' ';
            $archive_link = getAllDates();
            reset($archive_link);
            $archive_link = substr(key($archive_link), 0, 4);
            $archive_link = '<a title="' . gettext('Archive') . '" href="' . getCustomPageURL('archive') . '">' . $archive_link . '-' . getdate()['year'] . '</a> ';
            if (($copy_page = getThemeOption('multiverse_copyright_page')) && function_exists('getPageURL')) {
              $copy_text = '<a href="' . getPageURL($copy_page) . '" title="' . gettext_th('Copyright info') . '">' . $copy_text . '</a>';
            }
            echo $archive_link . $copy_text . '<br>';
          } ?>
          <i class="icon big fa-code" aria-hidden="true"></i>&nbsp;<a href="https://www.zenphoto.org/" title="Zenphoto CMS" target="_blank" rel="noopener"><span class="big">zen</span><span class="small">PHOTO</span></a>
          + <a href="https://html5up.net" title="HTML5 UP" target="_blank" rel="noopener">HTML5 UP</a>
          + <a class="small" href="https://www.antonioranesi.it" title="Antonio Ranesi <?php echo gettext_th('Photographer'); ?>" target="_blank" rel="noopener"><i class="icon fa-heart-o" aria-hidden="true"></i> bic-ed</a>
        </p>
      </section>
    </div>
    <?php if ($has_contact) { ?>
      <div>
        <section>
          <h2><?php echo gettext_th('Get in touch'); ?></h2>
          <?php contactForm::printContactForm(Multiverse::$mailsubject); ?>
          <div id="form-result"></div>
        </section>
        <?php if ($follow_section == 2) printFollowSection(); ?>
      </div>
    <?php } ?>
    <?php if ($menus_count) { ?>
      <div class="menu_group">
        <?php if ($see_more_count) { ?>
          <section>
            <h2><?php echo gettext_th("See more"); ?></h2>
            <?php if ($has_search) { ?>
              <label for="search_input" class="hide"><?php echo gettext('Search') ?></label>
              <?php
              printSearchForm("","search", "","");
            } ?>
            <?php if ($has_album_menu) { ?>
              <nav class="main-nav">
                <ul class="drop">
                  <li>
                    <a>
                      <?php echo gettext('Albums') ?>
                    </a>
                  </li>
                </ul>
                <?php
                $galleryText = gettext("Gallery Index");
                if (!ZENPAGE_ON) {
                  $galleryText = gettext("Home");
                  setOption('custom_index_page', '', false);
                }
                printAlbumMenuList('list', false, 'album_menu', 'active-item', 'subalbum', 'active-item', $galleryText, null, false, false, true, null); ?>
              </nav>
            <?php } ?>
            <?php if ($has_pages) { ?>
              <nav class="main-nav">
                <ul class="drop">
                  <li>
                    <a>
                      <?php echo gettext('Pages') ?>
                    </a>
                  </li>
                </ul>
                <?php printPageMenu('list', 'page_menu', 'active-item', 'subalbum', 'active-item', null, 0); ?>
              </nav>
            <?php } if ($has_news) { ?>
              <nav class="main-nav">
                <ul class="drop">
                  <li>
                    <a>
                      <?php echo gettext('News') ?>
                    </a>
                  </li>
                </ul>
                <?php printNestedMenu('list', 'categories', false, 'news_menu', 'active-item', 'subalbum', 'active-item', gettext('All news')); ?>
              </nav>
            <?php }?>
          </section>
        <?php } ?>
        <?php if ($has_lang_menu) { ?>
          <section>
            <h2><?php echo gettext_th("Language"); ?></h2>
            <nav class="main-nav">
              <ul class="drop">
                <li>
                  <a>
                    <?php printLangAttribute(); // real value set via javascript ?>
                  </a>
                </li>
              </ul>
              <?php printLanguageSelector(true); ?>
            </nav>
          </section>
        <?php } ?>
        <?php if ($follow_section == 3) printFollowSection(); ?>
      </div>
    <?php } ?>
  </div>
</footer>
