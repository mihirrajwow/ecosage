"""
EcoSage RAG Backend — 100% FREE, No API Key Required 🌍
Uses Ollama for both embeddings AND text generation (all local).

Stack: FastAPI + Haystack 2.x + Ollama (nomic-embed-text + llama3.2)
Python 3.13 compatible ✅

SETUP:
  1. Install Ollama from https://ollama.com
  2. Pull the required models:
       ollama pull llama3.2          # ~2GB  - the chat LLM
       ollama pull nomic-embed-text  # ~274MB - the embedding model
  3. Run: uvicorn app:app --reload --port 8000
"""

import os
import logging
from contextlib import asynccontextmanager
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from haystack import Pipeline, Document
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack.components.retrievers.in_memory import InMemoryEmbeddingRetriever
from haystack.components.builders import PromptBuilder
from haystack.components.writers import DocumentWriter

from haystack_integrations.components.embedders.ollama import (
    OllamaDocumentEmbedder,
    OllamaTextEmbedder,
)
from haystack_integrations.components.generators.ollama import OllamaGenerator

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ecosage")

# ─── Configuration ───────────────────────────────────────────────────────────
OLLAMA_URL   = os.getenv("OLLAMA_URL",    "http://localhost:11434")
LLM_MODEL    = os.getenv("LLM_MODEL",    "llama3.2")          # chat model
EMBED_MODEL  = os.getenv("EMBED_MODEL",  "nomic-embed-text")  # embedding model
TOP_K_DOCS   = int(os.getenv("TOP_K_DOCS", "3"))

# ─── RAG Prompt ──────────────────────────────────────────────────────────────
RAG_PROMPT = """You are EcoSage, a warm and knowledgeable sustainability advisor.
Your role is to help people live more eco-friendly lives and understand environmental issues.
Only discuss topics related to environment, sustainability, ecology, climate, and resources.
If asked about unrelated topics, gently redirect back to sustainability.

Use the knowledge base passages below to ground your answer with specific facts.

Retrieved Knowledge:
{% for doc in documents %}
--- [{{ doc.meta.title }}] ---
{{ doc.content }}
{% endfor %}

Conversation so far:
{% for msg in history %}
{{ msg.role | upper }}: {{ msg.content }}
{% endfor %}

USER: {{ question }}

Respond warmly and practically. Give concrete, actionable advice.
Keep it concise (3-6 sentences or a short list).
End with one small action the person can take TODAY.

ECOSAGE:"""

# ─── Global state ────────────────────────────────────────────────────────────
document_store:    Optional[InMemoryDocumentStore] = None
retrieval_pipeline: Optional[Pipeline]             = None
indexing_pipeline:  Optional[Pipeline]             = None


# ─── Request / Response models ───────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []

class ChatResponse(BaseModel):
    answer: str
    retrieved_docs: list[dict]
    model: str


# ─── Pipeline builders ───────────────────────────────────────────────────────
def build_indexing_pipeline(store: InMemoryDocumentStore) -> Pipeline:
    """Embed documents locally with Ollama nomic-embed-text and write to store."""
    embedder = OllamaDocumentEmbedder(model=EMBED_MODEL, url=OLLAMA_URL)
    pipe = Pipeline()
    pipe.add_component("embedder", embedder)
    pipe.add_component("writer", DocumentWriter(document_store=store))
    pipe.connect("embedder.documents", "writer.documents")
    return pipe


def build_retrieval_pipeline(store: InMemoryDocumentStore) -> Pipeline:
    """Embed query → retrieve top-k → build prompt → generate with Ollama LLM."""
    text_embedder = OllamaTextEmbedder(model=EMBED_MODEL, url=OLLAMA_URL)
    retriever     = InMemoryEmbeddingRetriever(document_store=store, top_k=TOP_K_DOCS)
    prompt_builder = PromptBuilder(template=RAG_PROMPT)
    llm = OllamaGenerator(
        model=LLM_MODEL,
        url=OLLAMA_URL,
        timeout=300,
        generation_kwargs={"temperature": 0.7, "num_predict": 300},
    )

    pipe = Pipeline()
    pipe.add_component("text_embedder",  text_embedder)
    pipe.add_component("retriever",      retriever)
    pipe.add_component("prompt_builder", prompt_builder)
    pipe.add_component("llm",            llm)

    pipe.connect("text_embedder.embedding",  "retriever.query_embedding")
    pipe.connect("retriever.documents",      "prompt_builder.documents")
    pipe.connect("prompt_builder.prompt",    "llm.prompt")
    return pipe


