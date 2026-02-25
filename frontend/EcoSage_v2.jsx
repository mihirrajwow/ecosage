import { useState, useRef, useEffect } from "react";

// ─── Config ────────────────────────────────────────────────────────────────
// Change this to your backend URL when running locally
const API_BASE = "http://localhost:8000";
// Fallback disabled — Claude API is now called from the backend, not the browser
const USE_FALLBACK = false;

const SYSTEM_PROMPT = `You are EcoSage — a warm, knowledgeable sustainability advisor focused on environment, resources, and eco-living. Be practical, encouraging, and end every response with one small action the person can take today. Only discuss sustainability topics.`;

const SUGGESTED_QUESTIONS = [
    "How can I reduce plastic at home?",
    "What's the most impactful diet change for the planet?",
    "How do I start composting in an apartment?",
    "How do I lower my carbon footprint when commuting?",
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

// ─── Floating particles ────────────────────────────────────────────────────
const PARTICLES = ["🌱", "🍃", "🌿", "🌊", "☀️", "🌍", "♻️", "🌲"];

export default function EcoSage() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hello! I'm EcoSage 🌿 — your sustainability companion, now powered by a Haystack RAG pipeline that searches a curated knowledge base before answering.\n\nAsk me anything about reducing waste, saving energy, sustainable food, climate change, or eco-friendly living!",
            sources: [],
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [backendStatus, setBackendStatus] = useState("checking"); // checking | online | offline
    const [activeSources, setActiveSources] = useState(null); // show sources panel
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

    // Check backend health on mount
    useEffect(() => {
        fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(10000) })
            .then((r) => r.json())
            .then((d) =>
                setBackendStatus(d.status === "ok" ? "online" : "offline"),
            )
            .catch(() => setBackendStatus("offline"));
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // ── Send via RAG backend ───────────────────────────────────────────────
    const sendViaBackend = async (question, history) => {
        const res = await fetch(`${API_BASE}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: question,
                history: history
                    .slice(-8)
                    .map((m) => ({ role: m.role, content: m.content })),
            }),
        });
        if (!res.ok) throw new Error(`Backend error: ${res.status}`);
        return await res.json();
    };

    // ── Fallback: direct Claude API ───────────────────────────────────────
    const sendViaFallback = async (question, history) => {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 800,
                system: SYSTEM_PROMPT,
                messages: history
                    .slice(-8)
                    .concat([{ role: "user", content: question }])
                    .map((m) => ({ role: m.role, content: m.content })),
            }),
        });
        const data = await res.json();
        return {
            answer:
                data.content?.[0]?.text ||
                "Sorry, I couldn't respond right now.",
            retrieved_docs: [],
            model: "claude-sonnet-4-20250514 (direct)",
        };
    };

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
            let result;
            if (backendStatus === "online") {
                result = await sendViaBackend(userMsg, newHistory.slice(0, -1));
            } else if (USE_FALLBACK) {
                result = await sendViaFallback(
                    userMsg,
                    newHistory.slice(0, -1),
                );
            } else {
                throw new Error("Backend offline and fallback disabled");
            }

            setMessages([
                ...newHistory,
                {
                    role: "assistant",
                    content: result.answer,
                    sources: result.retrieved_docs || [],
                    model: result.model,
                },
            ]);
        } catch (e) {
            setMessages([
                ...newHistory,
                {
                    role: "assistant",
                    content: `🌿 ${e.message || "Something went wrong. Please try again."}`,
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

    return (
        <div style={s.root}>
            {/* Animated background */}
            <div style={s.bgGlow} />
            {particles.map((p) => (
                <span
                    key={p.id}
                    style={{
                        ...s.particle,
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

            {/* Main layout */}
            <div style={s.layout}>
                {/* ── Sidebar ── */}
                <aside style={s.sidebar}>
                    <div style={s.sideHeader}>
                        <div style={s.logo}>🌍</div>
                        <div>
                            <h1 style={s.sideTitle}>EcoSage</h1>
                            <p style={s.sideTagline}>RAG-Powered</p>
                        </div>
                    </div>

                    {/* Backend status */}
                    <div style={s.statusCard}>
                        <div
                            style={{
                                ...s.statusBadge,
                                background:
                                    backendStatus === "online"
                                        ? "rgba(16,185,129,0.15)"
                                        : backendStatus === "offline"
                                          ? "rgba(239,68,68,0.15)"
                                          : "rgba(251,191,36,0.15)",
                            }}
                        >
                            <span
                                style={{
                                    ...s.statusDot,
                                    background:
                                        backendStatus === "online"
                                            ? "#10b981"
                                            : backendStatus === "offline"
                                              ? "#ef4444"
                                              : "#fbbf24",
                                }}
                            />
                            <span style={s.statusLabel}>
                                {backendStatus === "online"
                                    ? "RAG Backend Online"
                                    : backendStatus === "offline"
                                      ? "Using Direct API"
                                      : "Connecting..."}
                            </span>
                        </div>
                        <p style={s.statusDesc}>
                            {backendStatus === "online"
                                ? "Haystack pipeline active — answers grounded in knowledge base"
                                : "Start the Python backend for full RAG functionality"}
                        </p>
                    </div>

                    {/* Pipeline info */}
                    <div style={s.pipelineCard}>
                        <p style={s.pipelineTitle}>🔧 RAG Pipeline</p>
                        <div style={s.pipelineStep}>
                            <span style={s.stepNum}>1</span>
                            <span style={s.stepText}>
                                SentenceTransformers embed query
                            </span>
                        </div>
                        <div style={s.pipelineStep}>
                            <span style={s.stepNum}>2</span>
                            <span style={s.stepText}>
                                InMemoryDocumentStore retrieves top-4
                            </span>
                        </div>
                        <div style={s.pipelineStep}>
                            <span style={s.stepNum}>3</span>
                            <span style={s.stepText}>
                                PromptBuilder injects context
                            </span>
                        </div>
                        <div style={s.pipelineStep}>
                            <span style={s.stepNum}>4</span>
                            <span style={s.stepText}>
                                Claude generates grounded answer
                            </span>
                        </div>
                    </div>

                    {/* Knowledge base topics */}
                    <div style={s.kbCard}>
                        <p style={s.pipelineTitle}>📚 Knowledge Base</p>
                        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                            <div key={cat} style={s.kbTopic}>
                                <span
                                    style={{ ...s.kbDot, background: color }}
                                />
                                <span style={s.kbLabel}>
                                    {CATEGORY_ICONS[cat]}{" "}
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </span>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* ── Chat panel ── */}
                <div style={s.chatPanel}>
                    <header style={s.chatHeader}>
                        <div>
                            <h2 style={s.chatTitle}>Sustainability Chat</h2>
                            <p style={s.chatSubtitle}>
                                Retrieval-Augmented Generation · Free & Open
                                Source Stack
                            </p>
                        </div>
                        <div style={s.stackBadges}>
                            {[
                                "Haystack 2.x",
                                "SentenceTransformers",
                                "FastAPI",
                                "Claude",
                            ].map((b) => (
                                <span key={b} style={s.stackBadge}>
                                    {b}
                                </span>
                            ))}
                        </div>
                    </header>

                    {/* Messages */}
                    <div style={s.messages}>
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                style={{
                                    ...s.row,
                                    justifyContent:
                                        msg.role === "user"
                                            ? "flex-end"
                                            : "flex-start",
                                }}
                            >
                                {msg.role === "assistant" && (
                                    <div style={s.avatar}>🌿</div>
                                )}
                                <div style={{ maxWidth: "78%" }}>
                                    <div
                                        style={{
                                            ...s.bubble,
                                            ...(msg.role === "user"
                                                ? s.userBubble
                                                : s.botBubble),
                                        }}
                                    >
                                        <p style={s.bubbleText}>
                                            {msg.content}
                                        </p>
                                    </div>
                                    {/* Sources pill */}
                                    {msg.sources?.length > 0 && (
                                        <button
                                            style={s.sourcesPill}
                                            onClick={() =>
                                                setActiveSources(
                                                    activeSources === i
                                                        ? null
                                                        : i,
                                                )
                                            }
                                        >
                                            📄 {msg.sources.length} source
                                            {msg.sources.length > 1
                                                ? "s"
                                                : ""}{" "}
                                            retrieved
                                            {activeSources === i ? " ▲" : " ▼"}
                                        </button>
                                    )}
                                    {/* Sources expanded */}
                                    {activeSources === i &&
                                        msg.sources?.length > 0 && (
                                            <div style={s.sourcesPanel}>
                                                {msg.sources.map((src, j) => (
                                                    <div
                                                        key={j}
                                                        style={s.sourceCard}
                                                    >
                                                        <div
                                                            style={
                                                                s.sourceHeader
                                                            }
                                                        >
                                                            <span
                                                                style={{
                                                                    ...s.catBadge,
                                                                    background:
                                                                        CATEGORY_COLORS[
                                                                            src
                                                                                .category
                                                                        ] ||
                                                                        "#64748b",
                                                                }}
                                                            >
                                                                {
                                                                    CATEGORY_ICONS[
                                                                        src
                                                                            .category
                                                                    ]
                                                                }{" "}
                                                                {src.category}
                                                            </span>
                                                            {src.score && (
                                                                <span
                                                                    style={
                                                                        s.score
                                                                    }
                                                                >
                                                                    score:{" "}
                                                                    {src.score}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p
                                                            style={
                                                                s.sourceTitle
                                                            }
                                                        >
                                                            {src.title}
                                                        </p>
                                                        <p
                                                            style={
                                                                s.sourceSnippet
                                                            }
                                                        >
                                                            {src.snippet}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                </div>
                                {msg.role === "user" && (
                                    <div style={s.userAv}>🧑</div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div
                                style={{
                                    ...s.row,
                                    justifyContent: "flex-start",
                                }}
                            >
                                <div style={s.avatar}>🌿</div>
                                <div style={{ ...s.bubble, ...s.botBubble }}>
                                    <div style={s.dots}>
                                        <span
                                            style={{
                                                ...s.dot,
                                                animationDelay: "0s",
                                            }}
                                        />
                                        <span
                                            style={{
                                                ...s.dot,
                                                animationDelay: "0.2s",
                                            }}
                                        />
                                        <span
                                            style={{
                                                ...s.dot,
                                                animationDelay: "0.4s",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Suggestions */}
                        {messages.length === 1 && (
                            <div style={s.suggestWrap}>
                                <p style={s.suggestLabel}>Try asking:</p>
                                <div style={s.chips}>
                                    {SUGGESTED_QUESTIONS.map((q, i) => (
                                        <button
                                            key={i}
                                            style={s.chip}
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
                    <div style={s.inputWrap}>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Ask about sustainability, climate, eco-tips..."
                            style={s.input}
                            rows={1}
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={loading || !input.trim()}
                            style={{
                                ...s.sendBtn,
                                opacity: loading || !input.trim() ? 0.4 : 1,
                            }}
                        >
                            ↑
                        </button>
                    </div>
                    <p style={s.footer}>
                        {backendStatus === "online"
                            ? "🌿 Haystack RAG · SentenceTransformers · FastAPI · Claude"
                            : "🌿 Claude Direct · Start backend for full RAG mode"}{" "}
                        · All free & open source
                    </p>
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes floatUp { from { transform: translateY(105vh) rotate(0deg); } to { transform: translateY(-5vh) rotate(360deg); } }
        @keyframes bounce { 0%,80%,100% { transform:scale(0.6);opacity:0.4; } 40% { transform:scale(1);opacity:1; } }
        textarea::placeholder { color: rgba(167,243,208,0.3); }
        textarea { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.2); border-radius: 4px; }
      `}</style>
        </div>
    );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const s = {
    root: {
        minHeight: "100vh",
        background:
            "linear-gradient(160deg, #020c06 0%, #041a0e 50%, #050f08 100%)",
        fontFamily: "'Sora', sans-serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "stretch",
    },
    bgGlow: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background:
            "radial-gradient(ellipse at 20% 60%, rgba(16,185,129,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(6,95,70,0.06) 0%, transparent 55%)",
    },
    particle: {
        position: "fixed",
        bottom: "-5%",
        animation: "floatUp linear infinite",
        pointerEvents: "none",
        userSelect: "none",
    },
    layout: {
        display: "flex",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        zIndex: 10,
        minHeight: "100vh",
    },

    // ── Sidebar ──
    sidebar: {
        width: "260px",
        flexShrink: 0,
        borderRight: "1px solid rgba(52,211,153,0.08)",
        padding: "28px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        background: "rgba(4,15,8,0.4)",
        overflowY: "auto",
    },
    sideHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "4px",
    },
    logo: {
        width: "44px",
        height: "44px",
        borderRadius: "14px",
        background: "linear-gradient(135deg,#065f46,#10b981)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.4rem",
        flexShrink: 0,
        boxShadow: "0 0 20px rgba(16,185,129,0.25)",
    },
    sideTitle: {
        fontFamily: "'Space Mono', monospace",
        fontSize: "1.1rem",
        color: "#a7f3d0",
        margin: 0,
        fontWeight: 700,
    },
    sideTagline: {
        fontSize: "0.62rem",
        color: "rgba(167,243,208,0.4)",
        margin: 0,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        marginTop: "2px",
    },
    statusCard: {
        background: "rgba(6,30,16,0.5)",
        borderRadius: "12px",
        border: "1px solid rgba(52,211,153,0.1)",
        padding: "12px",
    },
    statusBadge: {
        display: "flex",
        alignItems: "center",
        gap: "7px",
        padding: "5px 10px",
        borderRadius: "20px",
        marginBottom: "8px",
        width: "fit-content",
    },
    statusDot: {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        flexShrink: 0,
    },
    statusLabel: { fontSize: "0.72rem", color: "#d1fae5", fontWeight: 500 },
    statusDesc: {
        fontSize: "0.68rem",
        color: "rgba(167,243,208,0.4)",
        margin: 0,
        lineHeight: 1.5,
    },
    pipelineCard: {
        background: "rgba(6,30,16,0.5)",
        borderRadius: "12px",
        border: "1px solid rgba(52,211,153,0.1)",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    pipelineTitle: {
        fontSize: "0.7rem",
        color: "#6ee7b7",
        margin: "0 0 4px 0",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontWeight: 600,
    },
    pipelineStep: { display: "flex", alignItems: "flex-start", gap: "8px" },
    stepNum: {
        width: "18px",
        height: "18px",
        borderRadius: "50%",
        background: "rgba(16,185,129,0.2)",
        border: "1px solid rgba(16,185,129,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.6rem",
        color: "#6ee7b7",
        flexShrink: 0,
        fontWeight: 700,
    },
    stepText: {
        fontSize: "0.68rem",
        color: "rgba(167,243,208,0.6)",
        lineHeight: 1.4,
    },
    kbCard: {
        background: "rgba(6,30,16,0.5)",
        borderRadius: "12px",
        border: "1px solid rgba(52,211,153,0.1)",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    },
    kbTopic: { display: "flex", alignItems: "center", gap: "7px" },
    kbDot: { width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0 },
    kbLabel: { fontSize: "0.68rem", color: "rgba(167,243,208,0.55)" },

    // ── Chat Panel ──
    chatPanel: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        height: "100vh",
    },
    chatHeader: {
        padding: "20px 24px 16px",
        borderBottom: "1px solid rgba(52,211,153,0.08)",
        background: "rgba(4,15,8,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
    },
    chatTitle: {
        fontFamily: "'Space Mono', monospace",
        fontSize: "1.1rem",
        color: "#a7f3d0",
        margin: 0,
    },
    chatSubtitle: {
        fontSize: "0.65rem",
        color: "rgba(167,243,208,0.35)",
        margin: 0,
        marginTop: "3px",
        letterSpacing: "0.05em",
    },
    stackBadges: { display: "flex", gap: "6px", flexWrap: "wrap" },
    stackBadge: {
        background: "rgba(16,185,129,0.1)",
        border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: "6px",
        padding: "3px 8px",
        fontSize: "0.62rem",
        color: "#6ee7b7",
        letterSpacing: "0.05em",
    },
    messages: {
        flex: 1,
        overflowY: "auto",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },
    row: { display: "flex", alignItems: "flex-end", gap: "10px" },
    avatar: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        background: "linear-gradient(135deg,#065f46,#047857)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
        flexShrink: 0,
        border: "1px solid rgba(52,211,153,0.2)",
    },
    userAv: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        background: "rgba(20,50,30,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
        flexShrink: 0,
        border: "1px solid rgba(52,211,153,0.15)",
    },
    bubble: { padding: "11px 15px", borderRadius: "16px", lineHeight: 1.6 },
    botBubble: {
        background: "rgba(6,30,16,0.7)",
        border: "1px solid rgba(52,211,153,0.1)",
        borderBottomLeftRadius: "4px",
    },
    userBubble: {
        background: "linear-gradient(135deg,#065f46,#047857)",
        border: "1px solid rgba(52,211,153,0.2)",
        borderBottomRightRadius: "4px",
        boxShadow: "0 4px 14px rgba(5,150,105,0.2)",
    },
    bubbleText: {
        margin: 0,
        fontSize: "0.85rem",
        color: "#d1fae5",
        whiteSpace: "pre-wrap",
    },
    sourcesPill: {
        marginTop: "6px",
        background: "rgba(16,185,129,0.08)",
        border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: "20px",
        padding: "4px 12px",
        fontSize: "0.7rem",
        color: "#6ee7b7",
        cursor: "pointer",
        display: "inline-block",
        fontFamily: "'Sora', sans-serif",
    },
    sourcesPanel: {
        marginTop: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    sourceCard: {
        background: "rgba(4,20,10,0.7)",
        border: "1px solid rgba(52,211,153,0.1)",
        borderRadius: "10px",
        padding: "10px 12px",
    },
    sourceHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "5px",
    },
    catBadge: {
        fontSize: "0.62rem",
        padding: "2px 8px",
        borderRadius: "10px",
        color: "#020c06",
        fontWeight: 600,
        letterSpacing: "0.05em",
    },
    score: {
        fontSize: "0.6rem",
        color: "rgba(167,243,208,0.4)",
        fontFamily: "'Space Mono', monospace",
    },
    sourceTitle: {
        fontSize: "0.73rem",
        color: "#a7f3d0",
        fontWeight: 600,
        margin: "0 0 4px 0",
    },
    sourceSnippet: {
        fontSize: "0.67rem",
        color: "rgba(167,243,208,0.45)",
        margin: 0,
        lineHeight: 1.5,
    },
    dots: {
        display: "flex",
        gap: "5px",
        alignItems: "center",
        padding: "2px 4px",
    },
    dot: {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        background: "#6ee7b7",
        animation: "bounce 1.2s infinite",
    },
    suggestWrap: { marginTop: "6px" },
    suggestLabel: {
        fontSize: "0.65rem",
        color: "rgba(167,243,208,0.35)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: "10px",
    },
    chips: { display: "flex", flexWrap: "wrap", gap: "7px" },
    chip: {
        background: "rgba(6,30,16,0.6)",
        border: "1px solid rgba(52,211,153,0.18)",
        borderRadius: "20px",
        padding: "6px 14px",
        fontSize: "0.74rem",
        color: "#a7f3d0",
        cursor: "pointer",
        fontFamily: "'Sora', sans-serif",
        textAlign: "left",
    },
    inputWrap: {
        display: "flex",
        gap: "10px",
        padding: "14px 20px",
        borderTop: "1px solid rgba(52,211,153,0.08)",
        background: "rgba(4,12,6,0.7)",
        alignItems: "center",
    },
    input: {
        flex: 1,
        background: "rgba(6,28,14,0.8)",
        border: "1px solid rgba(52,211,153,0.18)",
        borderRadius: "14px",
        padding: "11px 15px",
        color: "#d1fae5",
        fontSize: "0.85rem",
        fontFamily: "'Sora', sans-serif",
        resize: "none",
        lineHeight: 1.5,
        transition: "border-color 0.2s",
    },
    sendBtn: {
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        background: "linear-gradient(135deg,#059669,#047857)",
        border: "none",
        fontSize: "1.2rem",
        color: "white",
        cursor: "pointer",
        flexShrink: 0,
        boxShadow: "0 4px 14px rgba(5,150,105,0.3)",
        transition: "opacity 0.2s",
    },
    footer: {
        textAlign: "center",
        fontSize: "0.6rem",
        color: "rgba(167,243,208,0.2)",
        padding: "0 20px 12px",
        margin: 0,
        letterSpacing: "0.04em",
    },
};
