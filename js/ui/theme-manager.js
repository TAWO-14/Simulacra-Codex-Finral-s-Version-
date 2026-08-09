/* ────────────────────────────────────────────────────────────────
   CONSTANTES GLOBAIS
   Isoladas fora das funções para serem criadas apenas UMA vez.
   ──────────────────────────────────────────────────────────────── */

const THEME_CONFIG = {
    'dark-elf': { pattern: 'spiderweb', select: 'spiderweb' },
    'samurai': { pattern: 'clouds', select: 'clouds' },
    'barbarian': { pattern: 'axe', select: 'axe' },
    'necromancer': { pattern: 'skull', select: 'skull' },
    'paladin': { pattern: 'radiant', select: 'radiant' },
    'mystic': { pattern: 'eyes', select: 'eyes' },
    'moon-druid': { pattern: 'leaf', select: 'leaf' },
    'fighter': { pattern: 'triangles', select: 'triangles' },
    'mage': { pattern: 'stars', select: 'stars' },
    'owl': { pattern: 'padrão', select: 'padrão' },
    'royal': { pattern: 'royal-crown', select: 'none' },
    'Midnights': { pattern: 'waves', select: 'waves' },
    'Monocromático': { pattern: 'square', select: 'square' },
    'Ébano': { pattern: 'grid', select: 'grid' },
    'nord': { pattern: 'snow', select: 'snow' },
    'chocolate-sand': { pattern: 'axe', select: 'axe' },
    'redtv': { pattern: 'leaf', select: 'leaf' },
    'sunset': { pattern: 'diamonds', select: 'diamonds' },
    'deserto': { pattern: 'topography', select: 'topography' },
    'primavera': { pattern: 'primavera-bloom', select: 'none' },
    'verao': { pattern: 'verao-sun', select: 'none' },
    'frost': { pattern: 'frost-snow', select: 'none' },
    'lava': { pattern: 'lava-embers', select: 'none' },
    'retro': { pattern: 'dots', select: 'dots' },
    'fliper': { pattern: 'triangles', select: 'triangles' },
    'cyberpunk': { pattern: 'hexagons', select: 'hexagons' },
    'cyber-amarelo': { pattern: 'dots', select: 'dots' },
    'americana': { pattern: 'americana-stars', select: 'none' },
    'cinema-retro': { pattern: 'cinema-film', select: 'none' },
    'neon': { pattern: 'neon-grid', select: 'none' },
    'monster': { pattern: 'monster-claws', select: 'none' },
    'tvgirl': { pattern: 'tvgirl-splatter', select: 'none' },
    '1989': { pattern: '1989-seagulls', select: 'none' },
    'blackout': { pattern: 'blackout-flash', select: 'none' },
    'melodrama': { pattern: 'melodrama-paint', select: 'none' },
    'apotecario': { pattern: 'apotecario-magic', select: 'none' },
    'cottagecore': { pattern: 'leaf', select: 'leaf' },
    'bruxa-verde': { pattern: 'spiderweb', select: 'spiderweb' },
    'colmeia': { pattern: 'hexagons', select: 'hexagons' },
    'lavanda': { pattern: 'lavanda-sprig', select: 'none' },
    'girassol': { pattern: 'girassol-seeds', select: 'none' },
    'roseiral': { pattern: 'roseiral-thorn', select: 'none' },
    'hortensia': { pattern: 'hortensia-cluster', select: 'none' },
    'lótus': { pattern: 'lotus-ripple', select: 'none' },
    'jasmim': { pattern: 'jasmim-star', select: 'none' },
    'cerejeira': { pattern: 'cerejeira-petal', select: 'none' },
    'orquidea': { pattern: 'orquidea-vine', select: 'none' }
};

const DEFAULT_THEME = { pattern: 'crosses', select: 'crosses' };

const CSS_THEME_VARS = [
    '--bg', '--bg2', '--bg3', '--panel', '--border', '--border2', '--accent', '--accent2',
    '--red', '--red2', '--green', '--text', '--text2', '--text3', '--input-bg', '--input-border',
    '--shadow', '--glow', '--header-top', '--header-bot'
];

