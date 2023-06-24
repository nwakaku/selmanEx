// content.js

(function () {
  function turnOnSubtitles() {
    const videoPlayer = document.querySelector('.video-stream');
    if (!videoPlayer) {
      return;
    }

    const subtitlesButton = document.querySelector('.ytp-subtitles-button');
    if (!subtitlesButton) {
      return;
    }

    if (!subtitlesButton.getAttribute('aria-pressed')) {
      subtitlesButton.click();
    }
  }

  function observerCallback(mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        if (mutation.target.classList.contains('ytp-caption-segment')) {
          const subtitles = mutation.target.innerText.trim();
          chrome.runtime.sendMessage({ subtitles: subtitles });
        }
      }
    }
  }

  const observer = new MutationObserver(observerCallback);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  turnOnSubtitles();
})();