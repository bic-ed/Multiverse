<?php
$follow_section = 0;
$has_search = getThemeOption('search');
$has_album_menu = function_exists('printAlbumMenu');
$has_news = ZP_NEWS_ENABLED && !empty($_zp_zenpage->getArticles(1));
$has_pages = ZP_PAGES_ENABLED && !empty($_zp_zenpage->getPages(true, true, 1));
$see_more_count = $has_search + $has_album_menu + $has_news + $has_pages;
$has_lang_menu = function_exists('printLanguageSelector');
$menus_count = $see_more_count + 3 * $has_lang_menu;
$has_contact = function_exists('printContactForm');
$has_social = getThemeOption('social_contacts');

// Positioning the "follow" section according to the layout
// $rss_links_enabled is defined in functions.php
if ($has_social || $rss_links_enabled) {
  if ($menus_count > 0 && ($menus_count < 6 || $has_contact && getOption('contactform_captcha'))) {
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
          $icons = explode (",", getThemeOption("social_content"));
          $icons = array_chunk($icons, 3);
          foreach ($icons as $key) { ?>
            <li>
              <a href="<?php echo $key[0]; ?>" target="_blank" rel="noopener" class="icon <?php echo $key[1]; ?>">
                <span class="hide"><?php echo $key[2]; ?></span>
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
        <?php if (in_context(ZP_ALBUM)) { ?>
          <h2><?php printAlbumTitle(); ?></h2>
          <?php printAlbumDesc(); ?>
        <?php } else { ?>
          <h2><?php printGalleryTitle(); ?></h2>
          <?php printGalleryDesc(); ?>
        <?php } ?>
      </section>
      <?php if ($follow_section == 1) printFollowSection(); ?>
      <section class="copyright">
        <p>
          <?php if ($copy_text = getOption('copyrigth_text')) { ?>
            <i class="icon fa-copyright" aria-hidden="true"></i>
            <?php
            $archive_link = getAllDates();
            reset($archive_link);
            $archive_link = substr(key($archive_link), 0, 4);
            $archive_link = '<a title="' . gettext('Archive') . '" href="' . getCustomPageURL('archive') . '">' . $archive_link . '-' . getdate()['year'] . '</a> ';
            if (($copy_page = getOption('copyright_page')) && function_exists('getPageURL')) {
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
          <?php printContactForm($mailsubject); ?>
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
                <?php printAlbumMenuList('list', false, 'album_menu', 'active-item', 'subalbum', 'active-item', gettext("Gallery Index"), null, false, false, true, null); ?>
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
