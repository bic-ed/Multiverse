# Changelog
## [Unreleased]

### Added
* Fallback message for unsupported audio and video formats (image page)
* Russian translation ([kuzzzma](https://github.com/kuz-z-zma))
* Refresh the reCaptcha iframe on the contact form upon reset
* Updated Contact and Comment forms to handle the new ZP options *autocomplete* (ZP 1.6.3) and *quizzes* (ZP 1.6.5)
* Contact form feedback message is scrolled into view upon displaying
* Timestamp as a parameter for css and js resources, so that browsers always load the correct version of the files, regardless of caching strategies

### Changed
* The input fields for image size in the options have been made a little larger ([fretzl])
* Updated Raleway fonts to v34

### Fixed
* Sidecar image for audio files was being used directly instead of being resized and cached, due to a typo
* Improvements to Poptrox to prevent the admin toolbox and theme switcher checkbox from shifting slightly when the popup opens

## [v2.2] - 2023-01-05

### Added
* Multimedia support for album, search and image pages
* Support for the `paged_thumbs_nav` extension
* Implemented a custom mod version of _jquery.poptrox_ to support audio and video files
* Open zoom from poptrox-popup on pinch 
* Animated scrolling of the page, when the image in the popup changes, until the thumbnail of the new image reaches the center of the screen
* Support for the max/min number of thumbs in transition page, new option in ZP v1.6
* Support for Zenphoto changes in `protect_full_image` option values
* Zenphoto v1.6 support. Multiverse will not work correctly with previous versions of Zenphoto from now on

### Changed
* Updated Raleway fonts to v28
* Renamed all custom options. Visit the theme’s option page after updgrading to import any existing option values with earlier names
* Simplified internal handling and saving of "social_content" option
* Option "social_content" is now encoded with `encodeURIComponent` to avoid messing up things if a comma is eventually present in any field value
* Set color-scheme to dark to get dark scrollbars in browsers

### Fixed
* HTLM markup validation when using reCAPTCHA
* Set proper image caching sizes also if Multiverse is not the current theme of the Gallery
* Removed the _required_ attribute from user field in login form
* Correct number of total pages in category loop title
* Translation for theme options page when Multiverse is not the current theme of the Gallery

## [v2.1] - 2021-02-11

### Added
* Support for the plugin `theme_switcher`

### Changed
* German translation update ([acrylian])
* Dutch translation update ([fretzl])

## [v2.0] - 2021-02-11
### Added
* Standard single image page `image.php` with:
  - Comment support
  - Open Street Map plugin support
  - Optional full image link
  - Image metadata & tags
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
* Fixed an issue with the index for preloading popup images in search.php page
* Missing translation for `All news` link in News menu
* Typo preventing line breaks in comments
* Sliding navigation extended to browsers not supporting `Math.sign`
* Info button was slightly exceeding header height on small screens
* Placed the h2 titles for images and albums sections as first children of the `#main` flex container in search results page, where they were supposed to be to break flex rows
* Background color for active buttons updated to the proper new color palette from the original Multiverse old one

### Removed
* Image description from album page, since it is in image page now

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

[Unreleased]: https://github.com/bic-ed/Multiverse/compare/2.2...master
[v2.2]: https://github.com/bic-ed/Multiverse/compare/2.1...2.2
[v2.1]: https://github.com/bic-ed/Multiverse/compare/2.0...2.1
[v2.0]: https://github.com/bic-ed/Multiverse/compare/1.2...2.0
[v1.2]: https://github.com/bic-ed/Multiverse/compare/1.1...1.2
[v1.1]: https://github.com/bic-ed/Multiverse/compare/1.0...1.1

[acrylian]: https://github.com/acrylian
[fretzl]: https://github.com/fretzl
