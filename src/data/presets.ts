import {
  LayoutTemplateId,
  NewspaperColors,
  NewspaperDocument,
  PageFormatId,
  PaperPatternType,
  PaperThemeId,
} from '../types/newspaper';

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

export const PLACEHOLDER_MAIN_SVG = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
  <defs>
    <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="8" stroke="#292524" stroke-width="0.6" stroke-opacity="0.16" />
    </pattern>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ded7c8"/>
      <stop offset="100%" stop-color="#ece7dc"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#sky)"/>
  <rect width="600" height="800" fill="url(#hatch)"/>
  <!-- Sun / Halo -->
  <circle cx="430" cy="195" r="54" fill="#f7f3ea" stroke="#292524" stroke-width="1.2" stroke-opacity="0.35"/>
  <!-- Distant Hills -->
  <path d="M0 470 Q150 385 320 445 T600 420 L600 800 L0 800 Z" fill="#cfc6b4" stroke="#292524" stroke-width="1.4" stroke-opacity="0.4"/>
  <!-- Archway / Editorial Architecture -->
  <path d="M90 800 L90 340 Q90 210 220 210 L250 210 Q380 210 380 340 L380 800 Z" fill="#e6dfd0" stroke="#1c1917" stroke-width="2" stroke-opacity="0.65"/>
  <path d="M135 800 L135 355 Q135 255 235 255 Q335 255 335 355 L335 800 Z" fill="#c7beab" stroke="#1c1917" stroke-width="1.5" stroke-opacity="0.5"/>
  <!-- Classic Cypress & Balcony Lines -->
  <path d="M460 640 C445 530 452 430 472 340 C492 430 499 530 484 640 Z" fill="#57534e" fill-opacity="0.55" stroke="#1c1917" stroke-width="1.2"/>
  <path d="M518 650 C507 570 512 490 526 420 C540 490 545 570 534 650 Z" fill="#78716c" fill-opacity="0.45" stroke="#1c1917" stroke-width="1.2"/>
  <!-- Foreground Steps & Horizon -->
  <rect x="0" y="635" width="600" height="165" fill="#d9d1c0" stroke="#1c1917" stroke-width="1.5" stroke-opacity="0.45"/>
  <line x1="40" y1="680" x2="560" y2="680" stroke="#1c1917" stroke-width="1" stroke-opacity="0.35"/>
  <line x1="20" y1="725" x2="580" y2="725" stroke="#1c1917" stroke-width="1" stroke-opacity="0.25"/>
  <rect x="16" y="16" width="568" height="768" fill="none" stroke="#1c1917" stroke-width="1" stroke-opacity="0.3"/>
</svg>
`);

export const PLACEHOLDER_PORTRAIT_SVG = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
  <defs>
    <pattern id="p-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="#1c1917" stroke-width="0.6" stroke-opacity="0.18" />
    </pattern>
  </defs>
  <rect width="320" height="320" fill="#dfd8c8"/>
  <rect width="320" height="320" fill="url(#p-hatch)"/>
  <circle cx="160" cy="118" r="46" fill="#c7bfb0" stroke="#1c1917" stroke-width="1.8" stroke-opacity="0.65"/>
  <path d="M68 320 C72 225 110 188 160 188 C210 188 248 225 252 320 Z" fill="#b4ab9a" stroke="#1c1917" stroke-width="1.8" stroke-opacity="0.65"/>
  <path d="M126 196 L160 228 L194 196" fill="none" stroke="#1c1917" stroke-width="1.4" stroke-opacity="0.5"/>
  <circle cx="160" cy="160" r="148" fill="none" stroke="#1c1917" stroke-width="1" stroke-opacity="0.28"/>
</svg>
`);

export interface PageFormatSpec {
  id: PageFormatId;
  label: string;
  dimensionsLabel: string;
  widthPx: number;
  heightPx: number;
  mmWidth: number;
  mmHeight: number;
}

