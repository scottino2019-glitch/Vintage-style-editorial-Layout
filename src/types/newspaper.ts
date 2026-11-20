export type LayoutTemplateId =
  | 'rotocalco-classico'
  | 'prima-pagina'
  | 'cronaca-rubrica'
  | 'foglio-letterario'
  | 'gazzetta-illustrata';

export type PageFormatId = 'a4' | 'tabloid' | 'broadsheet' | 'square';

export type PaperThemeId =
  | 'newsprint-1960'
  | 'rotocalco-classic'
  | 'archival-ivory'
  | 'prussian-morning'
  | 'aged-sepia'
  | 'sage-almanac'
  | 'custom';

export type PaperPatternType =
  | 'newsprint'
  | 'laid-lines'
  | 'fibers'
  | 'linen-weave'
  | 'heavy-archive';

export type RubricaStyle = 'cartiglio' | 'filetto' | 'testata-doppia';
export type DropCapStyle = 'serif' | 'boxed' | 'accent' | 'none';
export type CaptionPlacement = 'side-top' | 'below';
export type ImageFilterMode = 'none' | 'grayscale-press' | 'sepia-archive' | 'halftone-ink';
export type OrnamentSymbol = 'diamond' | 'fleuron' | 'star' | 'cross' | 'none';

export interface CustomFont {
  id: string;
  name: string;
  family: string;
  dataUrl: string;
  format: string;
}

export interface MediaAsset {
  src: string;
  alt: string;
  objectPositionX: number; // 0-100
  objectPositionY: number; // 0-100
  zoom: number; // 1-1.8
  filter: ImageFilterMode;
}

export interface NewspaperColors {
  paperBg: string;
  ink: string;
  mutedInk: string;
  rubricaBg: string;
  rubricaText: string;
  headlineColor: string;
  ruleColor: string;
  noteBoxBg: string;
  noteBoxText: string;
  accentColor: string;
}

export interface TypographySettings {
  rubricaFont: string;
  headlineFont: string;
  subheadFont: string;
  bodyFont: string;
  captionFont: string;
  headlineSize: number; // px
  subheadSize: number; // px
  bodySize: number; // px
  captionSize: number; // px
  noteBoxSize: number; // px
  captionAlign: 'auto' | 'left' | 'center' | 'right';
  bodyLineHeight: number; // 1.2 - 1.9
  headlineLetterSpacing: number; // em (-0.04 to 0.12)
  textAlign: 'justify' | 'left';
  hyphenate: boolean;
}

export interface GridSettings {
  pageFormat: PageFormatId;
  marginMm: number; // 10 - 28
  splitRatio: number; // 35 - 60 (% left column for split layouts)
  textColumns: 1 | 2 | 3;
  columnGap: number; // px 12 - 36
  showColumnRules: boolean;
  imageAspectRatio: '3/4' | '1/1' | '4/3' | '16/9';
  imagePosition: 'left' | 'right';
}

export interface ModulesSettings {
  showRubrica: boolean;
  rubricaStyle: RubricaStyle;
  showMastheadMeta: boolean;
  showSubhead: boolean;
  showMainImage: boolean;
  captionPlacement: CaptionPlacement;
  showInsetPortrait: boolean;
  insetSide: 'left' | 'right';
  insetSize: number; // px 72 - 150
  insetOffsetTop: number; // px 20 - 280
  dropCapStyle: DropCapStyle;
  showNoteBox: boolean;
  showPullQuote: boolean;
  showSidebarRubrica: boolean;
  ornament: OrnamentSymbol;
  showFooterColophon: boolean;
}

export interface NewspaperContent {
  mastheadTitle: string;
  mastheadMeta: string;
  rubricaLabel: string;
  headline: string;
  subhead: string;
  byline: string;
  bodyText: string;
  mainCaption: string;
  noteBoxEyebrow: string;
  noteBoxTitle: string;
  noteBoxBody: string;
  pullQuote: string;
  sidebarTitle: string;
  sidebarBody: string;
  footerLeft: string;
  footerRight: string;
}

export interface VintageTextureSettings {
  grainIntensity: number; // 0 - 100
  agedEdges: number; // 0 - 100
  inkSoftness: boolean;
  paperPattern?: PaperPatternType;
}

export interface NewspaperDocument {
  templateId: LayoutTemplateId;
  themeId: PaperThemeId;
  colors: NewspaperColors;
  typography: TypographySettings;
  grid: GridSettings;
  modules: ModulesSettings;
  content: NewspaperContent;
  mainImage: MediaAsset;
  insetImage: MediaAsset;
  texture: VintageTextureSettings;
}

export type ActiveEditorTab = 'modelli' | 'contenuti' | 'tipografia' | 'carta';
export type FocusSection =
  | 'rubrica'
  | 'headline'
  | 'body'
  | 'mainImage'
  | 'insetImage'
  | 'noteBox'
  | 'sidebar'
  | 'footer'
  | null;