const BG_PATTERNS = {
    scales: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='10' fill='none' stroke='rgba(255,255,255,0.05)'/%3E%3C/svg%3E\")",
    clouds: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%23262626' fill-opacity='0.6' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E\")",
    hexagons: "url(\"data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='rgba(255,255,255,0.05)' stroke-width='1' fill='none'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM0 10.4l7-4v-8M28 10.4l-7-4v-8M0 38.6l7 4v8M28 38.6l-7 4v8'/%3E%3C/g%3E%3C/svg%3E\")",
    waves: "url(\"data:image/svg+xml,%3Csvg width='40' height='20' viewBox='0 0 40 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10c10 0 10 10 20 10s10-10 20-10' stroke='rgba(26,76,226,0.09)' fill='none' stroke-width='1'/%3E%3C/svg%3E\")",
    spiderweb: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='rgba(255,255,255,0.05)' stroke-width='1' fill='none'%3E%3Cpath d='M0 0l40 40M40 0L0 40M20 0v40M0 20h40'/%3E%3Cpolygon points='20,4 31,9 36,20 31,31 20,36 9,31 4,20 9,9'/%3E%3Cpolygon points='20,12 26,14 28,20 26,26 20,28 14,26 12,20 14,14'/%3E%3C/g%3E%3C/svg%3E\")",
    crosses: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
    dots: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
    grid: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    'tvgirl-splatter': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Ccircle cx='15' cy='25' r='1.5' fill='%23ff0055' opacity='0.7'/%3E%3Ccircle cx='85' cy='15' r='2' fill='%232731f2' opacity='0.6'/%3E%3Ccircle cx='45' cy='75' r='1' fill='%23ff0055' opacity='0.8'/%3E%3Ccircle cx='105' cy='95' r='1.5' fill='%232731f2' opacity='0.9'/%3E%3Ccircle cx='60' cy='35' r='1.5' fill='%23ffffff' opacity='0.4'/%3E%3Ccircle cx='25' cy='95' r='2' fill='%23ff0055' opacity='0.5'/%3E%3Ccircle cx='95' cy='55' r='1' fill='%232731f2' opacity='0.4'/%3E%3Ccircle cx='135' cy='25' r='1' fill='%23ffffff' opacity='0.3'/%3E%3Ccircle cx='120' cy='130' r='1.5' fill='%23ff0055' opacity='0.6'/%3E%3C/svg%3E\")",
    diamonds: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/svg%3E\")",
    radiant: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M0 30h60M9 9l42 42M51 9L9 51M15 4l30 52M4 15l52 30M4 45l52-30M15 56L45 4' stroke='%23bacbdf' stroke-opacity='0.04' stroke-width='1' fill='none'/%3E%3C/svg%3E\")",
    stars: "url(\"data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(3) rotate(70)'><rect x='0' y='0' width='100%' height='100%' fill='%230000002d'/><path d='M23.222 25.097l-3.266-2.056-3.219 2.058.983-3.847-3.042-2.503 3.936-.18 1.52-3.668 1.342 3.578 3.846.312-2.996 2.505z'  stroke-linejoin='round' stroke-linecap='round' stroke-width='1' stroke='%23f6ae5524' fill='none'/><path d='M.133-5.1l-1.52 3.668-3.935.18 3.043 2.504-.985 3.848L-.043 3.04l3.264 2.057-.895-3.803L5.322-1.21l-3.845-.312L.133-5.1zm40 0l-1.52 3.668-3.935.18 3.043 2.504-.985 3.848 3.221-2.059 3.264 2.057-.895-3.803 2.996-2.504-3.845-.312L40.133-5.1zm-40 40l-1.52 3.668-3.935.18 3.043 2.504-.985 3.848 3.221-2.059 3.264 2.057-.895-3.803 2.996-2.504-3.845-.312L.133 34.9zm40 0l-1.52 3.668-3.935.18 3.043 2.504-.985 3.848 3.221-2.059 3.264 2.057-.895-3.803 2.996-2.504-3.845-.312-1.344-3.579z'  stroke-linejoin='round' stroke-linecap='round' stroke-width='1' stroke='%234051b526' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>\")",
    axe: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-51.2 -51.2 614.41 614.41'%3E%3Cpath fill='%238e1c1c' fill-opacity='0.15' d='M505.756,475.587L280.497,250.328l14.144-14.144c8.32-8.341,8.32-21.845,0-30.165l-7.637-7.637 c13.035-6.656,46.293-8.384,90.453,7.701c5.952,2.155,12.629,1.557,18.112-1.664s9.259-8.725,10.24-15.019 c0.555-3.307,12.395-81.941-46.891-141.205C299.697-11.048,221.041,0.792,217.734,1.304c-6.293,1.003-11.797,4.779-15.019,10.261 c-3.221,5.483-3.84,12.117-1.643,18.091c16.981,46.72,18.539,82.688,13.312,96.107l-7.424-7.424 c-3.989-4.011-9.408-6.251-15.083-6.251s-11.072,2.24-15.083,6.251l-58.453,58.453c-4.011,4.011-6.251,9.429-6.251,15.083 s2.24,11.093,6.251,15.083l7.424,7.424c-13.419,5.227-49.344,3.669-96.085-13.333c-5.952-2.176-12.629-1.557-18.112,1.643 c-5.483,3.243-9.259,8.747-10.261,15.019c-0.533,3.307-12.373,81.941,46.912,141.205c41.707,41.728,92.992,48.213,120.896,48.213 c11.733,0,19.307-1.152,20.288-1.323c6.293-1.003,11.797-4.757,15.019-10.24c3.221-5.483,3.84-12.117,1.643-18.112 c-16.043-44.16-14.336-77.44-7.68-90.453l7.637,7.637c4.181,4.16,9.621,6.251,15.083,6.251c5.461,0,10.923-2.091,15.083-6.251 l14.144-14.144L475.59,505.752c4.16,4.16,9.621,6.251,15.083,6.251s10.923-2.091,15.083-6.251 C514.097,497.411,514.097,483.928,505.756,475.587z'/%3E%3C/svg%3E\")", snow: "url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='s' patternUnits='userSpaceOnUse' width='24' height='24' patternTransform='rotate(45)'%3E%3Cg stroke='rgba(255,255,255,0.01)' stroke-width='1' fill='none'%3E%3Cpath d='M12 0v24M0 12h24M4 4l16 16M4 20L20 4'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23s)'/%3E%3C/svg%3E\")",
    padrão: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    skull: "url(\"data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M82.42 180h-1.415L0 98.995v-2.827L6.167 90 0 83.833V81.004L81.005 0h2.827L90 6.167 96.167 0H98.996L180 81.005v2.827L173.833 90 180 96.167V98.996L98.995 180h-2.827L90 173.833 83.833 180H82.42zm0-1.414L1.413 97.58 8.994 90l-7.58-7.58L82.42 1.413 90 8.994l7.58-7.58 81.006 81.005-7.58 7.58 7.58 7.58-81.005 81.006-7.58-7.58-7.58 7.58zM175.196 0h-25.832c1.033 2.924 2.616 5.59 4.625 7.868C152.145 9.682 151 12.208 151 15c0 5.523 4.477 10 10 10 1.657 0 3 1.343 3 3v4h16V0h-4.803c.51.883.803 1.907.803 3 0 3.314-2.686 6-6 6s-6-2.686-6-6c0-1.093.292-2.117.803-3h10.394-13.685C161.18.938 161 1.948 161 3v4c-4.418 0-8 3.582-8 8s3.582 8 8 8c2.76 0 5 2.24 5 5v2h4v-4h2v4h4v-4h2v4h2V0h-4.803zm-15.783 0c-.27.954-.414 1.96-.414 3v2.2c-1.25.254-2.414.74-3.447 1.412-1.716-1.93-3.098-4.164-4.054-6.612h7.914zM180 17h-3l2.143-10H180v10zm-30.635 163c-.884-2.502-1.365-5.195-1.365-8 0-13.255 10.748-24 23.99-24H180v32h-30.635zm12.147 0c.5-1.416 1.345-2.67 2.434-3.66l-1.345-1.48c-1.498 1.364-2.62 3.136-3.186 5.14H151.5c-.97-2.48-1.5-5.177-1.5-8 0-12.15 9.84-22 22-22h8v30h-18.488zm13.685 0c-1.037-1.793-2.976-3-5.197-3-2.22 0-4.16 1.207-5.197 3h10.394zM0 148h8.01C21.26 148 32 158.742 32 172c0 2.805-.48 5.498-1.366 8H0v-32zm0 2h8c12.15 0 22 9.847 22 22 0 2.822-.53 5.52-1.5 8h-7.914c-.567-2.004-1.688-3.776-3.187-5.14l-1.346 1.48c1.09.99 1.933 2.244 2.434 3.66H0v-30zm15.197 30c-1.037-1.793-2.976-3-5.197-3-2.22 0-4.16 1.207-5.197 3h10.394zM0 32h16v-4c0-1.657 1.343-3 3-3 5.523 0 10-4.477 10-10 0-2.794-1.145-5.32-2.992-7.134C28.018 5.586 29.6 2.924 30.634 0H0v32zm0-2h2v-4h2v4h4v-4h2v4h4v-2c0-2.76 2.24-5 5-5 4.418 0 8-3.582 8-8s-3.582-8-8-8V3c0-1.052-.18-2.062-.512-3H0v30zM28.5 0c-.954 2.448-2.335 4.683-4.05 6.613-1.035-.672-2.2-1.16-3.45-1.413V3c0-1.04-.144-2.046-.414-3H28.5zM0 17h3L.857 7H0v10zM15.197 0c.51.883.803 1.907.803 3 0 3.314-2.686 6-6 6S4 6.314 4 3c0-1.093.292-2.117.803-3h10.394zM109 115c-1.657 0-3 1.343-3 3v4H74v-4c0-1.657-1.343-3-3-3-5.523 0-10-4.477-10-10 0-2.793 1.145-5.318 2.99-7.132C60.262 93.638 58 88.084 58 82c0-13.255 10.748-24 23.99-24h16.02C111.26 58 122 68.742 122 82c0 6.082-2.263 11.636-5.992 15.866C117.855 99.68 119 102.206 119 105c0 5.523-4.477 10-10 10zm0-2c-2.76 0-5 2.24-5 5v2h-4v-4h-2v4h-4v-4h-2v4h-4v-4h-2v4h-4v-4h-2v4h-4v-2c0-2.76-2.24-5-5-5-4.418 0-8-3.582-8-8s3.582-8 8-8v-4c0-2.64 1.136-5.013 2.946-6.66L72.6 84.86C70.39 86.874 69 89.775 69 93v2.2c-1.25.254-2.414.74-3.447 1.412C62.098 92.727 60 87.61 60 82c0-12.15 9.84-22 22-22h16c12.15 0 22 9.847 22 22 0 5.61-2.097 10.728-5.55 14.613-1.035-.672-2.2-1.16-3.45-1.413V93c0-3.226-1.39-6.127-3.6-8.14l-1.346 1.48C107.864 87.987 109 90.36 109 93v4c4.418 0 8 3.582 8 8s-3.582 8-8 8zM90.857 97L93 107h-6l2.143-10h1.714zM80 99c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm20 0c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    leaf: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 40' width='80' height='40'%3E%3Cpath fill='%23ffffff' fill-opacity='0.05' d='M0 40a19.96 19.96 0 0 1 5.9-14.11 20.17 20.17 0 0 1 19.44-5.2A20 20 0 0 1 20.2 40H0zM65.32.75A20.02 20.02 0 0 1 40.8 25.26 20.02 20.02 0 0 1 65.32.76zM.07 0h20.1l-.08.07A20.02 20.02 0 0 1 .75 5.25 20.08 20.08 0 0 1 .07 0zm1.94 40h2.53l4.26-4.24v-9.78A17.96 17.96 0 0 0 2 40zm5.38 0h9.8a17.98 17.98 0 0 0 6.67-16.42L7.4 40zm3.43-15.42v9.17l11.62-11.59c-3.97-.5-8.08.3-11.62 2.42zm32.86-.78A18 18 0 0 0 63.85 3.63L43.68 23.8zm7.2-19.17v9.15L62.43 2.22c-3.96-.5-8.05.3-11.57 2.4zm-3.49 2.72c-4.1 4.1-5.81 9.69-5.13 15.03l6.61-6.6V6.02c-.51.41-1 .85-1.48 1.33zM17.18 0H7.42L3.64 3.78A18 18 0 0 0 17.18 0zM2.08 0c-.01.8.04 1.58.14 2.37L4.59 0H2.07z'%3E%3C/path%3E%3C/svg%3E\")",
    eyes: "url(\"data:image/svg+xml,%3Csvg width='40' height='24' viewBox='0 0 20 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 12c0-.622-.095-1.221-.27-1.785A5.982 5.982 0 0 0 10 12c1.67 0 3.182-.683 4.27-1.785A5.998 5.998 0 0 0 14 12h2a4 4 0 0 1 4-4V6c-1.67 0-3.182.683-4.27 1.785C15.905 7.22 16 6.622 16 6c0-.622-.095-1.221-.27-1.785A5.982 5.982 0 0 0 20 6V4a4 4 0 0 1-4-4h-2c0 .622.095 1.221.27 1.785A5.982 5.982 0 0 0 10 0C8.33 0 6.818.683 5.73 1.785 5.905 1.22 6 .622 6 0H4a4 4 0 0 1-4 4v2c1.67 0 3.182.683 4.27 1.785A5.998 5.998 0 0 1 4 6c0-.622.095-1.221.27-1.785A5.982 5.982 0 0 1 0 6v2a4 4 0 0 1 4 4h2zm-4 0a2 2 0 0 0-2-2v2h2zm16 0a2 2 0 0 1 2-2v2h-2zM0 2a2 2 0 0 0 2-2H0v2zm20 0a2 2 0 0 1-2-2h2v2zm-10 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' fill='%23513b84' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    triangles: "url(\"data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(2) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='black'/><path d='M27.26 5.415c-.55 0-.9.55-.65 1l2.45 4.75c.2.5.85.5 1.15.1l3.15-4.5c.3-.4 0-1.05-.55-1.1zM10.689 8.068c-.406-.051-.822.31-.778.748l.5 5.3c.05.5.6.8 1.05.5l4.55-3.05c.45-.3.4-.95-.05-1.15l-5.1-2.3a.605.605 0 0 0-.172-.048zM2.406 24.584a.635.635 0 0 0-.345.081l-4.75 2.4c-.45.2-.5.85-.1 1.15l4.45 3.15c.4.3 1 0 1.1-.5l.3-5.55c0-.412-.31-.712-.655-.73zm40 0a.635.635 0 0 0-.345.081l-4.75 2.4c-.45.2-.5.85-.1 1.15l4.45 3.15c.4.3 1 0 1.1-.5l.3-5.55c0-.412-.31-.712-.655-.73zm-22.17 3.108a.744.744 0 0 0-.675.723l.4 5.55c.05.5.6.8 1.05.5l4.45-2.95c.45-.25.4-.9-.05-1.15l-4.8-2.6a.702.702 0 0 0-.376-.073z' stroke-width='1' stroke='none' fill='rgba(128,128,128,0.1)'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>\")",
    square: "background-color: #262626; background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80' width='80' height='80'%3E%3Cg fill='%23262626' fill-opacity='0.4'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z' opacity='.5'%3E%3C/path%3E%3Cpath d='M15 15h50l-5 5H20v40l-5 5V15zm0 50h50V15L80 0v80H0l15-15zm32.07-32.07l3.54-3.54A15 15 0 0 1 29.4 50.6l3.53-3.53a10 10 0 1 0 14.14-14.14zM32.93 47.07a10 10 0 1 1 14.14-14.14L32.93 47.07z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\")",
    '1989-seagulls': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none' stroke='%2333312e' stroke-width='1.5' stroke-linecap='round' opacity='0.1'%3E%3Cpath d='M10 15 Q 15 10 20 15 Q 25 10 30 15' /%3E%3Cpath d='M40 45 Q 45 40 50 45 Q 55 40 60 45' /%3E%3C/g%3E%3C/svg%3E\")",
    'blackout-flash': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg fill='%23ffffff' opacity='0.04'%3E%3Cpath d='M20 5 L21.5 18.5 L35 20 L21.5 21.5 L20 35 L18.5 21.5 L5 20 L18.5 18.5 Z' /%3E%3Cpath d='M60 45 L60.75 51.75 L67.5 52.5 L60.75 53.25 L60 60 L59.25 53.25 L52.5 52.5 L59.25 51.75 Z' /%3E%3C/g%3E%3C/svg%3E\")",
    'melodrama-paint': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpath d='M10 20 Q 30 15 50 25 M 60 70 Q 75 80 90 60' stroke='%2342d4f5' stroke-width='4' stroke-linecap='round' fill='none' opacity='0.07' /%3E%3Cpath d='M20 80 Q 30 75 40 85 M 70 20 Q 80 15 90 25' stroke='%23ff3b7c' stroke-width='3' stroke-linecap='round' fill='none' opacity='0.04' /%3E%3C/svg%3E\")",
    'apotecario-magic': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='%23c49150' opacity='0.12'%3E%3Cpath d='M15 5 Q15 15 5 15 Q15 15 15 25 Q15 15 25 15 Q15 15 15 5 Z' /%3E%3Cpath d='M45 35 Q45 40 40 40 Q45 40 45 45 Q45 40 50 40 Q45 40 45 35 Z' /%3E%3Ccircle cx='30' cy='50' r='1' /%3E%3Ccircle cx='50' cy='15' r='1.5' /%3E%3C/g%3E%3C/svg%3E\")",
    'primavera-bloom': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='%23FF9EAA' opacity='0.08'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='14' cy='10' r='2'/%3E%3Ccircle cx='12' cy='8' r='2'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3C/g%3E%3C/svg%3E\")",
    'verao-sun': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg stroke='%23F7B267' stroke-width='1.5' fill='none' opacity='0.07'%3E%3Ccircle cx='30' cy='30' r='5'/%3E%3Cpath d='M30 15v-5M30 50v-5M15 30h-5M50 30h-5M20 20l-4-4M40 40l4 4M20 40l-4 4M40 20l4-4'/%3E%3C/g%3E%3C/svg%3E\")",
    'frost-snow': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cg stroke='%2389c4ff' stroke-width='1' fill='none' opacity='0.1'%3E%3Cpath d='M20 5v30M5 20h30M12 12l16 16M12 28l16-16'/%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
    'lava-embers': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg fill='%23ff6b00' opacity='0.12'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3Ccircle cx='60' cy='30' r='1.5'/%3E%3Ccircle cx='30' cy='70' r='2.5'/%3E%3Ccircle cx='70' cy='60' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
    'americana-stars': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpolygon points='10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8' fill='%23fae3ac' opacity='0.05'/%3E%3C/svg%3E\")",
    'cinema-film': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg fill='%23dacbb6' opacity='0.04'%3E%3Crect x='5' y='0' width='10' height='15'/%3E%3Crect x='5' y='25' width='10' height='15'/%3E%3Crect x='5' y='50' width='10' height='15'/%3E%3C/g%3E%3C/svg%3E\")",
    'neon-grid': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cg stroke='%23FF0077' stroke-width='1' fill='none' opacity='0.1'%3E%3Cpath d='M0 20h40M0 30h40M0 35h40M20 20l-15 20M20 20l15 20M20 20v20'/%3E%3C/g%3E%3C/svg%3E\")",
    'monster-claws': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg stroke='%2377bb44' stroke-width='2' stroke-linecap='round' fill='none' opacity='0.1'%3E%3Cpath d='M15 15Q20 30 15 45M25 10Q30 30 25 50M35 15Q40 30 35 45'/%3E%3C/g%3E%3C/svg%3E\")",
    'lavanda-sprig': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='80'%3E%3Cg fill='%238a80c2' opacity='0.08'%3E%3Cellipse cx='20' cy='20' rx='2' ry='4' transform='rotate(30 20 20)'/%3E%3Cellipse cx='15' cy='25' rx='2' ry='4' transform='rotate(-30 15 25)'/%3E%3Cellipse cx='25' cy='30' rx='2' ry='4' transform='rotate(30 25 30)'/%3E%3Cellipse cx='12' cy='35' rx='2' ry='4' transform='rotate(-30 12 35)'/%3E%3Cpath d='M20 15v40' stroke='%238cb073' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E\")",
    'girassol-seeds': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='%23f2c94c' opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='6'/%3E%3Ccircle cx='30' cy='15' r='3'/%3E%3Ccircle cx='30' cy='45' r='3'/%3E%3Ccircle cx='15' cy='30' r='3'/%3E%3Ccircle cx='45' cy='30' r='3'/%3E%3Ccircle cx='19' cy='19' r='2.5'/%3E%3Ccircle cx='41' cy='41' r='2.5'/%3E%3Ccircle cx='41' cy='19' r='2.5'/%3E%3Ccircle cx='19' cy='41' r='2.5'/%3E%3C/g%3E%3C/svg%3E\")",
    'roseiral-thorn': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg stroke='%23d44a6a' stroke-width='1.5' fill='none' opacity='0.06'%3E%3Cpath d='M40 20C20 20 20 40 40 40C60 40 60 60 40 60C20 60 20 80 40 80'/%3E%3C/g%3E%3C/svg%3E\")",
    'hortensia-cluster': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cg fill='%2382a4ea' opacity='0.08'%3E%3Ccircle cx='15' cy='15' r='3'/%3E%3Ccircle cx='25' cy='15' r='3'/%3E%3Ccircle cx='15' cy='25' r='3'/%3E%3Ccircle cx='25' cy='25' r='3'/%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E\")",
    'lotus-ripple': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg stroke='%23ff9eb5' stroke-width='1.5' fill='none' opacity='0.1'%3E%3Cpath d='M10 40 Q 30 20 50 40'/%3E%3Cpath d='M20 45 Q 30 30 40 45'/%3E%3Cpath d='M30 40v-10'/%3E%3C/g%3E%3C/svg%3E\")",
    'jasmim-star': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M20 5 Q23 17 35 20 Q23 23 20 35 Q17 23 5 20 Q17 17 20 5' fill='%23fdfef8' opacity='0.06'/%3E%3C/svg%3E\")",
    'cerejeira-petal': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M15 15 C 10 25, 25 35, 30 20 C 35 15, 25 5, 15 15' fill='%23ffb7c5' opacity='0.08'/%3E%3C/svg%3E\")",
    'orquidea-vine': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 60 Q 30 30 60 0' stroke='%23B07797' stroke-width='1.5' fill='none' opacity='0.08'/%3E%3Ccircle cx='30' cy='30' r='4' fill='%23B07797' opacity='0.1'/%3E%3C/svg%3E\")",
    'royal-crown': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M10 40 L15 20 L25 30 L30 15 L35 30 L45 20 L50 40 Z' stroke='%23ffd700' stroke-width='1.5' fill='none' opacity='0.1'/%3E%3C/svg%3E\")",
    'brat-pixel': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cg fill='%238ace00' opacity='0.05'%3E%3Crect x='0' y='0' width='20' height='20'/%3E%3Crect x='20' y='20' width='20' height='20'/%3E%3C/g%3E%3C/svg%3E\")",
    none: "none",
};

const PATTERN_SIZE_OVERRIDES = {
    dots: '20px 20px',
    grid: '30px 30px',
    axe: '75px 75px'
};

/* ────────────────────────────────────────────────────────────────
   HELPERS DE DOM
   ──────────────────────────────────────────────────────────────── */
function setElProp(id, prop, value) {
    const el = document.getElementById(id);
    if (el) el[prop] = value;
}

function getOrCreateStyleTag(id) {
    let tag = document.getElementById(id);
    if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
        document.head.appendChild(tag);
    }
    return tag;
}

