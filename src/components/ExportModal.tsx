import React, { useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  Download,
  FileCode,
  Image as ImageIcon,
  Printer,
  X,
} from 'lucide-react';
import { CustomFont, NewspaperDocument } from '../types/newspaper';
import {
  downloadStandaloneHtml,
  exportNewspaperImage,
  generateStandaloneHtml,
} from '../utils/exportEngine';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheetRef: React.RefObject<HTMLDivElement | null>;
  doc: NewspaperDocument;
  customFonts: CustomFont[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  sheetRef,
  doc,
  customFonts,
}) => {
  const [pixelRatio, setPixelRatio] = useState<2 | 3>(2);
  const [exporting, setExporting] = useState<'png' | 'jpeg' | null>(null);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageExport = async (format: 'png' | 'jpeg') => {
    if (!sheetRef.current) return;
    setErrorMessage(null);
    setExporting(format);
    try {
      await exportNewspaperImage(sheetRef.current, doc, format, pixelRatio);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? `Esportazione non riuscita: ${err.message}`
          : 'Errore durante la generazione dell’immagine.'
      );
    } finally {
      setExporting(null);
    }
  };

  const handleHtmlDownload = () => {
    if (!sheetRef.current) return;
    setErrorMessage(null);
    downloadStandaloneHtml(sheetRef.current, doc, customFonts);
  };

  const handleCopyHtml = async () => {
    if (!sheetRef.current) return;
    setErrorMessage(null);
    try {
      const html = generateStandaloneHtml(sheetRef.current, doc, customFonts);
      await navigator.clipboard.writeText(html);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2200);
    } catch {
      setErrorMessage('Impossibile copiare negli appunti. Usa Scarica .HTML.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#091017]/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl bg-[#35546e] border-2 border-[#192b3b] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#192b3b] bg-[#c7d5e2]">
          <div>
            <h2 id="export-modal-title" className="text-base font-bold text-[#091017]">
              Esporta Pagina Giornale
            </h2>
            <p className="text-[13px] font-semibold text-[#1d2b38] mt-0.5">
              Scarica la pagina impaginata come immagine ad alta risoluzione o codice HTML autonomo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md bg-[#d5dfe6] border-2 border-[#192b3b] text-[#091017] hover:bg-[#e3b448]"
            aria-label="Chiudi finestra esportazione"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-md bg-[#f2c6c2] border-2 border-[#a8281c] text-[13px] font-bold text-[#520f08]">
              {errorMessage}
            </div>
          )}

          {/* Image Export Block */}
          <div className="p-4 rounded-xl bg-[#c4d6cc] border-2 border-[#192b3b] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#a8281c]" />
                <span className="text-sm font-bold text-[#091017]">
                  Esporta come Immagine
                </span>
              </div>
              <div className="flex items-center gap-1 p-1 rounded-md bg-[#35546e] border-2 border-[#192b3b] text-[13px]">
                <button
                  type="button"
                  onClick={() => setPixelRatio(2)}
                  className={`px-3 py-1 rounded font-bold ${
                    pixelRatio === 2 ? 'bg-[#e3b448] text-[#091017]' : 'bg-[#d5dfe6] text-[#091017]'
                  }`}
                >
                  2× HD
                </button>
                <button
                  type="button"
                  onClick={() => setPixelRatio(3)}
                  className={`px-3 py-1 rounded font-bold ${
                    pixelRatio === 3 ? 'bg-[#e3b448] text-[#091017]' : 'bg-[#d5dfe6] text-[#091017]'
                  }`}
                >
                  3× Stampa
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={exporting !== null}
                onClick={() => void handleImageExport('png')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#a8281c] border-2 border-[#192b3b] text-[#f5f1e8] text-sm font-bold hover:bg-[#8c2015] disabled:opacity-60 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{exporting === 'png' ? 'Generazione...' : 'Scarica PNG'}</span>
              </button>

              <button
                type="button"
                disabled={exporting !== null}
                onClick={() => void handleImageExport('jpeg')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#d5dfe6] border-2 border-[#192b3b] text-[#091017] text-sm font-bold hover:bg-[#e3b448] disabled:opacity-60 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{exporting === 'jpeg' ? 'Generazione...' : 'Scarica JPG'}</span>
              </button>
            </div>
          </div>

          {/* HTML Export Block */}
          <div className="p-4 rounded-xl bg-[#c4d6cc] border-2 border-[#192b3b] space-y-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#a8281c]" />
              <span className="text-sm font-bold text-[#091017]">
                Esporta come HTML Completo
              </span>
            </div>
            <p className="text-[13px] font-medium text-[#091017] leading-relaxed">
              Genera un singolo file <code className="text-[#091017] font-bold font-mono">.html</code>{' '}
              autonomo con stili CSS, griglia responsiva, regole di stampa, immagini e font personali
              incorporati.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleHtmlDownload}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#e3b448] border-2 border-[#192b3b] text-[#091017] text-sm font-bold hover:bg-[#d1a239] transition-colors"
              >
                <Code2 className="w-4 h-4" />
                <span>Scarica .HTML</span>
              </button>

              <button
                type="button"
                onClick={() => void handleCopyHtml()}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#d5dfe6] border-2 border-[#192b3b] text-[#091017] text-sm font-bold hover:bg-[#e3b448] transition-colors"
              >
                {copiedHtml ? (
                  <>
                    <Check className="w-4 h-4 text-[#114d26]" />
                    <span>HTML Copiato</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copia Codice HTML</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Print Action */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#c4d6cc] border-2 border-[#192b3b]">
            <span className="text-[13px] font-bold text-[#091017]">
              Oppure stampa direttamente o salva come PDF dal browser
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                setTimeout(() => window.print(), 150);
              }}
              className="inline-flex items-center gap-2 py-2 px-3.5 rounded-md border-2 border-[#192b3b] bg-[#d5dfe6] text-[13px] font-bold text-[#091017] hover:bg-[#e3b448] whitespace-nowrap shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>Stampa / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
