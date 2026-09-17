// Runs when the popup opens: load saved settings and put them in the form
document.addEventListener("DOMContentLoaded", async () => {
  const settings = await chrome.storage.local.get([
    "autoEnterEnabled", "soundEnabled", "giveawayKeyword",
    "entryMessage", "entriesNeeded", "msgSendCooldown"
  ]);

  document.getElementById("autoEnterEnabled").checked = settings.autoEnterEnabled ?? true;
  document.getElementById("soundEnabled").checked = settings.soundEnabled ?? true;
  document.getElementById("giveawayKeyword").value = settings.giveawayKeyword ?? "!giveaway";
  document.getElementById("entryMessage").value = settings.entryMessage ?? "Julio Culio hier (´ヮ`)";
  document.getElementById("entriesNeeded").value = settings.entriesNeeded ?? 5;
  document.getElementById("msgSendCooldownSeconds").value = settings.msgSendCooldown ? settings.msgSendCooldown / 1000 : 300; // Convert ms to seconds
});

document.getElementById("saveBtn").addEventListener("click", async () => {
  const newSettings = {
    autoEnterEnabled: document.getElementById("autoEnterEnabled").checked,
    soundEnabled: document.getElementById("soundEnabled").checked,
    giveawayKeyword: document.getElementById("giveawayKeyword").value,
    entryMessage: document.getElementById("entryMessage").value,
    entriesNeeded: Number(document.getElementById("entriesNeeded").value),
    msgSendCooldown: Number(document.getElementById("msgSendCooldownSeconds").value) * 1000 // Convert seconds to ms
  };
  await chrome.storage.local.set(newSettings);
  });