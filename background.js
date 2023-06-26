// Listener to receive messages from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.subtitles) {
    const subtitles = request.subtitles;

    // Pass the subtitles to the popup script
    chrome.runtime.sendMessage({ subtitles: subtitles });
  }
});

// Listener for tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Check if the updated tab is a YouTube URL
  if (tab.url && tab.url.includes('youtube.com/watch')) {
    // Inject content script into the updated tab
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['contentScript.js'],
    });
  }
});
