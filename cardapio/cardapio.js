(function($) {

    $("#menu-filters li a").click(function() {
      $("#menu-filters li a").removeClass('active');
      $(this).addClass('active');
  
      var selectedFilter = $(this).data("filter");
  
      $(".menu-restaurant").fadeOut();
  
      setTimeout(function() {
        $(selectedFilter).slideDown();
      }, 300);
    });
  
    })(jQuery);
  
   
  