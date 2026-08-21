Link to Vercel deployed app: https://ragbeerscouser.vercel.app/

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

Made with Databricks
