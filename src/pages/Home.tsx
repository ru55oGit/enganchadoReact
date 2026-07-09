import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Layout from "../components/Layout";

const ACCENT = "#f97316";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, pt: 6 }}>

        <Typography sx={{ fontSize: 72, mb: 1, lineHeight: 1 }}>🔗</Typography>
        <Typography sx={{ fontFamily: "'Lobster', cursive", fontSize: 48, color: "#fff", letterSpacing: 1, lineHeight: 1, mb: 0.5 }}>
          Enganchado
        </Typography>
        <Typography sx={{ color: ACCENT, fontSize: 14, fontWeight: 700, mb: 6, letterSpacing: 0.5 }}>
          El juego del encadenado de palabras
        </Typography>

        {/* Ejemplo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 6, flexWrap: "wrap", justifyContent: "center" }}>
          {["CASA", "SAPO", "POZO", "ZORRO", "ROPERO"].map((word, i) => (
            <Box key={word} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {i > 0 && <Typography sx={{ color: "#6366f1", fontSize: 18 }}>→</Typography>}
              <Box sx={{
                px: 1.5, py: 0.5, borderRadius: "6px",
                backgroundColor: i === 0 ? `${ACCENT}33` : "rgba(255,255,255,0.08)",
                border: `1px solid ${i === 0 ? ACCENT : "rgba(255,255,255,0.15)"}`,
              }}>
                <Typography sx={{ color: i === 0 ? ACCENT : "#e2e8f0", fontWeight: 800, fontSize: 13, fontFamily: "monospace" }}>
                  {word}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Button
          onClick={() => navigate("/game")}
          variant="contained"
          size="large"
          sx={{
            backgroundColor: ACCENT, color: "#fff", fontWeight: 800, fontSize: 20,
            px: 6, py: 1.8, borderRadius: 999, textTransform: "none",
            boxShadow: `0 4px 24px ${ACCENT}66`,
            "&:hover": { backgroundColor: "#ea6c0a" },
            mb: 4,
          }}
        >
          ¡Jugar!
        </Button>

        <Box sx={{ width: "100%", p: 2.5, borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <Typography sx={{ color: "#c7d2fe", fontWeight: 700, fontSize: 13, mb: 1.5, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Cómo jugar
          </Typography>
          {[
            ["🔗", "Enganchá palabras usando la última sílaba de la anterior"],
            ["⏱️", "Tenés 15 segundos por turno"],
            ["🚫", "No valen monosílabos ni palabras repetidas"],
            ["⬆️", "Cuanto más larga la cadena, más puntos"],
          ].map(([emoji, text]) => (
            <Box key={text} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1 }}>
              <Typography sx={{ fontSize: 16, lineHeight: 1.5 }}>{emoji}</Typography>
              <Typography sx={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.5 }}>{text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Layout>
  );
}
