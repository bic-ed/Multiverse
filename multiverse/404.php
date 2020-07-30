<?php
// force UTF-8 Ø
if (!defined('WEBPATH')) die();
?>
<!DOCTYPE html>
<html lang="<?php echo ISO_CODE; ?>">
<head>
	<meta charset="<?php echo LOCAL_CHARSET; ?>">
	<?php zp_apply_filter('theme_head'); ?>
	<?php printHeadTitle(); ?>
</head>
<body class="loading">
	<?php zp_apply_filter('theme_body_open'); ?>
	<div id="wrapper">
		<?php include 'header.php'; ?>
		<div id="main">
			<article id="page">
				<h1><?php echo gettext("Object not found"); ?></h1>
				<div class="errorbox">
					<?php print404status(isset($album) ? $album : NULL, isset($image) ? $image : NULL, $obj); ?>
				</div>
			</article>
		</div>
	</div>
	<?php include 'footer.php'; ?>
	<?php	zp_apply_filter('theme_body_close'); ?>
</body>
</html>