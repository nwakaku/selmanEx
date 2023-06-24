// Initialize the subtitle state
let subtitleState = {
    subtitles: [],
  };
  
  // Get subtitle text from the background script message
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.subtitles) {
      const subtitleText = request.subtitles;
  
      // Split the subtitle text into words
      const words = subtitleText.split(' ');
  
      // Filter out duplicate words
      const uniqueWords = words.filter((word) => !subtitleState.subtitles.includes(word));
  
      // Check if there are any new words
      if (uniqueWords.length > 0) {
        // Update the subtitle state
        subtitleState = {
          subtitles: [...subtitleState.subtitles, ...uniqueWords],
        };
  
        // Display the subtitle state in the popup
        displaySubtitles(subtitleState.subtitles);
  
        // Speak the subtitle words
        speakSubtitle(uniqueWords);
      }
    }
  });
  
  // Display the subtitle state in the popup
  function displaySubtitles(subtitles) {
    const subtitleListElement = document.getElementById('subtitle-list');
    subtitleListElement.innerHTML = '';
  
    subtitles.forEach((subtitle) => {
      const subtitleItem = document.createElement('li');
      subtitleItem.textContent = subtitle;
      subtitleListElement.appendChild(subtitleItem);
    });
  }
  
  // Speak the subtitle words using speech synthesis
  function speakSubtitle(words) {
    let currentIndex = 0;
  
    function speakNextWord() {
      if (currentIndex < words.length) {
        const word = words[currentIndex];
        const utterance = new SpeechSynthesisUtterance(word);
        speechSynthesis.speak(utterance);
  
        currentIndex++;
        setTimeout(speakNextWord, 700); // Delay between each word (adjust as needed)
      }
    }
  
    speakNextWord();
  }
  