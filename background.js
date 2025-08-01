chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "setBadge") {
    chrome.action.setBadgeText({ tabId: sender.tab.id, text: message.text });
    chrome.action.setBadgeBackgroundColor({ tabId: sender.tab.id, color: "#79ceffff" });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get("added_origins", (result) => {
    const arr = result["added_origins"] || [];
      const origin = new URL(tab.url).origin;
      if (arr.includes(origin)) {
        const url = chrome.runtime.getURL("dashboard.html") + `?origin=${encodeURIComponent(origin)}`;
        chrome.tabs.create({ url });
      }else{
        const url = chrome.runtime.getURL("dashboard.html") + `?origin_add=${encodeURIComponent(origin)}`;
        chrome.tabs.create({ url });
      }
  });
});