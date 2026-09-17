chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GIVEAWAY_DETECTED") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "Giveaway detected!",
            message: "A giveaway just started in chat." //yesyes mhhmmmm 
        });
    }
});