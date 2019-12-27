window.onload = function() {
  // Make links load asynchronously
  document.querySelector("body").addEventListener("click", function(event) {
    if (event.target.tagName !== "A" || event.target.getElementById("spotifyModal") )
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
}
window.onpopstate = function(event) {
  loadPage(window.location);
}

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
  }
  httpRequest.responseType = "document";
  httpRequest.open("GET", newUrl);
  httpRequest.send();
};
