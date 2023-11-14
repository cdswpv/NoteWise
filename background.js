import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  dangerouslyAllowBrowser: true,
});

let textSection;


//#region ContextMenus
chrome.runtime.onInstalled.addListener((tab) => {
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
    console.log(tab);
    
    chrome.contextMenus.onClicked.addListener((tab) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var currentTab = tabs[0];
        console.log(tabs);
        // Check if the tab's URL is not a chrome:// URL
        if (!currentTab.url.startsWith('chrome://')) {
          chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            function: createOverlay,
          });
        } else {
          console.error('Cannot access a chrome:// URL.');
        }
      });
    })
    chrome.contextMenus.onClicked.addListener(function(info, tab){
      //Add code to summarize the info variable, open the content.js file up, and display the summarization


      

      console.log("summary info:")
      //Displays the text selected 
      console.log(info)
      if (info.menuItemId == "text")
      {
        console.log("Selected Text: " + info.selectionText)
  
        //Generates the summary and places it into the console log
        let summarizedText = generateSummary(info.selectionText)
        console.log("summarizing")
        /*
        try
        {
          UpdateOverlayText(summarizedText);
        }
        catch(error){console.error("Error at updating overlay text: " + error)}
        */
      }
      else if (info.menuItemId == "image")
      {
        console.log("Image URL: " + info.srcUrl)
  
        chrome.tabs.create({url:info.srcUrl})
      }
    });
  });
//#endregion


//#region Overlay Code
  function createOverlay() {
    console.log("create overlay");
    overlayDiv = document.createElement('div');
    overlayDiv.id = 'customOverlay';
    overlayDiv.style.cssText = 'position: fixed; top: 0; left: 0; width: 300px; height: 150px; border: 2px solid #000; background-color: #FFF; padding: 0; user-select: none; cursor: move; z-index: 999;';

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
    ttsButton.addEventListener('click', () => {
        console.log('TTS button clicked');
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
        console.log('Close button clicked');
        document.body.removeChild(overlayDiv);
    });

    // Section area for text
    console.log("set text section")
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

    // Make the overlay, header, and buttons draggable
    makeOverlayDraggable(overlayDiv);
    function GetTextSection()
    {
      return textSection;
    }
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
function UpdateOverlayText(text)
{
  textSection.innerText = text;
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

//#region Summarization Code
async function generateSummary(text) {
  console.log("generating summmary")
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
      return summary;
    } 
    else if (response.hasOwnProperty('error')) {
      console.error('Error from OpenAI API:', response.error.message);
    }
  } catch (error) {
    console.error('Error generating summary: ', error);
  }
  return ("An unknown error has occured. Close this window and try again.");
}
//#endregion