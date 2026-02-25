# 🌍 EcoSage : Haystack RAG Sustainability Chatbot

A fully open-source, retrieval-augmented generation (RAG) chatbot for sustainability education.
Ask questions about eco-living, climate change, circular economy, and more : and get answers
grounded in a curated knowledge base.

---

## 🏗 Architecture

```
User Question
     │
     ▼
┌─────────────────────────────────────────────────────┐
│              Haystack RAG Pipeline                  │
│                                                     │
│  1. SentenceTransformers  →  embed query            │
│     (all-MiniLM-L6-v2, runs locally, FREE)          │
│                                                     │
│  2. InMemoryDocumentStore  →  cosine similarity     │
│     (Haystack 2.x, in-memory, FREE)                 │
│                                                     │
│  3. InMemoryEmbeddingRetriever  →  top-4 docs       │
│                                                     │
│  4. PromptBuilder  →  inject context into template  │
│                                                     │
│  5. Claude API  →  generate grounded answer         │
│     (claude-3-5-haiku : fastest & cheapest)         │
└─────────────────────────────────────────────────────┘
     │
     ▼
Answer + Source Documents (with similarity scores)
```

---

## 📦 Free Tools Used

| Tool | Purpose | Cost |
|------|---------|------|
| **Haystack 2.x** | RAG pipeline orchestration | Free, OSS |
| **SentenceTransformers** | Local text embeddings | Free, OSS |
| **`all-MiniLM-L6-v2`** | Embedding model | Free, runs locally |
| **InMemoryDocumentStore** | Vector storage | Free, in-memory |
| **FastAPI** | REST API server | Free, OSS |
| **React** | Frontend UI | Free, OSS |
| **Claude API (Haiku)** | LLM generation | Free tier available |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+ (for frontend)
- Anthropic API key (free at [console.anthropic.com](https://console.anthropic.com))

### 1. Clone & Set Up Backend

```bash
cd ecosage/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install PyTorch CPU-only (smaller download):
pip install torch --index-url https://download.pytorch.org/whl/cpu

# Set up environment
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 2. Start the Backend

```bash
uvicorn app:app --reload --port 8000
```

On first start, you'll see:
```
🌱 EcoSage starting up : initialising Haystack RAG pipeline...
📚 Indexing 15 sustainability documents...
✅ EcoSage ready! 15 documents indexed.
```

### 3. Use the Frontend

**Option A : Claude.ai Artifact** (easiest):
- Open `frontend/EcoSage_v2.jsx` in Claude.ai as an artifact
- It auto-connects to your running backend on `localhost:8000`
- Falls back to direct Claude API if backend is offline

**Option B : React App**:
```bash
cd frontend
npx create-react-app ecosage-ui
cp EcoSage_v2.jsx src/App.jsx
npm start
```

---

## 🔌 API Endpoints

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
      "score": 0.847,
      "snippet": "Single-use plastics are one of the biggest contributors..."
    }
  ],
  "model": "claude-3-5-haiku-20241022"
}
```

### `GET /documents`
List all indexed documents.

### `POST /documents/add`
Add a new document to the knowledge base (no restart needed!):

```bash
curl -X POST "http://localhost:8000/documents/add?title=My+Article&category=energy&content=Your+content+here"
```

### `GET /health`
Check if the backend is running.

---

## 📚 Expanding the Knowledge Base

### Add documents in `knowledge_base.py`
```python
SUSTAINABILITY_DOCS = [
    # ... existing docs ...
    {
        "id": "your-unique-id",
        "title": "Your Document Title",
        "content": """Your detailed sustainability content here...""",
        "category": "energy",  # waste|energy|food|water|transport|climate|etc
    },
]
```

### Add documents at runtime (no restart)
```python
import requests
requests.post("http://localhost:8000/documents/add", params={
    "title": "New Article",
    "content": "Full article text...",
    "category": "food"
})
```

### Load from external sources
```python
# Example: Load from a website using Haystack fetcher
from haystack.components.fetchers import LinkContentFetcher
from haystack.components.converters import HTMLToDocument

fetcher = LinkContentFetcher()
converter = HTMLToDocument()
# ... add to indexing pipeline
```

---

## 🔧 Customisation

### Swap the embedding model
In `app.py`, change:
```python
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"  # Fast, 80MB
# EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"  # More accurate, 420MB
# EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"                  # Very fast, good quality
```

### Use a persistent vector database (free)
Replace `InMemoryDocumentStore` with Chroma (free, open source):
```bash
pip install chromadb haystack-chroma
```
```python
from haystack_integrations.document_stores.chroma import ChromaDocumentStore
document_store = ChromaDocumentStore(collection_name="ecosage")
```

### Swap the LLM (use a free local model)
Replace Claude API with Ollama (free, runs locally):
```bash
# Install Ollama and pull a model
ollama pull llama3.2
```
```python
from haystack_integrations.components.generators.ollama import OllamaGenerator
generator = OllamaGenerator(model="llama3.2", url="http://localhost:11434")
```

---

## 🌱 Project Structure

```
ecosage/
├── backend/
│   ├── app.py              # FastAPI server + Haystack RAG pipeline
│   ├── knowledge_base.py   # Sustainability documents (15 topics)
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
├── frontend/
│   └── EcoSage_v2.jsx      # React chat UI with sources panel
└── README.md
```

---

## 🤝 Contributing

Add more sustainability documents, improve the UI, swap in better models, or 
add new data sources (web scraping, PDF ingestion, etc.).

Every contribution helps spread sustainability knowledge! 🌍
