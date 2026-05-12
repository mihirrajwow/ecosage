import React, { useState, useRef, useEffect } from "react";
import "./App.css";

// ─── Config ────────────────────────────────────────────────────────────────
const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "";
console.log("API URL:", REACT_APP_API_URL); // check browser DevTools console

const SUGGESTED_QUESTIONS = [
    "How can I reduce plastic at home?",
    "What's the most impactful diet change for the planet?",
    "How do I start composting in an apartment?",
    "How do I lower my carbon footprint commuting?",
    "What does the circular economy mean in practice?",
    "How can I save water every day?",
];

const CATEGORY_COLORS = {
    waste: "#10b981",
    energy: "#f59e0b",
    food: "#84cc16",
    water: "#38bdf8",
    transport: "#818cf8",
    climate: "#fb923c",
    circular: "#a78bfa",
    biodiversity: "#34d399",
    buildings: "#6ee7b7",
    consumption: "#f472b6",
    policy: "#94a3b8",
    general: "#64748b",
};

const CATEGORY_ICONS = {
    waste: "♻️",
    energy: "⚡",
    food: "🥗",
    water: "💧",
    transport: "🚲",
    climate: "🌡️",
    circular: "🔄",
    biodiversity: "🦋",
    buildings: "🏡",
    consumption: "🛍️",
    policy: "📢",
    general: "🌱",
};

const PARTICLES = ["🌱", "🍃", "🌿", "🌊", "☀️", "🌍", "♻️", "🌲"];

// ─── Helper Components ─────────────────────────────────────────────────────

function TypingDots() {
    return (
        <div className="typing-dots">
            <span className="dot" style={{ animationDelay: "0s" }} />
            <span className="dot" style={{ animationDelay: "0.2s" }} />
            <span className="dot" style={{ animationDelay: "0.4s" }} />
        </div>
    );
}

function SourceCard({ src }) {
    const color = CATEGORY_COLORS[src.category] || "#64748b";
    const icon = CATEGORY_ICONS[src.category] || "🌱";
    return (
        <div className="source-card">
            <div className="source-card-header">
                <span className="cat-badge" style={{ background: color }}>
                    {icon} {src.category}
                </span>
                {src.score && (
                    <span className="source-score">score: {src.score}</span>
                )}
            </div>
            <p className="source-title">{src.title}</p>
            <p className="source-snippet">{src.snippet}</p>
        </div>
    );
}

function Message({ msg, index, activeSource, onToggleSource }) {
    const isUser = msg.role === "user";
    return (
        <div className={`message-row ${isUser ? "user-row" : "bot-row"}`}>
            {!isUser && <div className="avatar bot-avatar">🌿</div>}
            <div className="bubble-wrap">
                <div
                    className={`bubble ${isUser ? "user-bubble" : "bot-bubble"}`}
                >
                    <p className="bubble-text">{msg.content}</p>
                </div>
                {msg.sources?.length > 0 && (
                    <button
                        className="sources-pill"
                        onClick={() => onToggleSource(index)}
                    >
                        📄 {msg.sources.length} source
                        {msg.sources.length > 1 ? "s" : ""} retrieved
                        {activeSource === index ? " ▲" : " ▼"}
                    </button>
                )}
                {activeSource === index && msg.sources?.length > 0 && (
                    <div className="sources-panel">
                        {msg.sources.map((src, i) => (
                            <SourceCard key={i} src={src} />
                        ))}
                    </div>
                )}
            </div>
            {isUser && <div className="avatar user-avatar">🧑</div>}
        </div>
    );
}

