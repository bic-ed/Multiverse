<?php
// force UTF-8 Ø
if (!defined('WEBPATH')) die();
?>
<!DOCTYPE html>
<html<?php printLangAttribute(); ?>>
<head>
	<meta charset="<?php echo LOCAL_CHARSET; ?>">
	<?php printHeadTitle(); ?>
	<?php zp_apply_filter('theme_head'); ?>
	<?php if (class_exists('RSS')) printRSSHeaderLink("News", "Zenpage news", ""); ?>
</head>

<body class="loading">
	<?php zp_apply_filter('theme_body_open'); ?>
	<div id="wrapper">
		<?php include 'header.php'; ?>
		<div id="main">
			<article id="page">
				<?php
				if (is_NewsArticle()) { // single news article
					if (getPrevNewsURL()) { ?><div class="singlenews_prev"><?php printPrevNewsLink(''); ?></div><?php }
					if (getNextNewsURL()) { ?><div class="singlenews_next"><?php printNextNewsLink(''); ?></div><?php } ?>
					<h1><?php printNewsTitle(); ?></h1>
					<div class="newsarticlecredit">
						<span class="newsarticlecredit-left"><?php printNewsDate(); ?> | <?php
						if (function_exists('getCommentCount')) {
							echo gettext("Comments:") . " " . getCommentCount(); } ?>
						</span>
						<?php if (getNewsCategories()) { echo ' | '; printNewsCategories(", ", gettext("Categories: "), "newscategories"); }?>
						</div>
						<?php
						printNewsContent();
						printCodeblock(1);
						?>
						<?php printTags('links', gettext('Tags') . ': ', 'taglist', ', '); ?>
						<?php
						@call_user_func('printCommentForm');

					} else { // news article loop
						$pag = "";
						$pag_tot = ceil($_zp_zenpage->getTotalArticles() / ZP_ARTICLES_PER_PAGE);
						if ($pag_tot > 1) {
							$curr_pag = getCurrentPage();
							$pag = " (" . $curr_pag . "/" . $pag_tot .")";
						}
						?>
						<h1><?php if (in_context(ZP_ZENPAGE_NEWS_CATEGORY)) {
							printCurrentNewsCategory();
						} else if (is_NewsArchive()) {
							echo gettext('News archive') . ': ';
							printCurrentNewsArchive();
						} else {
							echo gettext('All news');
						}
						echo $pag;
						?>
					</h1>
					<?php
					printNewsPageListWithNav("", "", true, 'pagelist', true, 5);
					while (next_news()):; ?>
					<div class="newsarticle">
						<h2><?php printNewsURL(); ?></h2>
						<div class="newsarticlecredit">
							<span class="newsarticlecredit-left"><?php printNewsDate(); ?> | <?php
							if (function_exists('getCommentCount')) {
								echo gettext("Comments:") . " " . getCommentCount(); } ?>
							</span>
							<?php if (getNewsCategories()) { echo ' | '; printNewsCategories(", ", gettext("Categories: "), "newscategories"); }?>
							</div>
							<?php
							printNewsContent();
							printCodeblock(1);
							?>
							<?php printTags('links', gettext('Tags') . ': ', 'taglist', ', '); ?>
						</div>
						<?php
					endwhile;
					printNewsPageListWithNav("", "", true, 'pagelist', true, 5);
				}	?>
			</article>
		</div>
	</div>
	<?php include("footer.php"); ?>
	<?php	zp_apply_filter('theme_body_close'); ?>
</body>
</html>