# ─── Lifespan (startup / shutdown) ───────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    global document_store, retrieval_pipeline, indexing_pipeline

    from knowledge_base import SUSTAINABILITY_DOCS

    logger.info("🌱 EcoSage starting — building Haystack + Ollama RAG pipeline...")
    document_store = InMemoryDocumentStore(embedding_similarity_function="cosine")

    haystack_docs = [
        Document(
            id=doc["id"],
            content=doc["content"].strip(),
            meta={"title": doc["title"], "category": doc["category"]},
        )
        for doc in SUSTAINABILITY_DOCS
    ]

    logger.info(f"📚 Indexing {len(haystack_docs)} sustainability documents via Ollama embedder...")
    indexing_pipeline = build_indexing_pipeline(document_store)
    indexing_pipeline.run({"embedder": {"documents": haystack_docs}})

    retrieval_pipeline = build_retrieval_pipeline(document_store)

    logger.info(f"✅ Ready! {document_store.count_documents()} docs indexed. LLM: {LLM_MODEL}")

    yield  # ← app runs

    logger.info("🌿 EcoSage shutting down.")


# ─── App ─────────────────────────────────────────────────────────────────────
app = FastAPI(title="EcoSage RAG API — Ollama Edition", version="3.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Routes ──────────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "name": "EcoSage RAG API",
        "version": "3.0.0",
        "llm": LLM_MODEL,
        "embedder": EMBED_MODEL,
        "documents": document_store.count_documents() if document_store else 0,
        "api_key_required": False,
        "status": "ready",
    }


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "llm_model": LLM_MODEL,
        "embed_model": EMBED_MODEL,
        "documents_indexed": document_store.count_documents() if document_store else 0,
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Full RAG pipeline:
      query → Ollama embed → retrieve docs → build prompt → Ollama LLM → response
    """
    if not retrieval_pipeline:
        raise HTTPException(status_code=503, detail="Pipeline not initialised yet")

    question = request.message.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    logger.info(f"🔍 Query: {question[:80]}...")

    try:
        result = retrieval_pipeline.run(
            {
                "text_embedder":  {"text": question},
                "prompt_builder": {
                    "question": question,
                    "history":  [m.model_dump() for m in request.history[-6:]],
                },
            }
        )
    except Exception as e:
        logger.error(f"❌ Pipeline error: {e}")
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")

    retrieved_docs = result["retriever"]["documents"]
    answer         = result["llm"]["replies"][0]

    logger.info(f"✅ Answered using: {[d.meta['title'] for d in retrieved_docs]}")

    sources = [
        {
            "id":       doc.id,
            "title":    doc.meta["title"],
            "category": doc.meta["category"],
            "score":    round(doc.score, 3) if doc.score else None,
            "snippet":  doc.content[:200] + "...",
        }
        for doc in retrieved_docs
    ]

    return ChatResponse(answer=answer, retrieved_docs=sources, model=LLM_MODEL)


@app.get("/documents")
async def list_documents():
    if not document_store:
        raise HTTPException(status_code=503, detail="Document store not ready")
    docs = document_store.filter_documents()
    return {
        "count": len(docs),
        "documents": [
            {"id": d.id, "title": d.meta.get("title"), "category": d.meta.get("category")}
            for d in docs
        ],
    }


@app.post("/documents/add")
async def add_document(title: str, content: str, category: str = "general"):
    """Add a new document to the knowledge base at runtime (no restart needed)."""
    if not indexing_pipeline or not document_store:
        raise HTTPException(status_code=503, detail="Pipeline not ready")
    new_doc = Document(content=content, meta={"title": title, "category": category})
    indexing_pipeline.run({"embedder": {"documents": [new_doc]}})
    return {"status": "added", "document_count": document_store.count_documents(), "title": title}
