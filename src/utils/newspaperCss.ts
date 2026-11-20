import { CustomFont, NewspaperDocument, PaperPatternType } from '../types/newspaper';
import { PAGE_FORMATS, PAPER_THEMES } from '../data/presets';

const NEWSPRINT_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
  <filter id="n">
    <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.18  0 0 0 0 0.16  0 0 0 0 0.14  0 0 0 0.28 0"/>
  </filter>
  <rect width="160" height="160" filter="url(#n)"/>
</svg>
`);

const LAID_LINES_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="48" viewBox="0 0 96 48">
  <g stroke="#3d2e1e" stroke-opacity="0.16">
    <line x1="0" y1="3" x2="96" y2="3" stroke-width="0.7"/>
    <line x1="0" y1="9" x2="96" y2="9" stroke-width="0.7"/>
    <line x1="0" y1="15" x2="96" y2="15" stroke-width="0.7"/>
    <line x1="0" y1="21" x2="96" y2="21" stroke-width="0.7"/>
    <line x1="0" y1="27" x2="96" y2="27" stroke-width="0.7"/>
    <line x1="0" y1="33" x2="96" y2="33" stroke-width="0.7"/>
    <line x1="0" y1="39" x2="96" y2="39" stroke-width="0.7"/>
    <line x1="0" y1="45" x2="96" y2="45" stroke-width="0.7"/>
    <line x1="24" y1="0" x2="24" y2="48" stroke-width="1" stroke-opacity="0.22"/>
    <line x1="72" y1="0" x2="72" y2="48" stroke-width="1" stroke-opacity="0.22"/>
  </g>
</svg>
`);

const FIBERS_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
  <filter id="f">
    <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.22  0 0 0 0 0.14  0 0 0 0 0.12  0 0 0 0.25 0"/>
  </filter>
  <rect width="140" height="140" filter="url(#f)"/>
  <g stroke="#2c1d18" stroke-opacity="0.22" stroke-width="0.85" fill="none">
    <path d="M12 18 Q22 24 31 15"/>
    <path d="M84 26 Q95 19 102 31"/>
    <path d="M44 68 Q56 76 63 62"/>
    <path d="M108 82 Q122 88 128 74"/>
    <path d="M18 112 Q31 104 40 119"/>
    <path d="M72 124 Q84 114 96 126"/>
    <circle cx="58" cy="34" r="0.9" fill="#2c1d18" fill-opacity="0.28"/>
    <circle cx="118" cy="52" r="0.8" fill="#2c1d18" fill-opacity="0.28"/>
    <circle cx="28" cy="88" r="0.9" fill="#2c1d18" fill-opacity="0.25"/>
  </g>
</svg>
`);

const LINEN_WEAVE_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <g stroke="#1a2c1f" stroke-opacity="0.14" stroke-width="0.7">
    <line x1="0" y1="4" x2="24" y2="4"/>
    <line x1="0" y1="12" x2="24" y2="12"/>
    <line x1="0" y1="20" x2="24" y2="20"/>
    <line x1="4" y1="0" x2="4" y2="24"/>
    <line x1="12" y1="0" x2="12" y2="24"/>
    <line x1="20" y1="0" x2="20" y2="24"/>
  </g>
</svg>
`);

const HEAVY_ARCHIVE_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <filter id="h">
    <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="4" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.16  0 0 0 0 0.08  0 0 0 0.36 0"/>
  </filter>
  <rect width="180" height="180" filter="url(#h)"/>
  <g fill="#42260e" fill-opacity="0.14">
    <circle cx="32" cy="48" r="3"/>
    <circle cx="128" cy="26" r="2.5"/>
    <circle cx="94" cy="118" r="4"/>
    <circle cx="152" cy="144" r="2"/>
  </g>
</svg>
`);

function getPatternSvg(pattern: PaperPatternType): string {
  switch (pattern) {
    case 'laid-lines':
      return LAID_LINES_SVG;
    case 'fibers':
      return FIBERS_SVG;
    case 'linen-weave':
      return LINEN_WEAVE_SVG;
    case 'heavy-archive':
      return HEAVY_ARCHIVE_SVG;
    default:
      return NEWSPRINT_SVG;
  }
}

export function generateCustomFontFacesCss(customFonts: CustomFont[]): string {
  if (!customFonts.length) return '';
  return customFonts
    .map(
      (font) => `
