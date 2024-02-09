// Function to add an event listener
function addEventListener(selector, event, callback) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener(event, callback);
  }
};

// *************************************** LOAD HUGO CONTENT ****************************************
 // Make links load asynchronously
document.body.addEventListener("click", function(event) {
  // Check if the clicked element is a link
  if (event.target.tagName !== "A")
    return;
  
  // History API needed to make sure back and forward still work
  if (!window.history)
    return;
  
  // External links should instead open in a new tab
  const newUrl = event.target.href;
  const domain = window.location.origin;
  
  if (typeof domain !== "string" || !newUrl.startsWith(domain)) {
    event.preventDefault(); // Prevent default link behavior
    window.open(newUrl, "_blank"); // Open in a new tab
  } else {
    event.preventDefault(); // Prevent default link behavior
    loadPage(newUrl); // Call your loadPage function
    window.history.pushState(null, "", newUrl); // Update the history
  }
});

// Handle the back and forward buttons
window.onpopstate = function(event) {
  loadPage(window.location.href);
};

function loadPage(newUrl) {
  fetch(newUrl)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.text();
    })
    .then(html => {
      const parser = new DOMParser();
      const newDocument = parser.parseFromString(html, "text/html");
      const newContent = newDocument.getElementById("mainContent");
      if (!newContent) return;

      document.title = newDocument.title;
      const contentElement = document.getElementById("mainContent");
      contentElement.replaceWith(newContent.cloneNode(true));

      // Now reload the scripts
      reloadScripts(reinitializeSlider);
    })
    .catch(e => console.error('Error loading the page: ', e));
}

function reloadScripts(callback) {
  const scripts = document.querySelectorAll('script[src]');
  let loadedScripts = 0;
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    newScript.src = oldScript.src;
    newScript.onload = () => {
      console.log(`${oldScript.src} reloaded successfully`);
      loadedScripts++;
      if (loadedScripts === scripts.length) {
        console.log('All scripts reloaded');
        if (typeof callback === 'function') {
          callback();
        }
      }
    };
    newScript.onerror = () => console.error(`Failed to reload ${oldScript.src}`);
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

// Slider stops working after reload Scripts 
function reinitializeSlider() {
  // Reattach event listeners for the slider here
  // addEventListener("#image-slider", "touchstart", touchSlider(event));
}


// ************************************** SLIDER MOBILE TOUCH ***************************************
// Listen to input event on all inputs within .s-wrap
document.querySelectorAll('.s-wrap > input').forEach(input => {
  input.addEventListener('input', function() {
    var index = document.querySelector('.s-wrap > input:checked');
  });
});
addEventListener("#image-slider", "touchstart", touchSlider);

// Handle touchstart event on #image-slider
function touchSlider(event) {
  // Get the count of all inputs within .s-wrap
  const slidesCount = document.querySelectorAll('.s-wrap > input').length;
  const xClick = event.touches[0].pageX;
  // BUG: Nach dem asynchronously reload der Seite, scheint xClick andere Werte zu haben
    // Enventuell ist event verändert? (event scheint leer zu sein nach dem reload!)
  // git commit -am "Working on the slider JS after reloading content asynchronously, see ToDo Tree in Visual Studio Code, #55"
  console.log(xClick);

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

// ******************************************** PIE CHART *******************************************
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
createPie(".pieID.legend", ".pieID.pie");

// **************************************************************************************************
// Function to remove an event listener
function removeEventListener(selector, event, callback) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++) {
      elements[i].removeEventListener(event, callback);
  }
};