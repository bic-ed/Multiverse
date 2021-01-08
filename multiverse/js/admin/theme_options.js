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
    $('#social_contacts').css('margin-bottom', '20px');
    $('#social_contacts').parent().append('<p class="buttons add_del"><button disabled value="add"><img src="images/add.png" alt="">' + buttonAdd + '</button><button disabled value="delete"><img src="images/edit-delete.png" alt="">' + buttonDel + '</button><p>');
    $('.add_del button').fadeTo(10, .4);

    // create social icon input fields (function triggered by reset button too)
    populate();
    function populate() {
      for (var field = 1, i = 0; field < socialContent.length + 1; field++, i++) {
        if (i == 3) { i = 0 }
        $('.add_del').before('<input style="display:block; width:338px;' + styleitem[i] + '"' + placeholder[i] + ' id="sc' + field + '" class="social_data" type="text" value="' + socialContent[field - 1] + '" disabled>');
        $('.add_del').prev().hide().toggle(600);
        if (socialEnabled == 1) {
          $('.social_data, .add_del button').prop('disabled', false);
          $('.add_del button').fadeTo(10, 1);
        }
      }
      setTimeout(function() {
        if ($('#zenpage_zp_index_news').prop('checked')) {
          $('#zenpage_homepage').prop('disabled', true).css('background', '#f0f0f0');
        } else {
          $('#zenpage_homepage').prop('disabled', false);
        }
      }, 10);
    }

    // Disable zenpage_homepage option if zenpage_zp_index_news is enabled and vice versa
    $('#zenpage_zp_index_news').on('click', function() {
      $('#zenpage_homepage').prop('disabled', function(q, v) {
        $('#zenpage_homepage').css('background', v ? '' : '#f0f0f0');
        return !v;
      });
    });

    // toggle enabled status of social icon input fields and of add/delete buttons
    $('#social_contacts').on('click', function() {
      $('.social_data, .add_del button').prop('disabled', function(q, v) { return !v; });
      $('.add_del button').fadeTo(10, 1);
      $('.add_del button[disabled]').fadeTo(10, .4);
    });

    // Add or delete social icon input fields
    $('.add_del button').on('click', function(e) {
      e.preventDefault();
      field = ($('.social_data').length);
      if ($(this).val() == 'add') { // add
        for (var new_field = field + 1, i = 0; new_field < 4 + field; new_field++, i++) {
          $('.add_del').before('<input style="display:block; width:338px;' + styleitem[i] + '"' + placeholder[i] + ' id="sc' + new_field + '" class="social_data" type="text" value="">');
          $id = $('#sc' + new_field);
          $id.hide().toggle(400);
          if (i == 0) {
            $id.focus();
          }
        }
      } else { // delete
        for (var new_field = field - 2; new_field < 1 + field; new_field++) {
          $id = $("#sc" + new_field);
          $id.toggle(400, function(){
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

    // Set option with ajax request
    $('form').one('submit', function(e) {
      // Set custom_index_page to gallery.php if the home page is set to news loop or to an unpublished page
      if (!$('#zenpage_zp_index_news').prop('checked') && $('#zenpage_homepage').val() == "") {
        $('#custom_index_page').prop('disabled', false).val('');
      } else {
        $('#custom_index_page').prop('disabled', false).val('gallery');
      }
      var paramlist = $(".social_data").map(function() {
        return this.id + '=' + this.value;
      }).get();
      $('#zenpage_homepage').prop('disabled', false);
      // only apply ajax request if any social icon input fields is changed
      if ($('.social_data').hasClass('dirty') || paramlist.length == 0) {
        e.preventDefault();
        $.ajax({
          type: 'POST',
          cache: false,
          data: paramlist.length ? paramlist.join("&") : 'sc1=""&sc2=""&sc3=""',
          url: saveurl,
          complete: function() { // submit form for all other fields
            $('form').submit();
          }
        });
      }
    });
  });
})();