@font-face {
  font-family: "${font.family}";
  src: url("${font.dataUrl}") format("${font.format}");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}`
    )
    .join('\n');
}

export function getImageFilterCss(mode: NewspaperDocument['mainImage']['filter']): string {
  switch (mode) {
    case 'grayscale-press':
      return 'grayscale(100%) contrast(1.12) brightness(0.98)';
    case 'sepia-archive':
      return 'sepia(55%) contrast(1.06) brightness(0.97)';
    case 'halftone-ink':
      return 'grayscale(100%) contrast(1.38) brightness(0.95)';
    default:
      return 'none';
  }
}

export function generateNewspaperCss(doc: NewspaperDocument, customFonts: CustomFont[]): string {
  const format = PAGE_FORMATS[doc.grid.pageFormat];
  const { colors, typography, grid, modules, texture } = doc;
  const paddingPx = Math.round((grid.marginMm / 25.4) * 96 * 0.72); // balanced screen/print scale
  const resolvedPattern: PaperPatternType =
    texture.paperPattern ??
    PAPER_THEMES.find((t) => t.id === doc.themeId)?.paperPattern ??
    'newsprint';
  const patternSvg = getPatternSvg(resolvedPattern);
  const grainOpacity = Math.min(0.92, (texture.grainIntensity / 100) * 0.78);
  const edgeOpacity = (texture.agedEdges / 100) * (resolvedPattern === 'heavy-archive' ? 0.44 : 0.3);
  const splitLeft = grid.splitRatio;
  const splitRight = 100 - splitLeft;

  const customFaces = generateCustomFontFacesCss(customFonts);

  return `
${customFaces}

.gs-sheet {
  position: relative;
  width: ${format.widthPx}px;
  min-height: ${format.heightPx}px;
  background-color: ${colors.paperBg};
  color: ${colors.ink};
  padding: ${paddingPx}px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: ${typography.bodyFont};
  ${texture.inkSoftness ? 'text-shadow: 0 0 0.45px rgba(0, 0, 0, 0.22);' : ''}
}

.gs-sheet *,
.gs-sheet *::before,
.gs-sheet *::after {
  box-sizing: border-box;
}

.gs-paper-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 20;
  opacity: ${grainOpacity.toFixed(3)};
  background-image: url("data:image/svg+xml,${patternSvg}");
  background-repeat: repeat;
  mix-blend-mode: multiply;
}

.gs-paper-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 21;
  box-shadow: inset 0 0 ${Math.round(54 + texture.agedEdges * 0.7)}px rgba(56, 38, 18, ${edgeOpacity.toFixed(3)});
  ${resolvedPattern === 'laid-lines' ? `outline: 1px solid ${colors.ruleColor}; outline-offset: -${Math.max(10, Math.round(paddingPx * 0.45))}px;` : ''}
}

.gs-sheet-inner {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100%;
}

/* Header & Masthead */
.gs-header {
  margin-bottom: 16px;
}

.gs-masthead-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 5px 0;
  margin-bottom: 10px;
  border-top: 1px solid ${colors.ruleColor};
  border-bottom: 2px solid ${colors.ink};
  font-family: ${typography.captionFont};
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.mutedInk};
}

.gs-masthead-title {
  font-family: ${typography.rubricaFont};
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-align: center;
  color: ${colors.ink};
  margin: 0 0 6px 0;
  line-height: 1.05;
}

.gs-rubrica-wrap {
  margin-bottom: 10px;
}

.gs-rubrica-cartiglio {
  display: inline-block;
  background-color: ${colors.rubricaBg};
  color: ${colors.rubricaText};
  font-family: ${typography.rubricaFont};
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 5px 16px;
  border-radius: 0 999px 999px 0;
  line-height: 1.15;
}

.gs-rubrica-filetto {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: ${typography.rubricaFont};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${colors.rubricaBg};
  border-bottom: 2px solid ${colors.rubricaBg};
  padding-bottom: 4px;
}

.gs-rubrica-testata-doppia {
  text-align: center;
  font-family: ${typography.rubricaFont};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.ink};
  border-top: 3px double ${colors.ink};
  border-bottom: 1px solid ${colors.ruleColor};
  padding: 5px 8px;
}

.gs-headline {
  margin: 4px 0 6px 0;
  font-family: ${typography.headlineFont};
  font-size: ${typography.headlineSize}px;
  font-weight: 700;
  line-height: 0.98;
  letter-spacing: ${typography.headlineLetterSpacing}em;
  color: ${colors.headlineColor};
  text-wrap: balance;
  word-break: break-word;
}

.gs-headline--centered {
  text-align: center;
}

.gs-subhead {
  margin: 0;
  font-family: ${typography.headlineFont};
  font-size: ${typography.subheadSize}px;
  font-weight: 600;
  line-height: 1.18;
  color: ${colors.ink};
  text-wrap: balance;
}

