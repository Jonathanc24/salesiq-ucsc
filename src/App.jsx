import { useState, useEffect, useRef } from "react";
import logoUCSC from "./assets/logo-ucsc.png";

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  es: {
    tagline: "Simulador de Ventas con Inteligencia Artificial",
    subtitle: "Presenta tu plan de marketing a compradores reales simulados por IA. Recibe feedback inmediato y mejora tus habilidades de venta.",
    step1: "01 — Selecciona el perfil del comprador",
    step2: "02 — Describe tu producto o plan de marketing",
    pitchPlaceholder: "Describe tu producto o servicio: ¿qué problema resuelve?, ¿a quién va dirigido?, ¿cuál es tu precio?, ¿por qué alguien debería comprarlo?",
    startBtn: "Iniciar Evaluación →",
    selectFirst: "Selecciona un comprador →",
    enterPitch: "Ingresa tu pitch →",
    inputPlaceholder: "Responde al comprador... (Enter para enviar)",
    summaryBtn: "Ver Resumen →",
    responses: "respuestas",
    positive: "POSITIVO",
    critical: "CRÍTICO",
    recommendation: "RECOMENDACIÓN",
    buyProb: "Prob. de Compra",
    wouldBuy: "✓ Compraría",
    wouldNotBuy: "✗ No compraría",
    threshold: "Umbral",
    interests: "Intereses clave",
    summaryTitle1: "¡Venta Exitosa!",
    summaryTitle2: "Necesitas Mejorar",
    exchanges: "intercambios",
    buyProbLabel: "Probabilidad de compra final",
    thresholdLabel: "Umbral de compra",
    evolution: "Evolución de la evaluación",
    strength: "FORTALEZA",
    weakness: "DEBILIDAD",
    nextStep: "PRÓXIMO PASO",
    overallGrade: "Calificación general",
    gradeA: "Pitch convincente y profesional",
    gradeB: "Buen fundamento, puede mejorar",
    gradeC: "Necesita trabajo significativo",
    gradeD: "Requiere reformulación profunda",
    newEval: "Nueva Evaluación →",
    settings: "Ajustes",
    language: "Idioma",
    accentColor: "Color de acento",
    profileOf: "Perfil:",
    charCount: "caracteres — más detalle = mejor evaluación",
    voiceBtn: "Ver Resumen",
    evalSection: "Evaluación en tiempo real",
  },
  en: {
    tagline: "AI-Powered Sales Simulator",
    subtitle: "Present your marketing plan to real buyer personas simulated by AI. Get instant feedback and sharpen your sales skills.",
    step1: "01 — Select the buyer profile",
    step2: "02 — Describe your product or marketing plan",
    pitchPlaceholder: "Describe your product or service: what problem does it solve?, who is it for?, what's the price?, why should someone buy it?",
    startBtn: "Start Evaluation →",
    selectFirst: "Select a buyer →",
    enterPitch: "Enter your pitch →",
    inputPlaceholder: "Reply to the buyer... (Enter to send)",
    summaryBtn: "View Summary →",
    responses: "responses",
    positive: "POSITIVE",
    critical: "CRITICAL",
    recommendation: "RECOMMENDATION",
    buyProb: "Buy Probability",
    wouldBuy: "✓ Would Buy",
    wouldNotBuy: "✗ Would Not Buy",
    threshold: "Threshold",
    interests: "Key interests",
    summaryTitle1: "Successful Sale!",
    summaryTitle2: "Room to Improve",
    exchanges: "exchanges",
    buyProbLabel: "Final buy probability",
    thresholdLabel: "Buy threshold",
    evolution: "Evaluation evolution",
    strength: "STRENGTH",
    weakness: "WEAKNESS",
    nextStep: "NEXT STEP",
    overallGrade: "Overall grade",
    gradeA: "Convincing and professional pitch",
    gradeB: "Good foundation, room to improve",
    gradeC: "Needs significant work",
    gradeD: "Requires deep rethinking",
    newEval: "New Evaluation →",
    settings: "Settings",
    language: "Language",
    accentColor: "Accent color",
    profileOf: "Profile:",
    charCount: "characters — more detail = better evaluation",
    voiceBtn: "View Summary",
    evalSection: "Live evaluation",
  }
};

