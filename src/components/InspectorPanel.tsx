import React, { useEffect, useRef, useState } from 'react';
import {
  Image as ImageIcon,
  Layers,
  Palette,
  RotateCcw,
  Trash2,
  Type,
  Upload,
} from 'lucide-react';
import { CURATED_FONTS } from '../data/fonts';
import {
  LAYOUT_TEMPLATES,
  PAGE_FORMATS,
  PAPER_THEMES,
  PaperThemePreset,
  PLACEHOLDER_MAIN_SVG,
  PLACEHOLDER_PORTRAIT_SVG,
} from '../data/presets';
import {
  ActiveEditorTab,
  CustomFont,
  DropCapStyle,
  FocusSection,
  ImageFilterMode,
  LayoutTemplateId,
  NewspaperDocument,
  OrnamentSymbol,
  PageFormatId,
  PaperPatternType,
  RubricaStyle,
} from '../types/newspaper';
import { TemplateWireframe } from './TemplateWireframe';

interface InspectorPanelProps {
  doc: NewspaperDocument;
  onChangeDoc: (updater: (prev: NewspaperDocument) => NewspaperDocument) => void;
  activeTab: ActiveEditorTab;
  onChangeTab: (tab: ActiveEditorTab) => void;
  activeFocus: FocusSection;
  customFonts: CustomFont[];
  onUploadFont: (files: FileList | null) => Promise<void>;
  onDeleteCustomFont: (fontId: string) => void;
  onUploadImage: (target: 'mainImage' | 'insetImage', file: File) => Promise<void>;
  onApplyTemplate: (templateId: LayoutTemplateId, loadSampleText: boolean) => void;
}

const FONT_CATEGORIES = [
  'Testate & Serif Storici',
  'Titoli Compatti & Rotocalco',
  'Corpo Articolo & Prosa',
  'Archivio & Macchina da Scrivere',
] as const;

const PAPER_PATTERN_OPTIONS: { id: PaperPatternType; label: string }[] = [
  { id: 'newsprint', label: 'Grana Rotocalco' },
  { id: 'fibers', label: 'Fibre & Pagliuzze' },
  { id: 'laid-lines', label: 'Righe Vergate' },
  { id: 'linen-weave', label: 'Trama Telata' },
  { id: 'heavy-archive', label: 'Kraft Invecchiato' },
];

const PANEL_CARD_CLASS =
  'rounded-xl bg-[#c4d6cc] border-2 border-[#192b3b] p-4 space-y-3.5 shadow-sm';

const INPUT_CLASS =
  'w-full rounded-md border-2 border-[#192b3b] bg-[#d5dfe6] px-3 py-2 text-sm font-semibold text-[#091017] placeholder-[#36495c] focus:border-[#a8281c]';

