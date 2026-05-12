# 🌍 EcoSage — AI Sustainability Chatbot

A retrieval-augmented generation (RAG) chatbot for sustainability education, powered by **Google Gemini API** (free) and **FastAPI**. Ask anything about eco-living, climate change, circular economy, waste reduction, and more — and get answers grounded in a curated knowledge base.

---

## 🏗 Architecture

```
User Question
     │
     ▼
┌─────────────────────────────────────────────────────┐
│                  EcoSage Pipeline                   │
│                                                     │
│  1. Keyword Search  →  find relevant docs           │
│     (in-memory, instant, no GPU needed)             │
│                                                     │
│  2. Context Builder  →  inject top-3 docs           │
│     into the prompt                                 │
│                                                     │
│  3. Gemini API  →  generate grounded answer         │
│     (gemini-2.0-flash-lite — free tier)             │
└─────────────────────────────────────────────────────┘
     │
     ▼
Answer + Source Documents
```

---

## 📦 Tech Stack

| Tool | Purpose | Cost |
|------|---------|------|
| **FastAPI** | REST API server | Free, OSS |
| **Google Gemini API** | LLM generation | Free tier available |
| **google-genai SDK** | Gemini API client | Free, OSS |
| **React + Vite** | Frontend UI | Free, OSS |
| **python-dotenv** | Environment config | Free, OSS |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+ (for frontend)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

---

### Step 1 — Get Your Free Gemini API Key

1. Go to **[aistudio.google.com](https://aistudio.google.com)**
2. Sign in with your Google account
3. Click **"Get API Key"** → **"Create API key"**
4. Copy the key (starts with `AIza...`)

---

### Step 2 — Set Up the Backend

```bash
cd ecosage/backend

# (Optional) Create a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt
```

Edit your `.env` file and add your API key:

```env
GEMINI_API_KEY=AIzaSy...your_key_here
LLM_MODEL=gemini-2.0-flash-lite
TOP_K_DOCS=3
HOST=0.0.0.0
PORT=8000
```

---

### Step 3 — Start the Backend

```bash
uvicorn app:app --reload --port 8000
```

You should see:
```
✅ Loaded 17 docs. Model: gemini-2.0-flash-lite
Application startup complete.
```

Verify it's running by opening: [http://localhost:8000/health](http://localhost:8000/health)

Expected response:
```json
{
  "status": "ok",
  "model": "gemini-2.0-flash-lite",
  "documents_indexed": 17
}
```

---

### Step 4 — Set Up the Frontend

```bash
cd ecosage/frontend/ecosage-ui
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔌 API Endpoints

### `GET /health`
Check if the backend is running.

```bash
curl http://localhost:8000/health
```

---

### `POST /chat`
Send a message and get a RAG-powered response.

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I reduce my plastic use?",
    "history": []
  }'
```

Response:
```json
{
  "answer": "Great question! Here are the most impactful ways to cut plastic...",
  "retrieved_docs": [
    {
      "id": "plastic-001",
      "title": "Reducing Single-Use Plastics at Home",
      "category": "waste",
      "score": null,
      "snippet": "Single-use plastics are one of the biggest contributors..."
    }
  ],
  "model": "gemini-2.0-flash-lite"
}
```

---

### `GET /documents`
List all documents in the knowledge base.

```bash
curl http://localhost:8000/documents
```

---

## 📚 Expanding the Knowledge Base

Add new documents to `knowledge_base.py`:

```python
SUSTAINABILITY_DOCS = [
    # ... existing docs ...
    {
        "id": "your-unique-id",
        "title": "Your Document Title",
        "content": """Your detailed sustainability content here...""",
        "category": "energy",  # waste | energy | food | water | transport | climate
    },
]
```

Restart the backend after adding documents — they load on startup.

---

## 🔧 Switching Gemini Models

Edit `LLM_MODEL` in your `.env`. Available free-tier models:

| Model | Speed | Quality | Free? |
|-------|-------|---------|-------|
| `gemini-2.0-flash-lite` | ⚡ Fastest | Good | ✅ Yes |
| `gemini-2.0-flash` | Fast | Better | ⚠️ Limited |
| `gemini-2.5-flash` | Medium | Best | ⚠️ Limited |

To check which models your API key can access:

```bash
python -c "
from google import genai
client = genai.Client(api_key='YOUR_KEY_HERE')
for m in client.models.list():
    print(m.name)
"
```

---

## 🌱 Project Structure

```
ecosage/
├── backend/
│   ├── app.py              # FastAPI server + Gemini RAG pipeline
│   ├── knowledge_base.py   # Sustainability documents (17 topics)
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables (add your API key here)
├── frontend/
│   ├── EcoSage_v2.jsx      # React chat component
│   └── ecosage-ui/         # Vite React app
└── README.md
```

---

## ⚠️ Troubleshooting

### `502 Bad Gateway — 429 RESOURCE_EXHAUSTED`
You've hit the free tier rate limit. Solutions:
- Wait 1 minute (per-minute limit) or 24 hours (daily limit resets)
- Switch to `gemini-2.0-flash-lite` in `.env` (higher free quota)
- Don't send multiple messages rapidly during testing

### `502 Bad Gateway — 404 NOT_FOUND`
The model name doesn't exist or isn't available in your region.
Run the model list command above to see what's available for your key.

### `Failed to fetch` in the browser
The frontend can't reach the backend. Make sure:
- uvicorn is running on port 8000
- You see `Application startup complete` in the terminal
- Visit [http://localhost:8000/health](http://localhost:8000/health) directly — it should return JSON

### Backend starts but shows `RuntimeError: GEMINI_API_KEY is not set`
- Open `backend/.env` and make sure your key is there with no spaces: `GEMINI_API_KEY=AIza...`
- Restart uvicorn after editing `.env`

---

## 🤝 Contributing

Add more sustainability documents, improve the UI, or add new features like PDF ingestion, web scraping, or persistent storage.

Every contribution helps spread sustainability knowledge! 🌍