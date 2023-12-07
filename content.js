import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  dangerouslyAllowBrowser: true,
});

const paragraphArray = [];
let isLoading = false;

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
      let textToSummarize = "Please provide a concise summary of the core information of the following, ignore any links provided you are acting as a summary tool in a browser extension limit it respose to a short paragraph and some bullet points: " + paragraphArray.join('\n'); // Concatenate paragraphs

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
    showLoader();

    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        { role: 'system', content: 'A user will provide you with text from a webpage. Summarize the given text briefly without omitting any important details.' },
        { role: 'user', content: text },
      ],
      max_tokens: 1000,
    });

    if (response.hasOwnProperty('choices') && response.choices.length > 0) {
      const summary = response.choices[0].message.content;
      const summaryElement = document.getElementById("summary");
     
      if (summaryElement) {
        summaryElement.textContent = summary; // Update the 'summary' element with the generated summary
      } 
    } else if (response.hasOwnProperty('error')) {
      console.error('Error from OpenAI API:', response.error.message);
    }
  }  finally{
    isLoading = false;
    hideLoader();
    updateFont();
    updateSummaryBox();
  }
}

function hideLoader() {
  var loader = document.getElementById('loader');
  loader.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {

  document.getElementById("navbar").addEventListener('mouseover', function() {
   // console.log("moouseover");
    openNav();
    moveMenu();
  });
  
  document.getElementById("navbar").addEventListener('mouseout', function() {
   // console.log("moouseout");
    closeNav();
    moveMenuBack();
  });
  
  document.getElementById('myButton').addEventListener('click', function() {
   // console.log('Button clicked');
    getText();
    hideButton();
    });
  
  document.getElementById("policy").addEventListener('click', function() {
   // console.log("Privacy Policy clicked");
    openPrivacyPolicy();
  })
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

  });

  //text to speech 
  document.getElementById('ttsButton').addEventListener('click', function() {
    
    var summaryText =  document.getElementById('summary').innerText;
    generateSpeech(summaryText);
  });
  

  function updateFont(){
    var textSizeInput = document.getElementById('fontrange');
    var testElement = document.getElementById('summary');
  
    textSizeInput.addEventListener('input', function () {
      testElement.style.fontSize = this.value + "px";
    });
  }

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
 // console.log('Hiding button');
  var button = document.getElementById('myButton');
  button.classList.add('hidden');
  button.disabled = true;
}

function openPrivacyPolicy(){
  chrome.tabs.create({ url: 'https://docs.google.com/document/d/14c187OtIV8xpiyk7VZfIg91A1JKc1QLdLvKh0P_r7u0/edit?usp=sharing' });
}

function showLoader() {
  var loader = document.getElementById('loader');
  loader.style.display = 'block';
  isLoading = true;
}

function updateFont(){
  var textSizeInput = document.getElementById('fontrange');
  var testElement = document.getElementById('summary');
  textSizeInput.addEventListener('input', function () {
    testElement.style.fontSize = this.value + "px";
  });
}
function updateSummaryBox() {
  const menuBox = document.getElementById('summary');
  menuBox.style.top = "5%";
  menuBox.style.height = "100%"
}

function openNav() {
  var navbar = document.getElementById("navbar");
  var fontrange = document.getElementById("fontrange");
  var policy = document.getElementById("policy");
  var labels = document.querySelectorAll(".label");


  
  labels.forEach(function(label) {
    label.style.color = "white";
    label.style.userSelect = "auto";
  });

  policy.style.color = "inherit";
  policy.style.userSelect = "auto";


  fontrange.style.width = "80px";
  navbar.style.width = "100px";
}

function closeNav() {
  var navbar = document.getElementById("navbar");
  var fontrange = document.getElementById("fontrange");
  var policy = document.getElementById("policy");
  var labels = document.querySelectorAll(".label");

  labels.forEach(function(label) {
    label.style.color = "transparent";
    label.style.userSelect = "none";
  });

  policy.style.color = "transparent";
  policy.style.userSelect = "none";

  fontrange.style.width = "20px";
  navbar.style.width = "30px";
}

function moveMenu() {
  var button = document.getElementById("myButton");
  var summaryBox = document.getElementById("summary");

  button.style.marginRight = "2.5px";

  summaryBox.style.marginRight = "5px";
  summaryBox.style.width = "190px";
}

function moveMenuBack() {
  var button = document.getElementById("myButton");
  var summaryBox = document.getElementById("summary");

  button.style.marginRight = "40px";

  summaryBox.style.width = "225px";
  summaryBox.style.marginRight = "25px";
}

