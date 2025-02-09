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
    removeImg.innerHTML =
      '<iframe src="https://open.spotify.com/embed/playlist/520act29dQq3SDNilMbpfd?utm_source=generator&theme=0" width="300" height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
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


// ********************************************* EVENTS *********************************************

// X-MAS
var dateObject = new Date();
var month = dateObject.getMonth() + 1;
var day = dateObject.getDate();
var nowDate = dateObject.getFullYear() + "-" + (month < 10 ? '0' : '') + month + "-" + (day < 10 ? '0' : '') + day;

var xmasStart = dateObject.getFullYear() + "-12-01";
var xmasEnd = dateObject.getFullYear() + "-12-27";
// var xmasStart = dateObject.getFullYear() + "-02-01";
// var xmasEnd = dateObject.getFullYear() + "-02-27";
if (nowDate >= xmasStart && nowDate <= xmasEnd) {
    document.getElementById("santahat").style.display = "block";
} else {
    document.getElementById("santahat").style.display = "none";
}

// HALLOWEEN
var halloweenStart = dateObject.getFullYear() + "-10-07";
var halloweenEnd = dateObject.getFullYear() + "-10-31";
// var halloweenStart = dateObject.getFullYear() + "-02-07";
// var halloweenEnd = dateObject.getFullYear() + "-02-31";
if (nowDate >= halloweenStart && nowDate <= halloweenEnd) {
    document.getElementById("ghosty").style.display = "block";
    document.getElementById("container-pumpkin").style.display = "flex";
} else {
    document.getElementById("ghosty").style.display = "none";
    document.getElementById("container-pumpkin").style.display = "none";
}

// SNOW FALLING
var winterStartOldYear = dateObject.getFullYear() + "-12-21";
var winterEndOldYear = dateObject.getFullYear() + "-12-31";
var winterStartNewYear = dateObject.getFullYear() + "-01-01";
var winterEndNewYear = dateObject.getFullYear() + "-03-20";
var nowDate = dateObject.getFullYear() + "-" + (month < 10 ? '0' : '') + month + "-" + (day < 10 ? '0' : '') + day;

if ( (nowDate >= winterStartOldYear && nowDate <= winterEndOldYear) || (nowDate >= winterStartNewYear && nowDate <= winterEndNewYear) ) {
  document.addEventListener("DOMContentLoaded", () => {
    const snowContainer = document.querySelector(".snow-container");
    const snowflakeCount = 100; // Maximum number of snowflakes
    const snowfallTime = 10 * 1000; // Stop creating new snowflakes after 10s
    let snowflakes = [];
  
    function createSnowflake() {
        let snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");
  
        // Random properties
        let size = Math.random() * 6 + 2; // 2px to 8px
        let leftPosition = Math.random() * 100; // 0% to 100%
        let fallDuration = Math.random() * 5 + 3; // 3s to 8s
        let delay = Math.random() * 5; // 0s to 5s
  
        // Apply styles
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.left = `${leftPosition}%`;
        snowflake.style.opacity = Math.random();
        snowflake.style.animationDuration = `${fallDuration}s`;
        snowflake.style.animationDelay = `${delay}s`;
  
        snowflakes.push(snowflake);
        snowContainer.appendChild(snowflake);
  
        // Remove snowflake from DOM after it finishes falling (prevents memory leaks)
        setTimeout(() => {
            snowflake.remove();
        }, (fallDuration + delay) * 1000);
    }
  
    // Generate snowflakes continuously
    let snowInterval = setInterval(() => {
        if (snowflakes.length < snowflakeCount) {
            createSnowflake();
        }
    }, 200); // New snowflake every 200ms
  
    // Stop snowfall after X seconds (no new flakes will be added, but existing ones finish naturally)
    setTimeout(() => {
        clearInterval(snowInterval); // Stop adding new snowflakes
    }, snowfallTime);
  });
}

// Firework loads inanother file "firework.js"


// **************************************************************************************************
// Function to remove an event listener
function removeEventListener(selector, event, callback) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++) {
      elements[i].removeEventListener(event, callback);
  }
};