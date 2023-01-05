/*
 * Multiverse by HTML5 UP
 * html5up.net | @ajlkn
 * Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
 *
 * New features and optimization for Zenphoto
 * @bic-ed | www.antonioranesi.it | GPL-2.0 License
 * 
 * • Fullscreen
 * • Slide show
 * • Touch swipe on the popup for navigation to previous & next image
 * • Preload of two images (prev & next) for the popup
 * • Zoom on double tap (or double click) and pan image
 * • Zoom on pinch (since v2.2)
 * • Zenphoto DOM manipulation
 * • Zenphoto ajax contact form
 * • Zenphoto multimedia support [audio, video and TextObject]
 *   using a custom modded version of jquery.poptrox.js (since v2.2)
 * @version 2.2
 */

(function($) {

  var objWindow = window,
    $window = $(objWindow),
    $body = $('body'),
    received = phpToJS;

  // Breakpoints.
  breakpoints({
    xlarge:  [ '1281px',  '1680px' ],
    large:   [ '981px',   '1280px' ],
    medium:  [ '737px',   '980px'  ],
    small:   [ '481px',   '736px'  ],
    xsmall:  [ null,      '480px'  ]
  });

  // Hack: Enable IE workarounds.
  if (browser.name == 'ie')
    $body.addClass('ie');

  // Define Math.sign if not supported
  if (!Math.sign) {
    Math.sign = function(x) {
      return ((x > 0) - (x < 0)) || + x;
    }
  }

  // Touch?
  if (browser.mobile)
    $body.addClass('touch');

  // On load remove "loading" class.

  $window.on('load', function() {
    setTimeout(function() {
      $body.removeClass('loading');
    }, 100);

    windowSize = {
      w: objWindow.outerWidth,
      h: objWindow.innerHeight
    };    

  });

  // Prevent transitions/animations on resize.
  var resizeTimeout;

  $window.on('resize orientationchange', function() {

    clearTimeout(resizeTimeout);

    $body.addClass('resizing');

    windowSize = {
      w: objWindow.outerWidth,
      h: objWindow.innerHeight
    };

    resizeTimeout = setTimeout(function() {
      $body.removeClass('resizing');
    }, 100);

  });

  // Fix: Placeholder polyfill.
  $('form').placeholder();

  // Panels.
  var $header = $('#header');
  var $panels = $('.panel');

  var $toggle = $header.children('nav').has('a'),
    $closer = $('<span class="closer" />').appendTo($panels);

  // Closer.
  $closer
    .on('click', function(event) {
      $panels.trigger('---hide');
    });

  // Events.
  $panels
    .on('click', function(event) {
      event.stopPropagation();
    })
    .on('---toggle', function() {

      if ($panels.hasClass('active'))
        $panels.triggerHandler('---hide');
      else
        $panels.triggerHandler('---show');

    })
    .on('---show', function() {

      // Hide other content.
      if ($body.hasClass('content-active'))
        $panels.trigger('---hide');

      // Activate content & toggle.
      $panels.addClass('active');
      $toggle.addClass('active');

      // Activate body.
      $body.addClass('content-active');

    })
    .on('---hide', function() {

      // Deactivate content & toggle.
      $panels.removeClass('active');
      $toggle.removeClass('active');

      // Deactivate body.
      $body.removeClass('content-active');

    });

  // Toggle.
  $toggle
    .removeAttr('href')
    .css('cursor', 'pointer')
    .on('click', function(event) {

      event.preventDefault();
      event.stopPropagation();

      $panels.trigger('---toggle');

    });


  // Global events.
  var $fullscreen = $('#fullscreen');
  $body
    .on('click', function(event) {

      // disable closing panels for Zenphoto admin and fullscreen buttons
      if ($body.hasClass('content-active') && !$(event.target).is(
        $('#zp__admin_link, #zp__admin_data a')
          .add($fullscreen)
          .add($fullscreen.children()))
      ) {

        event.preventDefault();
        event.stopPropagation();

        $panels.trigger('---hide');

      }

    });


  // Header.

  // Links.
  $header.find('a').each(function() {

    var $this = $(this),
      href = $this.attr('href');

    // Internal link? Skip.
    if (!href || href.charAt(0) == '#')
      return;

    // Redirect on click.
    $this
      .removeAttr('href')
      .css('cursor', 'pointer')
      .on('click', function(event) {

        event.preventDefault();
        event.stopPropagation();

        objWindow.location.href = href;

      });

  });

  // Footer.

  /*
  Move menus, social & copyright when the "medium" breakpoint activates
  */

  var $social = $('.social');
  var $innerSplit = $('.inner.split');
  var $menuGroup = $('.menu_group');
  var $copyright = $('.copyright');
  var $pagedThumbsNav = $('#pagedthumbsnav');
  // var $social_placeolder = $social.prev();
  breakpoints.on('<=medium', function() {
    $menuGroup.insertAfter($innerSplit.children().first());
    $social.appendTo($innerSplit.children().last());
    $copyright.appendTo($innerSplit.children().last());
    $pagedThumbsNav.insertAfter('#image');
  });
  breakpoints.on('>medium', function() {
    $menuGroup.appendTo($innerSplit);
    $social.insertAfter($social.prev());
    $copyright.appendTo($innerSplit.children().first());
    $pagedThumbsNav.insertAfter($container);
  });

  // Main.
  var $main = $('#main');

  // QUESTION: [IE support] Drop support for Internet Explorer? Then we can remove
  // the below each loop.
  // Apply the corresponding question changes in style.css

  // Thumbs.
  $main.children('.thumb').each(function() {

    var $image = $(this).find('.image'),
      $image_img = $image.children('img');

    // No image? Bail.
    if ($image.length == 0)
      return;

    // Image.
    // This sets the background of the "image" <span> to the image pointed to by its child
    // <img> (which is then hidden). Gives us way more flexibility.

    // Set background.
    $image.css('background-image', 'url(' + $image_img.attr('src') + ')');

    // Hide original img.
    $image_img.hide();

  });


  /*
  Inizialize currentIndex and retrieve array of fullsize images links
  */

  var currentIndex = 0,
    selector = '.thumb>a.image:not([data-poptrox="ignore"])',
    $selectors = $(selector),
    imgLinks = [],
    isImage = [];

  $selectors.each(function(i) {
    var $this = $(this);
    imgLinks.push($this.attr('href'));
    isImage.push(typeof $this.data('poptrox') == 'undefined');
    $this.data('index', i);
  });


 
  /**
   * Used to avoid currentIndex messup on keyboard navigation and more
   * @type {boolean} 
  */
  var locked = true;

  // Set some options for poptrox-popup as variables to also use and change them later
  // NOTE: these could become theme options
  var fadeSpeed = 200,
    popupSpeed = 200;

  /**
   * jquery.poptrox settings.  
   * 
   * Multiverse for Zenphoto uses a custom modded version of jquery.poptrox v2.5.2-dev.
   * @see {@link https://github.com/ajlkn/jquery.poptrox jquery.poptrox}
   */
  var poptroxSettings = {
    baseZIndex: 20000,
    caption: function($a) { return $a.next().clone() },
    onPopupClose: resetPopup,
    onPopupOpen: initializePopup,
    selector: selector,
    fadeSpeed: fadeSpeed,
    popupSpeed: popupSpeed,
    usePopupLoader: true,
    popupLoaderText: '',
    popupWidth: 80,
    popupHeight: 80,
    popupCloserText: '',
    overlayOpacity: 0,
    usePopupCaption: true,
    usePopupDefaultStyling: false,
    usePopupEasyClose: false,
    usePopupForceClose: true,
    useBodyOverflow: true,
    windowMargin: 34
  };

  // TODO: Load the popup only where needed (album and search pages)
  $main.poptrox(poptroxSettings);
  // IDEA: Could also be used on the image page to show the full image, with different settings

  // Poptrox settings are stored in the "_poptrox" attribute, we can change them later where needed
  poptroxSettings = $main[0]._poptrox;

  // Define $imgs and $play to use them in different functions
  var $imgs = $(".poptrox-popup");

  var $play = $();

  /**
   * Setup poptrox-popup for Multiverse
   * 
   * - Body class "modal-active"
   * - Add navigation buttons
   * - Add navigation events
   *    - On Swipe
   *    - On Click
   * - Move the fullscreen icon on the popup
   */
  function initializePopup() {

    $body.addClass('modal-active');

    // Move fullscreen icon on the image when popup has been opened
    setTimeout(function() {
      $fullscreen.appendTo($imgs);
    }, fadeSpeed + popupSpeed);

    // Setup navigation (first opening only)
    if (!$play[0]) {

      // Add navigation buttons
      $imgs.append(
        '<span class="nav-prev">',
        '<span class="nav-next">',
        '<span id="play">'
      );

      $play = $('#play');

      // On swipe navigation
      $imgs.swipe(popupSwipeSettings)
  
        // Standard on click navigation
        .children(
          $('.nav-next').on('click', function() { changeImage(1) }),
          $('.nav-prev').on('click', function() { changeImage(-1) }),
          $('.closer').add($('.poptrox-overlay')).on('click', closePopup),
          $play.on('click', slideShow)
        );

      }

  }

  /**
   * Resets all when popup has been closed. 
   * 
   * - Body, remove class "modal-active"
   * - Slideshow
   * - Bring back the fullscreen icon on header
   * - Swipe status
   */
  function resetPopup() {

    $body.removeClass('modal-active');

    slideShowRunning = clearInterval(slideShowRunning);
    $play.removeClass("playing");
    
    $fullscreen.insertAfter($header.children('h1'));

    resetSwipe(0);
    $imgs.swipe("disable");
    $imgs.swipe("enable");

  }

  /**
   * Closes the pupup if the transitions are complete
   */
  function closePopup() {

    if (locked) return;

    $imgs.trigger('poptrox_close');

  }

  /*
  Keyboard navigation adapted for slideshow and changeImage function.
  */
  // NOTE: the below could become a theme option
  // Assinging parameters "slide" and "duration" to changeImage can be used to slide images instead of fade and warp them.
  $window.on('keyup', function(e) {

    if ($imgs.is(':visible') && !$zoom[0]) {

      switch (e.key) {

        case 'ArrowLeft':
          if (locked) return false;

          changeImage(-1);

          break;

        case 'ArrowRight':
          if (locked) return false;

          changeImage(1);

          break;

        case ' ':

          slideShow();

          break;

        case 'Escape':

          closePopup();

          break;

      }

    } else if (e.key == 'Escape' && $body.hasClass('content-active')) {

      e.preventDefault();
      e.stopPropagation();

      $panels.trigger('---hide');

    }

  });


  /*
  Slide show
  */

  /** The slideshow interval.  
   *  When "undefined", the slideshow is not running
   *  @type {number|undefined} */
  var slideShowRunning;

  /**
   * Toggles slide show status
   * 
   * Use "slide" and "duration" parameters on {@link changeImage} for sliding animation,
   * leave those blank for native poptrox animations.
   */
  function slideShow() {

    $play.addClass("start");

    setTimeout(function() {

      $play.removeClass("start")
        .toggleClass("playing");

      if (!slideShowRunning) {
        if (locked) return false;

        changeImage(1);
        slideShowRunning = setInterval(changeImage, 5000, 1);

        // NOTE: this could become a theme options, such as the interval duration.
        // ## For Sliding, comment the above and uncomment the below ##

        // changeImage(1, true, 300);
        // slideShowRunning = setInterval(changeImage, 5000, 1, true, 300);

      } else {

        slideShowRunning = clearInterval(slideShowRunning);

      }

    }, 350)
  };


  /** Total number of items that can be loaded into the popup
   * @type {number} */
  var totalItems = $selectors.length - 1;

  /*
  Get the index of the item loaded into the popup, prevent closing popup before animations end
  and preload adjacent images
   */
  $selectors.on('click', function() {
    locked = true;
    currentIndex = $(this).data('index');
    preload();
  });

  /**
   * Sequentially preloads the next and previous image
   */
  function preload() {

    var tmp = [new Image, new Image, new Image];

    var nextIndex = getLoopIndex(1);

    if (isImage[currentIndex] && isImage[nextIndex]) {

      tmp[0].src = imgLinks[currentIndex];

      // load next image after current
      $(tmp[0]).on('load', function() {

        tmp[1].src = imgLinks[nextIndex];

      });

      var prevIndex = getLoopIndex(-1);

      if (isImage[prevIndex]) {

        $(tmp[1]).on('load', function() {

          // load prev image after next
          tmp[2].src = imgLinks[prevIndex];

        });

      }

    }

    // Unlock after the transition is completed
    setTimeout(() => { locked = false; }, 10 + fadeSpeed + popupSpeed);

  }

  /**
   * Returns next or previous index of the poptrox selectors array.
   * 
   * Loop on first | last element
   * @param {number} increment - Use 1 for next image | -1 for previous image.
   * @returns {number} The index of the new image to be loaded in the popup.
   * @since 2.2
   */
  function getLoopIndex(increment) {
    if ((currentIndex > 0 && increment == -1) || (currentIndex < totalItems && increment == 1)) {
      return currentIndex + increment;
    } else {
      return totalItems * (1 - increment) / 2;
    }
  }

  // Set windowMargin to 0 when 'small' activates.
  breakpoints.on('>small', function() {
    poptroxSettings.windowMargin = 34;
  });
  breakpoints.on('<=small', function() {
    poptroxSettings.windowMargin = 0;
  });

  /*
  Fullscreen
  */
  $fullscreen.on('click', function(e) {
    var doc = objWindow.document;
    var docEl = doc.documentElement;
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    } else {
      cancelFullScreen.call(doc);
    }
  });

  /*##################################################
  #                                                  #
  #       Touch gestures on Popup, Zoom, Image       #
  #                                                  #
  ###################################################*/

  /*
   1) Popup
  */

  /** Window inner size width, height (px).
   *  @type {{ w: number, h: number }} */
  var windowSize;

  /** Coordinates of the drag event starting point (px).
   *  @type {{ x: number, y: number }} */
  var dragStartPoint;

  /** Distances of the pointer (finger) from the drag start point (px).
   *  @type {{ x: number, y: number }} */
  var delta;

  /** Module of the distance traveled during drag (px).
   * @type {number} */
  var dragDistance;

  /** Distance to be covered to complete the sliding animation (px). 
   * @type {number} */
  var endDistance;
  
  // NOTE: this could become a theme option
  /** Speed of the sliding popup animation (ms).
   * @type {number} */
  var slideSpeed = 300;

  /**
   * jQuery TouchSwipe settings for touch gestures on the popup.  
   * 
   * Setup the following actions:
   * - Drag popup on swipe
   * - Close popup on long tap
   * - Open zoom on double tap
   * - Open zoom on pinch in
   * @type {Object.<string, any>}
   * @see {@link https://github.com/mattbryson/TouchSwipe-Jquery-Plugin TouchSwipe}
   */
  var popupSwipeSettings = {
    swipeStatus: popupSwipeHandler,
    threshold: 5, // "cancel" event delegated to "end"
    // Open zoom on double tap...
    doubleTap: openZoom,
    doubleTapThreshold: 300,
    // ...or pinch in
    pinchStatus: zoomOnPinch,
    // Close popup on hold (longTap)
    hold: closePopup,
    longTapThreshold: 600,
    // Dummy tap
    tap: function() {}
  };

  /**
   * Drags the popup following finger or pointer.
   * 
   * Dragging is handled using the {@link slidePopup} function with proper parameters.  
   * At the end of the drag, if it reaches a specific distance, the {@link changeImage}
   * function is called. Otherwise the popup is returned to its initial position
   * with a sliding animation.
   * 
   * Starting point coordinates are used when opening the zoom as well.
   * 
   * @param {object} event - Original event object
   * @param {string} phase - Swipe phase: start | move | end
   * @param {string} [_direction] - unused
   * @param {number} [_distance] - unused
   * @param {number} [_duration] - unused
   * @param {number} fingerCount - Number of fingers used
   * 
   */
  function popupSwipeHandler(event, phase, _direction, _distance, _duration, fingerCount) {
    if ($imgs.hasClass("loading") || $(event.target).is('.not-image span')) {
      return false;
    }

    var evt, isTouch = event.touches;

    isTouch ? evt = isTouch[0] : evt = event;

    endDistance = (windowSize.w + $imgs.width()) / 2;


    if (phase == "start") {

      // Prevent context menu (just once) as we use long tap to close the popup
      if (isTouch) $window.one('contextmenu', function(e) { e.preventDefault() });

      // store the coordinates at which drag started (or zoom opened)
      dragStartPoint = {
        x: evt.clientX,
        y: evt.clientY
      }

    }

    if (!isTouch || fingerCount == 1) { // it's a correct sliding attempt, allow move

      if (phase == "move") {

        delta = { x: evt.clientX - dragStartPoint.x };
        dragDistance = Math.abs(delta.x);

        if (dragDistance > 10) { // drag
          $imgs.addClass('swipe');
          slidePopup(delta.x - Math.sign(delta.x) * 11, 0);
        }

      } else if (phase == "end") {

        if (dragDistance > 95) { // change image and reset

          var speed = slideSpeed * (1 - dragDistance / endDistance);
          changeImage(-Math.sign(delta.x), true, speed);

        } else { // re-center image and reset
          slidePopup(0, slideSpeed / 3, true);
        }

      }

    } else if (phase == 'end' || phase == "cancel") { // more than one finger dragging, reset

      slidePopup(0, slideSpeed / 3, true);

    }

  }

  /**
   * Updates the position of the popup on drag or drag end.
   * 
   * On drag end, animates the popup by sliding it to the required position
   * within the required time.
   * 
   * Upon request, resets the popup to its initial state, after the end of the animation,
   * using {@link resetSwipe}.
   * 
   * @param {number}  position - Popup position (pixels).
   * @param {number}  duration - Slide duration (ms).
   * @param {boolean} [reset] - Pass true to reset.
   */
  function slidePopup(position, duration, reset) {

    $imgs.css({
      transform: "translateX(" + position + "px)",
      transitionDuration: (duration / 1000).toFixed(1) + "s"
    });

    if (reset)
      resetSwipe(duration);

  }

  /**
   * Handles the new image to be loaded into the popup.
   * 
   * Takes care of preload, popup's transitions and page scroll using
   * {@link slidePopup} and {@link preload}.
   * 
   * @param {number}  increment - +1 or -1 to load next or prev image in the popup
   * @param {boolean} [slide] - When true, performs a sliding animation
   * @param {number}  [duration] - Time to complete the sliding animation (ms)
   */
  function changeImage(increment, slide, duration) {

    locked = true;

    var newIndex = getLoopIndex(increment),
      $thumb = $($selectors[newIndex]);

    if (slide) {

      if (isImage[newIndex])
        poptroxSettings.popupSpeed = poptroxSettings.fadeSpeed = 0;

      $imgs.css('transition-timing-function', 'ease-in');

      if (!endDistance)
        endDistance = (windowSize.w + $imgs.width()) / 2;

      // Slide out the popup with the old image
      slidePopup(-increment * endDistance, duration);
      scrollToThumb(duration + slideSpeed);

      setTimeout(function() {

        // Hide the popup and change the image
        $imgs.css({
          transitionDuration: '0s',
          visibility: 'hidden'
        });

        loadNewImage();

        setTimeout(function() {

          // Place the popup on the opposite side of the screen
          endDistance = (windowSize.w + $imgs.width()) / 2;
          slidePopup(increment * endDistance, 0);

          setTimeout(function() {

            // Finally slide in the popup with the new image
            $imgs.css({
              visibility: 'visible',
              transitionTimingFunction: 'ease-out'
            });
            slidePopup(0, slideSpeed, true);

          }, 20);

        }, 30);

      }, duration);

    } else {
      loadNewImage();
      scrollToThumb(poptroxSettings.fadeSpeed + poptroxSettings.popupSpeed);
    }

    /**
     * Loads the new image and starts preloading adjacent ones.
     * @since 2.2
     */
    function loadNewImage() {

      increment < 0 ? $imgs.trigger('poptrox_previous') : $imgs.trigger('poptrox_next');

      currentIndex = newIndex;
      preload();

    }

    /**
     * Scrolls the page in sync with the new loaded image.
     * 
     * The scroll animation starts and ends at the same time as the popup animation(s).
     * @param {number} duration - Duration of the scroll animation
     * @since 2.2
     */
    function scrollToThumb(duration) {

      $('html').animate({
        scrollTop: $thumb.offset().top + ($thumb.height() - windowSize.h) / 2
      }, duration);

    }

  }

  /**
   * Resets the popup to its initial state after moved it by dragging.
   * 
   * @param {number} delay - The delay before resetting the popup (ms)
   * 
   */
  function resetSwipe(delay) {

    setTimeout(function() {

      $imgs
        .css({
          visibility: "",
          transitionDuration: "",
          transitionTimingFunction: "",
          transform: "",
          opacity: ""
        })
        .removeClass("swipe");

      poptroxSettings.fadeSpeed = fadeSpeed;
      poptroxSettings.popupSpeed = popupSpeed;

    }, 20 + delay);

  }

  /*
   2) Zoom
  */

  /** Rendered size of the image in the popup (px).
   *  @type {{ w: number, h: number }} */
  var imgRenderSize;

  /** Natural size of the image in the popup (px).
   *  @type {{ w: number, h: number }} */
  var imgNaturalSize;

  /** Initial position of the zoom image (px).
   *  @type {{ t: number, l: number }} */
  var openZoomPosition;

  /** Position of the zoom image after the last drag end (px).
   *  @type {{ t: number, l: number }} */
  var lastZoomPosition;

  /** The container for the zoomed image. */
  var $zoom = $();

  /** The zoomed image. */
  var $zoomedImg = $();

  // NOTE: this could become a theme option
  /** Speed of the opening and closing zoom animation (ms). */
  var zoomSpeed = 300;


  /**
   * jQuery TouchSwipe settings for touch gestures on the zoom.  
   * 
   * Setup the following actions:
   * - Drag zoomed image on swipe
   * - Close zoom on double tap
   * - Close zoom on pinch out
   * @type {Object.<string, any>}
   * @see {@link https://github.com/mattbryson/TouchSwipe-Jquery-Plugin TouchSwipe}
   */
  var zoomSwipeSettings = {
    swipeStatus: zoomSwipeHandler,
    allowPageScroll: false,
    // Close zoom on double tap...
    doubleTap: closeZoom,
    doubleTapThreshold: 300,
    // ...or on pinch out
    pinchStatus: zoomOnPinch,
    // QUESTION: Close zoom on hold (longTap)? Then use the belows
    // hold: closeZoom,
    // longTapThreshold: 600,

    // Dummy tap
    tap: function() {}
  };

  /**
   * Drags the enlarged image
   * 
   * @param {object} event - Original event object
   * @param {string} phase - Swipe phase: start | move
   * 
   */
  function zoomSwipeHandler(event, phase) {

    var evt;
    event.touches ? evt = event.touches[0] : evt = event;

    if (phase == "start") { // start point
      lastZoomPosition = {
        l: $zoomedImg.position().left,
        t: $zoomedImg.position().top
      }
      dragStartPoint = {
        x: evt.clientX,
        y: evt.clientY
      }
    }

    if (phase == "move") { // drag

      var dragPosition = {
        t: lastZoomPosition.t + evt.clientY - dragStartPoint.y,
        l: lastZoomPosition.l + evt.clientX - dragStartPoint.x
      };

      var boundedPosition = zoomBounds(dragPosition);

      $zoomedImg.css({
        transitionDuration: "0s",
        top: boundedPosition.t,
        left: boundedPosition.l
      });

    }

  }

  /**
   * Opens or closes zoom with a pinch in or out.
   * 
   * Uses {@link openZoom} and {@link closeZoom}
   * 
   * @param {object} event - Original event object (placeholder)
   * @param {string} phase - Swipe phase: start | move | end | cancel
   * @param {string} direction - The direction pinched: in | out
   * @param {number} distance - The distance pinched
   * @since 2.2
   */
  function zoomOnPinch(event, phase, direction, distance) {

    if (phase == 'move' && distance > 30) {

      if (direction == "out") {

        closeZoom();
        return false;

      } else if (!$zoom[0]) {

        if ((!$imgs.hasClass("swipe")))
          openZoom();

        return false;

      }

    }

  }

  /**
   * Opens the Zoom and initializes touch gestures on it.
   * 
   * Setting for TouchSwipe: {@link zoomSwipeSettings}
   */
  function openZoom() {
    // IDEA: add a theme option to open real full size image via ajax instead

    var $poptroxImg = $(".pic>img");

    if ($poptroxImg.length) { // Images only

      // Avoid browser native zoom on pinch
      $body.css("touch-action", "pan-x pan-y");

      imgRenderSize = {
        w: $poptroxImg.width(),
        h: $poptroxImg.height()
      };

      imgNaturalSize = {
        w: $poptroxImg[0].naturalWidth,
        h: $poptroxImg[0].naturalHeight
      };

      // Abort if there is nothing to zoom
      if (imgRenderSize.w == imgNaturalSize.w && imgRenderSize.h == imgNaturalSize.h)
        return false;

      $body.prepend("<span id='zoom'><img src=''>");
      $zoom = $("#zoom");
      $zoomedImg = $zoom.children("img");
      openZoomPosition = {
        t: $poptroxImg.offset().top - $window.scrollTop(),
        l: $poptroxImg.offset().left
      };
      var startingRatio = {
        x: (dragStartPoint.x - openZoomPosition.l) / imgRenderSize.w,
        y: (dragStartPoint.y - openZoomPosition.t) / imgRenderSize.h
      };
      var dragPosition = {
        t: -imgNaturalSize.h * startingRatio.y + windowSize.h / 2,
        l: -imgNaturalSize.w * startingRatio.x + windowSize.w / 2
      };
      var boundedPosition = zoomBounds(dragPosition);

      $zoomedImg
        .prop("src", $poptroxImg.attr("src"))
        .css({
          position: "relative",
          top: openZoomPosition.t,
          left: openZoomPosition.l,
          width: imgRenderSize.w,
          height: imgRenderSize.h,
        });


      $main.css('filter', 'blur(28px)');

      $zoomedImg.animate({
        top: boundedPosition.t,
        left: boundedPosition.l,
        width: imgNaturalSize.w,
        height: imgNaturalSize.h,
      }, zoomSpeed, function() {

        $zoomedImg.swipe(zoomSwipeSettings)
          .css("cursor", "move");

      });

      $imgs.css({
        transform: "scaleY(.9)",
        transitionDuration: (zoomSpeed / 1000).toFixed(1) + "s"
      });

    }

  };

  /**
   * Closes the Zoom
   */
  function closeZoom() {

    $main.css('filter', '');
    $imgs.css("transform", "");

    $zoomedImg.animate({
      top: openZoomPosition.t,
      left: openZoomPosition.l,
      width: imgRenderSize.w,
      height: imgRenderSize.h,
    }, zoomSpeed, function() {

      $zoom.remove();
      $zoom = $();
      // Restore browser native zoom on pinch
      $body.css("touch-action", "");

    });

    setTimeout(function() {

    }, zoomSpeed);
  };

  /**
   * Restricts zoomed image dragging to its boundaries.
   * @param {object}  dragPosition - Position of the dragged image
   * @param {number}  dragPosition.t - Top position (pixels)
   * @param {number}  dragPosition.l - Left position (pixels)
   * @returns {object} Top and left values keeping image within limits.
   */
  function zoomBounds(dragPosition) {
    if (imgNaturalSize.h > windowSize.h) {
      dragPosition.t = Math.min(0, dragPosition.t);
      dragPosition.t = Math.max(dragPosition.t, windowSize.h - imgNaturalSize.h);
    } else {
      dragPosition.t = (windowSize.h - imgNaturalSize.h) / 2;
    }
    if (imgNaturalSize.w > windowSize.w) {
      dragPosition.l = Math.max(dragPosition.l, windowSize.w - imgNaturalSize.w);
      dragPosition.l = Math.min(0, dragPosition.l);
    } else {
      dragPosition.l = (windowSize.w - imgNaturalSize.w) / 2;
    }
    return dragPosition;
  }
  
  /*
   3) Image
  */

  /** Separate page scrolling from image dragging.
   * 
   * On touchstart, dragging is not allowed if a vertical scrolling
   * has begun and vice versa.
   *  @type {boolean} */
  var slideAllowed;

  /** The parent container of the image div. */
  var $container = $('#container');

  /**
 * jQuery TouchSwipe settings for touch gestures on the image.  
 * @type {Object.<string, any>}
 * @see {@link https://github.com/mattbryson/TouchSwipe-Jquery-Plugin TouchSwipe}
 */
  var imageSwipeSettings = {
    swipeStatus: imageSwipeHandler,
    preventDefaultEvents: false,
    threshold: 5, // "cancel" event delegated to "end"
    excludedElements: $('.is-media>a')
  };

  $container.swipe(imageSwipeSettings);

  // Don't allow dragging of the contents as that interfere with the swipe handler
  $container.find('*')
    .on('dragstart', function() {
      return false;
    });

  /**
  * Drags the image following finger or pointer.
  * 
  * At the end of the drag, if it reaches a specific distance, the {@link changePage}
  * function is called, redirecting to the prev or next page.
  * Otherwise the popup is returned to its initial position
  * with a sliding animation.
  *
  * @param {object} event - Original event object
  * @param {string} phase - Swipe phase: start | move | end
  * @param {string} [_direction] - unused
  * @param {number} [_distance] - unused
  * @param {number} [_duration] - unused
  * @param {number} fingerCount - Number of fingers used
  * 
  */
  function imageSwipeHandler(event, phase, _direction, _distance, _duration, fingerCount) {

    var nextLink = $container.find('.nav-next').attr('href'),
      prevLink = $container.find('.nav-prev').attr('href'),
      evt,
      isTouch = event.touches;

    isTouch ? evt = isTouch[0] : evt = event;

    if (phase == "start") {

      slideAllowed = false;

      // store the coordinates at which drag started
      dragStartPoint = {
        x: evt.clientX,
        y: evt.clientY
      }

    }

    /** True if the dragging did not start from the edge of the page. */
    var notEdgeStart = dragStartPoint.x > 20 && (windowSize.w - dragStartPoint.x) > 20;

    if (!isTouch || fingerCount == 1) { // it's a correct sliding attempt, allow move

      if (phase == "move") {

        document.getSelection().removeAllRanges();

        delta = {
          x: evt.clientX - dragStartPoint.x,
          y: evt.clientY - dragStartPoint.y
        }

        if (!isTouch || Math.abs(delta.x) > Math.abs(delta.y)) {
          slideAllowed = true;
        }

        if (slideAllowed && event.cancelable && notEdgeStart) {
          event.preventDefault();

          if (delta.x > 5 && prevLink || delta.x < -5 && nextLink) { // drag
            $('#imagemetadata_data').hide();
            $page.addClass('swipe');

            $container.css({
              transitionDuration: '0s',
              transform: 'translateX(' + (delta.x - Math.sign(delta.x) * 6) + 'px)'
            });
          }
        }

      } else if (phase == "end") {

        if (Math.abs(delta.x) > 95 && event.cancelable) { // redirect

          if (delta.x > 0 && prevLink) {
            changePage(1, prevLink);
          } else if (delta.x < 0 && nextLink) {
            changePage(-1, nextLink);
          }

        } else { // re-center image and reset
          reset()
        }

      }

    } else if (phase == 'end' || phase == "cancel") { // more than one finger dragging, reset
      reset();
    }
    
    function reset() {

      $container.css({
        transitionDuration: '.15s',
        transform: 'translateX(0)'
      });
  
      setTimeout(function() {
        $page.removeClass('swipe');
      }, 150);
      
    }
  }

  /**
  * Slides image out and redirects to next or previous page
  *
  * @param  {number} direction - Direction for image slide out [+1|-1]
  * @param  {string} location  - URL of next or previous image page
  * 
  */
  function changePage(direction, location) {

    var boxShadow = $container.css('box-shadow').match(/(-?\S+px)|(rgb\(.+\))/g);

    var slideOut = ($page.outerWidth() + $container.outerWidth()) / 2
      + parseInt(boxShadow[4]) // box shadow spread
      + 1; // for eventual decimal pixels

    slideOut = slideOut * direction;

    $container.css({
      transitionDuration: '.3s',
      transform: 'translateX(' + slideOut + 'px)'
    });

    setTimeout(function() {
      $body.addClass('loading');
      objWindow.location.href = location;
    }, 300);

  }

  
  /*#############################################
  #                                             #
  #               Zenphoto layout               #
  #                                             #
  ##############################################*/

  /*
  Language menu (flags)
  */

  // Conform language menu style to album menu style
  var $flags = $('.flags');
  var $currentLanguage = $('.currentLanguage');
  $flags.find($currentLanguage.find('img')).wrap('<a />');
  $flags.find('img').each(function() {
    $(this).replaceWith($(this).attr('alt'));
  });
  $flags.prev().find('a').text($currentLanguage.children('a').text());
  $flags.removeClass('flags');
  $currentLanguage.addClass('active-item');
  $currentLanguage.removeClass('currentLanguage');


  /*
  Album, page and news menu
  */

  // Conform news menu style to album menu style
  if (!$('#news_menu .active-item a').length > 0) {
    $('#news_menu .active-item').not('a').contents().wrap('<a/>');
  }

  // Add active-item class if we are on news loop or gallery loop in home page
  if (received.newsActive) {
    $('#news_menu > li:first-child').addClass('active-item');
  }
  if (received.galleryActive) {
    $('#album_menu > li:first-child').addClass('active-item');
  }

  // Add a class to albums with subalbums
  $('.subalbum').parent().addClass('has_sub');

  // open/close menu on click
  $('.drop').on('click', function() {
    $(this).toggleClass('dropped')
      .next().toggleClass('dropped');
  });


  /*
  Search bar
  */

  $('#search br').remove();

  // Set title for search options menu opener and open/close the menu
  var $toggleSearchExtra = $('a.toggle_searchextrashow');
  var $searchExtraShow = $('#searchextrashow');
  $toggleSearchExtra
    .prop('title', $('img#searchfields_icon').attr('title'))
    .on('click', function() {
      $(this).add($searchExtraShow).toggleClass('dropped');
    });

  // Prepare for using FontAwesome checkbox
  $searchExtraShow.find('label').each(function() {
    $(this).prop('for', $(this).children().attr('id'));
    $(this).before($(this).children());
  });

  // Search input
  $('#search_input')
    // Required, Search text as placeholder
    .prop({
      'required': 'required',
      'placeholder': received.searchPlaceholder
    })
    // Disable autocomplete on focus
    .on('focus', function() {
      if (browser.name !== 'firefox' || $(this).next().is('span')) {
        $(this).prop('autocomplete', 'off');
      }
    })
    .on('keydown', function() {
      var attr = $(this).attr('autocomplete');
      // Re-enable autocomplete on keydown, unless tag suggest plugin is enabled (next is span)
      if (attr === 'off' && !$(this).next().is('span')) {
        $(this).removeAttr('autocomplete');
      }
    });

  // Close all menus by clicking outside them too
  $('footer.panel').on('click', function(e) {
    if (!$(e.target).is('.main-nav *, #search_form *')) {
      $('ul').add($searchExtraShow).add($toggleSearchExtra).removeClass('dropped');
    }
  });


  /*
  Forms
  */

  // Hide mail subject if defined in theme options
  var $mailform = $('#mailform');
  if (received.mailSubject !== "") {
    $mailform.children('#mailform-subject').hide().prev().hide();
  }

  // Layout
  $('#commentcontent > br, #commentcontent > a > img').remove();
  $mailform.prev().addClass('hide');
  $mailform.children('label').add('#commentform > label').addClass("hide");
  $('#loginform button[type=submit]').addClass('special');

  // Zenphoto PasswordForm layout adaptation
  $("#loginform :input").each(function(index, elem) {
    var eId = $(elem).attr("id");
    var legend = null;
    if (eId && (legend = $(elem).prev()).length == 1) {
      var reqRd = eId == "user" ? false : true; // Don't add required attribute to user field
      $(elem).prop({
        "placeholder": $(legend).text(),
        "required": reqRd
      })
        .removeClass("textfield")
        .prev().addClass("hide");
    }
  });
  $('#disclose_password').each(function() {
    $(this).insertBefore($(this).parent())
      .next().prop('for', 'disclose_password');
  });


  /*
  Submit mail form via ajax
  */

  $mailform.on('submit', function(e) {
    e.preventDefault();

    var $submit = $(this).find('input[type="submit"]'), message;

    // Disable buttons during ajax request
    $submit.prop('disabled', 'disabled');
    $submit.next().prop('disabled', 'disabled');

    // Reposition container for feedback message and insert container for waiting icon spinner
    var $formResult = $('#form-result');
    $submit.parent().after($formResult);
    $submit.parent().after('<p class="idle" />');
    $submit.parent().next().slideDown();

    $.ajax({
      type: 'POST',
      cache: false,
      data: $(this).serialize(),
      url: received.contactURL,
      error: function(xhr) {
        message = '<div class="errorbox">Ajax error ' + xhr.status + ': ' + xhr.statusText + '</div>';
      },
      success: function(res) {
        var $res = $(res);
        message = $res.filter('.errorbox');
        if (!$res.filter('#mailform').length && !$res.find('a[href*="again"]').length) {
          message = '<div class="errorbox">' + $res.text() + '</div>';
        } else if (!message.length) {
          message = "<span>" + received.mailSent + "</span>";
        }
      },
      complete: function() {
        $submit.next().removeAttr('disabled');
        $submit.parent().next().slideUp(500, function() {
          $(this).remove();
        });
        $submit.next().one('click', function() {
          $submit.removeAttr('disabled');
          $formResult.slideUp(500, function() {
            $(this).children().remove();
          });
        });
        $formResult.html(message).slideDown();
      }
    });
  });


  /*
  Remove border bottom from links with images
  */

  var $page = $('#page');
  $page.find('a').has('img').css('border', 'none');


})(jQuery);
