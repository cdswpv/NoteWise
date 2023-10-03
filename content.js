document.getElementById("myButton").addEventListener("click", getText);

function getText() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    console.log(tab.url);
  
      fetch(tab.url)
      .then(Response => Response.text())
      .then(html => {
        parseHTML(html);
      })
  
    function parseHTML(html){
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
    
      const paragraphs = doc.querySelectorAll('p','td');
      paragraphs.forEach(paragraph => {
        console.log(paragraph.textContent);
      })
      }
  })
}