.gs-subhead--centered {
  text-align: center;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.gs-byline {
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid ${colors.ruleColor};
  font-family: ${typography.captionFont};
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${colors.mutedInk};
}

/* Main Content Grid Layouts */
.gs-body-grid {
  display: grid;
  gap: ${grid.columnGap}px;
  flex: 1 1 auto;
  align-items: start;
}

.gs-body-grid--split-left {
  grid-template-columns: ${splitLeft}% minmax(0, ${splitRight}%);
}

.gs-body-grid--split-right {
  grid-template-columns: minmax(0, ${splitRight}%) ${splitLeft}%;
}

.gs-body-grid--stacked {
  grid-template-columns: minmax(0, 1fr);
}

.gs-body-grid--with-sidebar {
  grid-template-columns: minmax(0, 1fr) 210px;
}

/* Media + Caption Module */
.gs-media-module {
  position: relative;
}

.gs-media-side-wrap {
  display: grid;
  gap: 10px;
  align-items: start;
}

.gs-media-side-wrap--left {
  grid-template-columns: minmax(0, 1fr) 31%;
}

.gs-media-side-wrap--right {
  grid-template-columns: 31% minmax(0, 1fr);
}

.gs-photo-frame {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: rgba(28, 25, 23, 0.08);
  border: 1px solid ${colors.ruleColor};
}

.gs-photo-frame--3-4 { aspect-ratio: 3 / 4; }
.gs-photo-frame--1-1 { aspect-ratio: 1 / 1; }
.gs-photo-frame--4-3 { aspect-ratio: 4 / 3; }
.gs-photo-frame--16-9 { aspect-ratio: 16 / 9; }

.gs-photo-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.gs-caption {
  margin: 0;
  font-family: ${typography.captionFont};
  font-size: 11.5px;
  line-height: 1.32;
  color: ${colors.ink};
}

.gs-caption--side {
  text-align: right;
  font-weight: 500;
  padding-top: 2px;
}

.gs-caption--side-left {
  text-align: left;
  font-weight: 500;
  padding-top: 2px;
}

.gs-caption--below {
  margin-top: 7px;
  color: ${colors.mutedInk};
  font-style: italic;
  border-bottom: 1px solid ${colors.ruleColor};
  padding-bottom: 6px;
}

/* Corner / Floating Note Box (like TV / Schedule / Appuntamento Box) */
.gs-note-box {
  background-color: ${colors.noteBoxBg};
  color: ${colors.noteBoxText};
  border: 1.5px solid ${colors.ink};
  border-radius: 6px;
  padding: 8px 10px;
  text-align: center;
  box-shadow: 2px 2px 0 rgba(28, 25, 23, 0.16);
}

.gs-note-box--corner {
  position: relative;
  margin-top: 12px;
}

.gs-note-box--overlay-corner {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 116px;
  z-index: 6;
}

.gs-note-eyebrow {
  font-family: ${typography.headlineFont};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(28, 25, 23, 0.25);
  padding-bottom: 3px;
  margin-bottom: 4px;
}

.gs-note-title {
  font-family: ${typography.captionFont};
  font-size: 13px;
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 2px;
}

.gs-note-body {
  font-family: ${typography.captionFont};
  font-size: 10.5px;
  line-height: 1.25;
}

/* Article Prose & Columns */
.gs-article-column {
  min-width: 0;
}

.gs-prose {
  font-family: ${typography.bodyFont};
  font-size: ${typography.bodySize}px;
  line-height: ${typography.bodyLineHeight};
  color: ${colors.ink};
  text-align: ${typography.textAlign};
  ${typography.hyphenate ? 'hyphens: auto; -webkit-hyphens: auto;' : 'hyphens: none;'}
  ${grid.textColumns > 1 ? `column-count: ${grid.textColumns}; column-gap: ${grid.columnGap}px;` : ''}
  ${grid.showColumnRules && grid.textColumns > 1 ? `column-rule: 1px solid ${colors.ruleColor};` : ''}
}

.gs-prose p {
  margin: 0 0 0.75em 0;
}

.gs-prose p:last-child {
  margin-bottom: 0;
}

/* Drop Cap Styles */
.gs-prose > p.gs-has-dropcap {
  min-height: ${(typography.bodySize * typography.bodyLineHeight * 2.1).toFixed(1)}px;
}

${
  !(modules.showInsetPortrait && modules.insetSide === 'left')
    ? `.gs-prose > p:not(.gs-has-dropcap),
.gs-prose > .gs-pull-quote {
  clear: left;
}`
    : ''
}

.gs-dropcap--serif .gs-dropcap-glyph {
  float: left;
  font-family: ${typography.headlineFont};
  font-size: ${(typography.bodySize * (typography.bodyLineHeight / 0.74 + 0.85)).toFixed(1)}px;
  line-height: 0.78;
  font-weight: 700;
  margin: 2px 7px 0 0;
  color: ${colors.ink};
}

.gs-dropcap--accent .gs-dropcap-glyph {
  float: left;
  font-family: ${typography.headlineFont};
  font-size: ${(typography.bodySize * (typography.bodyLineHeight / 0.74 + 0.85)).toFixed(1)}px;
  line-height: 0.78;
  font-weight: 700;
  margin: 2px 7px 0 0;
  color: ${colors.accentColor};
}

.gs-dropcap--boxed .gs-dropcap-glyph {
  float: left;
  font-family: ${typography.headlineFont};
  font-size: ${(typography.bodySize * 1.9).toFixed(1)}px;
  line-height: 0.95;
  font-weight: 700;
  padding: 4px 7px;
  margin: 3px 8px 0 0;
  background-color: ${colors.ink};
  color: ${colors.paperBg};
}

.gs-dropcap--serif .gs-dropcap-inline {
  font-family: ${typography.headlineFont};
  font-size: 1.5em;
  line-height: 0.9;
  font-weight: 700;
  color: ${colors.ink};
}

.gs-dropcap--accent .gs-dropcap-inline {
  font-family: ${typography.headlineFont};
  font-size: 1.5em;
  line-height: 0.9;
  font-weight: 700;
  color: ${colors.accentColor};
}

.gs-dropcap--boxed .gs-dropcap-inline {
  display: inline-block;
  font-family: ${typography.headlineFont};
  font-size: 1.2em;
  line-height: 1;
  font-weight: 700;
  padding: 2px 6px;
  margin-right: 3px;
  background-color: ${colors.ink};
  color: ${colors.paperBg};
}

/* Circular Inset Portrait inside prose */
.gs-inset-spacer {
  display: block;
  float: ${modules.insetSide};
  width: 0;
  height: ${modules.insetSide === 'left' && modules.dropCapStyle !== 'none' ? Math.max(58, modules.insetOffsetTop) : modules.insetOffsetTop}px;
  clear: none;
}

.gs-inset-circle {
  display: block;
  float: ${modules.insetSide};
  clear: ${modules.insetSide};
  width: ${modules.insetSize}px;
  height: ${modules.insetSize}px;
  border-radius: 50%;
  shape-outside: circle(50%);
  overflow: hidden;
  margin: ${modules.insetSide === 'right' ? '4px 0 8px 14px' : '4px 14px 8px 0'};
  border: 1.5px solid ${colors.ruleColor};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.gs-inset-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Pull Quote */
.gs-pull-quote {
  margin: 14px 0;
  padding: 10px 12px;
  border-top: 1px solid ${colors.ink};
  border-bottom: 1px solid ${colors.ink};
  font-family: ${typography.headlineFont};
  font-size: ${Math.max(16, Math.round(typography.bodySize * 1.2))}px;
  font-style: italic;
  line-height: 1.32;
  color: ${colors.accentColor};
  text-align: center;
  break-inside: avoid;
}

/* Sidebar Rubrica */
.gs-sidebar {
  border-left: 1px solid ${colors.ruleColor};
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gs-sidebar-box {
  border: 1px solid ${colors.ink};
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.22);
}

.gs-sidebar-title {
  margin: 0 0 8px 0;
  padding-bottom: 5px;
  border-bottom: 1px solid ${colors.ruleColor};
  font-family: ${typography.rubricaFont};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${colors.accentColor};
}

.gs-sidebar-body {
  margin: 0;
  font-family: ${typography.captionFont};
  font-size: 12.5px;
  line-height: 1.48;
  color: ${colors.ink};
}

/* End-mark Ornament */
.gs-ornament {
  display: inline-block;
  margin-left: 6px;
  color: ${colors.accentColor};
  font-size: 1.05em;
  vertical-align: middle;
}

/* Footer Colophon */
.gs-footer {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid ${colors.ruleColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: ${typography.captionFont};
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${colors.mutedInk};
}

/* Stacked Front-Page / Literary Essay Overrides */
.gs-lead-banner-photo {
  margin-bottom: 14px;
}

.gs-divider-rule {
  height: 1px;
  background-color: ${colors.ruleColor};
  margin: 12px 0;
}
`;
}
