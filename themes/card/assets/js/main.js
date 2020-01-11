$(document).ready(function () {
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
});

var btn = $('#back-to-top');
$(window).scroll(function() {
  if ($(window).scrollTop() > 100) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});
btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '100');
});

function loadPage(newUrl) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState !== XMLHttpRequest.DONE)
      return;
    // TODO: UI for this error
    var newDocument = httpRequest.responseXML;
    if (newDocument === null)
      return;
    // TODO: UI for this error
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
  }
  httpRequest.responseType = "document";
  httpRequest.open("GET", newUrl);
  httpRequest.send();
};

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
    "#10634b",
    "#17a2b8",
    "#0f6674",
  ];
  for(var i=0; i<listData.length; i++) {
    var size = sliceSize(listData[i], listTotal);
    iterateSlices(size, pieElement, offset, i, 0, color[i]);
    $(dataElement+" li:nth-child("+(i+1)+")").css("border-color", color[i]);
    offset += size;
  }
}
