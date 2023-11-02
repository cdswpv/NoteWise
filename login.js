document.getElementById("Login").addEventListener('click', function () {
    chrome.runtime.sendMessage({message: 'get_access_token'})
});
