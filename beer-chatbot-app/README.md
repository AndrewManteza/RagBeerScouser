# 🍺 Beer Knowledge Chatbot

A React + Express web app that uses Databricks RAG to answer questions about beer styles, brewing, and flavors.

## ✨ Features

- 🎯 Ask questions about beer styles, ABV, flavors, and brewing
- 💬 Clean, responsive UI
- 🔒 Secure backend proxy (hides Databricks token)
- ⚡ Serverless deployment on Vercel (free!)

## 🏗️ Architecture

```
User → React Frontend → Express API (Vercel) → Databricks REST API
```

- **Frontend**: React (static)
- **Backend**: Express (Vercel serverless function)
- **AI**: Databricks RAG + Vector Search

## 🚀 Deploy to Vercel (FREE)

### 1. Prerequisites

- GitHub account
- Vercel account (free): https://vercel.com
- Databricks token

### 2. Push to GitHub

```bash
# From your local machine (download the project folder first)
cd beer-chatbot-app
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/beer-chatbot.git
git push -u origin main
```

### 3. Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **Add Environment Variables** (Settings → Environment Variables):
   - `DATABRICKS_HOST` = `https://dbc-ed0aa653-24ab.cloud.databricks.com`
   - `DATABRICKS_TOKEN` = Your Databricks token
   - `ENDPOINT_NAME` = `beer-rag-chatbot-endpoint`

4. Click **Deploy**

Your app will be live at: `https://your-project.vercel.app` 🎉

### 4. Get Your Databricks Token

1. Go to your Databricks workspace
2. User Settings → Developer → Access Tokens
3. Click "Generate New Token"
4. Copy the token
5. Add it to Vercel environment variables

## 💻 Local Development

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your credentials
nano .env

# Start development server
npm run dev
```

Visit: http://localhost:3000

## 📁 Project Structure

```
beer-chatbot-app/
├── api/
│   └── ask.js          # Express serverless function (backend)
├── public/
│   └── index.html      # HTML template
├── src/
│   ├── App.js          # Main React component
│   ├── App.css         # Styles
│   ├── index.js        # React entry point
│   └── index.css       # Global styles
├── package.json        # Dependencies
├── vercel.json         # Vercel config
└── .env.example        # Environment variables template
```

## 🔧 Environment Variables

```bash
DATABRICKS_HOST=https://your-workspace.cloud.databricks.com
DATABRICKS_TOKEN=your_token_here
ENDPOINT_NAME=beer-rag-chatbot-endpoint
```

## 🌐 Does it Work with GitHub Pages?

**❌ No**, GitHub Pages **only hosts static files** (HTML, CSS, JS). It **cannot run backend code** (Express API).

GitHub Pages is like a file server - it serves files as-is but can't execute server-side logic.

### Why Not GitHub Pages?

| Feature | GitHub Pages | Vercel |
|---------|-------------|--------|
| **Static files** | ✅ Yes | ✅ Yes |
| **Backend API** | ❌ No | ✅ Yes (serverless) |
| **Environment secrets** | ❌ No | ✅ Yes |
| **API proxying** | ❌ No | ✅ Yes |

### Alternatives to Vercel

If you don't want Vercel, here are other **free** options that support backend:

1. **Netlify** (free tier) - Similar to Vercel
2. **Railway** (free tier) - Full backend support
3. **Render** (free tier) - Host Express apps
4. **Heroku** (limited free tier) - Classic choice

All of these support Express backends and environment variables.

## 🎯 Example Questions

- "What is the alcohol content of a Lager?"
- "What are the flavors in a Belgian Tripel?"
- "How is an IPA different from a Pale Ale?"
- "Describe a Stout beer"

## 🔗 API Endpoints

### POST `/api/ask`

**Request:**
```json
{
  "question": "What is a Lager?"
}
```

**Response:**
```json
{
  "answer": "A lager is a type of beer that is fermented at cool temperatures..."
}
```

## 📝 License

MIT

## 🤝 Contributing

Pull requests are welcome!

---

Made with 🍺 and Databricks
