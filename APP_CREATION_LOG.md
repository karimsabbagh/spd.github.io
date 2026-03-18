# SPD App Creation Log

A categorized record of decisions, questions, and commands that shaped how this app was built.

---

## 1. Initial Setup & Docker

- Create a Docker container running Debian as base image, with a PWA based on Node.js and Hono (API) and Lit Element (frontend). Use the same structure as the provided template — same lit bundle, same Navigation API router, same code structure.
- `docker compose up --build` was run but got `http://localhost:3000/` 404 not found.
- How are we currently serving the client files?
- Now if I build the image again, will it have things cached already? Or will it download stuff still?
- Do we have to run `docker compose up --build` (with build flag) each time?
- Can you replace Debian bookworm-slim with Debian Trixie? And would this affect anything?
- Can you make the container copy the front-end and back-end files instead of using volumes?

## 2. Project Structure

- Why do we still have the client folder? (base template had "client" folder)
- That's not the point. Why did we name it "client" in the first place?
- What do you think if we, instead of removing everything to the root, we had "front-end" and "back-end"?
- Can you generate a .md file explaining the structure, the business, and the architecture? Also maybe a Mermaid file.

## 3. Frontend & Styling

- Why does the SVG icon look like this?
- In Chrome full screen the icons look normal, but in Cypress (Electron) they look gigantic.
- The font exists — so why does the JSON require authentication but not the JS or CSS files? (problem with hosting on wmdrive not serving .json and .woff2 files)

## 4. Dependencies & Libraries

- Do we need signal-polyfill dev dependency?
- Why do we need live-server?
- I actually prefer using IndexedDB, maybe with Dexie.
- If I copied the dexie file from `https://unpkg.com/dexie@4/dist/dexie.mjs` and stored it locally, would it work? (this way all deps are cached)

## 5. Data Storage

- Where are we saving the front-end data? If I restart the container, will they be lost?
- What if we saved them in localStorage — will they be lost when reloading the container? (that was for the serverless demo not supporting indexeddb)
- I actually prefer using IndexedDB, maybe with Dexie.

## 6. Development Environment

- How about we add a devcontainer as well?
- Does it have hot-reloading?
- I suppose live-server VS Code extension would do for the front-end, right?
- I don't think we even need devcontainer for this project. (realizing this project doesn't need devcontainers since everything is in the front-end)
- I mean, we already have `node --watch` and LiveServer extension in VS Code.

## 7. Testing (Cypress)

- Can you create some Cypress tests?
- Cypress is showing "opening e2e testing in Chrome" but nothing is happening.
- I see in the console "still waiting to connect to Chrome, retrying in 1 second."
- Which Chrome browser is in Electron 118?
- Can we not use a newer version?
- Do we have the latest Cypress?
- Why did we choose to use 13.17.0?
- Now it only has Chrome enabled, and still cannot open it.
- So which Chrome version does Cypress Electron support now?
- It says unknown flag `--no-cache`.

## 8. Code Coverage

- Can we add code coverage?
- I choose option 1, but first can you explain what problems do we have with coverage on backend?
- So even after years of ES modules in the web platform, nyc still does not intercept them? (random rants)
- So c8 uses V8's built-in code coverage. How can we leverage this?
- Yes but also explain why it took so long.

## 9. Production vs Development Modes

- I am thinking to have two modes (from .env file maybe or some global variable) sent to Docker engine: one is production mode and one is development mode. Production mode should open Chrome automatically in kiosk mode, the other opens regular Chrome.
- Can we make Chrome open in kiosk mode?
- Let's drop this for now.

## 10. Miscellaneous

- Is using Storybook useful for this sample project?
- How many story points do you think this project is? And why?
- Let's first commit what we have already.
