# Shabnam Men's Salon - Deployment Guide

This app is built as a **Progressive Web App (PWA)**, which means it can be installed on Android and iOS directly from the browser, or packaged for the Google Play Store.

## 1. Local Development
1. Install Node.js.
2. Run `npm install` in this directory.
3. Create a `.env` file and add your `GEMINI_API_KEY`.
4. Run `npm run dev` to start the local server.

## 2. AI Feature Setup (Virtual Grooming)
The virtual grooming feature uses Google's Gemini AI. 
- **In AI Studio Preview:** It uses the key set in your project settings.
- **In Production (Vercel, Netlify, etc.):** You MUST add an environment variable named `GEMINI_API_KEY` with your key from [Google AI Studio](https://aistudio.google.com/).
- **Local Testing:** Create a `.env` file in the root and add `VITE_GEMINI_API_KEY=your_key_here` (Note: the app handles the mapping, but for local Vite dev, `VITE_` prefix is standard, though we use `process.env.GEMINI_API_KEY` for cross-platform compatibility).

## 3. Removing the AI Studio Sidebar (Chat/Editor)
If you share the link from AI Studio, others will see the chat sidebar. To give your customers a clean, professional app:
1. **Connect to GitHub:** Go to Settings -> Export to GitHub.
2. **Deploy to Netlify/Vercel:** Connect your repository.
3. **Use the new URL:** Your app will now be at `https://your-app-name.netlify.app` with NO sidebars. This is the link you should use for the Play Store.

## 4. Google Play Store Submission (PWABuilder)
1. **Host your app first!** (See section 3). DO NOT use the AI Studio link (`ai.studio/build/...`) in PWABuilder. If you do, your app will include the Chat/Editor sidebar.
2. Go to [PWABuilder.com](https://www.pwabuilder.com/).
3. Enter your **live, hosted URL** (e.g., `https://shabnam-salon.netlify.app`). This is the link that shows ONLY your app.
4. Download the **Android Wrapper (Asset Pack)**.
5. Upload the generated `.aab` file to your [Google Play Console](https://play.google.com/console/).

## 5. Manual Installation (Android)
If you don't want to use Play Store:
1. Open the live URL in **Chrome**.
2. Click the three dots (menu) and select **"Install App"** or **"Add to Home Screen"**.
