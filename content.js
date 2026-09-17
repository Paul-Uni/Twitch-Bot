//Placeholder
let msgSent = false;
let entries = 0;
let oldDate = null;
let timeDiff = null;

//Adjustable
let entriesNeeded = 5; // Example value, adjust as needed
let giveawayKeyword = "!giveaway"; //Keyword to look for in chat messages
let EntryMessage = "Julio Culio hier (´ヮ`)"; // Message to send when an entry is detected
let msgSendCooldown = 60000 * 5; //60000ms = 1 minute
let soundEnabled = true; // Enable or disable sound notification
let autoEnterEnabled = true; // Enable or disable auto entry

function InitScript() {
    chrome.storage.local.get([
        "autoEnterEnabled", "soundEnabled", "giveawayKeyword", "entryMessage", "entriesNeeded", "msgSendCooldown"
    ], (settings) => {
        entriesNeeded = settings.entriesNeeded ?? 5;
        giveawayKeyword = settings.giveawayKeyword ?? "!giveaway";
        EntryMessage = settings.entryMessage ?? "Julio Culio hier (´ヮ`)";
        msgSendCooldown = settings.msgSendCooldown ?? 60000 * 5;
        soundEnabled = settings.soundEnabled ?? true;
        autoEnterEnabled = settings.autoEnterEnabled ?? true;
        findChatContainer();
    });
}

function findChatContainer() {
    
    if (!soundEnabled && !autoEnterEnabled) return; 

    const container = document.querySelector("[data-a-target=\"chat-scroller\"]");

    if (!container) {
        setTimeout(findChatContainer, 1000);
        return;
    }

    //console.log("\nChat container found:", container);

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const messageElement = node.querySelector("[data-a-target=\"chat-message-text\"]");
                        if (messageElement) {
                            handleMessage(messageElement);
                        }
                    }
                });
            }
        }
    });

    observer.observe(container, {
        childList: true,
        subtree: true
    });
}

function handleMessage(messageElement) {
    const messageText = messageElement.textContent;
    //console.log("New chat message:", messageText);

    if (msgSent) return; // ignore new entries while on cooldown

    //Entry detection logic
    if (messageText.toLowerCase().includes(giveawayKeyword.toLowerCase())) {
        //console.log("Entry detected!");
        if (oldDate !== null) { //Checks if the time intervall is small enough
            const currentDate = new Date();
            timeDiff = Math.floor((currentDate - oldDate));
        }
        if (timeDiff < 5000 && timeDiff !== null) { //if it is add an entry, if it reaches a thresold trigger giveaway
            entries++;
            if (entries >= entriesNeeded) {
                triggerGiveawayPing();
            }
        } else {
            entries = 1;
        }
        oldDate = new Date();
    }
}

function triggerGiveawayPing() {
    msgSent = true;
    if (soundEnabled) playSound();
    if (autoEnterEnabled) sendMessage(EntryMessage); 

    setTimeout(() => {
        msgSent = false;
        entries = 0;
        oldDate = null;
        timeDiff = null;
        console.log("Cooldown over, listening for the next giveaway.");
    }, msgSendCooldown);
}

function setNativeValue(element, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
    ).set;
    nativeInputValueSetter.call(element, value);
}

function sendMessage(message) {
    const input = document.querySelector('[data-a-target="chat-input"]');
    if (!input) return;

    input.focus();

    const inputEvent = new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: message,
    });
    input.dispatchEvent(inputEvent);

    // Give Slate a moment to process, then send
    setTimeout(() => {
        const enterEvent = new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            bubbles: true,
            cancelable: true,
        });
        input.dispatchEvent(enterEvent);
    }, 50);
}

function playSound() {
    chrome.runtime.sendMessage({ type: "GIVEAWAY_DETECTED" });
    // const audio = new Audio(chrome.runtime.getURL("notify.mp3"));
    // audio.loop = false;
    // audio.play();
    //console.log("Sound played!");
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

InitScript();
