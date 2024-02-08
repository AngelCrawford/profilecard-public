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

  if (getCookie("spotifyWidget")) {
    removeOverlay();
  };

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

    $("#remove-img").bind("click", function() {
      $("#spotifyModal").css("display", "block");
    });
    $("#accept").bind("click", function() {
      $("#spotifyModal").css("display", "none");
      removeOverlay();
      setCookie("spotifyWidget", "true", 13);
    });
    $("#abort").bind("click", function() {
      $("#spotifyModal").css("display", "none");
    });
    // When the user clicks anywhere outside of the modal, close it
    $("body").bind("click", function(event) {
      if (event.target == $("#spotifyModal").get(0) ) {
        $("#spotifyModal").css("display", "none");
      }
    });
    if (getCookie("spotifyWidget")) {
      removeOverlay();
    };
    createPie(".pieID.legend", ".pieID.pie");

    // Back to Top Scroll Button
    $('#mainContent').on('scroll load', onScroll);
    $('#mainContent').on('touchmove', onScrollTouch); // for mobile
    topScroll();

  }
  httpRequest.responseType = "document";
  httpRequest.open("GET", newUrl);
  httpRequest.send();
};

// Show Button
function onScroll() {
  if ($('#mainContent').scrollTop() >= 300 ) {
    $('#back-to-top-button').addClass('show');
  } else {
    $('#back-to-top-button').removeClass('show');
  }
};
// Show Button on Mobile "Touch" scroll
function onScrollTouch() {
  // console.log('test');
  if ($(document).scrollTop() >= 300 ) {
    $('#back-to-top-button').addClass('show');
  } else {
    $('#back-to-top-button').removeClass('show');
  }
}
// Scroll to the top of the page
function topScroll() {
  $("#back-to-top-button").on('click touchend', function(e) {
    e.preventDefault();
    var currentURL = window.location.href;
    var title = document.title;
    window.location.href = currentURL + '#back-to-top';
    window.history.replaceState( {} , title, currentURL );
    return false;
  });
}

// Cookie
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
};
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
};
function eraseCookie(name) {
  document.cookie = name+'=; Max-Age=-99999999;';
};

// Pie Chart
function sliceSize(dataNum, dataTotal) {
  return (dataNum / dataTotal) * 360;
}
function addSlice(sliceSize, pieElement, offset, sliceID, color) {
  $(pieElement).append("<div class='slice "+sliceID+"'><span></span></div>");
  var offset = offset - 1;
  var sizeRotation = -179 + sliceSize;
  $("."+sliceID).css({
    "transform": "rotate("+offset+"deg) translate3d(0,0,0)"
  });
  $("."+sliceID+" span").css({
    "transform"       : "rotate("+sizeRotation+"deg) translate3d(0,0,0)",
    "background-color": color
  });
}
function iterateSlices(sliceSize, pieElement, offset, dataCount, sliceCount, color) {
  var sliceID = "s"+dataCount+"-"+sliceCount;
  var maxSize = 179;
  if(sliceSize<=maxSize) {
    addSlice(sliceSize, pieElement, offset, sliceID, color);
  } else {
    addSlice(maxSize, pieElement, offset, sliceID, color);
    iterateSlices(sliceSize-maxSize, pieElement, offset+maxSize, dataCount, sliceCount+1, color);
  }
}
function createPie(dataElement, pieElement) {
  var listData = [];
  $(dataElement+" span").each(function() {
    listData.push(Number($(this).html()));
  });
  var listTotal = 0;
  for(var i=0; i<listData.length; i++) {
    listTotal += listData[i];
  }
  var offset = 0;
  var color = [
    "#3f3f3f",
    "#717171",
    "#b6b6b6",
    "#ffffff",
    "#137457",
    "#0c4836",
    "#17a2b8",
    "#0f6674",
    "#296ACC",
  ];
  for(var i=0; i<listData.length; i++) {
    var size = sliceSize(listData[i], listTotal);
    iterateSlices(size, pieElement, offset, i, 0, color[i]);
    $(dataElement+" li:nth-child("+(i+1)+")").css("border-color", color[i]);
    offset += size;
  }
}