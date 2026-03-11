import { useState, useEffect, useRef } from "react";
import logoUCSC from "./assets/logo-ucsc.png";

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  es: {
    labName: "Laboratorio de Simulación de Compradores con Agentes IA",
    faculty: "Facultad de Ciencias Económicas y Administrativas",
    descTitle: "¿Cómo funciona este laboratorio?",
    desc1: "Presenta tu producto o plan de marketing a un comprador simulado por Inteligencia Artificial. Cada agente tiene una personalidad, motivaciones y criterios de compra distintos — igual que en la vida real.",
    desc2: "El agente te hará preguntas desafiantes, evaluará tu pitch en tiempo real y te dará retroalimentación concreta. Puedes hablar o escribir tu respuesta.",
    desc3: "Al final recibirás una calificación, la probabilidad de compra y recomendaciones específicas para mejorar tu capacidad de venta.",
    step1: "01 — Selecciona el agente comprador",
    randomBtn: "🎲 Agente al azar",
    step2: "02 — Describe tu producto o plan de marketing",
    pitchPlaceholder: "Describe tu producto o servicio: ¿qué problema resuelve?, ¿a quién va dirigido?, ¿cuál es tu precio?, ¿por qué alguien debería comprarlo?",
    startBtn: "Iniciar Simulación →",
    selectFirst: "Selecciona un agente →",
    enterPitch: "Ingresa tu pitch →",
    inputPlaceholder: "Escribe tu respuesta... (Enter para enviar)",
    summaryBtn: "Ver Resumen →",
    responses: "respuestas",
    positive: "POSITIVO",
    critical: "CRÍTICO",
    recommendation: "RECOMENDACIÓN",
    voiceNote: "VOZ",
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
    newEval: "Nueva Simulación →",
    settings: "Ajustes",
    language: "Idioma",
    accentColor: "Color de acento",
    profileOf: "Perfil del agente:",
    charCount: "caracteres",
    evalSection: "Evaluación en tiempo real",
    modeText: "✏️ Texto",
    modeVoice: "🎙 Voz",
    recording: "Grabando...",
    processing: "Procesando audio...",
    stopBtn: "⏹ Detener y enviar",
    recordBtn: "🎙 Grabar respuesta",
    voiceHint: "Habla y el agente analizará tu respuesta",
    randomSelected: "¡Agente seleccionado al azar!",
    confidence: "Confianza vocal",
    volume: "Volumen",
    variability: "Variabilidad",
    silence: "Silencio/pausas",
    voiceAnalysis: "Análisis de voz",
    pitchModeText: "✏️ Escribir pitch",
    pitchModeVoice: "🎙 Grabar pitch",
    recordPitch: "🎙 Grabar mi pitch",
    stopPitch: "⏹ Detener grabación",
  },
  en: {
    labName: "Buyer Simulation Laboratory with AI Agents",
    faculty: "School of Economics and Business",
    descTitle: "How does this laboratory work?",
    desc1: "Present your product or marketing plan to a buyer simulated by Artificial Intelligence. Each agent has a unique personality, motivations, and purchase criteria — just like in real life.",
    desc2: "The agent will ask you challenging questions, evaluate your pitch in real time, and give you concrete feedback. You can speak or type your response.",
    desc3: "At the end you'll receive a grade, the purchase probability, and specific recommendations to improve your sales skills.",
    step1: "01 — Select the buyer agent",
    randomBtn: "🎲 Random agent",
    step2: "02 — Describe your product or marketing plan",
    pitchPlaceholder: "Describe your product or service: what problem does it solve?, who is it for?, what's the price?, why should someone buy it?",
    startBtn: "Start Simulation →",
    selectFirst: "Select an agent →",
    enterPitch: "Enter your pitch →",
    inputPlaceholder: "Type your response... (Enter to send)",
    summaryBtn: "View Summary →",
    responses: "responses",
    positive: "POSITIVE",
    critical: "CRITICAL",
    recommendation: "RECOMMENDATION",
    voiceNote: "VOICE",
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
    newEval: "New Simulation →",
    settings: "Settings",
    language: "Language",
    accentColor: "Accent color",
    profileOf: "Agent profile:",
    charCount: "characters",
    evalSection: "Live evaluation",
    modeText: "✏️ Text",
    modeVoice: "🎙 Voice",
    recording: "Recording...",
    processing: "Processing audio...",
    stopBtn: "⏹ Stop and send",
    recordBtn: "🎙 Record response",
    voiceHint: "Speak and the agent will analyze your response",
    randomSelected: "Agent randomly selected!",
    confidence: "Vocal confidence",
    volume: "Volume",
    variability: "Variability",
    silence: "Silence/pauses",
    voiceAnalysis: "Voice analysis",
    pitchModeText: "✏️ Write pitch",
    pitchModeVoice: "🎙 Record pitch",
    recordPitch: "🎙 Record my pitch",
    stopPitch: "⏹ Stop recording",
  }
};

