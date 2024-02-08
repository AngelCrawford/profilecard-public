// Function to add an event listener
function addEventListener(selector, event, callback) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener(event, callback);
  }
}

// Improved function to add an event listener
function addEventListenerImproved(selector, event, callback) {
  if (selector === window) {
    window.addEventListener(event, callback);
  } else {
    var elements = document.querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener(event, callback);
    }
  }
}

// Improved event binding
document.addEventListener('DOMContentLoaded', function() {
  addEventListenerImproved(window, "scroll", onScroll); // Bind scroll to window
  addEventListenerImproved(window, "load", onScroll); // Ensure onScroll runs after page load
  topScroll(); // Bind the click event listener to the back-to-top button
});

// Bind clicks für Spotify Modal
addEventListener("#overlay-img", "click", handleRemoveImgClick);
addEventListener("#accept", "click", handleAcceptClick);
addEventListener("#abort", "click", handleAbortClick);
addEventListener("body", "click", handleBodyClick);
// Check for existing cookie and remove overlay if present
if (getCookie("spotifyWidget")) {
  removeOverlay();
}

createPie(".pieID.legend", ".pieID.pie");

// Function to remove an event listener
function removeEventListener(selector, event, callback) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++) {
      elements[i].removeEventListener(event, callback);
  }
};

// Back to Top Scroll Button
function onScroll() {
  // Check the page scroll or element scroll based on your layout
  var scrollPosition = window.pageYOffset || document.getElementById('mainContent').scrollTop;
  // Show or hide back-to-top button
  if (scrollPosition >= 300) {
    document.getElementById('back-to-top-button').classList.add('show');
  } else {
    document.getElementById('back-to-top-button').classList.remove('show');
  }
}
// Scroll to the top of the page
function topScroll() {
  document.getElementById('back-to-top-button').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Spotify Modal Functions
function handleRemoveImgClick() {
  document.getElementById("spotifyModal").style.display = "block";
};
function handleAcceptClick() {
  document.getElementById("spotifyModal").style.display = "none";
  removeOverlay();
  setCookie("spotifyWidget", "true", 13);
};
function handleAbortClick() {
  document.getElementById("spotifyModal").style.display = "none";
};
function handleBodyClick(event) {
  // Function to handle click anywhere outside the modal
  if (event.target == document.getElementById("spotifyModal")) {
      document.getElementById("spotifyModal").style.display = "none";
  }
}

// Remove Spotify Overlay and if smaller screen size place with smaller Spotify and/or Overlay image
function removeOverlay() {
  var overlayImg = document.querySelector('img#overlay-img');
  if (overlayImg !== null) {
    overlayImg.remove();
  }

  var removeImg = document.getElementById('remove-img');
  if (removeImg !== null) {
    if (window.innerWidth > 800 && window.innerWidth < 868) {
      removeImg.innerHTML =
        '<iframe src="https://open.spotify.com/embed/playlist/520act29dQq3SDNilMbpfd" width="80" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
    } else if (window.innerWidth > 388) {
      removeImg.innerHTML =
        '<iframe src="https://open.spotify.com/embed/playlist/520act29dQq3SDNilMbpfd" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
    } else {
      removeImg.innerHTML =
        '<iframe src="https://open.spotify.com/embed/playlist/520act29dQq3SDNilMbpfd" width="80" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
    }
  }
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
  var pie = document.querySelector(pieElement);
  var slice = document.createElement("div");
  slice.className = "slice " + sliceID;
  slice.innerHTML = "<span></span>";
  pie.appendChild(slice);

  offset = offset - 1;
  var sizeRotation = -179 + sliceSize;
  slice.style.transform = "rotate(" + offset + "deg) translate3d(0,0,0)";
  slice.querySelector("span").style.transform = "rotate(" + sizeRotation + "deg) translate3d(0,0,0)";
  slice.querySelector("span").style.backgroundColor = color;
}
function iterateSlices(sliceSize, pieElement, offset, dataCount, sliceCount, color) {
  var sliceID = "s" + dataCount + "-" + sliceCount;
  var maxSize = 179;
  if (sliceSize <= maxSize) {
    addSlice(sliceSize, pieElement, offset, sliceID, color);
  } else {
    addSlice(maxSize, pieElement, offset, sliceID, color);
    iterateSlices(sliceSize - maxSize, pieElement, offset + maxSize, dataCount, sliceCount + 1, color);
  }
}
function createPie(dataElement, pieElement) {
  var listData = [];
  var spans = document.querySelectorAll(dataElement + " span");
  spans.forEach(function(span) {
    listData.push(Number(span.innerHTML));
  });

  var listTotal = listData.reduce(function(acc, val) {
    return acc + val;
  }, 0);

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

  listData.forEach(function(data, i) {
    var size = sliceSize(data, listTotal);
    iterateSlices(size, pieElement, offset, i, 0, color[i]);
    var listItem = document.querySelector(dataElement + " li:nth-child(" + (i + 1) + ")");
    listItem.style.borderColor = color[i];
    offset += size;
  });
}