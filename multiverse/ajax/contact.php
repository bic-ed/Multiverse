<?php
define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
if (!IS_AJAX) die('Restricted access');

require_once(dirname(__FILE__, 4) . '/zp-core/functions/functions.php'); // PHP 7+
require_once(SERVERPATH . "/" . ZENFOLDER . '/functions/functions-rewrite.php'); // renamed in ZP 1.6

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

//! Disable quizzes if answers are correct, since using the form via ajax the ZP validation does not work for them. The validation is done here anyway.
if (isset($_POST['contactform_textquiz'])) {
  $right_answer = strtolower(trim(get_language_string(getOption('contactform_textquiz_answer'))));
  $user_answer = strtolower(trim($_POST['contactform_textquiz']));
  if ($user_answer == $right_answer) {
    setOption('contactform_textquiz', '0', false);
  }
}
if (isset($_POST['contactform_mathquiz'])) {
  $right_answer = eval('return ' . contactForm::getQuizFieldQuestion('contactform_mathquiz') . ';');
  $user_answer = trim($_POST['contactform_mathquiz']);
  if ($user_answer == $right_answer) {
    setOption('contactform_mathquiz', '0', false);
  }
}

contactForm::printContactForm();
