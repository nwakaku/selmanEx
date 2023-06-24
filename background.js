// Listener to receive messages from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.subtitles) {
    const subtitles = request.subtitles;

    // Store the subtitles in Chrome Storage API
    chrome.storage.local.set({ translatedSubtitles: subtitles }, function () {
    });
  }
});

// Listener for tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Check if the updated tab is a YouTube URL
  if (tab.url && tab.url.includes('youtube.com/watch')) {
    // Retrieve the stored subtitles from Chrome Storage API
    chrome.storage.local.get('translatedSubtitles', function (result) {
      const subtitles = result.translatedSubtitles;

      // Pass the subtitles to the content script
      chrome.tabs.sendMessage(tabId, { translatedSubtitles: subtitles });
    });

    // Inject content script into the updated tab
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['contentScript.js'],
    });
  }
});
