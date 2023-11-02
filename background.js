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
          max_tokens: 50, 
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
});

function loadSignIn()
{
  const popupContainer = document.getElementById('popup')
  popupContainer.innerHTML = '<iframe src="popup.html" width="100%" height="100%"></iframe>';
}

function loadSignedOut() {
  const popupContainer = document.getElementById('popup');
  popupContainer.innerHTML = '<iframe src="login.html" width="100%" height="100%"></iframe>';
}