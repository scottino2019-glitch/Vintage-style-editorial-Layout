import { toJpeg, toPng } from 'html-to-image';
import { buildGoogleFontsUrlForFamilies } from '../data/fonts';
import { PAGE_FORMATS } from '../data/presets';
import { CustomFont, NewspaperDocument } from '../types/newspaper';
import { generateNewspaperCss } from './newspaperCss';

function sanitizeFileName(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'pagina-giornale'
  );
}

export async function exportNewspaperImage(
  sheetElement: HTMLElement,
  doc: NewspaperDocument,
  format: 'png' | 'jpeg',
  pixelRatio: 2 | 3 = 2
): Promise<void> {
  await document.fonts.ready;

  // Temporarily clear any active interactive outline inside the sheet
  const outlined = sheetElement.querySelectorAll<HTMLElement>('[style*="outline"]');
  const previousOutlines: Array<{ el: HTMLElement; outline: string; offset: string }> = [];
  outlined.forEach((el) => {
    previousOutlines.push({
      el,
      outline: el.style.outline,
      offset: el.style.outlineOffset,
    });
    el.style.outline = 'none';
    el.style.outlineOffset = '';
  });

  const options = {
    pixelRatio,
    cacheBust: true,
    backgroundColor: doc.colors.paperBg,
    filter: (node: HTMLElement) => {
      if (node instanceof HTMLElement && node.dataset?.noExport === 'true') {
        return false;
      }
      return true;
    },
  };

  try {
    const dataUrl =
      format === 'png'
        ? await toPng(sheetElement, options)
        : await toJpeg(sheetElement, { ...options, quality: 0.95 });

    const link = document.createElement('a');
    const slug = sanitizeFileName(doc.content.headline || doc.content.mastheadTitle);
    link.download = `${slug}.${format === 'png' ? 'png' : 'jpg'}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    previousOutlines.forEach(({ el, outline, offset }) => {
      el.style.outline = outline;
      el.style.outlineOffset = offset;
    });
  }
}

export function generateStandaloneHtml(
  sheetElement: HTMLElement,
  doc: NewspaperDocument,
  customFonts: CustomFont[]
): string {
  const clone = sheetElement.cloneNode(true) as HTMLElement;

  // Remove editor-only overlays, style tags (we inject clean CSS in <head>), and interactive hints
  clone.querySelectorAll('[data-no-export="true"], style').forEach((el) => el.remove());
  clone.querySelectorAll<HTMLElement>('*').forEach((el) => {
    if (el.style.cursor === 'pointer') el.style.removeProperty('cursor');
    if (el.style.outline) el.style.removeProperty('outline');
    if (el.style.outlineOffset) el.style.removeProperty('outline-offset');
    if (el.getAttribute('style') === '') el.removeAttribute('style');
    if (el.getAttribute('title') === 'Clicca per modificare questa sezione') {
      el.removeAttribute('title');
    }
  });

  const usedFamilies = [
    doc.typography.rubricaFont,
    doc.typography.headlineFont,
    doc.typography.subheadFont,
    doc.typography.bodyFont,
    doc.typography.captionFont,
  ];
  const googleFontsUrl = buildGoogleFontsUrlForFamilies(usedFamilies);
  const newspaperCss = generateNewspaperCss(doc, customFonts);
  const pageSpec = PAGE_FORMATS[doc.grid.pageFormat];
  const titleText = doc.content.headline || doc.content.mastheadTitle || 'Edizione Vintage';

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(titleText)}</title>
  ${
    googleFontsUrl
      ? `<link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="${googleFontsUrl}" />`
      : ''
  }
  <style>
    html, body {
      margin: 0;
      padding: 0;
      min-height: 100%;
      background-color: #ded8cc;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 32px 16px;
      box-sizing: border-box;
    }

    .gs-export-stage {
      box-shadow: 0 20px 48px rgba(24, 20, 15, 0.24), 0 2px 6px rgba(24, 20, 15, 0.12);
      max-width: 100%;
    }

    @media (max-width: 860px) {
      .gs-sheet {
        width: 100% !important;
        min-height: auto !important;
      }
      .gs-body-grid--split-left,
      .gs-body-grid--split-right,
      .gs-body-grid--with-sidebar {
        grid-template-columns: 1fr !important;
      }
    }

    @media print {
      @page {
        size: ${pageSpec.mmWidth}mm ${pageSpec.mmHeight}mm;
        margin: 0;
      }
      html, body {
        background: none !important;
        padding: 0 !important;
        display: block !important;
      }
      .gs-export-stage {
        box-shadow: none !important;
      }
      .gs-sheet {
        width: 100% !important;
        min-height: 100vh !important;
      }
    }

    ${newspaperCss}
  </style>
</head>
<body>
  <main class="gs-export-stage">
    ${clone.outerHTML}
  </main>
</body>
</html>`;
}

export function downloadStandaloneHtml(
  sheetElement: HTMLElement,
  doc: NewspaperDocument,
  customFonts: CustomFont[]
): void {
  const html = generateStandaloneHtml(sheetElement, doc, customFonts);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const slug = sanitizeFileName(doc.content.headline || doc.content.mastheadTitle);
  link.download = `${slug}.html`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
