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
          console.log("summarizing");
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
    overlayDiv.style.cssText = 'position: fixed; top: 0; left: 0; width: 600px; height: 300px; border: 2px solid #000; background-color: #FFF; padding: 0; user-select: none; cursor: move; z-index: 999; overflow:auto';

    // Header
    header = document.createElement('div');
    header.style.cssText = 'background-color: #333; color: #FFF; padding: 10px; display: flex; justify-content: space-between; align-items: center;';

    // Title in the header
    title = document.createElement('div');
    title.innerText = 'NoteWise Summarization';
    title.style.cssText = 'font-size: 16px; font-weight: bold;';

    // Add a TTS button
    ttsButton = document.createElement('button');
    ttsButton.innerText = 'TTS';
    ttsButton.style.cssText = 'padding: 5px; cursor: pointer;';
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
    copyButton.style.cssText = 'padding: 5px; cursor: pointer;';
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
    closeButton.style.cssText = 'padding: 5px; cursor: pointer;';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlayDiv);
    });
    // Section area for text
    textSection = document.createElement('div');
    textSection.id = 'textSection';
    textSection.innerText = 'Waiting for response...';
    textSection.style.cssText = 'padding: 10px;';

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

const login_API_KEY = "809053939553-6854kil5qm47qqc99a268u63hbcov074.apps.googleusercontent.com";
let user_sign_in = false;

chrome.identity.onSignInChanged.addListener(function (id, signedIn)
{
  if (signedIn) {
    user_signed_in = true;
} else {
    user_signed_in = false;
}
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'logout') {
    user_sign_in = false;

    chrome.identity.getAuthToken({interactive: false}, function(token)
    {
      if (token)
      {
        chrome.identity.removeCachedAuthToken({token: token}, function(){});
      }
    })
  }

  else if (request.message === 'get_access_token')
  {
    chrome.identity.getAuthToken({interactive: true}, function(auth_token)
    {
      console.log(auth_token);
    });
    sendResponse(true);
  }
  else if (request.message === 'get_profile')
  {
    chrome.identity.getAuthToken({accountStatus: 'ANY'}, function(user_info)
    {
      console.log(user_info);
    });
    sendResponse(true);
  }
  else if (request.message === 'get_contacts')
  {
    chrome.identity.getAuthToken({interactive: true}, function(token)
    {
      let fetch_url = `https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=${API_KEY}`;
      let fetch_options = {
        headers:
        {
          'Authorization': `Bearer ${token}`
        }
      }

      fetch(fetch_url, fetch_options)
        .then(res => res.json())
        .then(res => {
          if (res.memberCount)
          {
            const members = res.memberResourceNames;
            fetch_url = `https://people.googleapis.com/v1/people:batchGet?personFields=names&key=${API_KEY}`;

            members.forEach(member => {
              fetch_url += `&resourceNames=${encodeURIComponent(member)}`;
            });

            fetch(fetch_url, fetch_options)
              .then(res => res.json())
              .then(res => console.log(res));
          }
        });
    });
  }
  else if (request.message === 'create_contact')
  {
    chrome.identity.getAuthToken({interactive: true}, function(token)
    {
      let fetch_url = `https://people.googleapis.com/v1/people:createContact?key=${API_KEY}`;
      let fetch_options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'names': [
            {
              "givenName": "Johnny",
              "familyName": "Silver"
            }
          ]
        })
      }

      fetch(fetch_url, fetch_options)
        .then(res => res.json())
        .then(res => console.log(res));

    });
  }
  else if (request.message === 'delete_contact')
  {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      let fetch_url = `https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=${API_KEY}`;
      let fetch_options = {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      }

      fetch(fetch_url, fetch_options)
          .then(res => res.json())
          .then(res => {
              if (res.memberCount) {
                  const members = res.memberResourceNames;

                  fetch_options.method = 'DELETE';
                  fetch_url = `https://people.googleapis.com/v1/${members[0]}:deleteContact?key=${API_KEY}`;

                  fetch(fetch_url, fetch_options)
                      .then(res => console.log(res));
              }
          });
    });
  }
})

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