function changeTheme(themeName) {
    const { pattern, select } = THEME_CONFIG[themeName] || DEFAULT_THEME;
    applyBgPattern(pattern);
    if (select !== null) setElProp('bg-pattern', 'value', select);

    document.body.classList.add('is-animating-theme');
    document.body.className = document.body.className.replace(/\btheme-\S+/g, '').trim();
    if (themeName !== 'default' && themeName !== 'custom') document.body.classList.add('theme-' + themeName);
    document.body.setAttribute('data-theme', themeName);

    const optionEl = document.querySelector(`.theme-option[data-value="${themeName}"]`);
    const selectedEl = document.querySelector('.selected-theme');
    if (optionEl && selectedEl) selectedEl.innerText = optionEl.innerText + ' ▼';

    document.getElementById('custom-theme-btn')?.style.setProperty('display', themeName === 'custom' ? 'inline-block' : 'none');
    document.getElementById('bg-image-btn')?.style.setProperty('display', themeName === 'custom' ? 'inline-block' : 'none');

    if (themeName === 'custom') {
        applyAllCustomColors();
    } else {
        CSS_THEME_VARS.forEach(p => document.body.style.removeProperty(p));
    }
    setTimeout(() => { document.body.classList.remove('is-animating-theme'); }, 600);
}