// ─── Main App ──────────────────────────────────────────────────────────────
export default function App() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hello! I'm EcoSage 🌿 — your sustainability companion powered by a local Haystack RAG pipeline + Ollama (llama3.2).\n\nAsk me anything about reducing waste, saving energy, sustainable food, climate change, or eco-friendly living!",
            sources: [],
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [backendStatus, setBackendStatus] = useState("checking");
    const [activeSource, setActiveSource] = useState(null);
    const [particles] = useState(() =>
        Array.from({ length: 14 }, (_, i) => ({
            id: i,
            icon: PARTICLES[i % PARTICLES.length],
            left: `${(i * 7.3) % 96}%`,
            delay: `${(i * 1.3) % 10}s`,
            dur: `${14 + ((i * 2.1) % 10)}s`,
            size: `${0.7 + ((i * 0.15) % 0.9)}rem`,
            opacity: 0.06 + ((i * 0.013) % 0.1),
        })),
    );
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    // Health check
    useEffect(() => {
        const controller = new AbortController();
        fetch(`${REACT_APP_API_URL}/health`, { signal: controller.signal })
            .then((r) => r.json())
            .then((d) =>
                setBackendStatus(d.status === "ok" ? "online" : "offline"),
            )
            .catch(() => setBackendStatus("offline"));
        return () => controller.abort();
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const toggleSource = (index) =>
        setActiveSource((prev) => (prev === index ? null : index));

    const sendMessage = async (text) => {
        const userMsg = (text || input).trim();
        if (!userMsg || loading) return;
        setInput("");

        const newHistory = [
            ...messages,
            { role: "user", content: userMsg, sources: [] },
        ];
        setMessages(newHistory);
        setLoading(true);

        try {
            if (backendStatus !== "online")
                throw new Error(
                    "Backend is offline. Make sure uvicorn is running on render.",
                );

            const res = await fetch(`${REACT_APP_API_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    history: newHistory
                        .slice(0, -1)
                        .slice(-6)
                        .map((m) => ({
                            role: m.role,
                            content: m.content,
                        })),
                }),
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();

            setMessages([
                ...newHistory,
                {
                    role: "assistant",
                    content: data.answer,
                    sources: data.retrieved_docs || [],
                    model: data.model,
                },
            ]);
        } catch (err) {
            setMessages([
                ...newHistory,
                {
                    role: "assistant",
                    content: `⚠️ ${err.message}`,
                    sources: [],
                },
            ]);
        }
        setLoading(false);
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const statusLabel =
        backendStatus === "online"
            ? "Ollama RAG Online ✅"
            : backendStatus === "offline"
              ? "Backend Offline ❌"
              : "Connecting...";
    const statusClass =
        backendStatus === "online"
            ? "status-online"
            : backendStatus === "offline"
              ? "status-offline"
              : "status-checking";

    return (
        <div className="root">
            {/* Background glow */}
            <div className="bg-glow" />

            {/* Floating particles */}
            {particles.map((p) => (
                <span
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.left,
                        animationDuration: p.dur,
                        animationDelay: p.delay,
                        fontSize: p.size,
                        opacity: p.opacity,
                    }}
                >
                    {p.icon}
                </span>
            ))}

            <div className="layout">
                {/* ── Sidebar ────────────────────────────────────────────── */}
                <aside className="sidebar">
                    <div className="side-header">
                        <div className="logo">🌍</div>
                        <div>
                            <h1 className="side-title">EcoSage</h1>
                            <p className="side-tagline">RAG · Local · Free</p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="status-card">
                        <div className={`status-badge ${statusClass}`}>
                            <span className="status-dot" />
                            <span className="status-label">{statusLabel}</span>
                        </div>
                        <p className="status-desc">
                            {backendStatus === "online"
                                ? "Haystack pipeline active — answers grounded in knowledge base"
                                : "Backend offline — check your API server"}
                        </p>
                    </div>

                    {/* Pipeline steps */}
                    <div className="info-card">
                        <p className="card-title">🔧 RAG Pipeline</p>
                        {[
                            "Ollama embeds your query",
                            "InMemoryStore retrieves top-4 docs",
                            "PromptBuilder injects context",
                            "llama3.2 generates answer",
                        ].map((step, i) => (
                            <div className="pipeline-step" key={i}>
                                <span className="step-num">{i + 1}</span>
                                <span className="step-text">{step}</span>
                            </div>
                        ))}
                    </div>

                    {/* Knowledge base */}
                    <div className="info-card">
                        <p className="card-title">📚 Knowledge Base</p>
                        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                            <div className="kb-topic" key={cat}>
                                <span
                                    className="kb-dot"
                                    style={{ background: color }}
                                />
                                <span className="kb-label">
                                    {CATEGORY_ICONS[cat]}{" "}
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </span>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* ── Chat Panel ─────────────────────────────────────────── */}
                <div className="chat-panel">
                    <header className="chat-header">
                        <div>
                            <h2 className="chat-title">Sustainability Chat</h2>
                            <p className="chat-subtitle">
                                Haystack 2.x · Ollama · nomic-embed-text ·
                                llama3.2
                            </p>
                        </div>
                        <div className="stack-badges">
                            {["Haystack", "Ollama", "FastAPI", "React"].map(
                                (b) => (
                                    <span className="stack-badge" key={b}>
                                        {b}
                                    </span>
                                ),
                            )}
                        </div>
                    </header>

                    {/* Messages */}
                    <div className="messages">
                        {messages.map((msg, i) => (
                            <Message
                                key={i}
                                msg={msg}
                                index={i}
                                activeSource={activeSource}
                                onToggleSource={toggleSource}
                            />
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div className="message-row bot-row">
                                <div className="avatar bot-avatar">🌿</div>
                                <div className="bubble-wrap">
                                    <div className="bubble bot-bubble">
                                        <TypingDots />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Suggested questions — only at start */}
                        {messages.length === 1 && (
                            <div className="suggestions-wrap">
                                <p className="suggest-label">Try asking:</p>
                                <div className="chips">
                                    {SUGGESTED_QUESTIONS.map((q, i) => (
                                        <button
                                            key={i}
                                            className="chip"
                                            onClick={() => sendMessage(q)}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="input-wrap">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Ask about sustainability, climate, eco-tips..."
                            className="chat-input"
                            rows={1}
                        />
                        <button
                            className={`send-btn ${loading || !input.trim() ? "send-disabled" : ""}`}
                            onClick={() => sendMessage()}
                            disabled={loading || !input.trim()}
                        >
                            ↑
                        </button>
                    </div>

                    <p className="footer">
                        🌿 100% local · No API key · Ollama + Haystack + FastAPI
                        + React
                    </p>
                </div>
            </div>
        </div>
    );
}
