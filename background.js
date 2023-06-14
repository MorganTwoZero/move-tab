browser.commands.onCommand.addListener((command) => {
  if (command === "move-tab") {
    moveTab()
  }
});

let lastFocusedWindow = {
  lastFocused: 0,
  currentFocused: 0
};
browser.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // This happens when the popup opens.
    return;
  }
  lastFocusedWindow.lastFocused = lastFocusedWindow.currentFocused;
  lastFocusedWindow.currentFocused = windowId;
});

async function moveTab() {
  let tabs = await browser.tabs.query({ currentWindow: true, active: true });
  var currentTabId = tabs[0].id;

  await browser.tabs.move(currentTabId, { windowId: lastFocusedWindow.lastFocused, index: -1 });
  await browser.windows.update(lastFocusedWindow.lastFocused, { focused: true });
  await browser.tabs.update(currentTabId, { active: true });
}