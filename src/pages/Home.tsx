import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Layout from "../components/Layout";
import { getBestChain, BestChain } from "../utils/gameStore";

const ACCENT = "#f97316";
const CARD_BG = "#eb6f62";
const CHAIN = ["CASA", "SAPO", "POZO", "ZORRO", "ROPERO"];

export default function Home() {
  const navigate = useNavigate();
  const [bestChain, setBestChain] = useState<BestChain | null>(null);

  useEffect(() => {
    setBestChain(getBestChain());
  }, []);

  useEffect(() => {
    const refresh = () => setBestChain(getBestChain());
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const nowHour = new Date().getHours();
  const greeting =
    nowHour < 12 ? "Buenos días ☀️" : nowHour < 20 ? "Buenas tardes 🌤️" : "Buenas noches 🌙";

  return (
    <Layout>
      <Box sx={{ width: "100%", px: { xs: 1.5, md: 2 }, pb: 2, display: "flex", flexDirection: "column", gap: 2 }}>

        <Typography variant="h2" sx={{
          color: "#fff", fontWeight: 700, letterSpacing: "1px",
          fontFamily: "Lobster, cursive", textAlign: "center", width: "100%",
        }}>
          Enganchado
        </Typography>

        <Typography variant="h6" sx={{
          color: "rgba(255,255,255,0.64)", fontStyle: "italic",
          letterSpacing: "2px", textAlign: "center", fontSize: { xs: 18, md: 22 },
        }}>
          pensá · enganchá · ganás
        </Typography>

        <Typography sx={{ color: "#ffe6e6", fontSize: 18, fontWeight: 600 }}>
          {greeting}
        </Typography>

        <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 700, lineHeight: 1.4 }}>
          ¿Listo para jugar Enganchado?
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
              Ejemplo de cadena
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
              La última sílaba de <b style={{ color: "#374151" }}>ROPERO</b> es{" "}
              <b style={{ color: ACCENT }}>RO</b> → tu palabra empieza con RO
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Button variant="contained" onClick={() => navigate("/game")} sx={{
              backgroundColor: "#f3f3f3", color: ACCENT, fontWeight: 800,
              borderRadius: 999, px: 4, py: 1.4, fontSize: 18,
              "&:hover": { backgroundColor: "#fff" },
            }}>
              ¡JUGAR!
            </Button>
            <Box sx={{ textAlign: "right", color: "#fff", fontWeight: 700 }}>
              <Typography sx={{ fontSize: 16 }}>MODO LIBRE</Typography>
              <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>¡A ver cuánto llegás!</Typography>
            </Box>
          </Box>
        </Box>

        {/* Mejor Racha */}
        {bestChain && bestChain.words.length > 1 && (
          <Box sx={{ borderRadius: "16px", backgroundColor: "#fff", p: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#222", mb: 0.5 }}>
              Mejor Racha
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#888", mb: 2 }}>
              {bestChain.words.length - 1} palabras · {bestChain.score} puntos ·{" "}
              {(() => {
                const [y, m, d] = bestChain.date.split("-").map(Number);
                return new Date(y, m - 1, d).toLocaleDateString("es-AR", {
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

        {/* Cómo jugar */}
        <Box sx={{ borderRadius: "16px", backgroundColor: "#ededed", p: 2, color: "#222" }}>
          <Typography sx={{ fontSize: 36, fontWeight: 800, mb: 2 }}>Cómo jugar</Typography>
          {[
            ["🔗", "Te damos una palabra. Tomá la última sílaba y arrancá la siguiente con ella."],
            ["⏱️", "Tenés 15 segundos por turno. ¡No te quedes sin tiempo!"],
            ["🚫", "No valen monosílabos ni palabras repetidas."],
            ["⬆️", "Cuanto más larga la cadena y más rápido respondés, más puntos sumás."],
          ].map(([emoji, text]) => (
            <Box key={text as string} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
              <Typography sx={{ fontSize: 20 }}>{emoji}</Typography>
              <Typography sx={{ fontSize: 15, color: "#444", lineHeight: 1.5 }}>{text}</Typography>
            </Box>
          ))}
        </Box>

      </Box>
    </Layout>
  );
}
