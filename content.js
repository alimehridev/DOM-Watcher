function checkForKeywords(keywords) {
    const bodyText = document.body.innerHTML.toLowerCase();
    for (const keyword of keywords) {
        if (bodyText.includes(keyword.toLowerCase())) {
            notifyUser(keyword);
        }
    }
}

function getKeywordsByOrigin(origin, callback) {
  chrome.storage.local.get("keywords_by_origin", (data) => {
    const all = data.keywords_by_origin || {};

    const result = all[origin] || null;
    callback(result);
  });
}

function storeFoundKeyword(origin, href, keyword) {
  chrome.storage.local.get("keywords_by_origin", (data) => {
    const all = data.keywords_by_origin || {};

    if (!all[origin]) {
      all[origin] = {};
    }

    if (!all[origin][href]) {
      all[origin][href] = [];
    }

    if (!all[origin][href].includes(keyword)) {
      all[origin][href].push(keyword);
    }

    chrome.storage.local.set({ keywords_by_origin: all }, () => {
    });
  });
}

const origin = location.origin;
const href = location.href;
function notifyUser(keyword) {
    storeFoundKeyword(origin, href, keyword);
}


chrome.storage.local.get("added_origins", (result) => {
  const arr = result["added_origins"] || [];
  if (arr.includes(origin)) {
    const observer = new MutationObserver((e) => {
        getKeywordsByOrigin(origin, (pages) => {
          try{
            let counts = Object.keys(pages).length;
            chrome.runtime.sendMessage({ type: "setBadge", text: counts.toString() });
          }catch {
            chrome.runtime.sendMessage({ type: "setBadge", text: "0" });
          }
        });

        let key = `keywords_${location.origin.split("//")[1]}`
        chrome.storage.local.get(key, (result) => {
            if (!result[key] || result[key].length === 0) return;
            checkForKeywords(result[key]);
        });
    });

    observer.observe(document.body.parentElement, {
        childList: true,
        subtree: true,
        characterData: true,
    });
  }else{
    chrome.runtime.sendMessage({ type: "setBadge", text: "off" });
  }
});


// Watch DOM changes
