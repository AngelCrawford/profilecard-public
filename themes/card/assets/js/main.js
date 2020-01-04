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
