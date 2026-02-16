# Secure Assessment - React Proctoring App

This is a **React-based secure assessment app** designed to simulate a locked-down, time-bound, and auditable test environment. It includes proctoring features such as fullscreen enforcement, tab/focus monitoring, copy-paste detection, and timer-based logging.

The project is hosted at: [https://myth293.github.io/secure-assessment](https://myth293.github.io/secure-assessment)

---

## Features

1. **Secure Test Environment**
   - Fullscreen enforcement: the test requires fullscreen mode, and leaving fullscreen pauses the test and counts as a violation.
   - Tab / window focus monitoring: switching tabs or minimizing the browser is detected as a violation.
   - Copy, paste, and cut attempts are detected and logged.
   - Violation counter displayed live.

2. **Timer**
   - Countdown timer for each test question.
   - Logs timer ticks every 10 seconds (configurable to log every second if needed).
   - Automatically submits the test when time expires.

3. **Unified Event Logging**
   - All events are timestamped and logged in a structured format (`ProctorLog`).
   - Event types include:
     - `TEST_START`, `TEST_RESUME`, `TAB_SWITCH`, `FOCUS_RESTORED`, `FULLSCREEN_EXIT`
     - `COPY_ATTEMPT`, `PASTE_ATTEMPT`, `CUT_ATTEMPT`, `TIMER_TICK`
     - `SUBMIT`, `AUTO_SUBMIT`
   - Metadata includes user agent, visibility state, and any additional relevant info.

4. **Local Storage Logging**
   - Logs are currently stored in `localStorage` for offline persistence.
   - Logs can be retrieved, cleared, or downloaded manually.
   - Each test attempt is assigned a unique `attemptId`.

5. **Optional Backend / API Integration**
   - Logs can be easily sent to a backend, database, or an online mock API (e.g., webhook.site) by adding a simple POST request in `ProctorLogger`.

---

## Usage

1. **Start the app locally**

```bash
npm install
npm start
```

2. **Run the test**
   - Click **Start Test**. Fullscreen is required.
   - Complete the question in the textarea.
   - Violations and remaining time are displayed live.
   - Exiting fullscreen or switching tabs pauses the test and logs the event.
   - Submit manually or allow timer to auto-submit.

3. **View logs**
   - Stored in `localStorage` under key `proctor_logs`.
   - Example log format:

```json
[
  {
    "attemptId": "f7e2a7f0-1234-5678-9abc-1a2b3c4d5e6f",
    "questionId": "Q1",
    "type": "TAB_SWITCH",
    "metadata": {
      "userAgent": "Mozilla/5.0...",
      "visibilityState": "hidden"
    },
    "timestamp": 1700000000000
  }
]
```

---

## Deployment

This project is deployed using **GitHub Pages**.

1. Install `gh-pages` (already included in dev dependencies):

```bash
npm install gh-pages --save-dev
```

2. Deploy:

```bash
npm run deploy
```

3. The live site will be available at the URL specified in `package.json` "homepage":  
[https://myth293.github.io/secure-assessment](https://myth293.github.io/secure-assessment)

---