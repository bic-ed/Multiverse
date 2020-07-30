<?php
// force UTF-8 Ø
if (!defined('WEBPATH')) 	die();

if (getOption('pagination')) {
	$page = getAlbumPage();
} else {
	$page = 1;
}

$title = html_encode($_zp_current_image->getTitle());
$redir = $_zp_current_album->getLink($page);

$redir = rewrite_path($redir . '?title=' . $title, $redir . '&title=' . $title);
header('Location:' . $redir);
?>
