/*
	Multiverse by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
	*/

/*
  New features and optimization for Zenphoto by bic-ed | www.antonioranesi.it | GPL-2.0 License
  • Fullscreen
  • Slide show
  • Touch swipe on the popup for navigation to previous & next image
  • Preload of two images (prev & next) for the popup
  • Zoom on double tap (or double click) and pan image
  • Zenphoto DOM manipulation
  • Zenphoto ajax contact form
*/

(function($) {

			var	$window = $(window),
	      $body = $('body'),
	      $wrapper = $('#wrapper');

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
        window.setTimeout(function() {
          $body.removeClass('loading');
        }, 100);
      });

      // Prevent transitions/animations on resize.
      var resizeTimeout;

      $window.on('resize', function() {

        window.clearTimeout(resizeTimeout);

        $body.addClass('resizing');

        resizeTimeout = window.setTimeout(function() {
          $body.removeClass('resizing');
        }, 100);

      });

    }

		// Scroll back to top.
		// 	$window.scrollTop(0);

    // Fix: Placeholder polyfill.
    $('form').placeholder();

    // Panels.
    var $panels = $('.panel');


        $toggle = $('header > nav a'),
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
    $body
      .on('click', function(event) {
				
				// disable closing panels for Zenphoto admin and fullscreen buttons (bic-ed)
        if ($body.hasClass('content-active') && !$(event.target).is('#zp__admin_link, #zp__admin_data a, #fullscreen')) {

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
    var $header = $('header');

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
      
          window.location.href = href;
      
        });

    });

    // Footer.

    /*
     Move menus, social & copyright when the "medium" breakpoint activates (bic-ed)
     */

    var $social_placeolder = $('.social').prev();
    breakpoints.on('<=medium', function() {
        $('.menu_group').insertAfter($('.inner.split').children().first());
        $('.social').appendTo($('.inner.split').children().last());
        $('.copyright').appendTo($('.inner.split').children().last());
      });
    breakpoints.on('>medium', function() {
        $('.menu_group').appendTo($('.inner.split'));
        $('.social').insertAfter($social_placeolder);
        $('.copyright').appendTo($('.inner.split').children().first());
      });

    // Main.
    var $main = $('#main');

    // Thumbs.
    $main.children('.thumb').each(function() {
			
			var	$this = $(this),
        $image = $this.find('.image'), $image_img = $image.children('img'),
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
      imgLinks = new Array();
    $(selector).each(function() {
      imgLinks.push($(this).attr('href'));
    });

    // Swipe - Set some options for poptrox-popup as variables to change them later (bic-ed)
    var fadeSpeed = 200,
			popupSpeed = 200;

    // Define $imgs outside onPopupOpen function to use it in other functios too (bic-ed)
    var $imgs = "",

		// Define once as a variable that will be used to avoid currentIndex mess up on keyboard navigation and more (bic-ed) 
			once = 0;

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
        $("#play").removeClass("playing");
        slideShow = null;
        $imgs.swipe("destroy");
        $('#fullscreen').insertAfter('header > h1');
      },
      onPopupOpen: function() {
        $body.addClass('modal-active');
				// Initialize swipe and move fullscreen icon on the image when popup has been opened (bic-ed)
        $imgs = $(".poptrox-popup");
        $imgs.swipe(imgSlideAndZoom);
        setTimeout(function() {
					$('#fullscreen').appendTo('.poptrox-popup');
	      }, fadeSpeed + popupSpeed);
			},
      overlayOpacity: 0,
      popupCloserText: '',
      popupHeight: 80,
      popupLoaderText: '',
      fadeSpeed: fadeSpeed,
      popupSpeed: popupSpeed,
      popupWidth: 80,
      selector: selector,
      usePopupCaption: true,
      usePopupDefaultStyling: false,
      usePopupEasyClose: false,
      usePopupForceClose: true,
      usePopupLoader: true,
      useBodyOverflow: true,
      windowMargin: 50
    });

    /*
    Keyboard navigation adapted for slideshow and changeImage function. (bic-ed)
		NOTE: Assinging true parameter to changeImage can be used to slide images instead of fade and warp them.
		Add a theme option for this?
     */
    
    $window.keyup(function(e) {
        if ($imgs.length && !$('#zoom').length) {
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
	
    $(".poptrox-popup").append('<span id="play"></span>', '<span class="nav-previous"></span>', '<span class="nav-next"></span>');

    var slideShow;
    $("#play").click(slide);

    function slide() {
      $("#play").addClass("start");
      setTimeout(function() {
        $("#play").removeClass("start");
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
          $("#play").toggleClass("playing");
        }, 200)
      }, 350)
    };


    /*
    Preload (2/3)
		Set total images number and get index of current image on open popup. (bic-ed)
    */

    var totalImages = $(selector).length - 1;

    $(selector).click(function() {
      currentIndex = $(this).parent().index();
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


    // standard navigation 
    $('.nav-next').click(function() {
      changeImage(1);
    });
    $('.nav-previous').click(function() {
      changeImage(-1);
    });

    // Hack: Set margins to 0 when 'small' activates.
    if ( $(".poptrox-overlay").length>0) {
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
    
    $("#fullscreen").on('click', function(e) {
      var doc = window.document;
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
    
    var popImgSize, realImgSize, zoomStartPosition,	zoomCurrentPosition,
			windowSize,	$zoomedImg, zoomSpeed = 300;

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
      $zoomedImg = $("#zoom > img");
			windowSize = {
				width: $window.width(),
				height: $(".poptrox-overlay").height()
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
      $(".poptrox-overlay").fadeTo(zoomSpeed, 0);

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
      $(".poptrox-overlay").fadeTo(zoomSpeed, 1);
      $zoomedImg.animate({
        "top": zoomStartPosition.top,
        "left": zoomStartPosition.left,
        "width": popImgSize.width,
        "height": popImgSize.height
      }, zoomSpeed, function() {
        $("#zoom").remove();
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
        closePoptroxTimer  = setTimeout(function() {
          $imgs.trigger('poptrox_close');
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
        $imgs.css({'transition-timing-function':'', "transform" : "translate(0px)"});
        $main[0]._poptrox.fadeSpeed = fadeSpeed;
        $main[0]._poptrox.popupSpeed = popupSpeed;
        $imgs.removeClass('swipe');
      }, 100 + time);
    }

    // Fix style if Zenphoto admin bar is visible...
    if ($('#zp__admin_module').is(":visible")) {

    	$wrapper.css('margin-top','-2px');
			// ...with rules depending on screen size (bic-ed)
      breakpoints.on('>small', function() {
        $('header').css('top','');
        $('.poptrox-overlay').css('z-index', 20000);
      });
      breakpoints.on('<=small', function() {
        $('header').css('top','30px');
				$('.poptrox-overlay').css('z-index', 100002);
      });

    }

/*********************************************************
 *                                                       *
 * Below this line, Zenphoto specific code only (bic-ed) *
 *                                                       *
 *********************************************************/


/*
Language menu (flags)
*/

// Conform language menu style to album menu style
$('.flags .currentLanguage img').wrap('<a />');
$('.flags img').each(function() {
  $(this).replaceWith($(this).attr('alt'));
});
$('.flags').prev().find('a').text($('.currentLanguage a').text());
$('.flags').removeClass('flags');
$('.currentLanguage a').addClass('active-item');
$('.currentLanguage').removeClass('currentLanguage');


/*
Album, page and news menu
*/

// Conform news menu style to album menu style
if (!$('#news_menu .active-item a').length > 0 ) {
  $('#news_menu .active-item').not('a').removeClass('active-item').contents().wrap('<a class="active-item"></a>');
}

// Add active-item class if we are on news loop or gallery loop 
if (typeof isNewsLoop == 'number') {
  $('#news_menu > li:first-child > a').addClass('active-item');
}
if (typeof isGalleryLoop == 'number') {
  $('#album_menu > li:first-child > a').addClass('active-item');
}

// Add a class to albums with subalbums
$('.subalbum').parent().addClass('has_sub');

// Deactivate self-link for the active item
$("a.active-item").removeAttr("href");

// open/close menu on click
$('.drop').on('click',function() {
  $(this).toggleClass('dropped');
  $(this).next().toggleClass('dropped');
});


/*
Search bar
*/

$('#search br').remove();

// Set title for search options menu opener and open/close the menu
$('a.toggle_searchextrashow')
.prop('title', $('img#searchfields_icon').attr('title'))
.on('click', function() {
  $(this).add('#searchextrashow').toggleClass('dropped');
});

// Prepare for using FontAwesome checkbox
$('#searchextrashow label').each(function() {
  $(this).prop('for', $(this).children().attr('id'));
  $(this).before($(this).children());
});

// Search input
$('#search_input')
// Required, Search text as placeholder
.prop({'required': 'required', 'placeholder': search_placeholder})
// Disable autocomplete on focus
.on('focus', function() {
	$(this).prop('autocomplete', 'off');
})
.on('keydown', function() {
	var attr = $(this).attr('autocomplete');
	// Re-enable autocomplete on keydown, unless tag suggest plugin is enabled (next is span)
	// [not working in Firefox]
	if (attr === 'off' && !$(this).next().is('span')) {
		$(this).removeAttr('autocomplete');
	}
});

// close all menus by clicking outside them too
$('footer').on('click', function(e) {
	if (!$(e.target).is('.main-nav *, #search_form *')) {
		$('ul, .toggle_searchextrashow, #searchextrashow').removeClass('dropped');
	}
});


/*
Forms
*/

// Layout
$('#commentform .button').before($("label[for=comment_dataconfirmation]").parent());
$('#commentform').prepend($("#commentform p:not(:has(input, span))"));

// Set placeholders and strip unwanted html tags
$('#commentform .textarea_inputbox').prop({placeholder:comment_placeholder, rows:4});
$("#mailform :input, #commentform :input").each(function(index, elem) {
    var eId = $(elem).attr("id");
    var label = null;
    if (eId && eId != 'dataconfirmation' && (label = $(elem).parents("form").find("label[for="+eId+"]")).length == 1) {
        $(elem).prop("placeholder", $(label).html().replace(/(<([^>]+)>)/ig,""));
				if ($(elem).is($('#mailform #'+eId))) {
					$(elem).prop("placeholder", $(elem).attr('placeholder').replace("*",""));
				}
    }
});
$("#loginform :input").each(function(index, elem) {
    var eId = $(elem).attr("id");
    var legend = null;
    if (eId && (legend = $(elem).prev()).length == 1) {
        $(elem).prop("placeholder", $(legend).html().replace(/(<([^>]+)>)/ig,""));
        $(elem).prev().hide();
    }
});

// Remove '*' from data confirmation (all fields are required here)
if ($('label[for=dataconfirmation]').length) {
var removeasterisk = $('label[for=dataconfirmation]').html().replace(/\*/g, '&nbsp;');
$('label[for=dataconfirmation]').html(removeasterisk);
}

// Place recaptcha at the bottom
$('#mailform .g-recaptcha').appendTo($('#mailform'));
$('#commentform .g-recaptcha').css('margin-top','2em').appendTo($('#commentform'));

// Hide mail subject if defined in theme options
if (mailsubject !== "") {
  $('#mailform #subject').hide();
}

// Layout
$('#commentcontent br').remove();
$('#mailform').prev().hide();
$('#mailform label, #commentform label').not("[for=dataconfirmation], [for=comment_dataconfirmation]").hide();
$('label[for=dataconfirmation]').before($('label[for=dataconfirmation] input'));
$('label[for=comment_dataconfirmation]').before($('label[for=comment_dataconfirmation] input'));
$('#mailform .button[type=submit], #commentform .button[type=submit], #loginform button[type=submit]').addClass('special');
$('label[for=dataconfirmation] a, label[for=comment_dataconfirmation] a').prop('target','blank');

// Loginform display a checkmark if show password is active
$('#disclose_password').on('click', function() {
  $(this).parent().toggleClass('showpw');
});


/*
Submit mail form via ajax
*/

// Mail form browser validation
$('#mailform #email').prop('type','email');
$('#mailform #name, #mailform #email, #mailform #subject, #mailform #message, #mailform #dataconfirmation').prop('required', true);

$('#mailform').on('submit', function(e) {
  e.preventDefault();
  
	var $submit = $(this).find('input[type="submit"]'), message;

  // Disable buttons during ajax request
	$submit.prop('disabled', 'disabled');
	$submit.next().prop('disabled', 'disabled');

  // Reposition container for feedback message and insert container for waiting icon spinner
	$submit.parent().after($('#form-result'));
	$submit.parent().after('<p class="idle"></p>');
	$submit.parent().next().slideDown();

	$.ajax({
		type: 'POST',
		cache: false,
		data: $(this).serialize(),
		url: contact,
    error: function(xhr) {
      message = '<div class="errorbox">Ajax error ' + xhr.status + ': ' + xhr.statusText + '</div>';
    },
		success: function(res) {
			message = $(res).filter('.errorbox');
      if (!$(res).filter('#mailform').length && !$(res).find('a[href*="again"]').length) {
        message = '<div class="errorbox">' + $(res).text() + '</div>';
      } else if (!message.length) {
        message = mail_sent;
      }
		},
		complete: function() {
			$submit.next().removeAttr('disabled');
			$submit.parent().next().slideUp(500, function() {
				$(this).remove();
			});
			$submit.next().one('click', function() {
				$submit.removeAttr('disabled');
				$('#form-result').slideUp(500, function() {
					$(this).children().remove();
				});
			});
			$('#form-result').html(message).slideDown();
		}
	});
});


/*
Remove border bottom from links with images
*/

$('#page a').has('img').css('border', 'none');


})(jQuery);
