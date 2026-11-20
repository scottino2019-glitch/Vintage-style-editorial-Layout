/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Download, Grid, ZoomIn, ZoomOut } from 'lucide-react';
import { ExportModal } from './components/ExportModal';
import { InspectorPanel } from './components/InspectorPanel';
import { NewspaperSheet } from './components/NewspaperSheet';
import { TemplateGalleryModal } from './components/TemplateGalleryModal';
import { createInitialDocument, LAYOUT_TEMPLATES, PAGE_FORMATS } from './data/presets';
import {
  ActiveEditorTab,
  CustomFont,
  FocusSection,
  LayoutTemplateId,
  NewspaperDocument,
} from './types/newspaper';
import {
  loadCustomFontFile,
  readImageAsDataUrl,
  registerFontFaceInBrowser,
} from './utils/assetUpload';

const STORAGE_DOC_KEY = 'gazzetta-studio-doc-v1';
const STORAGE_FONTS_KEY = 'gazzetta-studio-fonts-v1';

export default function App() {
  const [doc, setDoc] = useState<NewspaperDocument>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DOC_KEY);
      if (saved) {
        return JSON.parse(saved) as NewspaperDocument;
      }
    } catch {
      // Ignore corrupted local storage
    }
    return createInitialDocument();
  });

  const [customFonts, setCustomFonts] = useState<CustomFont[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FONTS_KEY);
      if (saved) {
        return JSON.parse(saved) as CustomFont[];
      }
    } catch {
      // Ignore corrupted local storage
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<ActiveEditorTab>('modelli');
  const [activeFocus, setActiveFocus] = useState<FocusSection>(null);
  const [showGridGuides, setShowGridGuides] = useState(false);
  const [zoomMode, setZoomMode] = useState<'fit' | number>('fit');
  const [fitScale, setFitScale] = useState(0.75);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const sheetRef = useRef<HTMLDivElement | null>(null);
  const stageContainerRef = useRef<HTMLDivElement | null>(null);

  // Register stored custom fonts in browser FontFaceSet on initial load
  useEffect(() => {
    customFonts.forEach((cf) => {
      void registerFontFaceInBrowser(cf.family, cf.dataUrl);
    });
  }, []);

  // Persist document safely
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DOC_KEY, JSON.stringify(doc));
    } catch {
      // Quota exceeded if large images; silent fail
    }
  }, [doc]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FONTS_KEY, JSON.stringify(customFonts));
    } catch {
      // Quota exceeded; silent fail
    }
  }, [customFonts]);

  // Auto-calculate responsive fit scale for the drafting table viewport
  useEffect(() => {
    const el = stageContainerRef.current;
    if (!el) return;

    const updateFit = () => {
      const spec = PAGE_FORMATS[doc.grid.pageFormat];
      const availW = Math.max(280, el.clientWidth - 64);
      const availH = Math.max(320, el.clientHeight - 64);
      const scaleW = availW / spec.widthPx;
      const scaleH = availH / spec.heightPx;
      const next = Math.min(1, Math.max(0.35, Math.min(scaleW, scaleH)));
      setFitScale(Number(next.toFixed(2)));
    };

    updateFit();
    const observer = new ResizeObserver(updateFit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [doc.grid.pageFormat]);

  const showNotice = useCallback((msg: string) => {
    setNotice(msg);
    setTimeout(() => {
      setNotice((curr) => (curr === msg ? null : curr));
    }, 2800);
  }, []);

  const currentScale = zoomMode === 'fit' ? fitScale : zoomMode;
  const currentSpec = useMemo(
    () => PAGE_FORMATS[doc.grid.pageFormat],
    [doc.grid.pageFormat]
  );

  const handleApplyTemplate = useCallback(
    (templateId: LayoutTemplateId, loadSampleText: boolean) => {
      const preset = LAYOUT_TEMPLATES.find((t) => t.id === templateId);
      if (!preset) return;
      setDoc((prev) => {
        const patched = preset.applyPatch(prev);
        if (loadSampleText) {
          return {
            ...patched,
            content: {
              ...patched.content,
              ...preset.sampleContent,
            },
          };
        }
        return patched;
      });
      showNotice(`Modello "${preset.name}" applicato`);
    },
    [showNotice]
  );

  const handleUploadFont = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const loaded: CustomFont[] = [];
      for (const file of Array.from(files)) {
        try {
          const cf = await loadCustomFontFile(file);
          loaded.push(cf);
        } catch {
          showNotice(`Errore nel caricamento di ${file.name}`);
        }
      }
      if (loaded.length > 0) {
        setCustomFonts((prev) => [...loaded, ...prev]);
        showNotice(
          loaded.length === 1
            ? `Font "${loaded[0].name}" pronto`
            : `${loaded.length} font caricati`
        );
      }
    },
    [showNotice]
  );

  const handleDeleteCustomFont = useCallback((fontId: string) => {
    setCustomFonts((prev) => prev.filter((f) => f.id !== fontId));
  }, []);

  const handleUploadImage = useCallback(
    async (target: 'mainImage' | 'insetImage', file: File) => {
      try {
        const dataUrl = await readImageAsDataUrl(file);
        setDoc((prev) => ({
          ...prev,
          [target]: {
            ...prev[target],
            src: dataUrl,
            objectPositionX: 50,
            objectPositionY: 50,
            zoom: 1,
          },
        }));
        showNotice('Immagine aggiornata');
      } catch {
        showNotice('Impossibile leggere il file immagine');
      }
    },
    [showNotice]
  );

  const handleFocusSection = useCallback((section: FocusSection) => {
    setActiveFocus(section);
    if (section !== null) {
      setActiveTab('contenuti');
    }
  }, []);

  const handleResetDocument = useCallback(() => {
    const fresh = createInitialDocument();
    setDoc(fresh);
    setActiveFocus(null);
    showNotice('Foglio ripristinato al modello iniziale');
  }, [showNotice]);

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-[#c7d5e2] text-[#091017] lg:overflow-hidden">
      {/* Strict 3-Zone Top Bar */}
      <header className="no-print flex items-center justify-between gap-8 px-6 py-3.5 bg-[#c7d5e2] border-b-2 border-[#192b3b] shrink-0">
        {/* Zone 1: Single-line Brand Wordmark */}
        <span
          className="text-xl font-bold tracking-tight text-[#091017] whitespace-nowrap shrink-0"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          Gazzetta Studio
        </span>

        {/* Zone 2: Clean Single-line Navigation Actions */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-[#091017]">
          <button
            type="button"
            onClick={() => setIsGalleryOpen(true)}
            className="hover:text-[#a8281c] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Modelli
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tipografia')}
            className="hover:text-[#a8281c] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Font Personali
          </button>
          <button
            type="button"
            onClick={() => setShowGridGuides((v) => !v)}
            className="hover:text-[#a8281c] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {showGridGuides ? 'Nascondi Guide' : 'Guide Griglia'}
          </button>
          <button
            type="button"
            onClick={handleResetDocument}
            className="hover:text-[#a8281c] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Ripristina
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#a8281c] border-2 border-[#192b3b] text-[#f5f1e8] text-sm font-bold hover:bg-[#8c2015] transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Esporta Pagina</span>
          </button>
        </div>
      </header>

      {/* Main Studio Split */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <div className="no-print h-auto lg:h-full">
          <InspectorPanel
            doc={doc}
            onChangeDoc={setDoc}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            activeFocus={activeFocus}
            customFonts={customFonts}
            onUploadFont={handleUploadFont}
            onDeleteCustomFont={handleDeleteCustomFont}
            onUploadImage={handleUploadImage}
            onApplyTemplate={handleApplyTemplate}
          />
        </div>

        {/* Center/Right Editorial Drafting Canvas */}
        <main className="flex-1 flex flex-col min-w-0 min-h-[600px] lg:min-h-0 bg-[#284454]">
          {/* Canvas Sub-Toolbar */}
          <div className="no-print flex items-center justify-between gap-4 px-5 py-2.5 border-b-2 border-[#192b3b] bg-[#c7d5e2]">
            <div className="flex items-center gap-2.5 text-[13px] text-[#091017]">
              <span className="font-bold">{currentSpec.label}</span>
              <span aria-hidden="true">·</span>
              <span className="font-bold tabular-nums">{currentSpec.dimensionsLabel}</span>
              <span className="hidden sm:inline" aria-hidden="true">
                ·
              </span>
              <span className="hidden sm:inline font-semibold text-[#1d2b38]">
                Clicca un blocco sul foglio per modificarlo
              </span>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowGridGuides((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-bold border-2 transition-colors whitespace-nowrap shrink-0 ${
                  showGridGuides
                    ? 'bg-[#e3b448] text-[#091017] border-[#192b3b]'
                    : 'bg-[#d5dfe6] text-[#091017] border-[#192b3b] hover:bg-[#e3b448]'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Griglia</span>
              </button>

              <div className="flex items-center gap-1 p-1 rounded-md bg-[#35546e] border-2 border-[#192b3b]">
                <button
                  type="button"
                  onClick={() =>
                    setZoomMode((curr) => {
                      const val = curr === 'fit' ? fitScale : curr;
                      return Math.max(0.4, Number((val - 0.1).toFixed(2)));
                    })
                  }
                  className="p-1.5 rounded bg-[#d5dfe6] text-[#091017] hover:bg-[#e3b448]"
                  aria-label="Riduci zoom"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomMode('fit')}
                  className={`px-2.5 py-1 rounded text-[13px] font-bold tabular-nums whitespace-nowrap ${
                    zoomMode === 'fit'
                      ? 'bg-[#e3b448] text-[#091017]'
                      : 'bg-[#d5dfe6] text-[#091017] hover:bg-[#e3b448]'
                  }`}
                >
                  {zoomMode === 'fit'
                    ? `Adatta (${Math.round(fitScale * 100)}%)`
                    : `${Math.round(currentScale * 100)}%`}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setZoomMode((curr) => {
                      const val = curr === 'fit' ? fitScale : curr;
                      return Math.min(1.25, Number((val + 0.1).toFixed(2)));
                    })
                  }
                  className="p-1.5 rounded bg-[#d5dfe6] text-[#091017] hover:bg-[#e3b448]"
                  aria-label="Aumenta zoom"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Paper Desk */}
          <div
            ref={stageContainerRef}
            className="relative flex-1 overflow-auto studio-scroll flex justify-center items-start p-6 sm:p-8"
          >
            {notice && (
              <div className="no-print fixed bottom-5 right-5 z-40 px-4 py-2.5 rounded-lg bg-[#e3b448] border-2 border-[#192b3b] text-[#091017] text-[13px] font-bold shadow-xl">
                {notice}
              </div>
            )}

            <div
              style={{
                width: `${Math.round(currentSpec.widthPx * currentScale)}px`,
                height: `${Math.round(currentSpec.heightPx * currentScale)}px`,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  transform: `scale(${currentScale})`,
                  transformOrigin: 'top left',
                  width: `${currentSpec.widthPx}px`,
                }}
                className="shadow-[0_24px_56px_rgba(0,0,0,0.48),0_4px_14px_rgba(0,0,0,0.3)]"
              >
                <NewspaperSheet
                  sheetRef={sheetRef}
                  doc={doc}
                  customFonts={customFonts}
                  showGridGuides={showGridGuides}
                  interactive={true}
                  activeFocus={activeFocus}
                  onFocusSection={handleFocusSection}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        sheetRef={sheetRef}
        doc={doc}
        customFonts={customFonts}
      />

      <TemplateGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        activeTemplateId={doc.templateId}
        onSelectTemplate={handleApplyTemplate}
      />
    </div>
  );
}
