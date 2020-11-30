<?php // force UTF-8 Ø
if (!defined('WEBPATH')) die();
$pag = "";
$curr_pag = 1;
$numalbums = getNumAlbums();
$numimages = getNumImages();
$total = $numimages + $numalbums;
$img_per_page = getThemeOption('images_per_page');
$alb_per_page = getThemeOption('albums_per_page');
$_firstPageImages = $numalbums ? $img_per_page : NULL;
$pag_tot = getTotalPages();
if ($pag_tot > 1) {
	$curr_pag = getCurrentPage();
	$pag = " (" . $curr_pag . "/" . $pag_tot .")";
}
?>
<!DOCTYPE html>
<html<?php printLangAttribute(); ?>>
<head>
	<meta charset="<?php echo LOCAL_CHARSET; ?>">
	<?php printHeadTitle() ?>
	<?php zp_apply_filter('theme_head'); ?>
	<?php if (class_exists('RSS')) printRSSHeaderLink('Gallery', gettext('Gallery RSS')); ?>
	<?php printZDSearchToggleJS(); ?>
</head>
<body class="loading">
	<?php zp_apply_filter('theme_body_open'); ?>
	<div id="wrapper">
		<?php include("header.php"); ?>
		<div id="main">
			<article id="page">
				<h1><?php if (isArchive()) {
					$date = strtotime($_zp_current_search->getSearchDate());
					echo gettext('Gallery archive') . ': ' . strftime('%B %Y', $date);
				} else {
					echo gettext_th('Search results'); 
				} 
				echo $pag; ?></h1>
				<?php
				if (ZENPAGE_ON && !isArchive()) {
					$numpages = getNumPages();
					$numnews = getNumNews();
					$total = $total + $numnews + $numpages;
				} else {
					$numpages = $numnews = 0;
				}
				$searchwords = getSearchWords();
				$searchdate = getSearchDate();
				if (!empty($searchdate)) {
					if (!empty($searchwords)) {
						$searchwords .= ": ";
					}
					$searchwords .= $searchdate;
				}
				if (isset($_GET['searchfields']) && $_GET['searchfields'] === "tags") {
					$searchwords = "tag = " . $searchwords;
				}
				?>
				<h2>
					<?php	printf(ngettext('%1$u Hit for <em>%2$s</em>', '%1$u Hits for <em>%2$s</em>', $total), $total, $searchwords);?>
				</h2>
				<?php
				if (!$total) {
					echo "<p>".gettext("Sorry, no matches found. Try refining your search.")."</p>";
				}
				if (ZENPAGE_ON && $_zp_page == 1) { //test of zenpage searches
					if ($numpages > 0 && ZP_PAGES_ENABLED) {
						$number_to_show = 5;
						$c = 0;
						?>
						<hr />
						<h3><?php echo gettext('Pages') . ' (' . $numpages . ')'; ?> <small><?php printZDSearchShowMoreLink('pages', $number_to_show); ?></small></h3>
						<ul class="searchresults">
							<?php
							while (next_page()) {
								$c++;
								?>
								<li<?php printZDToggleClass('pages', $c, $number_to_show); ?>>
								<h4><?php printPageURL(); ?></h4>
								<p class="zenpageexcerpt"><?php echo shortenContent(getBare(getPageContent()), 80, getOption("zenpage_textshorten_indicator")); ?></p>
							</li>
							<?php
						}
						?>
					</ul>
					<?php
				}
				if ($numnews > 0) {
					$number_to_show = 5;
					$c = 0;
					?>
					<h3><?php printf(gettext('Articles (%s)'), $numnews); ?> <small><?php	printZDSearchShowMoreLink("news", $number_to_show); ?></small></h3>
					<ul class="searchresults">
						<?php
						while (next_news()) {
							$c++;
							?>
							<li<?php printZDToggleClass('news',$c,$number_to_show); ?>>
							<h4><?php printNewsURL(); ?></h4>
							<p class="zenpageexcerpt"><?php echo shortenContent(strip_tags(getNewsContent()),80,getOption("zenpage_textshorten_indicator")); ?></p>
						</li>
						<?php
					}
					?>
				</ul>
				<?php
			}
		}
		?>
		<h3>
			<?php
			if (getOption('search_no_albums') && !getOption('search_no_images') && $numimages) {
				echo gettext('Images') . ' (' . $numimages . ')';
			} else if (getOption('search_no_images') && $numalbums) {
				echo gettext('Albums') . ' (' . $numalbums . ')';
			} else if ($numalbums && $numimages) {
				echo gettext('Albums') . ' (' . $numalbums . ') & ' . gettext('Images') . ' (' . $numimages . ')';
			} else if ($numalbums) {
				echo gettext('Albums') . ' (' . $numalbums . ')';
			} else if ($numimages) {
				echo gettext('Images') . ' (' . $numimages . ')';
			}
			?>
		</h3>
		<?php	printPageListWithNav("", "", false, true, 'pagelist', null, true, 5);
		$_firstPageImages = NULL;
		?>
	</article>
	<?php if ($numalbums) {
		$ii = 0;
		$first_album = getThemeOption('albums_per_page');
		while (next_album()): ?>
		<?php if ($ii == 0) {
			$ii = 1;
			if ($numimages || $numalbums > $alb_per_page) {
				$from = (($curr_pag - 1) * $first_album + 1);
				$to = min(($curr_pag * $first_album), $numalbums);
				if ($from === $to) {
					$to = "";
				} else {
					$from .= ' - ';
				}
				?>
				<h2><?php echo ngettext_th('album', 'albums', $numalbums) . ' ' . $from . $to; ?></h2>	
				<?php  
			}
		} ?>
		<div class="album thumb">
			<a href="<?php echo html_encode(getAlbumURL()); ?>" title="<?php echo gettext('View album:'); ?> <?php printAnnotatedAlbumTitle(); ?>"><?php printCustomAlbumThumbImage(getBareAlbumTitle(), NULL, 300, 200, 300, 200); ?></a>
			<h3><a href="<?php echo html_encode(getAlbumURL()); ?>" title="<?php echo gettext('View album:'); ?> <?php printAnnotatedAlbumTitle(); ?>"><?php printAlbumTitle(); ?></a></h3>
			<span><?php printAlbumDate(""); ?></span>
			<p><?php echo truncate_string(getBareAlbumDesc(), 120); ?></p>
		</div>
	<?php endwhile; ?>
<?php } ?>
<?php if ($numimages) { ?>
	<?php
	// Spare some questions to database getting size options before the loop
	$image_x = getThemeOption('image_size_x');
	$image_y = getThemeOption('image_size_y');
	$thumb_x = getThemeOption('thumb_size_x');
	$thumb_y = 6 * $thumb_x; // dummy multiplier for height to get all thumbs of the same width
	$ii = 0;
	while (next_image(false, $img_per_page)): ?>
	<?php if ($ii == 0) {
		$ii = 1;
		if ($numalbums || $numimages > $img_per_page) {
			$from = ($curr_pag - intval($numalbums/$alb_per_page) - 1) * $img_per_page + 1;
			$to = min((($curr_pag - intval($numalbums/$alb_per_page)) * $img_per_page), $numimages);
			if ($from === $to) {
				$to = "";
			} else {
				$from .= ' - ';
			}
			?>
			<h2><?php echo ngettext_th('image', 'images', $numimages) . ' ' . $from . $to; ?></h2>	
			<?php  
		}
	} ?>
	<div class="thumb">
		<a class="image" href='<?php echo getCustomSizedImageMaxSpace($image_x, $image_y); ?>' title="<?php printBareImageTitle(); ?>">
			<?php printCustomSizedImageThumbMaxSpace(getBareImageTitle(), $thumb_x, $thumb_y); ?>
		</a>
		<h2><?php printBareImageTitle(); ?></h2>
		<?php printImageDesc(); ?>
	</div>
<?php endwhile; ?>
<?php } ?>
</div>
</div>
<?php include("footer.php"); ?>
<?php zp_apply_filter('theme_body_close'); ?>
</body>
</html>
