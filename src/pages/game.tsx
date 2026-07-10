import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Layout from "../components/Layout";
import VirtualKeyboard from "../components/VirtualKeyboard";
import { useLanguage } from "../i18n/LanguageContext";
import { getGameEngine, WordGameEngine } from "../utils/gameEngine";
import { maybeSaveBestChain } from "../utils/gameStore";

const ACCENT = "#e74c3c";
const TIMER_START = 15;

type Phase = "idle" | "playing" | "gameover";

interface GameState {
  phase: Phase;
  currentWord: string;
  challengeUnit: string;
  chain: string[];
  usedWords: Set<string>;
  score: number;
  timeLeft: number;
  errorMsg: string;
  input: string;
}

function initGame(engine: WordGameEngine): GameState {
  const startWord = engine.getStartingWord();
  const unit = engine.getChallengeUnit(startWord);
  return {
    phase: "idle",
    currentWord: startWord,
    challengeUnit: unit,
    chain: [startWord],
    usedWords: new Set([engine.normalize(startWord)]),
    score: 0,
    timeLeft: TIMER_START,
    errorMsg: "",
    input: "",
  };
}

function playSuccessSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(523, ctx.currentTime);
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch { /* audio not supported */ }
}

function playErrorSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch { /* audio not supported */ }
}

