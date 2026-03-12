import React from 'react';
import { getBreedCharacteristics, getSeverityColors } from '../api/breed';

/* ── Icons ── */
const DogIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 9c0-5-3-7-6-7s-6 2-6 7c0 5.191-3.723 9.478-9 10.6V23h30v-3.4C21.723 18.478 18 14.191 18 9Z"/><line x1="9" y1="9" x2="9" y2="9.01"/><line x1="15" y1="9" x2="15" y2="9.01"/><path d="M9 15c3 2 3 4 6 4s3-2 6-4"/>
  </svg>
);

const CatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l5 7H7l5-7z"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="M12 17c3 1.5 5 2 5 2s-1 3-5 3-5-1.5-5-3c0 0 2-.5 5-2z"/>
  </svg>
);

const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0d9488" stroke="none">
    <path d="M13 2l3.29 6.71A2 2 0 0 0 18.71 10.29L12 13l6.71 2.71A2 2 0 0 1 21 18v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 1.29-1.86L12 16l-6.71 2.71A2 2 0 0 0 3 20.57V23a2 2 0 0 1-2 2H3z"/>
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const getAnimalIcon = (animalType) => {
  if (!animalType) return null;
  const type = animalType.toLowerCase();
  if (type.includes('dog') || type.includes('canine')) return <DogIcon />;
  if (type.includes('cat') || type.includes('feline')) return <CatIcon />;
  return <DogIcon />;
};

const BreedIdentificationReport = ({ analysis, post = null }) => {
  if (!analysis || !analysis.animal_type) {
    return null;
  }

  const breed = analysis.breed || 'Unknown';
  const animalType = analysis.animal_type || 'Animal';
  const injurySeverity = analysis.injury_severity || null;
  const characteristics = getBreedCharacteristics(analysis);
  const severityColor = getSeverityColors(injurySeverity);

  return (
    <div className="breed-report-card">
      {/* Header Section */}
      <div className="breed-report-header">
        <div className="breed-report-icon-wrap">
          {getAnimalIcon(animalType)}
        </div>
        <div className="breed-report-title-wrap">
          <h3 className="breed-report-title">Breed Identification Report</h3>
          <p className="breed-report-subtitle">AI Analysis via Gemini Vision</p>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="breed-report-grid">
        
        {/* Animal Type Card */}
        <div className="breed-info-card">
          <p className="breed-info-label">Animal Type</p>
          <div className="breed-info-value-wrap">
            <p className="breed-info-value">{animalType}</p>
          </div>
        </div>

        {/* Breed Card */}
        <div className="breed-info-card breed-info-primary">
          <p className="breed-info-label">Identified Breed</p>
          <div className="breed-info-value-wrap">
            <p className="breed-info-value-large">{breed}</p>
            <p className="breed-info-category">{characteristics.category}</p>
          </div>
        </div>

        {/* Injury Severity Card */}
        {injurySeverity && (
          <div className="breed-info-card">
            <p className="breed-info-label">Injury Assessment</p>
            <div className="breed-severity-badge" style={severityColor}>
              {injurySeverity === 'Critical' && <AlertCircleIcon />}
              {injurySeverity === 'Minor' && <CheckCircleIcon />}
              <span>{injurySeverity}</span>
            </div>
          </div>
        )}
      </div>

      {/* Characteristics Section */}
      <div className="breed-characteristics">
        <p className="breed-char-title">Breed Characteristics</p>
        <div className="breed-char-grid">
          <div className="breed-char-item">
            <span className="breed-char-label">Category</span>
            <span className="breed-char-value">{characteristics.category}</span>
          </div>
          <div className="breed-char-item">
            <span className="breed-char-label">Temperament</span>
            <span className="breed-char-value">{characteristics.temperament}</span>
          </div>
          <div className="breed-char-item">
            <span className="breed-char-label">Typical Size</span>
            <span className="breed-char-value">{characteristics.size}</span>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="breed-report-actions">
        <div className="breed-action-item">
          <div className="breed-action-icon">
            <SparklesIcon />
          </div>
          <div className="breed-action-text">
            <p className="breed-action-title">Nearby Responders</p>
            <p className="breed-action-desc">Matched rescuers in your area</p>
          </div>
        </div>
        <div className="breed-action-item">
          <div className="breed-action-icon">
            <CheckCircleIcon />
          </div>
          <div className="breed-action-text">
            <p className="breed-action-title">Reference Info</p>
            <p className="breed-action-desc">Share breed details with rescuers</p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <p className="breed-report-note">
        This report is generated by AI analysis of the uploaded photo. For accurate medical assessment, please consult with a veterinary professional.
      </p>
    </div>
  );
};

export default BreedIdentificationReport;
