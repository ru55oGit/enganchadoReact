# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Unreleased]
### Added
- Home: si se llega con `?from=boludeando` en la URL (viene del hub "Dejá de Boludear"), se muestra un botón de volver arriba a la izquierda (blanco, flecha roja, radius 8px) que lleva de vuelta al hub
- Diccionario (ES): agregar "wifi" a `EXTRA_WORDS` (no está en an-array-of-spanish-words)

### Changed
- AdSense: sacar el script del `index.html` (se cargaba en todo el sitio) y cargarlo solo desde Home y Privacidad (componente `AdsenseScript`) — nunca en `/game`, que es una pantalla de juego sin texto. Google rechazó el sitio por "anuncios servidos por Google en pantallas sin contenido del editor", justo ese caso

### Fixed
- Header: tocar el título (para volver a Home) seleccionaba el texto en mobile y disparaba el popup de "Buscar en Google" del navegador — agregar `userSelect: none`

## [2026-07-26]
### Added
- SEO: agregar robots.txt y sitemap.xml (faltaban)

## [2026-07-24]
### Added
- Home: normalizar spacing título/tagline, box cuadrado, botón, y agregar "tiempo sin jugar"
- Datos: sumar formas femeninas de profesiones a EXTRA_WORDS (sync con Tuttifrutalo)
### Changed
- Home: revertir el botón cuadrado y hacer cuadrado el box de "Ejemplo de cadena"
- Home: hacer cuadrado el botón de jugar (mismo width que height)

## [2026-07-23]
### Added
- Datos: sumar profesiones y ampliar nombres a EXTRA_WORDS (sync con Tuttifrutalo)

## [2026-07-22]
### Added
- Datos: sumar nombres, frutas/verduras, animales y profesiones al diccionario

## [2026-07-12]
### Added
- Agregar favicon (mismo estilo que Sopalo)

## [2026-07-10]
### Added
- AdSense: agregar script ca-pub-6825837607163963 y ads.txt para enganchalo.com
### Changed
- Guardar y mostrar el tiempo usado en la mejor racha
- Mostrar el criterio de puntaje en la pantalla idle del juego
- Selector de palabra inicial para desafiar amigos con el mismo comienzo
- Rename Enganchado -> Enganchalo + SEO y política de privacidad para AdSense
### Fixed
- El box de "Posibles Soluciones" ahora siempre se muestra
- Mostrar "Posibles Soluciones" en game over con 3 palabras que sí enganchaban

## [2026-07-09]
### Added
- Agregar fila de acentos al teclado virtual en portugués
- Agregar modo en portugués (encadenado por última letra)
- Agregar "brocoli" al diccionario: faltaba en an-array-of-spanish-words
- Agregar modo en inglés (encadenado por última letra) con selector de idioma
### Changed
- Botón JUGAR más visible: blanco grande con ícono de play
- Mejorar fallback de getChallengeSyllable: recortar por atrás antes que por adelante
- Enganchado: reordenar mensaje de error y barra de tiempo en game.tsx
- Enganchado: forzar full-bleed real en mobile con breakout de 100vw
- Enganchado: fondo rojo full-bleed en mobile + ajustes de tamaño en input de juego
- Enganchado: mover confirmar a botón flecha dentro del input, reordenar barra de tiempo
### Fixed
- Fix: sílaba RRO nunca jugable + rachas separadas por idioma
- Fix: hiatos sin tilde (biología, país, tenía...) partían mal la sílaba
- Fix real: el gap venía de overflow-x:hidden en body, no del ancho del box
- Fix: agregar _redirects de Netlify para que el ruteo de React Router funcione al recargar
- Fix: validar sílaba real de inicio de palabra, no solo prefijo literal
- Enganchado: teclado virtual, barra de progreso, sonidos y correcciones UI
### Removed
- Sacar "ciudad" de STARTING_WORDS: también es callejón sin salida
- Sacar el fallback de getChallengeSyllable: mostrar siempre la sílaba real

## [2026-07-08]
### Changed
- Enganchado: setup inicial — juego de encadenado de palabras
### Fixed
- Enganchado: estilo idéntico a enroscalo + fixes de juego
- Fix: usar node directo para vite (workaround Node v26 ESM symlink bug)

## [2026-06-23]
### Changed
- Redesign Home to match project template pattern

## [2026-05-15]
### Fixed
- fix: alinear bloque Como Jugar y boton Jugar al fondo de la pantalla

## [2026-04-18]
### Changed
- Initial boilerplate
### Removed
- Remove .vite from tracking