// ─── BUYER PROFILES ───────────────────────────────────────────────────────────
const PROFILES = (lang) => [
  {
    id: "retail", avatar: "🛍️",
    name: lang === "es" ? "Ana Martínez" : "Ana Martínez",
    role: lang === "es" ? "Compradora Retail / Consumidor Final" : "Retail Buyer / End Consumer",
    personality: lang === "es"
      ? "Soy una consumidora típica que busca valor real por mi dinero. Me gustan las cosas fáciles de usar y que resuelvan mis problemas del día a día. Desconfío del marketing exagerado."
      : "I'm a typical consumer looking for real value for my money. I like things that are easy to use and solve my everyday problems. I distrust exaggerated marketing.",
    focus: lang === "es"
      ? ["precio justo", "facilidad de uso", "confianza", "experiencia de compra"]
      : ["fair price", "ease of use", "trust", "shopping experience"],
    skepticism: 0.45, buyThreshold: 0.58,
    color: "#e85d04",
  },
  {
    id: "b2b", avatar: "🏢",
    name: "Ricardo Salinas",
    role: lang === "es" ? "Director de Compras B2B" : "B2B Purchasing Director",
    personality: lang === "es"
      ? "Tomo decisiones de compra para una empresa de 150 empleados. Necesito ROI claro, integración con nuestros sistemas y un proveedor confiable con soporte postventa."
      : "I make purchasing decisions for a 150-employee company. I need clear ROI, integration with our systems, and a reliable vendor with after-sales support.",
    focus: lang === "es"
      ? ["ROI demostrable", "integración técnica", "soporte", "contrato y garantías"]
      : ["demonstrable ROI", "technical integration", "support", "contract & guarantees"],
    skepticism: 0.70, buyThreshold: 0.68,
    color: "#2563eb",
  },
  {
    id: "luxury", avatar: "💎",
    name: "Isabella Fontaine",
    role: lang === "es" ? "Cliente de Lujo / Premium" : "Luxury / Premium Client",
    personality: lang === "es"
      ? "Tengo altos estándares y espero exclusividad, calidad impecable y una experiencia de compra excepcional. El precio no es mi principal objeción, pero sí la exclusividad y el estatus."
      : "I have high standards and expect exclusivity, impeccable quality, and an exceptional buying experience. Price isn't my main concern — exclusivity and status are.",
    focus: lang === "es"
      ? ["exclusividad", "calidad premium", "marca y estatus", "experiencia VIP"]
      : ["exclusivity", "premium quality", "brand & status", "VIP experience"],
    skepticism: 0.60, buyThreshold: 0.72,
    color: "#7c3aed",
  },
  {
    id: "price", avatar: "💰",
    name: "Carlos Vega",
    role: lang === "es" ? "Cliente Precio-Sensible" : "Price-Sensitive Buyer",
    personality: lang === "es"
      ? "Comparo todo antes de comprar. Necesito el mejor precio del mercado y que me demuestres que vale cada peso. Busco descuentos, garantías y el mayor beneficio por el menor costo."
      : "I compare everything before buying. I need the best price on the market and proof it's worth every cent. I look for discounts, guarantees, and maximum value for minimum cost.",
    focus: lang === "es"
      ? ["precio más bajo", "comparación de mercado", "descuentos y promociones", "relación precio-valor"]
      : ["lowest price", "market comparison", "discounts & promotions", "price-value ratio"],
    skepticism: 0.55, buyThreshold: 0.55,
    color: "#059669",
  },
  {
    id: "skeptic", avatar: "🤨",
    name: lang === "es" ? "Rodrigo Fuentes" : "Rodrigo Fuentes",
    role: lang === "es" ? "Comprador Escéptico / Difícil" : "Skeptical / Difficult Buyer",
    personality: lang === "es"
      ? "He sido engañado muchas veces. Desconfío de todo, hago muchas preguntas difíciles y necesito pruebas concretas antes de creer cualquier promesa. No me convencen los discursos bonitos."
      : "I've been burned many times. I distrust everything, ask tough questions, and need concrete proof before believing any promise. Pretty speeches don't convince me.",
    focus: lang === "es"
      ? ["pruebas y evidencia", "casos de éxito reales", "transparencia total", "sin letra chica"]
      : ["proof & evidence", "real success cases", "full transparency", "no fine print"],
    skepticism: 0.85, buyThreshold: 0.75,
    color: "#dc2626",
  },
  {
    id: "impulse", avatar: "⚡",
    name: "Valentina Cruz",
    role: lang === "es" ? "Compradora Impulsiva" : "Impulse Buyer",
    personality: lang === "es"
      ? "Me emociono fácilmente con productos nuevos y creativos. Si me enganchas emocionalmente en los primeros segundos, probablemente compre. Me gustan las tendencias, el storytelling y sentir que me estoy perdiendo algo."
      : "I get easily excited about new and creative products. If you hook me emotionally in the first seconds, I'll probably buy. I love trends, storytelling, and FOMO.",
    focus: lang === "es"
      ? ["impacto emocional", "tendencia y novedad", "urgencia / FOMO", "storytelling"]
      : ["emotional impact", "trend & novelty", "urgency / FOMO", "storytelling"],
    skepticism: 0.25, buyThreshold: 0.48,
    color: "#db2777",
  },
  {
    id: "tech", avatar: "🔬",
    name: "Dr. Martín Torres",
    role: lang === "es" ? "Comprador Técnico / Experto" : "Technical / Expert Buyer",
    personality: lang === "es"
      ? "Soy ingeniero y analizo todo racionalmente. Necesito especificaciones técnicas, datos duros, metodologías y comparaciones objetivas. No me interesa el marketing emocional, me interesa la evidencia."
      : "I'm an engineer and analyze everything rationally. I need technical specs, hard data, methodologies, and objective comparisons. I don't care about emotional marketing — I care about evidence.",
    focus: lang === "es"
      ? ["especificaciones técnicas", "datos y métricas", "metodología", "comparación objetiva"]
      : ["technical specs", "data & metrics", "methodology", "objective comparison"],
    skepticism: 0.75, buyThreshold: 0.70,
    color: "#0891b2",
  },
];

