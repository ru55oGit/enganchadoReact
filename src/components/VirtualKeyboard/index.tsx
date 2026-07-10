import Box from "@mui/material/Box";

const ACCENT = "#e74c3c";

const ROWS_ES = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L","Ñ"],
  ["Z","X","C","V","B","N","M","⌫"],
  ["Á","É","Í","Ó","Ú"],
];

const ROWS_EN = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M","⌫"],
];

const ROWS_PT = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L","Ç"],
  ["Z","X","C","V","B","N","M","⌫"],
  ["Ã","Õ","Â","Ê","Ô"],
  ["Á","É","Í","Ó","Ú","À"],
];

interface Props {
  onKey: (key: string) => void;
  lang?: "es" | "en" | "pt";
}

const ROWS_BY_LANG = { es: ROWS_ES, en: ROWS_EN, pt: ROWS_PT };

export default function VirtualKeyboard({ onKey, lang = "es" }: Props) {
  const ROWS = ROWS_BY_LANG[lang];
  return (
    <Box sx={{
      display: { md: "none", xs: "block" },
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      width: "100%",
      backgroundColor: "#1c1c1e",
      borderTop: `2px solid ${ACCENT}`,
      zIndex: 9999,
      pt: "6px",
      pb: "10px",
      px: "4px",
    }}>
      {ROWS.map((row, ri) => (
        <Box key={ri} sx={{ display: "flex", justifyContent: "center", gap: "4px", mb: "4px" }}>
          {row.map((key) => (
            <Box
              key={key}
              onPointerDown={(e) => { e.preventDefault(); onKey(key); }}
              sx={{
                flex: key === "⌫" ? 1.6 : 1,
                height: 42,
                display: "flex", alignItems: "center", justifyContent: "center",
                backgroundColor: key === "⌫" ? ACCENT : "#3a3a3c",
                color: "#fff",
                borderRadius: "6px",
                fontSize: key === "⌫" ? 18 : 15,
                fontWeight: 700,
                cursor: "pointer",
                userSelect: "none",
                WebkitUserSelect: "none",
                transition: "opacity 0.1s",
                "&:active": { opacity: 0.6 },
              }}
            >
              {key}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
