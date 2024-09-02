/**
 * Utility to create a theme option for social media Links
 * adding and deleting the 3 fields needed for each site
 * without living the page.
 * @author bic-ed
 */

(function() {
  var styleitem = ['margin:2px 0', 'margin:2px 0', 'margin:0 0 30px'],
  placeholder = ['placeholder = "https://www.social-media.com/your-profile"','placeholder = "fa-social-media"','placeholder = "Social media name"'];
  // create an array with DB stored value (or an empty one if DB option not set yet)
  socialContent = socialContent.split(',');
  $('document').ready(function() {

    // create buttons to add or delete social icon input fields
    $('#multiverse_social_contacts').css('margin-bottom', '20px');
    $('#multiverse_social_contacts').parent().append('<p class="buttons add_del"><button disabled value="add"><img src="images/add.png" alt="">' + buttonAdd + '</button><button disabled value="delete"><img src="images/edit-delete.png" alt="">' + buttonDel + '</button><p>');
    $('.add_del button').fadeTo(10, .4);

    // create social icon input fields (function triggered by reset button too)
    populate();
    function populate() {
      for (var field = 0, i = 0; field < socialContent.length; field++, i++) {
        if (i == 3) { i = 0 }
        $('.add_del').before('<input style="display:block; width:338px;' + styleitem[i] + '"' + placeholder[i] + ' class="social_data" type="text" value="' + decodeURIComponent(socialContent[field]).replace(/"/g, '&quot;') + '" disabled>');
        $('.add_del').prev().hide().toggle(600);
        if (socialEnabled == 1) {
          $('.social_data, .add_del button').prop('disabled', false);
          $('.add_del button').fadeTo(10, 1);
        }
      }
      setTimeout(function() {
        if ($('#multiverse_index_news').prop('checked')) {
          $('#multiverse_homepage').prop('disabled', true).css('background', '#f0f0f0');
        } else {
          $('#multiverse_homepage').prop('disabled', false);
        }
      }, 10);
    }

    // Disable multiverse_homepage option if multiverse_index_news is enabled and vice versa
    $('#multiverse_index_news').on('click', function() {
      $('#multiverse_homepage').prop('disabled', function(q, v) {
        $('#multiverse_homepage').css('background', v ? '' : '#f0f0f0');
        return !v;
      });
    });

    // toggle enabled status of social icon input fields and of add/delete buttons
    $('#multiverse_social_contacts').on('click', function() {
      $('.social_data, .add_del button').prop('disabled', function(q, v) { return !v; });
      $('.add_del button').fadeTo(10, 1);
      $('.add_del button[disabled]').fadeTo(10, .4);
    });

    // Add or delete social icon input fields
    $('.add_del button').on('click', function(e) {
      e.preventDefault();
      field = ($('.social_data').length);
      if ($(this).val() == 'add') { // add
        for (var i = 0; i < 3; i++) {
          $('.add_del').before('<input style="display:block; width:338px;' + styleitem[i] + '"' + placeholder[i] + ' class="social_data" type="text" value="">');
          $thisField = $('.social_data').eq(field + i);
          $thisField.hide().toggle(400);
          if (i == 0) {
            $thisField.focus();
          }
        }
      } else { // delete
        for (var i = field - 3; i < field; i++) {
          $thisField = $('.social_data').eq(i);
          $thisField.toggle(400, function(){
            $(this).remove();
          });
        }
        // set (or reset) the "changed" status of the page (dirty is the class added by Zenphoto to changed form fields)
        setTimeout(function(){
          if ($('.social_data').length < socialContent.length) {
            $('form, .social_data').addClass('dirty');
          } else if (!$('input').hasClass('dirty')) {
            $('form').removeClass('dirty');
          }
        }, 450);
      }
    });

    // restore options on reset and repopulate input fields
    $('form').on('reset', function() {
      $('.social_data').toggle(400, function() {
        $(this).remove();
      });
      $('.add_del button').fadeTo(10, .4).prop('disabled', true);
      populate();
    });

    // Set social content option with hidden field
    $('form').on('submit', function(e) {
      var paramlist = $(".social_data").map(function() {
        return encodeURIComponent(this.value);
      }).get().join(',');
      $('#multiverse_homepage').prop('disabled', false);
      // only apply ajax request if any social icon input fields is changed
      if ($('.social_data').hasClass('dirty') || paramlist.length == 0) {
        $(this).append(
          '<input type="hidden" name="_ZP_CUSTOM_text-multiverse_social_content" value="1">'
          + '<input type="hidden" id="multiverse_social_content" name="multiverse_social_content" value="'
          + paramlist
          + '">'
        );
      }
    });
  });
})();