export const PAGE_FORMATS: Record<PageFormatId, PageFormatSpec> = {
  a4: {
    id: 'a4',
    label: 'A4 Editoriale',
    dimensionsLabel: '210 × 297 mm',
    widthPx: 794,
    heightPx: 1123,
    mmWidth: 210,
    mmHeight: 297,
  },
  tabloid: {
    id: 'tabloid',
    label: 'Tabloid / Rotocalco',
    dimensionsLabel: '280 × 390 mm',
    widthPx: 840,
    heightPx: 1170,
    mmWidth: 280,
    mmHeight: 390,
  },
  broadsheet: {
    id: 'broadsheet',
    label: 'Quotidiano Classico',
    dimensionsLabel: '300 × 410 mm',
    widthPx: 880,
    heightPx: 1200,
    mmWidth: 300,
    mmHeight: 410,
  },
  square: {
    id: 'square',
    label: 'Inserto Quadrato',
    dimensionsLabel: '260 × 260 mm',
    widthPx: 860,
    heightPx: 860,
    mmWidth: 260,
    mmHeight: 260,
  },
};

export interface PaperThemePreset {
  id: PaperThemeId;
  name: string;
  description: string;
  paperPattern: PaperPatternType;
  patternLabel: string;
  colors: NewspaperColors;
}

export const PAPER_THEMES: PaperThemePreset[] = [
  {
    id: 'rotocalco-classic',
    name: 'Rotocalco Illustrato',
    description: 'Carta giornale grigio-crema con grana a rotocalco, rubrica rossa e titolo verde',
    paperPattern: 'newsprint',
    patternLabel: 'Grana Rotocalco',
    colors: {
      paperBg: '#ded8ca',
      ink: '#1a1916',
      mutedInk: '#544f46',
      rubricaBg: '#c4342d',
      rubricaText: '#fbf7ef',
      headlineColor: '#1f6b32',
      ruleColor: '#a89f8d',
      noteBoxBg: '#edd33c',
      noteBoxText: '#1a1916',
      accentColor: '#1f6b32',
    },
  },
  {
    id: 'newsprint-1960',
    name: 'Gazzetta Rosa d’Epoca',
    description: 'Iconica carta rosa salmone da edicola con fibre a vista e inchiostro nero profondo',
    paperPattern: 'fibers',
    patternLabel: 'Fibre & Pagliuzze',
    colors: {
      paperBg: '#e4beb3',
      ink: '#181110',
      mutedInk: '#5c413c',
      rubricaBg: '#7a1919',
      rubricaText: '#faece8',
      headlineColor: '#181110',
      ruleColor: '#a87d73',
      noteBoxBg: '#f0d8d1',
      noteBoxText: '#181110',
      accentColor: '#8c1d18',
    },
  },
  {
    id: 'archival-ivory',
    name: 'Carta Vergata di Lusso',
    description: 'Carta cotone a righe orizzontali vergate con inchiostro bruno e terra di Siena',
    paperPattern: 'laid-lines',
    patternLabel: 'Righe Vergate',
    colors: {
      paperBg: '#efe7d4',
      ink: '#241a13',
      mutedInk: '#695849',
      rubricaBg: '#8c2d19',
      rubricaText: '#faf5ea',
      headlineColor: '#241a13',
      ruleColor: '#bca98d',
      noteBoxBg: '#e1d3b9',
      noteBoxText: '#241a13',
      accentColor: '#8c2d19',
    },
  },
  {
    id: 'prussian-morning',
    name: 'Edizione della Sera Azzurra',
    description: 'Carta azzurro-ardesia storica da cronaca serale con inchiostro blu notte',
    paperPattern: 'newsprint',
    patternLabel: 'Stampa Serale',
    colors: {
      paperBg: '#c7d5e2',
      ink: '#0d1726',
      mutedInk: '#3e5069',
      rubricaBg: '#163156',
      rubricaText: '#eef4fa',
      headlineColor: '#163156',
      ruleColor: '#899fb5',
      noteBoxBg: '#dce6f0',
      noteBoxText: '#0d1726',
      accentColor: '#99221d',
    },
  },
  {
    id: 'sage-almanac',
    name: 'Almanacco Verde Salvia',
    description: 'Carta inserto verde salvia con trama telata sottile e caratteri verde pino',
    paperPattern: 'linen-weave',
    patternLabel: 'Trama Telata',
    colors: {
      paperBg: '#c3d2bd',
      ink: '#101c14',
      mutedInk: '#3f5746',
      rubricaBg: '#1b472b',
      rubricaText: '#eef5eb',
      headlineColor: '#184226',
      ruleColor: '#82997b',
      noteBoxBg: '#dfd39c',
      noteBoxText: '#101c14',
      accentColor: '#7a2e16',
    },
  },
  {
    id: 'aged-sepia',
    name: 'Kraft & Archivio Antico',
    description: 'Carta kraft ambrata fortemente invecchiata con fibre grezze e bordi bruniti',
    paperPattern: 'heavy-archive',
    patternLabel: 'Kraft Invecchiato',
    colors: {
      paperBg: '#cbb188',
      ink: '#21160d',
      mutedInk: '#5b432e',
      rubricaBg: '#4f2810',
      rubricaText: '#f3e7d2',
      headlineColor: '#2d180a',
      ruleColor: '#8f724d',
      noteBoxBg: '#dcc6a0',
      noteBoxText: '#21160d',
      accentColor: '#7a2c0c',
    },
  },
];