// ─── BUYER PROFILES ───────────────────────────────────────────────────────────
const PROFILES = (lang) => [
  {
    id: "retail", avatar: "🛍️",
    name: "Ana Martínez",
    role: lang === "es" ? "Compradora Retail / Consumidor Final" : "Retail Buyer / End Consumer",
    personality: lang === "es"
      ? "Soy una consumidora típica que busca valor real por mi dinero. Me gustan las cosas fáciles de usar y que resuelvan mis problemas del día a día. Desconfío del marketing exagerado."
      : "I'm a typical consumer looking for real value. I like things easy to use that solve everyday problems. I distrust exaggerated marketing.",
    focus: lang === "es" ? ["precio justo", "facilidad de uso", "confianza", "experiencia de compra"] : ["fair price", "ease of use", "trust", "shopping experience"],
    skepticism: 0.45, buyThreshold: 0.58, color: "#e85d04",
  },
  {
    id: "b2b", avatar: "🏢",
    name: "Ricardo Salinas",
    role: lang === "es" ? "Director de Compras B2B" : "B2B Purchasing Director",
    personality: lang === "es"
      ? "Tomo decisiones de compra para una empresa de 150 empleados. Necesito ROI claro, integración con nuestros sistemas y un proveedor confiable con soporte postventa."
      : "I make purchasing decisions for a 150-employee company. I need clear ROI, system integration, and a reliable vendor with after-sales support.",
    focus: lang === "es" ? ["ROI demostrable", "integración técnica", "soporte", "contrato y garantías"] : ["demonstrable ROI", "technical integration", "support", "contract & guarantees"],
    skepticism: 0.70, buyThreshold: 0.68, color: "#2563eb",
  },
  {
    id: "luxury", avatar: "💎",
    name: "Isabella Fontaine",
    role: lang === "es" ? "Cliente de Lujo / Premium" : "Luxury / Premium Client",
    personality: lang === "es"
      ? "Tengo altos estándares y espero exclusividad, calidad impecable y una experiencia excepcional. El precio no es mi principal objeción, pero sí la exclusividad y el estatus."
      : "I have high standards and expect exclusivity, impeccable quality, and an exceptional experience. Price isn't my main concern — exclusivity and status are.",
    focus: lang === "es" ? ["exclusividad", "calidad premium", "marca y estatus", "experiencia VIP"] : ["exclusivity", "premium quality", "brand & status", "VIP experience"],
    skepticism: 0.60, buyThreshold: 0.72, color: "#7c3aed",
  },
  {
    id: "price", avatar: "💰",
    name: "Carlos Vega",
    role: lang === "es" ? "Cliente Precio-Sensible" : "Price-Sensitive Buyer",
    personality: lang === "es"
      ? "Comparo todo antes de comprar. Necesito el mejor precio y que me demuestres que vale cada peso. Busco descuentos, garantías y el mayor beneficio por el menor costo."
      : "I compare everything before buying. I need the best price and proof it's worth every cent. I look for discounts and maximum value for minimum cost.",
    focus: lang === "es" ? ["precio más bajo", "comparación de mercado", "descuentos", "relación precio-valor"] : ["lowest price", "market comparison", "discounts", "price-value ratio"],
    skepticism: 0.55, buyThreshold: 0.55, color: "#059669",
  },
  {
    id: "skeptic", avatar: "🤨",
    name: "Rodrigo Fuentes",
    role: lang === "es" ? "Comprador Escéptico / Difícil" : "Skeptical / Difficult Buyer",
    personality: lang === "es"
      ? "He sido engañado muchas veces. Desconfío de todo, hago preguntas difíciles y necesito pruebas concretas. Los discursos bonitos no me convencen."
      : "I've been burned many times. I distrust everything, ask tough questions, and need concrete proof. Pretty speeches don't convince me.",
    focus: lang === "es" ? ["pruebas y evidencia", "casos de éxito reales", "transparencia total", "sin letra chica"] : ["proof & evidence", "real success cases", "full transparency", "no fine print"],
    skepticism: 0.85, buyThreshold: 0.75, color: "#dc2626",
  },
  {
    id: "impulse", avatar: "⚡",
    name: "Valentina Cruz",
    role: lang === "es" ? "Compradora Impulsiva" : "Impulse Buyer",
    personality: lang === "es"
      ? "Me emociono fácilmente con productos nuevos. Si me enganchas emocionalmente en los primeros segundos, probablemente compre. Me gustan las tendencias y el storytelling."
      : "I get easily excited about new products. Hook me emotionally in the first seconds and I'll probably buy. I love trends and storytelling.",
    focus: lang === "es" ? ["impacto emocional", "tendencia y novedad", "urgencia / FOMO", "storytelling"] : ["emotional impact", "trend & novelty", "urgency / FOMO", "storytelling"],
    skepticism: 0.25, buyThreshold: 0.48, color: "#db2777",
  },
  {
    id: "tech", avatar: "🔬",
    name: "Dr. Martín Torres",
    role: lang === "es" ? "Comprador Técnico / Experto" : "Technical / Expert Buyer",
    personality: lang === "es"
      ? "Soy ingeniero y analizo todo racionalmente. Necesito especificaciones técnicas, datos duros y comparaciones objetivas. No me interesa el marketing emocional."
      : "I'm an engineer and analyze everything rationally. I need technical specs, hard data, and objective comparisons. Emotional marketing doesn't interest me.",
    focus: lang === "es" ? ["especificaciones técnicas", "datos y métricas", "metodología", "comparación objetiva"] : ["technical specs", "data & metrics", "methodology", "objective comparison"],
    skepticism: 0.75, buyThreshold: 0.70, color: "#0891b2",
  },
];

// ─── SYSTEM PROMPT ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = (profile, lang) => {
  const isEs = lang === "es";
  return `${isEs ? "Eres" : "You are"} ${profile.name}, ${profile.role}.
${isEs ? "PERSONALIDAD" : "PERSONALITY"}: ${profile.personality}
${isEs ? "ENFOQUE" : "FOCUS"}: ${profile.focus.join(", ")}.
${isEs ? "ESCEPTICISMO" : "SKEPTICISM"}: ${Math.round(profile.skepticism * 100)}%.

${isEs ? "INSTRUCCIONES" : "INSTRUCTIONS"}:
1. ${isEs ? "Evalúa el plan según tu perfil. Actúa exactamente como ese tipo de comprador." : "Evaluate the plan according to your profile. Act exactly like that type of buyer."}
2. ${isEs ? "Haz UNA sola pregunta específica por turno." : "Ask ONE specific question per turn."}
3. ${isEs ? "Si hay análisis de voz, coméntalo brevemente (tono, seguridad, ritmo)." : "If there's voice analysis, briefly comment on it (tone, confidence, pace)."}
4. ${isEs ? "Sé honesto y exigente. No des puntuaciones altas fácilmente." : "Be honest and demanding. Don't give high scores easily."}
5. ${isEs ? "Responde siempre en" : "Always respond in"} ${isEs ? "español" : "English"}.

${isEs ? "Al final de CADA mensaje incluye OBLIGATORIAMENTE" : "At the end of EACH message include MANDATORILY"}:

---EVAL---
PROB: [0-100]
REASON: [${isEs ? "frase corta" : "short phrase"}]
POSITIVE: [${isEs ? "lo mejor" : "best part"}]
NEGATIVE: [${isEs ? "debilidad crítica" : "critical weakness"}]
ADVICE: [${isEs ? "consejo concreto" : "concrete advice"}]
VOICE: [${isEs ? "comentario sobre la voz si hay análisis, si no: N/A" : "voice comment if analysis exists, otherwise: N/A"}]
---END---`;
};

