import { sendError } from "./index.js";
import { sceneAdded } from "./scene.js";

document.addEventListener('DOMContentLoaded', () => {
  // Popups 📌
  const popupSection = document.getElementById('section-Popup');
  const closeButton = document.querySelectorAll('[data-close-button]');

  // Check 01
  
  function openPopup(menu) {
    menu = document.querySelector(`.Popup-${menu}`);
    menu.classList.add('visible');
    menu.style.display = 'flex';
    popupSection.style.display = 'flex';
    setTimeout(() => {
      popupSection.style.opacity = 1;
    }, 100);
  }
  function closePopup() {
    document.querySelectorAll(".PopupMenu").forEach((menu) => {
      popupSection.style.opacity = 0;
      setTimeout(() => {
        popupSection.style.display = "none";
        menu.style.display = "none";
        menu.classList.remove('visible')
      }, 300);
    });
  }
  
  closeButton.forEach((button) => {button.addEventListener("click", closePopup);})
  window.addEventListener("click", (event) => {
    if (event.target === popupSection) {
      closePopup();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePopup();
    }
  });
  document.getElementById("updateLogButton").addEventListener("click", () => {
    openPopup("UpdateLog");
  });
  
  // Version check 📌
  const dripzelsVersion = document.head.dataset.version;

  document.querySelectorAll('[data-version-display]').forEach(function(element) {
      element.innerHTML = dripzelsVersion;
  });

  if (localStorage.getItem('clientVersion') == null) { // First visit
    localStorage.setItem('clientVersion', dripzelsVersion);
  } else if(localStorage.getItem('clientVersion') !== dripzelsVersion){ // Returning user
    localStorage.setItem('clientVersion', `${dripzelsVersion}`)
    openPopup('UpdateLog')
  }  
})


// Cursor changer 📌
document.addEventListener('mousedown', (e) => {
  const tgt = e.target;
  const cursor = window.getComputedStyle(tgt)['cursor'];
  if (cursor === 'grab') {
    if(e.button == 0){
      document.querySelector('canvas').style.cursor = 'grabbing';
    } else if (e.button == 1){
      document.querySelector('canvas').style.cursor = 'zoom-in';
    }
  }
});


document.addEventListener('mouseup', () => {
  if(sceneAdded == true){
    document.querySelector('canvas').style.cursor = 'grab';
  }
});


// Links 📌
document.addEventListener('DOMContentLoaded', function () {
    const linkElements = document.querySelectorAll('.webLink');

    linkElements.forEach(linkElement => {
        const url = linkElement.getAttribute('href');
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${url}&size=64`;

        // Create an image element for the favicon
        const faviconImg = document.createElement('img');
        faviconImg.src = faviconUrl;
        faviconImg.alt = 'Favicon';

        // Prepend the favicon image to the link element
        linkElement.insertBefore(faviconImg, linkElement.firstChild);
    });
});
