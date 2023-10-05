chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "url") {
      const url = message.url;
      const apiKey = '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';
  
      try {
        const response = await fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            prompt: `Summarize the following URL: ${url}`,
            max_tokens: 50, // Adjust the max_tokens as needed
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        const summary = data.choices[0].text;
  
        chrome.tabs.sendMessage(sender.tab.id, { type: "summary", summary });
      } catch (error) {
        console.log('Error:', error);
      }
    }
  });