const SELECT_CLASS =
  'w-full rounded-md border-2 border-[#192b3b] bg-[#d5dfe6] px-3 py-2 text-sm font-semibold text-[#091017] focus:border-[#a8281c]';

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  doc,
  onChangeDoc,
  activeTab,
  onChangeTab,
  activeFocus,
  customFonts,
  onUploadFont,
  onDeleteCustomFont,
  onUploadImage,
  onApplyTemplate,
}) => {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [mainImgAspect, setMainImgAspect] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const probe = new Image();
    probe.onload = () => {
      if (!cancelled && probe.naturalWidth > 0 && probe.naturalHeight > 0) {
        setMainImgAspect(probe.naturalWidth / probe.naturalHeight);
      }
    };
    probe.onerror = () => {
      if (!cancelled) setMainImgAspect(null);
    };
    probe.src = doc.mainImage.src;
    return () => {
      cancelled = true;
    };
  }, [doc.mainImage.src]);

  const frameAspect =
    doc.grid.imageAspectRatio === '3/4'
      ? 3 / 4
      : doc.grid.imageAspectRatio === '1/1'
        ? 1
        : doc.grid.imageAspectRatio === '4/3'
          ? 4 / 3
          : 16 / 9;

  const hasNaturalHorizontalSlack =
    mainImgAspect !== null && mainImgAspect > frameAspect + 0.02;
  const hasNaturalVerticalSlack =
    mainImgAspect !== null && mainImgAspect < frameAspect - 0.02;

  useEffect(() => {
    const container = scrollContainerRef.current;
    const target = activeFocus ? sectionRefs.current[activeFocus] : null;
    if (container && target) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const nextTop = container.scrollTop + (targetRect.top - containerRect.top) - 12;
      container.scrollTo({
        top: Math.max(0, nextTop),
        behavior: 'smooth',
      });
    }
  }, [activeFocus, activeTab]);

  const setRef = (key: string) => (el: HTMLElement | null) => {
    sectionRefs.current[key] = el;
  };

  const renderFontSelect = (
    label: string,
    value: string,
    onSelect: (newFamily: string) => void
  ) => (
    <div className="space-y-1.5">
      <label className="block text-[13px] font-bold text-[#060908]">{label}</label>
      <select
        value={value}
        onChange={(e) => onSelect(e.target.value)}
        className={SELECT_CLASS}
      >
        {customFonts.length > 0 && (
          <optgroup label="I Tuoi Font Caricati">
            {customFonts.map((cf) => (
              <option key={cf.id} value={`"${cf.family}", serif`}>
                {cf.name} (Personale)
              </option>
            ))}
          </optgroup>
        )}
        {FONT_CATEGORIES.map((cat) => (
          <optgroup key={cat} label={cat}>
            {CURATED_FONTS.filter((f) => f.categoryLabel === cat).map((font) => (
              <option key={font.name} value={font.family}>
                {font.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );

  const applyTheme = (theme: PaperThemePreset) => {
    onChangeDoc((prev) => ({
      ...prev,
      themeId: theme.id,
      colors: { ...theme.colors },
      texture: {
        ...prev.texture,
        paperPattern: theme.paperPattern,
        grainIntensity: Math.max(prev.texture.grainIntensity, 42),
      },
    }));
  };

  const activePattern: PaperPatternType =
    doc.texture.paperPattern ??
    PAPER_THEMES.find((t) => t.id === doc.themeId)?.paperPattern ??
    'newsprint';

  return (
    <aside className="flex flex-col flex-1 h-full min-h-0 bg-[#35546e] md:border-r-2 border-[#192b3b] w-full md:w-[350px] lg:w-[420px] xl:w-[450px] shrink-0">
      {/* Segmented Tab Navigation */}
      <div className="shrink-0 p-3.5 border-b-2 border-[#192b3b] bg-[#c7d5e2]">
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-lg bg-[#35546e] border-2 border-[#192b3b]">
          {(
            [
              { id: 'modelli', label: 'Modelli', icon: Layers },
              { id: 'contenuti', label: 'Contenuti', icon: ImageIcon },
              { id: 'tipografia', label: 'Font', icon: Type },
              { id: 'carta', label: 'Carta', icon: Palette },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md text-[13px] font-bold transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#e3b448] text-[#091017] shadow-xs'
                    : 'bg-[#d5dfe6] text-[#091017] hover:bg-[#e1e8ee]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Inspector Body */}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain studio-scroll p-4 space-y-4"
      >
        {activeTab === 'modelli' && (
          <>
            <section className={PANEL_CARD_CLASS}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-bold text-[#091017]">
                  Modelli di Impaginazione
                </h2>
                <button
                  type="button"
                  onClick={() => onApplyTemplate(doc.templateId, true)}
                  className="px-2.5 py-1 rounded bg-[#d5dfe6] border border-[#192b3b] text-[13px] font-bold text-[#73180e] hover:bg-[#e3b448] whitespace-nowrap shrink-0"
                >
                  Carica testi esempio
                </button>
              </div>
              <div className="space-y-2.5">
                {LAYOUT_TEMPLATES.map((tpl) => {
                  const isActive = doc.templateId === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => onApplyTemplate(tpl.id, false)}
                      className={`w-full text-left flex items-start gap-3.5 p-3 rounded-lg border-2 transition-colors ${
                        isActive
                          ? 'bg-[#e3b448] border-[#192b3b]'
                          : 'bg-[#d5dfe6] border-[#192b3b] hover:bg-[#e1e8ee]'
                      }`}
                    >
                      <TemplateWireframe templateId={tpl.id} active={isActive} />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-[#091017]">{tpl.name}</div>
                        <div className="text-[13px] text-[#73180e] font-bold mt-0.5">
                          {tpl.subtitle}
                        </div>
                        <p className="text-[13px] font-medium text-[#091017] leading-snug mt-1 line-clamp-2">
                          {tpl.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className={PANEL_CARD_CLASS}>
              <h2 className="text-[15px] font-bold text-[#091017]">
                Griglia & Formato Pagina
              </h2>

              <div className="grid grid-cols-2 gap-2.5">
                {(Object.keys(PAGE_FORMATS) as PageFormatId[]).map((fmtId) => {
                  const spec = PAGE_FORMATS[fmtId];
                  const active = doc.grid.pageFormat === fmtId;
                  return (
                    <button
                      key={fmtId}
                      type="button"
                      onClick={() =>
                        onChangeDoc((prev) => ({
                          ...prev,
                          grid: { ...prev.grid, pageFormat: fmtId },
                        }))
                      }
                      className={`p-2.5 rounded-md border-2 text-left transition-colors ${
                        active
                          ? 'bg-[#e3b448] border-[#192b3b] text-[#091017]'
                          : 'bg-[#d5dfe6] border-[#192b3b] text-[#091017] hover:bg-[#e1e8ee]'
                      }`}
                    >
                      <div className="text-[13px] font-bold">{spec.label}</div>
                      <div className="text-[13px] font-semibold tabular-nums mt-0.5 text-[#1d2b38]">
                        {spec.dimensionsLabel}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-[13px]">
                  <span className="font-bold text-[#091017]">Margini pagina</span>
                  <span className="font-bold text-[#091017] tabular-nums">
                    {doc.grid.marginMm} mm
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={28}
                  value={doc.grid.marginMm}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      grid: { ...prev.grid, marginMm: Number(e.target.value) },
                    }))
                  }
                  className="w-full accent-[#73180e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#091017]">
                    Colonne testo
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-md bg-[#35546e] border-2 border-[#192b3b]">
                    {([1, 2, 3] as const).map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() =>
                          onChangeDoc((prev) => ({
                            ...prev,
                            grid: { ...prev.grid, textColumns: cols },
                          }))
                        }
                        className={`py-1.5 text-[13px] font-bold rounded transition-colors ${
                          doc.grid.textColumns === cols
                            ? 'bg-[#e3b448] text-[#091017]'
                            : 'bg-[#d5dfe6] text-[#091017] hover:bg-[#e1e8ee]'
                        }`}
                      >
                        {cols}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#091017]">
                    Lato foto
                  </label>
                  <div className="grid grid-cols-2 gap-1 p-1 rounded-md bg-[#35546e] border-2 border-[#192b3b]">
                    {(['left', 'right'] as const).map((side) => (
                      <button
                        key={side}
                        type="button"
                        onClick={() =>
                          onChangeDoc((prev) => ({
                            ...prev,
                            grid: { ...prev.grid, imagePosition: side },
                          }))
                        }
                        className={`py-1.5 text-[13px] font-bold rounded transition-colors ${
                          doc.grid.imagePosition === side
                            ? 'bg-[#e3b448] text-[#091017]'
                            : 'bg-[#d5dfe6] text-[#091017] hover:bg-[#e1e8ee]'
                        }`}
                      >
                        {side === 'left' ? 'Sinistra' : 'Destra'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="font-bold text-[#091017]">
                    Proporzione blocco foto / testo
                  </span>
                  <span className="font-bold text-[#091017] tabular-nums">
                    {doc.grid.splitRatio}% / {100 - doc.grid.splitRatio}%
                  </span>
                </div>
                <input
                  type="range"
                  min={34}
                  max={58}
                  value={doc.grid.splitRatio}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      grid: { ...prev.grid, splitRatio: Number(e.target.value) },
                    }))
                  }
                  className="w-full accent-[#73180e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#091017]">
                    Formato foto
                  </label>
                  <select
                    value={doc.grid.imageAspectRatio}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        grid: {
                          ...prev.grid,
                          imageAspectRatio: e.target.value as NewspaperDocument['grid']['imageAspectRatio'],
                        },
                      }))
                    }
                    className={SELECT_CLASS}
                  >
                    <option value="3/4">Verticale (3:4)</option>
                    <option value="1/1">Quadrata (1:1)</option>
                    <option value="4/3">Classica (4:3)</option>
                    <option value="16/9">Panoramica (16:9)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#091017]">
                    Filetti colonne
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        grid: { ...prev.grid, showColumnRules: !prev.grid.showColumnRules },
                      }))
                    }
                    className={`w-full py-2 px-3 rounded-md border-2 border-[#192b3b] text-[13px] font-bold transition-colors ${
                      doc.grid.showColumnRules
                        ? 'bg-[#e3b448] text-[#091017]'
                        : 'bg-[#d5dfe6] text-[#091017]'
                    }`}
                  >
                    {doc.grid.showColumnRules ? 'Filetti Attivi' : 'Senza Filetti'}
                  </button>
                </div>
              </div>
            </section>

            <section className={PANEL_CARD_CLASS}>
              <h2 className="text-[15px] font-bold text-[#091017]">
                Moduli & Rubriche Classiche
              </h2>

              <div className="space-y-2">
                {[
                  { key: 'showMastheadMeta' as const, label: 'Testata & Barra Edizione' },
                  { key: 'showRubrica' as const, label: 'Rubrica / Occhiello Superiore' },
                  { key: 'showSubhead' as const, label: 'Sottotitolo / Sommario' },
                  { key: 'showMainImage' as const, label: 'Immagine Principale' },
                  { key: 'showInsetPortrait' as const, label: 'Ritratto Tondo nel Testo' },
                  { key: 'showNoteBox' as const, label: 'Riquadro Nota / Appuntamento' },
                  { key: 'showPullQuote' as const, label: 'Citazione in Risalto' },
                  { key: 'showSidebarRubrica' as const, label: 'Box Rubrica Laterale' },
                  { key: 'showFooterColophon' as const, label: 'Piè di Pagina / Colophon' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between py-2.5 px-3 rounded-md bg-[#d5dfe6] border-2 border-[#192b3b] cursor-pointer hover:bg-[#e1e8ee]"
                  >
                    <span className="text-[13px] font-bold text-[#091017]">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={doc.modules[item.key]}
                      onChange={(e) =>
                        onChangeDoc((prev) => ({
                          ...prev,
                          modules: { ...prev.modules, [item.key]: e.target.checked },
                        }))
                      }
                      className="h-4 w-4 accent-[#73180e] rounded"
                    />
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#091017]">
                    Stile rubrica
                  </label>
                  <select
                    value={doc.modules.rubricaStyle}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        modules: {
                          ...prev.modules,
                          rubricaStyle: e.target.value as RubricaStyle,
                        },
                      }))
                    }
                    className={SELECT_CLASS}
                  >
                    <option value="cartiglio">Cartiglio Pieno</option>
                    <option value="filetto">Filetto Classico</option>
                    <option value="testata-doppia">Doppia Riga</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#091017]">
                    Capolettera
                  </label>
                  <select
                    value={doc.modules.dropCapStyle}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        modules: {
                          ...prev.modules,
                          dropCapStyle: e.target.value as DropCapStyle,
                        },
                      }))
                    }
                    className={SELECT_CLASS}
                  >
                    <option value="accent">Colorato Editoriale</option>
                    <option value="serif">Classico Inchiostro</option>
                    <option value="boxed">Riquadrato Pieno</option>
                    <option value="none">Disattivato</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#091017]">
                    Didascalia
                  </label>
                  <select
                    value={doc.modules.captionPlacement}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        modules: {
                          ...prev.modules,
                          captionPlacement: e.target.value as NewspaperDocument['modules']['captionPlacement'],
                        },
                      }))
                    }
                    className={SELECT_CLASS}
                  >
                    <option value="side-top">A lato in alto</option>
                    <option value="below">Sotto la foto</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#091017]">
                    Fregio finale
                  </label>
                  <select
                    value={doc.modules.ornament}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        modules: {
                          ...prev.modules,
                          ornament: e.target.value as OrnamentSymbol,
                        },
                      }))
                    }
                    className={SELECT_CLASS}
                  >
                    <option value="diamond">Rombo (❖)</option>
                    <option value="fleuron">Fiorone (❦)</option>
                    <option value="star">Stella (✦)</option>
                    <option value="cross">Croce (✠)</option>
                    <option value="none">Nessuno</option>
                  </select>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'contenuti' && (
          <>
            {/* Rubrica & Testata */}
            <section ref={setRef('rubrica')} className={PANEL_CARD_CLASS}>
              <h2 className="text-[15px] font-bold text-[#091017]">Testata & Rubrica</h2>
              {doc.modules.showMastheadMeta && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-bold text-[#091017]">
                      Nome testata
                    </label>
                    <input
                      type="text"
                      value={doc.content.mastheadTitle}
                      onChange={(e) =>
                        onChangeDoc((prev) => ({
                          ...prev,
                          content: { ...prev.content, mastheadTitle: e.target.value },
                        }))
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-bold text-[#091017]">
                      Metadati edizione (Anno, Numero, Data)
                    </label>
                    <input
                      type="text"
                      value={doc.content.mastheadMeta}
                      onChange={(e) =>
                        onChangeDoc((prev) => ({
                          ...prev,
                          content: { ...prev.content, mastheadMeta: e.target.value },
                        }))
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                </>
              )}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#091017]">
                  Etichetta rubrica / occhiello
                </label>
                <input
                  type="text"
                  value={doc.content.rubricaLabel}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      content: { ...prev.content, rubricaLabel: e.target.value },
                    }))
                  }
                  className={INPUT_CLASS}
                />
              </div>
            </section>

            {/* Titolo & Sommario */}
            <section ref={setRef('headline')} className={PANEL_CARD_CLASS}>
              <h2 className="text-[15px] font-bold text-[#091017]">Titolo & Sottotitolo</h2>
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#091017]">
                  Titolo principale
                </label>
                <textarea
                  rows={2}
                  value={doc.content.headline}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      content: { ...prev.content, headline: e.target.value },
                    }))
                  }
                  className={`${INPUT_CLASS} font-bold`}
                />
              </div>
              {doc.modules.showSubhead && (
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#091017]">
                    Sottotitolo / Sommario
                  </label>
                  <textarea
                    rows={2}
                    value={doc.content.subhead}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        content: { ...prev.content, subhead: e.target.value },
                      }))
                    }
                    className={INPUT_CLASS}
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#091017]">
                  Firma / Autore (nei modelli con testata centrata)
                </label>
                <input
                  type="text"
                  value={doc.content.byline}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      content: { ...prev.content, byline: e.target.value },
                    }))
                  }
                  className={INPUT_CLASS}
                />
              </div>
            </section>

            {/* Corpo Articolo */}
            <section ref={setRef('body')} className={PANEL_CARD_CLASS}>
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-[#091017]">Corpo dell’Articolo</h2>
                <span className="text-[13px] font-bold text-[#1d2b38] tabular-nums">
                  {doc.content.bodyText.length} caratteri
                </span>
              </div>
              <textarea
                rows={9}
                value={doc.content.bodyText}
                onChange={(e) =>
                  onChangeDoc((prev) => ({
                    ...prev,
                    content: { ...prev.content, bodyText: e.target.value },
                  }))
                }
                placeholder="Scrivi o incolla il testo dell'articolo. Usa una riga vuota per separare i paragrafi."
                className={`${INPUT_CLASS} leading-relaxed`}
              />
              {doc.modules.showPullQuote && (
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#091017]">
                    Citazione in risalto
                  </label>
                  <textarea
                    rows={2}
                    value={doc.content.pullQuote}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        content: { ...prev.content, pullQuote: e.target.value },
                      }))
                    }
                    className={INPUT_CLASS}
                  />
                </div>
              )}
            </section>

            {/* Immagine Principale */}
            <section ref={setRef('mainImage')} className={PANEL_CARD_CLASS}>
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-[#091017]">Immagine Principale</h2>
                <button
                  type="button"
                  onClick={() =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      mainImage: {
                        ...prev.mainImage,
                        src: PLACEHOLDER_MAIN_SVG,
                        objectPositionX: 50,
                        objectPositionY: 50,
                        zoom: 1,
                      },
                    }))
                  }
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#d5dfe6] border border-[#192b3b] text-[13px] font-bold text-[#091017] hover:bg-[#e3b448]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Predefinita
                </button>
              </div>

              <label className="relative overflow-hidden flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-dashed border-[#192b3b] bg-[#d5dfe6] hover:bg-[#e3b448] cursor-pointer text-sm font-bold text-[#091017] transition-colors">
                <Upload className="w-4 h-4 text-[#73180e]" />
                <span>Carica immagine personale</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onUploadImage('mainImage', file);
                    e.target.value = '';
                  }}
                />
              </label>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#091017]">Didascalia</label>
                <textarea
                  rows={2}
                  value={doc.content.mainCaption}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      content: { ...prev.content, mainCaption: e.target.value },
                    }))
                  }
                  className={INPUT_CLASS}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#091017]">
                    Filtro stampa d’epoca
                  </label>
                  <select
                    value={doc.mainImage.filter}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        mainImage: {
                          ...prev.mainImage,
                          filter: e.target.value as ImageFilterMode,
                        },
                      }))
                    }
                    className={SELECT_CLASS}
                  >
                    <option value="none">Originale</option>
                    <option value="grayscale-press">Bianco & Nero Stampa</option>
                    <option value="sepia-archive">Seppia Archivio</option>
                    <option value="halftone-ink">Inchiostro Alto Contrasto</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#091017]">
                    Zoom ({doc.mainImage.zoom.toFixed(2)}×)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={1.8}
                    step={0.05}
                    value={doc.mainImage.zoom}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        mainImage: { ...prev.mainImage, zoom: Number(e.target.value) },
                      }))
                    }
                    className="w-full accent-[#73180e] mt-2.5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[13px] font-bold text-[#091017]">
                      Inquadratura X ({doc.mainImage.objectPositionX}%)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={doc.mainImage.objectPositionX}
                      onChange={(e) => {
                        const nextX = Number(e.target.value);
                        onChangeDoc((prev) => ({
                          ...prev,
                          mainImage: {
                            ...prev.mainImage,
                            objectPositionX: nextX,
                            zoom:
                              prev.mainImage.zoom <= 1.01 && !hasNaturalHorizontalSlack
                                ? 1.2
                                : prev.mainImage.zoom,
                          },
                        }));
                      }}
                      className="w-full accent-[#73180e]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[13px] font-bold text-[#091017]">
                      Inquadratura Y ({doc.mainImage.objectPositionY}%)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={doc.mainImage.objectPositionY}
                      onChange={(e) => {
                        const nextY = Number(e.target.value);
                        onChangeDoc((prev) => ({
                          ...prev,
                          mainImage: {
                            ...prev.mainImage,
                            objectPositionY: nextY,
                            zoom:
                              prev.mainImage.zoom <= 1.01 && !hasNaturalVerticalSlack
                                ? 1.2
                                : prev.mainImage.zoom,
                          },
                        }));
                      }}
                      className="w-full accent-[#73180e]"
                    />
                  </div>
                </div>
                {(doc.mainImage.zoom > 1 ||
                  doc.mainImage.objectPositionX !== 50 ||
                  doc.mainImage.objectPositionY !== 50) && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        onChangeDoc((prev) => ({
                          ...prev,
                          mainImage: {
                            ...prev.mainImage,
                            objectPositionX: 50,
                            objectPositionY: 50,
                            zoom: 1,
                          },
                        }))
                      }
                      className="px-2.5 py-1 rounded bg-[#d5dfe6] border border-[#192b3b] text-[12px] font-bold text-[#091017] hover:bg-[#e3b448]"
                    >
                      Centra inquadratura (50% / 1×)
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Ritratto Tondo nel Testo */}
            <section ref={setRef('insetImage')} className={PANEL_CARD_CLASS}>
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-[#091017]">
                  Ritratto Tondo nel Testo
                </h2>
                <label className="flex items-center gap-2 text-[13px] font-bold text-[#091017] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doc.modules.showInsetPortrait}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        modules: { ...prev.modules, showInsetPortrait: e.target.checked },
                      }))
                    }
                    className="h-4 w-4 accent-[#73180e]"
                  />
                  <span>Attivo</span>
                </label>
              </div>

              {doc.modules.showInsetPortrait && (
                <>
                  <div className="flex items-center gap-2">
                    <label className="relative overflow-hidden flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border-2 border-dashed border-[#192b3b] bg-[#d5dfe6] hover:bg-[#e3b448] cursor-pointer text-sm font-bold text-[#091017]">
                      <Upload className="w-4 h-4 text-[#73180e]" />
                      <span>Carica foto tondo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void onUploadImage('insetImage', file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        onChangeDoc((prev) => ({
                          ...prev,
                          insetImage: { ...prev.insetImage, src: PLACEHOLDER_PORTRAIT_SVG, zoom: 1 },
                        }))
                      }
                      className="py-2.5 px-3 rounded-lg border-2 border-[#192b3b] bg-[#d5dfe6] text-[#091017] hover:bg-[#e3b448]"
                      title="Ripristina illustrazione predefinita"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-bold text-[#091017]">
                        Lato scorrimento
                      </label>
                      <div className="grid grid-cols-2 gap-1 p-1 rounded bg-[#35546e] border-2 border-[#192b3b]">
                        {(['left', 'right'] as const).map((side) => (
                          <button
                            key={side}
                            type="button"
                            onClick={() =>
                              onChangeDoc((prev) => ({
                                ...prev,
                                modules: { ...prev.modules, insetSide: side },
                              }))
                            }
                            className={`py-1.5 text-[13px] font-bold rounded ${
                              doc.modules.insetSide === side
                                ? 'bg-[#e3b448] text-[#091017]'
                                : 'bg-[#d5dfe6] text-[#091017]'
                            }`}
                          >
                            {side === 'left' ? 'Sinistra' : 'Destra'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-bold text-[#091017]">
                        Filtro
                      </label>
                      <select
                        value={doc.insetImage.filter}
                        onChange={(e) =>
                          onChangeDoc((prev) => ({
                            ...prev,
                            insetImage: {
                              ...prev.insetImage,
                              filter: e.target.value as ImageFilterMode,
                            },
                          }))
                        }
                        className={SELECT_CLASS}
                      >
                        <option value="none">Originale</option>
                        <option value="grayscale-press">B&N Stampa</option>
                        <option value="sepia-archive">Seppia</option>
                        <option value="halftone-ink">Alto Contrasto</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[13px] font-bold text-[#091017]">
                        Diametro ({doc.modules.insetSize}px)
                      </label>
                      <input
                        type="range"
                        min={72}
                        max={156}
                        value={doc.modules.insetSize}
                        onChange={(e) =>
                          onChangeDoc((prev) => ({
                            ...prev,
                            modules: { ...prev.modules, insetSize: Number(e.target.value) },
                          }))
                        }
                        className="w-full accent-[#73180e]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[13px] font-bold text-[#091017]">
                        Altezza ({doc.modules.insetOffsetTop}px)
                      </label>
                      <input
                        type="range"
                        min={16}
                        max={280}
                        value={doc.modules.insetOffsetTop}
                        onChange={(e) =>
                          onChangeDoc((prev) => ({
                            ...prev,
                            modules: {
                              ...prev.modules,
                              insetOffsetTop: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full accent-[#73180e]"
                      />
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* Riquadro Nota & Rubrica Laterale */}
            <section ref={setRef('noteBox')} className={PANEL_CARD_CLASS}>
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-[#091017]">
                  Riquadro Nota / Orari
                </h2>
                <label className="flex items-center gap-2 text-[13px] font-bold text-[#091017] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doc.modules.showNoteBox}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        modules: { ...prev.modules, showNoteBox: e.target.checked },
                      }))
                    }
                    className="h-4 w-4 accent-[#73180e]"
                  />
                  <span>Visibile</span>
                </label>
              </div>
              {doc.modules.showNoteBox && (
                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={doc.content.noteBoxEyebrow}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        content: { ...prev.content, noteBoxEyebrow: e.target.value },
                      }))
                    }
                    placeholder="Intestazione breve (es. APPUNTAMENTO)"
                    className={INPUT_CLASS}
                  />
                  <input
                    type="text"
                    value={doc.content.noteBoxTitle}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        content: { ...prev.content, noteBoxTitle: e.target.value },
                      }))
                    }
                    placeholder="Titolo riquadro"
                    className={INPUT_CLASS}
                  />
                  <textarea
                    rows={2}
                    value={doc.content.noteBoxBody}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        content: { ...prev.content, noteBoxBody: e.target.value },
                      }))
                    }
                    placeholder="Testo breve nota"
                    className={INPUT_CLASS}
                  />
                </div>
              )}
            </section>

            {doc.modules.showSidebarRubrica && (
              <section ref={setRef('sidebar')} className={PANEL_CARD_CLASS}>
                <h2 className="text-[15px] font-bold text-[#091017]">
                  Box Rubrica Laterale
                </h2>
                <input
                  type="text"
                  value={doc.content.sidebarTitle}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      content: { ...prev.content, sidebarTitle: e.target.value },
                    }))
                  }
                  className={`${INPUT_CLASS} font-bold`}
                />
                <textarea
                  rows={3}
                  value={doc.content.sidebarBody}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      content: { ...prev.content, sidebarBody: e.target.value },
                    }))
                  }
                  className={INPUT_CLASS}
                />
              </section>
            )}

            {doc.modules.showFooterColophon && (
              <section ref={setRef('footer')} className={PANEL_CARD_CLASS}>
                <h2 className="text-[15px] font-bold text-[#091017]">
                  Piè di Pagina / Colophon
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={doc.content.footerLeft}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        content: { ...prev.content, footerLeft: e.target.value },
                      }))
                    }
                    className={`col-span-2 ${INPUT_CLASS}`}
                  />
                  <input
                    type="text"
                    value={doc.content.footerRight}
                    onChange={(e) =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        content: { ...prev.content, footerRight: e.target.value },
                      }))
                    }
                    className={INPUT_CLASS}
                  />
                </div>
              </section>
            )}
          </>
        )}

        {activeTab === 'tipografia' && (
          <>
            {/* Custom Font Uploader */}
            <section className={PANEL_CARD_CLASS}>
              <div>
                <h2 className="text-[15px] font-bold text-[#091017]">
                  Carica Font Personali
                </h2>
                <p className="text-[13px] font-semibold text-[#1d2b38] mt-1 leading-snug">
                  Supporta file .ttf, .otf, .woff e .woff2. I font caricati vengono incorporati
                  anche nell’HTML esportato.
                </p>
              </div>

              <label className="relative overflow-hidden flex flex-col items-center justify-center gap-1.5 w-full py-4 px-3 rounded-lg border-2 border-dashed border-[#192b3b] bg-[#d5dfe6] hover:bg-[#e3b448] cursor-pointer text-center transition-colors">
                <Upload className="w-5 h-5 text-[#73180e]" />
                <span className="text-sm font-bold text-[#091017]">
                  Scegli uno o più file font dal dispositivo
                </span>
                <span className="text-[13px] font-bold text-[#1d2b38]">
                  TTF · OTF · WOFF · WOFF2
                </span>
                <input
                  type="file"
                  multiple
                  accept=".ttf,.otf,.woff,.woff2"
                  className="sr-only"
                  onChange={(e) => {
                    void onUploadFont(e.target.files);
                    e.target.value = '';
                  }}
                />
              </label>

              {customFonts.length > 0 && (
                <div className="space-y-2">
                  {customFonts.map((cf) => (
                    <div
                      key={cf.id}
                      className="flex items-center justify-between gap-2 p-3 rounded-md bg-[#d5dfe6] border-2 border-[#192b3b]"
                    >
                      <div className="min-w-0">
                        <div
                          className="text-[15px] font-bold text-[#091017] truncate"
                          style={{ fontFamily: `"${cf.family}", serif` }}
                        >
                          {cf.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              onChangeDoc((prev) => ({
                                ...prev,
                                typography: {
                                  ...prev.typography,
                                  headlineFont: `"${cf.family}", serif`,
                                },
                              }))
                            }
                            className="text-[13px] font-bold text-[#73180e] hover:underline"
                          >
                            Usa per Titolo
                          </button>
                          <span className="text-[#192b3b]">·</span>
                          <button
                            type="button"
                            onClick={() =>
                              onChangeDoc((prev) => ({
                                ...prev,
                                typography: {
                                  ...prev.typography,
                                  subheadFont: `"${cf.family}", serif`,
                                },
                              }))
                            }
                            className="text-[13px] font-bold text-[#73180e] hover:underline"
                          >
                            Usa per Sottotitolo
                          </button>
                          <span className="text-[#192b3b]">·</span>
                          <button
                            type="button"
                            onClick={() =>
                              onChangeDoc((prev) => ({
                                ...prev,
                                typography: {
                                  ...prev.typography,
                                  bodyFont: `"${cf.family}", serif`,
                                },
                              }))
                            }
                            className="text-[13px] font-bold text-[#091017] hover:underline"
                          >
                            Usa per Corpo
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteCustomFont(cf.id)}
                        className="p-2 text-[#091017] hover:text-[#73180e] rounded"
                        title="Rimuovi font"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Font Selectors */}
            <section className={PANEL_CARD_CLASS}>
              <h2 className="text-[15px] font-bold text-[#091017]">
                Scelta Caratteri per Ruolo
              </h2>

              {renderFontSelect('Font Titolo Principale', doc.typography.headlineFont, (val) =>
                onChangeDoc((prev) => ({
                  ...prev,
                  typography: { ...prev.typography, headlineFont: val },
                }))
              )}

              {renderFontSelect('Font Sottotitolo / Sommario', doc.typography.subheadFont, (val) =>
                onChangeDoc((prev) => ({
                  ...prev,
                  typography: { ...prev.typography, subheadFont: val },
                }))
              )}

              {renderFontSelect('Font Corpo Articolo', doc.typography.bodyFont, (val) =>
                onChangeDoc((prev) => ({
                  ...prev,
                  typography: { ...prev.typography, bodyFont: val },
                }))
              )}

              {renderFontSelect('Font Rubrica & Testata', doc.typography.rubricaFont, (val) =>
                onChangeDoc((prev) => ({
                  ...prev,
                  typography: { ...prev.typography, rubricaFont: val },
                }))
              )}

              {renderFontSelect('Font Didascalie & Note', doc.typography.captionFont, (val) =>
                onChangeDoc((prev) => ({
                  ...prev,
                  typography: { ...prev.typography, captionFont: val },
                }))
              )}
            </section>

            {/* Type Scale & Rhythm */}
            <section className={PANEL_CARD_CLASS}>
              <h2 className="text-[15px] font-bold text-[#091017]">
                Proporzioni & Leggibilità
              </h2>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="font-bold text-[#091017]">Corpo titolo</span>
                  <span className="font-bold text-[#091017] tabular-nums">
                    {doc.typography.headlineSize} px
                  </span>
                </div>
                <input
                  type="range"
                  min={26}
                  max={74}
                  value={doc.typography.headlineSize}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      typography: { ...prev.typography, headlineSize: Number(e.target.value) },
                    }))
                  }
                  className="w-full accent-[#73180e]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="font-bold text-[#091017]">Corpo sottotitolo</span>
                  <span className="font-bold text-[#091017] tabular-nums">
                    {doc.typography.subheadSize} px
                  </span>
                </div>
                <input
                  type="range"
                  min={14}
                  max={32}
                  value={doc.typography.subheadSize}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      typography: { ...prev.typography, subheadSize: Number(e.target.value) },
                    }))
                  }
                  className="w-full accent-[#73180e]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="font-bold text-[#091017]">Corpo testo articolo</span>
                  <span className="font-bold text-[#091017] tabular-nums">
                    {doc.typography.bodySize} px
                  </span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={20}
                  step={0.5}
                  value={doc.typography.bodySize}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      typography: { ...prev.typography, bodySize: Number(e.target.value) },
                    }))
                  }
                  className="w-full accent-[#73180e]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="font-bold text-[#091017]">Interlinea</span>
                  <span className="font-bold text-[#091017] tabular-nums">
                    {doc.typography.bodyLineHeight.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={1.25}
                  max={1.85}
                  step={0.02}
                  value={doc.typography.bodyLineHeight}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      typography: { ...prev.typography, bodyLineHeight: Number(e.target.value) },
                    }))
                  }
                  className="w-full accent-[#73180e]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="font-bold text-[#091017]">Crenatura titolo</span>
                  <span className="font-bold text-[#091017] tabular-nums">
                    {doc.typography.headlineLetterSpacing.toFixed(2)} em
                  </span>
                </div>
                <input
                  type="range"
                  min={-0.04}
                  max={0.12}
                  step={0.01}
                  value={doc.typography.headlineLetterSpacing}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      typography: {
                        ...prev.typography,
                        headlineLetterSpacing: Number(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-[#73180e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#091017]">
                    Allineamento
                  </label>
                  <div className="grid grid-cols-2 gap-1 p-1 rounded bg-[#35546e] border-2 border-[#192b3b]">
                    <button
                      type="button"
                      onClick={() =>
                        onChangeDoc((prev) => ({
                          ...prev,
                          typography: { ...prev.typography, textAlign: 'justify' },
                        }))
                      }
                      className={`py-1.5 text-[13px] font-bold rounded ${
                        doc.typography.textAlign === 'justify'
                          ? 'bg-[#e3b448] text-[#091017]'
                          : 'bg-[#d5dfe6] text-[#091017]'
                      }`}
                    >
                      Giustif.
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onChangeDoc((prev) => ({
                          ...prev,
                          typography: { ...prev.typography, textAlign: 'left' },
                        }))
                      }
                      className={`py-1.5 text-[13px] font-bold rounded ${
                        doc.typography.textAlign === 'left'
                          ? 'bg-[#e3b448] text-[#091017]'
                          : 'bg-[#d5dfe6] text-[#091017]'
                      }`}
                    >
                      Sinistra
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#091017]">
                    Sillabazione (IT)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      onChangeDoc((prev) => ({
                        ...prev,
                        typography: { ...prev.typography, hyphenate: !prev.typography.hyphenate },
                      }))
                    }
                    className={`w-full py-2 px-3 rounded-md border-2 border-[#192b3b] text-[13px] font-bold ${
                      doc.typography.hyphenate
                        ? 'bg-[#e3b448] text-[#091017]'
                        : 'bg-[#d5dfe6] text-[#091017]'
                    }`}
                  >
                    {doc.typography.hyphenate ? 'Attiva' : 'Disattivata'}
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'carta' && (
          <>
            <section className={PANEL_CARD_CLASS}>
              <h2 className="text-[15px] font-bold text-[#091017]">
                Tipo di Carta & Stock d’Epoca
              </h2>
              <div className="space-y-2.5">
                {PAPER_THEMES.map((theme) => {
                  const active = doc.themeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => applyTheme(theme)}
                      className={`w-full text-left flex items-center gap-3.5 p-3 rounded-lg border-2 transition-colors ${
                        active
                          ? 'bg-[#e3b448] border-[#192b3b]'
                          : 'bg-[#d5dfe6] border-[#192b3b] hover:bg-[#e1e8ee]'
                      }`}
                    >
                      <div className="flex shrink-0 rounded overflow-hidden border-2 border-[#192b3b]">
                        <span
                          className="w-6 h-10"
                          style={{ backgroundColor: theme.colors.paperBg }}
                        />
                        <span
                          className="w-3.5 h-10"
                          style={{ backgroundColor: theme.colors.headlineColor }}
                        />
                        <span
                          className="w-3.5 h-10"
                          style={{ backgroundColor: theme.colors.rubricaBg }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-[#091017]">{theme.name}</span>
                          <span className="text-[12px] font-bold text-[#73180e] shrink-0">
                            {theme.patternLabel}
                          </span>
                        </div>
                        <div className="text-[13px] font-medium text-[#1d2b38] leading-snug mt-0.5">
                          {theme.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className={PANEL_CARD_CLASS}>
              <h2 className="text-[15px] font-bold text-[#091017]">
                Personalizzazione Colori Foglio
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    { key: 'paperBg', label: 'Fondo Carta' },
                    { key: 'ink', label: 'Inchiostro Testo' },
                    { key: 'headlineColor', label: 'Colore Titolo' },
                    { key: 'rubricaBg', label: 'Sfondo Rubrica' },
                    { key: 'rubricaText', label: 'Testo Rubrica' },
                    { key: 'accentColor', label: 'Accento & Fregi' },
                    { key: 'noteBoxBg', label: 'Sfondo Box Nota' },
                    { key: 'ruleColor', label: 'Filetti & Bordi' },
                  ] as const
                ).map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-md bg-[#d5dfe6] border-2 border-[#192b3b] cursor-pointer"
                  >
                    <span className="text-[13px] font-bold text-[#091017]">{item.label}</span>
                    <input
                      type="color"
                      value={doc.colors[item.key]}
                      onChange={(e) =>
                        onChangeDoc((prev) => ({
                          ...prev,
                          themeId: 'custom',
                          colors: { ...prev.colors, [item.key]: e.target.value },
                        }))
                      }
                      className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer p-0"
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className={PANEL_CARD_CLASS}>
              <h2 className="text-[15px] font-bold text-[#091017]">
                Trama & Atmosfera Cartacea
              </h2>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#091017]">
                  Trama fisica della carta
                </label>
                <select
                  value={activePattern}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      texture: {
                        ...prev.texture,
                        paperPattern: e.target.value as PaperPatternType,
                      },
                    }))
                  }
                  className={SELECT_CLASS}
                >
                  {PAPER_PATTERN_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="font-bold text-[#091017]">Intensità trama & fibre</span>
                  <span className="font-bold text-[#091017] tabular-nums">
                    {doc.texture.grainIntensity}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={doc.texture.grainIntensity}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      texture: { ...prev.texture, grainIntensity: Number(e.target.value) },
                    }))
                  }
                  className="w-full accent-[#73180e]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="font-bold text-[#091017]">
                    Bordi leggermente invecchiati
                  </span>
                  <span className="font-bold text-[#091017] tabular-nums">
                    {doc.texture.agedEdges}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={doc.texture.agedEdges}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      texture: { ...prev.texture, agedEdges: Number(e.target.value) },
                    }))
                  }
                  className="w-full accent-[#73180e]"
                />
              </div>

              <label className="flex items-center justify-between py-2.5 px-3 rounded-md bg-[#d5dfe6] border-2 border-[#192b3b] cursor-pointer">
                <span className="text-[13px] font-bold text-[#091017]">
                  Morbidezza stampa tipografica
                </span>
                <input
                  type="checkbox"
                  checked={doc.texture.inkSoftness}
                  onChange={(e) =>
                    onChangeDoc((prev) => ({
                      ...prev,
                      texture: { ...prev.texture, inkSoftness: e.target.checked },
                    }))
                  }
                  className="h-4 w-4 accent-[#73180e]"
                />
              </label>
            </section>
          </>
        )}
      </div>
    </aside>
  );
};
