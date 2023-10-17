chrome.runtime.onInstalled.addListener(() => {
  var contextMenuItem = {
      "id": "summary", 
      "title": "Summarize highlighted text with NoteWise",
      "contexts": ["selection"]
  }

  chrome.contextMenus.create(contextMenuItem);

  chrome.contextMenus.onClicked.addListener(function(info, tab){
    //Add code to summarize the info variable, open the content.js file up, and display the summarization
    console.log("Placeholder for summarization");
  });
});

  
/*


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "text") {
    const paragraphArray = message.textContent;
    
    try {
      const response = await fetch(chrome.runtime.getURL('config.json'));
      const config = await response.json();
      const apiKey = config.apiKey;

      const apiResponse = await fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: paragraphArray.join("\n"),
          max_tokens: 40000, 
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! Status: ${apiResponse.status}`);
      }

      const apiData = await apiResponse.json();
      const apiSummary = apiData.choices[0].text;

      // Send the API summary back to content.js
      chrome.runtime.sendMessage({ type: "summary", summary: apiSummary });
    } catch (error) {
      console.log('Error:', error);
      const errorMessage = 'Error occurred during summarization.';
      
      // Send an error message back to content.js
      chrome.runtime.sendMessage({ type: "summary", summary: errorMessage });
    }
  }
});
*/