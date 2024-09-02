<?php
/**
* Form for contact_form plugin
* Customized for Multiverse
*/
$autocomplete = getOption('contactform_autocomplete') ? '' : ' autocomplete="off"';
?>
<form id="mailform" action="<?php echo html_encode(getRequestURI()); ?>" method="post"<?php echo $autocomplete ?> accept-charset="UTF-8">
  <input type="hidden" id="sendmail" name="sendmail" value="sendmail">
  <label class="hide" for="mailform-name"><?php echo gettext("Name") ?></label>
  <?php $auto = contactForm::getAutocompleteAttr('name', true) ?>
  <input type="text"<?php echo $auto ?> required placeholder="<?php echo gettext("Name") ?>" id="mailform-name" name="name" size="50" value="<?php echo html_encode($mailcontent['name']); ?>" class="field half first">
  <p class="hide">
    <label for="mailform-username">Username:</label>
    <input type="text" tabindex="-1" id="mailform-username" name="username" size="50" value="<?php echo html_encode($mailcontent['honeypot']); ?>">
  </p>
  <?php $auto = contactForm::getAutocompleteAttr('email', true) ?>
  <label class="hide" for="mailform-email"><?php echo gettext("E-Mail") ?></label>
  <input type="email"<?php echo $auto ?> required placeholder="<?php echo gettext("E-Mail") ?>" id="mailform-email" name="email" size="50" value="<?php echo html_encode($mailcontent['email']); ?>" class="field half">
  <label class="hide" for="mailform-subject"><?php echo $lbl_txt = gettext("Subject:"); ?></label>
  <input class="field" type="text" required placeholder="<?php echo str_replace(':', '', $lbl_txt) ?>" id="mailform-subject" name="subject" size="50" value="<?php echo html_encode($mailcontent['subject']) ?>">
  <label class="hide" for="mailform-message"><?php echo gettext("Message"); ?></label>
  <textarea class="field" id="mailform-message" required placeholder="<?php echo gettext("Message") ?>" name="message" rows="3"><?php echo $mailcontent['message']; ?></textarea>
  <?php
	$textquiz_question = contactForm::getQuizFieldQuestion('contactform_textquiz');
	if ($textquiz_question) { ?>
    <input class="field" placeholder="<?php echo html_encode($textquiz_question); ?>" type="text" id="comment_textquiz" name="comment_textquiz" size="50" value="<?php echo $mailcontent['textquiz']; ?>" required autocomplete="off" />
    <label class="hide" for="comment_textquiz"><?php echo html_encode($textquiz_question); ?><strong>*</strong></label>
	<?php 
	} 
	$mathquiz_question = contactForm::getQuizFieldQuestion('contactform_mathquiz');
	if ($mathquiz_question) { ?>
    <input class="field" placeholder="<?php echo html_encode($mathquiz_question); ?>=" type="text" id="comment_mathquiz" name="comment_mathquiz" size="50" value="<?php echo $mailcontent['mathquiz']; ?>" required autocomplete="off" />
    <label class="hide" for="comment_mathquiz"><?php echo html_encode($mathquiz_question); ?>=<strong>*</strong></label>
	<?php }
  if (getOption("contactform_captcha")) {
    $captcha = $_zp_captcha->getCaptcha(gettext("Enter CAPTCHA"));
    // NOTE: not using label as it is not associated with any input field and not displayed by this theme
      // if (isset($captcha['html'])) echo $captcha['html'];
      if (isset($captcha['input'])) echo $captcha['input'];
      if (isset($captcha['hidden'])) echo $captcha['hidden'];
    }

  if (getOption('contactform_dataconfirmation')) {
    $dataconfirmation_checked = '';
    if (!empty($mailcontent['dataconfirmation'])) {
      $dataconfirmation_checked = ' checked="checked"';
    }
    $data = getDataUsageNotice();
    ?>
    <p class="data_conf">
      <input class="field" type="checkbox" name="dataconfirmation" required id="dataconfirmation" value="1"<?php echo $dataconfirmation_checked ?>>
      <label for="dataconfirmation"><?php echo $data['notice'] ?> </label>
      <?php
      if (!empty($data['url'])) {
        printLinkHTML($data['url'], $data['linktext'], $data['linktext'], null, null);
      }
      ?>
    </p>
  <?php } ?>
  <p>
    <input type="submit" class="button special" value="<?php echo gettext("Send e-mail"); ?>">
    <input type="reset" class="button" value="<?php echo gettext("Reset"); ?>">
  </p>
</form>
