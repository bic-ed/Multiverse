<?php
/**
* Form for comment_form plugin
* Customized for Multiverse
*/
?>
<form id="commentform" action="#commentform" method="post">
  <input type="hidden" name="comment" value="1">
  <input type="hidden" name="remember" value="1">
  <?php
  printCommentErrors();
  ?>
  <p style="display:none;">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" value="">
  </p>
  <?php
  if ($req = getOption('comment_name_required')) {
    if ($req != 'required') $req = "";
    if (getOption('comment_form_anon') && !$disabled['anon']) {
      ?>
      <span>
        <input type="checkbox" name="anon" id="anon" value="1"<?php if ($stored['anon']) echo ' checked="checked"';
        echo $disabled['anon']; ?>>
        <label for="anon"> (<?php echo gettext("<em>anonymous</em>"); ?>)</label>
      </span>
      <?php
    }
    ?>
    <label for="name"><?php echo gettext("Name") ?></label>
    <input type="text"<?php echo " " . $req ?> placeholder="<?php echo gettext("Name") ?>" id="name" name="name" size="22" value="<?php echo html_encode($stored['name']); ?>" class="field half first">
    <?php
  }
  if ($req = getOption('comment_email_required')) {
    if ($req != 'required') $req = "";
    ?>
    <label for="email"><?php echo gettext("E-Mail") ?></label>
    <input type="email"<?php echo " " . $req ?> placeholder="<?php echo gettext("E-Mail") ?>" id="email" name="email" size="22" value="<?php echo html_encode($stored['email']); ?>" class="field half">
    <?php
  }
  if ($req = getOption('comment_web_required')) {
    if ($req != 'required') $req = "";
    ?>
    <label for="website"><?php echo gettext("Website") ?></label>
    <input type="url"<?php echo " " . $req ?> placeholder="<?php echo gettext("Website") ?>" id="website" name="website" size="22" value="<?php echo html_encode($stored['website']); ?>" class="field">
    <?php
  }
  if ($req = getOption('comment_form_addresses')) {
    if ($req != 'required') $req = "";
    ?>
    <label for="0-comment_form_street"><?php echo gettext("Street") ?></label>
    <input type="text"<?php echo " " . $req ?> placeholder="<?php echo gettext("Street") ?>" name="0-comment_form_street" id="0-comment_form_street" class="field" size="22" value="<?php echo html_encode($stored['street']); ?>">
    <label for="0-comment_form_city"><?php echo gettext("City") ?></label>
    <input type="text"<?php echo " " . $req ?> placeholder="<?php echo gettext("City") ?>" name="0-comment_form_city" id="0-comment_form_city" class="field" size="22" value="<?php echo html_encode($stored['city']); ?>">
    <label for="comment_form_state"><?php echo gettext("State") ?></label>
    <input type="text"<?php echo " " . $req ?> placeholder="<?php echo gettext("State") ?>" name="0-comment_form_state" id="comment_form_state" class="field" size="22" value="<?php echo html_encode($stored['state']); ?>">
    <label for="comment_form_country"><?php echo gettext("Country") ?></label>
    <input type="text"<?php echo " " . $req ?> placeholder="<?php echo gettext("Country") ?>" id="comment_form_country" name="0-comment_form_country" class="field" size="22" value="<?php echo html_encode($stored['country']); ?>">
    <label for="comment_form_postal"><?php echo gettext("Postal code") ?></label>
    <input type="text"<?php echo " " . $req ?> placeholder="<?php echo gettext("Postal code") ?>" id="comment_form_postal" name="0-comment_form_postal" class="field" size="22" value="<?php echo html_encode($stored['postal']); ?>">
    <?php
  } ?>
  <label for="comment"><?php $lbl_txt = gettext("Comment:"); echo $lbl_txt ?></label>
  <textarea placeholder="<?php echo str_replace(':', '', $lbl_txt) ?>" required name="comment" id="comment" rows="4" cols="42" class="field"><?php
  echo $stored['comment'];
  echo $disabled['comment'];
  ?></textarea>
  <?php
  if (getOption('comment_form_dataconfirmation')) {
    $data = getDataUsageNotice();
    ?>
    <p class="data_conf">
      <input class="field" type="checkbox" required id="comment_dataconfirmation" name="comment_dataconfirmation" value="1"<?php if ($stored['comment_dataconfirmation']) echo ' checked="checked"'; ?>>
      <label for="comment_dataconfirmation"><?php echo $data['notice'] ?> </label>
      <?php
      if(!empty($data['url'])) {
        printLinkHTML($data['url'], $data['linktext'], $data['linktext'], null, null);
      }
      ?>
    </p>
    <?php
  }
  ?>
  <?php
  if (getOption('comment_form_private') && !$disabled['private']) {
    ?>
    <p>
      <input type="checkbox" id="private" name="private" value="1"<?php if ($stored['private']) echo ' checked="checked"'; ?>>
      <label for="private"><?php echo gettext("Private comment (do not publish)"); ?></label>
    </p>
  <?php } ?>
  <?php
  if (commentFormUseCaptcha()) {
    $captcha = $_zp_captcha->getCaptcha(gettext("Enter CAPTCHA"));
    ?>
    <p>
      <?php
      if (isset($captcha['html'])) echo $captcha['html'];
      if (isset($captcha['input'])) echo $captcha['input'];
      if (isset($captcha['hidden'])) echo $captcha['hidden'];
      ?>
    </p>
  <?php } ?>
  <input type="submit" class="button special"  value="<?php echo gettext('Add Comment'); ?>">
</form>
