import React, { useState } from "react";
import { Box } from "@mui/material";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import KeyboardHideRoundedIcon from "@mui/icons-material/KeyboardHideRounded";
import { useLanguage } from "../../i18n/LanguageContext";
import HouseAdBanner from "../../ads/HouseAdBanner";

interface VirtualKeyboardProps {
  onKey: (key: string) => void;
  soundEnabled?: boolean;
  onSoundToggle?: () => void;
  // Cierra el teclado — ocupa el lugar donde en es va la tecla de acento,
  // ya que en/pt no la necesitan (ver conversación, mismo criterio que
  // enroscado/imaginalo/emojinalo).
  onClose?: () => void;
  // Arranca cerrado (muestra un banner en su lugar) hasta que el juego pide
  // abrirlo — se abre cuando tocan el casillero de input.
  open?: boolean;
  gameSlug?: string;
}

// Mismo diseño que enroscaloReact/src/components/VirtualKeyboard (copiado y
// adaptado acá, no es un paquete compartido — ver convención del hub). A
// diferencia de imaginalo/emojinalo, acá SÍ hace falta borrar (se escribe
// una palabra libre letra por letra, no se "adivina" una respuesta fija) —
// y como no hay una respuesta fija contra la cual comparar, tampoco existe
// el concepto de letra correcta/incorrecta en el teclado (se valida la
// palabra entera recién al confirmarla, no letra por letra).
const ROW_1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const ES_ROW_2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"];
const LATIN_ROW_2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const ROW_3 = ["Z", "X", "C", "V", "B", "N", "M"];
const ACCENTED_VOWEL: Record<string, string> = { A: "Á", E: "É", I: "Í", O: "Ó", U: "Ú" };
const IS_VOWEL = (letter: string) => letter in ACCENTED_VOWEL;

// pt no tiene una palabra objetivo fija contra la cual chequear si hace
// falta algún acento (a diferencia de enroscado/imaginalo/emojinalo) —
// como acá se escribe cualquier palabra válida, estas dos filas van
// siempre visibles en pt.
const PT_ACCENT_ROWS = [
  ["Á", "À", "Â", "Ã", "É", "Ê"],
  ["Í", "Ó", "Ô", "Õ", "Ú", "Ç"],
];

const keyButtonSx = (variant: "default" | "action") => ({
  flex: 1,
  minWidth: 0,
  height: 34,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
  border: "1px solid #666",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: "inherit",
  cursor: "pointer",
  transition: "all 0.15s ease",
  "&:active": { transform: "scale(0.96)" },
  ...(variant === "default" && { backgroundColor: "#444", color: "#fff" }),
  ...(variant === "action" && { backgroundColor: "#223a75", borderColor: "#1a2d58", color: "#fff", fontSize: 11 }),
});

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKey,
  soundEnabled = true,
  onSoundToggle,
  onClose,
  open = true,
  gameSlug = "enganchalo",
}) => {
  const { currentLanguage } = useLanguage();
  const [accentActive, setAccentActive] = useState(false);

  const isEs = currentLanguage === "es";
  const isPt = currentLanguage === "pt";

  const handleLetterClick = (letter: string) => {
    const display = isEs && accentActive && IS_VOWEL(letter) ? ACCENTED_VOWEL[letter] : letter;
    onKey(display);
    // Una vez tocada una vocal o cualquier consonante, el acento se
    // desactiva — es una tecla "muerta", no un modo que queda prendido.
    if (isEs) setAccentActive(false);
  };

  const handleSoundButton = (target: boolean) => {
    if (target !== soundEnabled) {
      onSoundToggle?.();
    }
  };

  const renderLetterKey = (letter: string) => {
    const display = isEs && accentActive && IS_VOWEL(letter) ? ACCENTED_VOWEL[letter] : letter;
    return (
      <Box key={letter} component="button" type="button" onClick={() => handleLetterClick(letter)} sx={keyButtonSx("default")}>
        {display}
      </Box>
    );
  };

  const renderPtAccentRows = () => (
    <>
      {PT_ACCENT_ROWS.map((row, rowIndex) => (
        <Box key={`pt-accent-${rowIndex}`} sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
          {row.map((char) => (
            <Box key={char} component="button" type="button" onClick={() => onKey(char)} sx={keyButtonSx("default")}>
              {char}
            </Box>
          ))}
        </Box>
      ))}
    </>
  );

  const renderBksp = () => (
    <Box
      component="button"
      type="button"
      onClick={() => onKey("⌫")}
      aria-label="Borrar"
      sx={{ ...keyButtonSx("default"), flex: 1.5, backgroundColor: "#e74c3c", borderColor: "#c0392b" }}
    >
      ⌫
    </Box>
  );

  const renderCloseKeyboard = () => (
    <Box
      component="button"
      type="button"
      onClick={() => onClose?.()}
      aria-label="Cerrar teclado"
      sx={{ ...keyButtonSx("default"), flex: 1.5, backgroundColor: "#e74c3c", borderColor: "#c0392b" }}
    >
      <KeyboardHideRoundedIcon sx={{ fontSize: 18 }} />
    </Box>
  );

  const wrapperSx = {
    display: { md: "none", xs: "block" },
    position: "fixed" as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    padding: "8px 4px 12px",
    zIndex: 9999,
    borderTop: "1px solid #555",
  };

  if (!open) {
    return (
      <Box sx={wrapperSx}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 0.5 }}>
          <HouseAdBanner slot={`${gameSlug}-keyboard-banner`} gameSlug={gameSlug} locale={currentLanguage} />
        </Box>
      </Box>
    );
  }

  const row2 = isEs ? ES_ROW_2 : LATIN_ROW_2;

  return (
    <Box sx={wrapperSx}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {isPt && renderPtAccentRows()}
        <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
          {ROW_1.map((letter) => renderLetterKey(letter))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
          {row2.map((letter) => renderLetterKey(letter))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
          {isEs ? (
            <Box
              component="button"
              type="button"
              onClick={() => setAccentActive((prev) => !prev)}
              aria-label="Acento"
              sx={{
                ...keyButtonSx("default"),
                flex: 1.5,
                fontSize: 16,
                fontWeight: 800,
                backgroundColor: accentActive ? "#f0b429" : "#444",
                color: accentActive ? "#1a1a1a" : "#fff",
                borderColor: accentActive ? "#d99f1a" : "#666",
              }}
            >
              ´
            </Box>
          ) : (
            renderCloseKeyboard()
          )}
          {ROW_3.map((letter) => renderLetterKey(letter))}
          {renderBksp()}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "4px" }}>
          <Box
            component="button"
            type="button"
            onClick={() => handleSoundButton(true)}
            sx={{
              ...keyButtonSx("action"),
              flex: 1,
              height: 38,
              gap: "4px",
              backgroundColor: soundEnabled ? "#2ecc71" : "#223a75",
              borderColor: soundEnabled ? "#1e8449" : "#1a2d58",
            }}
          >
            <VolumeUpRoundedIcon sx={{ fontSize: 16 }} />
            On
          </Box>
          <Box
            component="button"
            type="button"
            onClick={() => handleSoundButton(false)}
            sx={{
              ...keyButtonSx("action"),
              flex: 1,
              height: 38,
              gap: "4px",
              backgroundColor: !soundEnabled ? "#e74c3c" : "#223a75",
              borderColor: !soundEnabled ? "#c0392b" : "#1a2d58",
            }}
          >
            <VolumeOffRoundedIcon sx={{ fontSize: 16 }} />
            Off
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VirtualKeyboard;
