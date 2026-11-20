import React from 'react';
import {
  CustomFont,
  FocusSection,
  NewspaperDocument,
  OrnamentSymbol,
} from '../types/newspaper';
import { generateNewspaperCss, getImageFilterCss } from '../utils/newspaperCss';

interface NewspaperSheetProps {
  doc: NewspaperDocument;
  customFonts: CustomFont[];
  showGridGuides?: boolean;
  interactive?: boolean;
  activeFocus?: FocusSection;
  onFocusSection?: (section: FocusSection) => void;
  sheetRef?: React.RefObject<HTMLDivElement | null>;
}

const ORNAMENT_MAP: Record<OrnamentSymbol, string> = {
  diamond: '❖',
  fleuron: '❦',
  star: '✦',
  cross: '✠',
  none: '',
};

export const NewspaperSheet: React.FC<NewspaperSheetProps> = ({
  doc,
  customFonts,
  showGridGuides = false,
  interactive = false,
  activeFocus = null,
  onFocusSection,
  sheetRef,
}) => {
  const cssString = React.useMemo(
    () => generateNewspaperCss(doc, customFonts),
    [doc, customFonts]
  );

  const { content, modules, grid, mainImage, insetImage, templateId } = doc;
  const paragraphs = React.useMemo(
    () =>
      content.bodyText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
    [content.bodyText]
  );

  const aspectClass =
    grid.imageAspectRatio === '3/4'
      ? 'gs-photo-frame--3-4'
      : grid.imageAspectRatio === '1/1'
        ? 'gs-photo-frame--1-1'
        : grid.imageAspectRatio === '4/3'
          ? 'gs-photo-frame--4-3'
          : 'gs-photo-frame--16-9';

  const dropCapClass =
    modules.dropCapStyle === 'serif'
      ? 'gs-dropcap--serif'
      : modules.dropCapStyle === 'accent'
        ? 'gs-dropcap--accent'
        : modules.dropCapStyle === 'boxed'
          ? 'gs-dropcap--boxed'
          : '';

  const ornamentChar = ORNAMENT_MAP[modules.ornament];

  const isCenteredHeader =
    templateId === 'prima-pagina' || templateId === 'foglio-letterario';

  const isWideStackedMedia =
    (templateId === 'prima-pagina' || templateId === 'foglio-letterario') &&
    (grid.imageAspectRatio === '16/9' || grid.imageAspectRatio === '4/3');

  const clickableProps = (section: FocusSection) =>
    interactive && onFocusSection
      ? {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onFocusSection(section);
          },
          style: {
            cursor: 'pointer',
            outline:
              activeFocus === section ? '1.5px dashed rgba(140, 45, 25, 0.7)' : undefined,
            outlineOffset: activeFocus === section ? '3px' : undefined,
          } as React.CSSProperties,
          title: 'Clicca per modificare questa sezione',
        }
      : {};

  const renderMainMediaModule = () => {
    if (!modules.showMainImage) return null;

    const photoEl = (
      <div
        className={`gs-photo-frame ${aspectClass}`}
        {...clickableProps('mainImage')}
      >
        <img
          src={mainImage.src}
          alt={mainImage.alt || 'Immagine articolo'}
          className="gs-photo-img"
          referrerPolicy="no-referrer"
          style={{
            objectPosition: `${mainImage.objectPositionX}% ${mainImage.objectPositionY}%`,
            transformOrigin: `${mainImage.objectPositionX}% ${mainImage.objectPositionY}%`,
            transform: `scale(${mainImage.zoom})`,
            filter: getImageFilterCss(mainImage.filter),
          }}
        />
      </div>
    );

    const captionEl = content.mainCaption.trim() ? (
      <p
        className={`gs-caption ${
          modules.captionPlacement === 'side-top' && !isWideStackedMedia
            ? grid.imagePosition === 'left'
              ? 'gs-caption--side'
              : 'gs-caption--side-left'
            : 'gs-caption--below'
        }`}
        {...clickableProps('mainImage')}
      >
        {content.mainCaption}
      </p>
    ) : null;

    const noteBoxEl = modules.showNoteBox ? (
      <div
        className={`gs-note-box ${
          modules.captionPlacement === 'side-top' && !isWideStackedMedia
            ? 'gs-note-box--overlay-corner'
            : 'gs-note-box--corner'
        }`}
        {...clickableProps('noteBox')}
      >
        {content.noteBoxEyebrow && (
          <div className="gs-note-eyebrow">{content.noteBoxEyebrow}</div>
        )}
        {content.noteBoxTitle && (
          <div className="gs-note-title">{content.noteBoxTitle}</div>
        )}
        {content.noteBoxBody && (
          <div className="gs-note-body">{content.noteBoxBody}</div>
        )}
      </div>
    ) : null;

    if (modules.captionPlacement === 'side-top' && !isWideStackedMedia) {
      return (
        <div className="gs-media-module">
          <div
            className={`gs-media-side-wrap ${
              grid.imagePosition === 'left'
                ? 'gs-media-side-wrap--left'
                : 'gs-media-side-wrap--right'
            }`}
          >
            {grid.imagePosition === 'left' ? (
              <>
                {photoEl}
                <div>{captionEl}</div>
              </>
            ) : (
              <>
                <div>{captionEl}</div>
                {photoEl}
              </>
            )}
          </div>
          {noteBoxEl}
        </div>
      );
    }

    return (
      <div className="gs-media-module">
        {photoEl}
        {captionEl}
        {noteBoxEl}
      </div>
    );
  };

  const renderInsetPortraitNodes = () =>
    modules.showInsetPortrait ? (
      <>
        <span className="gs-inset-spacer" aria-hidden="true" />
        <span
          className="gs-inset-circle"
          onClick={(e) => {
            if (interactive && onFocusSection) {
              e.stopPropagation();
              onFocusSection('insetImage');
            }
          }}
          style={{
            cursor: interactive ? 'pointer' : undefined,
            outline:
              interactive && activeFocus === 'insetImage'
                ? '2px dashed rgba(140, 45, 25, 0.8)'
                : undefined,
          }}
        >
          <img
            src={insetImage.src}
            alt={insetImage.alt || 'Ritratto nel tondo'}
            referrerPolicy="no-referrer"
            style={{
              objectPosition: `${insetImage.objectPositionX}% ${insetImage.objectPositionY}%`,
              transformOrigin: `${insetImage.objectPositionX}% ${insetImage.objectPositionY}%`,
              transform: `scale(${insetImage.zoom})`,
              filter: getImageFilterCss(insetImage.filter),
            }}
          />
        </span>
      </>
    ) : null;

  const renderProseColumn = () => {
    const firstBatchCount = modules.showPullQuote && paragraphs.length > 1 ? 1 : paragraphs.length;
    const firstParagraphs = paragraphs.slice(0, firstBatchCount);
    const remainingParagraphs = paragraphs.slice(firstBatchCount);

    return (
      <div className="gs-article-column">
        <div
          className={`gs-prose ${dropCapClass}`}
          lang="it"
          {...clickableProps('body')}
        >
          {firstParagraphs.length === 0 && renderInsetPortraitNodes()}

          {firstParagraphs.map((para, idx) => {
            const isVeryLast =
              remainingParagraphs.length === 0 && idx === firstParagraphs.length - 1;
            const useDropCap = idx === 0 && modules.dropCapStyle !== 'none';
            const isShortFirstLine = para.length < 65;
            const match = useDropCap ? para.match(/^([«"“‘(]?[^\s])([\s\S]*)$/u) : null;

            return (
              <p
                key={`p1-${idx}`}
                className={
                  useDropCap && match && !isShortFirstLine ? 'gs-has-dropcap' : undefined
                }
              >
                {useDropCap && match ? (
                  <>
                    <span
                      className={
                        isShortFirstLine ? 'gs-dropcap-inline' : 'gs-dropcap-glyph'
                      }
                    >
                      {match[1]}
                    </span>
                    {idx === 0 && renderInsetPortraitNodes()}
                    {match[2]}
                  </>
                ) : (
                  <>
                    {idx === 0 && renderInsetPortraitNodes()}
                    {para}
                  </>
                )}
                {isVeryLast && ornamentChar && (
                  <span className="gs-ornament" aria-hidden="true">
                    {ornamentChar}
                  </span>
                )}
              </p>
            );
          })}

          {modules.showPullQuote && content.pullQuote.trim() && (
            <blockquote className="gs-pull-quote">{content.pullQuote}</blockquote>
          )}

          {remainingParagraphs.map((para, idx) => {
            const isVeryLast = idx === remainingParagraphs.length - 1;
            return (
              <p key={`p2-${idx}`}>
                {para}
                {isVeryLast && ornamentChar && (
                  <span className="gs-ornament" aria-hidden="true">
                    {ornamentChar}
                  </span>
                )}
              </p>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    if (!modules.showSidebarRubrica) return null;
    return (
      <aside className="gs-sidebar" {...clickableProps('sidebar')}>
        <div className="gs-sidebar-box">
          <h3 className="gs-sidebar-title">{content.sidebarTitle}</h3>
          <p className="gs-sidebar-body">{content.sidebarBody}</p>
        </div>
        {modules.showNoteBox && templateId === 'cronaca-rubrica' && (
          <div className="gs-note-box" {...clickableProps('noteBox')}>
            {content.noteBoxEyebrow && (
              <div className="gs-note-eyebrow">{content.noteBoxEyebrow}</div>
            )}
            {content.noteBoxTitle && (
              <div className="gs-note-title">{content.noteBoxTitle}</div>
            )}
            {content.noteBoxBody && (
              <div className="gs-note-body">{content.noteBoxBody}</div>
            )}
          </div>
        )}
      </aside>
    );
  };

  const renderBodyLayout = () => {
    // 1. Stacked wide media (Prima Pagina / Foglio Letterario with landscape image)
    if (isWideStackedMedia) {
      return (
        <div
          className={`gs-body-grid ${
            modules.showSidebarRubrica ? 'gs-body-grid--with-sidebar' : 'gs-body-grid--stacked'
          }`}
        >
          <div>
            {modules.showMainImage && (
              <div className="gs-lead-banner-photo">{renderMainMediaModule()}</div>
            )}
            {renderProseColumn()}
          </div>
          {renderSidebar()}
        </div>
      );
    }

    // 2. Cronaca & Rubrica with dedicated right sidebar
    if (templateId === 'cronaca-rubrica' && modules.showSidebarRubrica) {
      return (
        <div className="gs-body-grid gs-body-grid--with-sidebar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {renderMainMediaModule()}
            {renderProseColumn()}
          </div>
          {renderSidebar()}
        </div>
      );
    }

    // 3. No main image at all -> full prose (+ optional sidebar)
    if (!modules.showMainImage) {
      return (
        <div
          className={`gs-body-grid ${
            modules.showSidebarRubrica ? 'gs-body-grid--with-sidebar' : 'gs-body-grid--stacked'
          }`}
        >
          {renderProseColumn()}
          {renderSidebar()}
        </div>
      );
    }

    // 4. Classic asymmetric 2-column split (Rotocalco Classico, Gazzetta Illustrata, etc.)
    const mediaCol = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {renderMainMediaModule()}
        {modules.showSidebarRubrica && (
          <div className="gs-sidebar-box" {...clickableProps('sidebar')}>
            <h3 className="gs-sidebar-title">{content.sidebarTitle}</h3>
            <p className="gs-sidebar-body">{content.sidebarBody}</p>
          </div>
        )}
      </div>
    );

    return (
      <div
        className={`gs-body-grid ${
          grid.imagePosition === 'left'
            ? 'gs-body-grid--split-left'
            : 'gs-body-grid--split-right'
        }`}
      >
        {grid.imagePosition === 'left' ? (
          <>
            {mediaCol}
            {renderProseColumn()}
          </>
        ) : (
          <>
            {renderProseColumn()}
            {mediaCol}
          </>
        )}
      </div>
    );
  };

  return (
    <div
      ref={sheetRef}
      className="gs-sheet"
      onClick={() => {
        if (interactive && onFocusSection) onFocusSection(null);
      }}
    >
      <style>{cssString}</style>

      {/* Vintage Paper Grain & Aged Vignette */}
      {doc.texture.grainIntensity > 0 && <div className="gs-paper-grain" aria-hidden="true" />}
      {doc.texture.agedEdges > 0 && <div className="gs-paper-vignette" aria-hidden="true" />}

      {/* Blueprint Grid Guides Overlay (Editor Only, never exported) */}
      {showGridGuides && (
        <div
          data-no-export="true"
          style={{
            position: 'absolute',
            inset: `${Math.round((grid.marginMm / 25.4) * 96 * 0.72)}px`,
            border: '1px dashed rgba(37, 99, 235, 0.45)',
            pointerEvents: 'none',
            zIndex: 30,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -16,
              left: 0,
              fontSize: '9px',
              fontFamily: 'monospace',
              color: 'rgba(37, 99, 235, 0.85)',
              backgroundColor: 'rgba(255,255,255,0.85)',
              padding: '1px 4px',
            }}
          >
            MARGINE {grid.marginMm}mm · SPLIT {grid.splitRatio}/{100 - grid.splitRatio} · {grid.textColumns} COL.
          </div>
        </div>
      )}

      <article className="gs-sheet-inner">
        <header className="gs-header">
          {modules.showMastheadMeta && (
            <div {...clickableProps('rubrica')}>
              <h2 className="gs-masthead-title">{content.mastheadTitle}</h2>
              <div className="gs-masthead-meta">
                <span>{content.mastheadMeta}</span>
                <span>{content.footerRight}</span>
              </div>
            </div>
          )}

          {modules.showRubrica && content.rubricaLabel.trim() && (
            <div className="gs-rubrica-wrap" {...clickableProps('rubrica')}>
              {modules.rubricaStyle === 'cartiglio' && (
                <span className="gs-rubrica-cartiglio">{content.rubricaLabel}</span>
              )}
              {modules.rubricaStyle === 'filetto' && (
                <div className="gs-rubrica-filetto">
                  <span>{content.rubricaLabel}</span>
                </div>
              )}
              {modules.rubricaStyle === 'testata-doppia' && (
                <div className="gs-rubrica-testata-doppia">{content.rubricaLabel}</div>
              )}
            </div>
          )}

          <h1
            className={`gs-headline ${isCenteredHeader ? 'gs-headline--centered' : ''}`}
            {...clickableProps('headline')}
          >
            {content.headline}
          </h1>

          {modules.showSubhead && content.subhead.trim() && (
            <p
              className={`gs-subhead ${isCenteredHeader ? 'gs-subhead--centered' : ''}`}
              {...clickableProps('headline')}
            >
              {content.subhead}
            </p>
          )}

          {content.byline.trim() && isCenteredHeader && (
            <div className="gs-byline" style={{ textAlign: 'center' }} {...clickableProps('headline')}>
              {content.byline}
            </div>
          )}
        </header>

        {renderBodyLayout()}

        {modules.showFooterColophon && (
          <footer className="gs-footer" {...clickableProps('footer')}>
            <span>{content.footerLeft}</span>
            <span>{content.footerRight}</span>
          </footer>
        )}
      </article>
    </div>
  );
};
