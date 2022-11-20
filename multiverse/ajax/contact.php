<?php
define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
if(!IS_AJAX) die('Restricted access');

require_once(dirname(__FILE__, 4) . '/zp-core/functions/functions.php'); // PHP 7+
require_once(SERVERPATH . "/" . ZENFOLDER . '/functions/functions-rewrite.php'); // renamed in ZP 1.6

require_once(SERVERPATH . "/" . THEMEFOLDER . '/multiverse/functions.php');

printContactForm();
?>
