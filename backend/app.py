"""
EcoSage RAG Backend — Powered by Gemini API (google-genai SDK)
"""

import os
import logging
from contextlib import asynccontextmanager
from typing import Optional

from google import genai
from google.genai import types
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ecosage")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
LLM_MODEL      = os.getenv("LLM_MODEL", "gemini-2.0-flash")
TOP_K_DOCS     = int(os.getenv("TOP_K_DOCS", "3"))

SYSTEM_PROMPT = """You are EcoSage, a warm and knowledgeable sustainability advisor.
Your role is to help people live more eco-friendly lives and understand environmental issues.
Only discuss topics related to environment, sustainability, ecology, climate, and resources.
If asked about unrelated topics, gently redirect back to sustainability.
Respond warmly and practically. Give concrete, actionable advice.
Keep it concise (3-6 sentences or a short list).
End with one small action the person can take TODAY."""

knowledge_docs: list[dict] = []
gemini_client = None


def retrieve_docs(query: str, top_k: int = TOP_K_DOCS) -> list[dict]:
    query_words = set(query.lower().split())
    stop_words  = {"how", "can", "i", "the", "a", "an", "is", "to", "do", "what", "my", "me"}
    query_words -= stop_words
    scored = []
    for doc in knowledge_docs:
        text  = (doc["title"] + " " + doc["content"]).lower()
        score = sum(1 for w in query_words if w in text)
        if score > 0:
            scored.append((score, doc))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [doc for _, doc in scored[:top_k]]


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


@asynccontextmanager
async def lifespan(app: FastAPI):
    global knowledge_docs, gemini_client

    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set in your .env file!")

    gemini_client = genai.Client(api_key=GEMINI_API_KEY)

    from knowledge_base import SUSTAINABILITY_DOCS
    knowledge_docs = SUSTAINABILITY_DOCS
    logger.info(f"✅ Loaded {len(knowledge_docs)} docs. Model: {LLM_MODEL}")

    yield
    logger.info("🌿 EcoSage shutting down.")


app = FastAPI(title="EcoSage API — Gemini Edition", version="5.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"name": "EcoSage API", "version": "5.0.0", "model": LLM_MODEL, "documents": len(knowledge_docs), "status": "ready"}

@app.get("/health")
async def health():
    return {"status": "ok", "model": LLM_MODEL, "documents_indexed": len(knowledge_docs)}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not gemini_client:
        raise HTTPException(status_code=503, detail="Gemini client not initialised")

    question = request.message.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    logger.info(f"🔍 Query: {question[:80]}")

    retrieved = retrieve_docs(question)

    context = ""
    if retrieved:
        context = "\n\n".join(
            f"[{doc['title']}]\n{doc['content'].strip()}" for doc in retrieved
        )
        context = f"Relevant knowledge base context:\n{context}\n\n"

    # Build history for Gemini
    history = []
    for msg in request.history[-6:]:
        role = "user" if msg.role == "user" else "model"
        history.append(types.Content(role=role, parts=[types.Part(text=msg.content)]))

    user_content = f"{context}User question: {question}"

    try:
        response = gemini_client.models.generate_content(
            model=LLM_MODEL,
            contents=history + [types.Content(role="user", parts=[types.Part(text=user_content)])],
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                max_output_tokens=512,
                temperature=0.7,
            ),
        )
        answer = response.text
    except Exception as e:
        logger.error(f"❌ Gemini API error: {e}")
        raise HTTPException(status_code=502, detail=f"Gemini API error: {str(e)}")

    logger.info(f"✅ Answered. Sources: {[d['title'] for d in retrieved]}")

    sources = [
        {"id": doc["id"], "title": doc["title"], "category": doc["category"], "score": None, "snippet": doc["content"][:200] + "..."}
        for doc in retrieved
    ]

    return ChatResponse(answer=answer, retrieved_docs=sources, model=LLM_MODEL)


@app.get("/documents")
async def list_documents():
    return {"count": len(knowledge_docs), "documents": [{"id": d["id"], "title": d["title"], "category": d["category"]} for d in knowledge_docs]}