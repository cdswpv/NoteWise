document.getElementById("myButton").addEventListener("click", getText);

function getText() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    console.log(tab.url);

    fetch(tab.url)
      .then(response => response.text())
      .then(html => {
        const concatenatedText = parseHTML(html);
        const paragraphs = createPara(concatenatedText);
        // Update the "demo" element
        document.getElementById("demo").textContent = paragraphs.join("\n\n"); // Join paragraphs with double line breaks
      });

    function parseHTML(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const paragraphs = doc.querySelectorAll('p, td, ul, li');
      let concatenatedText = '';
      paragraphs.forEach(paragraph => {
        concatenatedText += paragraph.textContent + ' '; // Add a space between paragraphs
      });
      return concatenatedText;
    }

    function createPara(concatenatedText) {
      const sentences = concatenatedText.split(/[.!?]/);

      const paragraphs = [];

      let currentParagraph = '';

      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i].trim();

        if (currentParagraph.split('.').length < 6) {
          currentParagraph += sentence + '.';
        } else {
          paragraphs.push(currentParagraph);

          currentParagraph = sentence + ' ';
        }
      }

      if (currentParagraph.trim() !== '') {
        paragraphs.push(currentParagraph);
      }

      return paragraphs;
    }
  });
}
