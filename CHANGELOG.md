# Changelog
## [Unreleased]
### Added
* Custom forms for comments and contact, to get rid of duplicate IDs in pages where comments are enabled (i.e. where both form are present)
  * During data entry, required fields are marked in red if not filled in properly
* A light shadow on info panel when active, to better separate it from the main content background
* RSS feed links in footer for Gallery, Album and News

### Changed
* Hidden labels in forms and hidden texts for links (social) are now compliant with accessibility requirements (dropped CSS "display: none")
* No more showing News menu when there are no published news article 
* Subcategories, if any, are now shown in News menu when the parent category is the current page
* Show the `cookieconsent` banner above the header
* Updated Raleway fonts to v18 and filled `src: local()` in @font-face
* Restyling of search bar and search options menu
  * Added a coloured frame on focus to search input field, like the one already present in every other input field
  * Harmonized search options menu (`searchexstrashow`) appearance and animation with all other menus
  * Styled _Tag suggest_ plugin elements
  * Preventing autofill of search input field on focus, allowing it only after the first interaction (unless the above plugin is active)

### Fixed
* Missing translation for `All news` link in News menu
* Typo preventing line breaks in comments
* Sliding navigation extended to browsers not supporting `Math.sign`
* Info button was slightly exceeding header height on small screens
* Placed the h2 titles for images and albums sections as first children of the `#main` flex container in search results page, where they were supposed to be to break flex rows
* Background color for active buttons updated to the proper new color palette from the original Multiverse old one

## [v1.2] - 2020-12-07
### Changed
* Redesigned sliding navigation for poptrox pupup
  * Optimized code for a smoother slide of the popup during drag/swipe
  * Reorganized JavaScript variables to be more readable
  * Replaced cursor with _grab_ on hover popup and _grabbing_ on drag
* New animated arrows for menus in footer
* Revisited fade-in sequence on page load for `div#main` children

### Fixed
* Improved detection of a tag search
* reCAPTCHA widget proper positioning
* Uppercase _News_ in `gettext("News archive")` from `news.php` to match existing string in `zenphoto.po` catalogs
* Images range in search results pages was wrong under some circumstances
* Image loop in `search.php` updated to reflect pre-first-release changes made to the same loop in `album.php`
* Social options fixed to work also if Multiverse isn’t the current theme of Zenphoto
* Starting slideshow by pressing <kbd>spacebar</kbd>
* Replaced `ISO_CODE` constant forgotten in `footer.php`

## [v1.1] - 2020-08-01
### Added
* German translation from [acrylian]
* Dutch translation from [fretzl]

### Changed
* Replaced Google-hosted fonts with self-hosted fonts
* Replaced `ISO_CODE` theme constant with the new ZP function `printLangAttribute()` ([acrylian])

### Fixed
* Image page redirection ([acrylian])
* Proper RSS header link in `gallery.php` ([fretzl])
* Removed from theme options unnecessary request for `functions.php` ([fretzl])

<!-- [v2.0]: https://github.com/bic-ed/Multiverse/compare/1.2...2.0 -->
[Unreleased]: https://github.com/bic-ed/Multiverse/compare/1.2...master
[v1.2]: https://github.com/bic-ed/Multiverse/compare/1.1...1.2
[v1.1]: https://github.com/bic-ed/Multiverse/compare/1.0...1.1

[acrylian]: https://github.com/acrylian
[fretzl]: https://github.com/fretzl
