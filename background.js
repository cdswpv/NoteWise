import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  dangerouslyAllowBrowser: true,
});


//#region ContextMenus

chrome.runtime.onInstalled.addListener(() => {
  const contextSelection = {
      "id": "text",
      "title": "Summarize highlighted text with NoteWise",
      "contexts": ["selection"]
  };

  const contextImage = {
      "id": "image",
      "title": "Summarize image with NoteWise",
      "contexts": ["image"]
  };

  chrome.contextMenus.create(contextSelection);
  chrome.contextMenus.create(contextImage);

  chrome.contextMenus.onClicked.addListener((info, tab) => {
      console.log("Context menu clicked");

      if (info.menuItemId === "text") {
          console.log("Selected Text: " + info.selectionText);
          generateSummary(info.selectionText);
      } else if (info.menuItemId === "image") {
          console.log("Image URL: " + info.srcUrl);
          generateImageSummary(info.srcUrl);
      }
      chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: createOverlay,
      });
  });
});

//#endregion

//#region Overlay Code
  function createOverlay() {
    overlayDiv = document.createElement('div');
    overlayDiv.id = 'customOverlay';
    overlayDiv.style.cssText = 'position: fixed; top: 0; left: 0; width: 600px; height: 300px; border: 2px solid #000; background-color: #222226; padding: 0; user-select: none; cursor: move; z-index: 999; overflow:auto';

    // Header
    header = document.createElement('div');
    header.style.cssText = 'background-color: #333; color: #FFF; padding: 10px; display: flex; align-items: center;';

    // Title in the header
    title = document.createElement('div');
    title.innerText = 'NoteWise Summarization';
    title.style.cssText = 'font-size: 16px; font-weight: bold; margin-right: 240px;';

    // Add a TTS button
    ttsButton = document.createElement('button');
    ttsButton.innerText = 'TTS';
    ttsButton.style.cssText = 'padding: 5px; cursor: pointer; background-color: #222226; color: white; margin-left: 5px;';
    ttsButton.style.marginRight = '0'
    ttsButton.addEventListener('click', () => {
        console.log('TTS button clicked');
        const textSection = document.getElementById('textSection');
        if (textSection)
        {
          console.log("text section exists")
          if (textSection.innerText != "Waiting for response...")
          {
            const text = textSection.innerText;
            console.log("sending to generate audio")
            generateSpeech(text)
          }
        }
    });

    // Add a Copy button
    copyButton = document.createElement('button');
    copyButton.innerText = 'Copy';
    copyButton.style.cssText = 'padding: 5px; cursor: pointer; background-color: #222226; color: white; margin-left: 5px;';
    copyButton.addEventListener('click', () => {
        const textSection = document.getElementById('textSection');
        if (textSection) {
            const textToCopy = textSection.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                console.log('Text copied to clipboard');
            }).catch((err) => {
                console.error('Unable to copy text to clipboard', err);
            });
        }
    });

    // Add a close button
    closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.cssText = 'padding: 5px; cursor: pointer; background-color: #222226; color: white; margin-left: 5px;';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlayDiv);
    });
    // Section area for text
    textSection = document.createElement('div');
    textSection.id = 'textSection';
    textSection.innerText = 'Waiting for response...';
    textSection.style.cssText = 'padding: 10px; color: white;';

    overlayDiv.appendChild(header);
    header.appendChild(title);
    header.appendChild(ttsButton);
    header.appendChild(copyButton);
    header.appendChild(closeButton);
    overlayDiv.appendChild(textSection);

    document.body.appendChild(overlayDiv);

    makeOverlayDraggable(overlayDiv);
} 
  function makeOverlayDraggable(overlayDiv) {
    let isDragging = false;
    let offsetX, offsetY;

    overlayDiv.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - overlayDiv.getBoundingClientRect().left;
        offsetY = e.clientY - overlayDiv.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            overlayDiv.style.left = `${x}px`;
            overlayDiv.style.top = `${y}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}
function UpdateOverlayText(newText) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];
      
      chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          function: function(newText) {
              let textSection = document.getElementById('textSection');
              if (textSection) {
                  textSection.innerText = newText;
              } else {
                  console.error('Text section not found');
              }
          },
          args: [newText]
      });
  });
}
//#endregion

//#region Login Code

let user_sign_in = false;

//Deleted Login Code

//#endregion

//#region OpenAI API Calls
async function generateSummary(text) {
  console.log("generating summmary")
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        { role: 'system', content: 'You are tasked to summarize the text given as concisely as possible without omitting important details.' },
        { role: 'user', content: text },
      ],
      max_tokens: 2000,
    });

    console.log("initial gpt response: " + response)

    if (response.hasOwnProperty('choices') && response.choices.length > 0) {
      const summary = response.choices[0].message.content;
      UpdateOverlayText(summary)
      console.log("summary: " + summary);
    } 
    else if (response.hasOwnProperty('error')) {
      console.error('Error from OpenAI API:', response.error.message);
    }
  } catch (error) {
    console.error('Error generating summary: ', error);
  }
}


async function generateImageSummary(ctx) {
  try {
    const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "What’s in this image? If the image is a graph please explain every aspect of the graph and summarize the findings." },
          {
            type: "image_url",
            image_url: {
              "url": ctx,
              "detail": "low"
            },
          },
        ],
      },
    ],
    max_tokens: 2000,
  });
  console.log("initial gpt response: " + response)

    if (response.hasOwnProperty('choices') && response.choices.length > 0) {
      const summary = response.choices[0].message.content;
      UpdateOverlayText(summary)
      console.log("summary: " + summary);
    } 
    else if (response.hasOwnProperty('error')) {
      console.error('Error from OpenAI API:', response.error.message);
    }
  } catch (error) {
    console.error('Error generating summary: ', error);
  }
}
async function generateSpeech(text) {
  console.log("in gen speech function")
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });
    if (response.ok) {
      console.log("generated ok tts response");
      const audioUrl = URL.createObjectURL(await response.blob());
      playAudio(audioUrl);
    } else {
      console.error('Error from OpenAI API:', response.statusText);
    }
  } catch (error) {
    console.error('Error generating speech:', error);
  }
}


function playAudio(url) {
  console.log("attempting to play audio");
  const audio = new Audio(url);
  audio.play().catch(e => console.error('Error playing audio:', e));
  console.log("Audio played");
}
//#endregion