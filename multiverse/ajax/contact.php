<?php
define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
if(!IS_AJAX) die('Restricted access');

require_once(dirname(dirname(dirname(dirname(__FILE__)))) . '/zp-core/functions.php');
require_once(SERVERPATH . "/" . ZENFOLDER . '/rewrite.php');

require_once(SERVERPATH . "/" . THEMEFOLDER . '/multiverse/functions.php');

printContactForm();
?>
