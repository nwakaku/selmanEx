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
  
        // Pass the subtitle array as a paragraph to popup.html
        passSubtitleToPopup(subtitleState.subtitles);
        console.log(subtitleState.subtitles)
      }
    }
  });
  
  // Pass the subtitle text to popup.html
  async function passSubtitleToPopup(subtitleText) {
    // Get the subtitle text element in popup.html
    const subtitleTextElement = document.getElementById('subtitle-text');
  
    // Join the subtitles into a paragraph with punctuation
    const paragraph = subtitleText.join(' ') + '.';
  
    // Filter, fill missing words, and punctuate the paragraph using ChatGPT API
    const filteredParagraph = await generateFilteredParagraph(paragraph);
  
    // Set the subtitle paragraph
    subtitleTextElement.textContent = filteredParagraph;
  }
  
  // Function to filter, fill missing words, and punctuate the paragraph using ChatGPT API
  async function generateFilteredParagraph(paragraph) {
    const apiKey = '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'; // Replace with your ChatGPT API key
    const endpoint = 'https://api.openai.com/v1/chat/completions';
  
    // Prepare the request payload
    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'The input passed here is a continuous subtitle from a video we are currently watching. Fill in missing words and punctuate the paragraph. Update the sentences based on the last words, but do not change the words. Do not complain either.' },
        { role: 'user', content: paragraph },
      ],
      max_tokens: 100,
      temperature: 0.7,
      n: 1,
      stop: '\n',
    };
  
    // Make the API request to ChatGPT API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
  
    // Parse the response
    const data = await response.json();
    const generatedSentence = data.choices[0].message.content;
  
    return generatedSentence;
  }
  