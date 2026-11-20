import React from 'react';
import { LayoutTemplateId } from '../types/newspaper';

interface TemplateWireframeProps {
  templateId: LayoutTemplateId;
  active?: boolean;
}

export const TemplateWireframe: React.FC<TemplateWireframeProps> = ({
  templateId,
  active = false,
}) => {
  const stroke = active ? '#73180e' : '#1d2b38';
  const fillMuted = active ? 'rgba(115, 24, 14, 0.2)' : 'rgba(29, 43, 56, 0.16)';
  const fillAccent = active ? '#73180e' : '#091017';

  return (
    <svg
      viewBox="0 0 80 108"
      className="w-14 h-[76px] shrink-0 rounded-md border-2 border-[#192b3b] bg-[#d5dfe6]"
      aria-hidden="true"
    >
      {templateId === 'rotocalco-classico' && (
        <>
          <rect x="8" y="8" width="34" height="6" rx="2" fill={fillAccent} />
          <rect x="8" y="18" width="64" height="9" fill={fillAccent} opacity="0.92" />
          <rect x="8" y="30" width="54" height="4" fill={stroke} opacity="0.6" />
          <rect x="8" y="40" width="22" height="36" fill={fillMuted} stroke={stroke} strokeWidth="0.9" />
          <rect x="32" y="40" width="9" height="12" fill={stroke} opacity="0.45" />
          <rect x="24" y="65" width="14" height="10" rx="1" fill={fillAccent} opacity="0.7" />
          <line x1="45" y1="42" x2="72" y2="42" stroke={stroke} strokeWidth="1.3" />
          <line x1="45" y1="47" x2="72" y2="47" stroke={stroke} strokeWidth="1.3" />
          <line x1="45" y1="52" x2="72" y2="52" stroke={stroke} strokeWidth="1.3" />
          <circle cx="66" cy="64" r="6" fill={fillMuted} stroke={stroke} strokeWidth="0.9" />
          <line x1="45" y1="57" x2="58" y2="57" stroke={stroke} strokeWidth="1.3" />
          <line x1="45" y1="62" x2="58" y2="62" stroke={stroke} strokeWidth="1.3" />
          <line x1="45" y1="67" x2="58" y2="67" stroke={stroke} strokeWidth="1.3" />
          <line x1="45" y1="74" x2="72" y2="74" stroke={stroke} strokeWidth="1.3" />
          <line x1="45" y1="79" x2="72" y2="79" stroke={stroke} strokeWidth="1.3" />
        </>
      )}

      {templateId === 'prima-pagina' && (
        <>
          <rect x="16" y="7" width="48" height="5" fill={fillAccent} />
          <line x1="8" y1="15" x2="72" y2="15" stroke={stroke} strokeWidth="0.9" />
          <rect x="12" y="19" width="56" height="8" fill={fillAccent} opacity="0.92" />
          <rect x="8" y="32" width="64" height="22" fill={fillMuted} stroke={stroke} strokeWidth="0.9" />
          <line x1="29" y1="59" x2="29" y2="96" stroke={stroke} strokeWidth="0.7" opacity="0.6" />
          <line x1="51" y1="59" x2="51" y2="96" stroke={stroke} strokeWidth="0.7" opacity="0.6" />
          {[60, 66, 72, 78, 84, 90].map((y) => (
            <React.Fragment key={y}>
              <line x1="8" y1={y} x2="26" y2={y} stroke={stroke} strokeWidth="1.2" />
              <line x1="32" y1={y} x2="48" y2={y} stroke={stroke} strokeWidth="1.2" />
              <line x1="54" y1={y} x2="72" y2={y} stroke={stroke} strokeWidth="1.2" />
            </React.Fragment>
          ))}
        </>
      )}

      {templateId === 'cronaca-rubrica' && (
        <>
          <line x1="8" y1="12" x2="72" y2="12" stroke={fillAccent} strokeWidth="1.6" />
          <rect x="8" y="16" width="64" height="8" fill={fillAccent} opacity="0.92" />
          <rect x="8" y="29" width="42" height="22" fill={fillMuted} stroke={stroke} strokeWidth="0.9" />
          {[56, 62, 68, 74, 80, 86, 92].map((y) => (
            <React.Fragment key={y}>
              <line x1="8" y1={y} x2="27" y2={y} stroke={stroke} strokeWidth="1.2" />
              <line x1="31" y1={y} x2="50" y2={y} stroke={stroke} strokeWidth="1.2" />
            </React.Fragment>
          ))}
          <line x1="54" y1="29" x2="54" y2="96" stroke={stroke} strokeWidth="0.8" />
          <rect x="57" y="29" width="15" height="36" fill={fillMuted} stroke={stroke} strokeWidth="0.9" />
          <rect x="57" y="70" width="15" height="20" rx="1" fill={fillAccent} opacity="0.4" />
        </>
      )}

      {templateId === 'foglio-letterario' && (
        <>
          <line x1="12" y1="11" x2="68" y2="11" stroke={stroke} strokeWidth="1.1" />
          <line x1="12" y1="13.5" x2="68" y2="13.5" stroke={stroke} strokeWidth="0.6" />
          <rect x="14" y="18" width="52" height="7" fill={fillAccent} opacity="0.92" />
          <rect x="12" y="31" width="56" height="24" fill={fillMuted} stroke={stroke} strokeWidth="0.9" />
          {[62, 68, 74, 80, 86, 92].map((y) => (
            <React.Fragment key={y}>
              <line x1="12" y1={y} x2="38" y2={y} stroke={stroke} strokeWidth="1.2" />
              <line x1="42" y1={y} x2="68" y2={y} stroke={stroke} strokeWidth="1.2" />
            </React.Fragment>
          ))}
        </>
      )}

      {templateId === 'gazzetta-illustrata' && (
        <>
          <rect x="8" y="8" width="28" height="5" fill={fillAccent} />
          <rect x="8" y="16" width="64" height="8" fill={fillAccent} opacity="0.92" />
          <rect x="46" y="30" width="26" height="38" fill={fillMuted} stroke={stroke} strokeWidth="0.9" />
          <circle cx="16" cy="48" r="6" fill={fillMuted} stroke={stroke} strokeWidth="0.9" />
          {[32, 38, 44, 50, 56, 62, 68, 74, 80].map((y) => (
            <line
              key={y}
              x1={y >= 42 && y <= 55 ? 25 : 8}
              y1={y}
              x2="42"
              y2={y}
              stroke={stroke}
              strokeWidth="1.2"
            />
          ))}
          <rect x="46" y="72" width="26" height="16" fill={fillMuted} stroke={stroke} strokeWidth="0.9" />
        </>
      )}
    </svg>
  );
};
