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
import { maybeSaveBestChain } from "../utils/gameStore";

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

  useEffect(() => {
    if (state.phase !== "playing") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          maybeSaveBestChain(prev.chain, prev.score);
          return { ...prev, phase: "gameover", timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.phase]);

  function startGame() {
    setState((p) =>
      p.phase === "idle"
        ? { ...p, phase: "playing" }
        : { ...initGame(), phase: "playing" }
    );
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

  const timerColor = state.timeLeft <= 5 ? "#ef4444" : state.timeLeft <= 9 ? ACCENT : "#22c55e";

  // ── IDLE ──
  if (state.phase === "idle") {
    return (
      <Layout onBack={() => navigate("/")}>
        <Box sx={{ width: "100%", px: { xs: 1.5, md: 2 }, pb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Typography sx={{ fontSize: 13, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Palabra inicial
            </Typography>
            <Box sx={{ px: 4, py: 2, borderRadius: "12px", backgroundColor: `${ACCENT}18`, border: `2px solid ${ACCENT}` }}>
              <Typography sx={{ color: ACCENT, fontWeight: 900, fontSize: 36, fontFamily: "monospace", letterSpacing: 3 }}>
                {state.currentWord.toUpperCase()}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 14, color: "#666", textAlign: "center" }}>
              Tomá la última sílaba y enganchá la siguiente palabra
            </Typography>
          </Box>

          <Button onClick={startGame} variant="contained" size="large" sx={{
            backgroundColor: "#f3f3f3", color: ACCENT, fontWeight: 800, fontSize: 20,
            py: 1.8, borderRadius: 999, textTransform: "none", "&:hover": { backgroundColor: "#fff" },
          }}>
            ¡Empezar!
          </Button>
        </Box>
      </Layout>
    );
  }

  // ── GAME OVER ──
  if (state.phase === "gameover") {
    return (
      <Layout onBack={() => navigate("/")}>
        <Box sx={{ width: "100%", px: { xs: 1.5, md: 2 }, pb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: 52 }}>⏰</Typography>
            <Typography sx={{ fontFamily: "Lobster, cursive", fontSize: 28, color: "#222" }}>¡Se acabó el tiempo!</Typography>
            <Box sx={{ px: 4, py: 2, borderRadius: "12px", backgroundColor: `${ACCENT}18`, border: `2px solid ${ACCENT}`, textAlign: "center", mt: 1 }}>
              <Typography sx={{ color: "#888", fontSize: 13, mb: 0.5 }}>Puntaje</Typography>
              <Typography sx={{ color: ACCENT, fontWeight: 900, fontSize: 52 }}>{state.score}</Typography>
            </Box>
            <Typography sx={{ color: "#888", fontSize: 13 }}>
              Cadena de {state.chain.length - 1} palabras
            </Typography>
          </Box>

          {/* Cadena completa */}
          <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 2 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#888", mb: 1.5, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Tu cadena
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {state.chain.map((w, i) => (
                <Box key={i} sx={{
                  px: 1.5, py: 0.5, borderRadius: "6px",
                  backgroundColor: i === 0 ? "#e5e7eb" : `${ACCENT}18`,
                  border: `1px solid ${i === 0 ? "#d1d5db" : ACCENT}`,
                }}>
                  <Typography sx={{ color: i === 0 ? "#6b7280" : ACCENT, fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>
                    {w}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Button onClick={startGame} variant="contained" size="large" sx={{
            backgroundColor: "#f3f3f3", color: ACCENT, fontWeight: 800, fontSize: 18,
            py: 1.6, borderRadius: 999, textTransform: "none", "&:hover": { backgroundColor: "#fff" },
          }}>
            Jugar de nuevo
          </Button>
          <Button onClick={() => navigate("/")} sx={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
            Volver al inicio
          </Button>
        </Box>
      </Layout>
    );
  }

  // ── PLAYING ──
  return (
    <Layout onBack={() => navigate("/")}>
      <Box sx={{ width: "100%", px: { xs: 1.5, md: 2 }, pb: 2, display: "flex", flexDirection: "column", gap: 2 }}>

        {/* Score + timer */}
        <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>Puntaje</Typography>
            <Typography sx={{ color: ACCENT, fontWeight: 900, fontSize: 28 }}>{state.score}</Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>Palabras</Typography>
            <Typography sx={{ color: "#374151", fontWeight: 900, fontSize: 28 }}>{state.chain.length - 1}</Typography>
          </Box>
          <Box sx={{
            width: 56, height: 56, borderRadius: "50%",
            border: `3px solid ${timerColor}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Typography sx={{ color: timerColor, fontWeight: 900, fontSize: 22 }}>{state.timeLeft}</Typography>
          </Box>
        </Box>

        {/* Palabra actual + sílaba requerida */}
        <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 2.5, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
          <Typography sx={{ color: "#888", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>
            Palabra actual
          </Typography>
          <Box sx={{ px: 3, py: 1.5, borderRadius: "10px", backgroundColor: "#e5e7eb", border: "1px solid #d1d5db" }}>
            <Typography sx={{ color: "#111", fontWeight: 900, fontSize: 30, fontFamily: "monospace", letterSpacing: 2 }}>
              {state.currentWord.toUpperCase()}
            </Typography>
          </Box>
          <Typography sx={{ color: "#888", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>
            Tu palabra debe empezar con
          </Typography>
          <Box sx={{ px: 3, py: 1, borderRadius: "8px", backgroundColor: `${ACCENT}18`, border: `2px solid ${ACCENT}` }}>
            <Typography sx={{ color: ACCENT, fontWeight: 900, fontSize: 30, fontFamily: "monospace", letterSpacing: 3 }}>
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
          placeholder={`Empezá con ${state.challengeSyllable.toUpperCase()}...`}
          autoComplete="off"
          autoCapitalize="none"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff", borderRadius: "10px",
              fontSize: 22, fontWeight: 700, color: "#111",
              "& fieldset": { borderColor: "#d1d5db", borderWidth: 2 },
              "&:hover fieldset": { borderColor: ACCENT },
              "&.Mui-focused fieldset": { borderColor: ACCENT },
            },
            "& input": { color: "#111", py: 1.8, textAlign: "center", letterSpacing: 1, textTransform: "uppercase" },
            "& input::placeholder": { color: "#aaa", opacity: 1 },
          }}
        />

        {/* Error */}
        <Box sx={{ minHeight: 24, textAlign: "center" }}>
          {state.errorMsg && (
            <Typography sx={{ color: "#ef4444", fontSize: 14, fontWeight: 700 }}>{state.errorMsg}</Typography>
          )}
        </Box>

        <Button onClick={submitWord} variant="contained" fullWidth sx={{
          backgroundColor: "#f3f3f3", color: ACCENT, fontWeight: 800, fontSize: 18,
          py: 1.6, borderRadius: "10px", textTransform: "none", "&:hover": { backgroundColor: "#fff" },
        }}>
          Confirmar →
        </Button>

        {/* Cadena */}
        {state.chain.length > 1 && (
          <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 2 }}>
            <Typography sx={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, mb: 1, fontWeight: 700 }}>
              Cadena ({state.chain.length - 1})
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {state.chain.slice(1).map((w, i) => (
                <Box key={i} sx={{
                  px: 1.5, py: 0.4, borderRadius: "6px",
                  backgroundColor: `${ACCENT}18`, border: `1px solid ${ACCENT}55`,
                }}>
                  <Typography sx={{ color: ACCENT, fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>
                    {w}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

      </Box>
    </Layout>
  );
}
