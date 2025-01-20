// Function to add an event listener
function addEventListener(selector, event, callback) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener(event, callback);
  }
};


// ***************************************** RELOAD UMAMI *******************************************
function loadUmamiScript() {
  // Check if the Umami script is already loaded to avoid duplicates
  const existingScript = document.querySelector('script[src*="umami"]');
  if (!existingScript) {
    const umamiScript = document.createElement('script');
    umamiScript.src = 'https://eu.umami.is/script.js'; // Replace with your Umami script URL
    umamiScript.setAttribute('data-website-id', '3c41a204-0ff3-4495-ba84-cc6e7daddff2'); // Set your website's unique ID
    umamiScript.async = true;
    umamiScript.defer = true;
    document.head.appendChild(umamiScript);
  }
}

// ************************************** SLIDER MOBILE TOUCH ***************************************
if (typeof isSliderEventAttached === 'undefined') {
  // Slider stops working after reload Scripts 
  var isSliderEventAttached = false; // 'var' allows for redeclaration but be mindful of scoping
}
reinitializeSlider();

function reinitializeSlider() {
  // Reattach event listeners for the slider here
  if (!isSliderEventAttached) {
    addEventListener("#image-slider", "touchstart", touchSlider);
    isSliderEventAttached = true;
  }
}

// Listen to input event on all inputs within .s-wrap
document.querySelectorAll('.s-wrap > input').forEach(input => {
  input.addEventListener('input', function() {
    var index = document.querySelector('.s-wrap > input:checked');
  });
});

// Handle touchstart event on #image-slider
function touchSlider(event) {
  // Get the count of all inputs within .s-wrap
  const slidesCount = document.querySelectorAll('.s-wrap > input').length;
  const xClick = event.touches[0].pageX;

  this.addEventListener('touchmove', function(event) {
    const xMove = event.touches[0].pageX;
    const sensitivityInPx = 20;

    if (Math.floor(xClick - xMove) > sensitivityInPx ) {
      var index = document.querySelector('input:checked');
      var slider = parseInt(index.id.replace('s-', '')) + 1;

      if (slider == (slidesCount + 1)) {
        slider = slidesCount;
      }

      document.querySelector('.s-wrap #' + index.id + ':checked ~ .s-content').style.transform = `translateX(calc(-(100% / ${slidesCount}) * (${slider} - 1)))`;
      document.getElementById('s-' + slider).checked = true;
      this.removeEventListener('touchmove', arguments.callee);

    } else if (Math.floor(xClick - xMove) < -sensitivityInPx) {
      var index = document.querySelector('input:checked');
      var slider = parseInt(index.id.replace('s-', '')) - 1;

      if (slider == 0) {
        slider = 1;
      }

      document.querySelector('.s-wrap #' + index.id + ':checked ~ .s-content').style.transform = `translateX(calc(-(100% / ${slidesCount}) * (${slider} - 1)))`;
      document.getElementById('s-' + slider).checked = true;
      this.removeEventListener('touchmove', arguments.callee);
    }
  });
};

// ************************************** SCROLL TO TOP BUTTON **************************************
addEventListener("#mainContent", "scroll", scrollFunction);
function scrollFunction() {
  var myButton = document.getElementById("back-to-top-button");

  if (document.getElementById("mainContent").scrollTop >= 400 || document.body.scrollTop >= 400 || document.documentElement.scrollTop >= 400 ) {
    myButton.classList.remove("hidden");
  } else {
    myButton.classList.add("hidden");
  }
};

// ********************************************* SPOTIFY ********************************************
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
};

// Remove Spotify Overlay and if smaller screen replace with smaller Spotify Overlay
function removeOverlay() {
  var overlayImg = document.querySelector('img#overlay-img');
  if (overlayImg !== null) {
    overlayImg.remove();
  }

  var removeImg = document.getElementById('remove-img');
  if (removeImg !== null) {
    if (window.innerWidth > 800 && window.innerWidth < 868) {
      removeImg.innerHTML =
        '<iframe src="https://open.spotify.com/embed/playlist/520act29dQq3SDNilMbpfd?utm_source=generator&theme=0" width="80" height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
    } else if (window.innerWidth > 388) {
      removeImg.innerHTML =
        '<iframe src="https://open.spotify.com/embed/playlist/520act29dQq3SDNilMbpfd?utm_source=generator&theme=0" width="300" height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
    } else {
      removeImg.innerHTML =
        '<iframe src="https://open.spotify.com/embed/playlist/520act29dQq3SDNilMbpfd?utm_source=generator&theme=0" width="80" height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
    }
  }
};

// Bind clicks für Spotify Modal
addEventListener("#overlay-img", "click", handleRemoveImgClick);
addEventListener("#accept", "click", handleAcceptClick);
addEventListener("#abort", "click", handleAbortClick);
addEventListener("body", "click", handleBodyClick);
// Check for existing cookie and remove overlay if present
if (getCookie("spotifyWidget")) {
  removeOverlay();
}

// ********************************************* COOKIE *********************************************
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

// **************************************************************************************************
// Function to remove an event listener
function removeEventListener(selector, event, callback) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++) {
      elements[i].removeEventListener(event, callback);
  }
};