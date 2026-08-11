# 🔧 Fixing Vercel 404 Error

## 🎯 Quick Fix Steps

### 1️⃣ **Check Your Repository Structure** (MOST COMMON ISSUE)

Your GitHub repo root should look like this:

```
your-repo/  (GitHub root)
├── api/
│   └── ask.js          ← API endpoint
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   └── ...
├── package.json        ← MUST BE AT ROOT
├── vercel.json         ← MUST BE AT ROOT
└── README.md
```

**❌ WRONG** (this causes 404):
```
your-repo/
└── beer-chatbot-app/   ← Extra folder!
    ├── api/
    ├── src/
    └── package.json
```

**How to Fix:**
```bash
# If you have nested folder, flatten it:
cd your-repo
ls -la

# If you see beer-chatbot-app folder, move contents up:
mv beer-chatbot-app/* .
mv beer-chatbot-app/.gitignore .
rm -rf beer-chatbot-app/

# Commit and push
git add .
git commit -m "Fix folder structure"
git push
```

---

### 2️⃣ **Test the API Endpoint**

After deploying, visit:
```
https://your-app.vercel.app/api/ask
```

**✅ If you see this**, API works:
```json
{
  "status": "ok",
  "message": "Beer Chatbot API is running",
  "timestamp": "..."
}
```

**❌ If you see 404**, check folder structure (step 1)

---

### 3️⃣ **Add Environment Variables**

In Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add these three variables:

```
DATABRICKS_HOST = https://dbc-ed0aa653-24ab.cloud.databricks.com
DATABRICKS_TOKEN = dapi...your_token_here...
ENDPOINT_NAME = beer-rag-chatbot-endpoint
```

3. **Click "Add"** for each one
4. **IMPORTANT:** After adding env vars, you MUST redeploy!

**How to Redeploy:**
- Go to **Deployments** tab
- Click ⋯ on latest deployment
- Click **"Redeploy"**

---

### 4️⃣ **Check Vercel Logs**

1. Go to your Vercel project
2. Click on your deployment
3. Click **"Functions"** tab
4. Click on `api/ask.js`
5. Look at the **Logs**

Common errors:
- `DATABRICKS_HOST not set` → Add env vars (step 3)
- `404 NOT_FOUND` → Wrong folder structure (step 1)
- `Cannot find module` → Build failed

---

## 🔍 Debugging Checklist

Run through this checklist:

- [ ] **Files at root?** `package.json` visible in GitHub repo root (not in subfolder)
- [ ] **API folder correct?** `api/ask.js` exists at root level
- [ ] **Environment variables set?** All 3 variables in Vercel settings
- [ ] **Redeployed after adding env vars?** Must redeploy to apply them
- [ ] **API health check works?** Visit `/api/ask` in browser (GET request)

---

## 🚀 Step-by-Step Deploy (From Scratch)

If nothing works, start fresh:

### **1. Download Latest Files**
Download the `beer-chatbot-app` folder from Databricks workspace.

### **2. Create New GitHub Repo**
```bash
# Navigate INTO beer-chatbot-app
cd beer-chatbot-app

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/beer-chatbot.git
git branch -M main
git push -u origin main
```

### **3. Deploy to Vercel**
1. Go to https://vercel.com/new
2. **Import your GitHub repo**
3. **Project settings:**
   - Framework Preset: **Create React App**
   - Leave build settings as default
4. **Add Environment Variables** (before deploying):
   - `DATABRICKS_HOST`
   - `DATABRICKS_TOKEN`
   - `ENDPOINT_NAME`
5. Click **Deploy**

### **4. Test**
After deployment:
1. Visit: `https://your-app.vercel.app/api/ask`
   - Should see: `{"status": "ok", ...}`
2. Visit: `https://your-app.vercel.app`
   - Should see the chat interface
3. Ask a question
   - Should get an answer about beer

---

## ⚠️ Common Mistakes

| Mistake | Solution |
|---------|----------|
| Files in nested folder | Move everything to root |
| Forgot to add env vars | Add in Vercel settings → Redeploy |
| Added env vars but didn't redeploy | Click "Redeploy" in Deployments tab |
| Wrong API path | Must be `api/ask.js` (not `api/ask/index.js`) |
| DATABRICKS_TOKEN has spaces | Remove any spaces/newlines from token |

---

## 📞 Still Getting 404?

Share this info for more help:

1. **Your Vercel deployment URL**
2. **Screenshot of GitHub repo (root files visible)**
3. **Screenshot of Vercel env vars** (hide token value)
4. **Error from Vercel Function logs** (Functions tab → api/ask.js → Logs)
5. **What you see when visiting** `/api/ask` directly

---

## ✅ Success Indicators

Your app is working when:

- ✅ `/api/ask` returns `{"status": "ok", ...}`
- ✅ Main page shows the chat interface
- ✅ Typing a question returns an answer
- ✅ No errors in browser console (F12)
- ✅ Network tab shows POST to `/api/ask` with 200 status

---

**📝 Next Steps:**
1. Download updated files from workspace
2. Push to GitHub (make sure files are at root!)
3. Redeploy on Vercel
4. Test the `/api/ask` endpoint
