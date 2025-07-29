function decodeHtmlEntities(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
}

function checkForKeywords(keywords) {
    const bodyText = document.body.innerHTML.toLowerCase();
    for (const keyword of keywords) {
        if (bodyText.includes(keyword.toLowerCase())) {
          let count = countSubstringSplit(bodyText, keyword)
          notifyUser(keyword, count);
        }
    }
}

function getKeywordsByOrigin(origin, callback) {
  if (!chrome.runtime?.id) {
    console.warn("Extension context is invalidated.");
    return;
  }
  chrome.storage.local.get("keywords_by_origin", (data) => {
    const all = data.keywords_by_origin || {};

    const result = all[origin] || null;
    callback(result);
  });
}

function storeFoundKeyword(origin, href, keyword, count) {
  chrome.storage.local.get("keywords_by_origin", (data) => {
    const all = data.keywords_by_origin || {};

    if (!all[origin]) {
      all[origin] = {};
    }

    if (!all[origin][href]) {
      all[origin][href] = {};
    }
    if(!all[origin][href][keyword] || all[origin][href][keyword] < count){
      all[origin][href][keyword] = count;
    }
    chrome.storage.local.set({ keywords_by_origin: all }, () => {
    });
  });
}

const origin = location.origin;
function notifyUser(keyword, count) {
  const href = location.href;
  storeFoundKeyword(origin, href, keyword, count);
}


chrome.storage.local.get("added_origins", (result) => {
  const arr = result["added_origins"] || [];
  if (arr.includes(origin)) {
    const observer = new MutationObserver((e) => {
        getKeywordsByOrigin(origin, (pages) => {
          try{
            chrome.runtime.sendMessage({ type: "setBadge", text: Object.keys(pages[Object.keys(pages).filter(item => item == location.href)[0]]).length.toString() });
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

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
    });
  }else{
    chrome.runtime.sendMessage({ type: "setBadge", text: "off" });
  }
});


// Watch DOM changes
