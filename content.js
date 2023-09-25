document.getElementById("myButton").addEventListener("click", getTab);

function getTab(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        console.log(tab.url);
        document.getElementById("demo").innerHTML = tab.url;
      });
}