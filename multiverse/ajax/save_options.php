<?php
require_once(dirname(dirname(dirname(dirname(__FILE__)))) . '/zp-core/admin-globals.php');
require_once(dirname(dirname(dirname(dirname(__FILE__)))) . '/zp-core/functions.php');
admin_securityChecks(ADMIN_RIGHTS, currentRelativeURL());
if (isset($_POST['sc1'])) {
  $data = "";
  foreach ($_POST as $param_name => $param_val) {
    $data .= $param_val . ',';
  }
  $data = substr($data, 0, -1);
  setThemeOption('social_content', sanitize($data), null, 'multiverse');
}
?>