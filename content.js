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

      const paragraphs = doc.querySelectorAll('p, td, ul, h1, h2, h3');

      paragraphs.forEach((paragraph) => {
        paragraphArray.push(paragraph.textContent);
      });

      // Send the paragraphs to the OpenAI API for summarization
      let textToSummarize = "Please provide a concise summary of the core information of the following, ignore any links provided you are acting as a summary tool in a browser extension: " + paragraphArray.join('\n'); // Concatenate paragraphs

      // Check if the text exceeds the model's maximum token limit 
      if (textToSummarize.split(' ').length > 4096) {
        // If it's too long, truncate it while preserving meaningful content
        const maxTokens = 4096; // Max tokens 
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
      model: 'gpt-4-1106-preview',
      messages: [
        { role: 'system', content: 'A user will provide you with text from a webpage. Summarize the given text briefly without omitting any important details.' },
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


document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('myButton').addEventListener('click', function() {
    console.log('Button clicked');
    getText();
    hideButton();
    showLoader();
    });
  
  document.getElementById('x').addEventListener('click', closeElement);

  function closeElement() {
    const element = document.getElementById('x');
    element.style.display = 'none';
    window.close();
  }
  
  // Event listener for the openNav button
  document.getElementById("openNav").addEventListener("click", openNav);
  //document.getElementById("closeNav").addEventListener("click", closeNav);

  //Button to copy text to clipboard 
  document.getElementById('copyButton').addEventListener('click', function () {
    // Get the text content from the 'summary' element
    var summaryText = document.getElementById('summary').innerText;

    var tempTextarea = document.createElement('textarea');
    tempTextarea.value = summaryText;

    document.body.appendChild(tempTextarea);

    // Select and copy the text to the clipboard
    tempTextarea.select();
    document.execCommand('copy');

    document.body.removeChild(tempTextarea);

    alert('Text copied to clipboard!');
  });

  //text to speech 
  document.getElementById('ttsButton').addEventListener('click', function() {
    
    var summaryText =  document.getElementById('summary').innerText;
    generateSpeech(summaryText);
  });
  
  var textSizeInput = document.getElementById('text-size');
  var testElement = document.getElementById('test');

  textSizeInput.addEventListener('input', function () {
    testElement.style.fontSize = this.value + "px";
  })

  async function generateSpeech(text) {
    try {
      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
      });
      if (response.ok) {
        const audioUrl = URL.createObjectURL(await response.blob());
        playAudio(audioUrl);
      } else {
        console.error('Error from OpenAI API:', response.statusText);
      }
    } catch (error) {
      console.error('Error generating speech:', error);
    }
  }
})
  
  function playAudio(url) {
    const audio = new Audio(url);
    audio.play().catch(e => console.error('Error playing audio:', e));
  }
  


function hideButton() {
  console.log('Hiding button');
  var button = document.getElementById('myButton');
  button.classList.add('hidden');
}

function showLoader() {
  var loader = document.getElementById('loader');
  loader.style.display = 'block';

  setTimeout(function () {
    loader.style.display = 'none';
  }, 3000); // We need to replace with the actual duration
}

document.addEventListener('DOMContentLoaded', function () {
  
})

function updateFont() {
  var selector = document.getElementById('font-style');
  var family = selector.options[selector.selectedIndex].value;
  var text = document.getElementById('test')
  text.style.fontFamily = family;

  selector.addEventListener('input')
}

function openNav() {
  document.getElementById("navbar").style.width = "75px";
}

// Function to close the sliding navbar
function closeNav() {
  document.getElementById("navbar").style.width = "0";
}

function moveMenu() {
  console.log('Faded');
  var menu = document.getElementById('myButton');
  menu.style.margin = "15% 22% 0% 30%";
}

function moveMenu2() {
  console.log('Faded');
  var menu = document.getElementById('myButton');
  menu.style.margin = "15% 22% 0% 18%";
}



// Event listener for the openNav button
document.getElementById("openNav").addEventListener('click', function() {
  openNav();
  moveMenu();
});

document.getElementById("navbar").addEventListener('mouseover', function() {
  openNav();
  moveMenu();
});

document.getElementById("navbar").addEventListener('mouseout', function() {
  closeNav();
  moveMenu2();
});