export interface LayoutTemplatePreset {
  id: LayoutTemplateId;
  name: string;
  subtitle: string;
  description: string;
  applyPatch: (prev: NewspaperDocument) => NewspaperDocument;
  sampleContent: Partial<NewspaperDocument['content']>;
}

const DEFAULT_BODY_TEXT = `Sul far della sera, tra i portici del centro storico, il passo lento dei passanti lascia spazio a un incontro inatteso. Chi porta con sé una vecchia macchina fotografica a pellicola sa bene che ogni scatto richiede pazienza, misura e sguardo attento, poiché il rullino concede soltanto trentasei occasioni prima del silenzio.

Così nasce una conversazione fatta di ricordi di viaggio, di mercatini d’antiquariato scovati sotto la pioggia del nord e di ritorni a casa con il desiderio di imparare un’arte antica. Le pagine dei giornali di provincia conservano ancora il sapore di queste storie minute, dove il tempo sembra distendersi tra una colonna e l’altra.

Prima di congedarsi all’angolo della piazza, resta soltanto un cenno discreto e la promessa di rivedersi alla prossima edizione domenicale, quando l’inchiostro fresco tornerà a raccontare la vita quotidiana della città.`;

export const LAYOUT_TEMPLATES: LayoutTemplatePreset[] = [
  {
    id: 'rotocalco-classico',
    name: 'Rotocalco Classico',
    subtitle: 'Ritratto + Tondo nel testo',
    description:
      'Impaginazione a due colonne asimmetriche ispirata ai rotocalchi illustrati: cartiglio superiore, grande titolo condensato, foto verticale con didascalia laterale e ritratto tondo integrato nel testo.',
    sampleContent: {
      mastheadTitle: 'IL FOGLIO ILLUSTRATO',
      mastheadMeta: 'ANNO XLII · N. 14 · EDIZIONE SETTIMANALE',
      rubricaLabel: 'IL GIORNALE DELLA SETTIMANA',
      headline: 'UN INCONTRO SOTTO I PORTICI',
      subhead: 'Un pomeriggio d’autunno tra vecchie macchine a rullino e memorie di viaggio',
      byline: 'Di Redazione Culturale',
      mainCaption: 'Scorcio cittadino del portico occidentale. Nel tondo, dettaglio d’archivio dell’autore.',
      noteBoxEyebrow: 'APPUNTAMENTO',
      noteBoxTitle: 'Ogni Domenica',
      noteBoxBody: 'In edicola dalle ore 8.00 con il supplemento illustrato.',
      pullQuote: '«Ogni scatto su pellicola chiede tempo, luce misurata e memoria.»',
      sidebarTitle: 'Note di Redazione',
      sidebarBody: 'Rassegna settimanale dedicata ai mestieri della stampa e alla fotografia analogica.',
      footerLeft: 'IL FOGLIO ILLUSTRATO · ARCHIVIO STORICO',
      footerRight: 'PAGINA 7',
      bodyText: DEFAULT_BODY_TEXT,
    },
    applyPatch: (prev) => ({
      ...prev,
      templateId: 'rotocalco-classico',
      typography: {
        ...prev.typography,
        rubricaFont: '"DM Sans", sans-serif',
        headlineFont: '"Oswald", sans-serif',
        subheadFont: '"Lora", Georgia, serif',
        bodyFont: '"Source Serif 4", Georgia, serif',
        captionFont: '"DM Sans", sans-serif',
        headlineSize: 54,
        subheadSize: 22,
        bodySize: 15,
        bodyLineHeight: 1.48,
        headlineLetterSpacing: -0.01,
        textAlign: 'justify',
      },
      grid: {
        ...prev.grid,
        splitRatio: 46,
        textColumns: 1,
        columnGap: 24,
        showColumnRules: false,
        imageAspectRatio: '3/4',
        imagePosition: 'left',
      },
      modules: {
        ...prev.modules,
        showRubrica: true,
        rubricaStyle: 'cartiglio',
        showMastheadMeta: false,
        showSubhead: true,
        showMainImage: true,
        captionPlacement: 'side-top',
        showInsetPortrait: true,
        insetSide: 'right',
        insetSize: 112,
        insetOffsetTop: 140,
        dropCapStyle: 'accent',
        showNoteBox: true,
        showPullQuote: false,
        showSidebarRubrica: false,
        ornament: 'diamond',
        showFooterColophon: true,
      },
    }),
  },
  {
    id: 'prima-pagina',
    name: 'Prima Pagina Storica',
    subtitle: 'Broadsheet 3 Colonne',
    description:
      'Classica prima pagina di quotidiano d’epoca con testata filettata, metadati di edizione, titolo solenne su tre colonne di testo divise da filetti tipografici.',
    sampleContent: {
      mastheadTitle: 'LA GAZZETTA DEL MATTINO',
      mastheadMeta: 'ANNO LXXVIII · NUMERO 204 · SABATO 14 NOVEMBRE · PREZZO LIRE 50',
      rubricaLabel: 'CRONACHE & COSTUME',
      headline: 'LA RISCOPERTA DELLA STAMPA A CARATTERI MOBILI',
      subhead: 'Dalle officine artigiane alle nuove edizioni illustrate su carta vergata',
      byline: 'Corrispondenza da Torino',
      mainCaption: 'Fig. 1 — Facciata storica della tipografia nel centro antico.',
      noteBoxEyebrow: 'AVVISO AI LETTORI',
      noteBoxTitle: 'Supplemento',
      noteBoxBody: 'Inserto speciale di quattro pagine dedicato alla storia del giornalismo.',
      pullQuote: '«La pagina stampata conserva intatto il respiro lento della riflessione.»',
      sidebarTitle: 'In Breve',
      sidebarBody: 'Mostra delle testate storiche aperta fino a fine mese presso la biblioteca civica.',
      footerLeft: 'LA GAZZETTA DEL MATTINO · STABILIMENTO TIPOGRAFICO CENTRALE',
      footerRight: 'PAGINA 1',
      bodyText: DEFAULT_BODY_TEXT,
    },
    applyPatch: (prev) => ({
      ...prev,
      templateId: 'prima-pagina',
      typography: {
        ...prev.typography,
        rubricaFont: '"Cinzel", Georgia, serif',
        headlineFont: '"Playfair Display", Georgia, serif',
        subheadFont: '"Archivo Narrow", sans-serif',
        bodyFont: '"EB Garamond", Georgia, serif',
        captionFont: '"Lora", Georgia, serif',
        headlineSize: 44,
        subheadSize: 19,
        bodySize: 15,
        bodyLineHeight: 1.5,
        headlineLetterSpacing: -0.02,
        textAlign: 'justify',
      },
      grid: {
        ...prev.grid,
        splitRatio: 44,
        textColumns: 3,
        columnGap: 20,
        showColumnRules: true,
        imageAspectRatio: '4/3',
        imagePosition: 'left',
      },
      modules: {
        ...prev.modules,
        showRubrica: true,
        rubricaStyle: 'testata-doppia',
        showMastheadMeta: true,
        showSubhead: true,
        showMainImage: true,
        captionPlacement: 'below',
        showInsetPortrait: false,
        dropCapStyle: 'boxed',
        showNoteBox: false,
        showPullQuote: true,
        showSidebarRubrica: false,
        ornament: 'fleuron',
        showFooterColophon: true,
      },
    }),
  },
  {
    id: 'cronaca-rubrica',
    name: 'Cronaca & Spalla',
    subtitle: 'Articolo + Rubrica Laterale',
    description:
      'Struttura editoriale con corpo centrale su due colonne, citazione in risalto e colonna laterale dedicata alla rubrica fissa, alle segnalazioni o ai ritratti brevi.',
    sampleContent: {
      mastheadTitle: 'CORRIERE LETTERARIO',
      mastheadMeta: 'SERIE NUOVA · FASCICOLO VI · RUBRICA D’AUTUNNO',
      rubricaLabel: 'CULTURA & SOCIETÀ',
      headline: 'ARCHITETTURE DEL QUOTIDIANO',
      subhead: 'Come i margini ampi e le rubriche ordinate guidano lo sguardo del lettore',
      byline: 'A cura di Elena Visconti',
      mainCaption: 'Dettaglio architettonico delle logge meridionali al tramonto.',
      noteBoxEyebrow: 'SEGNALAZIONE',
      noteBoxTitle: 'Archivio Aperto',
      noteBoxBody: 'Consultazione libera ogni giovedì pomeriggio su prenotazione.',
      pullQuote: '«Un margine generoso è il silenzio necessario attorno a ogni parola ben scritta.»',
      sidebarTitle: 'La Rubrica del Giorno',
      sidebarBody: 'Brevi appunti di tipografia classica: il ritorno dei capilettera incisi, la proporzione aurea delle colonne e il fascino senza tempo della carta naturale leggermente ruvida.',
      footerLeft: 'CORRIERE LETTERARIO · MILANO — ROMA',
      footerRight: 'PAGINA 3',
      bodyText: DEFAULT_BODY_TEXT,
    },
    applyPatch: (prev) => ({
      ...prev,
      templateId: 'cronaca-rubrica',
      typography: {
        ...prev.typography,
        rubricaFont: '"IBM Plex Mono", monospace',
        headlineFont: '"Bodoni Moda", Georgia, serif',
        subheadFont: '"DM Sans", sans-serif',
        bodyFont: '"Lora", Georgia, serif',
        captionFont: '"DM Sans", sans-serif',
        headlineSize: 42,
        subheadSize: 18,
        bodySize: 15,
        bodyLineHeight: 1.54,
        headlineLetterSpacing: -0.01,
        textAlign: 'justify',
      },
      grid: {
        ...prev.grid,
        splitRatio: 40,
        textColumns: 2,
        columnGap: 22,
        showColumnRules: true,
        imageAspectRatio: '4/3',
        imagePosition: 'left',
      },
      modules: {
        ...prev.modules,
        showRubrica: true,
        rubricaStyle: 'filetto',
        showMastheadMeta: true,
        showSubhead: true,
        showMainImage: true,
        captionPlacement: 'below',
        showInsetPortrait: true,
        insetSide: 'right',
        insetSize: 96,
        insetOffsetTop: 80,
        dropCapStyle: 'serif',
        showNoteBox: false,
        showPullQuote: true,
        showSidebarRubrica: true,
        ornament: 'star',
        showFooterColophon: true,
      },
    }),
  },
  {
    id: 'foglio-letterario',
    name: 'Foglio Letterario',
    subtitle: 'Margini Museali & Saggio',
    description:
      'Impaginazione da terzo foglio culturale o rivista d’arte: ampi margini respirati, doppia cornice classica, immagine centrale proporzionata e prosa distesa.',
    sampleContent: {
      mastheadTitle: 'TERZA PAGINA',
      mastheadMeta: 'QUADERNI DI ARTE, LETTERATURA E STAMPA · TRIMESTRALE',
      rubricaLabel: 'SAGGIO & MEMORIA',
      headline: 'Sull’Arte di Impaginare il Tempo',
      subhead: 'Note di viaggio tra vecchie legatorie, torchi manuali e carte filigranate',
      byline: 'Testo di Lorenzo Moretti',
      mainCaption: 'Tav. II — Studio geometrico sulle proporzioni di pagina nella tradizione editoriale italiana.',
      noteBoxEyebrow: 'EDIZIONE',
      noteBoxTitle: 'Tiratura Limitata',
      noteBoxBody: 'Composto su carta avorio naturale da 120 grammi.',
      pullQuote: '«La tipografia migliore è quella che non ostenta se stessa, ma serve la chiarezza del pensiero.»',
      sidebarTitle: 'Riferimenti',
      sidebarBody: 'Indice dei caratteri storici e delle proporzioni canoniche.',
      footerLeft: 'TERZA PAGINA · COLLANA D’ARCHIVIO',
      footerRight: 'TAV. IV',
      bodyText: DEFAULT_BODY_TEXT,
    },
    applyPatch: (prev) => ({
      ...prev,
      templateId: 'foglio-letterario',
      typography: {
        ...prev.typography,
        rubricaFont: '"Cormorant Garamond", Georgia, serif',
        headlineFont: '"Fraunces", Georgia, serif',
        subheadFont: '"Cormorant Garamond", Georgia, serif',
        bodyFont: '"Crimson Pro", Georgia, serif',
        captionFont: '"Cormorant Garamond", Georgia, serif',
        headlineSize: 46,
        subheadSize: 20,
        bodySize: 16,
        bodyLineHeight: 1.62,
        headlineLetterSpacing: -0.015,
        textAlign: 'justify',
      },
      grid: {
        ...prev.grid,
        marginMm: 22,
        splitRatio: 45,
        textColumns: 2,
        columnGap: 28,
        showColumnRules: false,
        imageAspectRatio: '16/9',
        imagePosition: 'left',
      },
      modules: {
        ...prev.modules,
        showRubrica: true,
        rubricaStyle: 'testata-doppia',
        showMastheadMeta: true,
        showSubhead: true,
        showMainImage: true,
        captionPlacement: 'below',
        showInsetPortrait: false,
        dropCapStyle: 'serif',
        showNoteBox: false,
        showPullQuote: true,
        showSidebarRubrica: false,
        ornament: 'fleuron',
        showFooterColophon: true,
      },
    }),
  },
  {
    id: 'gazzetta-illustrata',
    name: 'Gazzetta Illustrata',
    subtitle: 'Griglia Modulare Ibrida',
    description:
      'Layout versatile che combina l’apertura a tutta pagina con foto laterale destra, didascalia integrata, riquadro promozionale vintage e rubrica finale.',
    sampleContent: {
      mastheadTitle: 'DOMENICA IN CITTÀ',
      mastheadMeta: 'EDIZIONE ILLUSTRATA · ANNO XXIV · FASCICOLO D’ARCHIVIO',
      rubricaLabel: 'SPECCHIO DEI TEMPI',
      headline: 'RACCONTI DI STRADA E BOTTEGHE',
      subhead: 'Un itinerario illustrato fra vecchie insegne, librerie e caffè letterari',
      byline: 'Servizio Fotografico d’Archivio',
      mainCaption: 'Insegna storica e colonnato del quartiere antico. Nel tondo, il cronista.',
      noteBoxEyebrow: 'IN EDICOLA',
      noteBoxTitle: 'Ogni Venerdì',
      noteBoxBody: 'Con la nuova rubrica dedicata alle città italiane.',
      pullQuote: '«Ogni strada conserva una storia per chi sa fermarsi a osservarla.»',
      sidebarTitle: 'Taccuino Cittadino',
      sidebarBody: 'Itinerari consigliati: Piazza delle Erbe, Vicolo dei Stampatori, Libreria Antica.',
      footerLeft: 'DOMENICA IN CITTÀ · PROPRIETÀ RISERVATA',
      footerRight: 'N. 09',
      bodyText: DEFAULT_BODY_TEXT,
    },
    applyPatch: (prev) => ({
      ...prev,
      templateId: 'gazzetta-illustrata',
      typography: {
        ...prev.typography,
        rubricaFont: '"Barlow Condensed", sans-serif',
        headlineFont: '"Libre Baskerville", Georgia, serif',
        subheadFont: '"Barlow Condensed", sans-serif',
        bodyFont: '"PT Serif", Georgia, serif',
        captionFont: '"DM Sans", sans-serif',
        headlineSize: 40,
        subheadSize: 19,
        bodySize: 15,
        bodyLineHeight: 1.5,
        headlineLetterSpacing: -0.01,
        textAlign: 'justify',
      },
      grid: {
        ...prev.grid,
        splitRatio: 44,
        textColumns: 1,
        columnGap: 24,
        showColumnRules: true,
        imageAspectRatio: '3/4',
        imagePosition: 'right',
      },
      modules: {
        ...prev.modules,
        showRubrica: true,
        rubricaStyle: 'cartiglio',
        showMastheadMeta: true,
        showSubhead: true,
        showMainImage: true,
        captionPlacement: 'side-top',
        showInsetPortrait: true,
        insetSide: 'left',
        insetSize: 108,
        insetOffsetTop: 120,
        dropCapStyle: 'boxed',
        showNoteBox: true,
        showPullQuote: false,
        showSidebarRubrica: true,
        ornament: 'cross',
        showFooterColophon: true,
      },
    }),
  },
];

