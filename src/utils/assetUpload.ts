import { CustomFont } from '../types/newspaper';

function detectFontFormat(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.woff2')) return 'woff2';
  if (lower.endsWith('.woff')) return 'woff';
  if (lower.endsWith('.otf')) return 'opentype';
  return 'truetype';
}

function cleanFontName(fileName: string): string {
  return fileName
    .replace(/\.(ttf|otf|woff2?|TTF|OTF|WOFF2?)$/, '')
    .replace(/[-_]+/g, ' ')
    .trim();
}

export async function loadCustomFontFile(file: File): Promise<CustomFont> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Impossibile leggere il file del font.'));
    reader.readAsDataURL(file);
  });

  const displayName = cleanFontName(file.name) || 'Font Personale';
  const uniqueFamily = `Custom_${displayName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now().toString(36)}`;
  const format = detectFontFormat(file.name);

  await registerFontFaceInBrowser(uniqueFamily, dataUrl);

  return {
    id: `font-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: displayName,
    family: uniqueFamily,
    dataUrl,
    format,
  };
}

export async function registerFontFaceInBrowser(family: string, dataUrl: string): Promise<void> {
  try {
    const face = new FontFace(family, `url("${dataUrl}")`);
    const loaded = await face.load();
    document.fonts.add(loaded);
  } catch {
    // Fallback handled by @font-face style tag inside NewspaperSheet
  }
}

export async function readImageAsDataUrl(file: File, maxDimension = 1800): Promise<string> {
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Impossibile leggere il file immagine.'));
    reader.readAsDataURL(file);
  });

  if (file.type === 'image/svg+xml') {
    return rawDataUrl;
  }

  // Gently cap oversized camera photos for responsive editing and clean HTML export size
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      if (width <= maxDimension && height <= maxDimension) {
        resolve(rawDataUrl);
        return;
      }
      const ratio = Math.min(maxDimension / width, maxDimension / height);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(rawDataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => resolve(rawDataUrl);
    img.src = rawDataUrl;
  });
}