export default function Game() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const engine = getGameEngine(currentLanguage);
  const [state, setState] = useState<GameState>(() => initGame(engine));

  // Timer
  useEffect(() => {
    if (state.phase !== "playing") return;
    const id = setInterval(() => {
      setState((prev) => {
        if (prev.phase !== "playing") return prev;
        if (prev.timeLeft <= 1) {
          clearInterval(id);
          maybeSaveBestChain(currentLanguage, prev.chain, prev.score);
          return { ...prev, phase: "gameover", timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state.phase, currentLanguage]);

  function startGame() {
    setState((p) =>
      p.phase === "idle"
        ? { ...p, phase: "playing" }
        : { ...initGame(engine), phase: "playing" }
    );
  }

  function handleChooseStartingWord(e: SelectChangeEvent) {
    const word = e.target.value;
    setState((p) => ({
      ...p,
      currentWord: word,
      challengeUnit: engine.getChallengeUnit(word),
      chain: [word],
      usedWords: new Set([engine.normalize(word)]),
    }));
  }

  const submitWord = useCallback(() => {
    setState((p) => {
      const word = p.input.trim().toLowerCase();
      const err = (msg: string) => { playErrorSound(); return { ...p, errorMsg: msg }; };

      if (word.length < 3) return err(t.errorTooShort);
      if (!engine.unitMatchesWord(word, p.challengeUnit))
        return err(t.errorWrongStart(p.challengeUnit.toUpperCase()));
      if (!engine.isValidWord(word)) return err(t.errorNotInDictionary);
      if (engine.isRejected(word)) return err(t.errorMonosyllable);
      if (p.usedWords.has(engine.normalize(word))) return err(t.errorAlreadyUsed);

      playSuccessSound();
      const speedBonus = p.timeLeft >= 10 ? 5 : 0;
      const lengthBonus = Math.max(0, word.length - 4);
      const points = 10 + speedBonus + lengthBonus;
      const newUnit = engine.getChallengeUnit(word);
      const newUsed = new Set(p.usedWords);
      newUsed.add(engine.normalize(word));

      return {
        ...p,
        currentWord: word.toUpperCase(),
        challengeUnit: newUnit,
        chain: [...p.chain, word.toUpperCase()],
        usedWords: newUsed,
        score: p.score + points,
        timeLeft: TIMER_START,
        errorMsg: "",
        input: "",
      };
    });
  }, [engine, t]);

  // Physical keyboard support
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (state.phase !== "playing") return;
      if (e.key === "Enter") { submitWord(); return; }
      if (e.key === "Backspace") {
        setState(p => ({ ...p, input: p.input.slice(0, -1), errorMsg: "" }));
        return;
      }
      if (/^[a-záéíóúüñãõâêôçàA-ZÁÉÍÓÚÜÑÃÕÂÊÔÇÀ]$/.test(e.key)) {
        setState(p => ({ ...p, input: p.input + e.key.toLowerCase(), errorMsg: "" }));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.phase, submitWord]);

  function handleVirtualKey(key: string) {
    if (state.phase !== "playing") return;
    if (key === "⌫") {
      setState(p => ({ ...p, input: p.input.slice(0, -1), errorMsg: "" }));
    } else {
      setState(p => ({ ...p, input: p.input + key.toLowerCase(), errorMsg: "" }));
    }
  }

  const timerColor = state.timeLeft <= 5 ? "#f50909" : state.timeLeft <= 9 ? "#f0e808" : "#22c55e";
  const timerPct = (state.timeLeft / TIMER_START) * 100;

  // ── IDLE ──
  if (state.phase === "idle") {
    return (
      <Layout onBack={() => navigate("/")}>
        <Box sx={{ width: "100%", px: { xs: 1.5, md: 2 }, pb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Typography sx={{ fontSize: 13, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {t.startingWordLabel}
            </Typography>
            <Box sx={{ px: 4, py: 2, borderRadius: "12px", backgroundColor: `${ACCENT}18`, border: `2px solid ${ACCENT}` }}>
              <Typography sx={{ color: ACCENT, fontWeight: 900, fontSize: 36, fontFamily: "monospace", letterSpacing: 3 }}>
                {state.currentWord.toUpperCase()}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 14, color: "#666", textAlign: "center" }}>
              {t.idleInstruction}
            </Typography>
          </Box>

          <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 2.5, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontSize: 14, color: "#666", textAlign: "center" }}>
              {t.chooseWordLabel}
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={state.currentWord}
                onChange={handleChooseStartingWord}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: ACCENT,
                }}
              >
                {engine.getStartingWords().map((word) => (
                  <MenuItem key={word} value={word}>{word.toUpperCase()}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ borderRadius: "16px", backgroundColor: "rgba(255,255,255,0.14)", p: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
            <Typography sx={{ fontSize: 13, color: "#fff", fontWeight: 700, textAlign: "center" }}>
              {t.scoringTitle}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.85)", textAlign: "center", lineHeight: 1.5 }}>
              {t.scoringExplanation}
            </Typography>
          </Box>

          <Button onClick={startGame} variant="contained" size="large" sx={{
            backgroundColor: "#f3f3f3", color: ACCENT, fontWeight: 800, fontSize: 20,
            py: 1.8, borderRadius: 999, textTransform: "none", "&:hover": { backgroundColor: "#fff" },
          }}>
            {t.startButton}
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
            <Typography sx={{ fontFamily: "Lobster, cursive", fontSize: 28, color: "#222" }}>{t.gameOverTitle}</Typography>
            <Box sx={{ px: 4, py: 2, borderRadius: "12px", backgroundColor: `${ACCENT}18`, border: `2px solid ${ACCENT}`, textAlign: "center", mt: 1 }}>
              <Typography sx={{ color: "#888", fontSize: 13, mb: 0.5 }}>{t.scoreLabel}</Typography>
              <Typography sx={{ color: ACCENT, fontWeight: 900, fontSize: 52 }}>{state.score}</Typography>
            </Box>
            <Typography sx={{ color: "#888", fontSize: 13 }}>
              {t.chainOfWords(state.chain.length - 1)}
            </Typography>
          </Box>

          <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 2 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#888", mb: 1.5, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {t.yourChainLabel}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {state.chain.map((w, i) => (
                <Box key={i} sx={{
                  px: 1.5, py: 0.5, borderRadius: "6px",
                  backgroundColor: i === 0 ? "#e5e7eb" : `${ACCENT}18`,
                  border: `1px solid ${i === 0 ? "#d1d5db" : ACCENT}`,
                }}>
                  <Typography sx={{ color: i === 0 ? "#6b7280" : ACCENT, fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>
                    {w.toUpperCase()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Button onClick={startGame} variant="contained" size="large" sx={{
            backgroundColor: "#f3f3f3", color: ACCENT, fontWeight: 800, fontSize: 18,
            py: 1.6, borderRadius: 999, textTransform: "none", "&:hover": { backgroundColor: "#fff" },
          }}>
            {t.playAgainButton}
          </Button>
          <Button onClick={() => navigate("/")} sx={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
            {t.backToHomeButton}
          </Button>
        </Box>
      </Layout>
    );
  }

  // ── PLAYING ──
  return (
    <Layout onBack={() => navigate("/")}>
      <Box sx={{ width: "100%", px: { xs: 1.5, md: 2 }, pb: { xs: "230px", md: 2 }, display: "flex", flexDirection: "column", gap: 2 }}>

        {/* Score + timer */}
        <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>{t.scoreLabel}</Typography>
            <Typography sx={{ color: ACCENT, fontWeight: 900, fontSize: 28 }}>{state.score}</Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>{t.wordsLabel}</Typography>
            <Typography sx={{ color: "#374151", fontWeight: 900, fontSize: 28 }}>{state.chain.length - 1}</Typography>
          </Box>
          <Box sx={{ width: 56, height: 56, borderRadius: "50%", border: `3px solid ${timerColor}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ color: timerColor, fontWeight: 900, fontSize: 22 }}>{state.timeLeft}</Typography>
          </Box>
        </Box>

        {/* Palabra actual + sílaba */}
        <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 2.5, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
          <Typography sx={{ color: "#888", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>
            {t.currentWordLabel}
          </Typography>
          <Box sx={{ px: 2.5, py: 1, borderRadius: "10px", backgroundColor: "#e5e7eb", border: "1px solid #d1d5db" }}>
            <Typography sx={{ color: "#111", fontWeight: 900, fontSize: 27, fontFamily: "monospace", letterSpacing: 2 }}>
              {state.currentWord.toUpperCase()}
            </Typography>
          </Box>
          <Typography sx={{ color: "#888", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>
            {t.mustStartWithLabel}
          </Typography>
          <Box sx={{ px: 2.5, py: 1, borderRadius: "8px", backgroundColor: `${ACCENT}18`, border: `2px solid ${ACCENT}` }}>
            <Typography sx={{ color: ACCENT, fontWeight: 900, fontSize: 27, fontFamily: "monospace", letterSpacing: 3 }}>
              {state.challengeUnit.toUpperCase()}
            </Typography>
          </Box>
        </Box>
        {/* Error */}
        <Box sx={{ minHeight: 20, textAlign: "center", mt: -1 }}>
          {state.errorMsg && (
            <Typography sx={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{state.errorMsg}</Typography>
          )}
        </Box>
        
        {/* Input display (no native keyboard) */}
        <Box sx={{
          backgroundColor: "#fff", borderRadius: "10px",
          border: `2px solid ${state.input ? ACCENT : "#d1d5db"}`,
          minHeight: 60, display: "flex", alignItems: "center", justifyContent: "center",
          transition: "border-color 0.2s",
          position: "relative",
        }}>
          <Typography sx={{
            fontSize: 18, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
            color: state.input ? "#111" : "#bbb",
            width: "80%"
          }}>
            {state.input || t.inputPlaceholder(state.challengeUnit.toUpperCase())}
          </Typography>
          <Button onClick={submitWord} variant="contained" fullWidth sx={{
            backgroundColor: "#0d7e09ad", 
            color: "#fff", 
            fontWeight: 800, 
            fontSize: 18,
            borderRadius: "8px",
            height: 54,
            width: "20%",
            position: "absolute",
            right: 1,
          }}>
             →
          </Button>
        </Box>
        {/* Barra de tiempo */}
        <Box sx={{ height: 8, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 4, overflow: "hidden" }}>
          <Box sx={{
            height: "100%",
            width: `${timerPct}%`,
            backgroundColor: timerColor,
            borderRadius: 4,
            transition: "width 0.9s linear, background-color 0.3s",
          }} />
        </Box>

        {/* <Button onClick={submitWord} variant="contained" fullWidth sx={{
          backgroundColor: "#f3f3f3", color: ACCENT, fontWeight: 800, fontSize: 18,
          py: 1.6, borderRadius: "10px", textTransform: "none", "&:hover": { backgroundColor: "#fff" },
        }}>
          Confirmar →
        </Button> */}

        {/* Cadena */}
        {state.chain.length > 1 && (
          <Box sx={{ borderRadius: "16px", backgroundColor: "#f3f3f3", p: 2 }}>
            <Typography sx={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, mb: 1, fontWeight: 700 }}>
              {t.chainCount(state.chain.length - 1)}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {state.chain.slice(1).map((w, i) => (
                <Box key={i} sx={{ px: 1.5, py: 0.4, borderRadius: "6px", backgroundColor: `${ACCENT}18`, border: `1px solid ${ACCENT}55` }}>
                  <Typography sx={{ color: ACCENT, fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>
                    {w}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

      </Box>

      <VirtualKeyboard onKey={handleVirtualKey} lang={currentLanguage} />
    </Layout>
  );
}