// ─── SYSTEM PROMPT ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = (profile, lang) => {
  const isEs = lang === "es";
  return `${isEs ? "Eres" : "You are"} ${profile.name}, ${profile.role}.

${isEs ? "PERSONALIDAD" : "PERSONALITY"}: ${profile.personality}
${isEs ? "ENFOQUE" : "FOCUS"}: ${profile.focus.join(", ")}.
${isEs ? "NIVEL DE ESCEPTICISMO" : "SKEPTICISM LEVEL"}: ${Math.round(profile.skepticism * 100)}%.

${isEs ? "INSTRUCCIONES" : "INSTRUCTIONS"}:
1. ${isEs ? "Evalúa el plan de negocio/marketing según tu perfil de comprador. Actúa exactamente como ese tipo de comprador." : "Evaluate the business/marketing plan according to your buyer profile. Act exactly like that type of buyer."}
2. ${isEs ? "Haz UNA sola pregunta específica y relevante por turno para profundizar tu evaluación." : "Ask ONE specific and relevant question per turn to deepen your evaluation."}
3. ${isEs ? "Responde en español, de forma natural y directa según tu personalidad." : "Respond in English, naturally and directly according to your personality."}
4. ${isEs ? "Sé honesto y exigente. No des puntuaciones altas fácilmente." : "Be honest and demanding. Don't give high scores easily."}
5. ${isEs ? "Si el estudiante responde bien, sube la probabilidad. Si responde evasivamente o mal, bájala." : "If the student answers well, raise the probability. If they answer evasively or poorly, lower it."}

${isEs ? "Al final de CADA mensaje incluye OBLIGATORIAMENTE este bloque exacto" : "At the end of EACH message include MANDATORILY this exact block"}:

---EVAL---
PROB: [0-100]
REASON: [${isEs ? "una frase corta" : "one short phrase"}]
POSITIVE: [${isEs ? "lo mejor del pitch" : "best part of pitch"}]
NEGATIVE: [${isEs ? "la debilidad más crítica" : "most critical weakness"}]
ADVICE: [${isEs ? "consejo concreto para mejorar" : "concrete advice to improve"}]
---END---`;
};

