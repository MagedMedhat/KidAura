// reader.js - Updated with proper speech control

let currentPageIndex = 0;
let currentStory = storyData;
let currentSpeech = null; // Track current speech

document.addEventListener("DOMContentLoaded", function () {
  console.log("📖 Story loaded:", currentStory.title);
  renderPage();
});

function renderPage() {
  // STOP ANY CURRENT SPEECH
  stopSpeech();

  const pageData = currentStory.content.pages[currentPageIndex];
  const totalPages = currentStory.content.pages.length;

  // Update page content
  const storyImage = document.getElementById("story-image");
  const storyText = document.getElementById("story-text");
  const pageNumber = document.getElementById("page-number");

  // Set image with error handling
  storyImage.src = pageData.pageImgUrl;
  storyImage.alt = `Page ${currentPageIndex + 1} - ${currentStory.title}`;

  // Handle image loading errors
  storyImage.onerror = function () {
    console.error("❌ Image failed to load:", pageData.pageImgUrl);
    const colors = ["1E90FF", "2ED573", "FFA502", "FF4757", "9D00FF"];
    const color = colors[currentPageIndex % colors.length];
    storyImage.src = `https://placehold.co/600x400/${color}/white?text=Page+${
      currentPageIndex + 1
    }`;
  };

  storyText.textContent = pageData.pageContent;
  pageNumber.textContent = `Page ${currentPageIndex + 1} of ${totalPages}`;

  // Update button states
  updateButtons(totalPages);
}

function updateButtons(totalPages) {
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");

  // Previous button - hide on first page
  btnPrev.style.visibility = currentPageIndex === 0 ? "hidden" : "visible";
  btnPrev.disabled = currentPageIndex === 0;

  // Next button - show Finish on last page
  if (currentPageIndex === totalPages - 1) {
    btnNext.textContent = "Finish ✅";
    btnNext.style.backgroundColor = "#FFD700";
    btnNext.style.color = "black";
  } else {
    btnNext.textContent = "Next ➡";
    btnNext.style.backgroundColor = "#00D166";
    btnNext.style.color = "white";
  }
}

function nextPage() {
  // STOP SPEECH BEFORE CHANGING PAGE
  stopSpeech();

  if (currentPageIndex < currentStory.content.pages.length - 1) {
    currentPageIndex++;
    renderPage();
  } else {
    // STOP SPEECH BEFORE LEAVING
    stopSpeech();
    console.log("🎉 Story finished, going to library");
    window.location.href = "/library";
  }
}

function prevPage() {
  // STOP SPEECH BEFORE CHANGING PAGE
  stopSpeech();

  if (currentPageIndex > 0) {
    currentPageIndex--;
    renderPage();
  }
}

function speakText() {
  // If already speaking, stop it
  if (window.speechSynthesis.speaking) {
    stopSpeech();
    return;
  }

  if ("speechSynthesis" in window) {
    const textToRead = currentStory.content.pages[currentPageIndex].pageContent;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToRead);

    // Store reference to current speech
    currentSpeech = utterance;

    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    // Add event listeners
    utterance.onstart = function () {
      console.log("🔊 Started reading page", currentPageIndex + 1);
      updateSpeakButton(true);
    };

    utterance.onend = function () {
      console.log("🔇 Finished reading page", currentPageIndex + 1);
      currentSpeech = null;
      updateSpeakButton(false);
    };

    utterance.onerror = function (event) {
      console.error("❌ Speech error:", event);
      currentSpeech = null;
      updateSpeakButton(false);
    };

    window.speechSynthesis.speak(utterance);
  } else {
    alert("Text-to-speech not supported in your browser");
  }
}

function stopSpeech() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    currentSpeech = null;
    updateSpeakButton(false);
    console.log("🔇 Speech stopped");
  }
}

function updateSpeakButton(isSpeaking) {
  const speakButton = document.querySelector(".btn-speak");
  if (speakButton) {
    if (isSpeaking) {
      speakButton.textContent = "⏸️ Stop Reading";
      speakButton.style.backgroundColor = "#FF4757";
      speakButton.onclick = stopSpeech;
    } else {
      speakButton.textContent = "🔊 Read Page";
      speakButton.style.backgroundColor = "";
      speakButton.onclick = speakText;
    }
  }
}

// Stop speech when leaving the page
window.addEventListener("beforeunload", function () {
  stopSpeech();
});

// Stop speech when page is hidden (switching tabs)
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    stopSpeech();
  }
});

// Make functions available globally
window.nextPage = nextPage;
window.prevPage = prevPage;
window.speakText = speakText;
window.stopSpeech = stopSpeech;
