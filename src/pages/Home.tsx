import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Layout from "../components/Layout";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import { getBestChain, BestChain } from "../utils/gameStore";

const ACCENT = "#e74c3c";
const CARD_BG = "#eb6f62";

export default function Home() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const [bestChain, setBestChain] = useState<BestChain | null>(null);
  const CHAIN = t.exampleChain;

  useEffect(() => {
    setBestChain(getBestChain(currentLanguage));
  }, [currentLanguage]);

  useEffect(() => {
    const refresh = () => setBestChain(getBestChain(currentLanguage));
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [currentLanguage]);

  const nowHour = new Date().getHours();
  const greeting =
    nowHour < 12 ? t.greetingMorning : nowHour < 20 ? t.greetingAfternoon : t.greetingEvening;

  return (
    <Layout>
      <Box sx={{ width: "100%", px: { xs: 1.5, md: 2 }, pb: 2, display: "flex", flexDirection: "column", gap: 2 }}>

        <Typography variant="h2" sx={{
          color: "#fff", fontWeight: 700, letterSpacing: "1px",
          fontFamily: "Lobster, cursive", textAlign: "center", width: "100%",
        }}>
          {t.appName}
        </Typography>

        <Typography variant="h6" sx={{
          color: "rgba(255,255,255,0.64)", fontStyle: "italic",
          letterSpacing: "2px", textAlign: "center", fontSize: { xs: 18, md: 22 },
        }}>
          {t.tagline}
        </Typography>

        <Typography sx={{ color: "#ffe6e6", fontSize: 18, fontWeight: 600 }}>
          {greeting}
        </Typography>

        <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 700, lineHeight: 1.4 }}>
          {t.readyToPlay}
        </Typography>

        {/* Card principal */}
        <Box sx={{ width: "100%", borderRadius: "24px", backgroundColor: CARD_BG, p: 2, boxShadow: "0 12px 24px rgba(0,0,0,0.18)" }}>
          {/* Preview cadena */}
          <Box sx={{
            width: "100%", borderRadius: "16px", backgroundColor: "#f3f3f3",
            p: 3, mb: 2, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 1.5, minHeight: 160,
          }}>
            <Typography sx={{ fontSize: 13, color: "#888", fontWeight: 700, mb: 0.5 }}>
              {t.exampleChainLabel}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, justifyContent: "center" }}>
              {CHAIN.map((word, i) => (
                <Box key={word} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {i > 0 && (
                    <Typography sx={{ color: ACCENT, fontWeight: 900, fontSize: 18 }}>→</Typography>
                  )}
                  <Box sx={{
                    px: 2, py: 1, borderRadius: "8px",
                    backgroundColor: i === CHAIN.length - 1 ? `${ACCENT}22` : "#e5e7eb",
                    border: i === CHAIN.length - 1 ? `2px solid ${ACCENT}` : "2px solid transparent",
                  }}>
                    <Typography sx={{
                      color: i === CHAIN.length - 1 ? ACCENT : "#374151",
                      fontWeight: 800, fontSize: 14, fontFamily: "monospace", letterSpacing: 1,
                    }}>
                      {word}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Typography sx={{ fontSize: 12, color: "#999", mt: 0.5, textAlign: "center" }}>
              {t.exampleExplanation}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Button variant="contained" onClick={() => navigate("/game")} sx={{
              backgroundColor: "#07d136", color: "#fff", fontWeight: 800,
              borderRadius: 999, px: 3, py: 1.4, fontSize: 18,
              "&:hover": { backgroundColor: "#fff" },
            }}>
              {t.playButton}
            </Button>
            <Box sx={{ textAlign: "right", color: "#fff", fontWeight: 700 }}>
              <Typography sx={{ fontSize: 16 }}>{t.freeModeLabel}</Typography>
              <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{t.freeModeSub}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Mejor Racha */}
        {bestChain && bestChain.words.length > 1 && (
          <Box sx={{ borderRadius: "16px", backgroundColor: "#fff", p: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#222", mb: 0.5 }}>
              {t.bestStreakTitle}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#888", mb: 2 }}>
              {bestChain.words.length - 1} {t.wordsLabel} · {bestChain.score} {t.pointsLabel} ·{" "}
              {(() => {
                const [y, m, d] = bestChain.date.split("-").map(Number);
                return new Date(y, m - 1, d).toLocaleDateString(t.dateLocale, {
                  weekday: "long", day: "numeric", month: "long",
                });
              })()}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.75 }}>
              {bestChain.words.map((word, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Typography sx={{ color: ACCENT, fontWeight: 900, fontSize: 16, visibility: i === 0 ? "hidden" : "visible" }}>→</Typography>
                  <Box sx={{
                    px: 1.5, py: 0.5, borderRadius: "6px",
                    backgroundColor: i === 0 ? "#e5e7eb" : `${ACCENT}18`,
                    border: `1px solid ${i === 0 ? "#d1d5db" : ACCENT + "55"}`,
                  }}>
                    <Typography sx={{
                      color: i === 0 ? "#6b7280" : ACCENT,
                      fontFamily: "monospace", fontSize: 13, fontWeight: 700,
                    }}>
                      {word.toUpperCase()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Qué es */}
        <Box component="section" sx={{ backgroundColor: "rgba(0,0,0,0.18)", borderRadius: "24px", px: 2, py: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff", mb: 1 }}>
            {t.whatIsTitle}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
            {t.whatIsBody}
          </Typography>
        </Box>

        {/* Cómo jugar */}
        <Box component="section" sx={{ backgroundColor: "rgba(0,0,0,0.18)", borderRadius: "24px", px: 2, py: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff", mb: 1 }}>
            {t.howToPlayTitle}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
            {t.howToPlayBody}
          </Typography>
        </Box>

      </Box>

      <LanguageSelector />
    </Layout>
  );
}