function parseEval(text) {
  const m = text.match(/---EVAL---([\s\S]*?)---END---/);
  if (!m) return null;
  const b = m[1];
  const g = (k) => { const r = b.match(new RegExp(`${k}:\\s*(.+)`)); return r ? r[1].trim() : ""; };
  return { probability: parseInt(g("PROB")) || 0, reason: g("REASON"), positive: g("POSITIVE"), negative: g("NEGATIVE"), advice: g("ADVICE") };
}
const cleanText = (t) => t.replace(/---EVAL---([\s\S]*?)---END---/, "").trim();

// ─── METER COMPONENT ──────────────────────────────────────────────────────────
function Meter({ value, accent }) {
  const [d, setD] = useState(0);
  useEffect(() => {
    let cur = d; const step = value > cur ? 1 : -1; if (cur === value) return;
    const t = setInterval(() => { cur += step; setD(cur); if (cur === value) clearInterval(t); }, 14);
    return () => clearInterval(t);
  }, [value]);
  const col = d < 30 ? "#ef4444" : d < 50 ? "#f97316" : d < 70 ? "#eab308" : "#22c55e";
  const r = 50, circ = 2 * Math.PI * r, off = circ - (d / 100) * circ;
  return (
    <div style={{ position: "relative", width: 124, height: 124, margin: "0 auto" }}>
      <svg width="124" height="124" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="62" cy="62" r={r} fill="none" stroke="#e5e7eb" strokeWidth="9" />
        <circle cx="62" cy="62" r={r} fill="none" stroke={col} strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.04s linear, stroke 0.3s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: col, fontFamily: "'Space Mono', monospace" }}>{d}%</span>
      </div>
    </div>
  );
}

