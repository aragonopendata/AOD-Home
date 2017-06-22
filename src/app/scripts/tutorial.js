/* ========================================================================
 * Tutorial specific Javascript
 * 
 * ========================================================================
 * Copyright 2015 Bootbites.com (unless otherwise stated)
 * For license information see: http://bootbites.com/license
 * ======================================================================== */

// overlay data API
// =========================
(function($) {
  // Overlay triggers
  $('[data-toggle="overlay"]').each(function() {
    var $this = $(this),
      $target = $this.data('target') || null;
      
      // General class for all triggers
      $this.addClass('overlay-trigger');
      
      // Check target overlay to open exists
      if ($($target).size() > 0) {
        $target = $($target);
        
        $this.on('click', function(e) {
          // Add some classes to the elements & body
          // let CSS handle effects
          $this.toggleClass('overlay-active');
          $target.toggleClass('overlay-active');
          $('body').toggleClass('overlay-open');

          return false;
        });
      }
  });
  
  // Overlay dismiss links/buttons
  $('[data-dismiss="overlay"]').each(function() {
    var $this = $(this),
      $target = $this.data('target') || '.overlay',
      $trigger = $('[data-toggle="overlay"][data-target="'+ $target +'"]') || null;
      
      // Check target overlay to close exists
      if ($($target).size() > 0) {
        $target = $($target);
        $this.on('click', function(e) {
          $target.removeClass('overlay-active');
          $('body').removeClass('overlay-open');
          
          // Try to find the trigger
          if ($trigger.size() > 0) {
            $trigger.removeClass('overlay-active');
          }
          else {
            // close all
            $('[data-toggle="overlay"]').removeClass('overlay-active');
          }

          return false;
        });
      }
  });
  
})(jQuery);