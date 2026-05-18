# Netlify Deployment Guide

This project is prepared for Netlify deployment.

## Steps to Deploy

1.  **Build the Project Locally (Optional):**
    ```bash
    npm run build
    ```
2.  **Using Netlify CLI:**
    - Install CLI: `npm install netlify-cli -g`
    - Login: `netlify login`
    - Deploy: `netlify deploy --prod` (Select `dist` as the publish directory)

3.  **Using Netlify Dashboard (Recommended):**
    - Drag and drop the `dist` folder into the Netlify dashboard.
    - OR Connect your GitHub repository.

## Backend Note
The current `/api/fetch` endpoint requires a Node.js server. Since Netlify is primarily for static sites, you have two options for the downloader to work:
- **Option A:** Convert the Express logic in `server.ts` into Netlify Functions (placed in a `netlify/functions` folder).
- **Option B:** Host the server separately and update the `fetch` URL in `App.tsx` to the full URL of your hosted backend.

## Firebase Support
Firebase Analytics/Firestore is already configured in `src/lib/firebase.ts` and will work out of the box in the live site.