// ─── SETTINGS PANEL ───────────────────────────────────────────────────────────
function SettingsPanel({ lang, setLang, accent, setAccent, t, onClose }) {
  const colors = [
    { val: "#CC0000", label: "UCSC Rojo" },
    { val: "#1d4ed8", label: "Azul" },
    { val: "#059669", label: "Verde" },
    { val: "#7c3aed", label: "Morado" },
    { val: "#0891b2", label: "Cyan" },
    { val: "#111827", label: "Negro" },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "32px", width: 340, boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>⚙️ {t.settings}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>{t.language}</div>
          <div style={{ display: "flex", gap: 10 }}>
            {[["es", "🇨🇱 Español"], ["en", "🇺🇸 English"]].map(([v, label]) => (
              <button key={v} onClick={() => setLang(v)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `2px solid ${lang === v ? accent : "#e5e7eb"}`, background: lang === v ? accent + "12" : "#f9fafb", color: lang === v ? accent : "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>{t.accentColor}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {colors.map(c => (
              <button key={c.val} onClick={() => setAccent(c.val)} title={c.label} style={{ width: 36, height: 36, borderRadius: "50%", background: c.val, border: `3px solid ${accent === c.val ? "#111" : "transparent"}`, cursor: "pointer", boxShadow: accent === c.val ? `0 0 0 2px white, 0 0 0 4px ${c.val}` : "none" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("setup");
  const [profileId, setProfileId] = useState(null);
  const [pitch, setPitch] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [history, setHistory] = useState([]);
  const [qCount, setQCount] = useState(0);
  const [lang, setLang] = useState("es");
  const [accent, setAccent] = useState("#CC0000");
  const [showSettings, setShowSettings] = useState(false);
  const chatEnd = useRef(null);
  const t = T[lang];
  const profiles = PROFILES(lang);
  const prof = profiles.find(p => p.id === profileId);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const callClaude = async (msgs) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: SYSTEM_PROMPT(prof, lang), messages: msgs })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.text || "";
  };

  const startSession = async () => {
    if (!profileId || !pitch.trim()) return;
    setScreen("chat"); setMessages([]); setLoading(true); setQCount(0);
    const init = lang === "es"
      ? `Me presentan este plan de negocio/marketing:\n\n"${pitch}"\n\nPor favor evalúalo y hazme tu primera pregunta.`
      : `I'm presented with this business/marketing plan:\n\n"${pitch}"\n\nPlease evaluate it and ask me your first question.`;
    try {
      const raw = await callClaude([{ role: "user", content: init }]);
      const ev = parseEval(raw);
      setEvaluation(ev);
      setMessages([{ role: "assistant", content: cleanText(raw), evaluation: ev }]);
      setHistory([{ role: "user", content: init }, { role: "assistant", content: raw }]);
    } catch { setMessages([{ role: "assistant", content: "Error de conexión.", evaluation: null }]); }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const newH = [...history, { role: "user", content: input }];
    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput(""); setLoading(true); setQCount(c => c + 1);
    try {
      const raw = await callClaude(newH);
      const ev = parseEval(raw);
      setEvaluation(ev);
      setMessages(prev => [...prev, { role: "assistant", content: cleanText(raw), evaluation: ev }]);
      setHistory([...newH, { role: "assistant", content: raw }]);
    } catch { setMessages(prev => [...prev, { role: "assistant", content: "Error de conexión.", evaluation: null }]); }
    setLoading(false);
  };

  const restart = () => { setScreen("setup"); setProfileId(null); setPitch(""); setMessages([]); setHistory([]); setEvaluation(null); setQCount(0); };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap');
    .btn { transition: all 0.15s; } .btn:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.05); }
    .card { transition: all 0.18s; cursor: pointer; }
    .card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important; }
    textarea:focus, input:focus { outline: none; }
    .msg { animation: fadeUp 0.25s ease; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  `;

  const baseStyle = { minHeight: "100vh", background: "#f8f9fa", fontFamily: "'DM Sans', sans-serif", color: "#111827" };

  // ── HEADER (shared) ─────────────────────────────────────────────────────────
  const Header = ({ minimal = false }) => (
    <header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: minimal ? "12px 24px" : "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img src={logoUCSC} alt="UCSC" style={{ height: minimal ? 32 : 40, objectFit: "contain", filter: "brightness(0) invert(0)" }} />
        {!minimal && <div style={{ width: 1, height: 32, background: "#e5e7eb" }} />}
        {!minimal && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: accent, letterSpacing: "0.05em" }}>SalesIQ</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{t.tagline}</div>
          </div>
        )}
      </div>
      <button className="btn" onClick={() => setShowSettings(true)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 13, color: "#374151", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
        ⚙️ {t.settings}
      </button>
    </header>
  );

  // ── SETUP ──────────────────────────────────────────────────────────────────
  if (screen === "setup") return (
    <div style={baseStyle}>
      <style>{css}</style>
      {showSettings && <SettingsPanel lang={lang} setLang={setLang} accent={accent} setAccent={setAccent} t={t} onClose={() => setShowSettings(false)} />}
      <Header />

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)`, padding: "48px 32px", textAlign: "center", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)" }} />
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-block", padding: "4px 14px", background: "rgba(255,255,255,0.2)", borderRadius: 100, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>
            {lang === "es" ? "Facultad de Ciencias Económicas y Administrativas" : "School of Economics and Business"}
          </div>
          <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 14 }}>
            SalesIQ Evaluator
          </h1>
          <p style={{ fontSize: 16, opacity: 0.9, lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>{t.subtitle}</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        {/* Step 1 */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginBottom: 20 }}>{t.step1}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {profiles.map(p => (
              <div key={p.id} className="card" onClick={() => setProfileId(p.id)} style={{ padding: "20px 16px", borderRadius: 16, background: "#fff", border: `2px solid ${profileId === p.id ? p.color : "#e5e7eb"}`, boxShadow: profileId === p.id ? `0 8px 24px ${p.color}28` : "0 2px 8px rgba(0,0,0,0.06)", position: "relative", overflow: "hidden" }}>
                {profileId === p.id && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: p.color }} />}
                <div style={{ fontSize: 32, marginBottom: 10 }}>{p.avatar}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: profileId === p.id ? p.color : "#111827", marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{p.role}</div>
                {profileId === p.id && (
                  <div style={{ marginTop: 10, fontSize: 11, color: p.color, fontWeight: 600 }}>
                    ✓ {lang === "es" ? "Seleccionado" : "Selected"}
                  </div>
                )}
              </div>
            ))}
          </div>

          {prof && (
            <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 12, background: prof.color + "0e", border: `1px solid ${prof.color}33`, fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
              <span style={{ color: prof.color, fontWeight: 700 }}>{t.profileOf} </span>{prof.personality}
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginBottom: 16 }}>{t.step2}</div>
          <div style={{ background: "#fff", borderRadius: 16, padding: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" }}>
            <textarea value={pitch} onChange={e => setPitch(e.target.value)} placeholder={t.pitchPlaceholder}
              style={{ width: "100%", minHeight: 160, padding: "18px", border: "none", borderRadius: 13, fontSize: 15, lineHeight: 1.7, color: "#111827", background: "transparent", resize: "vertical", fontFamily: "inherit" }}
              onFocus={e => e.target.parentElement.style.borderColor = accent}
              onBlur={e => e.target.parentElement.style.borderColor = "#e5e7eb"}
            />
          </div>
          <div style={{ textAlign: "right", fontSize: 12, color: "#9ca3af", marginTop: 6 }}>{pitch.length} {t.charCount}</div>
        </div>

        <button className="btn" onClick={startSession} disabled={!profileId || !pitch.trim()} style={{ width: "100%", padding: "17px", borderRadius: 14, border: "none", background: (!profileId || !pitch.trim()) ? "#e5e7eb" : accent, color: (!profileId || !pitch.trim()) ? "#9ca3af" : "#fff", fontSize: 16, fontWeight: 700, cursor: (!profileId || !pitch.trim()) ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: (!profileId || !pitch.trim()) ? "none" : `0 8px 24px ${accent}44` }}>
          {!profileId ? t.selectFirst : !pitch.trim() ? t.enterPitch : t.startBtn}
        </button>
      </div>
    </div>
  );

  // ── CHAT ───────────────────────────────────────────────────────────────────
  if (screen === "chat") return (
    <div style={{ ...baseStyle, display: "flex", flexDirection: "column", height: "100vh" }}>
      <style>{css}</style>
      {showSettings && <SettingsPanel lang={lang} setLang={setLang} accent={accent} setAccent={setAccent} t={t} onClose={() => setShowSettings(false)} />}

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={logoUCSC} alt="UCSC" style={{ height: 28, objectFit: "contain" }} />
          <div style={{ width: 1, height: 24, background: "#e5e7eb" }} />
          <div style={{ width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: prof.color + "18", border: `2px solid ${prof.color}44` }}>{prof.avatar}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: prof.color }}>{prof.name}</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{prof.role}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>{qCount} {t.responses}</span>
          <button className="btn" onClick={() => setShowSettings(true)} style={{ padding: "6px 12px", borderRadius: 7, border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 12, color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>⚙️</button>
          <button className="btn" onClick={() => setScreen("summary")} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${accent}`, background: accent + "0e", color: accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {t.summaryBtn}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Messages */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
            {messages.map((msg, i) => (
              <div key={i} className="msg" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ maxWidth: "82%", padding: "14px 18px", borderRadius: 16, fontSize: 14, lineHeight: 1.75,
                  ...(msg.role === "user"
                    ? { alignSelf: "flex-end", background: accent, color: "#fff", borderBottomRightRadius: 4, boxShadow: `0 4px 16px ${accent}44` }
                    : { alignSelf: "flex-start", background: "#fff", border: "1px solid #e5e7eb", borderBottomLeftRadius: 4, color: "#111827", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" })
                }}>
                  {msg.role === "assistant" && (
                    <div style={{ fontSize: 11, fontWeight: 700, color: prof.color, marginBottom: 6, letterSpacing: "0.07em" }}>{prof.avatar} {prof.name}</div>
                  )}
                  <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                </div>

                {msg.evaluation && msg.role === "assistant" && (
                  <div style={{ alignSelf: "flex-start", maxWidth: "82%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ padding: "10px 13px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: 12, color: "#166534" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", marginBottom: 4, letterSpacing: "0.08em" }}>✦ {t.positive}</div>
                      {msg.evaluation.positive}
                    </div>
                    <div style={{ padding: "10px 13px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", fontSize: 12, color: "#991b1b" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", marginBottom: 4, letterSpacing: "0.08em" }}>⚠ {t.critical}</div>
                      {msg.evaluation.negative}
                    </div>
                    <div style={{ gridColumn: "1/-1", padding: "10px 13px", borderRadius: 10, background: "#fffbeb", border: "1px solid #fde68a", fontSize: 12, color: "#92400e" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#d97706", marginBottom: 4, letterSpacing: "0.08em" }}>💡 {t.recommendation}</div>
                      {msg.evaluation.advice}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: 5, padding: "12px 16px", maxWidth: 80, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                {[0,1,2].map(j => <div key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: prof.color, animation: `pulse 1.2s ease ${j*0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={chatEnd} />
          </div>

          {/* Input */}
          <div style={{ padding: "14px 20px", borderTop: "1px solid #e5e7eb", background: "#fff", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 10, background: "#f9fafb", borderRadius: 14, padding: "4px", border: "1px solid #e5e7eb" }}>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={t.inputPlaceholder} rows={2}
                style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "none", background: "transparent", color: "#111827", fontSize: 14, resize: "none", fontFamily: "inherit", lineHeight: 1.5 }}
              />
              <button className="btn" onClick={sendMessage} disabled={!input.trim() || loading}
                style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: input.trim() && !loading ? accent : "#e5e7eb", color: input.trim() && !loading ? "#fff" : "#9ca3af", cursor: input.trim() && !loading ? "pointer" : "not-allowed", fontSize: 18, alignSelf: "flex-end" }}>
                →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 210, borderLeft: "1px solid #e5e7eb", padding: "20px 14px", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto", flexShrink: 0, background: "#fff" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase" }}>{t.evalSection}</div>

          {evaluation && <Meter value={evaluation.probability} accent={accent} />}

          {evaluation && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#6b7280", fontStyle: "italic", lineHeight: 1.5, padding: "8px 10px", background: "#f9fafb", borderRadius: 8, marginBottom: 8 }}>
                "{evaluation.reason}"
              </div>
              <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600,
                background: evaluation.probability >= prof.buyThreshold * 100 ? "#f0fdf4" : "#fef2f2",
                color: evaluation.probability >= prof.buyThreshold * 100 ? "#16a34a" : "#dc2626",
                border: `1px solid ${evaluation.probability >= prof.buyThreshold * 100 ? "#bbf7d0" : "#fecaca"}` }}>
                {evaluation.probability >= prof.buyThreshold * 100 ? t.wouldBuy : t.wouldNotBuy}
              </div>
              <div style={{ fontSize: 11, color: "#d1d5db", marginTop: 6 }}>{t.threshold}: {Math.round(prof.buyThreshold * 100)}%</div>
            </div>
          )}

          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 10 }}>{t.interests}</div>
            {prof.focus.map(f => (
              <div key={f} style={{ padding: "5px 10px", marginBottom: 5, borderRadius: 6, fontSize: 11, background: prof.color + "0e", color: prof.color, border: `1px solid ${prof.color}22`, fontWeight: 500 }}>
                • {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── SUMMARY ────────────────────────────────────────────────────────────────
  if (screen === "summary") {
    const evals = messages.filter(m => m.evaluation).map(m => m.evaluation);
    const lastEval = evals[evals.length - 1];
    const avgProb = evals.length ? Math.round(evals.reduce((s, e) => s + e.probability, 0) / evals.length) : 0;
    const bought = lastEval && lastEval.probability >= prof.buyThreshold * 100;
    const grade = avgProb >= 75 ? "A" : avgProb >= 55 ? "B" : avgProb >= 35 ? "C" : "D";
    const gc = { A: "#16a34a", B: "#ca8a04", C: "#ea580c", D: "#dc2626" }[grade];
    const gradeDesc = { A: t.gradeA, B: t.gradeB, C: t.gradeC, D: t.gradeD }[grade];

    return (
      <div style={baseStyle}>
        <style>{css}</style>
        {showSettings && <SettingsPanel lang={lang} setLang={setLang} accent={accent} setAccent={setAccent} t={t} onClose={() => setShowSettings(false)} />}
        <Header minimal />

        {/* Hero summary bar */}
        <div style={{ background: bought ? "#f0fdf4" : "#fef2f2", borderBottom: `3px solid ${bought ? "#22c55e" : "#ef4444"}`, padding: "32px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>{bought ? "🎉" : "📊"}</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: bought ? "#15803d" : "#b91c1c", marginBottom: 6 }}>
            {bought ? t.summaryTitle1 : t.summaryTitle2}
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>{prof.avatar} {prof.name} · {prof.role} · {qCount} {t.exchanges}</p>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "36px 24px" }}>
          {/* Score cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div style={{ padding: "28px", borderRadius: 18, textAlign: "center", background: "#fff", border: `2px solid ${bought ? "#bbf7d0" : "#fecaca"}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 58, fontWeight: 900, fontFamily: "'Space Mono', monospace", color: bought ? "#16a34a" : "#dc2626", lineHeight: 1 }}>
                {lastEval?.probability ?? avgProb}%
              </div>
              <div style={{ color: "#6b7280", fontSize: 13, marginTop: 6 }}>{t.buyProbLabel}</div>
              <div style={{ marginTop: 10, display: "inline-block", padding: "3px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: bought ? "#f0fdf4" : "#fef2f2", color: bought ? "#16a34a" : "#dc2626" }}>
                {t.thresholdLabel}: {Math.round(prof.buyThreshold * 100)}%
              </div>
            </div>

            <div style={{ padding: "28px", borderRadius: 18, textAlign: "center", background: "#fff", border: "2px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 58, fontWeight: 900, fontFamily: "'Space Mono', monospace", color: gc, lineHeight: 1 }}>{grade}</div>
              <div style={{ color: "#6b7280", fontSize: 13, marginTop: 6 }}>{t.overallGrade}</div>
              <div style={{ marginTop: 10, fontSize: 12, color: "#9ca3af" }}>{gradeDesc}</div>
            </div>
          </div>

          {/* Evolution */}
          {evals.length > 1 && (
            <div style={{ padding: "20px", borderRadius: 16, background: "#fff", border: "1px solid #e5e7eb", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 14 }}>{t.evolution}</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
                {evals.map((e, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ fontSize: 10, color: "#9ca3af" }}>{e.probability}%</div>
                    <div style={{ width: "100%", borderRadius: 4, height: Math.max(4, (e.probability / 100) * 48), background: e.probability >= prof.buyThreshold * 100 ? "#22c55e" : accent, opacity: 0.85 }} />
                    <div style={{ fontSize: 9, color: "#d1d5db" }}>R{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          {lastEval && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              <div style={{ padding: "16px", borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", letterSpacing: "0.08em", marginBottom: 8 }}>✦ {t.strength}</div>
                <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>{lastEval.positive}</div>
              </div>
              <div style={{ padding: "16px", borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", letterSpacing: "0.08em", marginBottom: 8 }}>⚠ {t.weakness}</div>
                <div style={{ fontSize: 13, color: "#991b1b", lineHeight: 1.6 }}>{lastEval.negative}</div>
              </div>
              <div style={{ gridColumn: "1/-1", padding: "16px", borderRadius: 12, background: "#fffbeb", border: "1px solid #fde68a" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", marginBottom: 8 }}>💡 {t.nextStep}</div>
                <div style={{ fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>{lastEval.advice}</div>
              </div>
            </div>
          )}

          <button className="btn" onClick={restart} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: accent, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${accent}44` }}>
            {t.newEval}
          </button>
        </div>
      </div>
    );
  }
}
