/*
 * Multiverse by HTML5 UP
 * html5up.net | @ajlkn
 * Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
 *
 * New features and optimization for Zenphoto by bic-ed | www.antonioranesi.it | GPL-2.0 License
 * • Fullscreen
 * • Slide show
 * • Touch swipe on the popup for navigation to previous & next image
 * • Preload of two images (prev & next) for the popup
 * • Zoom on double tap (or double click) and pan image
 * • Zenphoto DOM manipulation
 * • Zenphoto ajax contact form
 */

(function($) {

  var objWindow = window,
  $window = $(objWindow),
  $body = $('body'),
  $wrapper = $('#wrapper'),
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

  // Transitions supported?
  if (browser.canUse('transition')) {

    // On load remove "loading" class.

    $window.on('load', function() {
      objWindow.setTimeout(function() {
        $body.removeClass('loading');
      }, 100);
    });

    // Prevent transitions/animations on resize.
    var resizeTimeout;

    $window.on('resize', function() {

      objWindow.clearTimeout(resizeTimeout);

      $body.addClass('resizing');

      resizeTimeout = objWindow.setTimeout(function() {
        $body.removeClass('resizing');
      }, 100);

    });

  }

  // Scroll back to top.
  //  $window.scrollTop(0);

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

    // disable closing panels for Zenphoto admin and fullscreen buttons (bic-ed)
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

  $window
  .on('keyup', function(event) {

    if (event.keyCode == 27 && $body.hasClass('content-active')) {
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
  Move menus, social & copyright when the "medium" breakpoint activates (bic-ed)
  */

  var $social = $('.social');
  var $innerSplit = $('.inner.split');
  var $menuGroup = $('.menu_group');
  var $copyright = $('.copyright');
  // var $social_placeolder = $social.prev();
  breakpoints.on('<=medium', function() {
    $menuGroup.insertAfter($innerSplit.children().first());
    $social.appendTo($innerSplit.children().last());
    $copyright.appendTo($innerSplit.children().last());
  });
  breakpoints.on('>medium', function() {
    $menuGroup.appendTo($innerSplit);
    $social.insertAfter($social.prev());
    $copyright.appendTo($innerSplit.children().first());
  });

  // Main.
  var $main = $('#main');

  // Thumbs.
  $main.children('.thumb').each(function() {

    var $image = $(this).find('.image'),
      $image_img = $image.children('img'),
      x;

    // No image? Bail.
    if ($image.length == 0)
    return;

    // Image.
    // This sets the background of the "image" <span> to the image pointed to by its child
    // <img> (which is then hidden). Gives us way more flexibility.

    // Set background.
    $image.css('background-image', 'url(' + $image_img.attr('src') + ')');

    // Set background position.
    if (x = $image_img.data('position'))
    $image.css('background-position', x);

    // Hide original img.
    $image_img.hide();

  });


  /*
  Preload (1/3)
  Inizialize currentIndex and retrieve array of fullsize images links (bic-ed)
  */

  var currentIndex = 0,
  selector = '.thumb > a.image',
  $selector = $(selector),
  imgLinks = new Array();
  $selector.each(function() {
    imgLinks.push($(this).attr('href'));
  });

  // Swipe - Set some options for poptrox-popup as variables to change them later (bic-ed)
  var fadeSpeed = 200,
  popupSpeed = 200;

  // Define $imgs and $play outside onPopupOpen function, to use them in other functios too (bic-ed)
  var $imgs, $play;

  // Define once as a variable that will be used to avoid currentIndex mess up on keyboard navigation and more (bic-ed)
  var once = 0;

  // Poptrox.
  $main.poptrox({
    baseZIndex: 20000,
    caption: function($a) {

      var s = '';

      $a.nextAll().each(function() {
        s += this.outerHTML;
      });

      return s;

    },
    onPopupClose: function() {
      $body.removeClass('modal-active');
      // Reset all when popup has been closed (bic-ed)
      clearInterval(slideShow);
      reset_swipe(0);
      $play.removeClass("playing");
      slideShow = null;
      // $imgs.swipe("destroy");
      $fullscreen.insertAfter($header.children('h1'));
    },
    onPopupOpen: function() {
      $body.addClass('modal-active');
      // Initialize all (bic-ed)
      if (!$imgs) { // Only once
        $imgs = $(".poptrox-popup").append('<span id="play" />', '<span class="nav-previous" />', '<span class="nav-next" />');
        //  Swipe navigation
        $imgs.swipe(imgSlideAndZoom)
        // Standard navigation
        .children(
          $('.nav-next').on('click', function() {
            changeImage(1);
          }),
          $('.nav-previous').on('click', function() {
            changeImage(-1);
          })
        );
        // Sideshow
        $play = $('#play');
        $play.on('click', slide);
      }

      // Move fullscreen icon on the image when popup has been opened
      setTimeout(function() {
        $fullscreen.appendTo($imgs);
      }, fadeSpeed + popupSpeed);
    },
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
    windowMargin: 50
  });

  /*
  Keyboard navigation adapted for slideshow and changeImage function. (bic-ed)
  NOTE: Assinging true parameter to changeImage can be used to slide images instead of fade and warp them.
  Add a theme option for this?
  */

  $window.keyup(function(e) {
    if ($imgs && !$zoom) {
      switch (e.keyCode) {

        case 37:
        if (once) {
          return false;
        }
        once = 1;
        changeImage(-1);
        break;

        case 39:
        if (once) {
          return false;
        }
        once = 1;
        changeImage(1);
        break;

        case 32:
        slide();
        break;
      }
    }
  });


  /*
  Slide show (bic-ed)
  */

  var slideShow;

  function slide() {
    $play.addClass("start");
    setTimeout(function() {
      $play.removeClass("start");
      if (!slideShow) {
        if (once) {
          return false;
        }
        once = 1;
        changeImage(1);
        slideShow = setInterval(changeImage, 5000, 1);
      } else {
        clearInterval(slideShow);
        slideShow = null;
      }
      setTimeout(function() {
        $play.toggleClass("playing");
      }, 200)
    }, 350)
  };


  /*
  Preload (2/3)
  Set total images number and get index of current image on open popup. (bic-ed)
  */

  var totalImages = $selector.length - 1;

  $selector.on('click', function() {
    currentIndex = $(this).parent().index('div.thumb:not(.album)');
    preload();
  });

  function preload() {
    var tmp = [new Image, new Image, new Image];
    tmp[0].src = imgLinks[currentIndex];
    $(tmp[0]).on('load', function() {
      // prevent keybord navigation messing up currentIndex
      setTimeout(function() {
        once = 0;
      }, 10 + fadeSpeed + popupSpeed);
      // load next image
      if (currentIndex < totalImages) {
        tmp[1].src = imgLinks[currentIndex + 1];
      } else {
        tmp[1].src = imgLinks[0];
      }
    });
    $(tmp[1]).on('load', function() {
      // load prev image
      if (currentIndex > 0) {
        tmp[2].src = imgLinks[currentIndex - 1];
      } else {
        tmp[2].src = imgLinks[totalImages];
      }
    });
  };

  var $poptroxOverlay = $('.poptrox-overlay');
  // Hack: Set margins to 0 when 'small' activates.
  if ($poptroxOverlay.length > 0) {
    breakpoints.on('>small', function() {
      $main[0]._poptrox.windowMargin = 50;
    });
    breakpoints.on('<=small', function() {
      $main[0]._poptrox.windowMargin = 0;
    });
  }

  /*
  Fullscreen (bic_ed)
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


  /*
  Zoom & Pan (bic-ed)
  */

  var panOrCloseZoom = {
    swipeStatus: panZoom,
    allowPageScroll: false,
    doubleTap: closeZoom,
    doubleTapThreshold: 300,
    tap: function() {},
    pinchOut: closeZoom,
    fingers: 2,
  },
  oldPosition,
  startingPoint;
  function panZoom(event, phase, direction, distance) {

    // panning start point
    var evt; event.touches ? evt = event.touches[0] : evt = event;
    if (phase == "start") {
      oldPosition = {
        left: $zoomedImg.position().left,
        top: $zoomedImg.position().top
      }
      startingPoint = {
        x: evt.clientX,
        y: evt.clientY
      }
    }

    if (phase == "move") {
      zoomCurrentPosition.left = oldPosition.left + evt.clientX - startingPoint.x;
      zoomCurrentPosition.top = oldPosition.top + evt.clientY - startingPoint.y;
      zoomBounds();
      $zoomedImg.css({
        'left': zoomCurrentPosition.left,
        'top': zoomCurrentPosition.top
      })
    }

  }

  var popImgSize, realImgSize, zoomStartPosition, zoomCurrentPosition,
  windowSize, $zoomedImg, zoomSpeed = 300, $zoom;

  function openZoom(event, target) {
    // IDEA: add a theme option to open real full size image via ajax instead
    if (!$(target).is('img')) {
      return false;
    }
    var $poptroxImg = $(".pic > img");
    popImgSize = {
      width: $poptroxImg.width(),
      height: $poptroxImg.height()
    }
    realImgSize = {
      width: $poptroxImg[0].naturalWidth,
      height: $poptroxImg[0].naturalHeight
    }
    // QUESTION: Abort if there is nothing to zoom?
    // if (popImgSize.width == realImgSize.width && popImgSize.height == realImgSize.height) {
    //   return false;
    // }
    $body.prepend("<span id='zoom'><img src='' /></span>");
    $zoom = $("#zoom");
    $zoomedImg = $zoom.children("img");
    windowSize = {
      width: $window.width(),
      height: $poptroxOverlay.height()
    }
    zoomStartPosition = {
      top: $poptroxImg.offset().top - $window.scrollTop(),
      left: $poptroxImg.offset().left
    }
    var startingRatio = {
      x: (startingPoint.x - zoomStartPosition.left) / popImgSize.width,
      y: (startingPoint.y - zoomStartPosition.top) / popImgSize.height
    }
    zoomCurrentPosition = {
      top: -realImgSize.height * startingRatio.y + windowSize.height / 2,
      left: -realImgSize.width * startingRatio.x + windowSize.width / 2
    }

    $zoomedImg.css({
      "position": "relative",
      "top": zoomStartPosition.top,
      "left": zoomStartPosition.left,
      "z-index": "100003",
      "width": popImgSize.width,
      "height": popImgSize.height
    });

    $zoomedImg.prop("src", $poptroxImg.attr("src"));
    $poptroxOverlay.fadeTo(zoomSpeed, 0);

    zoomBounds();

    $main.css('filter', 'blur(28px)');
    $zoomedImg.animate({
      "top": zoomCurrentPosition.top,
      "left": zoomCurrentPosition.left,
      "width": realImgSize.width,
      "height": realImgSize.height
    }, zoomSpeed, function() {
      $zoomedImg.swipe(panOrCloseZoom);
      $zoomedImg.css({
        "cursor": "move"
      });
    });
  };

  function closeZoom(event, target) {
    event.preventDefault();
    $zoomedImg.swipe("destroy");

    $main.css('filter', '');
    $poptroxOverlay.fadeTo(zoomSpeed, 1);
    $zoomedImg.animate({
      "top": zoomStartPosition.top,
      "left": zoomStartPosition.left,
      "width": popImgSize.width,
      "height": popImgSize.height
    }, zoomSpeed, function() {
      $zoom.remove();
      $zoom = 0;
    });
  };

  function zoomBounds() {
    if (realImgSize.height > windowSize.height) {
      zoomCurrentPosition.top = Math.min(0, zoomCurrentPosition.top);
      zoomCurrentPosition.top = Math.max(zoomCurrentPosition.top, windowSize.height - realImgSize.height);
    } else {
      zoomCurrentPosition.top =  (windowSize.height - realImgSize.height + parseInt($imgs.css("margin-top"), 10)) / 2;
    }
    if (realImgSize.width > windowSize.width) {
      zoomCurrentPosition.left = Math.max(zoomCurrentPosition.left, windowSize.width - realImgSize.width);
      zoomCurrentPosition.left = Math.min(0, zoomCurrentPosition.left);
    } else {
      zoomCurrentPosition.left = (windowSize.width - realImgSize.width) / 2;
    }
  }

  /*
  Swipe (bic-ed)
  */

  var swipeSpeed = 300;
  var imgSlideAndZoom = {
    triggerOnTouchEnd: true,
    swipeStatus: slideStatusAndZoomOpeningPoint,
    // allowPageScroll: "vertical",
    threshold: 5, // Fake treshold: "cancel" event delegated to "end" but for long tap
    doubleTap: openZoom,
    doubleTapThreshold: 300,
    tap: function() {},
    preventDefaultEvents: true,
  };

  var maxDistance,
  closePoptroxTimer,
  delta = {};
  function slideStatusAndZoomOpeningPoint(event, phase, direction, distance) {
    if ($imgs.hasClass("loading") || event.touches && $(event.target).is('a, h2, p')) {
      return;
    }

    // detect zoom opening point and close poptrox popup on long tap
    var evt;
    event.touches ? evt = event.touches[0] : evt = event;
    if (phase == "start") {
      // close poptrox popup
      event.preventDefault();
      closePoptroxTimer = setTimeout(function() {
        $imgs.swipe('disable')
        .swipe('enable')
        .trigger('poptrox_close');
      }, 650);
      // zoom opening point
      startingPoint = {
        x: evt.clientX,
        y: evt.clientY
      }
    }

    // slide status
    maxDistance = ($window.width() + $imgs.width()) / 2;
    if (phase == "move") {
      delta.x = evt.clientX - startingPoint.x;
      if (distance > 5) {
        // stop long tap timer (prevent closing poptrox popup)
        clearTimeout(closePoptroxTimer);
      }
      // If we are moving orizzontally for more than 5px then drag.
      if (Math.abs(delta.x) > 5) {
        $imgs.addClass('swipe');
        scrollImages(delta.x - Math.sign(delta.x) * 6, 0);
      }

    } else if (phase == "end" && Math.abs(delta.x) > 95) { // on end, change image and reset
      var speed = swipeSpeed * (1 - Math.abs(delta.x) / maxDistance);

      changeImage(-Math.sign(delta.x), true, speed);
      reset_swipe(speed + swipeSpeed);

    } else if (phase == "end" && Math.abs(delta.x) < 96) { // on end before treshold, center image and reset
      scrollImages(0, swipeSpeed/3);
      reset_swipe(swipeSpeed/3);

    } else if (phase == "cancel") {
      clearTimeout(closePoptroxTimer);
    }

  }

  // Manually update the position of $imgs on drag
  function scrollImages(distance, duration) {
    // Invert the number we set in the css
    // var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
    $imgs.css({
      "transform" : "translateX(" + distance + "px)",
      "transition-duration" : (duration / 1000).toFixed(1) + "s"
    });
  }

  function changeImage(sign, sliding, speed) {
    if (sliding) {
      $main[0]._poptrox.fadeSpeed = 0;
      $main[0]._poptrox.popupSpeed = 0;
      $imgs.css({'transition-timing-function':'ease-in'});
      scrollImages(-sign * maxDistance, speed);
      setTimeout(function() {
        $imgs.css({'visibility':'hidden','transition-duration':'0s'});
        sign < 0 ? $imgs.trigger('poptrox_previous') : $imgs.trigger('poptrox_next');
        setTimeout(function() {
          maxDistance = ($window.width() + $imgs.width()) / 2;
          scrollImages(sign * maxDistance, 0);
          setTimeout(function() {
            $imgs.css({'visibility':'visible','transition-timing-function':'ease-out'});
            scrollImages(0, swipeSpeed);
          }, 20);
        }, 20);
      }, speed);
    } else {
      sign < 0 ? $imgs.trigger('poptrox_previous') : $imgs.trigger('poptrox_next');
    }

    /*
    Preload (3/3)
    Get prev & next index [recursive] (bic-ed)
    */

    currentIndex += 1 * sign;
    if (currentIndex < 0) {
      currentIndex = totalImages
    } else if (currentIndex > totalImages) {
      currentIndex = 0;
    }
    preload();
  }

  function reset_swipe(time) {
    setTimeout(function() {
      $imgs.css({
        'transition-timing-function': '',
        "transform": ""
      });
      $main[0]._poptrox.fadeSpeed = fadeSpeed;
      $main[0]._poptrox.popupSpeed = popupSpeed;
      $imgs.removeClass('swipe');
    }, 100 + time);
  }


  /********************************************************
  *                                                       *
  * Below this line, Zenphoto specific code only (bic-ed) *
  *                                                       *
  *********************************************************/


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
  $currentLanguage.children('a').addClass('active-item');
  $currentLanguage.removeClass('currentLanguage');


  /*
  Album, page and news menu
  */

  // Conform news menu style to album menu style
  if (!$('#news_menu .active-item a').length > 0 ) {
    $('#news_menu .active-item').not('a').removeClass('active-item').contents().wrap('<a class="active-item" />');
  }

  // Add active-item class if we are on news loop or gallery loop in home page
  if (received.newsActive) {
    $('#news_menu > li:first-child > a').addClass('active-item');
  }
  if (received.galleryActive) {
    $('#album_menu > li:first-child > a').addClass('active-item');
  }

  // Add a class to albums with subalbums
  $('.subalbum').parent().addClass('has_sub');

  // Deactivate self-link for the active item
  $("a.active-item").removeAttr("href");

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
  $('#commentcontent > br').remove();
  $mailform.prev().hide();
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


  /*
  Image page
  */

  var navigateImages = {
    swipeStatus: swipePrevNext,
    preventDefaultEvents: false,
    threshold: 0, // "cancel" event delegated to "end"
  };

  var $singleImage = $('#image');

  $singleImage.swipe(navigateImages);
  $singleImage.on('dragstart', function() {
    return false;
  });


  /**
  * On swipe, changes image page to previous or next, with slide animation following swipe.
  *
  * On swipe move -> image follows finger
  * On swipe end -> call redirect function
  * On swipe cancel -> reset image position
  *
  * @author bic-ed
  * @param  {obj} event
  * @param  {string} phase start | move | end | cancel
  * @param  {string} direction left | right | up | down
  */
  function swipePrevNext(event, phase, direction) {
    var nextLink = $('.nav-next > a').attr('href'),
    prevLink = $('.nav-previous > a').attr('href'),
    evt;
    event.touches ? evt = event.touches[0] : evt = event;
    if (phase == "start") {
      startingPoint = {
        x: evt.clientX,
        y: evt.clientY
      }
      swipeStarted = 0;
    }
    if (phase == "move") {
      delta = {
        x: evt.clientX - startingPoint.x,
        y: evt.clientY - startingPoint.y
      }
      if (!event.touches || Math.abs(delta.x) > Math.abs(delta.y)) {
        swipeStarted = 1;
      }
      if (swipeStarted && event.cancelable) {
        event.preventDefault();

        if (delta.x > 0 && prevLink || delta.x < 0 && nextLink) {
          $('#imagemetadata_data').hide();
          $page.addClass('swipe');

          $singleImage.parent()
          .css({
            'transform': 'translateX(' + delta.x + 'px)',
            'transition-duration': '0s',
          });
        }
      }


    } else if (phase == "end" && Math.abs(delta.x) > 90 && event.cancelable) {
      if (delta.x > 0 && prevLink) {
        changePage(1, prevLink);
      } else if (delta.x < 0 && nextLink) {
        changePage(-1, nextLink);
      }

    } else if (phase == "end" && Math.abs(delta.x) < 91) {
      setTimeout(function() {
        $page.removeClass('swipe');
      }, 150);
      $singleImage.parent()
      .css({
        'transition-duration': '.15s',
        'transform': 'translateX(0)',
      })
    }
  }

  /**
  * Slides image out of its container
  * Redirects to next or previous image page
  *
  * @author bic-ed
  * @param  {int} direction Direction for image slide out [+1|-1]
  * @param  {string} location URL of next or previous image page
  */
  function changePage(direction, location) {
    var $singleImg = $singleImage.children('img'),
    $container = $singleImage.parent(),
    boxShadow = $container.css('box-shadow').match(/(-?\S+px)|(rgb\(.+\))/g),
    slideOut;

    slideOut = ($page.outerWidth() + $container.outerWidth())/2
    + parseInt(boxShadow[4]) // box shadow spread
    + 1; // for eventual decimal pixels

    slideOut = slideOut * direction;
    $container.css({
      'transition-duration': .3 + 's',
      'transform': 'translateX(' + slideOut + 'px)',
    });
    setTimeout(function() {
      $('body').addClass('loading');
      objWindow.location.href = location;
    }, 300);
  }

})(jQuery);