function parseEval(text) {
  const m = text.match(/---EVAL---([\s\S]*?)---END---/);
  if (!m) return null;
  const b = m[1];
  const g = (k) => { const r = b.match(new RegExp(`${k}:\\s*(.+)`)); return r ? r[1].trim() : ""; };
  return { probability: parseInt(g("PROB")) || 0, reason: g("REASON"), positive: g("POSITIVE"), negative: g("NEGATIVE"), advice: g("ADVICE"), voice: g("VOICE") };
}
const cleanText = (t) => t.replace(/---EVAL---([\s\S]*?)---END---/, "").trim();

// ─── AUDIO ANALYSIS ───────────────────────────────────────────────────────────
async function analyzeAudio(blob, durationSec) {
  return new Promise((resolve) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buf = await ctx.decodeAudioData(e.target.result);
        const data = buf.getChannelData(0);
        const ws = Math.floor(buf.sampleRate * 0.02);
        const energies = [];
        for (let i = 0; i < data.length - ws; i += ws) {
          let s = 0; for (let j = i; j < i + ws; j++) s += data[j] * data[j];
          energies.push(Math.sqrt(s / ws));
        }
        const maxE = Math.max(...energies) || 1;
        const thresh = maxE * 0.05;
        let silFrames = 0, pauses = 0, inSil = false;
        energies.forEach(e => { if (e < thresh) { silFrames++; if (!inSil) { inSil = true; pauses++; } } else inSil = false; });
        const silRatio = silFrames / energies.length;
        const avgE = energies.reduce((a, b) => a + b, 0) / energies.length;
        const variance = energies.reduce((a, b) => a + Math.pow(b - avgE, 2), 0) / energies.length;
        const conf = Math.min(100, Math.max(0, Math.round((1 - silRatio) * 40 + Math.min(avgE / maxE, 1) * 30 + Math.min(variance / (maxE * maxE) * 500, 1) * 30)));
        resolve({ duration: durationSec.toFixed(1), confidenceScore: conf, silenceRatio: Math.round(silRatio * 100), pauseCount: Math.max(0, pauses - 1), avgVolume: Math.round((avgE / maxE) * 100), volumeVariability: Math.round(Math.sqrt(variance) / maxE * 100), estimatedWPM: Math.round(120 + (conf - 50) * 0.8) });
      } catch { resolve({ duration: durationSec.toFixed(1), confidenceScore: 50, silenceRatio: 20, pauseCount: 3, avgVolume: 60, volumeVariability: 30, estimatedWPM: 130 }); }
      ctx.close();
    };
    reader.readAsArrayBuffer(blob);
  });
}

function voiceSummary(a) {
  if (!a) return "";
  const c = a.confidenceScore >= 70 ? "voz segura y proyectada" : a.confidenceScore >= 45 ? "voz moderadamente segura" : "voz insegura con vacilación";
  const p = a.silenceRatio > 30 ? "muchas pausas" : a.silenceRatio > 15 ? "pausas naturales" : "ritmo fluido";
  const s = a.estimatedWPM > 160 ? "habló muy rápido" : a.estimatedWPM > 130 ? "ritmo adecuado" : "habló lento";
  return `[ANÁLISIS DE VOZ: ${c}; ${p} (${a.pauseCount} pausas, ${a.silenceRatio}% silencio); ${s} (~${a.estimatedWPM} ppm); confianza: ${a.confidenceScore}/100]`;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Meter({ value }) {
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
        <circle cx="62" cy="62" r={r} fill="none" stroke={col} strokeWidth="9" strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.04s linear, stroke 0.3s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: col, fontFamily: "monospace" }}>{d}%</span>
      </div>
    </div>
  );
}

