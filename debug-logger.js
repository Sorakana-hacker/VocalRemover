// 一時デバッグ用。原因特定後は削除してください。
// 1. https://webhook.site を開いて発行されたURLを下に貼る
const DEBUG_LOG_URL = "https://webhook.site/ed3c0d6a-7f73-452d-8b48-594c0ed7c7e0"; // 例: https://webhook.site/xxxxxxxx-xxxx-...

function sendDebugLog(type, payload) {
  try {
    fetch(DEBUG_LOG_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        payload,
        context: location.href,
        time: new Date().toISOString(),
      }),
    }).catch(() => {});
  } catch (e) {}
}

const _origLog = console.log;
const _origWarn = console.warn;
const _origError = console.error;
console.log = (...args) => { sendDebugLog("log", args.map(String)); _origLog(...args); };
console.warn = (...args) => { sendDebugLog("warn", args.map(String)); _origWarn(...args); };
console.error = (...args) => { sendDebugLog("error", args.map(String)); _origError(...args); };

window.addEventListener("error", (e) => {
  sendDebugLog("window.onerror", {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
    stack: e.error && e.error.stack,
  });
});

window.addEventListener("unhandledrejection", (e) => {
  sendDebugLog("unhandledrejection", {
    reason: e.reason && (e.reason.stack || e.reason.message || String(e.reason)),
  });
});

sendDebugLog("boot", { message: "debug-logger loaded" });
