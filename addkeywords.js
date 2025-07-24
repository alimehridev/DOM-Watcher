const k_input = document.getElementById("keywordInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("keywordList");
const key_2 = `keywords_${hostname}`;

function remove_item_from_list(li){
    const payload = li.firstChild.innerText
    chrome.storage.local.get(key_2, (result) => {
        if (!result[key_2] || result[key_2].length === 0) return;

        const updated = result[key_2].filter((item) => item !== payload);
        chrome.storage.local.set({ [key_2]: updated }, () => {
            li.remove();
        });
    });
}


addBtn.addEventListener("click", () => {
    const value = k_input.value.trim();
    if (value === "") return;

    const li = document.createElement("li");
    const span = document.createElement("span")
    span.innerText = value
    const remove_button = document.createElement("button")
    remove_button.innerText = "❌"
    remove_button.classList.add("remove-btn")
    li.appendChild(span)
    li.appendChild(remove_button)
    li.querySelector(".remove-btn").addEventListener("click", () => {
        remove_item_from_list(li)
    });
    list.appendChild(li);
    k_input.value = "";

    chrome.storage.local.get(key_2, (result) => {
        const arr = result[key_2] || [];
        
        // اگر میخوای تکراری اضافه نشه، چک کن:
        if (!arr.includes(value)) {
            arr.push(value);
        }

        chrome.storage.local.set({ [key_2]: arr }, () => {
            console.log("Added:", value);
        });
    });

});

// Optional: add keyword on Enter
k_input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addBtn.click();
});



chrome.storage.local.get(key_2, (result) => {
    if (!result[key_2] || result[key_2].length === 0) return;
    result[key_2].forEach((item) => { 
        const li = document.createElement("li");
        const span = document.createElement("span")
        span.innerText = item
        const remove_button = document.createElement("button")
        remove_button.innerText = "❌"
        remove_button.classList.add("remove-btn")
        li.appendChild(span)
        li.appendChild(remove_button)
        li.querySelector(".remove-btn").addEventListener("click", () => {
            remove_item_from_list(li)
        });
        list.appendChild(li);
    })
    
});

document.getElementsByClassName("backBtn")[0].addEventListener("click", () => {
    window.location = location.href.split("?")[0]
})