function VBar({ label, value, max = 100, color = "#CC0000", unit = "" }) {
  return (
    <div style={{ marginBottom: 9 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b7280", marginBottom: 3 }}>
        <span>{label}</span><span style={{ fontFamily: "monospace", color: "#374151" }}>{value}{unit}</span>
      </div>
      <div style={{ height: 4, background: "#f3f4f6", borderRadius: 2 }}>
        <div style={{ height: "100%", width: `${Math.min(100, (value / max) * 100)}%`, background: color, borderRadius: 2, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

function SettingsPanel({ lang, setLang, accent, setAccent, t, onClose }) {
  const colors = [
    { val: "#CC0000", label: "UCSC Rojo" }, { val: "#1d4ed8", label: "Azul" },
    { val: "#059669", label: "Verde" }, { val: "#7c3aed", label: "Morado" },
    { val: "#0891b2", label: "Cyan" }, { val: "#111827", label: "Negro" },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "32px", width: 340, boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>⚙️ {t.settings}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>{t.language}</div>
          <div style={{ display: "flex", gap: 10 }}>
            {[["es", "🇨🇱 Español"], ["en", "🇺🇸 English"]].map(([v, label]) => (
              <button key={v} onClick={() => setLang(v)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `2px solid ${lang === v ? accent : "#e5e7eb"}`, background: lang === v ? accent + "12" : "#f9fafb", color: lang === v ? accent : "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
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
  const [inputMode, setInputMode] = useState("text");
  const [pitchMode, setPitchMode] = useState("text");
  const [isRec, setIsRec] = useState(false);
  const [isPitchRec, setIsPitchRec] = useState(false);
  const [recTime, setRecTime] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [voiceAnalysis, setVoiceAnalysis] = useState(null);
  const [audioError, setAudioError] = useState("");
  const [wave, setWave] = useState([]);
  const [randomFlash, setRandomFlash] = useState(false);

  const mrRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const analyserRef = useRef(null);
  const animRef = useRef(null);
  const startTimeRef = useRef(0);
  const chatEnd = useRef(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => () => cleanup(), []);

  const t = T[lang];
  const profiles = PROFILES(lang);
  const prof = profiles.find(p => p.id === profileId);

  const cleanup = () => {
    clearInterval(timerRef.current);
    cancelAnimationFrame(animRef.current);
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
  };

  const pickRandom = () => {
    const randomProf = profiles[Math.floor(Math.random() * profiles.length)];
    setProfileId(randomProf.id);
    setRandomFlash(true);
    setTimeout(() => setRandomFlash(false), 1500);
  };

  const startRec = async (forPitch = false) => {
    setAudioError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      streamRef.current = stream;
      const actx = new (window.AudioContext || window.webkitAudioContext)();
      const src = actx.createMediaStreamSource(stream);
      const an = actx.createAnalyser(); an.fftSize = 64; src.connect(an);
      const draw = () => { const d = new Uint8Array(an.frequencyBinCount); an.getByteFrequencyData(d); setWave(Array.from(d).slice(0, 20)); animRef.current = requestAnimationFrame(draw); };
      draw();
      const mr = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg" });
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start(100); mrRef.current = mr; startTimeRef.current = Date.now();
      setRecTime(0); timerRef.current = setInterval(() => setRecTime(t => t + 1), 1000);
      if (forPitch) setIsPitchRec(true); else setIsRec(true);
    } catch { setAudioError(lang === "es" ? "No se pudo acceder al micrófono. Verifica los permisos." : "Could not access microphone. Check permissions."); }
  };

  const stopRec = (forPitch = false) => new Promise((res) => {
    const mr = mrRef.current;
    if (!mr || mr.state === "inactive") { res(null); return; }
    mr.onstop = () => res(new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || "audio/webm" }));
    mr.stop(); cleanup();
    if (forPitch) setIsPitchRec(false); else setIsRec(false);
    setWave([]);
  });

  const handlePitchRec = async () => {
    if (isPitchRec) {
      setTranscribing(true);
      const blob = await stopRec(true);
      const dur = (Date.now() - startTimeRef.current) / 1000;
      try {
        const analysis = await analyzeAudio(blob, dur);
        setVoiceAnalysis(analysis);
        setAudioError(lang === "es" ? "Audio grabado y analizado. Puedes complementar tu pitch por escrito abajo." : "Audio recorded and analyzed. You can complement your pitch in writing below.");
      } catch { setAudioError(lang === "es" ? "Error procesando audio." : "Error processing audio."); }
      setTranscribing(false);
    } else { await startRec(true); }
  };

  const handleVoiceMsg = async () => {
    if (isRec) {
      setTranscribing(true);
      const blob = await stopRec(false);
      const dur = (Date.now() - startTimeRef.current) / 1000;
      try {
        const analysis = await analyzeAudio(blob, dur);
        setVoiceAnalysis(analysis);
        setTranscribing(false);
        // Send with voice analysis context but ask student to type their response
        setAudioError(lang === "es" ? "Voz analizada ✓ — ahora escribe tu respuesta abajo y envía." : "Voice analyzed ✓ — now type your response below and send.");
        setInputMode("text");
      } catch { setAudioError(lang === "es" ? "Error procesando audio." : "Error processing audio."); setTranscribing(false); }
    } else { await startRec(false); }
  };

  const callAPI = async (msgs) => {
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
    const vs = voiceAnalysis ? voiceSummary(voiceAnalysis) : "";
    const init = lang === "es"
      ? `Me presentan este plan de negocio/marketing:\n\n"${pitch}"\n\n${vs}\n\nPor favor evalúalo y hazme tu primera pregunta.`
      : `I'm presented with this business/marketing plan:\n\n"${pitch}"\n\n${vs}\n\nPlease evaluate it and ask me your first question.`;
    try {
      const raw = await callAPI([{ role: "user", content: init }]);
      const ev = parseEval(raw);
      setEvaluation(ev);
      setMessages([{ role: "assistant", content: cleanText(raw), evaluation: ev }]);
      setHistory([{ role: "user", content: init }, { role: "assistant", content: raw }]);
    } catch (e) {
      setMessages([{ role: "assistant", content: `Error: ${e.message}`, evaluation: null }]);
    }
    setLoading(false);
  };

  const sendMessage = async (textOverride = null) => {
    const text = textOverride || input;
    if (!text.trim() || loading) return;
    const va = voiceAnalysis;
    const vs = va ? voiceSummary(va) : "";
    const full = vs ? `${text}\n\n${vs}` : text;
    const newH = [...history, { role: "user", content: full }];
    setMessages(prev => [...prev, { role: "user", content: text, voiceAnalysis: va }]);
    setInput(""); setVoiceAnalysis(null); setAudioError("");
    setLoading(true); setQCount(c => c + 1);
    try {
      const raw = await callAPI(newH);
      const ev = parseEval(raw);
      setEvaluation(ev);
      setMessages(prev => [...prev, { role: "assistant", content: cleanText(raw), evaluation: ev }]);
      setHistory([...newH, { role: "assistant", content: raw }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `Error: ${e.message}`, evaluation: null }]);
    }
    setLoading(false);
  };

  const restart = () => { setScreen("setup"); setProfileId(null); setPitch(""); setMessages([]); setHistory([]); setEvaluation(null); setQCount(0); setVoiceAnalysis(null); setAudioError(""); setRecTime(0); setInputMode("text"); setPitchMode("text"); };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { min-height: 100%; }
    body { font-family: 'DM Sans', sans-serif; background: #f8f9fa; color: #111827; }
    ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #f0f0f0; } ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
    .btn { transition: all 0.15s; } .btn:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.05); }
    .card { transition: all 0.18s; cursor: pointer; } .card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important; }
    textarea:focus, input:focus { outline: none; }
    .msg { animation: fadeUp 0.25s ease; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    @keyframes flashIn { 0%{transform:scale(1)} 50%{transform:scale(1.04)} 100%{transform:scale(1)} }
    .flash { animation: flashIn 0.4s ease; }
  `;

  const Header = ({ minimal = false }) => (
    <header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: minimal ? "10px 24px" : "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <img src={logoUCSC} alt="UCSC" style={{ height: minimal ? 28 : 36, objectFit: "contain" }} />
        {!minimal && <div style={{ width: 1, height: 28, background: "#e5e7eb" }} />}
        {!minimal && <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: accent, letterSpacing: "0.04em" }}>SalesIQ Lab</div>
          <div style={{ fontSize: 10, color: "#9ca3af" }}>{t.faculty}</div>
        </div>}
      </div>
      <button className="btn" onClick={() => setShowSettings(true)} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 13, color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>⚙️ {t.settings}</button>
    </header>
  );

  // ── SETUP ─────────────────────────────────────────────────────────────────────
  if (screen === "setup") return (
    <div>
      <style>{css}</style>
      {showSettings && <SettingsPanel lang={lang} setLang={setLang} accent={accent} setAccent={setAccent} t={t} onClose={() => setShowSettings(false)} />}
      <Header />

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`, padding: "44px 32px", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "inline-block", padding: "4px 14px", background: "rgba(255,255,255,0.2)", borderRadius: 100, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>{t.faculty}</div>
          <h1 style={{ fontSize: "clamp(22px,3.5vw,38px)", fontWeight: 800, lineHeight: 1.2, marginBottom: 0 }}>{t.labName}</h1>
        </div>
      </div>

      {/* Description */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 32px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: accent, marginBottom: 16 }}>ℹ️ {t.descTitle}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 16 }}>
            {[
              { icon: "🤖", text: t.desc1 },
              { icon: "💬", text: t.desc2 },
              { icon: "📊", text: t.desc3 },
            ].map((item, i) => (
              <div key={i} style={{ padding: "16px", borderRadius: 12, background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 32px" }}>
        {/* Step 1 */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent }}>{t.step1}</div>
            <button className={`btn ${randomFlash ? "flash" : ""}`} onClick={pickRandom} style={{ padding: "8px 18px", borderRadius: 10, border: `2px solid ${accent}`, background: accent + "10", color: accent, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {t.randomBtn}
            </button>
          </div>

          {randomFlash && profileId && (
            <div style={{ marginBottom: 12, padding: "8px 16px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: 13, color: "#15803d", fontWeight: 600 }}>
              🎲 {t.randomSelected} → {profiles.find(p => p.id === profileId)?.name}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px,1fr))", gap: 12 }}>
            {profiles.map(p => (
              <div key={p.id} className="card" onClick={() => setProfileId(p.id)} style={{ padding: "18px 14px", borderRadius: 14, background: "#fff", border: `2px solid ${profileId === p.id ? p.color : "#e5e7eb"}`, boxShadow: profileId === p.id ? `0 8px 24px ${p.color}28` : "0 2px 8px rgba(0,0,0,0.05)", position: "relative", overflow: "hidden" }}>
                {profileId === p.id && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: p.color }} />}
                <div style={{ fontSize: 30, marginBottom: 8 }}>{p.avatar}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: profileId === p.id ? p.color : "#111827", marginBottom: 3 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>{p.role}</div>
                <div style={{ marginTop: 8, fontSize: 10, color: "#9ca3af" }}>
                  {lang === "es" ? "Umbral" : "Threshold"}: {Math.round(p.buyThreshold * 100)}% · {lang === "es" ? "Escep." : "Skept."}: {Math.round(p.skepticism * 100)}%
                </div>
              </div>
            ))}
          </div>

          {prof && (
            <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 10, background: prof.color + "0e", border: `1px solid ${prof.color}33`, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
              <span style={{ color: prof.color, fontWeight: 700 }}>{t.profileOf} </span>{prof.personality}
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginBottom: 14 }}>{t.step2}</div>

          {/* Pitch mode toggle */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {["text", "voice"].map(m => (
              <button key={m} className="btn" onClick={() => setPitchMode(m)} style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${pitchMode === m ? accent : "#e5e7eb"}`, background: pitchMode === m ? accent + "12" : "#f9fafb", color: pitchMode === m ? accent : "#6b7280", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: pitchMode === m ? 600 : 400 }}>
                {m === "text" ? t.pitchModeText : t.pitchModeVoice}
              </button>
            ))}
          </div>

          {pitchMode === "voice" && (
            <div style={{ padding: "20px", borderRadius: 14, background: "#f9fafb", border: "1px solid #e5e7eb", marginBottom: 12, textAlign: "center" }}>
              {isPitchRec && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 3, height: 40, marginBottom: 10 }}>
                  {(wave.length > 0 ? wave : Array(20).fill(30)).map((v, i) => (
                    <div key={i} style={{ width: 3, borderRadius: 2, background: accent, height: Math.max(3, (v / 255) * 38), opacity: 0.5 + (v / 255) * 0.5 }} />
                  ))}
                </div>
              )}
              {isPitchRec && <div style={{ fontSize: 13, color: accent, marginBottom: 10, fontFamily: "monospace" }}><span style={{ animation: "blink 1s infinite", display: "inline-block" }}>●</span> {t.recording} {recTime}s</div>}
              {transcribing && <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>🔄 {t.processing}</div>}
              {voiceAnalysis && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "#fff", border: `1px solid ${accent}33`, marginBottom: 12, textAlign: "left" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: "0.08em", marginBottom: 8 }}>{t.voiceAnalysis.toUpperCase()}</div>
                  <VBar label={t.confidence} value={voiceAnalysis.confidenceScore} color={accent} unit="/100" />
                  <VBar label={t.volume} value={voiceAnalysis.avgVolume} color="#06b6d4" unit="%" />
                  <VBar label={t.silence} value={voiceAnalysis.silenceRatio} max={60} color="#f97316" unit="%" />
                </div>
              )}
              {audioError && <div style={{ fontSize: 12, color: "#059669", marginBottom: 10, padding: "6px 12px", background: "#f0fdf4", borderRadius: 6 }}>{audioError}</div>}
              <button className="btn" onClick={handlePitchRec} disabled={transcribing} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: isPitchRec ? "#dc2626" : accent, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {isPitchRec ? t.stopPitch : t.recordPitch}
              </button>
            </div>
          )}

          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "4px" }}>
            <textarea value={pitch} onChange={e => setPitch(e.target.value)} placeholder={t.pitchPlaceholder}
              style={{ width: "100%", minHeight: 140, padding: "16px", border: "none", borderRadius: 11, fontSize: 14, lineHeight: 1.7, color: "#111827", background: "transparent", resize: "vertical", fontFamily: "inherit" }}
              onFocus={e => e.target.parentElement.style.borderColor = accent}
              onBlur={e => e.target.parentElement.style.borderColor = "#e5e7eb"}
            />
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#9ca3af", marginTop: 5 }}>{pitch.length} {t.charCount}</div>
        </div>

        <button className="btn" onClick={startSession} disabled={!profileId || !pitch.trim()} style={{ width: "100%", padding: "16px", borderRadius: 13, border: "none", background: (!profileId || !pitch.trim()) ? "#e5e7eb" : accent, color: (!profileId || !pitch.trim()) ? "#9ca3af" : "#fff", fontSize: 16, fontWeight: 700, cursor: (!profileId || !pitch.trim()) ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: (!profileId || !pitch.trim()) ? "none" : `0 8px 24px ${accent}44` }}>
          {!profileId ? t.selectFirst : !pitch.trim() ? t.enterPitch : t.startBtn}
        </button>
      </div>
    </div>
  );

  // ── CHAT ──────────────────────────────────────────────────────────────────────
  if (screen === "chat") return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f8f9fa", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{css}</style>
      {showSettings && <SettingsPanel lang={lang} setLang={setLang} accent={accent} setAccent={setAccent} t={t} onClose={() => setShowSettings(false)} />}

      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logoUCSC} alt="UCSC" style={{ height: 26, objectFit: "contain" }} />
          <div style={{ width: 1, height: 22, background: "#e5e7eb" }} />
          <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: prof.color + "18", border: `2px solid ${prof.color}44` }}>{prof.avatar}</div>
          <div><div style={{ fontWeight: 700, fontSize: 13, color: prof.color }}>{prof.name}</div><div style={{ fontSize: 10, color: "#9ca3af" }}>{prof.role}</div></div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>{qCount} {t.responses}</span>
          <button className="btn" onClick={() => setShowSettings(true)} style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>⚙️</button>
          <button className="btn" onClick={() => setScreen("summary")} style={{ padding: "6px 13px", borderRadius: 8, border: `1px solid ${accent}`, background: accent + "0e", color: accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t.summaryBtn}</button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Messages */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map((msg, i) => (
              <div key={i} className="msg" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ maxWidth: "82%", padding: "13px 17px", borderRadius: 15, fontSize: 14, lineHeight: 1.75,
                  ...(msg.role === "user"
                    ? { alignSelf: "flex-end", background: accent, color: "#fff", borderBottomRightRadius: 3, boxShadow: `0 4px 14px ${accent}44` }
                    : { alignSelf: "flex-start", background: "#fff", border: "1px solid #e5e7eb", borderBottomLeftRadius: 3, color: "#111827", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" })
                }}>
                  {msg.role === "assistant" && <div style={{ fontSize: 10, fontWeight: 700, color: prof.color, marginBottom: 5, letterSpacing: "0.07em" }}>{prof.avatar} {prof.name}</div>}
                  <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                </div>

                {msg.voiceAnalysis && (
                  <div style={{ alignSelf: "flex-end", display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {[
                      { label: `🎙 ${msg.voiceAnalysis.confidenceScore}/100`, col: msg.voiceAnalysis.confidenceScore >= 70 ? "#16a34a" : msg.voiceAnalysis.confidenceScore >= 45 ? "#ca8a04" : "#dc2626" },
                      { label: `⏱ ${msg.voiceAnalysis.duration}s`, col: "#6b7280" },
                      { label: `⏸ ${msg.voiceAnalysis.pauseCount} pausas`, col: "#6b7280" },
                    ].map((b, j) => <div key={j} style={{ padding: "2px 9px", borderRadius: 100, fontSize: 11, background: "#f3f4f6", border: "1px solid #e5e7eb", color: b.col }}>{b.label}</div>)}
                  </div>
                )}

                {msg.evaluation && msg.role === "assistant" && (
                  <div style={{ alignSelf: "flex-start", maxWidth: "82%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    <div style={{ padding: "9px 12px", borderRadius: 9, background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: 11, color: "#166534" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#16a34a", marginBottom: 3, letterSpacing: "0.08em" }}>✦ {t.positive}</div>{msg.evaluation.positive}
                    </div>
                    <div style={{ padding: "9px 12px", borderRadius: 9, background: "#fef2f2", border: "1px solid #fecaca", fontSize: 11, color: "#991b1b" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#dc2626", marginBottom: 3, letterSpacing: "0.08em" }}>⚠ {t.critical}</div>{msg.evaluation.negative}
                    </div>
                    {msg.evaluation.voice && msg.evaluation.voice !== "N/A" && (
                      <div style={{ padding: "9px 12px", borderRadius: 9, background: "#eff6ff", border: "1px solid #bfdbfe", fontSize: 11, color: "#1e40af" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#2563eb", marginBottom: 3, letterSpacing: "0.08em" }}>🎙 {t.voiceNote}</div>{msg.evaluation.voice}
                      </div>
                    )}
                    <div style={{ padding: "9px 12px", borderRadius: 9, background: "#fffbeb", border: "1px solid #fde68a", fontSize: 11, color: "#92400e" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#d97706", marginBottom: 3, letterSpacing: "0.08em" }}>💡 {t.recommendation}</div>{msg.evaluation.advice}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {(loading || transcribing) && (
              <div style={{ display: "flex", gap: 5, padding: "11px 14px", maxWidth: 80, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
                {[0,1,2].map(j => <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: prof.color, animation: `pulse 1.2s ease ${j*0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={chatEnd} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #e5e7eb", background: "#fff", flexShrink: 0 }}>
            {audioError && <div style={{ fontSize: 12, color: "#059669", marginBottom: 8, padding: "6px 10px", background: "#f0fdf4", borderRadius: 6 }}>{audioError}</div>}
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {["text", "voice"].map(m => (
                <button key={m} className="btn" onClick={() => setInputMode(m)} style={{ padding: "5px 13px", borderRadius: 7, border: `1px solid ${inputMode === m ? accent : "#e5e7eb"}`, background: inputMode === m ? accent + "12" : "#f9fafb", color: inputMode === m ? accent : "#6b7280", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: inputMode === m ? 600 : 400 }}>
                  {m === "text" ? t.modeText : t.modeVoice}
                </button>
              ))}
              {voiceAnalysis && <div style={{ fontSize: 11, color: "#059669", padding: "5px 10px", background: "#f0fdf4", borderRadius: 7, border: "1px solid #bbf7d0" }}>🎙 {t.confidence}: {voiceAnalysis.confidenceScore}/100</div>}
            </div>

            {inputMode === "text" ? (
              <div style={{ display: "flex", gap: 8, background: "#f9fafb", borderRadius: 12, padding: "4px", border: "1px solid #e5e7eb" }}>
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={t.inputPlaceholder} rows={2}
                  style={{ flex: 1, padding: "9px 13px", borderRadius: 9, border: "none", background: "transparent", color: "#111827", fontSize: 14, resize: "none", fontFamily: "inherit", lineHeight: 1.5 }}
                />
                <button className="btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}
                  style={{ padding: "9px 16px", borderRadius: 9, border: "none", background: input.trim() && !loading ? accent : "#e5e7eb", color: input.trim() && !loading ? "#fff" : "#9ca3af", cursor: input.trim() && !loading ? "pointer" : "not-allowed", fontSize: 18, alignSelf: "flex-end" }}>→</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "14px", background: "#f9fafb", borderRadius: 12, border: "1px solid #e5e7eb" }}>
                {isRec && (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
                    {(wave.length > 0 ? wave : Array(18).fill(30)).map((v, i) => (
                      <div key={i} style={{ width: 3, borderRadius: 2, background: accent, height: Math.max(3, (v / 255) * 30) }} />
                    ))}
                    <span style={{ marginLeft: 8, fontSize: 12, color: "#dc2626", fontFamily: "monospace" }}>● {recTime}s</span>
                  </div>
                )}
                {transcribing && <div style={{ fontSize: 12, color: "#6b7280" }}>🔄 {t.processing}</div>}
                <button className="btn" onClick={handleVoiceMsg} disabled={loading || transcribing}
                  style={{ padding: "10px 26px", borderRadius: 10, border: "none", background: isRec ? "#dc2626" : accent, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {isRec ? t.stopBtn : t.recordBtn}
                </button>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{t.voiceHint}</div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 200, borderLeft: "1px solid #e5e7eb", padding: "18px 13px", display: "flex", flexDirection: "column", gap: 18, overflowY: "auto", flexShrink: 0, background: "#fff" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase" }}>{t.evalSection}</div>
          {evaluation && <Meter value={evaluation.probability} />}
          {evaluation && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#6b7280", fontStyle: "italic", lineHeight: 1.5, padding: "7px 10px", background: "#f9fafb", borderRadius: 7, marginBottom: 7 }}>"{evaluation.reason}"</div>
              <div style={{ display: "inline-block", padding: "3px 11px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: evaluation.probability >= prof.buyThreshold * 100 ? "#f0fdf4" : "#fef2f2", color: evaluation.probability >= prof.buyThreshold * 100 ? "#16a34a" : "#dc2626", border: `1px solid ${evaluation.probability >= prof.buyThreshold * 100 ? "#bbf7d0" : "#fecaca"}` }}>
                {evaluation.probability >= prof.buyThreshold * 100 ? t.wouldBuy : t.wouldNotBuy}
              </div>
              <div style={{ fontSize: 10, color: "#d1d5db", marginTop: 5 }}>{t.threshold}: {Math.round(prof.buyThreshold * 100)}%</div>
            </div>
          )}
          {voiceAnalysis && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 8 }}>{t.voiceAnalysis}</div>
              <VBar label={t.confidence} value={voiceAnalysis.confidenceScore} color={accent} unit="/100" />
              <VBar label={t.volume} value={voiceAnalysis.avgVolume} color="#06b6d4" unit="%" />
              <VBar label={t.silence} value={voiceAnalysis.silenceRatio} max={60} color="#f97316" unit="%" />
            </div>
          )}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 7 }}>{t.interests}</div>
            {prof.focus.map(f => <div key={f} style={{ padding: "4px 8px", marginBottom: 4, borderRadius: 5, fontSize: 11, background: prof.color + "0e", color: prof.color, border: `1px solid ${prof.color}22` }}>• {f}</div>)}
          </div>
        </div>
      </div>
    </div>
  );

  // ── SUMMARY ───────────────────────────────────────────────────────────────────
  if (screen === "summary") {
    const evals = messages.filter(m => m.evaluation).map(m => m.evaluation);
    const lastEval = evals[evals.length - 1];
    const avgProb = evals.length ? Math.round(evals.reduce((s, e) => s + e.probability, 0) / evals.length) : 0;
    const bought = lastEval && lastEval.probability >= prof.buyThreshold * 100;
    const voiceMsgs = messages.filter(m => m.voiceAnalysis);
    const avgConf = voiceMsgs.length ? Math.round(voiceMsgs.reduce((s, m) => s + m.voiceAnalysis.confidenceScore, 0) / voiceMsgs.length) : null;
    const grade = avgProb >= 75 ? "A" : avgProb >= 55 ? "B" : avgProb >= 35 ? "C" : "D";
    const gc = { A: "#16a34a", B: "#ca8a04", C: "#ea580c", D: "#dc2626" }[grade];
    const gradeDesc = { A: t.gradeA, B: t.gradeB, C: t.gradeC, D: t.gradeD }[grade];

    return (
      <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{css}</style>
        {showSettings && <SettingsPanel lang={lang} setLang={setLang} accent={accent} setAccent={setAccent} t={t} onClose={() => setShowSettings(false)} />}
        <Header minimal />

        <div style={{ background: bought ? "#f0fdf4" : "#fef2f2", borderBottom: `3px solid ${bought ? "#22c55e" : "#ef4444"}`, padding: "28px", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>{bought ? "🎉" : "📊"}</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: bought ? "#15803d" : "#b91c1c", marginBottom: 6 }}>{bought ? t.summaryTitle1 : t.summaryTitle2}</h1>
          <p style={{ color: "#6b7280", fontSize: 13 }}>{prof.avatar} {prof.name} · {prof.role} · {qCount} {t.exchanges}</p>
        </div>

        <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: avgConf ? "1fr 1fr" : "1fr", gap: 14, marginBottom: 20 }}>
            <div style={{ padding: "24px", borderRadius: 16, textAlign: "center", background: "#fff", border: `2px solid ${bought ? "#bbf7d0" : "#fecaca"}`, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 56, fontWeight: 900, color: bought ? "#16a34a" : "#dc2626", lineHeight: 1, fontFamily: "monospace" }}>{lastEval?.probability ?? avgProb}%</div>
              <div style={{ color: "#6b7280", fontSize: 12, marginTop: 5 }}>{t.buyProbLabel}</div>
              <div style={{ marginTop: 8, display: "inline-block", padding: "3px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: bought ? "#f0fdf4" : "#fef2f2", color: bought ? "#16a34a" : "#dc2626" }}>{t.thresholdLabel}: {Math.round(prof.buyThreshold * 100)}%</div>
            </div>
            {avgConf !== null && (
              <div style={{ padding: "24px", borderRadius: 16, textAlign: "center", background: "#fff", border: "2px solid #e5e7eb", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 56, fontWeight: 900, color: avgConf >= 70 ? "#16a34a" : avgConf >= 45 ? "#ca8a04" : "#dc2626", lineHeight: 1, fontFamily: "monospace" }}>{avgConf}</div>
                <div style={{ color: "#6b7280", fontSize: 12, marginTop: 5 }}>{t.confidence}</div>
                <div style={{ marginTop: 8, display: "inline-block", padding: "3px 12px", borderRadius: 100, fontSize: 11, background: "#f3f4f6", color: "#374151" }}>{voiceMsgs.length} grabaciones</div>
              </div>
            )}
          </div>

          {evals.length > 1 && (
            <div style={{ padding: "18px", borderRadius: 14, background: "#fff", border: "1px solid #e5e7eb", marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 12 }}>{t.evolution}</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 52 }}>
                {evals.map((e, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{ fontSize: 9, color: "#9ca3af" }}>{e.probability}%</div>
                    <div style={{ width: "100%", borderRadius: 3, height: Math.max(3, (e.probability / 100) * 44), background: e.probability >= prof.buyThreshold * 100 ? "#22c55e" : accent }} />
                    <div style={{ fontSize: 9, color: "#d1d5db" }}>R{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lastEval && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={{ padding: "14px", borderRadius: 11, background: "#f0fdf4", border: "1px solid #bbf7d0" }}><div style={{ fontSize: 9, fontWeight: 700, color: "#16a34a", letterSpacing: "0.08em", marginBottom: 6 }}>✦ {t.strength}</div><div style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>{lastEval.positive}</div></div>
              <div style={{ padding: "14px", borderRadius: 11, background: "#fef2f2", border: "1px solid #fecaca" }}><div style={{ fontSize: 9, fontWeight: 700, color: "#dc2626", letterSpacing: "0.08em", marginBottom: 6 }}>⚠ {t.weakness}</div><div style={{ fontSize: 13, color: "#991b1b", lineHeight: 1.6 }}>{lastEval.negative}</div></div>
              <div style={{ gridColumn: "1/-1", padding: "14px", borderRadius: 11, background: "#fffbeb", border: "1px solid #fde68a" }}><div style={{ fontSize: 9, fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", marginBottom: 6 }}>💡 {t.nextStep}</div><div style={{ fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>{lastEval.advice}</div></div>
            </div>
          )}

          <div style={{ padding: "18px", borderRadius: 13, textAlign: "center", marginBottom: 20, background: "#fff", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 5 }}>{t.overallGrade}</div>
            <div style={{ fontSize: 64, fontWeight: 900, color: gc, lineHeight: 1, fontFamily: "monospace" }}>{grade}</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 5 }}>{gradeDesc}</div>
          </div>

          <button className="btn" onClick={restart} style={{ width: "100%", padding: "15px", borderRadius: 13, border: "none", background: accent, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${accent}44` }}>
            {t.newEval}
          </button>
        </div>
      </div>
    );
  }
}
