export interface FontOption {
  name: string;
  family: string;
  category: 'display-serif' | 'condensed-sans' | 'editorial-body' | 'archival-mono';
  categoryLabel: string;
  sampleText: string;
  googleSpec: string;
}

export const CURATED_FONTS: FontOption[] = [
  // Display & Historical Newspaper Serifs
  {
    name: 'Playfair Display',
    family: '"Playfair Display", Georgia, serif',
    category: 'display-serif',
    categoryLabel: 'Testate & Serif Storici',
    sampleText: 'Cronache del Mattino',
    googleSpec: 'Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400',
  },
  {
    name: 'Bodoni Moda',
    family: '"Bodoni Moda", Georgia, serif',
    category: 'display-serif',
    categoryLabel: 'Testate & Serif Storici',
    sampleText: 'Edizione Straordinaria',
    googleSpec: 'Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;0,6..96,700;0,6..96,900;1,6..96,400',
  },
  {
    name: 'Libre Baskerville',
    family: '"Libre Baskerville", Georgia, serif',
    category: 'display-serif',
    categoryLabel: 'Testate & Serif Storici',
    sampleText: 'Gazzetta Letteraria',
    googleSpec: 'Libre+Baskerville:ital,wght@0,400;0,700;1,400',
  },
  {
    name: 'Cinzel',
    family: '"Cinzel", Georgia, serif',
    category: 'display-serif',
    categoryLabel: 'Testate & Serif Storici',
    sampleText: 'CORRIERE STORICO',
    googleSpec: 'Cinzel:wght@400;600;700;900',
  },
  {
    name: 'Cormorant Garamond',
    family: '"Cormorant Garamond", Georgia, serif',
    category: 'display-serif',
    categoryLabel: 'Testate & Serif Storici',
    sampleText: 'Foglio di Cultura',
    googleSpec: 'Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400',
  },
  {
    name: 'Fraunces',
    family: '"Fraunces", Georgia, serif',
    category: 'display-serif',
    categoryLabel: 'Testate & Serif Storici',
    sampleText: 'Racconti d’Epoca',
    googleSpec: 'Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400',
  },
  {
    name: 'Abril Fatface',
    family: '"Abril Fatface", Georgia, serif',
    category: 'display-serif',
    categoryLabel: 'Testate & Serif Storici',
    sampleText: 'Prima Pagina',
    googleSpec: 'Abril+Fatface',
  },
  {
    name: 'UnifrakturMaguntia',
    family: '"UnifrakturMaguntia", serif',
    category: 'display-serif',
    categoryLabel: 'Testate & Serif Storici',
    sampleText: 'La Gazzetta Antica',
    googleSpec: 'UnifrakturMaguntia',
  },

  // Condensed & Rotocalco Headlines
  {
    name: 'Oswald',
    family: '"Oswald", sans-serif',
    category: 'condensed-sans',
    categoryLabel: 'Titoli Compatti & Rotocalco',
    sampleText: 'IL FATTO DEL GIORNO',
    googleSpec: 'Oswald:wght@400;500;600;700',
  },
  {
    name: 'Barlow Condensed',
    family: '"Barlow Condensed", sans-serif',
    category: 'condensed-sans',
    categoryLabel: 'Titoli Compatti & Rotocalco',
    sampleText: 'IL GIORNALE ILLUSTRATO',
    googleSpec: 'Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;1,400',
  },
  {
    name: 'Anton',
    family: '"Anton", sans-serif',
    category: 'condensed-sans',
    categoryLabel: 'Titoli Compatti & Rotocalco',
    sampleText: 'ULTIMA ORA',
    googleSpec: 'Anton',
  },
  {
    name: 'Archivo Narrow',
    family: '"Archivo Narrow", sans-serif',
    category: 'condensed-sans',
    categoryLabel: 'Titoli Compatti & Rotocalco',
    sampleText: 'Rubrica & Spettacolo',
    googleSpec: 'Archivo+Narrow:ital,wght@0,400;0,600;0,700;1,400',
  },
  {
    name: 'Bricolage Grotesque',
    family: '"Bricolage Grotesque", sans-serif',
    category: 'condensed-sans',
    categoryLabel: 'Titoli Compatti & Rotocalco',
    sampleText: 'Rivista Mensile',
    googleSpec: 'Bricolage+Grotesque:wght@400;600;700',
  },

  // Readable Newspaper Body & Captions
  {
    name: 'Source Serif 4',
    family: '"Source Serif 4", Georgia, serif',
    category: 'editorial-body',
    categoryLabel: 'Corpo Articolo & Prosa',
    sampleText: 'Testo giornalistico chiaro e proporzionato.',
    googleSpec: 'Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400',
  },
  {
    name: 'Lora',
    family: '"Lora", Georgia, serif',
    category: 'editorial-body',
    categoryLabel: 'Corpo Articolo & Prosa',
    sampleText: 'Prosa elegante per articoli di costume.',
    googleSpec: 'Lora:ital,wght@0,400;0,600;0,700;1,400',
  },
  {
    name: 'EB Garamond',
    family: '"EB Garamond", Georgia, serif',
    category: 'editorial-body',
    categoryLabel: 'Corpo Articolo & Prosa',
    sampleText: 'Tipografia classica veneziana ad alta leggibilità.',
    googleSpec: 'EB+Garamond:ital,wght@0,400;0,600;0,700;1,400',
  },
  {
    name: 'Crimson Pro',
    family: '"Crimson Pro", Georgia, serif',
    category: 'editorial-body',
    categoryLabel: 'Corpo Articolo & Prosa',
    sampleText: 'Stampa editoriale per lunghe letture.',
    googleSpec: 'Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400',
  },
  {
    name: 'Merriweather',
    family: '"Merriweather", Georgia, serif',
    category: 'editorial-body',
    categoryLabel: 'Corpo Articolo & Prosa',
    sampleText: 'Carattere robusto pensato per la carta.',
    googleSpec: 'Merriweather:ital,wght@0,400;0,700;1,400',
  },
  {
    name: 'PT Serif',
    family: '"PT Serif", Georgia, serif',
    category: 'editorial-body',
    categoryLabel: 'Corpo Articolo & Prosa',
    sampleText: 'Equilibrio tradizionale da quotidiano europeo.',
    googleSpec: 'PT+Serif:ital,wght@0,400;0,700;1,400',
  },
  {
    name: 'DM Sans',
    family: '"DM Sans", sans-serif',
    category: 'editorial-body',
    categoryLabel: 'Corpo Articolo & Prosa',
    sampleText: 'Lineare pulito per didascalie e sommari.',
    googleSpec: 'DM+Sans:ital,wght@0,400;0,500;0,700;1,400',
  },
  {
    name: 'Plus Jakarta Sans',
    family: '"Plus Jakarta Sans", sans-serif',
    category: 'editorial-body',
    categoryLabel: 'Corpo Articolo & Prosa',
    sampleText: 'Moderno e arioso per inserti illustrati.',
    googleSpec: 'Plus+Jakarta+Sans:wght@400;500;600;700',
  },

  // Archival & Typewriter
  {
    name: 'Special Elite',
    family: '"Special Elite", monospace',
    category: 'archival-mono',
    categoryLabel: 'Archivio & Macchina da Scrivere',
    sampleText: 'Dispaccio Telegrafico n. 42',
    googleSpec: 'Special+Elite',
  },
  {
    name: 'IBM Plex Mono',
    family: '"IBM Plex Mono", monospace',
    category: 'archival-mono',
    categoryLabel: 'Archivio & Macchina da Scrivere',
    sampleText: 'ANNO XIV · ARCHIVIO 1968',
    googleSpec: 'IBM+Plex+Mono:wght@400;500;600',
  },
];

export function buildGoogleFontsUrlForFamilies(families: string[]): string {
  const specs = new Set<string>();
  for (const fam of families) {
    const found = CURATED_FONTS.find(
      (f) => f.family === fam || fam.includes(`"${f.name}"`) || fam.includes(f.name)
    );
    if (found) {
      specs.add(found.googleSpec);
    }
  }
  if (specs.size === 0) return '';
  return `https://fonts.googleapis.com/css2?${Array.from(specs)
    .map((s) => `family=${s}`)
    .join('&')}&display=swap`;
}
