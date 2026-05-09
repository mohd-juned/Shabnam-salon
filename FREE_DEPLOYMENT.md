# How to Deploy for FREE (Bina Billing ke)

Agar aapko Google Cloud/Cloud Run par billing ki wajah se dikkat aa rahi hai, toh aap ye solutions use kar sakte hain:

### Option 1: Render.com (Recommended - Sabse Simple)
Ye platform Node.js ko free me chalata hai bina kisi credit card ke.
1. Apne code ko **GitHub** par upload karein.
2. [Render.com](https://render.com) par jayein aur "New Web Service" select karein.
3. Apne GitHub repo ko connect karein.
4. Ye settings enter karein:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. **Environment Variables**: "Environment" tab me jayein aur ye keys add karein:
   - `GEMINI_API_KEY`
   - `REPLICATE_API_TOKEN` (Agr hai)
   - `TOGETHER_API_KEY` (Agr hai)
   - `AIMLAPI_KEY` (Agr hai)
   - `NODE_ENV`: `production`

### Render Tutorial (Video Jaisa)
1. GitHub pe code push karein.
2. Render pe **Web Service** banayein.
3. settings me **Runtime** select karein "Node".
4. **Environment Variables** me upar di gayi keys daalna mat bhulna, varna generation error dega.

### Option 2: Railway.app (Free Trial)
Railway bhi bahut asan hai, bas GitHub connect karke deploy ho jata hai. Isme bhi aapko API keys settings me daalni hongi.

---

### Render Troubleshooting (Agar 'Failed' ho jaye)
1. **Logs Check Karein**: Render dashboard me "Logs" tab par click karein. Wahan red color me error dikhega. Agar "AI service failed" hai, to iska matlab keys missing hain.
2. **Web Service vs Static Site**: Dhyaan rahe aapne **"Web Service"** select kiya hai.
3. **Environment Variables (IMPORTANT)**: 
   - Render dashboard me apni service open karein.
   - **Environment** tab par click karein.
   - **Add Environment Variable** button dabayein.
   - Ye keys zaroor dalein (Value aapke AI Studio Settings se milegi):
     - `GEMINI_API_KEY`: (Face and identity detection ke liye)
     - `REPLICATE_API_TOKEN`: (High quality image generation ke liye)
     - `NODE_ENV`: `production`
   - **Save Changes** karein aur app apne aap redeploy ho jayega.

---

### Option 3: Shared Preview (AI Studio)
Aap upar diye gaye **"Share"** button (top right) ka use karke bhi apne client ko link bhej sakte hain. Wo link bilkul free chalega aur usme aapke keys backend par secure rahenge.

---

**Zaroori Baat:**
Static hosting jaise **Netlify** ya **GitHub Pages** par ye app nahi chalega kyunki AI feature ke liye "Backend Server" chahiye hota hai. Upar diye gaye steps se aapko real server milega wo bhi free me.
