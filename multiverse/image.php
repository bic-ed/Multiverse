<?php
// force UTF-8 Ø
if (!defined('WEBPATH'))
	die();

if (getOption('pagination')) {
	$page = getAlbumPage();
} else {
	$page = 1;
}

$title = html_encode($_zp_current_image->getTitle());
$redir = $_zp_current_album->getLink($page);
if (MOD_REWRITE) {
	$redir .= '?title=' . $title;
} else {
	$redir .= '&title=' . $title;
}
redirectURL($redir, '301');
