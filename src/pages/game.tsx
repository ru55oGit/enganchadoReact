import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Layout from "../components/Layout";
import {
  normalize,
  isValidWord,
  isMonosyllable,
  getChallengeSyllable,
  getStartingWord,
  wordStartsWithSyllable,
} from "../utils/wordEngine";

const ACCENT = "#f97316";
const TIMER_START = 15;

type Phase = "idle" | "playing" | "gameover";

interface GameState {
  phase: Phase;
  currentWord: string;
  challengeSyllable: string;
  chain: string[];
  usedWords: Set<string>;
  score: number;
  timeLeft: number;
  errorMsg: string;
  input: string;
}

function initGame(): GameState {
  const startWord = getStartingWord();
  const syl = getChallengeSyllable(startWord);
  return {
    phase: "idle",
    currentWord: startWord,
    challengeSyllable: syl,
    chain: [startWord],
    usedWords: new Set([normalize(startWord)]),
    score: 0,
    timeLeft: TIMER_START,
    errorMsg: "",
    input: "",
  };
}

export default function Game() {
  const navigate = useNavigate();
  const [state, setState] = useState<GameState>(initGame);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (state.phase !== "playing") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return { ...prev, phase: "gameover", timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.phase]);

  function startGame() {
    const s = initGame();
    setState({ ...s, phase: "playing" });
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function submitWord() {
    const word = state.input.trim().toLowerCase();

    if (word.length < 3) {
      setState((p) => ({ ...p, errorMsg: "La palabra debe tener al menos 3 letras." }));
      return;
    }
    if (!wordStartsWithSyllable(word, state.challengeSyllable)) {
      setState((p) => ({ ...p, errorMsg: `La palabra debe empezar con "${state.challengeSyllable.toUpperCase()}".` }));
      return;
    }
    if (!isValidWord(word)) {
      setState((p) => ({ ...p, errorMsg: "Esa palabra no existe en el diccionario." }));
      return;
    }
    if (isMonosyllable(word)) {
      setState((p) => ({ ...p, errorMsg: "No valen monosílabos." }));
      return;
    }
    if (state.usedWords.has(normalize(word))) {
      setState((p) => ({ ...p, errorMsg: "Esa palabra ya fue usada." }));
      return;
    }

    // Valid word
    const speedBonus = state.timeLeft >= 10 ? 5 : 0;
    const lengthBonus = Math.max(0, word.length - 4);
    const points = 10 + speedBonus + lengthBonus;
    const newSyl = getChallengeSyllable(word);
    const newUsed = new Set(state.usedWords);
    newUsed.add(normalize(word));

    setState((p) => ({
      ...p,
      currentWord: word.toUpperCase(),
      challengeSyllable: newSyl,
      chain: [...p.chain, word.toUpperCase()],
      usedWords: newUsed,
      score: p.score + points,
      timeLeft: TIMER_START,
      errorMsg: "",
      input: "",
    }));
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") submitWord();
  }

  const timerColor = state.timeLeft <= 5 ? "#ef4444" : state.timeLeft <= 9 ? "#f97316" : "#22c55e";

  // ── IDLE ──
  if (state.phase === "idle") {
    return (
      <Layout>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, pt: 4 }}>
          <Box onClick={() => navigate("/")} sx={{ alignSelf: "flex-start", color: "#818cf8", cursor: "pointer", fontSize: 28, mb: 2 }}>‹</Box>
          <Typography sx={{ fontSize: 48, mb: 2 }}>🔗</Typography>
          <Typography sx={{ fontFamily: "'Lobster', cursive", fontSize: 36, color: "#fff", mb: 1 }}>Enganchado</Typography>
          <Typography sx={{ color: "#94a3b8", fontSize: 14, mb: 4 }}>Empezás con la palabra:</Typography>
          <Box sx={{ px: 4, py: 2, borderRadius: "12px", backgroundColor: `${ACCENT}22`, border: `2px solid ${ACCENT}`, mb: 6 }}>
            <Typography sx={{ color: ACCENT, fontWeight: 900, fontSize: 32, fontFamily: "monospace", letterSpacing: 2 }}>
              {state.currentWord.toUpperCase()}
            </Typography>
          </Box>
          <Button
            onClick={startGame}
            variant="contained"
            size="large"
            sx={{ backgroundColor: ACCENT, color: "#fff", fontWeight: 800, fontSize: 20, px: 6, py: 1.8, borderRadius: 999, textTransform: "none", "&:hover": { backgroundColor: "#ea6c0a" } }}
          >
            ¡Empezar!
          </Button>
        </Box>
      </Layout>
    );
  }

  // ── GAME OVER ──
  if (state.phase === "gameover") {
    return (
      <Layout>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, pt: 6 }}>
          <Typography sx={{ fontSize: 64, mb: 2 }}>⏰</Typography>
          <Typography sx={{ fontFamily: "'Lobster', cursive", fontSize: 36, color: "#fff", mb: 1 }}>¡Se acabó el tiempo!</Typography>
          <Box sx={{ px: 4, py: 2, borderRadius: "12px", backgroundColor: `${ACCENT}22`, border: `2px solid ${ACCENT}`, mb: 2, textAlign: "center" }}>
            <Typography sx={{ color: "#94a3b8", fontSize: 13, mb: 0.5 }}>Puntaje</Typography>
            <Typography sx={{ color: ACCENT, fontWeight: 900, fontSize: 48 }}>{state.score}</Typography>
          </Box>
          <Typography sx={{ color: "#64748b", fontSize: 13, mb: 1 }}>Cadena de {state.chain.length - 1} palabras</Typography>

          {/* Cadena */}
          <Box sx={{ width: "100%", p: 2, borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", mb: 4, maxHeight: 200, overflowY: "auto" }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {state.chain.map((w, i) => (
                <Typography key={i} sx={{ color: i === 0 ? "#64748b" : "#e2e8f0", fontFamily: "monospace", fontSize: 13, backgroundColor: "rgba(255,255,255,0.07)", px: 1, py: 0.25, borderRadius: "4px" }}>
                  {w}
                </Typography>
              ))}
            </Box>
          </Box>

          <Button onClick={startGame} variant="contained" size="large"
            sx={{ backgroundColor: ACCENT, color: "#fff", fontWeight: 800, fontSize: 18, px: 5, py: 1.6, borderRadius: 999, textTransform: "none", "&:hover": { backgroundColor: "#ea6c0a" }, mb: 2 }}>
            Jugar de nuevo
          </Button>
          <Button onClick={() => navigate("/")} sx={{ color: "#818cf8", fontSize: 14 }}>
            Volver al inicio
          </Button>
        </Box>
      </Layout>
    );
  }

  // ── PLAYING ──
  return (
    <Layout>
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box onClick={() => navigate("/")} sx={{ color: "#818cf8", cursor: "pointer", fontSize: 28 }}>‹</Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Puntaje</Typography>
              <Typography sx={{ color: ACCENT, fontWeight: 800, fontSize: 20 }}>{state.score}</Typography>
            </Box>
            <Box sx={{ width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.1)" }} />
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Palabras</Typography>
              <Typography sx={{ color: "#c7d2fe", fontWeight: 800, fontSize: 20 }}>{state.chain.length - 1}</Typography>
            </Box>
          </Box>
          {/* Timer */}
          <Box sx={{ width: 44, height: 44, borderRadius: "50%", border: `2px solid ${timerColor}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ color: timerColor, fontWeight: 800, fontSize: 18 }}>{state.timeLeft}</Typography>
          </Box>
        </Box>

        {/* Palabra actual */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography sx={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, mb: 1 }}>Palabra actual</Typography>
          <Box sx={{ px: 3, py: 2, borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", display: "inline-block" }}>
            <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 28, fontFamily: "monospace", letterSpacing: 2 }}>
              {state.currentWord}
            </Typography>
          </Box>
        </Box>

        {/* Sílaba requerida */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography sx={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, mb: 0.5 }}>Tu palabra debe empezar con</Typography>
          <Box sx={{ display: "inline-block", px: 3, py: 1, borderRadius: "8px", backgroundColor: `${ACCENT}22`, border: `2px solid ${ACCENT}` }}>
            <Typography sx={{ color: ACCENT, fontWeight: 900, fontSize: 28, fontFamily: "monospace", letterSpacing: 3 }}>
              {state.challengeSyllable.toUpperCase()}
            </Typography>
          </Box>
        </Box>

        {/* Input */}
        <TextField
          inputRef={inputRef}
          value={state.input}
          onChange={(e) => setState((p) => ({ ...p, input: e.target.value, errorMsg: "" }))}
          onKeyDown={handleKeyDown}
          placeholder={`Escribí una palabra con ${state.challengeSyllable.toUpperCase()}...`}
          autoComplete="off"
          autoCapitalize="none"
          sx={{
            mb: 1,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "10px",
              fontSize: 20, fontWeight: 700, color: "#fff",
              "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&:hover fieldset": { borderColor: ACCENT },
              "&.Mui-focused fieldset": { borderColor: ACCENT },
            },
            "& input": { color: "#fff", py: 1.8, textAlign: "center", letterSpacing: 1 },
            "& input::placeholder": { color: "rgba(255,255,255,0.25)", opacity: 1 },
          }}
        />

        {/* Error */}
        <Box sx={{ minHeight: 24, textAlign: "center", mb: 2 }}>
          {state.errorMsg && (
            <Typography sx={{ color: "#ef4444", fontSize: 13 }}>{state.errorMsg}</Typography>
          )}
        </Box>

        <Button
          onClick={submitWord}
          variant="contained"
          fullWidth
          sx={{ backgroundColor: ACCENT, color: "#fff", fontWeight: 800, fontSize: 18, py: 1.6, borderRadius: "10px", textTransform: "none", "&:hover": { backgroundColor: "#ea6c0a" }, mb: 3 }}
        >
          Confirmar →
        </Button>

        {/* Cadena */}
        {state.chain.length > 1 && (
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <Typography sx={{ color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, mb: 1 }}>
              Cadena ({state.chain.length - 1})
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {state.chain.slice(1).map((w, i) => (
                <Typography key={i} sx={{ color: "#94a3b8", fontFamily: "monospace", fontSize: 12, backgroundColor: "rgba(255,255,255,0.06)", px: 1, py: 0.25, borderRadius: "4px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {w}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Layout>
  );
}
