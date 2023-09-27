document.getElementById("myButton").addEventListener("click", getTab);

function getTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    console.log(tab.url);



    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: getPageText,
      },
      function (result) {
        const pageText = result[0].result;

        
        const test = getSentences(pageText);
        document.getElementById("demo").textContent = test;
      }
    );
  });
}

function getPageText() {
    const mainContent = ["p", "div", "article"];

    for (const selector of mainContent){
      const element = document.querySelector(selector);

      if(element){
        return element.innerText; 
      }
    }
    return " ";
}

function getSentences(pageText){

  const sentences = pageText.split(/[.!?]/);

  const validSentences = sentences.filter(sentences => sentences.trim().length > 1);

  const testSentences = validSentences.slice(0,5);

  return testSentences.join('. ') + '.';

}


