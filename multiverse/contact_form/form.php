<?php
/**
* Form for contact_form plugin
* Customized for Multiverse
*/
?>
<form id="mailform" action="<?php echo html_encode(getRequestURI()); ?>" method="post" accept-charset="UTF-8">
  <input type="hidden" id="sendmail" name="sendmail" value="sendmail">
  <label for="mailform-name"><?php echo gettext("Name") ?></label>
  <input type="text" required placeholder="<?php echo gettext("Name") ?>" id="mailform-name" name="name" size="50" value="<?php echo html_encode($mailcontent['name']); ?>" class="field half first">
  <p style="display:none;">
    <label for="mailform-username">Username:</label>
    <input type="text" id="mailform-username" name="username" size="50" value="<?php echo html_encode($mailcontent['honeypot']); ?>">
  </p>
  <label for="mailform-email"><?php echo gettext("E-Mail") ?></label>
  <input type="email" required placeholder="<?php echo gettext("E-Mail") ?>" id="mailform-email" name="email" size="50" value="<?php echo html_encode($mailcontent['email']); ?>" class="field half">
  <label for="mailform-subject"><?php echo $lbl_txt = gettext("Subject:"); ?></label>
  <input class="field" type="text" required placeholder="<?php echo str_replace(':', '', $lbl_txt) ?>" id="mailform-subject" name="subject" size="50" value="<?php echo html_encode($mailcontent['subject']) ?>">
  <label for="mailform-message"><?php echo gettext("Message"); ?></label>
  <textarea class="field" id="mailform-message" required placeholder="<?php echo gettext("Message") ?>" name="message" rows="3"><?php echo $mailcontent['message']; ?></textarea>
  <?php
  if(getOption('contactform_dataconfirmation')) {
    $dataconfirmation_checked = '';
    if(!empty($mailcontent['dataconfirmation'])) {
      $dataconfirmation_checked = ' checked="checked"';
    }
    $data = getDataUsageNotice();
    ?>
    <p class="data_conf">
      <input class="field" type="checkbox" name="dataconfirmation" required id="dataconfirmation" value="1"<?php echo $dataconfirmation_checked ?>>
      <label for="dataconfirmation"><?php echo $data['notice'] ?> </label>
      <?php
      if(!empty($data['url'])) {
        printLinkHTML($data['url'], $data['linktext'], $data['linktext'], null, null);
      }
      ?>
    </p>
  <?php } ?>
  <?php
  if (getOption("contactform_captcha")) {
    $captcha = $_zp_captcha->getCaptcha(gettext("Enter CAPTCHA"));
      if (isset($captcha['html'])) echo $captcha['html'];
      if (isset($captcha['input'])) echo $captcha['input'];
      if (isset($captcha['hidden'])) echo $captcha['hidden'];
    }
    ?>
  <p>
    <input type="submit" class="button special" value="<?php echo gettext("Send e-mail"); ?>">
    <input type="reset" class="button" value="<?php echo gettext("Reset"); ?>">
  </p>
</form>
