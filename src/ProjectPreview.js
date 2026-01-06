import React from 'react';
import './ProjectPreview.css';

function ProjectPreview({ url, fallbackTitle, previewImage, previewTitle }) {
  const displayTitle = previewTitle || fallbackTitle || 'Project';
  const hasPreview = previewImage || previewTitle;

  if (!hasPreview) {
    // Fallback: show just the title as a link
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="project-preview project-preview-fallback"
      >
        <div className="project-preview-content">
          <h2 className="project-preview-title">{fallbackTitle || 'Project'}</h2>
        </div>
      </a>
    );
  }

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="project-preview"
    >
      {previewImage && (
        <div className="project-preview-image">
          <img src={previewImage} alt={displayTitle} onError={(e) => e.target.style.display = 'none'} />
        </div>
      )}
      <div className="project-preview-content">
        <h2 className="project-preview-title">{displayTitle}</h2>
      </div>
    </a>
  );
}

export default ProjectPreview;

