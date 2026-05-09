# How to Deploy for FREE (Bina Billing ke)

Agar aapko Google Cloud/Cloud Run par billing ki wajah se dikkat aa rahi hai, toh aap ye solutions use kar sakte hain:

### Option 1: Render.com (Recommended - Sabse Simple)
Ye platform Node.js ko free me chalata hai bina kisi credit card ke.
1. Apne code ko **GitHub** par upload karein.
2. [Render.com](https://render.com) par jayein aur "New Web Service" select karein.
3. Apne GitHub repo ko connect karein.
4. Ye settings enter karein:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server.cjs`
5. **Environment Variables**: "Environment" tab me jayein aur ye keys add karein:
   - `GEMINI_API_KEY`
   - `AIMLAPI_KEY` (ya jo bhi aap use kar rahe hain)
   - `NODE_ENV`: `production`

### Option 2: Railway.app (Free Trial)
Railway bhi bahut asan hai, bas GitHub connect karke deploy ho jata hai. Isme bhi aapko API keys settings me daalni hongi.

### Option 3: Shared Preview (AI Studio)
Aap upar diye gaye **"Share"** button (top right) ka use karke bhi apne client ko link bhej sakte hain. Wo link bilkul free chalega aur usme aapke keys backend par secure rahenge.

---

**Zaroori Baat:**
Static hosting jaise **Netlify** ya **GitHub Pages** par ye app nahi chalega kyunki AI feature ke liye "Backend Server" chahiye hota hai. Upar diye gaye steps se aapko real server milega wo bhi free me.
