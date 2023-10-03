const { Readability } = require("@mozilla/readability");
const { JSDOM } = require("jsdom");

document.getElementById("myButton").addEventListener("click", getTab);

/*getting active tab using chrome extension api then executes 
the getPageTextUsingReadability function */
function getTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    console.log(tab.url);
    console.log("getTab: Active tab URL:", tab.url); // for testing

    // Pass the 'tab' variable as an argument to getPageTextUsingReadability
    getPageTextUsingReadability(tab);
  });
}

/*executes script on active tab while using the chrome scripting to 
execute the getPageHTML function to get the HTML content of the current page*/
function getPageTextUsingReadability(tab) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: getPageHTML,
    },
    function (result) {
      const htmlContent = result[0].result;
      const dom = new JSDOM(htmlContent);
      const doc = dom.window.document;
      const reader = new Readability(doc);
      const article = reader.parse();

      // Get the formatted content using getSentences
      const formattedContent = getSentences(article.content);
      console.log("getPageTextUsingReadability: HTML Content:", htmlContent); //for testing
      // Update the popup's content with the formatted content
      document.getElementById("demo").textContent = formattedContent;
    }
  );
}

//getting the HTML content of the current page
function getPageHTML() {
  const html = document.documentElement.outerHTML;
  console.log("getPageHTML: HTML Content:", html); // for testing
  return html
}

//Providing us the first 5 sentences 
function getSentences(pageText) {
  const sentences = pageText.split(/[.!?]/);
  const validSentences = sentences.filter((sentence) => sentence.trim().length > 1);
  const testSentences = validSentences.slice(0, 5);
  return testSentences.join('. ') + '.';
}
