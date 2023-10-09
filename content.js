document.getElementById("myButton").addEventListener("click", getText);
document.getElementById("x").addEventListener("click", closeElement);


let lastRequestTime = 0;
const requestInterval = 500 * 1000; 
const paragraphArray = [];

function getText() {
  const currentTime = Date.now();
  if (currentTime - lastRequestTime < requestInterval) {
    console.log('Request throttled. Waiting before sending another request.');
  } else {
    lastRequestTime = currentTime;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var tab = tabs[0];

      fetch(tab.url)
        .then(response => response.text())
        .then(html => {
          parseHTML(html);
        });

      function parseHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const paragraphs = doc.querySelectorAll('p, td, ul');

        paragraphs.forEach(paragraph => {
          paragraphArray.push(paragraph.textContent);
          console.log(paragraph.textContent);
        });

        //  send the text content to background.js for summarization
        chrome.runtime.sendMessage({ type: "text", textContent: paragraphArray });
      }
    });
  }
}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "summary") {
    const summary = message.summary;

    // display the summary
    const summaryElement = document.getElementById("summary");
    summaryElement.textContent = summary;
  }
});

function closeElement() {
  const element = document.getElementById('x');
  element.style.display = 'none';
  window.close();
}
