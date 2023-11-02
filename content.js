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

      // Check if the text exceeds the model's maximum token limit (4096 tokens for gpt-3.5-turbo)
      if (textToSummarize.split(' ').length > 4096) {
        // If it's too long, truncate it while preserving meaningful content
        const maxTokens = 4096; // Max tokens for gpt-3.5-turbo
        const textArray = textToSummarize.split(' ');
        textToSummarize = textArray.slice(0, maxTokens).join(' ');
      }
      console.log(textToSummarize);
      // Use the OpenAI Chat Completions API to generate a summary
      generateSummary(textToSummarize);
    }
  });
}

async function generateSummary(text) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: text },
      ],
      max_tokens: 2000,
    });

    console.log(response)

    if (response.hasOwnProperty('choices') && response.choices.length > 0) {
      const summary = response.choices[0].message.content;
      const summaryElement = document.getElementById("summary");
      console.log(summary);
      if (summaryElement) {
        summaryElement.textContent = summary; // Update the 'summary' element with the generated summary
      } else {
        console.error('Element with ID "summary" not found.');
      }
    } else if (response.hasOwnProperty('error')) {
      console.error('Error from OpenAI API:', response.error.message);
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
