<?php
// force UTF-8 Ø

if(ZENPAGE_ON) { // check if Zenpage is enabled or not
  if (NEWS_IS_HOME && ZP_NEWS_ENABLED) { // news on index
    include ('news.php');
  } else if (checkForPage(PAGE_IS_HOME) && ZP_PAGES_ENABLED) { // page on index
    include ('pages.php');
  } else {
    include ('gallery.php');
  }
} else {
  include ('gallery.php');
}
?>
