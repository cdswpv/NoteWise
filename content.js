import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  dangerouslyAllowBrowser: true,
});

const paragraphArray = [];

function getText() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    const tabURL = tab.url;

    fetch(tabURL)
      .then((response) => response.text())
      .then((html) => {
        parseHTML(html);
      });

    function parseHTML(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const paragraphs = doc.querySelectorAll('p, td, ul');

      paragraphs.forEach((paragraph) => {
        paragraphArray.push(paragraph.textContent);
      });

      // Send the paragraphs to the OpenAI API for summarization
      const textToSummarize = paragraphArray.join('\n'); // Concatenate paragraphs

      // Use the OpenAI Chat Completions API to generate a summary
      generateSummary(textToSummarize);
    }
  });
}

async function generateSummary(text) {
  // Define the maximum context length for the model
  const maxContextLength = 4097;

  try {
    // Check if the text length exceeds the maximum context length
    if (text.length > maxContextLength) {
      // If it exceeds the limit, truncate the text to fit within the limit
      text = text.substring(0, maxContextLength);
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: text },
      ],
      max_tokens: 50,
    });

    const summary = response.choices[0].text;
    const summaryElement = document.getElementById('summary');
    if (summaryElement) {
      summaryElement.textContent = summary;
    } else {
      console.error('Element with ID "summary" not found.');
    }
  } catch (error) {
    console.error('Error generating summary: ', error);
  }
}

document.getElementById('myButton').addEventListener('click', getText);
document.getElementById('x').addEventListener('click', closeElement);

function closeElement() {
  const element = document.getElementById('x');
  element.style.display = 'none';
  window.close();
}
