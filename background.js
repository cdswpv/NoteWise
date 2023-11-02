import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  dangerouslyAllowBrowser: true,
});

chrome.runtime.onInstalled.addListener(() => {
  var contextSelection = {
      "id": "text", 
      "title": "Summarize highlighted text with NoteWise",
      "contexts": ["selection"]
  }
  var contextImage = {
    "id": "image", 
    "title": "Summarize image with NoteWise",
    "contexts": ["image"]
}
  chrome.contextMenus.create(contextSelection);
  chrome.contextMenus.create(contextImage);


  chrome.contextMenus.onClicked.addListener(function(info, tab){
    //Add code to summarize the info variable, open the content.js file up, and display the summarization

    //Displays the text selected 
    console.log(info)
    if (info.menuItemId == "text")
    {
      console.log("Selected Text: " + info.selectionText)

      //Generates the summary and places it into the console log
      generateSummary(info.selectionText)
    }
    else if (info.menuItemId == "image")
    {
      console.log("Image URL: " + info.srcUrl)

      chrome.tabs.create({url:info.srcUrl})
    }
  });
});

async function generateSummary(text) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: text },
      ],
      max_tokens: 2000,
    });

    console.log("initial gpt response: " + response)

    if (response.hasOwnProperty('choices') && response.choices.length > 0) {
      const summary = response.choices[0].message.content;
      console.log("summary: " + summary);
    } 
    else if (response.hasOwnProperty('error')) {
      console.error('Error from OpenAI API:', response.error.message);
    }
  } catch (error) {
    console.error('Error generating summary: ', error);
  }
}