function openThemeModal() {
    document.getElementById('theme-modal-overlay').classList.remove('hidden');
}

function closeThemeModal() {
    document.getElementById('theme-modal-overlay').classList.add('hidden');
}

// Funções legadas mantidas vazias para evitar erros no console
function syncPicker() { }
function syncPickerHeader() { }
function updatePreview() { }
function syncModalFromPickers() { }
function updateAllPreviews() { }

function applyFontChange(family) {
    let st = document.getElementById('__font-override__');
    if (!st) {
        st = document.createElement('style');
        st.id = '__font-override__';
        document.head.appendChild(st);
    }
    st.textContent = `body, input, textarea, select, button, .app-logo, .tab, .section-title, .attr-name, .attr-mod, .attr-score, .save-value, .skill-val, .spell-level-badge, .prof-badge .pb-num, .hp-current, .big-num, .insp-box, .slot-block, .sl-num, .combat-stat label, #font-preview, .hp-section input, .hp-section button, .hp-btn, .header-subtitle-input { font-family: 'Cinzel', ${family}', serif !important; }`;
}

function importarFonte(nome) {
    if (!nome) return;
    let linkId = 'custom-font-link';
    let link = document.getElementById(linkId);
    if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?family=${nome.replace(/ /g, '+')}&display=swap`;
    applyFontChange(nome);
}

function applyFontSize(val) {
    document.body.style.fontSize = val + 'px';
    const lbl = document.getElementById('fontsize-label');
    if (lbl) lbl.textContent = val + 'px';
}

function applyBgPattern(pattern) {
    const st = getOrCreateStyleTag('__pattern-override__');
    if (pattern === 'none' || !BG_PATTERNS[pattern]) {
        st.textContent = `body { background-image: none !important; }`;
        return;
    }
    const size = PATTERN_SIZE_OVERRIDES[pattern];
    st.textContent = size
        ? `body { background-image: ${BG_PATTERNS[pattern]} !important; background-size: ${size} !important; }`
        : `body { background-image: ${BG_PATTERNS[pattern]} !important; }`;
}

function applyBorderRadius(val) {
    setElProp('border-radius-label', 'textContent', val + 'px');
    const st = getOrCreateStyleTag('__radius-override__');
    st.textContent = `.panel, .attr-box, .slot-block, .avatar-container { border-radius: ${val}px !important; }`;
}

/* ────────────────────────────────────────────────────────────────
   GERADOR DINÂMICO DE TEMAS (HSL SEED)
   ──────────────────────────────────────────────────────────────── */

function hexToHSL(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    r /= 255; g /= 255; b /= 255;

    let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin, h = 0, s = 0, l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return { h: h, s: +(s * 100).toFixed(1), l: +(l * 100).toFixed(1) };
}

function toCSS(hsl) {
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

function applySmartTheme() {
    const baseInput = document.getElementById('smart-base-color');
    const accentInput = document.getElementById('smart-accent-color');
    if (!baseInput || !accentInput) return;

    const baseHex = baseInput.value || "#1a1510";
    const accentHex = accentInput.value || "#c8922a";
    
    const base = hexToHSL(baseHex);
    const accent = hexToHSL(accentHex);

    // 🌟 A MÁGICA DO MODO CLARO: 
    // Se a luminosidade da cor base for menor que 55, é modo escuro. Senão, é modo claro!
    const isDark = base.l < 55; 
    
    // O fator de direção inverte a matemática:
    // Modo escuro (1): clareia os fundos secundários.
    // Modo claro (-1): escurece os fundos secundários.
    const dir = isDark ? 1 : -1; 
    
    // Backgrounds e Painéis
    const bg = toCSS(base);
    const bg2 = toCSS({ h: base.h, s: base.s, l: Math.max(0, Math.min(100, base.l + (5 * dir))) });
    const bg3 = toCSS({ h: base.h, s: base.s, l: Math.max(0, Math.min(100, base.l + (8 * dir))) });
    const panel = toCSS({ h: base.h, s: Math.min(100, base.s + 5), l: Math.max(0, Math.min(100, base.l - (2 * dir))) });
    const inputBg = toCSS({ h: base.h, s: base.s, l: Math.max(0, Math.min(100, base.l - (3 * dir))) });
    
    // Bordas
    const border = toCSS({ h: base.h, s: base.s, l: Math.max(0, Math.min(100, base.l + (15 * dir))) });
    const border2 = toCSS({ h: base.h, s: Math.min(100, base.s + 10), l: Math.max(0, Math.min(100, base.l + (25 * dir))) });
    
    // Textos (Ajustados para ter contraste brutal tanto no claro quanto no escuro)
    const text = isDark ? "#f0f0f0" : "#1a1a1a";
    const text2 = isDark ? toCSS({ h: base.h, s: 20, l: 75 }) : toCSS({ h: base.h, s: 20, l: 25 });
    // Text3 usando a Opção A que combinamos (alta luminosidade no escuro, baixa luminosidade no claro)
    const text3 = isDark ? toCSS({ h: base.h, s: 30, l: 75 }) : toCSS({ h: base.h, s: 30, l: 20 });
    
    // Destaques
    const accent1 = toCSS(accent);
    // Se for modo claro, a cor de destaque secundária (accent2) precisa ficar um pouco mais escura, e não mais clara!
    const accent2 = toCSS({ h: accent.h, s: accent.s, l: Math.max(0, Math.min(100, accent.l + (15 * dir))) });
    const glow = `hsla(${accent.h}, ${accent.s}%, ${accent.l}%, 0.25)`;

    // Aplica no CSS
    document.body.style.setProperty('--bg', bg);
    document.body.style.setProperty('--bg2', bg2);
    document.body.style.setProperty('--bg3', bg3);
    document.body.style.setProperty('--panel', panel);
    document.body.style.setProperty('--border', border);
    document.body.style.setProperty('--border2', border2);
    document.body.style.setProperty('--input-bg', inputBg);
    document.body.style.setProperty('--input-border', border);
    
    document.body.style.setProperty('--text', text);
    document.body.style.setProperty('--text2', text2);
    document.body.style.setProperty('--text3', text3);
    
    document.body.style.setProperty('--accent', accent1);
    document.body.style.setProperty('--accent2', accent2);
    document.body.style.setProperty('--glow', glow);
    
    document.body.style.setProperty('--red', '#c0392b');
    document.body.style.setProperty('--red2', '#e74c3c');
    document.body.style.setProperty('--green', '#27ae60');

    document.body.style.setProperty('--header-top', bg);
    document.body.style.setProperty('--header-bot', bg2);
    
    if (typeof updateAllPreviews === 'function') {
        updateAllPreviews();
    }
}

function rollRandomTheme() {
    const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    document.getElementById('smart-base-color').value = randomColor();
    document.getElementById('smart-accent-color').value = randomColor();
    applySmartTheme();
}

function resetCustomTheme() {
    const baseInput = document.getElementById('smart-base-color');
    const accentInput = document.getElementById('smart-accent-color');
    if (baseInput) baseInput.value = '#1a1510';
    if (accentInput) accentInput.value = '#c8922a';

    const fs = document.getElementById('mpicker-fontsize');
    if (fs) { fs.value = 15; applyFontSize(15); }

    const br = document.getElementById('border-radius-ctrl');
    if (br) { br.value = 6; applyBorderRadius(6); }

    const pat = document.getElementById('bg-pattern');
    if (pat) { pat.value = 'crosses'; applyBgPattern('crosses'); }

    const fontInp = document.getElementById('custom-font-input');
    if (fontInp) fontInp.value = '';
    let st = document.getElementById('__font-override__');
    if (st) st.textContent = '';

    applySmartTheme();
    if (typeof showToast === 'function') showToast('✔ Tema resetado!');
}

function applyAllCustomColors() {
    // Redireciona a função antiga para o novo gerador inteligente
    applySmartTheme();
}

document.addEventListener('click', function (e) {
    const ov = document.getElementById('theme-modal-overlay');
    if (e.target === ov) closeThemeModal();
});

/* ────────────────────────────────────────────────────────────────
   INICIALIZAÇÃO DO COLORIS (SELETOR DE CORES)
   ──────────────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
    if (typeof Coloris !== 'undefined') {
        Coloris({
            themeMode: 'dark',
            alpha: false,
            format: 'hex',
            wrap: true,
            swatches: [
                '#1a1510', '#c8922a', '#0a090d', '#d9d4e7',
                '#111111', '#e51a4c', '#000B12', '#4DD4CD'
            ]
        });
    }
});