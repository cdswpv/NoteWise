document.getElementById("myButton").addEventListener("click", getText);
document.getElementById("x").addEventListener("click", closeElement);

function getText() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    console.log(tab.url);
    chrome.runtime.sendMessage({ type: "url", url: tab.url });

    fetch(tab.url)
        .then(response => response.text())
        .then(html => {
          parseHTML(html);
        });

    function parseHTML(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const paragraphs = doc.querySelectorAll('p', 'td');
      paragraphs.forEach(paragraph => {
        console.log(paragraph.textContent);
      });
    }
  });
}

function closeElement() {
  const element = document.getElementById('x');
  element.style.display = 'none';
  window.close();
}

