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