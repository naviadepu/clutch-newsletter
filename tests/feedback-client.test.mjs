import test from "node:test";
import assert from "node:assert/strict";

import {
  clearFeedbackSessionId,
  getOrCreateFeedbackSessionId,
} from "../lib/feedback-client.ts";

function makeLocalStorage() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
  };
}

function replaceGlobalProperty(name, value) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, {
    configurable: true,
    writable: true,
    value,
  });

  return () => {
    if (descriptor) {
      Object.defineProperty(globalThis, name, descriptor);
    } else {
      delete globalThis[name];
    }
  };
}

test("getOrCreateFeedbackSessionId reuses a stored session id", () => {
  const localStorage = makeLocalStorage();
  localStorage.setItem("clutch_feedback_session_2026_06", "existing-session");

  const restoreWindow = replaceGlobalProperty("window", { localStorage });
  const restoreCrypto = replaceGlobalProperty("crypto", {
    randomUUID: () => "new-session",
  });

  try {
    assert.equal(getOrCreateFeedbackSessionId(), "existing-session");
  } finally {
    restoreWindow();
    restoreCrypto();
  }
});

test("clearFeedbackSessionId removes the persisted session id so the next run gets a new one", () => {
  const localStorage = makeLocalStorage();

  let sequence = 0;
  const restoreWindow = replaceGlobalProperty("window", { localStorage });
  const restoreCrypto = replaceGlobalProperty("crypto", {
    randomUUID: () => `session-${++sequence}`,
  });

  try {
    const first = getOrCreateFeedbackSessionId();
    clearFeedbackSessionId();
    const second = getOrCreateFeedbackSessionId();

    assert.equal(first, "session-1");
    assert.equal(second, "session-2");
  } finally {
    restoreWindow();
    restoreCrypto();
  }
});
