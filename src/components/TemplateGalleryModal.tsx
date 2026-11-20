import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LAYOUT_TEMPLATES } from '../data/presets';
import { LayoutTemplateId } from '../types/newspaper';
import { TemplateWireframe } from './TemplateWireframe';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTemplateId: LayoutTemplateId;
  onSelectTemplate: (templateId: LayoutTemplateId, loadSampleText: boolean) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  activeTemplateId,
  onSelectTemplate,
}) => {
  const [loadSample, setLoadSample] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#091017]/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-gallery-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-xl bg-[#35546e] border-2 border-[#192b3b] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#192b3b] bg-[#c7d5e2]">
          <div>
            <h2 id="template-gallery-title" className="text-base font-bold text-[#091017]">
              Modelli Modulari di Giornale
            </h2>
            <p className="text-[13px] font-semibold text-[#1d2b38] mt-0.5">
              Scegli un’impaginazione classica. Le tue immagini e i tuoi testi restano invariati.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md bg-[#d5dfe6] border-2 border-[#192b3b] text-[#091017] hover:bg-[#e3b448]"
            aria-label="Chiudi galleria modelli"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto studio-scroll">
          <label className="flex items-center gap-3 p-3.5 rounded-lg bg-[#d5dfe6] border-2 border-[#192b3b] cursor-pointer">
            <input
              type="checkbox"
              checked={loadSample}
              onChange={(e) => setLoadSample(e.target.checked)}
              className="h-4 w-4 accent-[#a8281c]"
            />
            <span className="text-[13px] font-bold text-[#091017]">
              Sostituisci anche titoli e testi con quelli dimostrativi del modello scelto
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {LAYOUT_TEMPLATES.map((tpl) => {
              const active = tpl.id === activeTemplateId;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    onSelectTemplate(tpl.id, loadSample);
                    onClose();
                  }}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-colors ${
                    active
                      ? 'bg-[#e3b448] border-[#192b3b]'
                      : 'bg-[#c4d6cc] border-[#192b3b] hover:bg-[#d5dfe6]'
                  }`}
                >
                  <TemplateWireframe templateId={tpl.id} active={active} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[15px] font-bold text-[#091017]">{tpl.name}</span>
                      {active && (
                        <span className="text-[13px] font-bold text-[#73180e] shrink-0">
                          Attivo
                        </span>
                      )}
                    </div>
                    <div className="text-[13px] font-bold text-[#73180e] mt-0.5">
                      {tpl.subtitle}
                    </div>
                    <p className="text-[13px] font-medium text-[#091017] leading-relaxed mt-1.5">
                      {tpl.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
