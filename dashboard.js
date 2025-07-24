const hostname = decodeURIComponent(location.href.split("origin=")[1]).split("//")[1]

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function loadOriginData(origin) {
  document.getElementById("origin").textContent = `🔗 Origin: ${origin}`;

  const { keywords_by_origin } = await chrome.storage.local.get("keywords_by_origin");
  const pages = (keywords_by_origin && keywords_by_origin[origin]) || {};

  const dataDiv = document.getElementById("data");
  dataDiv.innerHTML = "";

  Object.entries(pages).forEach(([pageURL, keywords]) => {
    keywords.forEach(keyword => {
      const pageDiv = document.createElement("div");
      pageDiv.className = "page";

      const title = document.createElement("strong");
      const anchor = document.createElement("a")
      anchor.href = pageURL
      anchor.target = "_blank"
      anchor.innerText = pageURL
      title.appendChild(anchor)
      pageDiv.appendChild(title);
      const kw = document.createElement("div");
      kw.className = "keyword";
      kw.textContent = keyword;
      pageDiv.appendChild(kw);
      dataDiv.appendChild(pageDiv);
    });

  });
}

const origin = getQueryParam("origin");
if (origin) {
  loadOriginData(origin);
}
