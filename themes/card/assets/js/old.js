$(document).ready(function () {

    // Back to Top Scroll Button
    $('#mainContent').on('scroll load', onScroll);
    $('#mainContent').on('touchmove', onScrollTouch); // for mobile
    topScroll();
  
    // Make links load asynchronously
    $("body").on("click", function(event) {
      if (event.target.tagName !== "A")
        return;
      // History API needed to make sure back and forward still work
      if (history === null)
        return;
      // External links should instead open in a new tab
      var newUrl = event.target.href;
      var domain = window.location.origin;
      if (typeof domain !== "string" || newUrl.search(domain) !== 0) {
        event.preventDefault();
        window.open(newUrl, "_blank");
      } else {
        event.preventDefault();
        loadPage(newUrl);
        history.pushState(null /*stateObj*/, "" /*title*/, newUrl);
      }
    });
    window.onpopstate = function(event) {
      loadPage(window.location);
    }
  
    $('.s-wrap > input').on('input', function() {
      var index = $('.s-wrap > input:checked')[0];
    });
    var slidesCount = $('.s-wrap > input').length;
  
    $('#image-slider').on('touchstart', function(event){
      const xClick = event.originalEvent.touches[0].pageX;
      $(this).on('touchmove', function(event){
          const xMove = event.originalEvent.touches[0].pageX;
          const sensitivityInPx = 20;
  
          if( Math.floor(xClick - xMove) > sensitivityInPx ){
            var index = $('input:checked')[0];
            slider = parseInt(index['id'].replace('s-', '')) + 1;
  
            if (slider == (slidesCount + 1)) {
              slider = slidesCount;
            }
            // console.log(index['id']);
            // console.log(slider);
  
            $('.s-wrap #' + index['id'] + ':checked ~ .s-content').css('transform', 'translateX(calc(-(100% / '+slidesCount+') * ('+slider+' - 1) ) )');
            $('.s-wrap #s-' + slider).prop('checked', true);
            $(this).off('touchmove');
          }
          else if( Math.floor(xClick - xMove) < -sensitivityInPx ){
            var index = $('input:checked')[0];
            slider = parseInt(index['id'].replace('s-', '')) - 1;
  
            if (slider == 0) {
              slider = 1;
            }
            // console.log(index['id']);
            // console.log(slider);
            
            $('.s-wrap #' + index['id'] + ':checked ~ .s-content').css('transform', 'translateX(calc(-(100% / '+slidesCount+') * ('+slider+' - 1) ) )');
            $('.s-wrap #s-' + slider).prop('checked', true);
            $(this).off('touchmove');
          }
      });
    });
  });
  
  // Passive event listeners
  jQuery.event.special.touchstart = {
    setup: function( _, ns, handle ) {
        this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
    }
  };
  jQuery.event.special.touchmove = {
    setup: function( _, ns, handle ) {
        this.addEventListener("touchmove", handle, { passive: !ns.includes("noPreventDefault") });
    }
  };
  
  
  function loadPage(newUrl) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState !== XMLHttpRequest.DONE)
        return;
      var newDocument = httpRequest.responseXML;
      if (newDocument === null)
        return;
      var newContent = httpRequest.responseXML.getElementById("mainContent");
      if (newContent === null)
        return;
      document.title = newDocument.title;
      var contentElement = document.getElementById("mainContent");
      contentElement.replaceWith(newContent);
    }
    httpRequest.responseType = "document";
    httpRequest.open("GET", newUrl);
    httpRequest.send();
  };
  