export function createInitialDocument(): NewspaperDocument {
  const defaultTheme = PAPER_THEMES[0]; // Rotocalco Classico
  const baseDoc: NewspaperDocument = {
    templateId: 'rotocalco-classico',
    themeId: defaultTheme.id,
    colors: { ...defaultTheme.colors },
    typography: {
      rubricaFont: '"DM Sans", sans-serif',
      headlineFont: '"Oswald", sans-serif',
      subheadFont: '"Lora", Georgia, serif',
      bodyFont: '"Source Serif 4", Georgia, serif',
      captionFont: '"DM Sans", sans-serif',
      headlineSize: 54,
      subheadSize: 22,
      bodySize: 15,
      bodyLineHeight: 1.48,
      headlineLetterSpacing: -0.01,
      textAlign: 'justify',
      hyphenate: true,
    },
    grid: {
      pageFormat: 'a4',
      marginMm: 16,
      splitRatio: 46,
      textColumns: 1,
      columnGap: 24,
      showColumnRules: false,
      imageAspectRatio: '3/4',
      imagePosition: 'left',
    },
    modules: {
      showRubrica: true,
      rubricaStyle: 'cartiglio',
      showMastheadMeta: false,
      showSubhead: true,
      showMainImage: true,
      captionPlacement: 'side-top',
      showInsetPortrait: true,
      insetSide: 'right',
      insetSize: 112,
      insetOffsetTop: 140,
      dropCapStyle: 'accent',
      showNoteBox: true,
      showPullQuote: false,
      showSidebarRubrica: false,
      ornament: 'diamond',
      showFooterColophon: true,
    },
    content: {
      mastheadTitle: 'IL FOGLIO ILLUSTRATO',
      mastheadMeta: 'ANNO XLII · N. 14 · EDIZIONE SETTIMANALE',
      rubricaLabel: 'IL GIORNALE DELLA SETTIMANA',
      headline: 'UN INCONTRO SOTTO I PORTICI',
      subhead: 'Un pomeriggio d’autunno tra vecchie macchine a rullino e memorie di viaggio',
      byline: 'Di Redazione Culturale',
      bodyText: DEFAULT_BODY_TEXT,
      mainCaption: 'Scorcio cittadino del portico occidentale. Nel tondo, dettaglio d’archivio dell’autore.',
      noteBoxEyebrow: 'APPUNTAMENTO',
      noteBoxTitle: 'Ogni Domenica',
      noteBoxBody: 'In edicola dalle ore 8.00 con il supplemento illustrato.',
      pullQuote: '«Ogni scatto su pellicola chiede tempo, luce misurata e memoria.»',
      sidebarTitle: 'Note di Redazione',
      sidebarBody: 'Rassegna settimanale dedicata ai mestieri della stampa e alla fotografia analogica.',
      footerLeft: 'IL FOGLIO ILLUSTRATO · ARCHIVIO STORICO',
      footerRight: 'PAGINA 7',
    },
    mainImage: {
      src: PLACEHOLDER_MAIN_SVG,
      alt: 'Illustrazione editoriale principale',
      objectPositionX: 50,
      objectPositionY: 50,
      zoom: 1,
      filter: 'none',
    },
    insetImage: {
      src: PLACEHOLDER_PORTRAIT_SVG,
      alt: 'Ritratto nel tondo',
      objectPositionX: 50,
      objectPositionY: 40,
      zoom: 1,
      filter: 'none',
    },
    texture: {
      grainIntensity: 48,
      agedEdges: 34,
      inkSoftness: false,
      paperPattern: defaultTheme.paperPattern,
    },
  };

  return LAYOUT_TEMPLATES[0].applyPatch(baseDoc);
}
